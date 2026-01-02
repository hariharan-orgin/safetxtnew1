import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { UserRole } from '@/contexts/AuthContext';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';

interface NavItem {
  label: string;
  icon: ReactNode;
  path: string;
}

interface DashboardLayoutProps {
  children: ReactNode;
  role: UserRole;
  roleLabel: string;
  navItems: NavItem[];
  pageTitle: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  role,
  roleLabel,
  navItems,
  pageTitle,
}) => {
  return (
    <div className="min-h-screen dashboard-bg">
      <DashboardSidebar role={role} navItems={navItems} roleLabel={roleLabel} />
      
      <div className="ml-64">
        <DashboardHeader pageTitle={pageTitle} />
        
        <main className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
