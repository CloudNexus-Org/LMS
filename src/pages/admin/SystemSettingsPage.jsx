import { useState } from 'react';
import {
  Settings, Shield, Globe, CreditCard, Bell, Save, Sparkles,
  Server, Mail, Zap, Lock, ChevronRight,
  Database, AlertTriangle, Check,
  HardDrive
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'general',       label: 'General',          icon: Settings },
  { id: 'security',      label: 'Security',          icon: Shield },
  { id: 'financial',     label: 'Billing & Payouts', icon: CreditCard },
  { id: 'notifications', label: 'System Alerts',     icon: Bell },
  { id: 'integrations',  label: 'Integrations',      icon: Zap },
  { id: 'maintenance',   label: 'Maintenance',       icon: Server },
];

function Toggle({ on, onChange }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={`relative w-12 h-6 rounded-full transition-colors duration-300 shadow-inner focus:outline-none ${on ? 'bg-success' : 'bg-border'}`}
    >
      <div className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all duration-300 ${on ? 'right-1' : 'left-1'}`} />
    </button>
  );
}

function SettingRow({ title, desc, children, danger }) {
  return (
    <div className={`flex items-center justify-between p-4 bg-bg border rounded-xl gap-4 transition-colors hover:border-primary/20 ${danger ? 'border-danger/20 bg-danger/5' : 'border-border'}`}>
      <div className="flex-1 min-w-0">
        <p className={`font-bold text-sm ${danger ? 'text-danger' : 'text-text'}`}>{title}</p>
        <p className="text-xs text-muted font-medium mt-0.5 leading-relaxed">{desc}</p>
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

function Section({ title, desc, icon: Icon, children }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 pb-3 border-b border-border">
        {Icon && (
          <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <div>
          <h3 className="font-bold text-base text-text">{title}</h3>
          {desc && <p className="text-xs text-muted font-medium mt-0.5">{desc}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

export default function SystemSettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [saved, setSaved] = useState(false);

  const [settings, setSettings] = useState({
    allowSignups: true,
    maintenanceMode: false,
    twoFactor: true,
    rateLimit: true,
    emailVerification: true,
    autoScale: true,
    debugMode: false,
    analyticsTracking: true,
    mentorAutoApprove: false,
    commission: 30,
    minPayout: 100,
    platformName: 'Cloud Nexus',
    supportEmail: 'support@cloudnexus.io',
    maxFileSize: 500,
    maxVideoSize: 4096,
  });

  const set = (key, val) => setSettings(prev => ({ ...prev, [key]: val }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">

      {/* â”€â”€ HEADER â”€â”€ */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-primary mb-3">
            <Sparkles className="h-3 w-3" /> Platform Configuration
          </div>
          <h1 className="text-[42px] font-bold text-text font-display tracking-tight">System Settings</h1>
          <p className="text-muted mt-1 font-medium">Configure global platform behavior, security, and integrations.</p>
        </div>
        <button
          onClick={handleSave}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all hover:-translate-y-0.5 ${
            saved ? 'bg-success text-white' : 'bg-primary text-white hover:bg-primary-hover'
          }`}
        >
          {saved ? <><Check className="h-4 w-4" /> Saved!</> : <><Save className="h-4 w-4" /> Save Changes</>}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6">

        {/* â”€â”€ SIDEBAR NAV â”€â”€ */}
        <div className="space-y-1">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                  isActive
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'text-muted hover:bg-surface hover:text-text border border-transparent'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
                {isActive && <ChevronRight className="h-3.5 w-3.5 ml-auto" />}
              </button>
            );
          })}

          {/* Danger zone card */}
          <div className="mt-4 p-4 border border-danger/20 bg-danger/5 rounded-xl">
            <p className="text-xs font-bold text-danger uppercase tracking-wider mb-1">Danger Zone</p>
            <p className="text-[11px] text-muted font-medium">Irreversible platform actions</p>
          </div>
        </div>

        {/* â”€â”€ CONTENT PANE â”€â”€ */}
        <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-8 min-h-[500px]">

          {/* â”€â”€ GENERAL â”€â”€ */}
          {activeTab === 'general' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <Section title="Platform Identity" desc="Basic platform configuration" icon={Globe}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text">Platform Name</label>
                    <input value={settings.platformName} onChange={e => set('platformName', e.target.value)}
                      className="w-full bg-bg border border-border rounded-xl px-4 py-2.5 text-sm font-medium text-text focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text">Support Email</label>
                    <input value={settings.supportEmail} onChange={e => set('supportEmail', e.target.value)}
                      className="w-full bg-bg border border-border rounded-xl px-4 py-2.5 text-sm font-medium text-text focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all" />
                  </div>
                </div>
              </Section>

              <Section title="Registration & Access" desc="Control who can join the platform" icon={Globe}>
                <div className="space-y-3">
                  <SettingRow title="Allow New Signups" desc="Enable or disable new user registrations globally.">
                    <Toggle on={settings.allowSignups} onChange={v => set('allowSignups', v)} />
                  </SettingRow>
                  <SettingRow title="Email Verification Required" desc="Users must verify email before accessing the platform.">
                    <Toggle on={settings.emailVerification} onChange={v => set('emailVerification', v)} />
                  </SettingRow>
                  <SettingRow title="Analytics Tracking" desc="Collect anonymized usage data to improve the platform.">
                    <Toggle on={settings.analyticsTracking} onChange={v => set('analyticsTracking', v)} />
                  </SettingRow>
                </div>
              </Section>

              <Section title="Upload Limits" icon={HardDrive}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text">Max File Size (MB)</label>
                    <input type="number" value={settings.maxFileSize} onChange={e => set('maxFileSize', +e.target.value)}
                      className="w-full bg-bg border border-border rounded-xl px-4 py-2.5 text-sm font-bold text-text focus:border-primary outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text">Max Video Size (MB)</label>
                    <input type="number" value={settings.maxVideoSize} onChange={e => set('maxVideoSize', +e.target.value)}
                      className="w-full bg-bg border border-border rounded-xl px-4 py-2.5 text-sm font-bold text-text focus:border-primary outline-none transition-all" />
                  </div>
                </div>
              </Section>
            </div>
          )}

          {/* â”€â”€ SECURITY â”€â”€ */}
          {activeTab === 'security' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <Section title="Authentication" desc="Control login and session security" icon={Shield}>
                <div className="space-y-3">
                  <SettingRow title="Two-Factor Authentication" desc="Require 2FA for all admin and mentor accounts.">
                    <Toggle on={settings.twoFactor} onChange={v => set('twoFactor', v)} />
                  </SettingRow>
                  <SettingRow title="Rate Limiting" desc="Limit login attempts to prevent brute-force attacks.">
                    <Toggle on={settings.rateLimit} onChange={v => set('rateLimit', v)} />
                  </SettingRow>
                  <SettingRow title="Debug Mode" desc="Expose detailed error stack traces (dev only)." danger={settings.debugMode}>
                    <Toggle on={settings.debugMode} onChange={v => set('debugMode', v)} />
                  </SettingRow>
                </div>
              </Section>

              <Section title="Active Sessions" desc="Manage platform-wide sessions" icon={Lock}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-bg border border-border rounded-xl">
                    <div>
                      <p className="font-bold text-text text-sm">Active Admin Sessions</p>
                      <p className="text-xs text-muted mt-0.5">3 admin accounts are currently logged in</p>
                    </div>
                    <button className="text-xs font-bold text-danger hover:underline">Revoke All</button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-bg border border-border rounded-xl">
                    <div>
                      <p className="font-bold text-text text-sm">Session Timeout</p>
                      <p className="text-xs text-muted mt-0.5">Auto-logout after inactivity</p>
                    </div>
                    <select className="bg-surface border border-border rounded-lg px-3 py-1.5 text-xs font-bold text-text outline-none focus:border-primary">
                      <option>30 minutes</option>
                      <option>1 hour</option>
                      <option>4 hours</option>
                      <option>8 hours</option>
                    </select>
                  </div>
                </div>
              </Section>
            </div>
          )}

          {/* â”€â”€ FINANCIAL â”€â”€ */}
          {activeTab === 'financial' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <Section title="Revenue Configuration" desc="Platform commission and payout thresholds" icon={CreditCard}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text">Platform Commission (%)</label>
                    <div className="flex items-center gap-4">
                      <input type="number" value={settings.commission} min={0} max={100} onChange={e => set('commission', +e.target.value)}
                        className="w-32 bg-bg border border-border rounded-xl px-4 py-2.5 text-lg font-display font-bold text-text focus:border-primary outline-none transition-all" />
                      <p className="text-xs text-muted font-medium">Mentor earns <span className="font-bold text-success">{100 - settings.commission}%</span> of each sale</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text">Minimum Payout Amount (USD)</label>
                    <input type="number" value={settings.minPayout} onChange={e => set('minPayout', +e.target.value)}
                      className="w-40 bg-bg border border-border rounded-[5px] px-4 py-2.5 text-lg font-display font-bold text-text focus:border-primary outline-none transition-all" />
                  </div>

                  <SettingRow title="Auto-approve Mentor Applications" desc="Skip manual review for mentor applications with 4.5+ score.">
                    <Toggle on={settings.mentorAutoApprove} onChange={v => set('mentorAutoApprove', v)} />
                  </SettingRow>
                </div>
              </Section>

              <Section title="Payment Gateway" desc="Stripe & payment processor config" icon={CreditCard}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-bg border border-border rounded-[5px]">
                    <div>
                      <p className="font-bold text-text text-sm">Stripe Integration</p>
                      <p className="text-xs text-success font-medium mt-0.5 flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-success" /> Connected Â· sk_live_****4821</p>
                    </div>
                    <button className="text-xs font-bold text-primary hover:underline">Reconfigure</button>
                  </div>
                </div>
              </Section>
            </div>
          )}

          {/* â”€â”€ NOTIFICATIONS â”€â”€ */}
          {activeTab === 'notifications' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <Section title="System Alert Thresholds" desc="Configure when to trigger critical alerts" icon={Bell}>
                <div className="space-y-3">
                  {[
                    { label: 'CPU Alert Threshold (%)', value: 80, key: 'cpuThreshold' },
                    { label: 'Memory Alert Threshold (%)', value: 85, key: 'memThreshold' },
                    { label: 'Failed Login Alert Count', value: 50, key: 'loginThreshold' },
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between p-4 bg-bg border border-border rounded-[5px] gap-4">
                      <p className="font-bold text-text text-sm">{item.label}</p>
                      <input type="number" defaultValue={item.value}
                        className="w-20 bg-surface border border-border rounded-[5px] px-3 py-1.5 text-sm font-bold text-text focus:border-primary outline-none transition-all text-center" />
                    </div>
                  ))}
                </div>
              </Section>

              <Section title="Notification Channels" desc="Where to send system alerts" icon={Mail}>
                <div className="space-y-3">
                  <SettingRow title="Email Alerts" desc="Send critical system alerts to admin email addresses.">
                    <Toggle on={true} onChange={() => {}} />
                  </SettingRow>
                  <SettingRow title="Slack Webhooks" desc="Post alerts to #platform-alerts Slack channel.">
                    <Toggle on={false} onChange={() => {}} />
                  </SettingRow>
                </div>
              </Section>
            </div>
          )}

          {/* â”€â”€ MAINTENANCE â”€â”€ */}
          {activeTab === 'maintenance' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <Section title="Platform Status" desc="Control platform-wide access and availability" icon={Server}>
                <div className="space-y-3">
                  <SettingRow title="Maintenance Mode" desc="Lock down the platform for database migrations. Users see a maintenance page." danger={settings.maintenanceMode}>
                    <Toggle on={settings.maintenanceMode} onChange={v => set('maintenanceMode', v)} />
                  </SettingRow>
                  <SettingRow title="Auto-scaling" desc="Automatically spin up additional compute resources under high load.">
                    <Toggle on={settings.autoScale} onChange={v => set('autoScale', v)} />
                  </SettingRow>
                </div>
              </Section>

              <Section title="Database Operations" icon={Database}>
                <div className="space-y-3">
                  {[
                    { label: 'Trigger Manual Backup', desc: 'Create an immediate snapshot of the production database.', btn: 'Run Backup', color: 'text-primary' },
                    { label: 'Clear Cache', desc: 'Flush Redis cache across all regions (takes ~30s).', btn: 'Clear Cache', color: 'text-warning' },
                    { label: 'Purge CDN', desc: 'Invalidate all CloudFront edge caches globally.', btn: 'Purge CDN', color: 'text-warning' },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between p-4 bg-bg border border-border rounded-[5px] gap-4">
                      <div>
                        <p className="font-bold text-text text-sm">{item.label}</p>
                        <p className="text-xs text-muted mt-0.5 font-medium">{item.desc}</p>
                      </div>
                      <button className={`text-xs font-bold px-3 py-1.5 border border-border rounded-full hover:border-primary/40 transition-all ${item.color}`}>
                        {item.btn}
                      </button>
                    </div>
                  ))}
                </div>
              </Section>

              <div className="p-5 border border-danger/30 bg-danger/5 rounded-[5px] space-y-3">
                <div className="flex items-center gap-2 text-danger mb-1">
                  <AlertTriangle className="h-4 w-4" />
                  <p className="font-bold text-sm">Danger Zone</p>
                </div>
                <SettingRow title="Reset All Platform Settings" desc="Revert all settings to factory defaults. This cannot be undone." danger>
                  <button className="text-xs font-bold bg-danger/10 text-danger border border-danger/20 px-3 py-1.5 rounded-full hover:bg-danger hover:text-white transition-all">
                    Reset
                  </button>
                </SettingRow>
              </div>
            </div>
          )}

          {/* â”€â”€ INTEGRATIONS â”€â”€ */}
          {activeTab === 'integrations' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <Section title="Third-Party Services" desc="Connected platform integrations" icon={Zap}>
                <div className="space-y-3">
                  {[
                    { name: 'Stripe', desc: 'Payment processing', connected: true, color: 'text-violet-500', bg: 'bg-violet-500/10' },
                    { name: 'AWS S3', desc: 'Video & file storage', connected: true, color: 'text-orange-500', bg: 'bg-orange-500/10' },
                    { name: 'SendGrid', desc: 'Transactional email', connected: true, color: 'text-primary', bg: 'bg-primary/10' },
                    { name: 'Slack', desc: 'Team notifications', connected: false, color: 'text-muted', bg: 'bg-border' },
                    { name: 'Intercom', desc: 'Customer support chat', connected: false, color: 'text-muted', bg: 'bg-border' },
                  ].map(item => (
                    <div key={item.name} className="flex items-center gap-4 p-4 bg-bg border border-border rounded-[5px] hover:border-primary/20 transition-colors">
                      <div className={`h-10 w-10 rounded-full ${item.bg} ${item.color} flex items-center justify-center font-bold text-xs flex-shrink-0`}>
                        {item.name[0]}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-text text-sm">{item.name}</p>
                        <p className="text-xs text-muted font-medium">{item.desc}</p>
                      </div>
                      {item.connected ? (
                        <span className="flex items-center gap-1.5 text-xs font-bold text-success bg-success/10 px-2.5 py-1 rounded-[5px]">
                          <span className="h-1.5 w-1.5 rounded-full bg-success" /> Connected
                        </span>
                      ) : (
                        <button className="text-xs font-bold text-primary border border-primary/20 bg-primary/5 px-3 py-1.5 rounded-full hover:bg-primary hover:text-white transition-all">
                          Connect
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </Section>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
