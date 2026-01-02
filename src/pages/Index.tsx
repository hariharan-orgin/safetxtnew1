import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, ArrowRight, Lock, Users, BarChart3, Radio } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: <Lock className="w-6 h-6" />,
    title: 'Secure Authentication',
    description: 'Role-based access control with multi-factor authentication support.',
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Team Management',
    description: 'Manage admins, executives, control room operators, and field teams.',
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: 'Real-Time Analytics',
    description: 'Live dashboards with incident trends and SLA performance metrics.',
  },
  {
    icon: <Radio className="w-6 h-6" />,
    title: 'Live Operations',
    description: 'Two-way messaging and incident dispatch in real-time.',
  },
];

const roles = [
  { name: 'Admin', color: 'from-red-500 to-red-600', description: 'Full system control' },
  { name: 'Executive', color: 'from-blue-500 to-blue-600', description: 'Analytics view' },
  { name: 'Control Room', color: 'from-orange-500 to-orange-600', description: 'Live dispatch' },
  { name: 'Field Team', color: 'from-green-500 to-green-600', description: 'On-ground response' },
];

const Index: React.FC = () => {
  return (
    <div className="min-h-screen auth-gradient overflow-hidden">
      {/* Navigation */}
      <nav className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-semibold text-xl">SafeText</span>
          </div>
          <Link to="/auth">
            <Button variant="auth-outline" size="sm">
              Sign In
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 pt-16 pb-24">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/80 text-sm mb-8"
            >
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Security Operations Platform
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Unified Safety & 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300"> Security Operations</span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/70 mb-10 max-w-2xl mx-auto">
              Role-based dashboards for complete security management. From incident detection to field response, manage your entire security operation in one platform.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/auth">
                <Button variant="auth" size="xl" className="group">
                  Get Started
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button variant="auth-outline" size="xl">
                View Demo
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-1/4 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl translate-x-1/2" />
      </section>

      {/* Role Badges */}
      <section className="relative px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
              Four Specialized Dashboards
            </h2>
            <p className="text-white/60">
              Each role gets a tailored experience designed for their specific needs
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {roles.map((role, i) => (
              <motion.div
                key={role.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity rounded-xl blur-xl"
                  style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }}
                />
                <div className={`relative bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/10 hover:border-white/20 transition-all`}>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${role.color} mx-auto mb-4 flex items-center justify-center`}>
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-white font-semibold mb-1">{role.name}</h3>
                  <p className="text-white/50 text-sm">{role.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative px-6 py-16 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white mb-4 group-hover:bg-white/20 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-white/60">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative px-6 py-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white/60 text-sm">
            <Shield className="w-4 h-4" />
            <span>SafeText Security Operations Platform</span>
          </div>
          <p className="text-white/40 text-sm">© 2026 SafeText. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
