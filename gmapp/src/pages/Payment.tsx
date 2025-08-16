import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import { useMenuStore } from "../store/menuStore";
import { ArrowLeft, CreditCard } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../lib/firebase";

const searchParams = new URLSearchParams(location.search);
const query = searchParams.toString();

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    phonepe: any;
  }
}

const Payment = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const navigate = useNavigate();
  const { cart, name, phone, seatNumber, clearCart, screen } = useStore();
  const { startRealTimeUpdates } = useMenuStore();

  useEffect(() => {
    const unsubscribe = startRealTimeUpdates();
    return () => unsubscribe();
  }, []);

  const calculateTotal = () => {
    const subtotal = cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    const handlingCharges = subtotal * 0.06;
    return subtotal + handlingCharges;
  };

  const createOrder = async () => {
    setIsProcessing(true);
    const totalAmount = calculateTotal();
    const data = {
      name,
      amount: totalAmount,
      number: phone,
      MUID: `MUID_${Date.now()}`,
      transactionId: `TXN_${Date.now()}`,
      redirectUrl: `${window.location.origin}/order-confirmation${
        query ? `?${query}` : ""
      }`,
    };
    try {
      const totalAmount = calculateTotal();
      const response = await axios.post("https://api-an5tzlhtka-uc.a.run.app/create-order", {
        data,
      });

      if (response.data.success) {
        await addDoc(collection(db, 'orders'), {
          items: cart,
          total: totalAmount,
          customerName: name,
          customerPhone: phone,
          seatNumber,
          status: 'pending',
          screen,
          orderId: data.transactionId,
          merchantOrderId: response.data.merchantOrderId,
          paymentStatus: "pending",
          createdAt: new Date().toISOString(),
        });

        // Save order locally
        const orderData = {
          items: cart,
          total: totalAmount,
          customerName: name,
          customerPhone: phone,
          seatNumber,
          screen,
          createdAt: new Date().toISOString(),
          orderId: data.transactionId,
          merchantOrderId: response.data.merchantOrderId,
          paymentStatus: "pending",
        };
        const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
        existingUsers.push(orderData);
        localStorage.setItem("users", JSON.stringify(existingUsers));
        localStorage.setItem("transactionId", data.transactionId);
        const marchID = response.data.merchantOrderId;
        console.log("Merchant Order ID:", marchID);
        localStorage.setItem("marchid", marchID);
        clearCart();
        toast.success("Redirecting to PhonePe payment...");
      } else {
        toast.error(response.data.message || "Failed to initiate payment");
      }
      window.location.href = response.data.checkoutPageUrl;
    } catch (error) {
      console.log("~~~~~~~~~~~> error in creating order" + error);
      toast.error("Server Error: Could not initiate payment.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-3xl mx-auto p-6">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(`/cart${query ? `?${query}` : ""}`)}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Cart
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Payment Details
            </h2>

            <div className="space-y-6">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">
                  Order Summary
                </h3>
                <div className="space-y-2">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>
                        {item.name} x {item.quantity}
                      </span>
                      <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t mt-4 pt-4">
                  <div className="flex justify-between text-sm">
                    <span>Sub Total</span>
                    <span>
                      ₹
                      {cart
                        .reduce((t, i) => t + i.price * i.quantity, 0)
                        .toFixed(2)}
                    </span>
                  </div>
                  <br></br>
                  <div className="flex justify-between text-sm">
                    <span>Handling Charges</span>
                    <span>
                      ₹
                      {(
                        calculateTotal() -
                        cart.reduce((t, i) => t + i.price * i.quantity, 0)
                      ).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg mt-4">
                    <span>Total</span>
                    <span>₹{calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-4">
                  Delivery Details
                </h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Name:</span> {name}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span> {phone}
                  </p>
                  <p>
                    <span className="font-medium">Seat Number:</span>{" "}
                    {seatNumber}
                  </p>
                  <p>
                    <span className="font-medium">Screen:</span> {screen}
                  </p>
                </div>
              </div>

              <div>
                <p
                  style={{
                    fontWeight: "bold",
                    color: "red",
                    textAlign: "center",
                  }}
                >
                  <span style={{ fontWeight: "bold", color: "black" }}>
                    {" "}
                    Wait until your{" "}
                  </span>
                  order is confirmed
                  <span style={{ fontWeight: "bold", color: "black" }}>
                    {" "}
                    after{" "}
                  </span>
                  payment<div></div>
                  Don’t reload/close this page while processing
                </p>
              </div>
              <button
                onClick={createOrder}
                disabled={isProcessing}
                className="w-full flex items-center justify-center space-x-2 bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 transition-colors duration-300 disabled:opacity-75"
              >
                <CreditCard className="w-5 h-5" />
                <span>
                  {isProcessing ? "Processing..." : "Pay with PhonePe"}
                </span>
              </button>

              <p className="text-sm text-gray-500 text-center">
                By clicking "Pay with PhonePe", you agree to our{" "}
                <span
                  onClick={() =>
                    navigate(`/TermsAndConditions${query ? `?${query}` : ""}`)
                  }
                  className="text-purple-600 hover:underline cursor-pointer"
                >
                  terms and conditions
                </span>
                <br></br>
                <span
                  onClick={() =>
                    navigate(`/PrivacyPolicy${query ? `?${query}` : ""}`)
                  }
                  className="text-purple-600 hover:underline cursor-pointer"
                >
                  Privacy Policy
                </span>
              </p>
              <p>
                <span style={{ fontWeight: "500" }} className="text-center">
                  Contact Us
                </span>
                <br />
                Contact: +919966992426 <br />
                Email: geethamultiplexnrt@gmail.com  <br />
                Address: Geetha Multiplex, Kasu central Mall, ooo GBR Hospital, Near Palnadu Bus Stand, Narasaraopet, Andhra Pradesh 522601, India
                <br />
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
