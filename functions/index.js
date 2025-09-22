const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const randomUUID = require("crypto").randomUUID;
const StandardCheckoutClient = require("pg-sdk-node").StandardCheckoutClient;
const StandardCheckoutPayRequest =
  require("pg-sdk-node").StandardCheckoutPayRequest;
const Env = require("pg-sdk-node").Env;
dotenv.config();

const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

// Initialize Express app
const app = express();
app.use(express.json());

// ✅ Allow only your domains
app.use(
    cors({
      origin: [
        "https://t1234-5baa6.web.app", // Firebase hosting
        "http://localhost:5173", // Local dev
        "https://theater-food.life", // Custom domain
      ],
    }),
);

// Environment variables
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const clientVersion = 1;
const env = Env.PRODUCTION; // Change to Env.SANDBOX for testing

// Initialize PhonePe client
const client = StandardCheckoutClient.getInstance(
    clientId,
    clientSecret,
    clientVersion,
    env,
);

// ✅ Create order
app.post("/create-order", async (req, res) => {
  try {
    const {data} = req.body;

    if (!data || !data.amount) {
      return res.status(400).json({
        error: "Amount is required in the 'data' object",
      });
    }

    const finalAmount = data.amount * 100;
    const merchantOrderId = randomUUID();
    const redirectUrl = `https://theater-food.life/order-confirmation?merchantOrderId=${merchantOrderId}`;

    const request = StandardCheckoutPayRequest.builder()
        .merchantOrderId(merchantOrderId)
        .amount(finalAmount)
        .redirectUrl(redirectUrl)
        .build();

    const response = await client.pay(request);

    return res.json({
      checkoutPageUrl: response.redirectUrl,
      merchantOrderId,
      success: true,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({message: "Error creating order", success: false});
  }
});

// ✅ Check order status
app.get("/check-status", async (req, res) => {
  try {
    const {merchantOrderId} = req.query;

    if (!merchantOrderId) {
      return res.status(400).send("MerchantOrderId is required");
    }

    const response = await client.getOrderStatus(merchantOrderId);
    return res.json({status: response.state});
  } catch (error) {
    console.error("Error getting status:", error);
    res.status(500).send("Error getting status");
  }
});

// ✅ PhonePe Webhook Endpoint
app.post("/webhook/phonepe", async (req, res) => {
  try {
    const event = req.body;

    console.log("📩 PhonePe Webhook received:", event);

    const eventType = event.event;
    const state = event.payload && event.payload.state || "UNKNOWN";
    const merchantOrderId = event.payload && event.payload.merchantOrderId;

    if (
      eventType === "pg.order.completed" ||
      eventType === "checkout.order.completed" ||
      state === "COMPLETED"
    ) {
      console.log(`🔔 Payment completed for Order ID: 
        ${merchantOrderId}, Status: ${state}`);

      if (merchantOrderId) {
        const ordersRef = db.collection("orders");
        const snapshot = await ordersRef.
            where("merchantOrderId", "==", merchantOrderId).get();

        snapshot.forEach(async (orderDoc) => {
          await ordersRef.doc(orderDoc.id).update({paymentStatus: "paid"});
        });

        console.log(`✅ Order ${merchantOrderId} marked as paid via webhook`);
      }
    }

    res.status(200).json({success: true});
  } catch (err) {
    console.error("❌ Webhook error:", err);
    res.status(500).json({success: false});
  }
});

// ✅ Root route
app.get("/", (req, res) => {
  res.send("PhonePe Payment Gateway Backend is running.");
});
exports.api = functions.https.onRequest(app);
