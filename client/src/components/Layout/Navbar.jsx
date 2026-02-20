import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="absolute top-0 left-0 w-full z-20 flex justify-between items-center px-6 md:px-12 py-6 bg-transparent">
      <div className="text-2xl font-bold text-white tracking-wide">
        Apex Interiors
      </div>
      <div className="hidden md:flex space-x-8 text-white font-medium text-sm tracking-wide">
        <Link to="/" className="hover:text-gray-200 transition">Home</Link>
        <span className="cursor-pointer hover:text-gray-200 transition">Portfolio</span>
        <span className="cursor-pointer hover:text-gray-200 transition">3D Showroom</span>
      </div>
      <div>
        {token ? (
          <button
            onClick={handleLogout}
            className="bg-transparent border border-white text-white px-6 py-2 rounded-full hover:bg-white hover:text-gray-900 transition font-medium text-sm"
          >
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            className="bg-transparent border border-white text-white px-6 py-2 rounded-full hover:bg-white hover:text-gray-900 transition font-medium text-sm"
          >
            Designer Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
