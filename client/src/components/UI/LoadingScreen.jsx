import React from 'react';
import { Armchair, Box, Layers } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center transition-colors duration-300">
      <div 
        className="absolute inset-0 z-[-1] bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/hero-bg.jpg')" }}
      />
      <div className="absolute inset-0 z-[-1] bg-gray-100/80 dark:bg-gray-900/80 backdrop-blur-sm" />

      <div className="flex gap-8 mb-12 relative z-10">
        
        <div className="w-24 h-24 bg-white/60 dark:bg-gray-800/60 rounded-lg animate-pulse shadow-md flex items-center justify-center border border-black/10 dark:border-white/10 backdrop-blur-md">
            <Armchair className="h-12 w-12 text-gray-500 dark:text-gray-400" />
        </div>
        <div className="w-24 h-24 bg-white/60 dark:bg-gray-800/60 rounded-lg animate-pulse shadow-md delay-75 flex items-center justify-center border border-black/10 dark:border-white/10 backdrop-blur-md">
            <Box className="h-12 w-12 text-gray-500 dark:text-gray-400" />
        </div>
        <div className="w-24 h-24 bg-white/60 dark:bg-gray-800/60 rounded-lg animate-pulse shadow-md delay-150 flex items-center justify-center border border-black/10 dark:border-white/10 backdrop-blur-md">
            <Layers className="h-12 w-12 text-gray-500 dark:text-gray-400" />
        </div>
      </div>
      <p className="text-gray-800 dark:text-gray-200 font-bold text-lg tracking-wide relative z-10 drop-shadow-md">
        Loading... Get ready to design!
      </p>
    </div>
  );
};

export default LoadingScreen;
