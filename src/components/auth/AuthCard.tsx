import React, { ReactNode } from 'react';
import { Shield } from 'lucide-react';
import { motion } from 'framer-motion';

interface AuthCardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

const AuthCard: React.FC<AuthCardProps> = ({ 
  children, 
  title = "Security Operations",
  subtitle = "Sign in to access the dashboard"
}) => {
  return (
    <div className="min-h-screen auth-gradient flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-card-hover p-8 space-y-6">
          {/* Logo & Header */}
          <div className="text-center space-y-3">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0F172A] to-[#1E3A8A]"
            >
              <Shield className="w-8 h-8 text-white" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <h1 className="heading-2 text-[#0F172A]">{title}</h1>
              <p className="text-[#6B7280] body-text mt-1">{subtitle}</p>
            </motion.div>
          </div>

          {/* Form Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            {children}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthCard;
