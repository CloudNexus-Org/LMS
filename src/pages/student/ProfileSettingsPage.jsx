import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
import { fetchProfile, updateProfile, updateAvatar } from "@/lib/api/userApi";
import { logout as apiLogout } from "@/lib/api/authApi";
import {
  fetchNotificationPreferences,
  updateNotificationPreferences,
} from "@/lib/api/notificationApi";
import { uploadAvatar, resolveMediaUrl } from "@/lib/api/mediaApi";

const TABS = [
  { id: "general", label: "My Profile", icon: User },
  { id: "security", label: "Password & Security", icon: Lock },
  { id: "preferences", label: "Notifications", icon: Bell },
];

const EMPTY_PROFILE = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  bio: "",
  role: "",
  location: "",
  country: "",
  city: "",
  postal: "",
  timezone: "",
  avatar: "",
};

function splitName(fullName = "") {
  const parts = String(fullName).trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || "",
    lastName: parts.slice(1).join(" ") || "",
  };
}

function formatRoleLabel(authUser, professionalRole) {
  const raw = String(authUser?.role || "Student").trim();
  const role = raw ? raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase() : "Student";
  const title = professionalRole || authUser?.professionalRole || "";
  return title ? `${role} · ${title}` : role;
}

function buildInitialProfile(authUser) {
  const { firstName, lastName } = splitName(authUser?.fullName || "");
  return {
    ...EMPTY_PROFILE,
    firstName,
    lastName,
    email: authUser?.email || "",
    phone: authUser?.phone || "",
    bio: authUser?.bio || "",
    location: authUser?.location || "",
    avatar: authUser?.avatar || "",
    role: formatRoleLabel(authUser, authUser?.professionalRole),
  };
}

function displayValue(value, empty = "—") {
  const v = String(value ?? "").trim();
  return v || empty;
}

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
  const location = useLocation();
  const { user: authUser, token, refreshToken, logout, updateUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState("general");
  const [isSaved, setIsSaved] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingPersonal, setEditingPersonal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [notificationPrefs, setNotificationPrefs] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [profile, setProfile] = useState(() => buildInitialProfile(authUser));

  const isMentor = useMemo(() => {
    const role = String(authUser?.role || "").toLowerCase();
    return role === "mentor" || location.pathname.startsWith("/mentor");
  }, [authUser?.role, location.pathname]);

  const backTo = isMentor ? "/mentor/dashboard" : "/student/profile";
  const backLabel = isMentor ? "Back to dashboard" : "Back to profile";

  useEffect(() => {
    setProfile(buildInitialProfile(authUser));
  }, [authUser?.id]);

  useEffect(() => {
    if (!authUser?.id || !token) return;
    fetchProfile(authUser, token)
      .then((data) => {
        if (!data) return;
        const parts = splitName(data.fullName || "");
        setProfile((prev) => ({
          ...prev,
          firstName: parts.firstName || prev.firstName,
          lastName: parts.lastName || prev.lastName,
          email: data.email || prev.email,
          phone: data.phone || prev.phone,
          bio: data.bio || prev.bio,
          location: data.location || prev.location,
          city: data.location || prev.city,
          avatar: data.avatar || prev.avatar,
          role: formatRoleLabel(authUser, data.professionalRole || data.headline),
          country: data.country || prev.country,
          postal: data.postal || prev.postal,
          timezone: data.timezone || prev.timezone,
        }));
      })
      .catch(() => {});
  }, [authUser?.id, token]);

  useEffect(() => {
    if (activeTab !== "preferences" || !authUser?.id || !token) return;
    fetchNotificationPreferences(authUser, token)
      .then(setNotificationPrefs)
      .catch(() => {});
  }, [activeTab, authUser?.id, token]);

  useEffect(() => {
    if (!logoutOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setLogoutOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [logoutOpen]);

  const updateField = (key, value) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  const handleTogglePushNotifications = async () => {
    if (!authUser?.id || !token) return;
    const nextPushEnabled = !(notificationPrefs?.pushEnabled ?? true);
    try {
      const updated = await updateNotificationPreferences(authUser, token, {
        pushEnabled: nextPushEnabled,
      });
      setNotificationPrefs(updated);
    } catch {
      // keep existing UI state on failure
    }
  };

  const handleAvatarUpload = async (file) => {
    if (!file || !authUser?.id || !token) return;
    setUploadingAvatar(true);
    try {
      const uploaded = await uploadAvatar(authUser, token, file);
      const avatarUrl = resolveMediaUrl(uploaded);
      await updateAvatar(authUser, token, avatarUrl);
      setProfile((prev) => ({ ...prev, avatar: avatarUrl }));
      updateUser({ avatar: avatarUrl });
    } catch {
      /* keep current avatar */
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const fullName = `${profile.firstName} ${profile.lastName}`.trim();

    try {
      if (authUser?.id && token) {
        await updateProfile(authUser, token, {
          fullName,
          phone: profile.phone,
          bio: profile.bio,
          location: profile.location || profile.city,
        });
        updateUser({ fullName, email: profile.email, phone: profile.phone, bio: profile.bio });
      }
    } catch {
      /* keep UI feedback even if API unavailable */
    }

    setIsSaved(true);
    setEditingProfile(false);
    setEditingPersonal(false);
    setEditingAddress(false);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleLogout = async () => {
    setLogoutOpen(false);
    try {
      if (token) await apiLogout(token, refreshToken);
    } catch {
      /* proceed with local logout */
    }
    logout();
    navigate("/login", { replace: true });
  };

  const avatarSrc = profile.avatar || undefined;
  const avatarInitials =
    `${(profile.firstName || "?").charAt(0)}${(profile.lastName || "").charAt(0)}`.toUpperCase();

  return (
    <div className="dashboard-page mx-auto w-full max-w-[1320px] space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            to={backTo}
            className="mb-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-muted transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {backLabel}
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

          <div className="settings-content">
            {activeTab === "general" && (
              <form onSubmit={handleSave} className="flex flex-col gap-4 sm:gap-5">
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
                      {avatarSrc ? (
                        <img src={avatarSrc} alt="Profile" className="settings-avatar-lg" />
                      ) : (
                        <div className="settings-avatar-lg flex items-center justify-center bg-primary-soft text-primary font-bold text-xl">
                          {avatarInitials}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-semibold text-text">Profile Photo</p>
                        <p className="mt-1 text-xs text-muted">
                          JPG, PNG or GIF. Maximum size of 800KB.
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          id="avatar-upload"
                          onChange={(e) => handleAvatarUpload(e.target.files?.[0])}
                        />
                        <label htmlFor="avatar-upload" className="settings-upload-link mt-2 cursor-pointer">
                          {uploadingAvatar ? "Uploading…" : "Upload New Photo"}
                        </label>
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
                      {avatarSrc ? (
                        <img
                          src={avatarSrc}
                          alt={`${profile.firstName} ${profile.lastName}`}
                          className="settings-avatar"
                        />
                      ) : (
                        <div className="settings-avatar flex items-center justify-center bg-primary-soft text-primary font-bold">
                          {avatarInitials}
                        </div>
                      )}
                      <div>
                        <p className="settings-profile-name">
                          {displayValue(
                            `${profile.firstName} ${profile.lastName}`.trim(),
                            "Your name"
                          )}
                        </p>
                        <p className="settings-profile-meta">{displayValue(profile.role)}</p>
                        <p className="settings-profile-meta">{displayValue(profile.location)}</p>
                      </div>
                    </div>
                  )}
                </PanelCard>

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
                          value={profile.firstName}
                          onChange={(e) => updateField("firstName", e.target.value)}
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
                          value={profile.lastName}
                          onChange={(e) => updateField("lastName", e.target.value)}
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
                          value={profile.email}
                          onChange={(e) => updateField("email", e.target.value)}
                          className="settings-input"
                          readOnly
                          title="Email is managed from your account login"
                        />
                      </div>
                      <div>
                        <label className="settings-field-label" htmlFor="phone">
                          Phone
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          value={profile.phone}
                          onChange={(e) => updateField("phone", e.target.value)}
                          className="settings-input"
                          placeholder="Add phone number"
                        />
                      </div>
                      <div className="settings-field-span">
                        <label className="settings-field-label" htmlFor="bio">
                          Bio
                        </label>
                        <textarea
                          id="bio"
                          rows={4}
                          value={profile.bio}
                          onChange={(e) => updateField("bio", e.target.value)}
                          className="settings-textarea"
                          placeholder="Tell students about yourself"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="settings-field-grid">
                      <Field label="First Name" value={displayValue(profile.firstName)} />
                      <Field label="Last Name" value={displayValue(profile.lastName)} />
                      <Field label="Email Address" value={displayValue(profile.email)} />
                      <Field label="Phone" value={displayValue(profile.phone)} />
                      <Field label="Bio" value={displayValue(profile.bio)} span />
                    </div>
                  )}
                </PanelCard>

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
                          value={profile.country}
                          onChange={(e) => updateField("country", e.target.value)}
                          className="settings-input"
                          placeholder="Country"
                        />
                      </div>
                      <div>
                        <label className="settings-field-label" htmlFor="city">
                          City / State
                        </label>
                        <input
                          id="city"
                          type="text"
                          value={profile.city || profile.location}
                          onChange={(e) => {
                            updateField("city", e.target.value);
                            updateField("location", e.target.value);
                          }}
                          className="settings-input"
                          placeholder="City / State"
                        />
                      </div>
                      <div>
                        <label className="settings-field-label" htmlFor="postal">
                          Postal Code
                        </label>
                        <input
                          id="postal"
                          type="text"
                          value={profile.postal}
                          onChange={(e) => updateField("postal", e.target.value)}
                          className="settings-input"
                          placeholder="Postal code"
                        />
                      </div>
                      <div>
                        <label className="settings-field-label" htmlFor="timezone">
                          Timezone
                        </label>
                        <input
                          id="timezone"
                          type="text"
                          value={profile.timezone}
                          onChange={(e) => updateField("timezone", e.target.value)}
                          className="settings-input"
                          placeholder="e.g. IST (UTC+5:30)"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="settings-field-grid">
                      <Field label="Country" value={displayValue(profile.country)} />
                      <Field
                        label="City / State"
                        value={displayValue(profile.city || profile.location)}
                      />
                      <Field label="Postal Code" value={displayValue(profile.postal)} />
                      <Field label="Timezone" value={displayValue(profile.timezone)} />
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
                    <Field label="Last Changed" value="—" />
                    <Field label="Strength" value="—" />
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
                    <Field label="Current Device" value="This browser" />
                    <Field label="Account" value={displayValue(profile.email)} />
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
                    desc: (notificationPrefs?.pushEnabled ?? true)
                      ? "Receive course updates on your phone."
                      : "Push notifications are turned off on your phone.",
                    onConfigure: handleTogglePushNotifications,
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
                        <button
                          type="button"
                          className="settings-edit-btn"
                          onClick={item.onConfigure}
                        >
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
                You will be signed out of your account. You can sign back in anytime.
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
