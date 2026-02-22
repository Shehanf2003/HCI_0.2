import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navClasses = theme === 'dark'
    ? "bg-transparent text-white"
    : "bg-white/90 backdrop-blur-sm text-gray-900 shadow-sm";

  const linkHover = theme === 'dark'
    ? "hover:text-gray-200"
    : "hover:text-blue-600";

  const buttonClasses = theme === 'dark'
    ? "bg-transparent border border-white text-white hover:bg-white hover:text-gray-900"
    : "bg-transparent border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white";

  return (
    <nav className={`absolute top-0 left-0 w-full z-20 flex justify-between items-center px-6 md:px-12 py-6 transition-colors duration-300 ${navClasses}`}>
      <div className="text-2xl font-bold tracking-wide">
        Apex Interiors
      </div>
      <div className={`hidden md:flex space-x-8 font-medium text-sm tracking-wide`}>
        <Link to="/" className={`${linkHover} transition`}>Home</Link>
        <span className={`cursor-pointer ${linkHover} transition`}>Portfolio</span>
        <span className={`cursor-pointer ${linkHover} transition`}>3D Showroom</span>
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-200/20 transition"
          aria-label="Toggle Dark Mode"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {token ? (
          <button
            onClick={handleLogout}
            className={`${buttonClasses} px-6 py-2 rounded-full transition font-medium text-sm`}
          >
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            className={`${buttonClasses} px-6 py-2 rounded-full transition font-medium text-sm`}
          >
            Designer Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
