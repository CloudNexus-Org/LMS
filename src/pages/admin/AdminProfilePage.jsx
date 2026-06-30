import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useSpring, useTransform, useInView } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  BarChart2,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  DollarSign,
  Globe,
  Key,
  Link2,
  Mail,
  Monitor,
  Server,
  Settings,
  Shield,
  ShieldAlert,
  UploadCloud,
  User,
  Users,
  Zap,
} from "lucide-react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa6";
import ProfileHeroBanner from "@/components/profile/ProfileHeroBanner";

const EASE = [0.16, 1, 0.3, 1];

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
};

const listItem = {
  hidden: { opacity: 0, x: -12 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.07, duration: 0.4, ease: EASE },
  }),
};

const tabContent = {
  hidden: { opacity: 0, y: 14, filter: "blur(4px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.38, ease: EASE } },
  exit: { opacity: 0, y: -8, filter: "blur(4px)", transition: { duration: 0.22, ease: EASE } },
};

const PROFILE = {
  firstName: "Jordan",
  lastName: "Reeves",
  username: "@jreeves_admin",
  email: "jordan.reeves@cloudnexus.io",
  phone: "+1 (628) 555-0142",
  headline: "Platform Administrator",
  bio: "Lead platform admin overseeing user operations, course approvals, financial controls, and system reliability for Cloud Nexus.",
  location: "Austin, TX",
  timezone: "Central Time (CT)",
  language: "English",
  memberSince: "January 2023",
  lastActive: "5 min ago",
  plan: "Super Admin",
  role: "Super Administrator",
  department: "Platform Operations",
  avatar:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80",
  cover: "/assets/profile-cover-default.svg",
  verified: true,
  twoFactorEnabled: true,
  social: {
    github: "github.com/jreeves-admin",
    linkedin: "linkedin.com/in/jordanreeves",
    portfolio: "cloudnexus.io/team/jreeves",
  },
};

const STATS = [
  { label: "Total users", value: 12480, suffix: "", sub: "+124 this week", icon: Users, accent: "profile-kpi-primary" },
  { label: "Pending approvals", value: 14, suffix: "", sub: "Need review", icon: BookOpen, accent: "profile-kpi-warning" },
  { label: "Revenue MTD", value: 284, suffix: "K", sub: "+8.2% growth", icon: DollarSign, accent: "profile-kpi-success" },
  { label: "Active mentors", value: 186, suffix: "", sub: "12 new", icon: User, accent: "profile-kpi-accent" },
  { label: "Open tickets", value: 7, suffix: "", sub: "2 critical", icon: AlertTriangle, accent: "profile-kpi-warning" },
  { label: "Uptime", value: 99.9, suffix: "%", sub: "Last 30 days", icon: Server, accent: "profile-kpi-primary" },
];

const TIMEZONE_OPTIONS = [
  { value: "Pacific Time (PT)", label: "Pacific Time (PT)", offset: "UTC−08:00" },
  { value: "Mountain Time (MT)", label: "Mountain Time (MT)", offset: "UTC−07:00" },
  { value: "Central Time (CT)", label: "Central Time (CT)", offset: "UTC−06:00" },
  { value: "Eastern Time (ET)", label: "Eastern Time (ET)", offset: "UTC−05:00" },
  { value: "UTC", label: "Coordinated Universal Time (UTC)", offset: "UTC±00:00" },
  { value: "India Standard Time (IST)", label: "India Standard Time (IST)", offset: "UTC+05:30" },
];

const LANGUAGE_OPTIONS = [
  { value: "English", label: "English", native: "English" },
  { value: "Spanish", label: "Spanish", native: "Español" },
  { value: "French", label: "French", native: "Français" },
  { value: "German", label: "German", native: "Deutsch" },
];

const TABS = [
  { id: "overview", label: "Overview", icon: User },
  { id: "operations", label: "Operations", icon: Activity },
  { id: "security", label: "Security", icon: Shield },
];

const PENDING_APPROVALS = [
  { id: 1, title: "Azure Generative AI — Module 5", mentor: "Sarah Jenkins", submitted: "2h ago", status: "QA review" },
  { id: 2, title: "Docker for DevOps Teams", mentor: "James Wilson", submitted: "5h ago", status: "Content flag" },
  { id: 3, title: "System Design Interview Prep", mentor: "Marcus Lee", submitted: "1d ago", status: "New submission" },
];

const ADMIN_ACTIVITY = [
  { id: 1, type: "approval", text: "Approved 6 mentor course updates", time: "1 hour ago" },
  { id: 2, type: "user", text: "Suspended 2 accounts for policy violations", time: "3 hours ago" },
  { id: 3, type: "payout", text: "Authorized $12,400 in mentor payouts", time: "Yesterday" },
  { id: 4, type: "system", text: "Triggered production deployment v1.2.4", time: "2 days ago" },
];

const UPCOMING_TASKS = [
  { id: 1, date: "Today", title: "Review payout batch", subtitle: "18 mentors · $42,500", time: "4:00 PM" },
  { id: 2, date: "Tomorrow", title: "Security audit sync", subtitle: "SOC 2 quarterly review", time: "10:00 AM" },
  { id: 3, date: "Fri", title: "Platform roadmap review", subtitle: "Q3 planning with leadership", time: "2:00 PM" },
];

const SESSIONS = [
  { id: 1, device: "MacBook Pro · Chrome", location: "Austin, TX", current: true, lastActive: "Active now" },
  { id: 2, device: "iPhone 15 · Safari", location: "Austin, TX", current: false, lastActive: "2 hours ago" },
];

const PERMISSIONS = [
  "User management",
  "Course approvals",
  "Financial controls",
  "System settings",
  "Security logs",
  "Report exports",
];

const ACTIVITY_ICONS = {
  approval: BookOpen,
  user: Users,
  payout: DollarSign,
  system: Server,
};

function AnimatedNumber({ value, suffix = "" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const spring = useSpring(0, { stiffness: 60, damping: 18, mass: 0.8 });
  const display = useTransform(spring, (v) => {
    const rounded = value % 1 !== 0 ? v.toFixed(1) : Math.round(v);
    return `${rounded}${suffix}`;
  });

  useEffect(() => {
    if (isInView) spring.set(value);
  }, [isInView, spring, value]);

  return (
    <motion.span ref={ref} className="profile-stat-value">
      {display}
    </motion.span>
  );
}

function SectionHeader({ title, subtitle, badge }) {
  return (
    <div className="profile-section-header">
      <div>
        <h2 className="dashboard-section-title text-base sm:text-lg">{title}</h2>
        {subtitle && <p className="profile-section-sub">{subtitle}</p>}
      </div>
      {badge}
    </div>
  );
}

function Card({ className = "", children }) {
  return (
    <motion.div
      className={`dashboard-card profile-card ${className}`}
      variants={item}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
    >
      {children}
    </motion.div>
  );
}

function DetailRow({ icon: Icon, label, value, href }) {
  const content = (
    <div className="profile-detail-row">
      <div className="profile-detail-icon">
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="profile-detail-label">{label}</p>
        <p className="profile-detail-value truncate">{value}</p>
      </div>
      {href && <ChevronRight className="h-4 w-4 shrink-0 text-subtle" />}
    </div>
  );

  if (href) {
    return (
      <motion.a href={href} target="_blank" rel="noopener noreferrer" className="block" whileHover={{ x: 3 }}>
        {content}
      </motion.a>
    );
  }
  return content;
}

function PreferencesSection() {
  const [timezone, setTimezone] = useState(PROFILE.timezone);
  const [language, setLanguage] = useState(PROFILE.language);
  const [saved, setSaved] = useState(false);

  const markSaved = () => {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  };

  return (
    <Card className="p-4 sm:p-5 md:p-6">
      <SectionHeader
        title="Preferences"
        subtitle="Regional & language settings"
        badge={
          <AnimatePresence>
            {saved && (
              <motion.span className="profile-prefs-saved" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}>
                <CheckCircle2 className="h-3.5 w-3.5" />
                Saved
              </motion.span>
            )}
          </AnimatePresence>
        }
      />
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="profile-field">
          <label htmlFor="admin-timezone"><Globe className="inline h-3.5 w-3.5 -translate-y-px text-primary" aria-hidden /> Timezone</label>
          <div className="profile-select-wrap">
            <select id="admin-timezone" value={timezone} onChange={(e) => { setTimezone(e.target.value); markSaved(); }} className="profile-select">
              {TIMEZONE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label} ({o.offset})</option>
              ))}
            </select>
            <ChevronDown className="profile-select-chevron" aria-hidden />
          </div>
        </div>
        <div className="profile-field">
          <label htmlFor="admin-language">Language</label>
          <div className="profile-select-wrap">
            <select id="admin-language" value={language} onChange={(e) => { setLanguage(e.target.value); markSaved(); }} className="profile-select">
              {LANGUAGE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label} — {o.native}</option>
              ))}
            </select>
            <ChevronDown className="profile-select-chevron" aria-hidden />
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function AdminProfilePage() {
  const heroRef = useRef(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isSaved, setIsSaved] = useState(false);

  const handleQuickSave = (e) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <motion.div className="dashboard-page profile-page mx-auto w-full max-w-[1320px] space-y-3 sm:space-y-4" variants={container} initial="hidden" animate="visible">
      <motion.div variants={item}>
        <ProfileHeroBanner ref={heroRef} profile={PROFILE} settingsPath="/admin/settings" showStreak={false} />
      </motion.div>

      <motion.section className="profile-stats-wrap" variants={item}>
        <div className="profile-stats-scroll profile-stats-6">
          {STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div key={stat.label} className={`profile-stat-card ${stat.accent}`} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.05, duration: 0.4, ease: EASE }} whileHover={{ y: -3 }}>
                <div className={`profile-stat-icon ${stat.accent}`}><Icon className="h-4 w-4" /></div>
                <div className="min-w-0">
                  <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                  <p className="profile-stat-label">{stat.label}</p>
                  <p className="profile-stat-sub">{stat.sub}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      <motion.div className="profile-tabs-shell dashboard-card" variants={item}>
        <div className="profile-tabs-scroll" role="tablist" aria-label="Admin profile sections">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button key={tab.id} type="button" role="tab" aria-selected={isActive} onClick={() => setActiveTab(tab.id)} className={`profile-tab relative ${isActive ? "profile-tab-active" : ""}`}>
                {isActive && <motion.span layoutId="admin-profile-tab-bg" className="profile-tab-indicator" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
                <Icon className="relative z-[1] h-4 w-4" />
                <span className="relative z-[1]">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} variants={tabContent} initial="hidden" animate="visible" exit="exit">
          {activeTab === "overview" && (
            <div className="profile-overview-layout">
              <div className="profile-main-col space-y-3 sm:space-y-4">
                <Card className="p-4 sm:p-5 md:p-6">
                  <SectionHeader title="Admin profile" subtitle="Your platform administrator identity" badge={<span className="dashboard-pill"><Shield className="h-3 w-3" />Internal</span>} />
                  <form onSubmit={handleQuickSave} className="mt-4 space-y-4">
                    <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                      {[
                        { id: "first", label: "First name", value: PROFILE.firstName },
                        { id: "last", label: "Last name", value: PROFILE.lastName },
                        { id: "username", label: "Admin username", value: PROFILE.username },
                        { id: "headline", label: "Title", value: PROFILE.headline },
                        { id: "phone", label: "Phone", value: PROFILE.phone, type: "tel" },
                        { id: "department", label: "Department", value: PROFILE.department },
                        { id: "role", label: "Role", value: PROFILE.role },
                        { id: "location", label: "Location", value: PROFILE.location },
                      ].map((field, i) => (
                        <motion.div key={field.id} className="profile-field" custom={i} variants={listItem} initial="hidden" animate="visible">
                          <label htmlFor={field.id}>{field.label}</label>
                          <input id={field.id} type={field.type || "text"} defaultValue={field.value} className="profile-input" />
                        </motion.div>
                      ))}
                    </div>
                    <motion.div className="profile-field" variants={listItem} initial="hidden" animate="visible" custom={8}>
                      <label htmlFor="admin-email">Work email</label>
                      <input id="admin-email" type="email" defaultValue={PROFILE.email} className="profile-input" />
                    </motion.div>
                    <motion.div className="profile-field" variants={listItem} initial="hidden" animate="visible" custom={9}>
                      <label htmlFor="admin-bio">Bio</label>
                      <textarea id="admin-bio" rows={3} defaultValue={PROFILE.bio} className="profile-input profile-textarea" />
                    </motion.div>
                    <AnimatePresence>
                      {isSaved && (
                        <motion.div className="profile-save-toast" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                          <CheckCircle2 className="h-4 w-4" />Profile updated successfully
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <div className="profile-form-footer">
                      <button type="button" className="profile-link-btn" onClick={() => heroRef.current?.openAvatarUpload()}>
                        <UploadCloud className="h-4 w-4" />Upload new photo
                      </button>
                      <motion.button type="submit" className="profile-btn profile-btn-primary w-full sm:w-auto" whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>Save changes</motion.button>
                    </div>
                  </form>
                </Card>
                <PreferencesSection />
                <Card className="p-4 sm:p-5 md:p-6">
                  <SectionHeader title="Contact & channels" subtitle="Admin contact information" />
                  <div className="mt-4 space-y-2">
                    <DetailRow icon={FaGithub} label="GitHub" value={PROFILE.social.github} href={`https://${PROFILE.social.github}`} />
                    <DetailRow icon={FaLinkedinIn} label="LinkedIn" value={PROFILE.social.linkedin} href={`https://${PROFILE.social.linkedin}`} />
                    <DetailRow icon={Link2} label="Team page" value={PROFILE.social.portfolio} href={`https://${PROFILE.social.portfolio}`} />
                  </div>
                </Card>
              </div>

              <div className="profile-side-col space-y-3 sm:space-y-4">
                <Card className="p-4 sm:p-5">
                  <SectionHeader title="Account summary" />
                  <div className="mt-3 space-y-2.5">
                    {[
                      { icon: Zap, label: "Access level", value: PROFILE.plan },
                      { icon: Mail, label: "Email", value: PROFILE.email },
                      { icon: CalendarDays, label: "Admin since", value: PROFILE.memberSince },
                      { icon: Clock3, label: "Last active", value: PROFILE.lastActive },
                    ].map((row, i) => (
                      <motion.div key={row.label} className="profile-summary-row" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.06 }}>
                        <row.icon className="h-4 w-4 shrink-0 text-primary" />
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-semibold uppercase tracking-wide text-subtle">{row.label}</p>
                          <p className="truncate text-sm font-medium text-text">{row.value}</p>
                        </div>
                      </motion.div>
                    ))}
                    <motion.div className={`profile-security-badge ${PROFILE.twoFactorEnabled ? "profile-security-on" : ""}`}>
                      <Shield className="h-4 w-4" />
                      <span>{PROFILE.twoFactorEnabled ? "2FA enabled" : "2FA disabled"}</span>
                      <Link to="/admin/settings" className="ml-auto text-xs font-semibold text-primary hover:underline">Manage</Link>
                    </motion.div>
                  </div>
                </Card>

                <Card className="p-4 sm:p-5">
                  <SectionHeader title="Upcoming tasks" subtitle="Admin schedule" />
                  <ul className="mt-3 space-y-2">
                    {UPCOMING_TASKS.map((event, i) => (
                      <motion.li key={event.id} className="profile-upcoming-row" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 + i * 0.07 }} whileHover={{ x: 3 }}>
                        <div className="profile-upcoming-date"><CalendarDays className="h-3.5 w-3.5" /><span>{event.date}</span></div>
                        <p className="mt-1 text-sm font-semibold text-text">{event.title}</p>
                        <p className="text-xs text-muted">{event.subtitle} · {event.time}</p>
                      </motion.li>
                    ))}
                  </ul>
                </Card>

                <Card className="p-4 sm:p-5">
                  <SectionHeader title="Recent admin actions" />
                  <ul className="profile-timeline mt-3">
                    {ADMIN_ACTIVITY.map((entry, i) => {
                      const Icon = ACTIVITY_ICONS[entry.type] || Activity;
                      return (
                        <motion.li key={entry.id} className="profile-timeline-item" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.06 + i * 0.07 }}>
                          <div className="profile-timeline-icon"><Icon className="h-3.5 w-3.5" /></div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-text">{entry.text}</p>
                            <p className="mt-0.5 text-xs text-subtle">{entry.time}</p>
                          </div>
                        </motion.li>
                      );
                    })}
                  </ul>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "operations" && (
            <div className="space-y-4">
              <div className="profile-learning-summary">
                {[
                  { label: "Pending approvals", value: PENDING_APPROVALS.length, icon: BookOpen },
                  { label: "Open tickets", value: 7, icon: AlertTriangle },
                  { label: "Active mentors", value: 186, icon: Users },
                ].map((s, i) => (
                  <motion.div key={s.label} className="profile-mini-stat" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 }}>
                    <s.icon className="h-4 w-4 text-primary" />
                    <span className="profile-mini-stat-value">{s.value}</span>
                    <span className="profile-mini-stat-label">{s.label}</span>
                  </motion.div>
                ))}
              </div>

              <Card className="p-4 sm:p-5 md:p-6">
                <SectionHeader title="Pending course approvals" subtitle="Requires your review" badge={<Link to="/admin/approvals" className="text-xs font-semibold text-primary hover:underline">View all</Link>} />
                <div className="mt-4 space-y-2">
                  {PENDING_APPROVALS.map((item, i) => (
                    <motion.div key={item.id} className="profile-completed-row" initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} whileHover={{ x: 4 }}>
                      <div className="profile-completed-icon"><BookOpen className="h-4 w-4" /></div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-text">{item.title}</p>
                        <p className="text-xs text-muted">{item.mentor} · {item.submitted} · {item.status}</p>
                      </div>
                      <Link to="/admin/approvals" className="profile-course-cta shrink-0 text-xs">Review</Link>
                    </motion.div>
                  ))}
                </div>
              </Card>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: "User management", to: "/admin/users", icon: Users },
                  { label: "Financials", to: "/admin/revenue", icon: DollarSign },
                  { label: "Reports", to: "/admin/reports", icon: BarChart2 },
                  { label: "System settings", to: "/admin/settings", icon: Settings },
                ].map((action, i) => {
                  const Icon = action.icon;
                  return (
                    <motion.div key={action.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                      <Link to={action.to} className="dashboard-action-btn group flex h-full items-center justify-center rounded-xl border border-border bg-surface p-4">
                        <div className="flex items-center justify-center gap-2.5">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="h-4 w-4" /></div>
                          <span className="text-sm font-semibold text-text">{action.label}</span>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="profile-overview-layout">
              <div className="profile-main-col space-y-3 sm:space-y-4">
                <Card className="p-4 sm:p-5 md:p-6">
                  <SectionHeader title="Active sessions" subtitle="Devices signed into your admin account" />
                  <ul className="mt-4 space-y-2">
                    {SESSIONS.map((session, i) => (
                      <motion.li key={session.id} className="profile-completed-row" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                        <div className="profile-completed-icon"><Monitor className="h-4 w-4" /></div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-text">{session.device}</p>
                          <p className="text-xs text-muted">{session.location} · {session.lastActive}</p>
                        </div>
                        {session.current ? (
                          <span className="dashboard-status-live text-[10px]">Current</span>
                        ) : (
                          <button type="button" className="text-xs font-semibold text-danger hover:underline">Revoke</button>
                        )}
                      </motion.li>
                    ))}
                  </ul>
                </Card>

                <Card className="p-4 sm:p-5 md:p-6">
                  <SectionHeader title="Admin permissions" subtitle="Your current access scope" />
                  <div className="mt-3 flex flex-wrap gap-2">
                    {PERMISSIONS.map((perm) => (
                      <span key={perm} className="profile-skill-tag"><Key className="mr-1 inline h-3 w-3" />{perm}</span>
                    ))}
                  </div>
                </Card>
              </div>

              <div className="profile-side-col space-y-3 sm:space-y-4">
                <Card className="p-4 sm:p-5">
                  <SectionHeader title="Security status" />
                  <div className="mt-3 space-y-3">
                    <div className={`profile-security-badge profile-security-on`}>
                      <Shield className="h-4 w-4" /><span>Two-factor authentication enabled</span>
                    </div>
                    <div className="profile-security-badge">
                      <ShieldAlert className="h-4 w-4" /><span>Last password change: 42 days ago</span>
                    </div>
                    <Link to="/admin/settings" className="profile-btn profile-btn-outline w-full justify-center">
                      <Settings className="h-4 w-4" />Security settings
                    </Link>
                  </div>
                </Card>

                <Card className="p-4 sm:p-5">
                  <SectionHeader title="Audit log" subtitle="Recent security events" />
                  <ul className="profile-timeline mt-3">
                    {[
                      { id: 1, text: "Admin login from Austin, TX", time: "5 min ago" },
                      { id: 2, text: "API key accessed — reports export", time: "2 hours ago" },
                      { id: 3, text: "Failed login block triggered", time: "1 day ago" },
                    ].map((entry, i) => (
                      <motion.li key={entry.id} className="profile-timeline-item" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                        <div className="profile-timeline-icon"><Shield className="h-3.5 w-3.5" /></div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-text">{entry.text}</p>
                          <p className="mt-0.5 text-xs text-subtle">{entry.time}</p>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                </Card>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
