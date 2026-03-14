import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthPanel from '../features/auth/AuthPanel';
import { BoxSelect, CircleDollarSign, Image, Layout, CreditCard, MonitorSmartphone } from 'lucide-react';

const Home = () => {
  const [isAuthPanelOpen, setIsAuthPanelOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('login') === 'true') {
      setIsAuthPanelOpen(true);
    }
  }, [location]);
  const isAuthenticated = !!localStorage.getItem('token');

  const handleStartDesign = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      setIsAuthPanelOpen(true);
    }
  };

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
          <button
            onClick={handleStartDesign}
            className="bg-black/10 dark:bg-white/10 border border-black/30 dark:border-white/30 text-gray-900 dark:text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-black/20 dark:hover:bg-white/20 transition shadow-lg inline-block cursor-pointer"
          >
            Enter Design Studio
          </button>
        </div>
      </header>

      <AuthPanel isOpen={isAuthPanelOpen} onClose={() => setIsAuthPanelOpen(false)} />

     
      <div className="bg-white/60 dark:bg-black/30 py-6 border-y border-black/10 dark:border-white/10 transition-colors duration-300">
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
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-gray-900 dark:text-white mb-4">System User Manual</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Master the interior design workflow in three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={scrollAnimation}
              className="bg-white/60 dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-2xl p-6 shadow-xl flex flex-col transition-colors duration-300"
            >
              <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-xl mb-6 flex items-center justify-center relative overflow-hidden group">
                <div className="text-gray-500 dark:text-gray-400 text-sm font-medium text-center p-4">
                  [Insert GIF: Room Setup]
                  <br/>
                  <span className="text-xs opacity-75">(e.g., /assets/step1-setup.gif)</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">1. Define Your Space</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Start by creating a new design. Set your room dimensions, choose a template, and customize wall colors and textures to match the real environment.
              </p>
              <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-2 list-disc pl-5">
                <li>Input custom room dimensions (LxWxH).</li>
                <li>Select from various room templates.</li>
                <li>Customize wall colors and floor textures.</li>
              </ul>
            </motion.div>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{...scrollAnimation, visible: { ...scrollAnimation.visible, transition: { duration: 0.8, delay: 0.2 } }}}
              className="bg-white/60 dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-2xl p-6 shadow-xl flex flex-col transition-colors duration-300"
            >
              <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-xl mb-6 flex items-center justify-center relative overflow-hidden group">
                <div className="text-gray-500 dark:text-gray-400 text-sm font-medium text-center p-4">
                  [Insert GIF: Furniture Placement]
                  <br/>
                  <span className="text-xs opacity-75">(e.g., /assets/step2-design.gif)</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">2. Furnish & Style</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Open the catalog and drag furniture into your room. Use the properties panel to resize items, change colors, and position them precisely in 2D or 3D view.
              </p>
              <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-2 list-disc pl-5">
                <li>Browse furniture with type filtering.</li>
                <li>Drag & drop items with collision checks.</li>
                <li>Fine-tune position, scale, and colors.</li>
              </ul>
            </motion.div>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{...scrollAnimation, visible: { ...scrollAnimation.visible, transition: { duration: 0.8, delay: 0.4 } }}}
              className="bg-white/60 dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-2xl p-6 shadow-xl flex flex-col transition-colors duration-300"
            >
              <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-xl mb-6 flex items-center justify-center relative overflow-hidden group">
                <div className="text-gray-500 dark:text-gray-400 text-sm font-medium text-center p-4">
                  [Insert GIF: 3D Walkthrough]
                  <br/>
                  <span className="text-xs opacity-75">(e.g., /assets/step3-visualize.gif)</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">3. Visualize & Save</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Experience your design in immersive 3D. Save your project to your portfolio to share with clients or edit later.
              </p>
              <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-2 list-disc pl-5">
                <li>Toggle immersive 3D visualization.</li>
                <li>Generate cost estimates for furniture.</li>
                <li>Capture snapshots of your design.</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="py-20 bg-transparent border-t border-black/10 dark:border-white/10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white mb-4">
              Comprehensive System Capabilities
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Built with advanced tools to streamline your interior design process from concept to completion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Smart Collision Logic",
                desc: "Intelligent algorithms prevent furniture overlap and ensure realistic placement within room boundaries.",
                icon: <BoxSelect className="h-6 w-6" />,
                color: "text-blue-600 dark:text-blue-400",
                bg: "bg-blue-100 dark:bg-blue-900/30"
              },
              {
                title: "Real-time Costing",
                desc: "Instant budget estimation updates as you add or remove furniture items from your design.",
                icon: <CircleDollarSign className="h-6 w-6" />,
                color: "text-green-600 dark:text-green-400",
                bg: "bg-green-100 dark:bg-green-900/30"
              },
              {
                title: "Custom Textures",
                desc: "Upload your own texture files to visualize specific wallpapers, floorings, or fabric patterns.",
                icon: <Image className="h-6 w-6" />,
                color: "text-purple-600 dark:text-purple-400",
                bg: "bg-purple-100 dark:bg-purple-900/30"
              },
              {
                title: "Dual-View Workspace",
                desc: "Seamlessly toggle between precise 2D floor planning and immersive 3D walkthrough modes.",
                icon: <Layout className="h-6 w-6" />,
                color: "text-amber-600 dark:text-amber-400",
                bg: "bg-amber-100 dark:bg-amber-900/30"
              },
              {
                title: "Snapshot & Checkout",
                desc: "Capture high-res renderings of your design and export furniture lists for purchasing.",
                icon: <CreditCard className="h-6 w-6" />,
                color: "text-red-600 dark:text-red-400",
                bg: "bg-red-100 dark:bg-red-900/30"
              },
              {
                title: "Responsive Studio",
                desc: "Access your designs from anywhere with a fully responsive interface adapted for tablets and desktops.",
                icon: <MonitorSmartphone className="h-6 w-6" />,
                color: "text-cyan-600 dark:text-cyan-400",
                bg: "bg-cyan-100 dark:bg-cyan-900/30"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white/60 dark:bg-black/40 p-6 rounded-xl shadow-xl border border-black/10 dark:border-white/10 hover:shadow-2xl transition-shadow backdrop-blur-md">
                <div className={`w-12 h-12 ${feature.bg} rounded-lg flex items-center justify-center mb-4 ${feature.color}`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <footer className="bg-white/80 dark:bg-black/60 border-t border-black/10 dark:border-white/10 py-12 mt-auto transition-colors duration-300">
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
