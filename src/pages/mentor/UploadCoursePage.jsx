import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  Award,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  CloudUpload,
  DollarSign,
  FileText,
  Globe,
  GripVertical,
  Image,
  Layers3,
  Lock,
  Plus,
  Sparkles,
  Star,
  Tag,
  Trash2,
  Upload,
  Users,
  Video,
  X,
  Zap,
  AlertCircle,
  Target,
  Languages,
  Loader2,
  Eye,
} from "lucide-react";
import useAuthStore from "@/store/useAuthStore";
import {
  fetchCourse,
  submitCourseForApproval,
  updateCoursePricing,
} from "@/lib/api/contentApi";
import {
  courseToUiModules,
  emitContentChanged,
  ensureCourseOnServer,
  syncCurriculumToBackend,
} from "@/lib/api/contentSync";
import { uploadCourseThumbnail, uploadVideo, resolveMediaUrl } from "@/lib/api/mediaApi";
import { parseApiError } from "@/lib/api/apiHelpers";
import { deleteModule as deleteModuleApi, updateLesson as updateLessonApi } from "@/lib/api/contentApi";
import LessonQuizEditor, { createEmptyQuiz, quizIsValid } from "@/features/mentor/LessonQuizEditor";

const EASE = [0.16, 1, 0.3, 1];
const DRAFT_KEY = "lms-mentor-course-draft-v2";

const STEPS = [
  { id: 1, label: "Course", icon: BookOpen, desc: "Create course" },
  { id: 2, label: "Modules", icon: Layers3, desc: "Structure modules" },
  { id: 3, label: "Lessons", icon: Video, desc: "Videos & quizzes" },
  { id: 4, label: "Details", icon: DollarSign, desc: "Pricing & extras" },
  { id: 5, label: "Publish", icon: Globe, desc: "Review & go live" },
];

const CATEGORIES = [
  "Frontend Engineering",
  "Cloud & DevOps",
  "Backend Systems",
  "Data & AI",
  "System Design",
  "Mobile Dev",
];

const LEVELS = ["Beginner", "Intermediate", "Advanced", "All Levels"];

const LANGUAGES = ["English", "Hindi", "Spanish", "French", "German"];

const PRICING_PLANS = [
  {
    id: "free",
    label: "Free",
    price: "$0",
    desc: "Maximize reach & build your audience",
    icon: Users,
    accent: "upload-plan-free",
    badge: null,
  },
  {
    id: "paid",
    label: "Paid",
    price: "You set",
    desc: "Earn revenue from every enrollment",
    icon: DollarSign,
    accent: "upload-plan-paid",
    badge: "Most popular",
  },
  {
    id: "premium",
    label: "Premium",
    price: "Subscription",
    desc: "Included in Realm Pro",
    icon: Award,
    accent: "upload-plan-premium",
    badge: "Higher revenue",
  },
];

const SUGGESTED_PRICES = ["29.99", "49.99", "69.99", "89.99", "129.99"];

/** Ensure at least one lesson is marked free preview (required for publish). */
function ensureFreePreviewLesson(modules) {
  if (!modules?.length) return modules;
  if (modules.some((m) => m.lessons.some((l) => l.free))) return modules;

  for (let mi = 0; mi < modules.length; mi += 1) {
    if (!modules[mi].lessons.length) continue;
    return modules.map((m, idx) =>
      idx === mi
        ? { ...m, lessons: m.lessons.map((l, li) => (li === 0 ? { ...l, free: true } : l)) }
        : m
    );
  }
  return modules;
}

const ROADMAP_STEPS = [
  { step: '01', title: 'Basics & C++', desc: 'Flowcharts, Conditionals, Loops & Bitwise Operators' },
  { step: '02', title: 'Arrays & Strings', desc: 'Vectors, 2D Matrices, Search & Sorting Patterns' },
  { step: '03', title: 'Recursion & Trees', desc: 'Divide & Conquer, BSTs, Heaps & Backtracking' },
  { step: '04', title: 'Graphs & DP', desc: 'BFS/DFS, Shortest Path, 1D/2D Dynamic Programming' },
  { step: '05', title: 'FAANG Interview Prep', desc: 'System Design Basics, Mock Interviews & Resume Review' },
];

const DEFAULT_INSTRUCTORS = [
  {
    id: 'love-babbar',
    name: 'Love Babbar',
    roleBadge: 'Founder',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    tagline: 'Previously worked at Amazon and Microsoft.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=400&q=80',
    highlights: [
      { title: 'Senior Software Engineer', desc: 'Ex-Amazon & Ex-Microsoft SDE with extensive industry experience.' },
      { title: 'Popular Mentor & Educator', desc: 'Known for simplified explanations and real-life teaching examples.' },
      { title: 'Proven Student Success', desc: 'Ex-students now working at Microsoft, Amazon, Google, De-Shaw, and top firms.' },
      { title: 'Expert DSA Mentor', desc: 'Skilled at breaking down complex computer concepts into easy-to-grasp lessons.' },
    ],
  }
];

function safeJsonParse(str, fallback) {
  try {
    return str ? JSON.parse(str) : fallback;
  } catch (e) {
    return fallback;
  }
}

const INITIAL_FORM = {
  title: "",
  subtitle: "",
  category: "",
  level: "Intermediate",
  description: "",
  outcomes: ["", "", ""],
  requirements: "",
  language: "English",
  tags: [],
  roadmap: ROADMAP_STEPS,
  instructors: DEFAULT_INSTRUCTORS,
};

const pageVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.03 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.42, ease: EASE } },
};

function loadDraft() {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return null;
}

function FieldLabel({ children, required }) {
  return (
    <label className="upload-label">
      {children}
      {required ? <span className="text-danger"> *</span> : null}
    </label>
  );
}

function FieldInput({ className = "", ...props }) {
  return <input className={`upload-input ${className}`} {...props} />;
}

function FieldTextarea({ className = "", ...props }) {
  return <textarea className={`upload-input upload-textarea ${className}`} {...props} />;
}

function CoursePreviewPanel({ form, modules, pricingModel, customPrice, thumbnailPreview }) {
  const lessonCount = modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const displayPrice =
    pricingModel === "free" ? "Free" : pricingModel === "premium" ? "Pro" : `$${customPrice || "0.00"}`;

  return (
    <motion.aside
      variants={itemVariants}
      className="upload-preview dashboard-card hidden xl:flex xl:flex-col"
    >
      <div className="upload-preview-header">
        <Sparkles className="h-3.5 w-3.5 text-primary" />
        <span>Live preview</span>
      </div>

      <div className="upload-preview-card">
        <div className="upload-preview-thumb">
          {thumbnailPreview ? (
            <img src={thumbnailPreview} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-muted">
              <Image className="h-8 w-8 opacity-40" />
              <span className="text-[10px] font-semibold uppercase tracking-wider">Thumbnail</span>
            </div>
          )}
          {form.level && (
            <span className="upload-preview-badge">{form.level}</span>
          )}
        </div>

        <div className="upload-preview-body">
          <h3 className="line-clamp-2 font-display text-base font-bold leading-snug text-text">
            {form.title || "Your course title"}
          </h3>
          {form.subtitle && (
            <p className="mt-1 line-clamp-2 text-xs text-muted">{form.subtitle}</p>
          )}
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-muted">
            {form.category || "Category"}
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="upload-preview-meta">
              <Layers3 className="h-3 w-3" />
              {modules.length} modules
            </span>
            <span className="upload-preview-meta">
              <Video className="h-3 w-3" />
              {lessonCount} lessons
            </span>
            <span className="upload-preview-meta">
              <Languages className="h-3 w-3" />
              {form.language}
            </span>
          </div>

          <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-muted">
            {form.description || "Course description will appear here as you type."}
          </p>

          {form.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {form.tags.slice(0, 4).map((tag) => (
                <span key={tag} className="upload-tag-pill">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="upload-preview-footer">
            <span className="font-display text-xl font-bold text-primary">{displayPrice}</span>
            <span className="text-[10px] font-semibold text-muted">Udemy-style listing</span>
          </div>
        </div>
      </div>

      <div className="upload-preview-tips">
        <p className="text-[11px] font-bold uppercase tracking-wider text-muted">Quality tips</p>
        <ul className="mt-2 space-y-1.5 text-xs text-muted">
          <li className="flex items-start gap-2">
            <Check className="mt-0.5 h-3 w-3 shrink-0 text-success" />
            Add a compelling title (60 chars max)
          </li>
          <li className="flex items-start gap-2">
            <Check className="mt-0.5 h-3 w-3 shrink-0 text-success" />
            Mark 1–2 lessons as free preview
          </li>
          <li className="flex items-start gap-2">
            <Check className="mt-0.5 h-3 w-3 shrink-0 text-success" />
            Upload a 16:9 thumbnail image
          </li>
        </ul>
      </div>
    </motion.aside>
  );
}

export default function UploadCoursePage() {
  const shouldReduceMotion = useReducedMotion();
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const [searchParams] = useSearchParams();
  const editCourseIdParam = searchParams.get("courseId");
  const startNew = searchParams.get("new") === "1";
  const draft = startNew ? null : loadDraft();
  const { user, token } = useAuthStore();

  const [step, setStep] = useState(draft?.step ?? 1);
  const [form, setForm] = useState({ ...INITIAL_FORM, ...draft?.form });
  const [modules, setModules] = useState(draft?.modules ?? []);
  const [pricingModel, setPricingModel] = useState(draft?.pricingModel ?? "paid");
  const [customPrice, setCustomPrice] = useState(draft?.customPrice ?? "");
  const [thumbnailPreview, setThumbnailPreview] = useState(draft?.thumbnailPreview ?? null);
  const [courseId, setCourseId] = useState(editCourseIdParam || draft?.courseId || null);
  const [thumbnailUrl, setThumbnailUrl] = useState(draft?.thumbnailUrl ?? null);
  const [pendingThumbnailFile, setPendingThumbnailFile] = useState(null);
  const [, setUploadingThumbnail] = useState(false);
  const [uploadingVideos, setUploadingVideos] = useState(false);
  const [lessonProgress, setLessonProgress] = useState({});
  const [previewingLessonId, setPreviewingLessonId] = useState(null);
  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState({});
  const [savedAt, setSavedAt] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const resetToBlankCourse = useCallback(() => {
    sessionStorage.removeItem(DRAFT_KEY);
    setStep(1);
    setForm({ ...INITIAL_FORM });
    setModules([]);
    setPricingModel("paid");
    setCustomPrice("");
    setThumbnailPreview(null);
    setCourseId(null);
    setThumbnailUrl(null);
    setPendingThumbnailFile(null);
    setTagInput("");
    setErrors({});
    setSavedAt(null);
    setSubmitted(false);
    setSubmitError("");
  }, []);

  const lessonCount = useMemo(
    () => modules.reduce((sum, m) => sum + m.lessons.length, 0),
    [modules]
  );

  const completionScore = useMemo(() => {
    let score = 0;
    if (form.title.trim().length >= 10) score += 15;
    if (form.category) score += 10;
    if (form.description.trim().length >= 40) score += 15;
    if (form.outcomes.filter((o) => o.trim()).length >= 2) score += 10;
    if (thumbnailPreview) score += 10;
    if (lessonCount >= 3) score += 15;
    if (modules.some((m) => m.lessons.some((l) => l.free))) score += 10;
    if (pricingModel) score += 10;
    if (form.tags.length >= 2) score += 5;
    if (form.requirements.trim()) score += 10;
    return Math.min(100, score);
  }, [form, thumbnailPreview, lessonCount, modules, pricingModel]);

  const earnings = useMemo(() => {
    const price = parseFloat(customPrice || 0);
    return {
      gross: price,
      fee: price * 0.3,
      net: price * 0.7,
    };
  }, [customPrice]);

  const persistDraft = useCallback(() => {
    sessionStorage.setItem(
      DRAFT_KEY,
      JSON.stringify({
        step,
        form,
        modules,
        pricingModel,
        customPrice,
        thumbnailPreview,
        courseId,
        thumbnailUrl,
      })
    );
    setSavedAt(new Date());
  }, [step, form, modules, pricingModel, customPrice, thumbnailPreview, courseId, thumbnailUrl]);

  useEffect(() => {
    if (!user?.id || !token) return;

    // Explicit new-course flow — do not reopen the mentor's previous draft.
    if (startNew) {
      resetToBlankCourse();
      return;
    }

    // Only load a course when editing a specific id (URL or session draft).
    // Never auto-pick "latest draft" — that blocked creating additional courses.
    const id = editCourseIdParam || draft?.courseId;
    if (!id) return;

    fetchCourse(user, token, id)
      .then((course) => {
        if (!course) return;
        setCourseId(course.id);
        if (course.thumbnailUrl) {
          setThumbnailUrl(course.thumbnailUrl);
          setThumbnailPreview(course.thumbnailUrl);
        }
        setForm((prev) => ({
          ...prev,
          title: course.title || prev.title,
          subtitle: course.subtitle || prev.subtitle,
          category: course.category || prev.category,
          level: course.level || prev.level,
          description: course.description || prev.description,
          language: course.language || prev.language,
          tags: course.tags?.length ? course.tags : prev.tags,
          outcomes: course.outcomes?.length ? course.outcomes : prev.outcomes,
          requirements: course.requirements || prev.requirements,
          roadmap: safeJsonParse(course.roadmap, prev.roadmap),
          instructors: safeJsonParse(course.instructors, prev.instructors),
        }));
        if (course.pricingPlan) setPricingModel(course.pricingPlan);
        if (course.price != null) setCustomPrice(String(course.price));
        const uiModules = courseToUiModules(course);
        if (uiModules?.length) setModules(ensureFreePreviewLesson(uiModules));
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, token, editCourseIdParam, startNew]);

  useEffect(() => {
    const timer = setTimeout(persistDraft, 600);
    return () => clearTimeout(timer);
  }, [persistDraft]);

  useEffect(() => {
    if (step !== 4) return;
    setModules((prev) => ensureFreePreviewLesson(prev));
  }, [step]);

  const updateForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validateStep = (currentStep) => {
    const next = {};
    if (currentStep === 1) {
      if (!form.title.trim()) next.title = "Course title is required";
      else if (form.title.trim().length < 10) next.title = "Title should be at least 10 characters";
      if (!form.category) next.category = "Select a category";
      if (!form.description.trim()) next.description = "Description is required";
      else if (form.description.trim().length < 40) next.description = "Add at least 40 characters";
    }
    if (currentStep === 2) {
      if (!modules.length) next.curriculum = "Add at least one module";
      else if (modules.some((m) => !m.title?.trim())) next.curriculum = "Every module needs a title";
    }
    if (currentStep === 3) {
      if (lessonCount < 1) next.curriculum = "Add at least one lesson";
      const missingQuiz = modules.some((m) => m.lessons.some((l) => !quizIsValid(l.quiz)));
      if (lessonCount >= 1 && missingQuiz) {
        next.curriculum = "Every lesson needs a valid quiz (question + 2 options)";
      }
    }
    if (currentStep === 4) {
      if (pricingModel === "paid" && (!customPrice || parseFloat(customPrice) <= 0)) {
        next.price = "Enter a valid price";
      }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const goNext = async () => {
    if (!validateStep(step)) return;

    if (step < STEPS.length) {
      if (step === 1 && user?.id && token) {
        try {
          const saved = await ensureCourseOnServer(user, token, courseId, form, thumbnailUrl);
          const id = saved?.id || saved?.courseId || courseId;
          if (id) setCourseId(id);
          if (pendingThumbnailFile && id) {
            setUploadingThumbnail(true);
            const uploaded = await uploadCourseThumbnail(user, token, pendingThumbnailFile, id);
            const url = resolveMediaUrl(uploaded);
            setThumbnailUrl(url);
            setThumbnailPreview(url);
            setPendingThumbnailFile(null);
            await ensureCourseOnServer(user, token, id, form, url);
          }
        } catch (err) {
          setSubmitError(parseApiError(err));
          return;
        } finally {
          setUploadingThumbnail(false);
        }
      }
      // Persist modules (and empty lessons) after Modules step
      if ((step === 2 || step === 3) && user?.id && token && courseId) {
        try {
          const synced = await syncCurriculumToBackend(
            user,
            token,
            courseId,
            step === 3 ? ensureFreePreviewLesson(modules) : modules
          );
          setModules(synced);
        } catch (err) {
          setSubmitError(parseApiError(err));
          return;
        }
      }
      setStep((s) => s + 1);
      return;
    }

    if (!user || !token) {
      setSubmitError("Please sign in as a mentor to submit your course.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const saved = await ensureCourseOnServer(user, token, courseId, form, thumbnailUrl);
      let id = saved?.id || saved?.courseId || courseId;
      if (!id) throw new Error("Could not create course draft");

      if (pendingThumbnailFile) {
        const uploaded = await uploadCourseThumbnail(user, token, pendingThumbnailFile, id);
        const url = resolveMediaUrl(uploaded);
        setThumbnailUrl(url);
        setThumbnailPreview(url);
        setPendingThumbnailFile(null);
        await ensureCourseOnServer(user, token, id, form, url);
      }

      const synced = await syncCurriculumToBackend(
        user,
        token,
        id,
        ensureFreePreviewLesson(modules)
      );
      setModules(synced);
      setCourseId(id);

      const price =
        pricingModel === "paid" ? parseFloat(customPrice || "0") : 0;

      await updateCoursePricing(user, token, id, {
        pricingPlan: pricingModel,
        price: Number.isFinite(price) ? price : 0,
      });

      await submitCourseForApproval(user, token, id);
      emitContentChanged();

      sessionStorage.removeItem(DRAFT_KEY);
      setSubmitted(true);
    } catch (err) {
      setSubmitError(parseApiError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const goBack = () => setStep((s) => Math.max(1, s - 1));

  const handleThumbnail = async (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => setThumbnailPreview(e.target.result);
    reader.readAsDataURL(file);
    setPendingThumbnailFile(file);

    if (!user?.id || !token) return;

    try {
      setUploadingThumbnail(true);
      let id = courseId;
      if (!id) {
        const saved = await ensureCourseOnServer(user, token, null, form, null);
        id = saved?.id || saved?.courseId;
        if (id) setCourseId(id);
      }
      if (!id) return;

      const uploaded = await uploadCourseThumbnail(user, token, file, id);
      const url = resolveMediaUrl(uploaded);
      setThumbnailUrl(url);
      setThumbnailPreview(url);
      setPendingThumbnailFile(null);
      await ensureCourseOnServer(user, token, id, form, url);
    } catch {
      /* keep local preview; upload retries on submit */
    } finally {
      setUploadingThumbnail(false);
    }
  };

  const handleSingleVideoUpload = async (moduleId, lessonId, file) => {
    if (!file || !user?.id || !token) return;
    setLessonProgress((prev) => ({
      ...prev,
      [lessonId]: { percent: 0, uploading: true, fileName: file.name, error: "" },
    }));
    updateLesson(moduleId, lessonId, { uploadInProgress: true });

    try {
      let id = courseId;
      if (!id) {
        const saved = await ensureCourseOnServer(user, token, null, form, thumbnailUrl);
        id = saved?.id || saved?.courseId;
        if (id) setCourseId(id);
      }

      // Persist upload lock on server when lesson already exists
      const mod = modules.find((m) => m.id === moduleId);
      const lesson = mod?.lessons?.find((l) => l.id === lessonId);
      if (id && lesson?.serverId) {
        await updateLessonApi(user, token, id, lesson.serverId, { uploadInProgress: true }).catch(() => {});
      }

      const uploaded = await uploadVideo(user, token, file, (percent) => {
        setLessonProgress((prev) => ({
          ...prev,
          [lessonId]: { ...prev[lessonId], percent },
        }));
      });

      const url = resolveMediaUrl(uploaded);
      updateLesson(moduleId, lessonId, {
        contentUrl: url,
        mediaFileId: uploaded.id,
        videoName: file.name,
        uploadInProgress: false,
      });

      if (id && lesson?.serverId) {
        await updateLessonApi(user, token, id, lesson.serverId, {
          contentUrl: url,
          uploadInProgress: false,
        }).catch(() => {});
      }

      setLessonProgress((prev) => ({
        ...prev,
        [lessonId]: { percent: 100, uploading: false, fileName: file.name, error: "" },
      }));
    } catch (err) {
      updateLesson(moduleId, lessonId, { uploadInProgress: false });
      setLessonProgress((prev) => ({
        ...prev,
        [lessonId]: {
          percent: 0,
          uploading: false,
          fileName: "",
          error: parseApiError(err) || "Upload failed",
        },
      }));
    }
  };

  const handleBulkVideos = async (fileList) => {
    if (!user?.id || !token || !fileList?.length) return;
    const files = Array.from(fileList).filter((f) => f.type.startsWith("video/"));
    if (!files.length) return;

    setUploadingVideos(true);
    try {
      let id = courseId;
      if (!id) {
        const saved = await ensureCourseOnServer(user, token, null, form, thumbnailUrl);
        id = saved?.id || saved?.courseId;
        if (id) setCourseId(id);
      }
      if (!id) return;

      const videoLessons = modules.flatMap((m) =>
        m.lessons.filter((l) => l.type === "video" && !l.contentUrl).map((l) => ({ moduleId: m.id, lesson: l }))
      );

      const updatedModules = [...modules];
      for (let i = 0; i < files.length && i < videoLessons.length; i++) {
        const { moduleId, lesson } = videoLessons[i];
        setLessonProgress((prev) => ({
          ...prev,
          [lesson.id]: { percent: 0, uploading: true, fileName: files[i].name, error: "" },
        }));
        try {
          const uploaded = await uploadVideo(user, token, files[i], (percent) => {
            setLessonProgress((prev) => ({
              ...prev,
              [lesson.id]: { ...prev[lesson.id], percent },
            }));
          });
          const url = resolveMediaUrl(uploaded);
          const modIdx = updatedModules.findIndex((m) => m.id === moduleId);
          if (modIdx >= 0) {
            updatedModules[modIdx] = {
              ...updatedModules[modIdx],
              lessons: updatedModules[modIdx].lessons.map((l) =>
                l.id === lesson.id ? { ...l, contentUrl: url, mediaFileId: uploaded.id, videoName: files[i].name } : l
              ),
            };
          }
          setLessonProgress((prev) => ({
            ...prev,
            [lesson.id]: { percent: 100, uploading: false, fileName: files[i].name, error: "" },
          }));
        } catch {
          setLessonProgress((prev) => ({
            ...prev,
            [lesson.id]: { percent: 0, uploading: false, fileName: "", error: "Upload failed" },
          }));
        }
      }
      setModules(updatedModules);
    } catch {
      /* silent — user can retry */
    } finally {
      setUploadingVideos(false);
    }
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (!tag || form.tags.includes(tag) || form.tags.length >= 8) return;
    updateForm("tags", [...form.tags, tag]);
    setTagInput("");
  };

  const removeTag = (tag) => updateForm("tags", form.tags.filter((t) => t !== tag));

  const addModule = () => {
    setModules((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: "New module",
        open: true,
        lessons: [],
      },
    ]);
  };

  const removeModule = async (moduleId) => {
    const mod = modules.find((m) => m.id === moduleId);
    if (!mod) return;
    const uploading =
      mod.lessons.some((l) => l.uploadInProgress) ||
      mod.lessons.some((l) => lessonProgress[l.id]?.uploading);
    if (uploading) {
      setSubmitError("Cannot delete a module while a lesson video is uploading.");
      return;
    }
    if (courseId && mod.serverId && user?.id && token) {
      try {
        await deleteModuleApi(user, token, courseId, mod.serverId);
      } catch (err) {
        setSubmitError(parseApiError(err));
        return;
      }
    }
    setModules((prev) => prev.filter((m) => m.id !== moduleId));
  };

  const toggleModule = (id) => {
    setModules((prev) => prev.map((m) => (m.id === id ? { ...m, open: !m.open } : m)));
  };

  const updateModuleTitle = (id, title) => {
    setModules((prev) => prev.map((m) => (m.id === id ? { ...m, title } : m)));
  };

  const addLesson = (moduleId) => {
    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              lessons: [
                ...m.lessons,
                {
                  id: Date.now(),
                  title: "New lesson",
                  type: "video",
                  free: m.lessons.length === 0 && modules[0]?.id === moduleId,
                  duration: "10:00",
                  quiz: createEmptyQuiz(),
                },
              ],
            }
          : m
      )
    );
  };

  const updateLesson = (moduleId, lessonId, patch) => {
    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId
          ? { ...m, lessons: m.lessons.map((l) => (l.id === lessonId ? { ...l, ...patch } : l)) }
          : m
      )
    );
  };

  const removeLesson = (moduleId, lessonId) => {
    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId ? { ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) } : m
      )
    );
  };

  const publishChecks = [
    { label: "Course title & description", ok: form.title.trim().length >= 10 && form.description.trim().length >= 40 },
    { label: "Category & skill level", ok: Boolean(form.category && form.level) },
    { label: "Curriculum (3+ lessons)", ok: lessonCount >= 3 },
    { label: "Quiz on every lesson", ok: modules.every((m) => m.lessons.every((l) => quizIsValid(l.quiz))) },
    { label: "Free preview lesson", ok: modules.some((m) => m.lessons.some((l) => l.free)) },
    { label: "Course thumbnail", ok: Boolean(thumbnailPreview) },
    { label: "Pricing configured", ok: pricingModel === "free" || pricingModel === "premium" || parseFloat(customPrice) > 0 },
  ];

  const allChecksPass = publishChecks.every((c) => c.ok);

  if (submitted) {
    return (
      <motion.div
        className="dashboard-page mx-auto flex w-full max-w-[640px] flex-col items-center py-8 text-center"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: EASE }}
      >
        <motion.div
          className="upload-success-icon"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
        >
          <CheckCircle2 className="h-14 w-14 text-success" />
        </motion.div>
        <h1 className="mt-6 font-display text-3xl font-bold text-text">Course submitted!</h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
          <strong className="text-text">{form.title || "Your course"}</strong> is queued for Realm QA review.
          Typical approval takes 24–48 hours.
        </p>

        <div className="mt-8 w-full rounded-xl border border-border bg-elevated/60 p-5 text-left">
          <p className="text-[11px] font-bold uppercase tracking-wider text-primary">What happens next</p>
          <ol className="mt-4 space-y-4">
            {[
              {
                icon: Clock3,
                title: "QA review",
                body: "Our team checks curriculum quality, preview lessons, and pricing (usually 24–48 hours).",
              },
              {
                icon: Globe,
                title: "Goes live in catalog",
                body: "Once approved, students can discover your course, enroll, and start learning.",
              },
              {
                icon: Star,
                title: "Ratings from students",
                body: "Reviews, star ratings, and enrollment counts appear on your course page — only after real students engage.",
              },
            ].map(({ icon: Icon, title, body }, i) => (
              <li key={title} className="flex gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-surface text-primary">
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-[13px] font-bold text-text">
                    {i + 1}. {title}
                  </p>
                  <p className="mt-0.5 text-[12px] leading-relaxed text-muted">{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/mentor/lessons" className="upload-btn upload-btn-primary">
            Manage lessons
          </Link>
          <button type="button" onClick={resetToBlankCourse} className="upload-btn upload-btn-outline">
            Create another
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="dashboard-page upload-page mx-auto w-full max-w-[1320px] space-y-3 sm:space-y-4"
      variants={pageVariants}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.section className="dashboard-analytics-bar" variants={itemVariants}>
        <div className="dashboard-analytics-intro min-w-0">
          <span className="dashboard-pill">
            <Upload className="h-3 w-3" />
            Course creator
          </span>
          <p className="dashboard-greeting text-base sm:text-lg">
            Create your next <span className="text-primary">hit course</span>
          </p>
          <p className="dashboard-greeting-sub">
            Udemy-style wizard — build curriculum, set pricing, and publish to Realm.
          </p>
        </div>

        <div className="dashboard-analytics-metrics">
          <div className="dashboard-analytics-metric">
            <Target className="h-4 w-4 shrink-0 text-primary" />
            <div>
              <span className="dashboard-metric-value">{completionScore}%</span>
              <span className="dashboard-metric-label">Quality score</span>
            </div>
          </div>
          <div className="dashboard-analytics-metric">
            <Video className="h-4 w-4 shrink-0 text-accent" />
            <div>
              <span className="dashboard-metric-value">{lessonCount}</span>
              <span className="dashboard-metric-label">Lessons</span>
            </div>
          </div>
          <div className="dashboard-analytics-metric">
            <Layers3 className="h-4 w-4 shrink-0 text-success" />
            <div>
              <span className="dashboard-metric-value">{modules.length}</span>
              <span className="dashboard-metric-label">Modules</span>
            </div>
          </div>
          <div className="dashboard-analytics-metric">
            <DollarSign className="h-4 w-4 shrink-0 text-warning" />
            <div>
              <span className="dashboard-metric-value">${earnings.net.toFixed(0)}</span>
              <span className="dashboard-metric-label">Est. per sale</span>
            </div>
          </div>
        </div>

        <div className="upload-draft-status">
          {savedAt && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[11px] font-semibold text-success"
            >
              Draft saved
            </motion.span>
          )}
        </div>
      </motion.section>

      {/* Stepper */}
      <motion.section variants={itemVariants} className="upload-stepper dashboard-card">
        <div className="upload-stepper-track" aria-hidden>
          <motion.div
            className="upload-stepper-fill"
            animate={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
            transition={{ duration: 0.5, ease: EASE }}
          />
        </div>
        <div className="upload-stepper-steps">
          {STEPS.map((s) => {
            const Icon = s.icon;
            const done = step > s.id;
            const active = step === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => s.id < step && setStep(s.id)}
                disabled={s.id > step}
                className={`upload-step ${active ? "upload-step-active" : ""} ${done ? "upload-step-done" : ""}`}
              >
                <span className={`upload-step-icon ${active ? "upload-step-icon-active" : ""}`}>
                  {done ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                </span>
                <span className="upload-step-label">{s.label}</span>
                <span className="upload-step-desc">{s.desc}</span>
              </button>
            );
          })}
        </div>
      </motion.section>

      <div className="upload-layout">
        {/* Form wizard */}
        <motion.div variants={itemVariants} className="upload-wizard dashboard-card">
          <div className="upload-wizard-progress">
            <motion.div
              className="upload-wizard-progress-fill"
              animate={{ width: `${(step / STEPS.length) * 100}%` }}
              transition={{ duration: 0.4, ease: EASE }}
            />
          </div>

          <div className="upload-wizard-body">
            <AnimatePresence mode="wait">
              {/* Step 1 */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: shouldReduceMotion ? 0 : -16 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="space-y-5"
                >
                  <div>
                    <h2 className="font-display text-xl font-bold text-text">Course information</h2>
                    <p className="mt-1 text-sm text-muted">Tell learners what your course is about — like Udemy&apos;s landing page.</p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <FieldLabel required>Course title</FieldLabel>
                      <FieldInput
                        value={form.title}
                        onChange={(e) => updateForm("title", e.target.value)}
                        placeholder="e.g. Advanced Rust Programming for Frontend Engineers"
                        maxLength={120}
                      />
                      <div className="mt-1 flex justify-between text-[10px] text-muted">
                        {errors.title ? <span className="text-danger">{errors.title}</span> : <span>Be specific & keyword-rich</span>}
                        <span>{form.title.length}/120</span>
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <FieldLabel>Subtitle</FieldLabel>
                      <FieldInput
                        value={form.subtitle}
                        onChange={(e) => updateForm("subtitle", e.target.value)}
                        placeholder="One-line hook — what students will achieve"
                        maxLength={160}
                      />
                    </div>

                    <div>
                      <FieldLabel required>Category</FieldLabel>
                      <select
                        value={form.category}
                        onChange={(e) => updateForm("category", e.target.value)}
                        className="upload-input upload-select"
                      >
                        <option value="">Select category…</option>
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                      {errors.category && <p className="mt-1 text-[10px] text-danger">{errors.category}</p>}
                    </div>

                    <div>
                      <FieldLabel>Language</FieldLabel>
                      <select
                        value={form.language}
                        onChange={(e) => updateForm("language", e.target.value)}
                        className="upload-input upload-select"
                      >
                        {LANGUAGES.map((l) => (
                          <option key={l} value={l}>{l}</option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <FieldLabel>Skill level</FieldLabel>
                      <div className="flex flex-wrap gap-2">
                        {LEVELS.map((l) => (
                          <button
                            key={l}
                            type="button"
                            onClick={() => updateForm("level", l)}
                            className={`upload-chip ${form.level === l ? "upload-chip-active" : ""}`}
                          >
                            {l}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <FieldLabel required>Description</FieldLabel>
                      <FieldTextarea
                        rows={4}
                        value={form.description}
                        onChange={(e) => updateForm("description", e.target.value)}
                        placeholder="Describe what students will learn, who it's for, and why it matters…"
                      />
                      {errors.description && <p className="mt-1 text-[10px] text-danger">{errors.description}</p>}
                    </div>

                    <div className="sm:col-span-2">
                      <FieldLabel>What students will learn</FieldLabel>
                      <div className="space-y-2">
                        {form.outcomes.map((outcome, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <Target className="h-3.5 w-3.5 shrink-0 text-primary" />
                            <FieldInput
                              value={outcome}
                              onChange={(e) => {
                                const next = [...form.outcomes];
                                next[i] = e.target.value;
                                updateForm("outcomes", next);
                              }}
                              placeholder={`Learning outcome ${i + 1}`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <FieldLabel>Requirements</FieldLabel>
                      <FieldTextarea
                        rows={2}
                        value={form.requirements}
                        onChange={(e) => updateForm("requirements", e.target.value)}
                        placeholder="Prerequisites, tools, or experience needed…"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <FieldLabel>Course thumbnail</FieldLabel>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleThumbnail(e.target.files?.[0])}
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          handleThumbnail(e.dataTransfer.files?.[0]);
                        }}
                        className="upload-dropzone"
                      >
                        {thumbnailPreview ? (
                          <img src={thumbnailPreview} alt="" className="h-32 w-full rounded-lg object-cover sm:h-40" />
                        ) : (
                          <>
                            <CloudUpload className="h-8 w-8 text-primary" />
                            <p className="mt-2 text-sm font-bold text-text">Click or drag to upload</p>
                            <p className="text-xs text-muted">PNG, JPG · 16:9 · Max 2MB</p>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="sm:col-span-2">
                      <FieldLabel>Tags</FieldLabel>
                      <div className="upload-tags">
                        {form.tags.map((tag) => (
                          <span key={tag} className="upload-tag">
                            <Tag className="h-3 w-3" />
                            {tag}
                            <button type="button" onClick={() => removeTag(tag)} aria-label={`Remove ${tag}`}>
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                        <input
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                          placeholder="Add tag…"
                          className="min-w-[80px] flex-1 bg-transparent text-sm outline-none"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2 border-t border-border/60 pt-4">
                      <FieldLabel>Course Learning Roadmap</FieldLabel>
                      <p className="mb-3 text-xs text-muted">Define the step-by-step milestones students will achieve in this course.</p>
                      <div className="space-y-3">
                        {form.roadmap?.map((step, i) => (
                          <div key={i} className="flex flex-col gap-2 rounded-xl border border-border/80 bg-surface/30 p-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-primary">Step {String(i + 1).padStart(2, '0')}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const next = form.roadmap.filter((_, idx) => idx !== i);
                                  updateForm("roadmap", next);
                                }}
                                className="text-muted hover:text-danger"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                            <div className="grid gap-2 sm:grid-cols-3">
                              <div className="sm:col-span-1">
                                <FieldInput
                                  value={step.title}
                                  onChange={(e) => {
                                    const next = [...form.roadmap];
                                    next[i] = { ...step, title: e.target.value };
                                    updateForm("roadmap", next);
                                  }}
                                  placeholder="Milestone Title (e.g., Arrays & Strings)"
                                />
                              </div>
                              <div className="sm:col-span-2">
                                <FieldInput
                                  value={step.desc}
                                  onChange={(e) => {
                                    const next = [...form.roadmap];
                                    next[i] = { ...step, desc: e.target.value };
                                    updateForm("roadmap", next);
                                  }}
                                  placeholder="Milestone Description (e.g., Vectors, 2D Matrices, Search Patterns)"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            const next = [...(form.roadmap || [])];
                            const stepNum = String(next.length + 1).padStart(2, '0');
                            next.push({ step: stepNum, title: "", desc: "" });
                            updateForm("roadmap", next);
                          }}
                          className="upload-btn upload-btn-outline upload-btn-sm"
                        >
                          <Plus size={14} className="mr-1" /> Add Milestone Step
                        </button>
                      </div>
                    </div>

                    <div className="sm:col-span-2 border-t border-border/60 pt-4">
                      <FieldLabel>Course Instructors</FieldLabel>
                      <p className="mb-3 text-xs text-muted">Add one or more instructors who will teach this course.</p>
                      <div className="space-y-4">
                        {form.instructors?.map((inst, i) => (
                          <div key={i} className="flex flex-col gap-3 rounded-xl border border-border/80 bg-surface/30 p-4">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-accent">Instructor #{i + 1}</span>
                              {form.instructors.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const next = form.instructors.filter((_, idx) => idx !== i);
                                    updateForm("instructors", next);
                                  }}
                                  className="text-muted hover:text-danger"
                                >
                                  <Trash2 size={14} />
                                </button>
                              )}
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2">
                              <div>
                                <FieldLabel>Full Name</FieldLabel>
                                <FieldInput
                                  value={inst.name}
                                  onChange={(e) => {
                                    const next = [...form.instructors];
                                    next[i] = { ...inst, name: e.target.value };
                                    updateForm("instructors", next);
                                  }}
                                  placeholder="Instructor Name"
                                />
                              </div>
                              <div>
                                <FieldLabel>Role/Badge Title</FieldLabel>
                                <FieldInput
                                  value={inst.roleBadge}
                                  onChange={(e) => {
                                    const next = [...form.instructors];
                                    next[i] = { ...inst, roleBadge: e.target.value };
                                    updateForm("instructors", next);
                                  }}
                                  placeholder="e.g. Founder, Lead Instructor"
                                />
                              </div>
                              <div className="sm:col-span-2">
                                <FieldLabel>Tagline</FieldLabel>
                                <FieldInput
                                  value={inst.tagline}
                                  onChange={(e) => {
                                    const next = [...form.instructors];
                                    next[i] = { ...inst, tagline: e.target.value };
                                    updateForm("instructors", next);
                                  }}
                                  placeholder="e.g. Ex-Amazon & Ex-Microsoft SDE"
                                />
                              </div>
                              <div className="sm:col-span-2">
                                <FieldLabel>Avatar Image URL</FieldLabel>
                                <FieldInput
                                  value={inst.image}
                                  onChange={(e) => {
                                    const next = [...form.instructors];
                                    next[i] = { ...inst, image: e.target.value };
                                    updateForm("instructors", next);
                                  }}
                                  placeholder="https://images.unsplash.com/... or media URL"
                                />
                              </div>
                            </div>
                            <div className="mt-2 space-y-2">
                              <span className="text-[11px] font-bold text-muted uppercase tracking-wider">Instructor Highlights (4 Bullet Points)</span>
                              <div className="grid gap-2 sm:grid-cols-2">
                                {(inst.highlights || [{}, {}, {}, {}]).map((h, hIdx) => (
                                  <div key={hIdx} className="rounded-lg bg-surface/50 p-2.5 space-y-1">
                                    <span className="text-[10px] font-semibold text-primary">Highlight {hIdx + 1}</span>
                                    <FieldInput
                                      value={h.title || ""}
                                      onChange={(e) => {
                                        const next = [...form.instructors];
                                        const nextHighlights = [...(inst.highlights || [{}, {}, {}, {}])];
                                        nextHighlights[hIdx] = { ...h, title: e.target.value };
                                        next[i] = { ...inst, highlights: nextHighlights };
                                        updateForm("instructors", next);
                                      }}
                                      className="text-xs py-1"
                                      placeholder="Title (e.g. Proven Success)"
                                    />
                                    <FieldInput
                                      value={h.desc || ""}
                                      onChange={(e) => {
                                        const next = [...form.instructors];
                                        const nextHighlights = [...(inst.highlights || [{}, {}, {}, {}])];
                                        nextHighlights[hIdx] = { ...h, desc: e.target.value };
                                        next[i] = { ...inst, highlights: nextHighlights };
                                        updateForm("instructors", next);
                                      }}
                                      className="text-xs py-1"
                                      placeholder="Brief Description"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            const next = [...(form.instructors || [])];
                            next.push({
                              id: 'inst-' + Date.now(),
                              name: "",
                              roleBadge: "Instructor",
                              badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
                              tagline: "",
                              image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80",
                              highlights: [
                                { title: "", desc: "" },
                                { title: "", desc: "" },
                                { title: "", desc: "" },
                                { title: "", desc: "" }
                              ]
                            });
                            updateForm("instructors", next);
                          }}
                          className="upload-btn upload-btn-outline upload-btn-sm"
                        >
                          <Plus size={14} className="mr-1" /> Add Instructor
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2 — Modules only */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: shouldReduceMotion ? 0 : -16 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="space-y-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="font-display text-xl font-bold text-text">Create modules</h2>
                      <p className="mt-1 text-sm text-muted">
                        Structure your course into modules first. You&apos;ll add lessons and videos in the next step.
                      </p>
                    </div>
                    <button type="button" onClick={addModule} className="upload-btn upload-btn-primary upload-btn-sm">
                      <Plus className="h-4 w-4" /> Add module
                    </button>
                  </div>

                  {errors.curriculum && (
                    <div className="upload-alert">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      {errors.curriculum}
                    </div>
                  )}

                  <div className="space-y-3">
                    {modules.map((mod, modIdx) => {
                      const uploading =
                        mod.lessons.some((l) => l.uploadInProgress) ||
                        mod.lessons.some((l) => lessonProgress[l.id]?.uploading);
                      return (
                        <div key={mod.id} className="upload-module">
                          <div className="upload-module-header">
                            <GripVertical className="h-4 w-4 text-muted" />
                            <span className="text-xs font-bold text-muted">Module {modIdx + 1}</span>
                            <input
                              value={mod.title}
                              onChange={(e) => updateModuleTitle(mod.id, e.target.value)}
                              className="min-w-0 flex-1 bg-transparent text-sm font-bold text-text outline-none"
                              placeholder="Module title"
                            />
                            <span className="text-[10px] font-semibold text-muted">
                              {mod.lessons.length} lessons
                            </span>
                            <button
                              type="button"
                              disabled={uploading}
                              onClick={() => removeModule(mod.id)}
                              title={uploading ? "Upload in progress" : "Delete module"}
                              className="rounded-lg p-1.5 text-muted hover:bg-danger/10 hover:text-danger disabled:cursor-not-allowed disabled:opacity-40"
                              aria-label="Delete module"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                    {!modules.length && (
                      <p className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted">
                        No modules yet — click Add module to start.
                      </p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Step 3 — Lessons / videos / quizzes */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: shouldReduceMotion ? 0 : -16 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="space-y-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="font-display text-xl font-bold text-text">Upload lessons</h2>
                      <p className="mt-1 text-sm text-muted">
                        Add lessons and videos inside each module, then attach a quiz to every lesson.
                      </p>
                    </div>
                    <button type="button" onClick={addModule} className="upload-btn upload-btn-primary upload-btn-sm">
                      <Plus className="h-4 w-4" /> Add module
                    </button>
                  </div>

                  {errors.curriculum && (
                    <div className="upload-alert">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      {errors.curriculum}
                    </div>
                  )}

                  <div
                    className="upload-dropzone upload-dropzone-compact"
                    role="button"
                    tabIndex={0}
                    onClick={() => videoInputRef.current?.click()}
                    onKeyDown={(e) => e.key === "Enter" && videoInputRef.current?.click()}
                  >
                    <input
                      ref={videoInputRef}
                      type="file"
                      accept="video/*"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        handleBulkVideos(e.target.files);
                        e.target.value = "";
                      }}
                    />
                    <Video className="h-6 w-6 text-accent" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-text">
                        {uploadingVideos ? "Uploading videos…" : "Bulk upload videos"}
                      </p>
                      <p className="text-xs text-muted">MP4, MOV · Attached to video lessons in order</p>
                    </div>
                    <span className="upload-btn upload-btn-outline upload-btn-sm">
                      {uploadingVideos ? <Loader2 className="h-4 w-4 animate-spin" /> : "Browse"}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {modules.map((mod, modIdx) => (
                      <div key={mod.id} className="upload-module">
                        <button
                          type="button"
                          onClick={() => toggleModule(mod.id)}
                          className="upload-module-header"
                        >
                          <GripVertical className="h-4 w-4 text-muted" />
                          <span className="text-xs font-bold text-muted">Module {modIdx + 1}</span>
                          <input
                            value={mod.title}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => updateModuleTitle(mod.id, e.target.value)}
                            className="min-w-0 flex-1 bg-transparent text-sm font-bold text-text outline-none"
                          />
                          <span className="text-[10px] font-semibold text-muted">{mod.lessons.length} lessons</span>
                          <button
                            type="button"
                            disabled={
                              mod.lessons.some((l) => l.uploadInProgress) ||
                              mod.lessons.some((l) => lessonProgress[l.id]?.uploading)
                            }
                            onClick={(e) => {
                              e.stopPropagation();
                              removeModule(mod.id);
                            }}
                            title="Delete module"
                            className="rounded-lg p-1.5 text-muted hover:bg-danger/10 hover:text-danger disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label="Delete module"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                          <ChevronDown className={`h-4 w-4 text-muted transition-transform ${mod.open ? "rotate-180" : ""}`} />
                        </button>

                        <AnimatePresence>
                          {mod.open && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: EASE }}
                              className="overflow-hidden"
                            >
                              <div className="upload-module-lessons">
                                {mod.lessons.map((lesson, idx) => {
                                  const prog = lessonProgress[lesson.id];
                                  const hasVideo = Boolean(lesson.contentUrl || lesson.mediaFileId || prog?.percent === 100);
                                  const isUploading = Boolean(prog?.uploading);
                                  const videoUrl = resolveMediaUrl(lesson.contentUrl || lesson.mediaFileId);

                                  return (
                                    <div key={lesson.id} className="upload-lesson flex-col items-start gap-2.5 p-3 rounded-xl border border-border/80 bg-surface/40">
                                      <div className="flex w-full items-center gap-3">
                                        <span className="text-[10px] font-bold text-muted">{String(idx + 1).padStart(2, "0")}</span>
                                        <span className={`upload-lesson-type ${lesson.type === "quiz" ? "upload-lesson-quiz" : ""}`}>
                                          {lesson.type === "quiz" ? <FileText className="h-3.5 w-3.5" /> : <Video className="h-3.5 w-3.5" />}
                                        </span>
                                        <input
                                          value={lesson.title}
                                          onChange={(e) => updateLesson(mod.id, lesson.id, { title: e.target.value })}
                                          className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-text outline-none"
                                          placeholder="Lesson title..."
                                        />
                                        <input
                                          value={lesson.duration}
                                          onChange={(e) => updateLesson(mod.id, lesson.id, { duration: e.target.value })}
                                          className="w-14 bg-transparent text-center text-[10px] font-bold text-muted outline-none"
                                          placeholder="10:00"
                                        />
                                        <button
                                          type="button"
                                          onClick={() => updateLesson(mod.id, lesson.id, { free: !lesson.free })}
                                          className={`upload-free-toggle ${lesson.free ? "upload-free-on" : ""}`}
                                        >
                                          {lesson.free ? <Globe className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                                          {lesson.free ? "Preview" : "Paid"}
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => removeLesson(mod.id, lesson.id)}
                                          className="text-muted hover:text-danger"
                                          aria-label="Remove lesson"
                                        >
                                          <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                      </div>

                                      {/* Video Upload & Preview Bar */}
                                      {lesson.type === "video" && (
                                        <div className="w-full pl-7">
                                          {/* 1. Uploading State with Progress Bar */}
                                          {isUploading && (
                                            <div className="w-full rounded-lg border border-primary/30 bg-primary/10 p-2.5">
                                              <div className="flex items-center justify-between text-xs font-semibold text-primary mb-1.5">
                                                <span className="flex items-center gap-1.5">
                                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                  Uploading {prog?.fileName || "lesson video"}...
                                                </span>
                                                <span className="font-bold text-primary">{prog?.percent || 0}%</span>
                                              </div>
                                              <div className="h-2 w-full overflow-hidden rounded-full bg-border">
                                                <div
                                                  className="h-full bg-primary transition-all duration-200"
                                                  style={{ width: `${prog?.percent || 0}%` }}
                                                />
                                              </div>
                                            </div>
                                          )}

                                          {/* 2. Uploaded State (100% or URL present) with Interactive Video Player Bar */}
                                          {!isUploading && hasVideo && (
                                            <div className="w-full rounded-lg border border-success/30 bg-success/10 p-2.5">
                                              <div className="flex flex-wrap items-center justify-between gap-2">
                                                <div className="flex items-center gap-2">
                                                  <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                                                  <div>
                                                    <p className="text-xs font-bold text-text truncate max-w-[280px]">
                                                      {lesson.videoName || "Lecture Video Uploaded"}
                                                    </p>
                                                    <p className="text-[10px] font-bold text-success">
                                                      100% Uploaded Successfully · Ready to check
                                                    </p>
                                                  </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                  <button
                                                    type="button"
                                                    onClick={() => setPreviewingLessonId(previewingLessonId === lesson.id ? null : lesson.id)}
                                                    className="inline-flex items-center gap-1 rounded border border-border bg-surface px-2.5 py-1 text-[11px] font-bold text-primary hover:bg-elevated transition-colors shadow-sm"
                                                  >
                                                    <Eye className="h-3.5 w-3.5" />
                                                    {previewingLessonId === lesson.id ? "Hide Preview" : "Play & Check Video"}
                                                  </button>
                                                  <label className="cursor-pointer text-[11px] font-bold text-muted hover:text-text">
                                                    Replace
                                                    <input
                                                      type="file"
                                                      accept="video/*"
                                                      className="hidden"
                                                      onChange={(e) => {
                                                        if (e.target.files?.[0]) {
                                                          handleSingleVideoUpload(mod.id, lesson.id, e.target.files[0]);
                                                          e.target.value = "";
                                                        }
                                                      }}
                                                    />
                                                  </label>
                                                  <button
                                                    type="button"
                                                    onClick={() => updateLesson(mod.id, lesson.id, { contentUrl: null, mediaFileId: null, videoName: null })}
                                                    className="text-[11px] font-bold text-danger hover:underline"
                                                  >
                                                    Remove
                                                  </button>
                                                </div>
                                              </div>

                                              {/* Collapsible/Toggleable Video Player for Mentor to verify video */}
                                              {previewingLessonId === lesson.id && (
                                                <div className="mt-3 overflow-hidden rounded-lg border border-border bg-black/90 p-2">
                                                  <div className="mb-1.5 flex items-center justify-between text-[11px] text-muted">
                                                    <span className="font-bold text-success flex items-center gap-1">
                                                      <CheckCircle2 className="h-3.5 w-3.5" /> Playing Uploaded Video
                                                    </span>
                                                    <span className="text-[10px]">Ensure correct video lecture</span>
                                                  </div>
                                                  <video
                                                    controls
                                                    controlsList="nodownload"
                                                    preload="metadata"
                                                    src={videoUrl}
                                                    className="w-full max-h-[260px] rounded object-contain bg-black"
                                                  >
                                                    Your browser does not support video playback.
                                                  </video>
                                                </div>
                                              )}
                                            </div>
                                          )}

                                          {/* 3. Empty State (No video uploaded yet) with Upload Button */}
                                          {!isUploading && !hasVideo && (
                                            <div className="flex items-center gap-3">
                                              <label className="upload-btn upload-btn-outline upload-btn-sm text-[11px] font-bold flex items-center gap-1.5 cursor-pointer border-dashed border-border/80 hover:border-primary hover:text-primary">
                                                <Video className="h-3.5 w-3.5 text-accent" /> Upload Lesson Video
                                                <input
                                                  type="file"
                                                  accept="video/*"
                                                  className="hidden"
                                                  onChange={(e) => {
                                                    if (e.target.files?.[0]) {
                                                      handleSingleVideoUpload(mod.id, lesson.id, e.target.files[0]);
                                                      e.target.value = "";
                                                    }
                                                  }}
                                                />
                                              </label>
                                              {prog?.error && (
                                                <span className="text-[11px] font-semibold text-danger flex items-center gap-1">
                                                  <AlertCircle className="h-3 w-3" /> {prog.error}
                                                </span>
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      )}
                                      <div className="mt-3 border-t border-border pt-3">
                                        <LessonQuizEditor
                                          compact
                                          quiz={lesson.quiz}
                                          onChange={(quiz) => updateLesson(mod.id, lesson.id, { quiz })}
                                        />
                                      </div>
                                    </div>
                                  );
                                })}
                                <button type="button" onClick={() => addLesson(mod.id)} className="upload-add-lesson">
                                  <Plus className="h-3.5 w-3.5" /> Add lesson
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>

                  <p className="upload-tip">
                    Tip: Mark 1–2 lessons as <strong>Preview</strong> to boost enrollments — top courses on Udemy do this.
                  </p>
                </motion.div>
              )}

              {/* Step 4 — Details / pricing */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: shouldReduceMotion ? 0 : -16 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="space-y-5"
                >
                  <div>
                    <h2 className="font-display text-xl font-bold text-text">Pricing strategy</h2>
                    <p className="mt-1 text-sm text-muted">Choose how you monetize — compare with platform bestsellers.</p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    {PRICING_PLANS.map((plan) => {
                      const Icon = plan.icon;
                      const selected = pricingModel === plan.id;
                      return (
                        <motion.button
                          key={plan.id}
                          type="button"
                          onClick={() => setPricingModel(plan.id)}
                          whileHover={{ y: -3 }}
                          whileTap={{ scale: 0.98 }}
                          className={`upload-plan ${plan.accent} ${selected ? "upload-plan-selected" : ""}`}
                        >
                          {plan.badge && <span className="upload-plan-badge">{plan.badge}</span>}
                          <span className="upload-plan-icon">
                            <Icon className="h-5 w-5" />
                          </span>
                          <p className="font-bold text-text">{plan.label}</p>
                          <p className="mt-1 text-xs text-muted">{plan.desc}</p>
                          <p className="mt-2 font-display text-lg font-bold text-text">{plan.price}</p>
                          {selected && <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-primary" />}
                        </motion.button>
                      );
                    })}
                  </div>

                  {pricingModel === "paid" && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <div className="max-w-xs">
                        <FieldLabel required>Course price (USD)</FieldLabel>
                        <div className="upload-price-field">
                          <span className="upload-price-currency" aria-hidden>
                            $
                          </span>
                          <FieldInput
                            type="number"
                            min="0"
                            step="0.01"
                            value={customPrice}
                            onChange={(e) => setCustomPrice(e.target.value)}
                            className="upload-price-input text-lg font-bold"
                            placeholder="0.00"
                            aria-label="Course price in USD"
                          />
                        </div>
                        {errors.price && <p className="mt-1 text-[10px] text-danger">{errors.price}</p>}
                      </div>

                      <div>
                        <p className="mb-2 text-xs font-bold text-muted">Suggested prices</p>
                        <div className="flex flex-wrap gap-2">
                          {SUGGESTED_PRICES.map((p) => (
                            <button
                              key={p}
                              type="button"
                              onClick={() => setCustomPrice(p)}
                              className={`upload-chip ${customPrice === p ? "upload-chip-active" : ""}`}
                            >
                              ${p}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="upload-revenue dashboard-card p-4">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted">Revenue breakdown</p>
                        <div className="mt-3 space-y-2 text-sm">
                          <div className="flex justify-between text-muted">
                            <span>Your price</span>
                            <span className="font-semibold text-text">${earnings.gross.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-muted">
                            <span>Platform fee (30%)</span>
                            <span>-${earnings.fee.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between border-t border-border pt-2 font-bold text-success">
                            <span>Your earnings (70%)</span>
                            <span>${earnings.net.toFixed(2)}</span>
                          </div>
                        </div>
                        <p className="upload-tip mt-3 !mb-0">
                          Top Realm courses price between $49–$129.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* Step 5 — Publish */}
              {step === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: shouldReduceMotion ? 0 : -16 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="space-y-5"
                >
                  <div className="text-center">
                    <motion.div
                      className="upload-success-icon mx-auto"
                      animate={shouldReduceMotion ? undefined : { scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Zap className="h-10 w-10 text-primary" />
                    </motion.div>
                    <h2 className="mt-4 font-display text-2xl font-bold text-text">Ready to launch</h2>
                    <p className="mx-auto mt-2 max-w-md text-sm text-muted">
                      Complete the quality checklist below. Courses with 80%+ score get featured faster.
                    </p>
                    <div className="mx-auto mt-4 max-w-xs">
                      <div className="mb-1 flex justify-between text-xs font-bold">
                        <span className="text-muted">Quality score</span>
                        <span className="text-primary">{completionScore}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-border">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                          animate={{ width: `${completionScore}%` }}
                          transition={{ duration: 0.6, ease: EASE }}
                        />
                      </div>
                    </div>
                  </div>

                  <ul className="upload-checklist">
                    {publishChecks.map((check, i) => (
                      <motion.li
                        key={check.label}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={check.ok ? "upload-check-ok" : "upload-check-pending"}
                      >
                        {check.ok ? (
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                        ) : (
                          <AlertCircle className="h-4 w-4 shrink-0 text-warning" />
                        )}
                        {check.label}
                      </motion.li>
                    ))}
                  </ul>

                  {!allChecksPass && (
                    <p className="text-center text-xs text-muted">
                      {!publishChecks.find((c) => c.label === "Free preview lesson")?.ok ? (
                        <>
                          Mark at least one lesson as <strong className="text-text">Preview</strong> in
                          Curriculum (step 2), or{" "}
                          <button
                            type="button"
                            onClick={() => setModules((prev) => ensureFreePreviewLesson(prev))}
                            className="font-bold text-primary underline-offset-2 hover:underline"
                          >
                            auto-mark first lesson as preview
                          </button>
                          .
                        </>
                      ) : (
                        "Complete missing items to improve approval speed."
                      )}
                    </p>
                  )}

                  <p className="text-center text-[11px] text-muted">
                    By submitting you agree to the{" "}
                    <span className="cursor-pointer font-bold text-primary">Mentor Content Guidelines</span> and{" "}
                    <span className="cursor-pointer font-bold text-primary">Revenue Share Policy</span>.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="upload-wizard-footer">
            <button
              type="button"
              onClick={goBack}
              disabled={step === 1}
              className="upload-btn upload-btn-outline"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>

            <div className="upload-step-dots">
              {STEPS.map((s) => (
                <span key={s.id} className={`upload-dot ${step === s.id ? "upload-dot-active" : step > s.id ? "upload-dot-done" : ""}`} />
              ))}
            </div>

            <button
              type="button"
              onClick={goNext}
              disabled={(step === STEPS.length && !allChecksPass) || isSubmitting}
              className="upload-btn upload-btn-primary"
            >
              {step === STEPS.length ? (
                isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" /> Submit for review
                  </>
                )
              ) : (
                <>
                  Save & continue
                </>
              )}
            </button>
          </div>
          {submitError ? (
            <p className="mt-2 text-center text-sm text-danger">{submitError}</p>
          ) : null}
        </motion.div>

        <CoursePreviewPanel
          form={form}
          modules={modules}
          pricingModel={pricingModel}
          customPrice={customPrice}
          thumbnailPreview={thumbnailPreview}
        />
      </div>
    </motion.div>
  );
}
