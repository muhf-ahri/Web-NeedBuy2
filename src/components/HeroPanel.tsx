import React from 'react';
import { motion } from 'framer-motion';

const HeroPanel: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="hidden md:flex md:w-2/5 bg-gradient-to-br from-blue-100 via-slate-100 to-blue-50 p-8 flex-col justify-between relative overflow-hidden"
    >
      {/* Elemen dekoratif soft */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-200/30 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-slate-200/20 rounded-full translate-x-1/3 translate-y-1/3" />
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-100/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
      
      <div className="relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center text-gray-800"
        >
          <span className="text-2xl font-bold">NeedBuy</span>
        </motion.div>
      </div>

      <div className="relative z-10 pb-8 text-gray-800">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold leading-tight"
        >
          Precision Engineered Commerce.
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-3 text-sm leading-relaxed text-gray-600"
        >
          Join thousands of professionals streamlining their procurement
          process with unparalleled clarity.
        </motion.p>
      </div>
    </motion.div>
  );
};

export default HeroPanel;