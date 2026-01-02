import React, { useMemo } from 'react';
import {
  LayoutDashboard,
  BarChart3,
  Map,
  Clock,
  FileText,
  Settings,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import KPICard from '@/components/dashboard/KPICard';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useIncidents } from '@/hooks/useIncidents';

const navItems = [
  { label: 'Overview', icon: <LayoutDashboard className="w-5 h-5" />, path: '/executive' },
  { label: 'Analytics', icon: <BarChart3 className="w-5 h-5" />, path: '/executive/analytics' },
  { label: 'Heatmap', icon: <Map className="w-5 h-5" />, path: '/executive/heatmap' },
  { label: 'SLA Performance', icon: <Clock className="w-5 h-5" />, path: '/executive/sla' },
  { label: 'Reports', icon: <FileText className="w-5 h-5" />, path: '/executive/reports' },
  { label: 'Settings', icon: <Settings className="w-5 h-5" />, path: '/executive/settings' },
];

const weekdayShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const PlaceholderSection: React.FC<{ title: string; description: string }> = ({ title, description }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.25 }}
    className="bg-white rounded-xl shadow-card p-6"
  >
    <h2 className="heading-2 text-[#0F172A] mb-2">{title}</h2>
    <p className="text-sm text-[#6B7280] mb-4 max-w-xl">{description}</p>
    <p className="text-xs text-[#9CA3AF] uppercase tracking-wide">Executive module · SafeText</p>
  </motion.div>
);

const ExecutiveDashboard: React.FC = () => {
  const { data: incidents = [] } = useIncidents(7);
  const location = useLocation();
  const path = location.pathname;

  const {
    totalIncidents,
    avgResponseMinutes,
    resolutionRate,
    slaCompliance,
    trendData,
    categoryData,
    zoneSlaData,
  } = useMemo(() => {
    if (!incidents.length) {
      return {
        totalIncidents: 0,
        avgResponseMinutes: 0,
        resolutionRate: 0,
        slaCompliance: 0,
        trendData: weekdayShort.map((d) => ({ name: d, incidents: 0 })),
        categoryData: [] as { name: string; value: number; color: string }[],
        zoneSlaData: [] as { zone: string; withinSla: number; dueSoon: number; overdue: number }[],
      };
    }

    const total = incidents.length;

    let responseSumMs = 0;
    let responseCount = 0;
    let resolvedCount = 0;
    let slaMetCount = 0;
    const trendMap: Record<string, number> = {};
    const categoryMap: Record<string, number> = {};
    const zoneMap: Record<string, { within: number; dueSoon: number; overdue: number }> = {};
    const now = new Date();

    incidents.forEach((inc) => {
      const dayName = weekdayShort[inc.reportedAt.getDay()];
      trendMap[dayName] = (trendMap[dayName] ?? 0) + 1;

      const catKey = inc.category || 'Other';
      categoryMap[catKey] = (categoryMap[catKey] ?? 0) + 1;

      const responseAt = inc.acknowledgedAt || inc.resolvedAt;
      if (responseAt) {
        responseSumMs += responseAt.getTime() - inc.reportedAt.getTime();
        responseCount += 1;
      }

      if (inc.status === 'resolved') {
        resolvedCount += 1;
        if (inc.slaDueAt && inc.resolvedAt && inc.resolvedAt.getTime() <= inc.slaDueAt.getTime()) {
          slaMetCount += 1;
        }
      }

      const zoneKey = inc.zone || 'Unmapped';
      if (!zoneMap[zoneKey]) {
        zoneMap[zoneKey] = { within: 0, dueSoon: 0, overdue: 0 };
      }

      const hasSla = !!inc.slaDueAt;
      if (hasSla) {
        const dueAt = inc.slaDueAt as Date;
        const timeToDue = dueAt.getTime() - now.getTime();
        const isOverdue = (inc.status !== 'resolved' && now > dueAt) || (inc.resolvedAt && inc.resolvedAt > dueAt);
        const isWithin = inc.status === 'resolved' && inc.resolvedAt && inc.resolvedAt <= dueAt;
        const isDueSoon = !isWithin && !isOverdue && timeToDue <= 2 * 60 * 60 * 1000; // within 2h

        if (isOverdue) zoneMap[zoneKey].overdue += 1;
        else if (isDueSoon) zoneMap[zoneKey].dueSoon += 1;
        else zoneMap[zoneKey].within += 1;
      }
    });

    const avgMinutes = responseCount ? responseSumMs / responseCount / 60000 : 0;
    const resolutionPct = total ? (resolvedCount / total) * 100 : 0;
    const slaPct = resolvedCount ? (slaMetCount / resolvedCount) * 100 : 0;

    const trendData = weekdayShort.map((name) => ({
      name,
      incidents: trendMap[name] ?? 0,
    }));

    const categoryEntries = Object.entries(categoryMap);
    const catTotal = categoryEntries.reduce((sum, [, count]) => sum + count, 0) || 1;
    const categoryData = categoryEntries.map(([name, count]) => ({
      name,
      value: Math.round((count / catTotal) * 100),
      color:
        name.toLowerCase().includes('harass') || name.toLowerCase().includes('assault')
          ? '#E02424'
          : name.toLowerCase().includes('medical')
          ? '#F97316'
          : name.toLowerCase().includes('theft')
          ? '#FBBF24'
          : name.toLowerCase().includes('infra')
          ? '#2563EB'
          : '#10B981',
    }));

    const zoneSlaData = Object.entries(zoneMap).map(([zone, vals]) => {
      const totalZone = vals.within + vals.dueSoon + vals.overdue || 1;
      const withinPct = Math.round((vals.within / totalZone) * 100);
      const duePct = Math.round((vals.dueSoon / totalZone) * 100);
      const overPct = Math.max(0, 100 - withinPct - duePct);
      return {
        zone,
        withinSla: withinPct,
        dueSoon: duePct,
        overdue: overPct,
      };
    });

    return {
      totalIncidents: total,
      avgResponseMinutes: avgMinutes,
      resolutionRate: resolutionPct,
      slaCompliance: slaPct,
      trendData,
      categoryData,
      zoneSlaData,
    };
  }, [incidents]);

  let pageTitle = 'Executive Overview';
  let content: React.ReactNode = (
    <>
      {/* Read-Only Badge */}
      <div className="mb-6 inline-flex items-center gap-2 px-3 py-1.5 bg-accent/10 text-accent rounded-full text-sm font-medium">
        <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
        Read-Only Access
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Total Incidents"
          value={totalIncidents.toLocaleString()}
          change={0}
          trend="up"
          icon={<AlertTriangle className="w-6 h-6" />}
        />
        <KPICard
          title="Avg Response Time"
          value={`${avgResponseMinutes.toFixed(1)} min`}
          change={0}
          trend="down"
          icon={<Clock className="w-6 h-6" />}
        />
        <KPICard
          title="Resolution Rate"
          value={`${resolutionRate.toFixed(1)}%`}
          change={0}
          trend="up"
          icon={<CheckCircle className="w-6 h-6" />}
        />
        <KPICard
          title="SLA Compliance"
          value={`${slaCompliance.toFixed(1)}%`}
          change={0}
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
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
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
                  borderRadius: '8px',
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
            {!categoryData.length && (
              <p className="text-sm text-[#6B7280]">No incident data available for this period.</p>
            )}
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
            {zoneSlaData.length ? (
              zoneSlaData.map((zone, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#0F172A] font-medium">{zone.zone}</span>
                    <span className="text-[#6B7280]">{zone.withinSla}% within SLA</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden flex">
                    <div className="bg-severity-low h-full" style={{ width: `${zone.withinSla}%` }} />
                    <div className="bg-severity-medium h-full" style={{ width: `${zone.dueSoon}%` }} />
                    <div className="bg-severity-critical h-full" style={{ width: `${zone.overdue}%` }} />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-[#6B7280]">No SLA data available for this period.</p>
            )}
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
              <p className="text-sm text-[#6B7280] mt-1">Harassment incidents up this week</p>
            </div>
            <div className="p-4 bg-severity-critical/5 rounded-lg border-l-4 border-severity-critical">
              <p className="text-sm text-[#0F172A] font-medium">Risk Zone</p>
              <p className="text-sm text-[#6B7280] mt-1">Zones with lower SLA need attention</p>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );

  if (path.startsWith('/executive/analytics')) {
    pageTitle = 'Executive Analytics';
    content = (
      <PlaceholderSection
        title="Executive Analytics"
        description="Deeper trend analysis, cohort breakdowns, and executive-ready exports will appear here."
      />
    );
  } else if (path.startsWith('/executive/heatmap')) {
    pageTitle = 'Risk Heatmap';
    content = (
      <PlaceholderSection
        title="Risk Heatmap"
        description="Visualize incident density and severity across all zones in real time."
      />
    );
  } else if (path.startsWith('/executive/sla')) {
    pageTitle = 'SLA Performance';
    content = (
      <PlaceholderSection
        title="SLA Performance"
        description="Track SLA performance, breach patterns, and long-term reliability metrics."
      />
    );
  } else if (path.startsWith('/executive/reports')) {
    pageTitle = 'Reports';
    content = (
      <PlaceholderSection
        title="Reports"
        description="Generate board-ready reports summarizing incident volume, risk, and SLA performance."
      />
    );
  } else if (path.startsWith('/executive/settings')) {
    pageTitle = 'Executive Settings';
    content = (
      <PlaceholderSection
        title="Executive Settings"
        description="Configure executive-level alerts, digests, and escalation notifications."
      />
    );
  }

  return (
    <DashboardLayout
      role="executive"
      roleLabel="Executive"
      navItems={navItems}
      pageTitle={pageTitle}
    >
      {content}
    </DashboardLayout>
  );
};

export default ExecutiveDashboard;
