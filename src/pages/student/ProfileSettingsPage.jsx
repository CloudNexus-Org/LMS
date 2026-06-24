import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  User,
  Lock,
  Bell,
  Shield,
  Pencil,
  CheckCircle,
  Sun,
  Monitor,
  Smartphone,
  Trash2,
  Settings,
  LogOut,
} from "lucide-react";
import useAuthStore from "@/store/useAuthStore";
import Button from "@/components/ui/Button";

const TABS = [
  { id: "general", label: "My Profile", icon: User },
  { id: "security", label: "Password & Security", icon: Lock },
  { id: "preferences", label: "Notifications", icon: Bell },
];

const PROFILE = {
  firstName: "Alex",
  lastName: "Chen",
  email: "alex.chen@example.com",
  phone: "+44 7700 900123",
  bio: "Frontend developer learning advanced cloud architecture and scalable system design.",
  role: "Student · Frontend Developer",
  location: "Leeds, United Kingdom",
  country: "United Kingdom",
  city: "Leeds, East London",
  postal: "LS1 4DY",
  timezone: "GMT (UTC+0)",
  avatar:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
};

function PanelCard({ title, onEdit, children, action }) {
  return (
    <div className="settings-panel-card">
      {(title || onEdit || action) && (
        <div className="settings-panel-header">
          {title ? <h3 className="settings-panel-title">{title}</h3> : <span />}
          {action}
          {onEdit && (
            <button type="button" className="settings-edit-btn" onClick={onEdit}>
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </button>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

function Field({ label, value, span }) {
  return (
    <div className={span ? "settings-field-span" : undefined}>
      <span className="settings-field-label">{label}</span>
      <p className="settings-field-value">{value}</p>
    </div>
  );
}

export default function ProfileSettingsPage() {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const [activeTab, setActiveTab] = useState("general");
  const [isSaved, setIsSaved] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingPersonal, setEditingPersonal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  useEffect(() => {
    if (!logoutOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setLogoutOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [logoutOpen]);

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaved(true);
    setEditingProfile(false);
    setEditingPersonal(false);
    setEditingAddress(false);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleLogout = () => {
    setLogoutOpen(false);
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="dashboard-page mx-auto w-full max-w-[1320px] space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            to="/student/profile"
            className="mb-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-muted transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to profile
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-text font-display sm:text-[28px]">
            Account Settings
          </h1>
          <p className="mt-1 text-sm text-muted">
            Manage your profile, security, and notification preferences.
          </p>
        </div>
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/20 bg-primary-soft text-primary"
          aria-hidden
        >
          <Settings className="h-4 w-4" />
        </div>
      </div>

      <div className="dashboard-card settings-shell">
        <div className="settings-layout">
          {/* Left sub-navigation */}
          <nav className="settings-nav" aria-label="Settings sections">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`settings-nav-btn${isActive ? " is-active" : ""}`}
                >
                  <Icon className="settings-nav-icon h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}

            <div className="settings-nav-footer">
              <button type="button" className="settings-nav-logout-btn" onClick={() => setLogoutOpen(true)}>
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </div>

            <div className="settings-nav-delete">
              <button type="button" className="settings-nav-delete-btn">
                <Trash2 className="h-4 w-4" />
                Delete Account
              </button>
            </div>
          </nav>

          {/* Right content */}
          <div className="settings-content">
            {activeTab === "general" && (
              <form onSubmit={handleSave} className="flex flex-col gap-4 sm:gap-5">
                {/* Profile summary */}
                <PanelCard
                  onEdit={editingProfile ? undefined : () => setEditingProfile(true)}
                  action={
                    <span className="settings-status-badge">
                      <Shield className="h-3.5 w-3.5" />
                      Account Protected
                    </span>
                  }
                >
                  {editingProfile ? (
                    <div className="settings-avatar-upload">
                      <img
                        src={PROFILE.avatar}
                        alt="Profile"
                        className="settings-avatar-lg"
                      />
                      <div>
                        <p className="text-sm font-semibold text-text">Profile Photo</p>
                        <p className="mt-1 text-xs text-muted">
                          JPG, PNG or GIF. Maximum size of 800KB.
                        </p>
                        <button type="button" className="settings-upload-link mt-2">
                          Upload New Photo
                        </button>
                        <button
                          type="button"
                          className="settings-edit-btn ml-3"
                          onClick={() => setEditingProfile(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="settings-profile-summary">
                      <img
                        src={PROFILE.avatar}
                        alt="Alex Chen"
                        className="settings-avatar"
                      />
                      <div>
                        <p className="settings-profile-name">
                          {PROFILE.firstName} {PROFILE.lastName}
                        </p>
                        <p className="settings-profile-meta">{PROFILE.role}</p>
                        <p className="settings-profile-meta">{PROFILE.location}</p>
                      </div>
                    </div>
                  )}
                </PanelCard>

                {/* Personal information */}
                <PanelCard
                  title="Personal Information"
                  onEdit={editingPersonal ? undefined : () => setEditingPersonal(true)}
                >
                  {editingPersonal ? (
                    <div className="settings-field-grid">
                      <div>
                        <label className="settings-field-label" htmlFor="firstName">
                          First Name
                        </label>
                        <input
                          id="firstName"
                          type="text"
                          defaultValue={PROFILE.firstName}
                          className="settings-input"
                        />
                      </div>
                      <div>
                        <label className="settings-field-label" htmlFor="lastName">
                          Last Name
                        </label>
                        <input
                          id="lastName"
                          type="text"
                          defaultValue={PROFILE.lastName}
                          className="settings-input"
                        />
                      </div>
                      <div>
                        <label className="settings-field-label" htmlFor="email">
                          Email Address
                        </label>
                        <input
                          id="email"
                          type="email"
                          defaultValue={PROFILE.email}
                          className="settings-input"
                        />
                      </div>
                      <div>
                        <label className="settings-field-label" htmlFor="phone">
                          Phone
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          defaultValue={PROFILE.phone}
                          className="settings-input"
                        />
                      </div>
                      <div className="settings-field-span">
                        <label className="settings-field-label" htmlFor="bio">
                          Bio
                        </label>
                        <textarea
                          id="bio"
                          rows={4}
                          defaultValue={PROFILE.bio}
                          className="settings-textarea"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="settings-field-grid">
                      <Field label="First Name" value={PROFILE.firstName} />
                      <Field label="Last Name" value={PROFILE.lastName} />
                      <Field label="Email Address" value={PROFILE.email} />
                      <Field label="Phone" value={PROFILE.phone} />
                      <Field label="Bio" value={PROFILE.bio} span />
                    </div>
                  )}
                </PanelCard>

                {/* Address */}
                <PanelCard
                  title="Address"
                  onEdit={editingAddress ? undefined : () => setEditingAddress(true)}
                >
                  {editingAddress ? (
                    <div className="settings-field-grid">
                      <div>
                        <label className="settings-field-label" htmlFor="country">
                          Country
                        </label>
                        <input
                          id="country"
                          type="text"
                          defaultValue={PROFILE.country}
                          className="settings-input"
                        />
                      </div>
                      <div>
                        <label className="settings-field-label" htmlFor="city">
                          City / State
                        </label>
                        <input
                          id="city"
                          type="text"
                          defaultValue={PROFILE.city}
                          className="settings-input"
                        />
                      </div>
                      <div>
                        <label className="settings-field-label" htmlFor="postal">
                          Postal Code
                        </label>
                        <input
                          id="postal"
                          type="text"
                          defaultValue={PROFILE.postal}
                          className="settings-input"
                        />
                      </div>
                      <div>
                        <label className="settings-field-label" htmlFor="timezone">
                          Timezone
                        </label>
                        <input
                          id="timezone"
                          type="text"
                          defaultValue={PROFILE.timezone}
                          className="settings-input"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="settings-field-grid">
                      <Field label="Country" value={PROFILE.country} />
                      <Field label="City / State" value={PROFILE.city} />
                      <Field label="Postal Code" value={PROFILE.postal} />
                      <Field label="Timezone" value={PROFILE.timezone} />
                    </div>
                  )}
                </PanelCard>

                {(editingProfile || editingPersonal || editingAddress) && (
                  <div className="settings-save-row">
                    {isSaved && (
                      <span className="settings-saved-msg">
                        <CheckCircle className="h-4 w-4" />
                        Changes saved successfully
                      </span>
                    )}
                    <button type="submit" className="settings-save-btn">
                      Save Changes
                    </button>
                  </div>
                )}
              </form>
            )}

            {activeTab === "security" && (
              <div className="flex flex-col gap-4 sm:gap-5">
                <PanelCard title="Password" onEdit={() => {}}>
                  <div className="settings-field-grid">
                    <Field label="Last Changed" value="3 months ago" />
                    <Field label="Strength" value="Strong" />
                  </div>
                </PanelCard>

                <PanelCard title="Two-Factor Authentication">
                  <div className="settings-security-row">
                    <div className="flex items-center gap-3">
                      <div className="settings-security-icon">
                        <Shield className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-text">
                          Protect your account
                        </p>
                        <p className="mt-0.5 text-xs text-muted">
                          Add an extra layer of security with 2FA verification.
                        </p>
                      </div>
                    </div>
                    <button type="button" className="settings-save-btn">
                      Enable 2FA
                    </button>
                  </div>
                </PanelCard>

                <PanelCard title="Active Sessions">
                  <div className="settings-field-grid">
                    <Field label="Current Device" value="Windows · Chrome" />
                    <Field label="Last Login" value="Today, 2:14 PM" />
                  </div>
                </PanelCard>
              </div>
            )}

            {activeTab === "preferences" && (
              <div className="flex flex-col gap-4 sm:gap-5">
                {[
                  {
                    icon: Sun,
                    title: "Appearance",
                    desc: "Customize dark and light mode behavior.",
                  },
                  {
                    icon: Monitor,
                    title: "Device Sessions",
                    desc: "Manage active devices and login sessions.",
                  },
                  {
                    icon: Smartphone,
                    title: "Mobile Notifications",
                    desc: "Receive course updates on your phone.",
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <PanelCard key={item.title} title={item.title}>
                      <div className="settings-pref-row">
                        <div className="flex items-center gap-3">
                          <div className="settings-security-icon">
                            <Icon className="h-5 w-5" />
                          </div>
                          <p className="text-xs text-muted">{item.desc}</p>
                        </div>
                        <button type="button" className="settings-edit-btn">
                          Configure
                        </button>
                      </div>
                    </PanelCard>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {logoutOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="presentation"
            onClick={() => setLogoutOpen(false)}
          >
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              aria-hidden
            />
            <motion.div
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="logout-dialog-title"
              aria-describedby="logout-dialog-desc"
              className="relative w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-[var(--shadow-card-value)]"
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <LogOut className="h-5 w-5" />
              </div>
              <h2 id="logout-dialog-title" className="mt-4 text-xl font-bold text-text font-display">
                Are you sure you want to log out?
              </h2>
              <p id="logout-dialog-desc" className="mt-2 text-sm leading-relaxed text-muted">
                You will be signed out of your account. You can sign back in anytime to continue
                learning.
              </p>
              <div className="mt-6 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
                <Button variant="secondary" onClick={() => setLogoutOpen(false)} className="sm:min-w-[120px]">
                  Cancel
                </Button>
                <Button onClick={handleLogout} className="sm:min-w-[120px]">
                  Log out
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
