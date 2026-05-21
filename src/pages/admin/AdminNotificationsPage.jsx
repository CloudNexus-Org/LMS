import { useState } from 'react';
import { Bell, Check, ShieldAlert, Activity, UserPlus, Server } from 'lucide-react';

const INITIAL_NOTIFICATIONS = [
  { id: 1, type: 'alert', title: 'High Server Load Detected', message: 'Database CPU utilization hit 85% in us-east-1. Auto-scaling initiated.', time: '10 mins ago', read: false },
  { id: 2, type: 'approval', title: 'Courses Awaiting Review', message: '14 mentor submissions need QA approval before publishing.', time: '1 hour ago', read: false },
  { id: 3, type: 'user', title: 'New Mentor Application', message: 'David K. applied to become a mentor in the Backend Engineering track.', time: '3 hours ago', read: true },
  { id: 4, type: 'system', title: 'Automated Backup Complete', message: 'Daily snapshot of production databases completed successfully.', time: '12 hours ago', read: true },
];

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto py-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text font-display tracking-tight">System Alerts</h1>
          <p className="text-muted mt-1 font-medium">Critical platform alerts and administrative notifications.</p>
        </div>
        <button 
          onClick={markAllRead}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-surface border border-border rounded-lg text-xs font-bold text-text hover:bg-bg transition-colors shadow-sm"
        >
          <Check className="h-4 w-4" /> Mark all as read
        </button>
      </div>

      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm divide-y divide-border">
        {notifications.length === 0 ? (
          <div className="p-12 text-center text-muted flex flex-col items-center">
            <Bell className="h-10 w-10 mb-4 opacity-50" />
            <p className="font-bold text-text">No active alerts</p>
            <p className="text-sm mt-1">Platform is operating normally.</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div key={notif.id} className={`p-6 flex gap-5 transition-colors ${notif.read ? 'bg-surface hover:bg-bg/50' : 'bg-danger/5 hover:bg-danger/10'}`}>
              <div className="shrink-0 mt-1">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  notif.type === 'alert' ? 'bg-warning/20 text-warning' :
                  notif.type === 'approval' ? 'bg-primary/20 text-primary' :
                  notif.type === 'user' ? 'bg-success/20 text-success' :
                  notif.type === 'system' ? 'bg-border text-muted' :
                  'bg-border text-muted'
                }`}>
                  {notif.type === 'alert' ? <ShieldAlert className="h-5 w-5" /> : 
                   notif.type === 'approval' ? <Activity className="h-5 w-5" /> : 
                   notif.type === 'user' ? <UserPlus className="h-5 w-5" /> : 
                   <Server className="h-5 w-5" />}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className={`text-sm font-bold ${notif.read ? 'text-text' : 'text-danger'}`}>
                    {notif.title}
                  </h4>
                  <span className="text-xs font-bold text-muted whitespace-nowrap ml-4">{notif.time}</span>
                </div>
                <p className="text-sm text-muted font-medium">{notif.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
