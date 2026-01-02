import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Map, 
  Clock, 
  Activity, 
  Settings,
  MapPin,
  User,
  FileText,
  Upload,
  Navigation,
  CheckCircle,
  Timer,
  Image as ImageIcon
} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import SeverityBadge from '@/components/dashboard/SeverityBadge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Assigned Cases', icon: <LayoutDashboard className="w-5 h-5" />, path: '/field-team' },
  { label: 'Map View', icon: <Map className="w-5 h-5" />, path: '/field-team/map' },
  { label: 'SLA Alerts', icon: <Clock className="w-5 h-5" />, path: '/field-team/sla' },
  { label: 'Activity Log', icon: <Activity className="w-5 h-5" />, path: '/field-team/activity' },
  { label: 'Settings', icon: <Settings className="w-5 h-5" />, path: '/field-team/settings' },
];

const assignedCases = [
  { id: 'INC-1234', severity: 'critical' as const, location: 'Zone A - Building 3', time: '5 min ago', status: 'Acknowledged', slaRemaining: '25 min', assignedBy: 'Dispatch' },
  { id: 'INC-1228', severity: 'high' as const, location: 'Zone B - East Wing', time: '18 min ago', status: 'On Route', slaRemaining: '42 min', assignedBy: 'Control Room' },
  { id: 'INC-1225', severity: 'medium' as const, location: 'Zone C - Cafeteria', time: '45 min ago', status: 'Arrived', slaRemaining: '1h 15min', assignedBy: 'Dispatch' },
];

const auditTrail = [
  { action: 'Case Created', actor: 'System', time: '2:30 PM' },
  { action: 'Escalated to Field Team', actor: 'Control Room', time: '2:32 PM' },
  { action: 'Assigned to Officer', actor: 'Dispatch', time: '2:33 PM' },
  { action: 'Acknowledged', actor: 'You', time: '2:35 PM' },
];

const FieldTeamDashboard: React.FC = () => {
  const [selectedCase, setSelectedCase] = useState(assignedCases[0]);
  const [fieldNotes, setFieldNotes] = useState('');
  const [isOnline, setIsOnline] = useState(true);
  const location = useLocation();
  const path = location.pathname;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Acknowledged':
        return 'bg-accent text-white';
      case 'On Route':
        return 'bg-severity-medium text-gray-900';
      case 'Arrived':
        return 'bg-severity-low text-white';
      default:
        return 'bg-gray-200 text-gray-700';
    }
  };

  let pageTitle = 'Assigned Cases';
  if (path.startsWith('/field-team/map')) {
    pageTitle = 'Map View';
  } else if (path.startsWith('/field-team/sla')) {
    pageTitle = 'SLA Alerts';
  } else if (path.startsWith('/field-team/activity')) {
    pageTitle = 'Activity Log';
  } else if (path.startsWith('/field-team/settings')) {
    pageTitle = 'Field Settings';
  }

  return (
    <DashboardLayout
      role="field_team"
      roleLabel="Field Team"
      navItems={navItems}
      pageTitle={pageTitle}
    >
      {/* Conditional content based on route */}
      {path === '/field-team' && (
        <>
          {/* Availability Toggle */}
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={() => setIsOnline(!isOnline)}
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                isOnline 
                  ? "bg-severity-low/10 text-severity-low hover:bg-severity-low/20" 
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              )}
            >
              <span className={cn(
                "w-2 h-2 rounded-full",
                isOnline ? "bg-severity-low animate-pulse" : "bg-gray-400"
              )} />
              {isOnline ? 'Available' : 'Offline'}
            </button>
            <div className="text-sm text-[#6B7280]">
              {assignedCases.length} assigned cases
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Case List */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-3"
            >
              {assignedCases.map((caseItem, i) => (
                <motion.div
                  key={caseItem.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelectedCase(caseItem)}
                  className={cn(
                    "bg-white rounded-xl shadow-card p-4 cursor-pointer transition-all duration-200 hover:shadow-card-hover",
                    selectedCase.id === caseItem.id && "ring-2 ring-accent"
                  )}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[#0F172A] font-semibold">{caseItem.id}</span>
                      <SeverityBadge severity={caseItem.severity} />
                    </div>
                    <span className={cn(
                      "text-xs px-2 py-1 rounded-full font-medium",
                      getStatusColor(caseItem.status)
                    )}>
                      {caseItem.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[#6B7280] text-sm mb-2">
                    <MapPin className="w-4 h-4" />
                    {caseItem.location}
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#6B7280]">
                    <span>Assigned by {caseItem.assignedBy}</span>
                    <span className={cn(
                      "font-medium",
                      caseItem.slaRemaining.includes('min') && parseInt(caseItem.slaRemaining) < 30 
                        ? "text-severity-critical" 
                        : ""
                    )}>
                      SLA: {caseItem.slaRemaining}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Case Detail Panel */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2 bg-white rounded-xl shadow-card overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-semibold text-[#0F172A]">{selectedCase.id}</span>
                    <SeverityBadge severity={selectedCase.severity} />
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Timer className="w-4 h-4 text-severity-critical" />
                    <span className="font-medium text-severity-critical">{selectedCase.slaRemaining}</span>
                  </div>
                </div>
                
                {/* Status Action Buttons */}
                <div className="grid grid-cols-4 gap-2">
                  <Button 
                    variant={selectedCase.status === 'Acknowledged' ? 'action' : 'outline'} 
                    size="sm"
                    className="text-xs"
                  >
                    Acknowledge
                  </Button>
                  <Button 
                    variant={selectedCase.status === 'On Route' ? 'action' : 'outline'} 
                    size="sm"
                    className="text-xs"
                  >
                    On Route
                  </Button>
                  <Button 
                    variant={selectedCase.status === 'Arrived' ? 'action' : 'outline'} 
                    size="sm"
                    className="text-xs"
                  >
                    Arrived
                  </Button>
                  <Button variant="action-success" size="sm" className="text-xs">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Resolve
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                {/* Left Column - Case Info */}
                <div className="p-6 space-y-6">
                  {/* Location */}
                  <div>
                    <h3 className="text-sm font-medium text-[#6B7280] mb-2">Location</h3>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[#0F172A] font-medium">{selectedCase.location}</p>
                        <button className="text-accent text-sm font-medium flex items-center gap-1 mt-1 hover:underline">
                          <Navigation className="w-3 h-3" />
                          Open in Maps
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Reporter */}
                  <div>
                    <h3 className="text-sm font-medium text-[#6B7280] mb-2">Reporter</h3>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[#0F172A] font-medium">+1 ***-***-4521</p>
                        <p className="text-xs text-[#6B7280]">Reported {selectedCase.time}</p>
                      </div>
                    </div>
                  </div>

                  {/* Attachments */}
                  <div>
                    <h3 className="text-sm font-medium text-[#6B7280] mb-2">Attachments</h3>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-gray-400" />
                      </div>
                      <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-gray-400" />
                      </div>
                      <button className="aspect-square border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-accent hover:text-accent transition-colors">
                        <Upload className="w-5 h-5" />
                        <span className="text-xs mt-1">Upload</span>
                      </button>
                    </div>
                  </div>

                  {/* Field Notes */}
                  <div>
                    <h3 className="text-sm font-medium text-[#6B7280] mb-2">Field Notes</h3>
                    <Textarea
                      placeholder="Add notes about the incident..."
                      value={fieldNotes}
                      onChange={(e) => setFieldNotes(e.target.value)}
                      className="min-h-[100px] resize-none"
                    />
                    <Button variant="outline" size="sm" className="mt-2">
                      <FileText className="w-4 h-4 mr-2" />
                      Save Notes
                    </Button>
                  </div>
                </div>

                {/* Right Column - Audit Trail */}
                <div className="p-6">
                  <h3 className="text-sm font-medium text-[#6B7280] mb-4">Audit Trail</h3>
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200" />
                    <div className="space-y-4">
                      {auditTrail.map((entry, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="relative pl-10"
                        >
                          <div className="absolute left-2.5 w-3 h-3 rounded-full bg-accent border-2 border-white" />
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-sm text-[#0F172A] font-medium">{entry.action}</p>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs text-[#6B7280]">{entry.actor}</span>
                              <span className="text-xs text-[#6B7280]">{entry.time}</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}

      {path.startsWith('/field-team/map') && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-3">
            {assignedCases.map((caseItem) => (
              <div
                key={caseItem.id}
                className="bg-white rounded-xl shadow-card p-4 flex items-start justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <SeverityBadge severity={caseItem.severity} />
                    <span className="text-sm font-semibold text-[#0F172A]">{caseItem.id}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                    <MapPin className="w-3 h-3" />
                    {caseItem.location}
                  </div>
                </div>
                <span className="text-xs text-[#6B7280]">SLA {caseItem.slaRemaining}</span>
              </div>
            ))}
          </div>
          <div className="lg:col-span-2 bg-white rounded-xl shadow-card p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <Map className="w-5 h-5 text-accent" />
              <h3 className="font-semibold text-[#0F172A]">Live incident map</h3>
            </div>
            <div className="flex-1 rounded-xl bg-gradient-to-br from-accent/5 via-accent/10 to-accent/5 border border-accent/20 flex items-center justify-center text-center px-6">
              <p className="text-sm text-[#6B7280] max-w-md">
                This is a simulated map view showing where your active cases are located. In a live deployment this
                would be connected to your mapping provider to give turn-by-turn navigation.
              </p>
            </div>
          </div>
        </div>
      )}

      {path.startsWith('/field-team/sla') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-card p-6">
            <h3 className="font-semibold text-[#0F172A] mb-2">SLA at risk</h3>
            <p className="text-sm text-[#6B7280] mb-4">
              Focus on the incidents that are closest to breaching their SLA.
            </p>
            <div className="space-y-3">
              {assignedCases.map((caseItem) => (
                <div
                  key={caseItem.id}
                  className="border border-gray-100 rounded-lg p-3 flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <SeverityBadge severity={caseItem.severity} />
                      <span className="text-sm font-semibold text-[#0F172A]">{caseItem.id}</span>
                    </div>
                    <p className="text-xs text-[#6B7280]">{caseItem.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[#6B7280] mb-1">Time left</p>
                    <p className="text-sm font-semibold text-severity-critical">{caseItem.slaRemaining}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-card p-6">
            <h3 className="font-semibold text-[#0F172A] mb-2">SLA policy overview</h3>
            <p className="text-sm text-[#6B7280]">
              This view is a preview of how SLA monitoring will look for your field teams. Configure thresholds and
              escalation rules in your production environment to match your organisation&apos;s response playbooks.
            </p>
          </div>
        </div>
      )}

      {path.startsWith('/field-team/activity') && (
        <div className="bg-white rounded-xl shadow-card p-6">
          <h3 className="font-semibold text-[#0F172A] mb-2">Latest activity</h3>
          <p className="text-sm text-[#6B7280] mb-4">
            A chronological view of what has happened on your active cases.
          </p>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200" />
            <div className="space-y-4">
              {auditTrail.map((entry, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="relative pl-10"
                >
                  <div className="absolute left-2.5 w-3 h-3 rounded-full bg-accent border-2 border-white" />
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-[#0F172A] font-medium">{entry.action}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-[#6B7280]">{entry.actor}</span>
                      <span className="text-xs text-[#6B7280]">{entry.time}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {path.startsWith('/field-team/settings') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-card p-6 space-y-4">
            <h3 className="font-semibold text-[#0F172A]">Availability</h3>
            <p className="text-sm text-[#6B7280]">
              Control whether you are available to receive new incident assignments.
            </p>
            <button
              onClick={() => setIsOnline(!isOnline)}
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                isOnline 
                  ? "bg-severity-low/10 text-severity-low hover:bg-severity-low/20" 
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              )}
            >
              <span className={cn(
                "w-2 h-2 rounded-full",
                isOnline ? "bg-severity-low animate-pulse" : "bg-gray-400"
              )} />
              {isOnline ? 'Available for dispatch' : 'Offline'}
            </button>
          </div>
          <div className="bg-white rounded-xl shadow-card p-6 space-y-3">
            <h3 className="font-semibold text-[#0F172A]">Notifications</h3>
            <p className="text-sm text-[#6B7280]">
              This section simulates how you&apos;ll manage alert preferences on mobile and web.
            </p>
            <ul className="space-y-2 text-sm text-[#6B7280]">
              <li>
                • Push notification on new assignment
              </li>
              <li>
                • SMS when SLA is under 15 minutes
              </li>
              <li>
                • Email summary at end of shift
              </li>
            </ul>
          </div>
        </div>
      )}
    </DashboardLayout>
   );
 };
 
 export default FieldTeamDashboard;
