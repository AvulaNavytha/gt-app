import React, { useState } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { LayoutGrid, ClipboardList, CheckSquare, LogOut, Menu as MenuIcon, PlusSquare } from 'lucide-react';
import MenuManagement from './MenuManagement';
import OrderManagement from './OrderManagement';
import CompletedOrders from './CompletedOrders';
import Manualadd from './Manualadd';
import { useAuthStore } from '../../store/authStore';

function Dashboard() {
  const location = useLocation();
  const { adminLogout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname.includes(path);
  };

  const handleLogout = async () => {
    await adminLogout();
  };

  const navLinks = [
    {
      path: '/admin/menu',
      icon: LayoutGrid,
      text: 'Menu Management'
    },
    {
      path: '/admin/orders',
      icon: ClipboardList,
      text: 'Order Management'
    },
    {
      path: '/admin/completed',
      icon: CheckSquare,
      text: 'Completed Orders'
    },
    {
      path: '/admin/manual',
      icon: PlusSquare,
      text: 'Manual Adding'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
              </div>
              <div className="hidden md:ml-6 md:flex md:space-x-8">
                {navLinks.map(({ path, icon: Icon, text }) => (
                  <Link
                    key={path}
                    to={path}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive(path)
                        ? 'border-purple-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {text}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
              <div className="md:hidden ml-4">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
                >
                  <MenuIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {navLinks.map(({ path, icon: Icon, text }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                    isActive(path)
                      ? 'bg-purple-50 border-purple-500 text-purple-700'
                      : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  <div className="flex items-center">
                    <Icon className="w-4 h-4 mr-2" />
                    {text}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<Navigate to="/admin/menu" replace />} />
          <Route path="menu" element={<MenuManagement />} />
          <Route path="orders" element={<OrderManagement />} />
          <Route path="completed" element={<CompletedOrders />} />
          <Route path="manual" element={<Manualadd />} />
        </Routes>
      </div>
    </div>
  );
}

export default Dashboard;