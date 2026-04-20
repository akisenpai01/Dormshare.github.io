import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import ItemDetails from './pages/ItemDetails';
import Chat from './pages/Chat';
import QRVerify from './pages/QRVerify';
import Navigation from './components/Navigation';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/auth" />;
  return <Navigation>{children}</Navigation>;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
          <Route path="/item/:id" element={<ProtectedRoute><ItemDetails /></ProtectedRoute>} />
          <Route path="/chat/:txId" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          
          <Route path="/qr/show/:txId" element={<ProtectedRoute><QRVerify mode="show" /></ProtectedRoute>} />
          <Route path="/qr/scan/:txId" element={<ProtectedRoute><QRVerify mode="scan" /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
