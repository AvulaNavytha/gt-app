import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const searchParams = new URLSearchParams(location.search);
    const query = searchParams.toString();


const Order: React.FC = () => {
  const navigate = useNavigate();

  // Retrieve and parse sessionStorage data
  const z = localStorage.getItem('users');
  const orders = z ? JSON.parse(z) : [];

  useEffect(() => {
    console.log('Orders:', orders);
  }, [orders]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col p-4">
      {/* Return to Menu Button */}
      <div>
        <button
          onClick={() =>navigate(`/menu${query ? `?${query}` : ''}`)}
          className="flex items-center space-x-2 text-red-600 hover:text-red-700"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Return to Menu</span>
        </button>
      </div>
      <br />
      {/* Order History Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Order History</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {orders.length > 0 ? (
            // Reverse the array to display new orders at the top
            orders
              .slice()
              .reverse()
              .map((order: any, index: number) => {
                // Calculate subtotal
                const subtotal = order.items.reduce(
                  (acc: number, item: any) => acc + item.price * item.quantity,
                  0
                );
                // Calculate handling charges (6% of subtotal)
                const handlingCharges = subtotal * 0.06;

                return (
                  <div key={index} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {order.customerName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Order No:
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
                        <p className="text-sm text-gray-500">
                          Order placed at:{' '}
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-b py-4 my-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        Order Items:
                      </h4>
                      <div className="space-y-2">
                        {order.items.map((item: any, itemIndex: number) => (
                          <div
                            key={itemIndex}
                            className="flex justify-between text-sm"
                          >
                            <span>
                              {item.name} x{item.quantity}
                            </span>
                            <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      {/* Subtotal */}
                      <div className="mt-4 pt-4 space-y-2">
                        <div className="flex justify-between text-sm font-medium pt-2 border-t">
                          <span>Sub Total</span>
                          <span>₹{subtotal.toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Handling Charges */}
                      <div>
                        <div className="flex justify-between text-sm font-medium pt-2">
                          <span>Handling Charges :</span>
                          <span>₹{handlingCharges.toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Total */}
                      <div className="mt-4 pt-4 space-y-2">
                        <div className="flex justify-between font-medium pt-2 border-t">
                          <span>Total</span>
                          <span>₹{(subtotal + handlingCharges).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
          ) : (
            <p className="text-gray-500">No active orders found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Order;
