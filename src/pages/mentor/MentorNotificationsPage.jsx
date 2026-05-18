import { useState } from 'react';
import { Bell, Check, MessageSquare, Star, DollarSign, UploadCloud, ShieldAlert } from 'lucide-react';

const INITIAL_NOTIFICATIONS = [
  { id: 1, type: 'qna', title: 'New Q&A Question', message: 'A student asked a question in "Advanced State Management" Lesson 3.', time: '2 hours ago', read: false },
  { id: 2, type: 'review', title: '5-Star Review Received', message: 'Sarah M. just left a 5-star review on your Cloud Architecture course.', time: '5 hours ago', read: false },
  { id: 3, type: 'payout', title: 'Payout Processed', message: 'Your monthly payout of $4,250 has been processed successfully.', time: '1 day ago', read: true },
  { id: 4, type: 'approval', title: 'Course Approved', message: 'Your new course "Rust for Frontend Devs" passed QA and is now live!', time: '2 days ago', read: true },
];

export default function MentorNotificationsPage() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto py-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text font-display tracking-tight">Mentor Notifications</h1>
          <p className="text-muted mt-1 font-medium">Updates on your courses, students, and payouts.</p>
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
            <p className="font-bold text-text">You're all caught up!</p>
            <p className="text-sm mt-1">Check back later for new updates.</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div key={notif.id} className={`p-6 flex gap-5 transition-colors ${notif.read ? 'bg-surface hover:bg-bg/50' : 'bg-primary-soft/30 hover:bg-primary-soft/50'}`}>
              <div className="shrink-0 mt-1">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  notif.type === 'qna' ? 'bg-primary/20 text-primary' :
                  notif.type === 'review' ? 'bg-warning/20 text-warning' :
                  notif.type === 'payout' ? 'bg-success/20 text-success' :
                  notif.type === 'approval' ? 'bg-accent/20 text-accent' :
                  'bg-border text-muted'
                }`}>
                  {notif.type === 'qna' ? <MessageSquare className="h-5 w-5" /> : 
                   notif.type === 'review' ? <Star className="h-5 w-5 fill-warning" /> : 
                   notif.type === 'payout' ? <DollarSign className="h-5 w-5" /> : 
                   <UploadCloud className="h-5 w-5" />}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className={`text-sm font-bold ${notif.read ? 'text-text' : 'text-primary'}`}>
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
