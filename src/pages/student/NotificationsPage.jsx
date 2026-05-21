import { useState } from 'react';
import { MessageSquare, AlertCircle, Award, Check, Trash2 } from 'lucide-react';

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: 'mentorship',
    icon: MessageSquare,
    title: 'New reply from your Mentor',
    content: 'Jane Doe replied to your question in "React State Architecture".',
    time: '2 hours ago',
    unread: true,
  },
  {
    id: 2,
    type: 'system',
    icon: Award,
    title: 'Certificate Unlocked!',
    content: 'You have successfully completed Cloud Architecture Patterns. View your certificate now.',
    time: '1 day ago',
    unread: true,
  },
  {
    id: 3,
    type: 'update',
    icon: AlertCircle,
    title: 'Course Content Updated',
    content: 'New lessons have been added to "Enterprise React Systems".',
    time: '3 days ago',
    unread: false,
  }
];

export default function NotificationsPage() {
  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const filtered = notifications.filter(n => filter === 'all' || n.type === filter);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text font-display tracking-tight">Notifications</h1>
          <p className="text-muted mt-1 font-medium">Stay updated with your courses and mentors.</p>
        </div>
        
        <button onClick={markAllRead} className="flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-hover transition-colors bg-primary-soft px-4 py-2 rounded-lg">
          <Check className="h-4 w-4" /> Mark all as read
        </button>
      </div>

      <div className="bg-surface border border-border rounded-2xl shadow-card overflow-hidden flex flex-col">
        
        {/* Filters */}
        <div className="flex items-center gap-6 px-6 border-b border-border bg-bg/50 overflow-x-auto">
          {['all', 'mentorship', 'system', 'update'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`py-4 text-sm font-bold capitalize border-b-2 whitespace-nowrap transition-colors ${
                filter === f 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-muted hover:text-text'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="divide-y divide-border">
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-muted">
              <Bell className="h-10 w-10 mx-auto mb-3 opacity-20" />
              <p className="font-semibold">No notifications found.</p>
            </div>
          ) : (
            filtered.map((note) => {
              const Icon = note.icon;
              return (
                <div 
                  key={note.id} 
                  className={`p-6 flex gap-4 transition-colors hover:bg-bg ${note.unread ? 'bg-primary-soft/30' : 'bg-surface'}`}
                >
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center shrink-0 shadow-sm ${note.unread ? 'bg-primary text-white' : 'bg-bg border border-border text-muted'}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <h4 className={`text-base font-bold ${note.unread ? 'text-text' : 'text-muted'}`}>{note.title}</h4>
                      <span className="text-xs font-semibold text-muted whitespace-nowrap">{note.time}</span>
                    </div>
                    <p className="text-sm text-text mt-1 font-medium">{note.content}</p>
                    {note.type === 'mentorship' && (
                      <button className="mt-3 text-sm font-bold text-primary hover:underline">
                        Reply to Mentor
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
