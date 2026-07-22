import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useSpring, useTransform, useInView } from "framer-motion";
import {
  Award,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  Flame,
  Globe,
  GraduationCap,
  Link2,
  Mail,
  Pencil,
  Plus,
  Shield,
  Sparkles,
  Star,
  Trophy,
  UploadCloud,
  User,
  Video,
  X,
  Zap,
} from "lucide-react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa6";
import ProfileHeroBanner from "@/components/profile/ProfileHeroBanner";
import { getResumeUrlForTrack } from "@/features/learn/learningSession";
import useStudentProfileData from "@/hooks/useStudentProfileData";
import { buildProfileFormPayload } from "@/lib/profile/profileMapper";

const EASE = [0.16, 1, 0.3, 1];

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.04 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: EASE },
  },
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
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.38, ease: EASE },
  },
  exit: {
    opacity: 0,
    y: -8,
    filter: "blur(4px)",
    transition: { duration: 0.22, ease: EASE },
  },
};

const PROFILE_DEFAULT = {
  firstName: "",
  lastName: "",
  username: "@student",
  email: "",
  phone: "",
  headline: "",
  bio: "",
  location: "",
  timezone: "UTC",
  language: "English",
  memberSince: "—",
  lastActive: "—",
  plan: "Student",
  avatar: null,
  cover: "/assets/profile-cover-default.svg",
  verified: true,
  twoFactorEnabled: false,
  streak: 0,
  social: {
    github: "",
    linkedin: "",
    portfolio: "",
  },
};

const STATS = [
  { label: "Courses", value: 8, suffix: "", sub: "2 active", icon: BookOpen, accent: "profile-kpi-primary" },
  { label: "Study hours", value: 124, suffix: "+", sub: "7 this week", icon: Clock3, accent: "profile-kpi-success" },
  { label: "Certificates", value: 4, suffix: "", sub: "3 verified", icon: Award, accent: "profile-kpi-accent" },
  { label: "Avg. progress", value: 72, suffix: "%", sub: "Across tracks", icon: Trophy, accent: "profile-kpi-warning" },
  { label: "Lessons done", value: 42, suffix: "", sub: "7 today", icon: CheckCircle2, accent: "profile-kpi-primary" },
  { label: "Quiz score", value: 88, suffix: "%", sub: "Avg. grade", icon: Star, accent: "profile-kpi-success" },
];

const INITIAL_SKILLS = [
  { id: "skill-1", name: "React" },
  { id: "skill-2", name: "TypeScript" },
  { id: "skill-3", name: "AWS" },
  { id: "skill-4", name: "System Design" },
  { id: "skill-5", name: "UI/UX" },
  { id: "skill-6", name: "Node.js" },
  { id: "skill-7", name: "Docker" },
  { id: "skill-8", name: "Kubernetes" },
];

const SUGGESTED_SKILLS = [
  "Python",
  "JavaScript",
  "GraphQL",
  "PostgreSQL",
  "Terraform",
  "CI/CD",
  "Redis",
  "Next.js",
  "MongoDB",
  "Azure",
  "GCP",
  "Figma",
];

const TIMEZONE_OPTIONS = [
  { value: "Pacific Time (PT)", label: "Pacific Time (PT)", offset: "UTC−08:00" },
  { value: "Mountain Time (MT)", label: "Mountain Time (MT)", offset: "UTC−07:00" },
  { value: "Central Time (CT)", label: "Central Time (CT)", offset: "UTC−06:00" },
  { value: "Eastern Time (ET)", label: "Eastern Time (ET)", offset: "UTC−05:00" },
  { value: "UTC", label: "Coordinated Universal Time (UTC)", offset: "UTC±00:00" },
  { value: "GMT", label: "Greenwich Mean Time (GMT)", offset: "UTC±00:00" },
  { value: "India Standard Time (IST)", label: "India Standard Time (IST)", offset: "UTC+05:30" },
  { value: "Central European Time (CET)", label: "Central European Time (CET)", offset: "UTC+01:00" },
  { value: "Japan Standard Time (JST)", label: "Japan Standard Time (JST)", offset: "UTC+09:00" },
  { value: "Australian Eastern Time (AET)", label: "Australian Eastern Time (AET)", offset: "UTC+10:00" },
];

const LANGUAGE_OPTIONS = [
  { value: "English", label: "English", native: "English" },
  { value: "Spanish", label: "Spanish", native: "Español" },
  { value: "French", label: "French", native: "Français" },
  { value: "German", label: "German", native: "Deutsch" },
  { value: "Portuguese", label: "Portuguese", native: "Português" },
  { value: "Hindi", label: "Hindi", native: "हिन्दी" },
  { value: "Mandarin Chinese", label: "Mandarin Chinese", native: "中文" },
  { value: "Japanese", label: "Japanese", native: "日本語" },
  { value: "Arabic", label: "Arabic", native: "العربية" },
  { value: "Korean", label: "Korean", native: "한국어" },
];

const COURSES_IN_PROGRESS = [
  {
    id: 1,
    trackId: "cloud",
    title: "AWS Solution Architect",
    progress: 65,
    lessonsLeft: 15,
    instructor: "Dr. Arjan Singh",
    nextLesson: "Lambda & Serverless",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: 2,
    trackId: "fullstack",
    title: "React Development Masterclass",
    progress: 42,
    lessonsLeft: 22,
    instructor: "Sarah Jenkins",
    nextLesson: "Custom Hooks Deep Dive",
    image:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: 3,
    trackId: "fullstack",
    title: "UI/UX Design Systems",
    progress: 85,
    lessonsLeft: 4,
    instructor: "Marcus Lee",
    nextLesson: "Design Tokens Workshop",
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=400&auto=format&fit=crop",
  },
];

const COMPLETED_COURSES = [
  { id: 1, title: "Azure Generative AI", completedOn: "Jan 12, 2025", grade: "94%", hours: 18 },
  { id: 2, title: "Modern JavaScript", completedOn: "Nov 28, 2024", grade: "91%", hours: 30 },
  { id: 3, title: "Python for Data Engineering", completedOn: "Oct 5, 2024", grade: "87%", hours: 22 },
];

const LEARNING_PATHS = [
  { id: 1, title: "Cloud Architecture Track", progress: 58, modules: 12, completed: 7 },
  { id: 2, title: "Full-Stack Development", progress: 34, modules: 18, completed: 6 },
];

const BADGES = [
  { id: 1, label: "Fast Learner", earned: true, icon: Sparkles },
  { id: 2, label: "7-Day Streak", earned: true, icon: Flame },
  { id: 3, label: "Top 10%", earned: true, icon: Star },
  { id: 4, label: "Cloud Certified", earned: false, icon: Shield },
  { id: 5, label: "Mentor Favorite", earned: false, icon: Trophy },
  { id: 6, label: "Perfect Score", earned: false, icon: CheckCircle2 },
];

const CERTIFICATES = [
  { id: 1, title: "AWS Cloud Practitioner", issued: "Dec 2024", credentialId: "CN-AWS-2847" },
  { id: 2, title: "React Fundamentals", issued: "Oct 2024", credentialId: "CN-REACT-1092" },
  { id: 3, title: "UI/UX Design Basics", issued: "Aug 2024", credentialId: "CN-UX-3310" },
];

const QUIZ_RESULTS = [
  { id: 1, title: "Cloud Architecture Quiz", score: 92, date: "2 days ago" },
  { id: 2, title: "React Hooks Assessment", score: 88, date: "1 week ago" },
  { id: 3, title: "System Design Mock", score: 85, date: "2 weeks ago" },
];

const ACTIVITY = [
  { id: 1, type: "lesson", text: "Completed lesson: Lambda & Serverless", time: "2 hours ago" },
  { id: 2, type: "badge", text: "Earned badge: Fast Learner", time: "Yesterday" },
  { id: 3, type: "assignment", text: "Submitted assignment: Cloud Architecture", time: "2 days ago" },
  { id: 4, type: "course", text: "Started course: React Development", time: "4 days ago" },
  { id: 5, type: "quiz", text: "Scored 92% on Cloud Architecture Quiz", time: "5 days ago" },
];

const UPCOMING = [
  { id: 1, date: "Tomorrow", time: "10:00 AM", title: "Live UI Workshop", subtitle: "Advanced Design Systems" },
  { id: 2, date: "In 2 Days", time: "2:30 PM", title: "React Masterclass", subtitle: "Hooks & State Management" },
  { id: 3, date: "May 12", time: "4:00 PM", title: "Portfolio Review", subtitle: "1-on-1 Mentor Session" },
];

const TABS = [
  { id: "overview", label: "Overview", icon: User },
  { id: "courses", label: "Learning", icon: BookOpen },
  { id: "achievements", label: "Achievements", icon: Trophy },
];

const STAT_ICONS = {
  Courses: BookOpen,
  "Study hours": Clock3,
  Certificates: Award,
  "Avg. progress": Trophy,
  "Lessons done": CheckCircle2,
  "Quiz score": Star,
};

const ACTIVITY_ICONS = {
  lesson: BookOpen,
  badge: Award,
  assignment: CheckCircle2,
  course: GraduationCap,
  quiz: Star,
};

function AnimatedNumber({ value, suffix = "" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const spring = useSpring(0, { stiffness: 60, damping: 18, mass: 0.8 });
  const display = useTransform(spring, (v) => `${Math.round(v)}${suffix}`);

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
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
        whileHover={{ x: 3 }}
        transition={{ duration: 0.2 }}
      >
        {content}
      </motion.a>
    );
  }

  return content;
}

function PreferencesSection({ timezone: initialTimezone, language: initialLanguage }) {
  const [timezone, setTimezone] = useState(initialTimezone || PROFILE_DEFAULT.timezone);
  const [language, setLanguage] = useState(initialLanguage || PROFILE_DEFAULT.language);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setTimezone(initialTimezone || PROFILE_DEFAULT.timezone);
    setLanguage(initialLanguage || PROFILE_DEFAULT.language);
  }, [initialTimezone, initialLanguage]);

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
              <motion.span
                className="profile-prefs-saved"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Saved
              </motion.span>
            )}
          </AnimatePresence>
        }
      />

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <motion.div
          className="profile-field"
          variants={listItem}
          initial="hidden"
          animate="visible"
          custom={0}
        >
          <label htmlFor="timezone">
            <Globe className="inline h-3.5 w-3.5 -translate-y-px text-primary" aria-hidden />
            {" "}Timezone
          </label>
          <div className="profile-select-wrap">
            <select
              id="timezone"
              value={timezone}
              onChange={(e) => {
                setTimezone(e.target.value);
                markSaved();
              }}
              className="profile-select"
              aria-label="Select timezone"
            >
              {TIMEZONE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label} ({option.offset})
                </option>
              ))}
            </select>
            <ChevronDown className="profile-select-chevron" aria-hidden />
          </div>
        </motion.div>

        <motion.div
          className="profile-field"
          variants={listItem}
          initial="hidden"
          animate="visible"
          custom={1}
        >
          <label htmlFor="language">Language</label>
          <div className="profile-select-wrap">
            <select
              id="language"
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                markSaved();
              }}
              className="profile-select"
              aria-label="Select language"
            >
              {LANGUAGE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label} — {option.native}
                </option>
              ))}
            </select>
            <ChevronDown className="profile-select-chevron" aria-hidden />
          </div>
        </motion.div>
      </div>
    </Card>
  );
}

function SkillsSection({ initialSkills = [] }) {
  const [skills, setSkills] = useState(initialSkills);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [feedback, setFeedback] = useState({ type: "", text: "" });
  const addInputRef = useRef(null);
  const editInputRef = useRef(null);

  const normalize = (value) => value.trim().replace(/\s+/g, " ");

  const validateSkill = (name, excludeId = null) => {
    const normalized = normalize(name);
    if (!normalized) return "Enter a skill name";
    if (normalized.length > 40) return "Skill name is too long (max 40 characters)";
    if (
      skills.some(
        (skill) =>
          skill.id !== excludeId && skill.name.toLowerCase() === normalized.toLowerCase()
      )
    ) {
      return "This skill is already on your profile";
    }
    return "";
  };

  const flash = (type, text) => {
    setFeedback({ type, text });
    window.setTimeout(() => setFeedback({ type: "", text: "" }), 2400);
  };

  const handleAdd = (rawName) => {
    const error = validateSkill(rawName);
    if (error) {
      flash("error", error);
      return;
    }
    setSkills((prev) => [
      ...prev,
      { id: `skill-${Date.now()}`, name: normalize(rawName) },
    ]);
    setNewSkill("");
    flash("success", "Skill added");
  };

  const handleDelete = (id) => {
    setSkills((prev) => prev.filter((skill) => skill.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setEditValue("");
    }
    flash("success", "Skill removed");
  };

  const startEdit = (skill) => {
    setIsEditing(true);
    setEditingId(skill.id);
    setEditValue(skill.name);
    setShowAddForm(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue("");
  };

  const saveEdit = () => {
    const error = validateSkill(editValue, editingId);
    if (error) {
      flash("error", error);
      return;
    }
    setSkills((prev) =>
      prev.map((skill) =>
        skill.id === editingId ? { ...skill, name: normalize(editValue) } : skill
      )
    );
    setEditingId(null);
    setEditValue("");
    flash("success", "Skill updated");
  };

  const handleDone = () => {
    if (editingId) saveEdit();
    setIsEditing(false);
    setShowAddForm(false);
    setNewSkill("");
    setEditingId(null);
    setEditValue("");
    setFeedback({ type: "", text: "" });
  };

  const openAddForm = () => {
    setIsEditing(true);
    setShowAddForm(true);
    setEditingId(null);
    setEditValue("");
  };

  useEffect(() => {
    if (showAddForm) addInputRef.current?.focus();
  }, [showAddForm]);

  useEffect(() => {
    if (editingId) editInputRef.current?.focus();
  }, [editingId]);

  const suggestions = SUGGESTED_SKILLS.filter(
    (name) => !skills.some((skill) => skill.name.toLowerCase() === name.toLowerCase())
  ).slice(0, 6);

  return (
    <Card className="p-4 sm:p-5 md:p-6">
      <SectionHeader
        title="Skills & interests"
        subtitle={`${skills.length} skill${skills.length === 1 ? "" : "s"} listed`}
        badge={
          <div className="profile-skills-actions">
            {!isEditing ? (
              <>
                <motion.button
                  type="button"
                  className="profile-skill-action-btn"
                  onClick={openAddForm}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.96 }}
                  aria-label="Add skill"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add</span>
                </motion.button>
                <motion.button
                  type="button"
                  className="profile-skill-action-btn profile-skill-action-btn-primary"
                  onClick={() => setIsEditing(true)}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.96 }}
                  aria-label="Edit skills"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  <span>Edit</span>
                </motion.button>
              </>
            ) : (
              <motion.button
                type="button"
                className="profile-skill-action-btn profile-skill-action-btn-done"
                onClick={handleDone}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.96 }}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Done</span>
              </motion.button>
            )}
          </div>
        }
      />

      <AnimatePresence mode="wait">
        {feedback.text && (
          <motion.p
            key={feedback.text}
            className={`profile-skills-feedback profile-skills-feedback-${feedback.type}`}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
          >
            {feedback.text}
          </motion.p>
        )}
      </AnimatePresence>

      {skills.length === 0 && !showAddForm ? (
        <div className="profile-skills-empty">
          <p className="text-sm text-muted">Showcase your expertise — add skills recruiters look for.</p>
          <button type="button" className="profile-skill-add-link" onClick={openAddForm}>
            <Plus className="h-4 w-4" />
            Add your first skill
          </button>
        </div>
      ) : (
        <div className="mt-3 flex flex-wrap gap-2">
          <AnimatePresence mode="popLayout">
            {skills.map((skill, i) =>
              editingId === skill.id ? (
                <motion.div
                  key={skill.id}
                  layout
                  className="profile-skill-edit-inline"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                >
                  <input
                    ref={editInputRef}
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEdit();
                      if (e.key === "Escape") cancelEdit();
                    }}
                    className="profile-skill-edit-input"
                    aria-label="Edit skill name"
                    maxLength={40}
                  />
                  <button
                    type="button"
                    className="profile-skill-inline-btn profile-skill-inline-btn-save"
                    onClick={saveEdit}
                    aria-label="Save skill"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    className="profile-skill-inline-btn"
                    onClick={cancelEdit}
                    aria-label="Cancel edit"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </motion.div>
              ) : (
                <motion.span
                  key={skill.id}
                  layout
                  className={`profile-skill-tag ${isEditing ? "profile-skill-tag-editing" : ""}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: i * 0.02, duration: 0.3, ease: EASE }}
                  whileHover={isEditing ? undefined : { scale: 1.06, y: -2 }}
                >
                  <span className="profile-skill-tag-label">{skill.name}</span>
                  {isEditing && (
                    <span className="profile-skill-tag-controls">
                      <button
                        type="button"
                        className="profile-skill-tag-btn"
                        onClick={() => startEdit(skill)}
                        aria-label={`Edit ${skill.name}`}
                      >
                        <Pencil className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        className="profile-skill-tag-btn profile-skill-tag-btn-danger"
                        onClick={() => handleDelete(skill.id)}
                        aria-label={`Remove ${skill.name}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                </motion.span>
              )
            )}
          </AnimatePresence>
        </div>
      )}

      <AnimatePresence>
        {(showAddForm || (isEditing && skills.length > 0)) && (
          <motion.div
            className="profile-skill-add-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: EASE }}
          >
            {showAddForm && (
              <div className="profile-skill-add-form">
                <div className="profile-skill-add-row">
                  <input
                    ref={addInputRef}
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAdd(newSkill);
                      if (e.key === "Escape") {
                        setShowAddForm(false);
                        setNewSkill("");
                      }
                    }}
                    placeholder="e.g. React, AWS, System Design"
                    className="profile-skill-add-input"
                    aria-label="New skill name"
                    maxLength={40}
                  />
                  <motion.button
                    type="button"
                    className="profile-skill-add-submit"
                    onClick={() => handleAdd(newSkill)}
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    disabled={!normalize(newSkill)}
                  >
                    <Plus className="h-4 w-4" />
                    Add skill
                  </motion.button>
                </div>

                {suggestions.length > 0 && (
                  <div className="profile-skill-suggestions">
                    <p className="profile-skill-suggestions-label">Suggested</p>
                    <div className="flex flex-wrap gap-1.5">
                      {suggestions.map((name) => (
                        <button
                          key={name}
                          type="button"
                          className="profile-skill-suggestion-chip"
                          onClick={() => handleAdd(name)}
                        >
                          <Plus className="h-3 w-3" />
                          {name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {isEditing && !showAddForm && (
              <button type="button" className="profile-skill-add-link" onClick={() => setShowAddForm(true)}>
                <Plus className="h-4 w-4" />
                Add another skill
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

export default function ProfilePage() {
  const heroRef = useRef(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isSaved, setIsSaved] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    headline: "",
    phone: "",
    location: "",
    email: "",
    bio: "",
  });

  const {
    loading: _loading,
    profile,
    stats,
    coursesInProgress,
    completedCourses,
    certificates,
    dashboard,
    saveProfile,
  } = useStudentProfileData();

  useEffect(() => {
    setForm({
      firstName: profile.firstName || "",
      lastName: profile.lastName || "",
      username: profile.username || "",
      headline: profile.headline || "",
      phone: profile.phone || "",
      location: profile.location || "",
      email: profile.email || "",
      bio: profile.bio || "",
    });
  }, [profile]);

  const earnedBadges = BADGES.filter((b) => b.earned).length;
  const displayStats = stats.length ? stats : STATS;
  const streak = dashboard?.streak || profile.streak || 0;

  const handleQuickSave = async (e) => {
    e.preventDefault();
    setSaveError("");
    try {
      const ok = await saveProfile(buildProfileFormPayload(form));
      if (!ok) throw new Error("Not signed in");
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch {
      setSaveError("Could not save profile. Try again from Settings.");
    }
  };

  const updateForm = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <motion.div
      className="dashboard-page profile-page mx-auto w-full max-w-[1320px] space-y-3 sm:space-y-4"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={item}>
        <ProfileHeroBanner ref={heroRef} profile={{ ...profile, streak }} showEditProfile={false} showStreak={streak > 0} />
      </motion.div>

      {/* Stats */}
      <motion.section className="profile-stats-wrap" variants={item}>
        <div className="profile-stats-scroll profile-stats-6">
          {displayStats.map((stat, i) => {
            const Icon = stat.icon || STAT_ICONS[stat.label] || BookOpen;
            return (
              <motion.div
                key={stat.label}
                className={`profile-stat-card ${stat.accent}`}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.05, duration: 0.4, ease: EASE }}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`profile-stat-icon ${stat.accent}`}>
                  <Icon className="h-4 w-4" />
                </div>
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

      {/* Tabs */}
      <motion.div className="profile-tabs-shell dashboard-card" variants={item}>
        <div className="profile-tabs-scroll" role="tablist" aria-label="Profile sections">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.id)}
                className={`profile-tab relative ${isActive ? "profile-tab-active" : ""}`}
              >
                {isActive && (
                  <motion.span
                    layoutId="profile-tab-bg"
                    className="profile-tab-indicator"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <Icon className="relative z-[1] h-4 w-4" />
                <span className="relative z-[1]">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          variants={tabContent}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* ── OVERVIEW ── */}
          {activeTab === "overview" && (
            <div className="profile-overview-layout">
              <div className="profile-main-col space-y-3 sm:space-y-4">
                <Card className="p-4 sm:p-5 md:p-6">
                  <SectionHeader
                    title="Personal information"
                    subtitle="Update your public profile details"
                    badge={
                      <span className="dashboard-pill w-fit">
                        <Sparkles className="h-3 w-3" />
                        Public
                      </span>
                    }
                  />

                  <form onSubmit={handleQuickSave} className="mt-4 space-y-4">
                    <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                      {[
                        { id: "first", label: "First name", field: "firstName" },
                        { id: "last", label: "Last name", field: "lastName" },
                        { id: "username", label: "Username", field: "username" },
                        { id: "headline", label: "Professional headline", field: "headline" },
                        { id: "phone", label: "Phone number", field: "phone", type: "tel" },
                        { id: "location", label: "Location", field: "location" },
                      ].map((field, i) => (
                        <motion.div
                          key={field.id}
                          className="profile-field"
                          custom={i}
                          variants={listItem}
                          initial="hidden"
                          animate="visible"
                        >
                          <label htmlFor={field.id}>{field.label}</label>
                          <input
                            id={field.id}
                            type={field.type || "text"}
                            value={form[field.field]}
                            onChange={updateForm(field.field)}
                            className="profile-input"
                          />
                        </motion.div>
                      ))}
                    </div>

                    <motion.div className="profile-field" variants={listItem} initial="hidden" animate="visible" custom={6}>
                      <label htmlFor="email">Email address</label>
                      <input id="email" type="email" value={form.email} readOnly className="profile-input opacity-80" />
                    </motion.div>

                    <motion.div className="profile-field" variants={listItem} initial="hidden" animate="visible" custom={7}>
                      <label htmlFor="bio">Bio</label>
                      <textarea id="bio" rows={3} value={form.bio} onChange={updateForm("bio")} className="profile-input profile-textarea" />
                    </motion.div>

                    {saveError ? (
                      <p className="text-sm text-danger">{saveError}</p>
                    ) : null}

                    <AnimatePresence>
                      {isSaved && (
                        <motion.div
                          className="profile-save-toast"
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -6, scale: 0.96 }}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          Profile updated successfully
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="profile-form-footer">
                      <button
                        type="button"
                        className="profile-link-btn"
                        onClick={() => heroRef.current?.openAvatarUpload()}
                      >
                        <UploadCloud className="h-4 w-4" />
                        Upload new photo
                      </button>
                      <motion.button
                        type="submit"
                        className="profile-btn profile-btn-primary w-full sm:w-auto"
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        Save changes
                      </motion.button>
                    </div>
                  </form>
                </Card>

                <PreferencesSection timezone={profile.timezone} language={profile.language} />

                <SkillsSection initialSkills={[]} />

                <Card className="p-4 sm:p-5 md:p-6">
                  <SectionHeader title="Social & portfolio" subtitle="Links shown on your public profile" />
                  <div className="mt-4 space-y-2">
                    {profile.social.github ? (
                      <DetailRow icon={FaGithub} label="GitHub" value={profile.social.github} href={`https://${profile.social.github}`} />
                    ) : null}
                    {profile.social.linkedin ? (
                      <DetailRow icon={FaLinkedinIn} label="LinkedIn" value={profile.social.linkedin} href={`https://${profile.social.linkedin}`} />
                    ) : null}
                    {profile.social.portfolio ? (
                      <DetailRow icon={Link2} label="Portfolio" value={profile.social.portfolio} href={`https://${profile.social.portfolio}`} />
                    ) : null}
                    {!profile.social.github && !profile.social.linkedin && !profile.social.portfolio ? (
                      <p className="text-sm text-muted">Add social links from Settings to show them on your public profile.</p>
                    ) : null}
                  </div>
                </Card>
              </div>

              <div className="profile-side-col space-y-3 sm:space-y-4">
                <Card className="p-4 sm:p-5">
                  <SectionHeader title="Account summary" />
                  <div className="mt-3 space-y-2.5">
                    {[
                      { icon: Zap, label: "Plan", value: profile.plan },
                      { icon: Mail, label: "Email", value: profile.email },
                      { icon: CalendarDays, label: "Member since", value: profile.memberSince },
                      { icon: Clock3, label: "Last active", value: profile.lastActive },
                    ].map((row, i) => (
                      <motion.div
                        key={row.label}
                        className="profile-summary-row"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + i * 0.06, duration: 0.35 }}
                      >
                        <row.icon className="h-4 w-4 shrink-0 text-primary" />
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-semibold uppercase tracking-wide text-subtle">{row.label}</p>
                          <p className="truncate text-sm font-medium text-text">{row.value}</p>
                        </div>
                      </motion.div>
                    ))}
                    <motion.div
                      className={`profile-security-badge ${profile.twoFactorEnabled ? "profile-security-on" : ""}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 }}
                    >
                      <Shield className="h-4 w-4" />
                      <span>{profile.twoFactorEnabled ? "2FA enabled" : "2FA disabled"}</span>
                      <Link to="/student/settings" className="ml-auto text-xs font-semibold text-primary hover:underline">
                        Manage
                      </Link>
                    </motion.div>
                  </div>
                </Card>

                <Card className="p-4 sm:p-5">
                  <SectionHeader title="Upcoming" subtitle="Classes & sessions" />
                  <ul className="mt-3 space-y-2">
                    {UPCOMING.map((event, i) => (
                      <motion.li
                        key={event.id}
                        className="profile-upcoming-row"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.08 + i * 0.07, duration: 0.35 }}
                        whileHover={{ x: 3 }}
                      >
                        <div className="profile-upcoming-date">
                          <Video className="h-3.5 w-3.5" />
                          <span>{event.date}</span>
                        </div>
                        <p className="mt-1 text-sm font-semibold text-text">{event.title}</p>
                        <p className="text-xs text-muted">{event.subtitle} · {event.time}</p>
                      </motion.li>
                    ))}
                  </ul>
                </Card>

                <Card className="p-4 sm:p-5">
                  <SectionHeader title="Recent activity" />
                  <ul className="profile-timeline mt-3">
                    {ACTIVITY.slice(0, 4).map((entry, i) => {
                      const Icon = ACTIVITY_ICONS[entry.type] || BookOpen;
                      return (
                        <motion.li
                          key={entry.id}
                          className="profile-timeline-item"
                          initial={{ opacity: 0, x: 12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.06 + i * 0.07, duration: 0.35 }}
                        >
                          <div className="profile-timeline-icon">
                            <Icon className="h-3.5 w-3.5" />
                          </div>
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

          {/* ── LEARNING ── */}
          {activeTab === "courses" && (
            <div className="space-y-4">
              <div className="profile-learning-summary">
                {[
                  { label: "In progress", value: coursesInProgress.length, icon: BookOpen },
                  { label: "Completed", value: completedCourses.length, icon: CheckCircle2 },
                  { label: "Learning paths", value: coursesInProgress.length + completedCourses.length, icon: GraduationCap },
                ].map((s, i) => (
                  <motion.div
                    key={s.label}
                    className="profile-mini-stat"
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.08, duration: 0.35 }}
                  >
                    <s.icon className="h-4 w-4 text-primary" />
                    <span className="profile-mini-stat-value">{s.value}</span>
                    <span className="profile-mini-stat-label">{s.label}</span>
                  </motion.div>
                ))}
              </div>

              <div>
                <SectionHeader title="In progress" subtitle="Continue where you left off" />
                <div className="mt-3 grid gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {coursesInProgress.length ? coursesInProgress.map((course, i) => (
                    <motion.article
                      key={course.id}
                      className="profile-course-card dashboard-card group"
                      initial={{ opacity: 0, y: 22 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.09, duration: 0.45, ease: EASE }}
                      whileHover={{ y: -5 }}
                    >
                      <div className="profile-course-image-wrap">
                        <img src={course.image} alt="" className="profile-course-image" />
                        <div className="profile-course-image-overlay" />
                        <span className="profile-course-progress-badge">{course.progress}%</span>
                      </div>
                      <div className="p-4">
                        <h3 className="line-clamp-2 text-sm font-bold text-text sm:text-base">{course.title}</h3>
                        <p className="mt-1 text-xs text-muted">{course.instructor}</p>
                        <p className="mt-2 text-xs text-subtle">
                          Next: <span className="font-medium text-text">{course.nextLesson}</span>
                        </p>
                        <p className="mt-1 text-xs text-muted">{course.lessonsLeft} lessons remaining</p>
                        <div className="mt-3">
                          <div className="profile-progress-track">
                            <motion.div
                              className="profile-progress-fill"
                              initial={{ width: 0 }}
                              animate={{ width: `${course.progress}%` }}
                              transition={{ delay: 0.15 + i * 0.1, duration: 0.85, ease: EASE }}
                            />
                          </div>
                        </div>
                        <Link to={getResumeUrlForTrack(course.trackId)} className="profile-course-cta mt-4">
                          Continue learning
                        </Link>
                      </div>
                    </motion.article>
                  )) : (
                    <p className="col-span-full text-sm text-muted">No courses in progress. Browse the catalog to enroll.</p>
                  )}
                </div>
              </div>

              <Card className="p-4 sm:p-5 md:p-6">
                <SectionHeader title="Completed courses" subtitle="Your finished learning" />
                <div className="mt-4 space-y-2">
                  {completedCourses.length ? completedCourses.map((course, i) => (
                    <motion.div
                      key={course.id}
                      className="profile-completed-row"
                      initial={{ opacity: 0, x: -14 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08, duration: 0.38 }}
                      whileHover={{ x: 4 }}
                    >
                      <div className="profile-completed-icon">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-text">{course.title}</p>
                        <p className="text-xs text-muted">
                          {course.completedOn} · {course.hours}h · Grade {course.grade}
                        </p>
                      </div>
                      <span className="profile-grade-badge">{course.grade}</span>
                    </motion.div>
                  )) : (
                    <p className="text-sm text-muted">No completed courses yet.</p>
                  )}
                </div>
              </Card>

              {coursesInProgress.length > 0 ? (
              <Card className="p-4 sm:p-5 md:p-6">
                <SectionHeader title="Learning paths" subtitle="Structured multi-course tracks" />
                <div className="mt-4 space-y-3">
                  {coursesInProgress.map((path, i) => (
                    <motion.div
                      key={path.id}
                      className="profile-path-row"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1, duration: 0.4 }}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-text">{path.title}</p>
                        <span className="text-xs font-bold text-primary">{path.progress}%</span>
                      </div>
                      <p className="mt-0.5 text-xs text-muted">
                        {path.lessonsLeft} lessons remaining
                      </p>
                      <div className="profile-progress-track mt-2">
                        <motion.div
                          className="profile-progress-fill"
                          initial={{ width: 0 }}
                          animate={{ width: `${path.progress}%` }}
                          transition={{ delay: 0.2 + i * 0.12, duration: 0.8, ease: EASE }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
              ) : null}
            </div>
          )}

          {/* ── ACHIEVEMENTS ── */}
          {activeTab === "achievements" && (
            <div className="space-y-4">
              <div className="profile-learning-summary">
                {[
                  { label: "Badges earned", value: earnedBadges, icon: Trophy },
                  { label: "Certificates", value: certificates.length, icon: Award },
                  { label: "Avg. quiz", value: dashboard?.quizAvg ? `${dashboard.quizAvg}%` : "—", icon: Star },
                ].map((s, i) => (
                  <motion.div
                    key={s.label}
                    className="profile-mini-stat"
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.08, duration: 0.35 }}
                  >
                    <s.icon className="h-4 w-4 text-primary" />
                    <span className="profile-mini-stat-value">{s.value}</span>
                    <span className="profile-mini-stat-label">{s.label}</span>
                  </motion.div>
                ))}
              </div>

              <div className="profile-achievements-grid">
                <Card className="p-4 sm:p-5 md:p-6">
                  <SectionHeader
                    title="Badges"
                    subtitle={`${earnedBadges} of ${BADGES.length} unlocked`}
                  />
                  <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
                    {BADGES.map((badge, i) => {
                      const Icon = badge.icon;
                      return (
                        <motion.div
                          key={badge.id}
                          className={`profile-badge-tile ${badge.earned ? "profile-badge-tile-earned" : ""}`}
                          initial={{ opacity: 0, scale: 0.85, rotate: -3 }}
                          animate={{ opacity: badge.earned ? 1 : 0.45, scale: 1, rotate: 0 }}
                          transition={{ delay: i * 0.06, duration: 0.4, ease: EASE }}
                          whileHover={badge.earned ? { scale: 1.05, y: -3 } : { scale: 1.02 }}
                        >
                          <div className="profile-badge-icon-wrap">
                            <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                          </div>
                          <span className="profile-badge-label">{badge.label}</span>
                          {badge.earned && <span className="profile-badge-glow" aria-hidden />}
                        </motion.div>
                      );
                    })}
                  </div>
                </Card>

                <Card className="p-4 sm:p-5 md:p-6">
                  <SectionHeader title="Certificates" subtitle="Verified credentials" />
                  <div className="mt-4 space-y-2 sm:space-y-3">
                    {certificates.length ? certificates.map((cert, i) => (
                      <motion.div
                        key={cert.id}
                        className="profile-cert-row"
                        initial={{ opacity: 0, x: -14 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08, duration: 0.38 }}
                        whileHover={{ x: 4 }}
                      >
                        <div className="profile-cert-icon">
                          <Award className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-text">{cert.title}</p>
                          <p className="text-xs text-muted">
                            Issued {cert.issued} · ID {cert.credentialId}
                          </p>
                        </div>
                        <Link to={`/student/certificates/${cert.id}`} className="profile-cert-link">
                          View
                        </Link>
                      </motion.div>
                    )) : (
                      <p className="text-sm text-muted">Complete a course to earn your first certificate.</p>
                    )}
                  </div>
                </Card>
              </div>

              <Card className="p-4 sm:p-5 md:p-6">
                <SectionHeader title="Quiz performance" subtitle="Recent assessment scores" />
                <div className="mt-4 grid gap-2 sm:grid-cols-3 sm:gap-3">
                  {QUIZ_RESULTS.map((quiz, i) => (
                    <motion.div
                      key={quiz.id}
                      className="profile-quiz-card"
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.09, duration: 0.38 }}
                      whileHover={{ y: -3 }}
                    >
                      <div className="profile-quiz-score">{quiz.score}%</div>
                      <p className="mt-2 line-clamp-2 text-sm font-semibold text-text">{quiz.title}</p>
                      <p className="mt-1 text-xs text-muted">{quiz.date}</p>
                      <div className="profile-progress-track mt-3">
                        <motion.div
                          className="profile-progress-fill"
                          initial={{ width: 0 }}
                          animate={{ width: `${quiz.score}%` }}
                          transition={{ delay: 0.2 + i * 0.1, duration: 0.7, ease: EASE }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
