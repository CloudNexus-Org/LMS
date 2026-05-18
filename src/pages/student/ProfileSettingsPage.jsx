import { useState } from 'react';
import { User, Lock, Bell, UploadCloud, CheckCircle, Shield } from 'lucide-react';

const TABS = [
  { id: 'general', label: 'General Profile', icon: User },
  { id: 'security', label: 'Security & Login', icon: Lock },
  { id: 'preferences', label: 'Preferences', icon: Bell },
];

export default function ProfileSettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-text font-display tracking-tight">Account Settings</h1>
        <p className="text-muted mt-1 font-medium">Manage your identity, preferences, and security.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Sidebar Tabs */}
        <div className="w-full lg:w-64 shrink-0 space-y-2">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary text-white shadow-md'
                    : 'text-muted hover:bg-surface hover:text-text border border-transparent hover:border-border'
                }`}
              >
                <Icon className="h-5 w-5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Right Content Area */}
        <div className="flex-1">
          <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
            
            {/* General Tab */}
            {activeTab === 'general' && (
              <form onSubmit={handleSave} className="space-y-8 animate-in fade-in duration-300">
                <div className="flex items-center gap-6 pb-8 border-b border-border">
                  <div className="relative group cursor-pointer">
                    <img 
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" 
                      alt="Avatar" 
                      className="h-24 w-24 rounded-full object-cover border-2 border-border group-hover:opacity-50 transition-opacity"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <UploadCloud className="h-8 w-8 text-white drop-shadow-md" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-text text-lg">Profile Avatar</h3>
                    <p className="text-sm text-muted mb-3 font-medium">JPG, GIF or PNG. Max size of 800K</p>
                    <button type="button" className="text-sm font-bold text-primary hover:text-primary-hover hover:underline">
                      Upload new photo
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text">First Name</label>
                    <input type="text" defaultValue="Alex" className="w-full bg-bg border border-border rounded-lg px-4 py-2.5 text-sm font-medium focus:border-primary focus:ring-1 focus:ring-primary outline-none text-text transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text">Last Name</label>
                    <input type="text" defaultValue="Chen" className="w-full bg-bg border border-border rounded-lg px-4 py-2.5 text-sm font-medium focus:border-primary focus:ring-1 focus:ring-primary outline-none text-text transition-all" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-text">Email Address</label>
                  <input type="email" defaultValue="alex.chen@example.com" className="w-full bg-bg border border-border rounded-lg px-4 py-2.5 text-sm font-medium focus:border-primary focus:ring-1 focus:ring-primary outline-none text-text transition-all" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-text">Short Bio</label>
                  <textarea rows="4" defaultValue="Frontend developer learning advanced cloud architecture." className="w-full bg-bg border border-border rounded-lg px-4 py-3 text-sm font-medium focus:border-primary focus:ring-1 focus:ring-primary outline-none text-text transition-all resize-none" />
                </div>
              </form>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="flex items-center gap-4 pb-6 border-b border-border">
                  <div className="h-12 w-12 rounded-full bg-primary-soft text-primary flex items-center justify-center">
                    <Shield className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-text text-lg">Two-Factor Authentication</h3>
                    <p className="text-sm text-muted font-medium">Add an extra layer of security to your account.</p>
                  </div>
                  <button className="ml-auto bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-primary-hover transition-colors">
                    Enable 2FA
                  </button>
                </div>

                <form onSubmit={handleSave} className="space-y-6">
                  <h3 className="font-bold text-text text-lg">Change Password</h3>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text">Current Password</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-bg border border-border rounded-lg px-4 py-2.5 text-sm focus:border-primary outline-none text-text transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text">New Password</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-bg border border-border rounded-lg px-4 py-2.5 text-sm focus:border-primary outline-none text-text transition-all" />
                  </div>
                </form>
              </div>
            )}

            {/* Save Button (Sticky Footer) */}
            {(activeTab === 'general' || activeTab === 'security') && (
              <div className="mt-8 pt-6 border-t border-border flex items-center justify-end gap-4">
                {isSaved && (
                  <span className="text-success text-sm font-bold flex items-center gap-2 animate-in fade-in slide-in-from-right-4">
                    <CheckCircle className="h-4 w-4" /> Changes saved!
                  </span>
                )}
                <button onClick={handleSave} className="bg-text text-bg px-6 py-2.5 rounded-lg text-sm font-bold shadow-sm hover:opacity-90 transition-opacity">
                  Save Changes
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
