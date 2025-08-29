// components/LoadingSpinner.tsx
import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex justify-center items-center h-64"
    >
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-200 rounded-full"
        ></motion.div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 left-0 w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"
        ></motion.div>
      </div>
      <span className="ml-4 text-gray-600">Loading news...</span>
    </motion.div>
  );
};

export default LoadingSpinner;