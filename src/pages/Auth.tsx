import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthCard from '@/components/auth/AuthCard';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { loginAsDemo, isLoading } = useAuth();

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

      {/* Demo logins per role */}
      <div className="mt-6 border-t border-gray-100 pt-4">
        <p className="text-xs uppercase tracking-wide text-[#6B7280] mb-2 text-left">Quick demo logins</p>
        <p className="text-xs text-[#9CA3AF] mb-3 text-left">
          Instantly explore each role-specific dashboard using demo accounts.
        </p>
        <div className="grid grid-cols-2 gap-2 text-left">
          <Button
            variant="outline"
            size="sm"
            className="justify-start"
            disabled={isLoading}
            onClick={() => loginAsDemo('admin')}
          >
            Admin Dashboard
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="justify-start"
            disabled={isLoading}
            onClick={() => loginAsDemo('executive')}
          >
            Executive Dashboard
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="justify-start"
            disabled={isLoading}
            onClick={() => loginAsDemo('control_room')}
          >
            Control Room
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="justify-start"
            disabled={isLoading}
            onClick={() => loginAsDemo('field_team')}
          >
            Field Team
          </Button>
        </div>
      </div>
    </AuthCard>
  );
};

export default Auth;
