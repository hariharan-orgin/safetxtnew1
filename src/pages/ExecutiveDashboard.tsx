import React from 'react';
import { 
  LayoutDashboard, 
  BarChart3, 
  Map, 
  Clock, 
  FileText, 
  Settings,
  TrendingUp,
  Users,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import KPICard from '@/components/dashboard/KPICard';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const navItems = [
  { label: 'Overview', icon: <LayoutDashboard className="w-5 h-5" />, path: '/executive' },
  { label: 'Analytics', icon: <BarChart3 className="w-5 h-5" />, path: '/executive/analytics' },
  { label: 'Heatmap', icon: <Map className="w-5 h-5" />, path: '/executive/heatmap' },
  { label: 'SLA Performance', icon: <Clock className="w-5 h-5" />, path: '/executive/sla' },
  { label: 'Reports', icon: <FileText className="w-5 h-5" />, path: '/executive/reports' },
  { label: 'Settings', icon: <Settings className="w-5 h-5" />, path: '/executive/settings' },
];

const trendData = [
  { name: 'Mon', incidents: 24 },
  { name: 'Tue', incidents: 31 },
  { name: 'Wed', incidents: 28 },
  { name: 'Thu', incidents: 42 },
  { name: 'Fri', incidents: 35 },
  { name: 'Sat', incidents: 18 },
  { name: 'Sun', incidents: 12 },
];

const categoryData = [
  { name: 'Harassment', value: 35, color: '#E02424' },
  { name: 'Medical', value: 25, color: '#F97316' },
  { name: 'Theft', value: 20, color: '#FBBF24' },
  { name: 'Infrastructure', value: 12, color: '#2563EB' },
  { name: 'Suspicious', value: 8, color: '#10B981' },
];

const ExecutiveDashboard: React.FC = () => {
  return (
    <DashboardLayout
      role="executive"
      roleLabel="Executive"
      navItems={navItems}
      pageTitle="Executive Overview"
    >
      {/* Read-Only Badge */}
      <div className="mb-6 inline-flex items-center gap-2 px-3 py-1.5 bg-accent/10 text-accent rounded-full text-sm font-medium">
        <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
        Read-Only Access
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Total Incidents"
          value="2,847"
          change={8}
          trend="up"
          icon={<AlertTriangle className="w-6 h-6" />}
        />
        <KPICard
          title="Avg Response Time"
          value="4.2 min"
          change={-15}
          trend="down"
          icon={<Clock className="w-6 h-6" />}
        />
        <KPICard
          title="Resolution Rate"
          value="94.7%"
          change={3}
          trend="up"
          icon={<CheckCircle className="w-6 h-6" />}
        />
        <KPICard
          title="SLA Compliance"
          value="97.2%"
          change={2}
          trend="up"
          icon={<TrendingUp className="w-6 h-6" />}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white rounded-xl shadow-card p-6"
        >
          <h2 className="heading-2 text-[#0F172A] mb-6">Incident Trends</h2>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
              <YAxis stroke="#6B7280" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="incidents" 
                stroke="#2563EB" 
                strokeWidth={3}
                dot={{ fill: '#2563EB', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#2563EB' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-card p-6"
        >
          <h2 className="heading-2 text-[#0F172A] mb-6">Categories</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-4">
            {categoryData.map((cat, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-[#6B7280]">{cat.name}</span>
                </div>
                <span className="text-[#0F172A] font-medium">{cat.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* SLA Performance & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SLA Performance */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white rounded-xl shadow-card p-6"
        >
          <h2 className="heading-2 text-[#0F172A] mb-6">SLA Performance by Zone</h2>
          <div className="space-y-4">
            {[
              { zone: 'Zone A', withinSla: 92, dueSoon: 5, overdue: 3 },
              { zone: 'Zone B', withinSla: 88, dueSoon: 8, overdue: 4 },
              { zone: 'Zone C', withinSla: 95, dueSoon: 3, overdue: 2 },
              { zone: 'Zone D', withinSla: 78, dueSoon: 12, overdue: 10 },
            ].map((zone, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#0F172A] font-medium">{zone.zone}</span>
                  <span className="text-[#6B7280]">{zone.withinSla}% within SLA</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden flex">
                  <div 
                    className="bg-severity-low h-full" 
                    style={{ width: `${zone.withinSla}%` }} 
                  />
                  <div 
                    className="bg-severity-medium h-full" 
                    style={{ width: `${zone.dueSoon}%` }} 
                  />
                  <div 
                    className="bg-severity-critical h-full" 
                    style={{ width: `${zone.overdue}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-6 mt-6 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-severity-low" />
              <span className="text-[#6B7280]">Within SLA</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-severity-medium" />
              <span className="text-[#6B7280]">Due Soon</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-severity-critical" />
              <span className="text-[#6B7280]">Overdue</span>
            </div>
          </div>
        </motion.div>

        {/* Key Insights */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-card p-6"
        >
          <h2 className="heading-2 text-[#0F172A] mb-6">Key Insights</h2>
          <div className="space-y-4">
            <div className="p-4 bg-accent/5 rounded-lg border-l-4 border-accent">
              <p className="text-sm text-[#0F172A] font-medium">Peak Hours</p>
              <p className="text-sm text-[#6B7280] mt-1">Incidents peak between 6 PM – 9 PM daily</p>
            </div>
            <div className="p-4 bg-severity-high/5 rounded-lg border-l-4 border-severity-high">
              <p className="text-sm text-[#0F172A] font-medium">Rising Trend</p>
              <p className="text-sm text-[#6B7280] mt-1">Harassment incidents up 12% this week</p>
            </div>
            <div className="p-4 bg-severity-critical/5 rounded-lg border-l-4 border-severity-critical">
              <p className="text-sm text-[#0F172A] font-medium">Risk Zone</p>
              <p className="text-sm text-[#6B7280] mt-1">Zone D requires attention - SLA at 78%</p>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default ExecutiveDashboard;
