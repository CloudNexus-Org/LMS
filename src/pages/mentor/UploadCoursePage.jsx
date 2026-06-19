import { useState } from 'react';
import {
  CheckCircle2, Video, DollarSign, Settings, ArrowRight,
  ArrowLeft, Globe, Tag, Users, Plus, Trash2, GripVertical,
  Lock, Star, Zap, Award, Clock, Image, X, FileText
} from 'lucide-react';

const STEPS = [
  { id: 1, label: 'Course Info', icon: Settings, desc: 'Basic details' },
  { id: 2, label: 'Curriculum', icon: Video, desc: 'Lessons & modules' },
  { id: 3, label: 'Pricing', icon: DollarSign, desc: 'Set your price' },
  { id: 4, label: 'Publish', icon: Globe, desc: 'Go live' },
];

const CATEGORIES = ['Frontend Engineering', 'Cloud & DevOps', 'Backend Systems', 'Data & AI', 'System Design', 'Mobile Dev'];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];

const PRICING_PLANS = [
  {
    id: 'free',
    label: 'Free',
    price: '$0',
    desc: 'Maximize reach & build your audience',
    icon: Users,
    color: 'border-success/40 bg-success/5',
    badge: null,
  },
  {
    id: 'paid',
    label: 'Paid',
    price: 'You set',
    desc: 'Earn revenue from your expertise',
    icon: DollarSign,
    color: 'border-primary/40 bg-primary/5',
    badge: 'Most Popular',
  },
  {
    id: 'premium',
    label: 'Premium',
    price: 'Subscription',
    desc: 'Included in Cloud Nexus Pro plan',
    icon: Award,
    color: 'border-accent/40 bg-accent/5',
    badge: 'Higher Revenue',
  },
];

const DEFAULT_LESSONS = [
  { id: 1, title: 'Introduction & Overview', type: 'video', free: true },
  { id: 2, title: 'Core Concepts', type: 'video', free: false },
  { id: 3, title: 'Hands-on Exercise', type: 'quiz', free: false },
];

export default function UploadCoursePage() {
  const [step, setStep] = useState(1);
  const [pricingModel, setPricingModel] = useState('paid');
  const [selectedLevel, setSelectedLevel] = useState('Intermediate');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [lessons, setLessons] = useState(DEFAULT_LESSONS);
  const [customPrice, setCustomPrice] = useState('89.99');

  const addLesson = () => {
    setLessons(prev => [...prev, { id: Date.now(), title: 'New Lesson', type: 'video', free: false }]);
  };

  const removeLesson = (id) => setLessons(prev => prev.filter(l => l.id !== id));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">

      {/* â”€â”€ HEADER â”€â”€ */}
      <div className="text-center">
        <h1 className="text-[42px] font-bold text-text font-display tracking-tight">Create New Course</h1>
        <p className="text-muted mt-2 font-medium">Follow the wizard to launch your next hit course on Cloud Nexus.</p>
      </div>

      {/* â”€â”€ STEPPER â”€â”€ */}
      <div className="relative">
        {/* Track */}
        <div className="absolute top-6 left-0 w-full h-0.5 bg-border z-0" />
        <div
          className="absolute top-6 left-0 h-0.5 bg-primary z-0 transition-all duration-500"
          style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
        />

        <div className="relative z-10 flex justify-between">
          {STEPS.map((s) => {
            const Icon = s.icon;
            const isCompleted = step > s.id;
            const isActive = step === s.id;

            return (
              <div key={s.id} className="flex flex-col items-center gap-2 bg-bg px-2">
                <div className={`h-12 w-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  isCompleted ? 'bg-primary border-primary text-white shadow-[0_0_20px_rgba(44,91,255,0.3)]' :
                  isActive ? 'bg-surface border-primary text-primary shadow-md' :
                  'bg-surface border-border text-muted'
                }`}>
                  {isCompleted ? <CheckCircle2 className="h-6 w-6" /> : <Icon className="h-5 w-5" />}
                </div>
                <div className="text-center">
                  <span className={`text-[11px] font-bold uppercase tracking-wider block ${isActive || isCompleted ? 'text-text' : 'text-muted'}`}>
                    {s.label}
                  </span>
                  <span className="text-[10px] text-muted font-medium hidden sm:block">{s.desc}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* â”€â”€ FORM CARD â”€â”€ */}
      <div className="bg-surface border border-border rounded-[5px] shadow-card overflow-hidden">

        {/* Progress bar */}
        <div className="h-1 bg-border">
          <div className="h-full bg-primary transition-all duration-500" style={{ width: `${(step / STEPS.length) * 100}%` }} />
        </div>

        <div className="p-8 sm:p-10 min-h-[440px]">

          {/* â”€â”€ STEP 1: COURSE INFO â”€â”€ */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <h2 className="text-2xl font-bold text-text">Course Information</h2>
                <p className="text-sm text-muted mt-1 font-medium">Fill in the basic details about your course.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-text">Course Title <span className="text-danger">*</span></label>
                  <input type="text" placeholder="e.g. Advanced Rust Programming for Frontend" className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none text-text transition-all font-medium" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-text">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value)}
                    className="w-full bg-bg border border-border rounded-[5px] px-4 py-3 text-sm focus:border-primary outline-none text-text transition-all font-medium appearance-none"
                  >
                    <option value="">Select category...</option>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-text">Skill Level</label>
                  <div className="flex flex-wrap gap-2">
                    {LEVELS.map(l => (
                      <button
                        key={l}
                        onClick={() => setSelectedLevel(l)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${selectedLevel === l ? 'bg-primary border-primary text-white' : 'bg-bg border-border text-muted hover:border-primary/40 hover:text-text'}`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="sm:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-text">Short Description</label>
                  <textarea
                    rows="3"
                    placeholder="Briefly describe what students will learn and why this course is valuable..."
                    className="w-full bg-bg border border-border rounded-[5px]` px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none text-text transition-all resize-none font-medium"
                  />
                </div>

                {/* Thumbnail Upload */}
                <div className="sm:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-text">Course Thumbnail</label>
                  <div className="border-2 border-dashed border-border hover:border-primary/50 transition-colors rounded-full p-8 flex flex-col items-center justify-center text-center cursor-pointer bg-bg/50 group">
                    <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Image className="h-6 w-6" />
                    </div>
                    <p className="font-bold text-text text-sm">Click to upload or drag and drop</p>
                    <p className="text-xs text-muted font-medium mt-1">PNG, JPG or GIF Â· Max 2MB Â· 16:9 ratio recommended</p>
                  </div>
                </div>

                {/* Tags */}
                <div className="sm:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-text">Tags</label>
                  <div className="flex flex-wrap gap-2 p-3 bg-bg border border-border rounded-[5px] min-h-[48px]">
                    {['React', 'TypeScript', 'State Management'].map(tag => (
                      <span key={tag} className="flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-bold px-2.5 py-1 rounded-full">
                        <Tag className="h-3 w-3" /> {tag}
                        <button className="text-primary/60 hover:text-primary"><X className="h-3 w-3" /></button>
                      </span>
                    ))}
                    <input placeholder="Add tag..." className="bg-transparent text-sm text-text outline-none font-medium min-w-[80px]" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* â”€â”€ STEP 2: CURRICULUM â”€â”€ */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-text">Build Curriculum</h2>
                  <p className="text-sm text-muted mt-1 font-medium">Add lessons, quizzes, and resources to your course.</p>
                </div>
                <button
                  onClick={addLesson}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full text-sm font-bold hover:bg-primary-hover transition-all"
                >
                  <Plus className="h-4 w-4" /> Add Lesson
                </button>
              </div>

              {/* Video upload area */}
              <div className="border-2 border-dashed border-border hover:border-primary/50 rounded-[5px] p-6 bg-bg/50 flex items-center gap-5 cursor-pointer group transition-colors">
                <div className="h-12 w-12 rounded-full bg-accent/10 text-accent flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Video className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold text-text text-sm">Drag video files here to upload</p>
                  <p className="text-xs text-muted font-medium mt-0.5">MP4, MOV or AVI Â· Auto-compressed & transcribed</p>
                </div>
                <button className="ml-auto px-4 py-2 border border-border rounded-full text-xs font-bold text-muted hover:text-text hover:border-primary/40 transition-all flex-shrink-0">
                  Browse Files
                </button>
              </div>

              {/* Lesson list */}
              <div className="space-y-2">
                {lessons.map((lesson, idx) => (
                  <div key={lesson.id} className="flex items-center gap-3 bg-bg border border-border rounded-[5px] px-4 py-3 hover:border-primary/30 transition-colors group">
                    <GripVertical className="h-4 w-4 text-border group-hover:text-muted cursor-grab flex-shrink-0" />
                    <span className="text-xs font-bold text-muted w-5 flex-shrink-0">{String(idx + 1).padStart(2, '0')}</span>

                    <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${lesson.type === 'quiz' ? 'bg-accent/10 text-accent' : 'bg-primary/10 text-primary'}`}>
                      {lesson.type === 'quiz' ? <FileText className="h-4 w-4" /> : <Video className="h-4 w-4" />}
                    </div>

                    <input
                      value={lesson.title}
                      onChange={e => setLessons(prev => prev.map(l => l.id === lesson.id ? { ...l, title: e.target.value } : l))}
                      className="flex-1 bg-transparent text-sm font-bold text-text outline-none focus:text-primary transition-colors min-w-0"
                    />

                    <button
                      onClick={() => setLessons(prev => prev.map(l => l.id === lesson.id ? { ...l, free: !l.free } : l))}
                      className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full transition-all flex-shrink-0 ${lesson.free ? 'bg-success/10 text-success' : 'bg-border text-muted hover:bg-primary/10 hover:text-primary'}`}
                    >
                      {lesson.free ? <><Globe className="h-3 w-3" /> Free</> : <><Lock className="h-3 w-3" /> Paid</>}
                    </button>

                    <button
                      onClick={() => removeLesson(lesson.id)}
                      className="h-7 w-7 flex items-center justify-center text-muted hover:text-danger opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <p className="text-xs text-muted font-medium text-center pt-2">
                ðŸ’¡ Tip: Mark at least 1 lesson as <strong>Free</strong> to attract more enrollments.
              </p>
            </div>
          )}

          {/* â”€â”€ STEP 3: PRICING â”€â”€ */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <h2 className="text-2xl font-bold text-text">Pricing Strategy</h2>
                <p className="text-sm text-muted mt-1 font-medium">Choose how you want to monetize your course.</p>
              </div>

              {/* Pricing cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {PRICING_PLANS.map(plan => {
                  const Icon = plan.icon;
                  const isSelected = pricingModel === plan.id;
                  return (
                    <button
                      key={plan.id}
                      onClick={() => setPricingModel(plan.id)}
                      className={`relative text-left p-5 rounded-[5px] border-2 transition-all duration-200 hover:-translate-y-0.5 ${isSelected ? plan.color + ' ' + (plan.id === 'paid' ? 'border-primary' : plan.id === 'free' ? 'border-success' : 'border-accent') : 'border-border bg-bg hover:border-primary/30'}`}
                    >
                      {plan.badge && (
                        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-primary text-white px-3 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap">
                          {plan.badge}
                        </span>
                      )}
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center mb-3 ${
                        plan.id === 'free' ? 'bg-success/10 text-success' :
                        plan.id === 'paid' ? 'bg-primary/10 text-primary' :
                        'bg-accent/10 text-accent'
                      }`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <p className="font-bold text-text text-sm">{plan.label}</p>
                      <p className="text-xs text-muted mt-1">{plan.desc}</p>
                      <p className="font-display font-bold text-text mt-3">{plan.price}</p>
                      {isSelected && (
                        <div className="absolute top-3 right-3 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                          <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Price input (only for paid) */}
              {pricingModel === 'paid' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="space-y-2 max-w-xs">
                    <label className="text-sm font-bold text-text">Course Price (USD)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />
                      <input
                        type="number"
                        value={customPrice}
                        onChange={e => setCustomPrice(e.target.value)}
                        className="w-full bg-bg border border-border rounded-[5px] pl-12 pr-4 py-3 text-xl font-display font-bold focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none text-text transition-all"
                      />
                    </div>
                  </div>

                  {/* Suggested prices */}
                  <div>
                    <p className="text-xs font-bold text-muted mb-2">Suggested Prices</p>
                    <div className="flex gap-2 flex-wrap">
                      {['29.99', '49.99', '69.99', '89.99', '129.99'].map(p => (
                        <button
                          key={p}
                          onClick={() => setCustomPrice(p)}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${customPrice === p ? 'bg-primary/10 text-primary border-primary/30' : 'bg-bg border-border text-muted hover:border-primary/30 hover:text-text'}`}
                        >
                          ${p}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Revenue breakdown */}
                  <div className="bg-bg border border-border rounded-[5px] p-4">
                    <p className="text-xs font-bold text-muted uppercase tracking-wider mb-3">Revenue Estimate</p>
                    <div className="space-y-2">
                      {[
                        { label: 'Your Price', value: `$${customPrice}` },
                        { label: 'Platform Fee (30%)', value: `-$${(parseFloat(customPrice || 0) * 0.3).toFixed(2)}` },
                        { label: 'Your Earnings (70%)', value: `$${(parseFloat(customPrice || 0) * 0.7).toFixed(2)}`, bold: true },
                      ].map(row => (
                        <div key={row.label} className={`flex justify-between text-sm ${row.bold ? 'font-bold text-success border-t border-border pt-2 mt-2' : 'font-medium text-muted'}`}>
                          <span>{row.label}</span><span>{row.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* â”€â”€ STEP 4: PUBLISH â”€â”€ */}
          {step === 4 && (
            <div className="flex flex-col items-center text-center py-6 animate-in fade-in duration-300">
              <div className="h-24 w-24 rounded-full bg-success/10 text-success flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(5,150,105,0.2)]">
                <CheckCircle2 className="h-12 w-12" />
              </div>
              <h2 className="text-3xl font-bold text-text font-display">Ready to Launch! ðŸš€</h2>
              <p className="text-muted font-medium max-w-md mt-3 leading-relaxed">
                Your course is fully configured. It will be submitted to the Cloud Nexus QA team for review before going live â€” typically within 24â€“48 hours.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 w-full max-w-lg">
                {[
                  { icon: Clock, label: 'Review Time', value: '24â€“48 hrs', color: 'text-warning bg-warning/10' },
                  { icon: Users, label: 'Potential Reach', value: '12,000+', color: 'text-primary bg-primary/10' },
                  { icon: Star, label: 'Platform Rating', value: '4.8 avg', color: 'text-amber-500 bg-amber-500/10' },
                ].map(item => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="bg-bg border border-border rounded-[5px] p-4">
                      <div className={`h-9 w-9 rounded-full ${item.color} flex items-center justify-center mx-auto mb-2`}>
                        <Icon className="h-4.5 w-4.5" />
                      </div>
                      <p className="text-xs font-bold text-muted">{item.label}</p>
                      <p className="font-bold text-text mt-0.5">{item.value}</p>
                    </div>
                  );
                })}
              </div>

              <p className="text-xs text-muted mt-6 max-w-sm">
                By submitting, you agree to the <span className="text-primary font-bold cursor-pointer">Mentor Content Guidelines</span> and <span className="text-primary font-bold cursor-pointer">Revenue Share Policy</span>.
              </p>
            </div>
          )}
        </div>

        {/* â”€â”€ FOOTER ACTIONS â”€â”€ */}
        <div className="px-8 sm:px-10 py-5 border-t border-border bg-bg/30 flex items-center justify-between">
          <button
            onClick={() => setStep(s => Math.max(1, s - 1))}
            className={`flex items-center gap-2 px-5 py-2.5 border border-border rounded-[5px] text-sm font-bold text-muted hover:text-text hover:border-primary/40 transition-all ${step === 1 ? 'opacity-0 pointer-events-none' : ''}`}
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>

          <div className="flex items-center gap-2">
            {STEPS.map(s => (
              <div key={s.id} className={`h-1.5 rounded-full transition-all duration-300 ${step === s.id ? 'w-6 bg-primary' : step > s.id ? 'w-3 bg-primary/40' : 'w-3 bg-border'}`} />
            ))}
          </div>

          <button
            onClick={() => setStep(s => Math.min(STEPS.length, s + 1))}
            className="
                  relative
                  inline-flex

                  h-[48px]
                  w-full
                  sm:w-auto
                  min-w-[180px]

                  items-center
                  justify-center

                  border
                  border-border
                  dark:border-border

                  bg-primary
                  dark:bg-primary

                  px-6

                  text-[14px]
                  font-semibold

                  text-white
                  dark:text-white

                  overflow-hidden
                  rounded-full

                  shadow-[0_10px_30px_rgba(37,99,235,0.08)]
                  dark:shadow-[0_10px_30px_rgba(0,0,0,0.4)]

                  transition-all
                  duration-300

                  hover:-translate-y-[2px]
                  hover:border-primary/40
                  dark:hover:border-primary/60
                "
          >
            {step === STEPS.length ? (
              <><Zap className="h-4 w-4" /> Submit for Review</>
            ) : (
              <>Save & Continue <ArrowRight className="h-4 w-4" /></>
            )}
          </button>
        </div>
      </div>

    </div>
  );
}
