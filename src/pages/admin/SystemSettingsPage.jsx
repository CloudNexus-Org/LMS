import { Settings, Shield, Globe, CreditCard, Bell, Save } from 'lucide-react';

export default function SystemSettingsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-text font-display tracking-tight">System Settings</h1>
        <p className="text-muted mt-1 font-medium">Configure global platform behavior and security.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
        {/* Settings Navigation Sidebar */}
        <div className="space-y-2">
          {[
            { id: 'general', label: 'General', icon: Settings, active: true },
            { id: 'security', label: 'Security', icon: Shield, active: false },
            { id: 'billing', label: 'Billing & Payouts', icon: CreditCard, active: false },
            { id: 'notifications', label: 'System Alerts', icon: Bell, active: false },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button key={item.id} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-colors ${
                item.active ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted hover:bg-surface hover:text-text border border-transparent'
              }`}>
                <Icon className="h-4 w-4" /> {item.label}
              </button>
            )
          })}
        </div>

        {/* Settings Content Pane */}
        <div className="bg-surface border border-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-8">
          
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-text border-b border-border pb-2">Global Platform Status</h3>
            
            <div className="flex items-center justify-between p-4 bg-bg border border-border rounded-xl">
              <div>
                <p className="font-bold text-text text-sm">Allow New Signups</p>
                <p className="text-xs text-muted font-medium mt-1">Enable or disable new user registrations.</p>
              </div>
              {/* Toggle Switch */}
              <div className="w-12 h-6 bg-success rounded-full relative cursor-pointer shadow-inner">
                <div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full shadow-sm"></div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-bg border border-border rounded-xl">
              <div>
                <p className="font-bold text-text text-sm">Maintenance Mode</p>
                <p className="text-xs text-muted font-medium mt-1">Lock down the platform for database migrations.</p>
              </div>
              {/* Toggle Switch Off */}
              <div className="w-12 h-6 bg-border rounded-full relative cursor-pointer shadow-inner">
                <div className="absolute left-1 top-1 h-4 w-4 bg-muted rounded-full shadow-sm"></div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-lg text-text border-b border-border pb-2">Financial Configuration</h3>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-text">Default Platform Commission (%)</label>
              <input type="number" defaultValue={30} className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-sm focus:border-primary outline-none text-text transition-all font-medium max-w-[200px]" />
              <p className="text-xs text-muted font-medium mt-1">This is the default cut the platform takes from mentor sales.</p>
            </div>
          </div>

          <div className="pt-6 border-t border-border flex justify-end">
            <button className="flex items-center gap-2 bg-text text-bg px-6 py-2.5 rounded-xl font-bold text-sm shadow-md hover:opacity-90 transition-opacity">
              <Save className="h-4 w-4" /> Save Changes
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
