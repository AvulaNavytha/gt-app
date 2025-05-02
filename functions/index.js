/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
const functions = require("firebase-functions");

// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.app = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const randomUUID = require("crypto").randomUUID;
// import { randomUUID } from "crypto";
const StandardCheckoutClient = require("pg-sdk-node").StandardCheckoutClient;
const StandardCheckoutPayRequest = require("pg-sdk-node").StandardCheckoutPayRequest;
const Env = require("pg-sdk-node").Env;
// import {
//   StandardCheckoutPayRequest,
//   Env,
//   StandardCheckoutClient,
// } from "pg-sdk-node";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const clientVersion = 1;
// const env = Env.SANDBOX;
const env = Env.PRODUCTION;

const client = StandardCheckoutClient.getInstance(
  clientId,
  clientSecret,
  clientVersion,
  env
);

app.post("/create-order", async (req, res) => {
  try {
    const { data } = req.body;

    if (!data || !data.amount) {
      return res
        .status(400)
        .json({ error: "Amount is required in the 'data' object" });
    }
    const finalamount = data.amount * 100;
    const merchantOrderId = randomUUID();
    const redirectUrl = `https://theater-food.life/order-confirmation?merchantOrderId=${merchantOrderId}`;

    const request = StandardCheckoutPayRequest.builder()
      .merchantOrderId(merchantOrderId)
      .amount(finalamount)
      .redirectUrl(redirectUrl)
      .build();

    const response = await client.pay(request);

    console.log("response", response.state);
    return res.json({
      checkoutPageUrl: response.redirectUrl,
      merchantOrderId,
      success: true,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Error creating order", success: false });
  }
});

app.get("/check-status", async (req, res) => {
  try {
    const { merchantOrderId } = req.query;

    if (!merchantOrderId) {
      return res.status(400).send("MerchantOrderId is required");
    }

    const response = await client.getOrderStatus(merchantOrderId);
    console.log("response", response.state);
    return res.json({ status: response.state });
  } catch (error) {
    console.error("Error getting status:", error);
    res.status(500).send("Error getting status");
  }
});

app.get("/", (req, res) => {
  res.send("PhonePe Payment Gateway Backend is running.");
});

// app.listen(5000, () => {
//   console.log("Server is running on port 5000");
// });

exports.testRoute = functions.https.onRequest((req, res) => {
  res.send("Test route working!");
});

exports.api = functions.https.onRequest(app);
