import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Home } from "lucide-react";
import toast from "react-hot-toast";
import { db } from "../lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";

const OrderConfirmation = () => {
  console.log("OrderConfirmation component rendered");
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const navigate = useNavigate();

  useEffect(() => {
    console.log("OrderConfirmation component useEffect triggered");
    const checkPaymentStatus = async () => {
      console.log("OrderConfirmation component checkPayment triggered");
      const searchParams = new URLSearchParams(window.location.search);
      const merchantOrderId = searchParams.get("merchantOrderId");

      if (!merchantOrderId) {
        setStatus("error");
        toast.error("Invalid payment URL.");
        navigate("/");
        return;
      }

      try {
        const res = await fetch(
          `https://api-an5tzlhtka-uc.a.run.app/check-status?merchantOrderId=${merchantOrderId}`
        );
        const data = await res.json();
        console.log("Payment status data:", data);

        if (data.status === "COMPLETED") {
          // Update Firestore order payment status to "paid"
          const ordersRef = collection(db, "orders");
          const q = query(
            ordersRef,
            where("merchantOrderId", "==", merchantOrderId)
          );
          const querySnapshot = await getDocs(q);

          querySnapshot.forEach(async (orderDoc) => {
            const docRef = doc(db, "orders", orderDoc.id);
            await updateDoc(docRef, { paymentStatus: "paid" });
          });
          console.log("Payment status success:");
          setStatus("success");
        } else if (data.status !== "COMPLETED") {
          const ordersRef = collection(db, "orders");
          const q = query(
            ordersRef,
            where("merchantOrderId", "==", merchantOrderId)
          );
          const querySnapshot = await getDocs(q);

          querySnapshot.forEach(async (orderDoc) => {
            const docRef = doc(db, "orders", orderDoc.id);
            await updateDoc(docRef, { paymentStatus: data.status });
          });
          console.log("Payment status failed:");
          setStatus("error");
          toast.error("Payment not completed.");
          navigate("/");
        } else {
          console.log("Payment status failed:");
          setStatus("error");
          toast.error("Payment not completed.");
          navigate("/");
        }
      } catch (err) {
        console.error("Error verifying payment:", err);
        toast.error("Something went wrong. Please try again.");
        setStatus("error");
        navigate("/");
      }
    };

    checkPaymentStatus();
  }, [navigate]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700 text-lg">
        Please wait, verifying your payment...
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Order Confirmed!
          </h2>
          <p className="text-gray-600 mb-8">
            Your order has been successfully placed. Our staff will deliver your
            food to your seat shortly.
          </p>
          <button
            onClick={() => navigate("/menu")}
            className="inline-flex items-center space-x-2 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors duration-300"
          >
            <Home className="w-5 h-5" />
            <span>Return to Menu</span>
          </button>
          <br />
          <br />
          <div>
            <p
              style={{ color: "gray", fontSize: "0.8rem", textAlign: "center" }}
            >
              Contact our food counter if you have issues about payment or order
              confirmation. We are happy to assist.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default OrderConfirmation;
