import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { SCREENS } from '../../constants/categories';
import { collection, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

function Manualadd() {
  const initialFormData = {
    name: '',
    phone: '',
    seatNumber: '',
    screen: '',
    items: [] as Array<{ name: string; quantity: number; price: number }>
  };

  const initialItem = {
    name: '',
    quantity: 1,
    price: 0
  };

  const [formData, setFormData] = useState(initialFormData);
  const [currentItem, setCurrentItem] = useState(initialItem);
  const calculateTotal = () => {
    const subtotal = formData.items.reduce((total, item) => total + item.quantity * item.price, 0);
    const totalWithSurcharge = subtotal * 1.06; // Add 6% surcharge
    return parseFloat(totalWithSurcharge.toFixed(2)); // Convert to a float with 2 decimal places
  };
  

  const handleAddItem = () => {
    if (!currentItem.name || currentItem.quantity <= 0 || currentItem.price <= 0) {
      toast.error('Item must have a valid name, quantity, and price.');
      return;
    }

    setFormData({
      ...formData,
      items: [...formData.items, { ...currentItem }]
    });

    setCurrentItem(initialItem);
    toast.success('Item added');
  };

  const handleRemoveItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index)
    });
    toast.success('Item removed');
  };

  const addtodb = async () => {
    const docRef = doc(db, 'orderId', 'UGm0lsQRJenIc2bAhRJX');
    const docalldata = await getDoc(docRef);
    const docdata = docalldata.data();
    const currentDate = new Date().toISOString().split('T')[0];
    const docDate = docdata?.date ? docdata.date.split('T')[0] : '';
    let newId = 1;

    if (docDate === currentDate && docdata?.id !== undefined) {
      newId = docdata.id + 1;
    }

    await updateDoc(docRef, { id: newId, date: currentDate });

    await addDoc(collection(db, 'orders'), {
      items: formData.items,
      total: calculateTotal(),
      customerName: formData.name,
      customerPhone: formData.phone,
      seatNumber: formData.seatNumber,
      status: 'pending',
      adding:'manual',
      screen: formData.screen,
      orderId: newId,
      createdAt: new Date().toISOString(),
      paymentStatus: 'paid',
      merchantOrderId: 'manual',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isPhoneNumberValid = /^\d{10}$/.test(formData.phone);

    if (!formData.name || !formData.phone || !formData.seatNumber || !formData.screen) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!isPhoneNumberValid) {
      toast.error('Invalid Phone Number');
      return;
    }

    if (formData.items.length === 0) {
      toast.error('Please add at least one item');
      return;
    }

    try {
      await addtodb();
      toast.success('Form submitted successfully');
      setFormData(initialFormData);
      setCurrentItem(initialItem);
    } catch (error) {
      toast.error('Error submitting the form. Please try again.');
    }
  };

  return (
    <div>
      <h1>Enter Details</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#fe0002] focus:border-[#fe0002]"
          />
        </div>

        {/* Phone Number Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#fe0002] focus:border-[#fe0002]"
          />
        </div>

        {/* Screen Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Screen</label>
          {SCREENS.map((screen) => (
            <div key={screen}>
              <input
                type="radio"
                name="screen"
                value={screen}
                checked={formData.screen === screen}
                onChange={(e) => setFormData({ ...formData, screen: e.target.value })}
              />
              {screen}
            </div>
          ))}
        </div>

        {/* Seat Number Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Seat Number</label>
          <input
            type="text"
            value={formData.seatNumber}
            onChange={(e) => setFormData({ ...formData, seatNumber: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Items Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Items</label>
          <div className="flex space-x-2">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Item Name</label>
              <input
                type="text"
                value={currentItem.name}
                onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })}
                placeholder="Item Name"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Quantity</label>
              <input
                type="number"
                value={currentItem.quantity}
                onChange={(e) => setCurrentItem({ ...currentItem, quantity: Number(e.target.value) })}
                placeholder="Quantity"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Price</label>
              <input
                type="number"
                value={currentItem.price}
                onChange={(e) => setCurrentItem({ ...currentItem, price: Number(e.target.value) })}
                placeholder="Price"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex-shrink-0">
              <button
                type="button"
                onClick={handleAddItem}
                className="mt-5 px-4 py-2 bg-[#fe0002] text-white rounded-md"
              >
                Add Item
              </button>
            </div>
          </div>
          <ul>
            {formData.items.map((item, index) => (
              <li key={index} className="flex justify-between items-center">
                <span>
                  {item.name} - {item.quantity} - {item.price}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveItem(index)}
                  className="px-2 py-1 bg-gray-500 text-white rounded-md"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Display Total */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Total Payment ( Surcharge)</label>
          <p className="mt-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-100">
            {calculateTotal()}
          </p>
        </div>

        {/* Submit Button */}
        <button type="submit" className="w-full px-4 py-2 bg-[#fe0002] text-white rounded-md">
          Submit
        </button>
      </form>
    </div>
  );
}

export default Manualadd;
