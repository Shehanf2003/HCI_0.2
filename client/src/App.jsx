import React, { useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { View } from '@react-three/drei';
import { Toaster } from 'react-hot-toast';

import Dashboard from './pages/Dashboard';
import DesignStudio from './pages/DesignStudio';
import Home from './pages/Home';
import Navbar from './components/Layout/Navbar';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/?login=true" replace />;
  }
  return children;
};

function App() {
  // 1. Create a ref to track events across the entire app
  const containerRef = useRef();

  return (
    <div ref={containerRef} className="relative w-full min-h-screen">
       {/* 2. Wrap the entire app in a container attached to the ref */}
      <Router>
        <Toaster position="top-right" />
        <Navbar />
        
        {/* Your standard page routing */}
        <Routes>
          <Route path="/" element={<Home />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/design-studio/:id"
            element={
              <ProtectedRoute>
                <DesignStudio />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;