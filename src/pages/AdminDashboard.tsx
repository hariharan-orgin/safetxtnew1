import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  AlertTriangle, 
  Route, 
  Link2, 
  FileText, 
  BarChart3, 
  Settings,
  Shield,
  Clock,
  AlertCircle,
  Activity
} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import KPICard from '@/components/dashboard/KPICard';
import { motion } from 'framer-motion';

const navItems = [
  { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/admin' },
  { label: 'User Management', icon: <Users className="w-5 h-5" />, path: '/admin/users' },
  { label: 'Incident Control', icon: <AlertTriangle className="w-5 h-5" />, path: '/admin/incidents' },
  { label: 'Routing & SLA', icon: <Route className="w-5 h-5" />, path: '/admin/routing' },
  { label: 'Integrations', icon: <Link2 className="w-5 h-5" />, path: '/admin/integrations' },
  { label: 'Audit Logs', icon: <FileText className="w-5 h-5" />, path: '/admin/audit' },
  { label: 'Analytics', icon: <BarChart3 className="w-5 h-5" />, path: '/admin/analytics' },
  { label: 'Settings', icon: <Settings className="w-5 h-5" />, path: '/admin/settings' },
];

const AdminOverview: React.FC = () => (
  <>
    {/* KPI Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <KPICard
        title="Total Users"
        value="1,247"
        change={12}
        trend="up"
        icon={<Users className="w-6 h-6" />}
      />
      <KPICard
        title="Active Incidents"
        value="43"
        change={-8}
        trend="down"
        icon={<AlertTriangle className="w-6 h-6" />}
      />
      <KPICard
        title="SLA Breaches"
        value="3"
        change={-25}
        trend="down"
        icon={<Clock className="w-6 h-6" />}
      />
      <KPICard
        title="System Uptime"
        value="99.9%"
        trend="neutral"
        icon={<Activity className="w-6 h-6" />}
      />
    </div>

    {/* Main Content Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* User Management Quick View */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="lg:col-span-2 bg-white rounded-xl shadow-card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="heading-2 text-[#0F172A]">User Management</h2>
          <button className="text-accent text-sm font-medium hover:underline">View all</button>
        </div>
        {/* existing table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-[#6B7280] text-sm border-b border-gray-100">
                <th className="pb-3 font-medium">User</th>
                <th className="pb-3 font-medium">Role</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Last Active</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {[
                { name: 'John Smith', email: 'john@safetext.io', role: 'Admin', status: 'Active', lastActive: '2 min ago' },
                { name: 'Sarah Johnson', email: 'sarah@safetext.io', role: 'Executive', status: 'Active', lastActive: '15 min ago' },
                { name: 'Mike Chen', email: 'mike@safetext.io', role: 'Control Room', status: 'Active', lastActive: '1 hr ago' },
                { name: 'Emily Brown', email: 'emily@safetext.io', role: 'Field Team', status: 'Offline', lastActive: '3 hrs ago' },
              ].map((user, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center text-xs font-medium">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-[#0F172A]">{user.name}</p>
                        <p className="text-[#6B7280] text-xs">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-[#0F172A]">{user.role}</td>
                  <td className="py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      user.status === 'Active' 
                        ? 'bg-severity-low/10 text-severity-low' 
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4 text-[#6B7280]">{user.lastActive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* System Status */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-card p-6"
      >
        <h2 className="heading-2 text-[#0F172A] mb-6">System Status</h2>
        <div className="space-y-4">
          {[
            { name: 'API Server', status: 'Operational', color: 'bg-severity-low' },
            { name: 'Database', status: 'Operational', color: 'bg-severity-low' },
            { name: 'SMS Gateway', status: 'Operational', color: 'bg-severity-low' },
            { name: 'Webhook Service', status: 'Degraded', color: 'bg-severity-medium' },
          ].map((service, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${service.color}`} />
                <span className="text-[#0F172A] font-medium text-sm">{service.name}</span>
              </div>
              <span className="text-[#6B7280] text-xs">{service.status}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>

    {/* Audit Log Preview */}
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mt-6 bg-white rounded-xl shadow-card p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="heading-2 text-[#0F172A]">Recent Audit Logs</h2>
        <button className="text-accent text-sm font-medium hover:underline">View all</button>
      </div>
      <div className="space-y-3">
        {[
          { actor: 'John Smith', action: 'Updated SLA configuration', time: '5 min ago', type: 'config' },
          { actor: 'System', action: 'Auto-escalated incident #1234', time: '12 min ago', type: 'escalation' },
          { actor: 'Sarah Johnson', action: 'Created new user account', time: '1 hr ago', type: 'user' },
          { actor: 'Mike Chen', action: 'Resolved incident #1230', time: '2 hrs ago', type: 'incident' },
        ].map((log, i) => (
          <div key={i} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
                {log.type === 'config' && <Settings className="w-4 h-4" />}
                {log.type === 'escalation' && <AlertCircle className="w-4 h-4" />}
                {log.type === 'user' && <Users className="w-4 h-4" />}
                {log.type === 'incident' && <Shield className="w-4 h-4" />}
              </div>
              <div>
                <p className="text-[#0F172A] text-sm font-medium">{log.action}</p>
                <p className="text-[#6B7280] text-xs">by {log.actor}</p>
              </div>
            </div>
            <span className="text-[#6B7280] text-xs">{log.time}</span>
          </div>
        ))}
      </div>
    </motion.div>
  </>
);

const PlaceholderSection: React.FC<{ title: string; description: string }> = ({ title, description }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.25 }}
    className="bg-white rounded-xl shadow-card p-6"
  >
    <h2 className="heading-2 text-[#0F172A] mb-2">{title}</h2>
    <p className="text-sm text-[#6B7280] mb-4 max-w-xl">{description}</p>
    <p className="text-xs text-[#9CA3AF] uppercase tracking-wide">Admin module · SafeText</p>
  </motion.div>
);

const AdminDashboard: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  let content: React.ReactNode = <AdminOverview />;
  let pageTitle = 'Admin Dashboard';

  if (path.startsWith('/admin/users')) {
    pageTitle = 'User Management';
    content = (
      <PlaceholderSection
        title="User Management"
        description="Manage administrators, executives, control room operators, and field team accounts. In the full version this section will connect to Firebase users and Firestore roles."
      />
    );
  } else if (path.startsWith('/admin/incidents')) {
    pageTitle = 'Incident Control';
    content = (
      <PlaceholderSection
        title="Incident Control"
        description="Configure incident routing, triage rules, and escalations across all zones."
      />
    );
  } else if (path.startsWith('/admin/routing')) {
    pageTitle = 'Routing & SLA';
    content = (
      <PlaceholderSection
        title="Routing & SLA"
        description="Define response targets, escalation windows, and risk-based routing paths for incidents."
      />
    );
  } else if (path.startsWith('/admin/integrations')) {
    pageTitle = 'Integrations';
    content = (
      <PlaceholderSection
        title="Integrations"
        description="Connect SafeText to SMS gateways, WhatsApp, incident ticketing, and observability tools."
      />
    );
  } else if (path.startsWith('/admin/audit')) {
    pageTitle = 'Audit Logs';
    content = (
      <PlaceholderSection
        title="Audit Logs"
        description="Review configuration changes, access events, and security-sensitive actions across the platform."
      />
    );
  } else if (path.startsWith('/admin/analytics')) {
    pageTitle = 'Admin Analytics';
    content = (
      <PlaceholderSection
        title="Admin Analytics"
        description="Monitor platform usage, role distribution, and system health for your SafeText deployment."
      />
    );
  } else if (path.startsWith('/admin/settings')) {
    pageTitle = 'Admin Settings';
    content = (
      <PlaceholderSection
        title="Admin Settings"
        description="Control organization-wide configuration, security policies, and advanced SafeText options."
      />
    );
  }

  return (
    <DashboardLayout
      role="admin"
      roleLabel="Admin"
      navItems={navItems}
      pageTitle={pageTitle}
    >
      {content}
    </DashboardLayout>
  );
};

export default AdminDashboard;
