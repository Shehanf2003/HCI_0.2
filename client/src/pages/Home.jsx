import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Navbar */}
      <nav className="absolute top-0 left-0 w-full z-20 flex justify-between items-center px-6 md:px-12 py-6">
        <div className="text-2xl font-bold text-white tracking-wide">
          Apex Interiors
        </div>
        <div className="hidden md:flex space-x-8 text-white font-medium text-sm tracking-wide">
          <Link to="/" className="hover:text-gray-200 transition">Home</Link>
          <span className="cursor-pointer hover:text-gray-200 transition">Portfolio</span>
          <span className="cursor-pointer hover:text-gray-200 transition">3D Showroom</span>
        </div>
        <div>
          <Link
            to="/login"
            className="bg-transparent border border-white text-white px-6 py-2 rounded-full hover:bg-white hover:text-gray-900 transition font-medium text-sm"
          >
            Designer Login
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header
        className="flex-grow flex flex-col justify-center items-center text-center px-4 relative h-screen"
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/assets/hero-bg.jpg"
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="/assets/furniture-showcase.mp4" type="video/mp4" />
        </video>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40 z-10"></div>

        <div className="relative z-10 max-w-4xl mx-auto text-white px-4">
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight drop-shadow-lg">
            Visualize Your <br /> Dream Space
          </h1>
          <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto opacity-90 drop-shadow-md">
            Collaborate with clients to create immersive 2D & 3D interior layouts in real-time.
          </p>
          <Link
            to="/dashboard"
            className="bg-white text-gray-900 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition shadow-lg inline-block"
          >
            Enter Design Studio
          </Link>
        </div>
      </header>

      {/* Footer / Features Section */}
      <div className="bg-white py-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center text-gray-600">
          <div className="flex flex-col items-center">
             <span className="font-semibold text-gray-800">Precise 2D Planning</span>
          </div>
          <div className="flex flex-col items-center border-l-0 md:border-l md:border-r border-gray-200">
             <span className="font-semibold text-gray-800">Instant 3D Rendering</span>
          </div>
          <div className="flex flex-col items-center">
             <span className="font-semibold text-gray-800">Save & Share Portfolios</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
