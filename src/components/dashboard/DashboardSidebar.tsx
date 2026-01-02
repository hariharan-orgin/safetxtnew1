import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, LogOut } from 'lucide-react';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

interface DashboardSidebarProps {
  role: UserRole;
  navItems: NavItem[];
  roleLabel: string;
}

const getRoleBadgeColor = (role: UserRole) => {
  switch (role) {
    case 'admin':
      return 'bg-severity-critical/10 text-severity-critical border-severity-critical/20';
    case 'executive':
      return 'bg-accent/10 text-accent border-accent/20';
    case 'control_room':
      return 'bg-severity-high/10 text-severity-high border-severity-high/20';
    case 'field_team':
      return 'bg-severity-low/10 text-severity-low border-severity-low/20';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ role, navItems, roleLabel }) => {
  const { logout, user } = useAuth();
  const location = useLocation();

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed left-0 top-0 h-screen w-64 bg-sidebar flex flex-col border-r border-sidebar-border"
    >
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-sidebar-primary flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sidebar-foreground font-semibold text-lg">SafeText</h1>
            <span className={cn(
              "text-xs px-2 py-0.5 rounded-full border",
              getRoleBadgeColor(role)
            )}>
              {roleLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <NavLink
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <span className={cn(
                  "transition-colors",
                  isActive ? "text-accent" : "text-sidebar-foreground/50 group-hover:text-sidebar-foreground/80"
                )}>
                  {item.icon}
                </span>
                <span className="font-medium">{item.label}</span>
              </NavLink>
            </motion.div>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-sidebar-accent/30">
          <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-white font-medium text-sm">
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sidebar-foreground font-medium text-sm truncate">
              {user?.username || 'User'}
            </p>
            <p className="text-sidebar-foreground/50 text-xs truncate">
              {user?.email || 'user@example.com'}
            </p>
          </div>
          <button
            onClick={logout}
            className="p-2 text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.aside>
  );
};

export default DashboardSidebar;
