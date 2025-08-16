import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import toast from 'react-hot-toast';
import { SCREENS } from '../constants/categories';
import logo from '../public/geethalogo.png';

function Login() {
  const navigate = useNavigate();
  const setUser = useStore((state) => state.setUser);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    seatNumber: '',
    screen: String()
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    const isPhoneNumberValid = /^\d{10}$/.test(formData.phone);
    const isSeatNumberValid = /^[A-Za-z]\d+$/.test(formData.seatNumber);
  
    if (!formData.name || !formData.phone || !formData.seatNumber || !formData.screen) {
      toast.error('Please fill in all fields');
      return;
    }
  
    if (!isPhoneNumberValid) {
      toast.error('Invalid Phone Number');
      return;
    }

    if (!isSeatNumberValid) {
      toast.error('Invalid Seat Number. Use 1 letter followed by number(s), e.g., A12');
      return;
    }
  
    setUser(formData.name, formData.phone, formData.seatNumber, formData.screen);
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.toString();
    navigate(`/menu${query ? `?${query}` : ''}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fe0002] to-black flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white shadow-xl p-8" 
      style={{
        margin: '20px',
        borderRadius: '24px',
      }}
      >
        <div className="text-center mb-8">
          <img 
            src={logo}
            alt="Geetha_Multiplex_logo"
            className="w-34 h-24 mx-auto  object-cover mb-4"
          />
          <h2 className="mt-4 text-3xl font-bold text-gray-900">Geetha Multiplex</h2>
          <p className="mt-2 text-gray-600">Sign in to order your snacks</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#fe0002] focus:border-[#fe0002]"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter your name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="tel"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#fe0002] focus:border-[#fe0002]"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Enter your phone number"
            />
          </div>

          {/* <div>
            <label className="block text-sm font-medium text-gray-700">Screen</label>
            <select
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#fe0002] focus:border-[#fe0002]"
              value={formData.screen}
              onChange={(e) => setFormData({ ...formData, screen: e.target.value })}
            >
              {SCREENS.map((screen) => (
                <option key={screen} value={screen}>{screen}</option>
              ))}
            </select>
          </div> */}
          <div>
  <label className="block text-sm font-medium text-gray-700">Screen</label>
  <div className="mt-1">
    {SCREENS.map((screen) => (
      <div key={screen} className="flex items-center">
        <input
          type="radio"
          id={screen}
          name="screen"
          value={screen}
          checked={formData.screen === screen}
          onChange={(e) => setFormData({ ...formData, screen: e.target.value })}
          className="h-4 w-4 text-[#fe0002] border-gray-300 focus:ring-[#fe0002]"
        />
        <label htmlFor={screen} className="ml-2 block text-sm text-gray-700">
          {screen}
        </label>
      </div>
    ))}
  </div>
</div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Seat Number</label>
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#fe0002] focus:border-[#fe0002]"
              value={formData.seatNumber}
              onChange={(e) => setFormData({ ...formData, seatNumber: e.target.value })}
              placeholder="Enter your seat number"
            />
          </div>
          
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#fe0002] hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#fe0002]"
          >
            Continue to Menu
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;