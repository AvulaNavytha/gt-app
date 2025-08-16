import React, { useState, useEffect } from 'react';
import { Auth } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import { Printer, Download, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { exportOrders } from '../../utils/exportOrders';
import { format } from 'date-fns';
import { calculateTaxes } from '../../utils/calculateTaxes';

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
  screen: string;
  orderId:number;
  status: string;
  createdAt: string;
  completedAt: string;
  adding:string,
  completionStatus: 'success' | 'failed';
}

function CompletedOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [totalCollected, setTotalCollected] = useState(0);

  useEffect(() => {
    fetchCompletedOrders();
  }, [startDate, endDate]);

  const fetchCompletedOrders = async () => {
    try {
      const startOfRange = new Date(startDate);
      startOfRange.setHours(0, 0, 0, 0);

      const endOfRange = new Date(endDate);
      endOfRange.setHours(23, 59, 59, 999);

      const q = query(
        collection(db, 'orders'),
        where('status', 'in', ['completed', 'not_done']),
        where('createdAt', '>=', startOfRange.toISOString()),
        where('createdAt', '<=', endOfRange.toISOString())
      );

      const querySnapshot = await getDocs(q);
      const fetchedOrders: Order[] = [];
      querySnapshot.forEach((doc) => {
        fetchedOrders.push({ id: doc.id, ...doc.data() } as Order);
      });

      const sortedOrders = fetchedOrders.sort(
        (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
      );

      setOrders(sortedOrders);

      // Calculate total money collected
      const total = sortedOrders.reduce((sum, order) => sum + order.total, 0);
      setTotalCollected(total);
    } catch (error) {
      toast.error('Failed to fetch completed orders');
      console.error(error);
    }
  };

  const handlePrint = (order: Order) => {
    const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const { sgst, cgst, handlingCharges } = calculateTaxes(subtotal);

    const printContent = `
      ---------------------------------
                Customer Copy
                Geetha Multiplex
      ---------------------------------
      Completed At: ${new Date(order.completedAt).toLocaleString()}
      GSTN :37AAICS4289A1Z8

      Order Details:
      ---------------------------------
      Customer Name  : ${order.customerName}
      order NO       : ${order.orderId}
      Seat Number    : ${order.seatNumber}
      Screen         : ${order.screen}
      Phone Number   : ${order.customerPhone}
      ---------------------------------
      Items:
      ---------------------------------
      ${String(`Item Name`).padEnd(15) + String(`Qty`).padEnd(5) + String(`Price`)}
${order.items
  .map(
    (item) =>
      `      ${item.name.padEnd(15)} x${item.quantity}  ₹${(
        item.price * item.quantity
      ).toFixed(2)}`
  )
  .join('\n')}

      ---------------------------------
      Sub Total            :₹ ${subtotal.toFixed(2)}
      ---------------------------------
      Handling Charges : ₹${handlingCharges.toFixed(2)}
      ---------------------------------
      Total Amount   : ₹${order.total.toFixed(2)}
      ---------------------------------
      Thank You for Choosing Geetha Multiplex!
`;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`<pre>${printContent}</pre>`);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleExport = () => {
    if (orders.length === 0) {
      toast.error('No orders to export');
      return;
    }
    try {
      exportOrders(orders, startDate, endDate);
      toast.success('Orders exported successfully');
    } catch (error) {
      toast.error('Failed to export orders');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-around items-center mx-auto">
        <h2 className="lg:text-2xl md:text-2xl font-bold text-gray-900 hidden lg:block md:block">
          Completed Orders
        </h2>
        <div className="flex items-center space-x-2 md:space-x-4 lg:space-x-4">
          <div className="flex items-center space-x-1 md:space-x-2 lg:space-x-2">
            <Calendar className="w-5 h-5 text-gray-500 hidden lg:block md:block" />
            <input
              type="date"
              value={format(startDate, 'yyyy-MM-dd')}
              onChange={(e) => setStartDate(new Date(e.target.value))}
              className="border border-gray-300 rounded-md px-1 py-1 md:px-3 md:py-2 lg:px-3 lg:py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <span>-</span>
            <input
              type="date"
              value={format(endDate, 'yyyy-MM-dd')}
              onChange={(e) => setEndDate(new Date(e.target.value))}
              className="border border-gray-300 rounded-md px-1 py-1 md:px-3 md:py-2 lg:px-3 lg:py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          {auth.currentUser?.email == 'holytavvala@gmail.com' && (
          <button
            onClick={handleExport}
            className=" items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 hidden lg:inline-flex md:inline-flex"
          >
            <Download className="w-4 h-4 lg:mr-2 md:mr-2" />
            <span className='block'>Export</span>
          </button>)}
        </div>
      </div>

      <div className="bg-gray-100 p-4 rounded-md shadow-sm float-right">
      {auth.currentUser?.email == 'holytavvala@gmail.com' && (
      <button
            onClick={handleExport}
            className="block lg:hidden md:hidden inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
          >
            <Download className="w-4 h-4 lg:mr-2 md:mr-2" />
          </button>)}
</div>
      <div className="bg-gray-100 p-4 rounded-md shadow-sm flex justify-between">
        <p className="text-sm font-medium text-gray-700">
          Number of Orders: <span className="font-semibold">{orders.length}</span>
        </p>
        <p className="text-sm font-medium text-gray-700">
          Total Collected: <span className="font-semibold">₹{totalCollected.toFixed(2)}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {orders.map((order) => {
          const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
          const { sgst, cgst, handlingCharges } = calculateTaxes(subtotal);

          return (
            <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{order.customerName}</h3>
                  <p className="text-sm text-gray-500">
                        order No:<span className="text-red-500 text-lg font-bold">{order.orderId}</span>
                      </p>
                  <p className="text-sm text-gray-500">Seat: {order.seatNumber}</p>
                  <p className="text-sm text-gray-500">Screen: {order.screen}</p>
                  <p className="text-sm text-gray-500">
                    Completed: {new Date(order.completedAt).toLocaleString()}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    order.completionStatus === 'success'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}
                >
                  {order.completionStatus === 'success' ? 'Completed' : 'Not Done'}
                </span>
                {order.adding === 'manual' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Manual
                    </span>
                  )}
              </div>

              <div className="border-t border-b py-4 my-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Order Items:</h4>
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
                <div className="mt-4 pt-4 border-t space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  {/* <div className="flex justify-between text-sm">
                    <span>SGST (2.5%)</span>
                    <span>₹{sgst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>CGST (2.5%)</span>
                    <span>₹{cgst.toFixed(2)}</span>
                  </div> */}
                  <div className="flex justify-between text-sm">
                    <span>Handling Charges</span>
                    <span>₹{handlingCharges.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-medium pt-2 border-t">
                    <span>Total</span>
                    <span>₹{order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => handlePrint(order)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {orders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No orders found for the selected date range.</p>
        </div>
      )}
    </div>
  );
}

export default CompletedOrders;
