import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
  const scrollAnimation = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  return (
    
    <div className="min-h-screen flex flex-col font-sans text-gray-900 dark:text-white relative transition-colors duration-300">

      
      <div className="fixed inset-0 z-[-1]">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/assets/hero-bg.jpg"
          className="w-full h-full object-cover"
        >
          <source src="/assets/furniture-showcase.mp4" type="video/mp4" />
        </video>
        
        {/* Overlay: Whiteish in light mode, Dark in dark mode */}
        <div className="absolute inset-0 bg-white/80 dark:bg-black/50 transition-colors duration-500"></div>
      </div>

      
      <header className="flex-grow flex flex-col justify-center items-center text-center px-4 relative h-screen">
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight drop-shadow-lg dark:drop-shadow-2xl">
            Visualize Your <br /> Dream Space
          </h1>
          <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto opacity-90 drop-shadow-md">
            Collaborate with clients to create immersive 2D & 3D interior layouts in real-time.
          </p>
          <Link
            to="/dashboard"
            className="bg-black/10 dark:bg-white/10 backdrop-blur-md border border-black/30 dark:border-white/30 text-gray-900 dark:text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-black/20 dark:hover:bg-white/20 transition shadow-lg inline-block"
          >
            Enter Design Studio
          </Link>
        </div>
      </header>

     
      <div className="bg-white/60 dark:bg-black/30 backdrop-blur-md py-6 border-y border-black/10 dark:border-white/10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center text-gray-700 dark:text-gray-200">
          <div className="flex flex-col items-center">
             <span className="font-semibold tracking-wide">Precise 2D Planning</span>
          </div>
          <div className="flex flex-col items-center border-l-0 md:border-l md:border-r border-black/20 dark:border-white/20">
             <span className="font-semibold tracking-wide">Instant 3D Rendering</span>
          </div>
          <div className="flex flex-col items-center">
             <span className="font-semibold tracking-wide">Save & Share Portfolios</span>
          </div>
        </div>
      </div>

      
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={scrollAnimation}
            className="flex flex-col md:flex-row items-center gap-12 bg-white/60 dark:bg-black/40 backdrop-blur-lg border border-black/10 dark:border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl transition-colors duration-300"
          >
            <div className="md:w-1/2">
              <div className="bg-gray-200 dark:bg-black/50 border border-black/20 dark:border-white/20 aspect-video rounded-xl shadow-inner flex items-center justify-center transition-colors duration-300">
                <span className="text-gray-500 dark:text-gray-400 font-medium">[ 2D Layout Interface Preview ]</span>
              </div>
            </div>
            <div className="md:w-1/2 text-gray-900 dark:text-white">
              <h2 className="text-4xl font-serif font-bold mb-6">Manage Your Portfolios</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Store room specifications including size, shape, and color schemes. Save completed designs for future consultations and edit existing layouts with ease.
              </p>
              <Link to="/portfolio" className="text-amber-600 dark:text-amber-400 font-semibold hover:text-amber-500 dark:hover:text-amber-300 transition flex items-center gap-2">
                View Sample Portfolios <span>&rarr;</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      
      <footer className="bg-white/80 dark:bg-black/60 backdrop-blur-xl border-t border-black/10 dark:border-white/10 py-12 mt-auto transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-gray-600 dark:text-gray-400">
          <div className="mb-4 md:mb-0">
            <span className="text-xl font-bold text-gray-900 dark:text-white tracking-wide">Apex Interiors</span>
            <p className="text-sm mt-2">© 2026 All Rights Reserved.</p>
          </div>
          <div className="flex space-x-6 text-sm">
            <Link to="/privacy" className="hover:text-black dark:hover:text-white transition">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-black dark:hover:text-white transition">Terms of Service</Link>
            <Link to="/contact" className="hover:text-black dark:hover:text-white transition">Contact Support</Link>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Home;
