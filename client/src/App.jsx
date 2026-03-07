import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Dashboard from './pages/Dashboard';
import DesignStudio from './pages/DesignStudio';
import Home from './pages/Home';
import Navbar from './components/Layout/Navbar';
import { Toaster } from 'react-hot-toast';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/?login=true" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen transition-colors duration-300 backdrop-blur-md bg-white/10 dark:bg-black/10 border border-white/20 shadow-xl dark:text-gray-100 text-gray-900">
        <Toaster position="top-right" />
        <Navbar />
        <main className="flex-grow">
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

            {/* Default redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
