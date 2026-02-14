import React from 'react';
import LoginForm from '../features/auth/LoginForm';
import Navbar from '../components/Layout/Navbar';

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center p-4">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
