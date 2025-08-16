import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { Printer, CheckCircle, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import { playNotificationSound } from "../../utils/sound";
import { calculateTaxes } from "../../utils/calculateTaxes";

interface Order {
  id: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  customerName: string;
  customerPhone: string;
  seatNumber: string;
  status: string;
  orderId: number;
  adding: string;
  createdAt: string;
  screen: string;
  paymentStatus: string; // Add paymentStatus to the Order interface
}

function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [previousOrderCount, setPreviousOrderCount] = useState(0);

  useEffect(() => {
    console.log("OrderManagement component mounted");

    // Fetch orders where paymentStatus is 'paid' and status is 'pending'
    const paidPendingQuery = query(
      collection(db, "orders"),
      where("paymentStatus", "==", "paid"),
      where("status", "==", "pending")
    );

    const unsubscribePaidPending = onSnapshot(paidPendingQuery, (snapshot) => {
      const updatedOrders: Order[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as Order[];

      setOrders(updatedOrders);

      if (updatedOrders.length > previousOrderCount) {
        playNotificationSound();
      }

      setPreviousOrderCount(updatedOrders.length);
    });

    // Polling: update unpaid pending orders
    const interval = setInterval(async () => {
      const unpaidPendingQuery = query(
        collection(db, "orders"),
        where("paymentStatus", "==", "pending"),
        where("status", "==", "pending")
      );

      const snapshot = await getDocs(unpaidPendingQuery);
      console.log("Polling unpaid pending orders:", snapshot.size);

      snapshot.forEach(async (docSnap) => {
        const order = docSnap.data();
        const merchantOrderId = order.merchantOrderId;

        if (!merchantOrderId) return; // guard clause

        try {
          const res = await fetch(
            `https://api-an5tzlhtka-uc.a.run.app/check-status?merchantOrderId=${merchantOrderId}`
          );
          const data = await res.json();
          console.log("Payment status data:", data);

          const docRef = doc(db, "orders", docSnap.id);

          if (data.status === "COMPLETED") {
            await updateDoc(docRef, { paymentStatus: "paid" });
            console.log("Updated to paid:", merchantOrderId);
          } else {
            await updateDoc(docRef, { paymentStatus: data.status });
            console.log("Updated to:", data.status);
          }
        } catch (err) {
          console.error("Error checking payment status:", err);
        }
      });
    }, 30000); // Run this every 30 seconds

    return () => {
      clearInterval(interval);
      unsubscribePaidPending();
    };
  }, []); // <-- Only run once on mount

  const handlePrint = (order: Order) => {
    const subtotal = order.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const { sgst, cgst, handlingCharges } = calculateTaxes(subtotal);

    const printContent = `
      <html>
        <head>
          <title>Print Order</title>
          <style>
            body {
              font-family: monospace;
              font-size: 12px;
              padding: 8px;
            }
            pre {
              white-space: pre-wrap;
              word-wrap: break-word;
            }
          </style>
        </head>
        <body>
          <pre>
  ---------------------------------
            Customer Copy
            Geetha Multiplex
  ---------------------------------
  Completed At: ${new Date(order.createdAt).toLocaleString()}
  GSTN :37AAICS4289A1Z8
  
  Order Details:
  ---------------------------------
  Customer Name  : ${order.customerName}
  Order No       : ${order.orderId}
  Seat Number    : ${order.seatNumber}
  Screen         : ${order.screen}
  Phone Number   : ${order.customerPhone}
  ---------------------------------
  Items:
  ---------------------------------
      ${
        String(`Item Name`).padEnd(15) +
        String(`Qty`).padEnd(5) +
        String(`Price`)
      }
  ${order.items
    .map(
      (item) =>
      `      ${item.name.padEnd(15)} x${item.quantity}  ₹${(
          item.price * item.quantity
        ).toFixed(2)}`
    )
    .join("\n")}
  
  ---------------------------------
  Sub Total         : ₹${subtotal.toFixed(2)}
  Handling Charges  : ₹${handlingCharges.toFixed(2)}
  ---------------------------------
  Total Amount      : ₹${order.total.toFixed(2)}
  ---------------------------------
  Thank You for Choosing Geetha Multiplex
  For queries contact +919966992426
          </pre>
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`<pre>${printContent}</pre>`);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const updateOrderStatus = async (
    orderId: string,
    status: "completed" | "not_done"
  ) => {
    try {
      await updateDoc(doc(db, "orders", orderId), {
        status,
        completedAt: new Date().toISOString(),
        completionStatus: status === "completed" ? "success" : "failed",
      });
      toast.success(
        `Order marked as ${status === "completed" ? "completed" : "not done"}`
      );
    } catch (error) {
      toast.error("Failed to update order status");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Active Orders</h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {orders.map((order) => {
          const subtotal = order.items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          );
          const { sgst, cgst, handlingCharges } = calculateTaxes(subtotal);

          return (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow-md p-6 space-y-4"
            >
              {/* Customer Info & Status */}
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {order.customerName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Order No:{" "}
                    <span className="text-red-500 text-lg font-bold">
                      {order.orderId}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Seat: {order.seatNumber}
                  </p>
                  <p className="text-sm text-gray-500">
                    Screen: {order.screen}
                  </p>
                  <p className="text-sm text-gray-500">
                    Phone: {order.customerPhone}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Pending
                  </span>
                  {order.adding === "manual" && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Manual
                    </span>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="border-t border-b py-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  Order Items:
                </h4>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>
                        {item.name} x{item.quantity}
                      </span>
                      <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Handling Charges</span>
                  <span>₹{handlingCharges.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium text-base">
                  <span>Total</span>
                  <span>₹{order.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  onClick={() => handlePrint(order)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </button>
                <button
                  onClick={() => updateOrderStatus(order.id, "completed")}
                  className="inline-flex items-center px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark as Done
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty Orders Fallback */}
      {orders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No pending orders</p>
        </div>
      )}
    </div>
  );
}

export default OrderManagement;
