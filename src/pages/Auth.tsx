import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthCard from '@/components/auth/AuthCard';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <AuthCard
      title="Security Operations"
      subtitle={isLogin ? "Sign in to access the dashboard" : "Create your account"}
    >
      <AnimatePresence mode="wait">
        {isLogin ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
          >
            <LoginForm />
          </motion.div>
        ) : (
          <motion.div
            key="signup"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <SignupForm />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-6 text-center">
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-[#6B7280] hover:text-[#2563EB] transition-colors text-sm"
        >
          {isLogin ? (
            <>Don't have an account? <span className="font-medium text-[#2563EB]">Sign up</span></>
          ) : (
            <>Already have an account? <span className="font-medium text-[#2563EB]">Sign in</span></>
          )}
        </button>
      </div>
    </AuthCard>
  );
};

export default Auth;
