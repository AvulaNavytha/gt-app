import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import TermsAndConditions from './pages/TermsAndConditions'
import Payment from './pages/Payment';
import Order from './pages/order'
import OrderConfirmation from './pages/OrderConfirmation';
import PrivacyPolicy from './pages/PrivacyPolicy'
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import { useStore } from './store/useStore';
import { useAuthStore } from './store/authStore';
import PaymentSuccess from './pages/PaymentSuccess';

const searchParams = new URLSearchParams(location.search);
const query = searchParams.toString();

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isLoggedIn = useStore((state) => state.isLoggedIn);
  return isLoggedIn ? <>{children}</> : <Navigate to="/" />;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const isAdmin = useAuthStore((state) => state.isAdmin);
  return isAdmin ? <>{children}</> : <Navigate to={`/admin/login${query ? `?${query}` : ''}`} />;
};

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <Routes>
      <Route path="/" element={<Login />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/history" element={<Order/>} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/menu"
          element={
            <PrivateRoute>
              <Menu />
            </PrivateRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <Cart />
            </PrivateRoute>
          }
        />

<Route
          path="/TermsAndConditions"
          element={
            <PrivateRoute>
              <TermsAndConditions />
            </PrivateRoute>
          }
        />

<Route
          path="/PrivacyPolicy"
          element={
            <PrivateRoute>
              <PrivacyPolicy />
            </PrivateRoute>
          }
        />


        <Route
          path="/payment"
          element={
            <PrivateRoute>
              <Payment />
            </PrivateRoute>
          }
        />
        {/* <Route
          path="/order-confirmation"
          element={
            <PrivateRoute>
              <OrderConfirmation />
            </PrivateRoute>
          }
        /> */}
        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
            
          }
          
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;