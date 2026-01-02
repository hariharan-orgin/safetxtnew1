import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Map, 
  AlertTriangle, 
  Clock, 
  Activity, 
  Settings,
  MessageSquare,
  User,
  MapPin,
  Send,
  Paperclip,
  ChevronRight
} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import SeverityBadge from '@/components/dashboard/SeverityBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Live Queue', icon: <LayoutDashboard className="w-5 h-5" />, path: '/control-room' },
  { label: 'Map View', icon: <Map className="w-5 h-5" />, path: '/control-room/map' },
  { label: 'Escalations', icon: <AlertTriangle className="w-5 h-5" />, path: '/control-room/escalations' },
  { label: 'SLA Alerts', icon: <Clock className="w-5 h-5" />, path: '/control-room/sla' },
  { label: 'Activity Log', icon: <Activity className="w-5 h-5" />, path: '/control-room/activity' },
  { label: 'Settings', icon: <Settings className="w-5 h-5" />, path: '/control-room/settings' },
];

const incidents = [
  { id: 'INC-1234', severity: 'critical' as const, location: 'Zone A - Building 3', time: '2 min ago', status: 'New', slaRemaining: '28 min', reporter: '+1 ***-***-4521' },
  { id: 'INC-1233', severity: 'high' as const, location: 'Zone B - Parking Lot', time: '8 min ago', status: 'In Progress', slaRemaining: '22 min', reporter: '+1 ***-***-8732' },
  { id: 'INC-1232', severity: 'medium' as const, location: 'Zone C - Main Entrance', time: '15 min ago', status: 'Assigned', slaRemaining: '45 min', reporter: '+1 ***-***-1254' },
  { id: 'INC-1231', severity: 'low' as const, location: 'Zone D - Garden Area', time: '23 min ago', status: 'In Progress', slaRemaining: '1h 12min', reporter: '+1 ***-***-9087' },
  { id: 'INC-1230', severity: 'high' as const, location: 'Zone A - Lobby', time: '31 min ago', status: 'Escalated', slaRemaining: '8 min', reporter: '+1 ***-***-3456' },
];

const messages = [
  { id: 1, sender: 'reporter', text: 'There is someone acting suspiciously near the entrance.', time: '2:34 PM' },
  { id: 2, sender: 'operator', text: 'Thank you for reporting. Can you describe the individual?', time: '2:35 PM' },
  { id: 3, sender: 'reporter', text: 'Male, wearing a dark hoodie, carrying a large bag.', time: '2:36 PM' },
  { id: 4, sender: 'operator', text: 'Understood. We are dispatching a field team now. Please stay at a safe distance.', time: '2:37 PM' },
];

const ControlRoomDashboard: React.FC = () => {
  const [selectedIncident, setSelectedIncident] = useState(incidents[0]);
  const [messageInput, setMessageInput] = useState('');
  const location = useLocation();
  const path = location.pathname;

  let pageTitle = 'Live Incident Queue';

  if (path.startsWith('/control-room/map')) {
    pageTitle = 'Map View';
  } else if (path.startsWith('/control-room/escalations')) {
    pageTitle = 'Escalations';
  } else if (path.startsWith('/control-room/sla')) {
    pageTitle = 'SLA Alerts';
  } else if (path.startsWith('/control-room/activity')) {
    pageTitle = 'Activity Log';
  } else if (path.startsWith('/control-room/settings')) {
    pageTitle = 'Control Room Settings';
  }

  return (
    <DashboardLayout
      role="control_room"
      roleLabel="Control Room"
      navItems={navItems}
      pageTitle={pageTitle}
    >
      {/* Conditional content based on route */}
      {path === '/control-room' && (
        <>
          {/* Online Status */}
          <div className="mb-6 flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-severity-low/10 text-severity-low rounded-full text-sm font-medium">
              <span className="w-2 h-2 bg-severity-low rounded-full animate-pulse" />
              Operator Online
            </div>
            <div className="text-sm text-[#6B7280]">
              {incidents.length} active incidents
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Incident Queue */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 space-y-3"
            >
              <AnimatePresence>
                {incidents.map((incident, i) => (
                  <motion.div
                    key={incident.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setSelectedIncident(incident)}
                    className={cn(
                      "bg-white rounded-xl shadow-card p-4 cursor-pointer transition-all duration-200 hover:shadow-card-hover",
                      selectedIncident.id === incident.id && "ring-2 ring-accent"
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="text-[#0F172A] font-semibold">{incident.id}</span>
                          <SeverityBadge severity={incident.severity} />
                        </div>
                        <div className="flex items-center gap-2 text-[#6B7280] text-sm">
                          <MapPin className="w-4 h-4" />
                          {incident.location}
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <div className={cn(
                          "text-sm font-medium",
                          incident.slaRemaining.includes('min') && parseInt(incident.slaRemaining) < 15 
                            ? "text-severity-critical animate-pulse" 
                            : "text-[#6B7280]"
                        )}>
                          SLA: {incident.slaRemaining}
                        </div>
                        <div className="text-xs text-[#6B7280]">{incident.time}</div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className={cn(
                        "text-xs px-2 py-1 rounded-full",
                        incident.status === 'New' && "bg-accent/10 text-accent",
                        incident.status === 'In Progress' && "bg-severity-medium/10 text-severity-medium",
                        incident.status === 'Assigned' && "bg-severity-low/10 text-severity-low",
                        incident.status === 'Escalated' && "bg-severity-critical/10 text-severity-critical"
                      )}>
                        {incident.status}
                      </span>
                      <ChevronRight className="w-5 h-5 text-[#6B7280]" />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Case Detail Panel */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-card overflow-hidden flex flex-col h-[calc(100vh-220px)]"
            >
              {/* Case Header */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#0F172A]">{selectedIncident.id}</span>
                    <SeverityBadge severity={selectedIncident.severity} />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="action" className="flex-1">Assign</Button>
                  <Button size="sm" variant="action-warning" className="flex-1">Escalate</Button>
                  <Button size="sm" variant="action-success" className="flex-1">Close</Button>
                </div>
              </div>

              {/* Reporter Info */}
              <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#0F172A]">{selectedIncident.reporter}</p>
                    <p className="text-xs text-[#6B7280]">Reported {selectedIncident.time}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-sm text-[#6B7280]">
                  <MapPin className="w-4 h-4" />
                  {selectedIncident.location}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "max-w-[85%] p-3 rounded-xl text-sm",
                      msg.sender === 'reporter' 
                        ? "bg-accent text-white ml-0" 
                        : "bg-gray-100 text-[#0F172A] ml-auto"
                    )}
                  >
                    <p>{msg.text}</p>
                    <p className={cn(
                      "text-xs mt-1",
                      msg.sender === 'reporter' ? "text-white/70" : "text-[#6B7280]"
                    )}>
                      {msg.time}
                    </p>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="text-[#6B7280]">
                    <Paperclip className="w-5 h-5" />
                  </Button>
                  <Input
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="action" size="icon">
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}

      {path.startsWith('/control-room/map') && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-3">
            {incidents.map((incident) => (
              <div
                key={incident.id}
                className="bg-white rounded-xl shadow-card p-4 flex items-start justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <SeverityBadge severity={incident.severity} />
                    <span className="text-sm font-semibold text-[#0F172A]">{incident.id}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                    <MapPin className="w-3 h-3" />
                    {incident.location}
                  </div>
                </div>
                <span className="text-xs text-[#6B7280]">SLA {incident.slaRemaining}</span>
              </div>
            ))}
          </div>
          <div className="lg:col-span-2 bg-white rounded-xl shadow-card p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <Map className="w-5 h-5 text-accent" />
              <h3 className="font-semibold text-[#0F172A]">Live site map</h3>
            </div>
            <div className="flex-1 rounded-xl bg-gradient-to-br from-accent/5 via-accent/10 to-accent/5 border border-accent/20 flex items-center justify-center text-center px-6">
              <p className="text-sm text-[#6B7280] max-w-md">
                This is a simulated control room map view. In production you would see camera overlays, guard
                locations and incident markers in real time.
              </p>
            </div>
          </div>
        </div>
      )}

      {path.startsWith('/control-room/escalations') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-card p-6">
            <h3 className="font-semibold text-[#0F172A] mb-2">Recent escalations</h3>
            <p className="text-sm text-[#6B7280] mb-4">
              Preview of how escalated incidents will be tracked and routed to management.
            </p>
            <div className="space-y-3">
              {incidents
                .filter((i) => i.status === 'Escalated' || i.severity === 'critical')
                .map((incident) => (
                  <div
                    key={incident.id}
                    className="border border-gray-100 rounded-lg p-3 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <SeverityBadge severity={incident.severity} />
                        <span className="text-sm font-semibold text-[#0F172A]">{incident.id}</span>
                      </div>
                      <p className="text-xs text-[#6B7280]">{incident.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-[#6B7280] mb-1">Status</p>
                      <p className="text-xs font-semibold text-severity-critical">{incident.status}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-card p-6">
            <h3 className="font-semibold text-[#0F172A] mb-2">Escalation rules</h3>
            <p className="text-sm text-[#6B7280]">
              This section simulates how you&apos;ll configure escalation paths for different severities and locations.
            </p>
            <ul className="mt-3 space-y-2 text-sm text-[#6B7280]">
              <li>• Critical incidents: immediate call to duty manager</li>
              <li>• High severity: SMS + email to on-call supervisor</li>
              <li>• Repeated medium incidents: weekly summary to security lead</li>
            </ul>
          </div>
        </div>
      )}

      {path.startsWith('/control-room/sla') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-card p-6">
            <h3 className="font-semibold text-[#0F172A] mb-2">SLA at risk</h3>
            <p className="text-sm text-[#6B7280] mb-4">
              Focus the team on incidents that are closest to breaching their SLA.
            </p>
            <div className="space-y-3">
              {incidents.map((incident) => (
                <div
                  key={incident.id}
                  className="border border-gray-100 rounded-lg p-3 flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <SeverityBadge severity={incident.severity} />
                      <span className="text-sm font-semibold text-[#0F172A]">{incident.id}</span>
                    </div>
                    <p className="text-xs text-[#6B7280]">{incident.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[#6B7280] mb-1">Time left</p>
                    <p className="text-sm font-semibold text-severity-critical">{incident.slaRemaining}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-card p-6">
            <h3 className="font-semibold text-[#0F172A] mb-2">SLA monitoring</h3>
            <p className="text-sm text-[#6B7280]">
              This view previews how SLA dashboards will look once connected to your live incident feed. Configure
              thresholds and alerts in your production environment.
            </p>
          </div>
        </div>
      )}

      {path.startsWith('/control-room/activity') && (
        <div className="bg-white rounded-xl shadow-card p-6">
          <h3 className="font-semibold text-[#0F172A] mb-2">Latest control room activity</h3>
          <p className="text-sm text-[#6B7280] mb-4">
            A chronological view of key actions taken on incidents.
          </p>
          <div className="space-y-3 text-sm text-[#6B7280]">
            <p>• Operator assigned {incidents[0].id} to field team Bravo.</p>
            <p>• {incidents[1].id} escalated to duty manager due to repeated reports.</p>
            <p>• Camera sweep completed for {incidents[2].location}.</p>
            <p>• Guard patrol route updated based on emerging hotspot near {incidents[3].location}.</p>
          </div>
        </div>
      )}

      {path.startsWith('/control-room/settings') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-card p-6 space-y-4">
            <h3 className="font-semibold text-[#0F172A]">Operator profile</h3>
            <p className="text-sm text-[#6B7280]">
              This section simulates how control room operators will manage their profile and preferences.
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#0F172A]">demo-control_room</p>
                <p className="text-xs text-[#6B7280]">control-room@safetext.app</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-card p-6 space-y-3">
            <h3 className="font-semibold text-[#0F172A]">Notification presets</h3>
            <p className="text-sm text-[#6B7280]">
              Configure how the control room receives alerts.
            </p>
            <ul className="space-y-2 text-sm text-[#6B7280]">
              <li>• Desktop alert on new critical incident</li>
              <li>• Sound notification for new chat message</li>
              <li>• Daily summary of open incidents at 6 PM</li>
            </ul>
          </div>
        </div>
      )}
    </DashboardLayout>
   );
 };
 
 export default ControlRoomDashboard;
