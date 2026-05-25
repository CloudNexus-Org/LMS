import { useState } from 'react';
import { UploadCloud, CheckCircle2, Video, DollarSign, Settings, ArrowRight } from 'lucide-react';

const STEPS = [
  { id: 1, label: 'Course Info', icon: Settings },
  { id: 2, label: 'Curriculum', icon: Video },
  { id: 3, label: 'Pricing', icon: DollarSign },
  { id: 4, label: 'Publish', icon: UploadCloud },
];

export default function UploadCoursePage() {
  const [step, setStep] = useState(1);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto py-4">
      
      <div className="text-center">
        <h1 className="text-[42px] font-bold text-text font-display tracking-tight">Create New Course</h1>
        <p className="text-muted mt-2 font-medium">Follow the wizard to launch your next hit course.</p>
      </div>

      {/* Stepper Header */}
      <div className="relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2 z-0"></div>
        <div className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 z-0 transition-all duration-500" style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}></div>
        
        <div className="relative z-10 flex justify-between">
          {STEPS.map((s) => {
            const Icon = s.icon;
            const isCompleted = step > s.id;
            const isActive = step === s.id;
            
            return (
              <div key={s.id} className="flex flex-col items-center gap-2 bg-bg px-2">
                <div className={`h-12 w-12 rounded-full flex items-center justify-center border-2 transition-colors ${
                  isCompleted ? 'bg-primary border-primary text-white' :
                  isActive ? 'bg-surface border-primary text-primary shadow-md' :
                  'bg-surface border-border text-muted'
                }`}>
                  {isCompleted ? <CheckCircle2 className="h-6 w-6" /> : <Icon className="h-5 w-5" />}
                </div>
                <span className={`text-[11px] font-bold uppercase tracking-wider ${isActive || isCompleted ? 'text-text' : 'text-muted'}`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-surface border border-border rounded-[5px] p-8 sm:p-12 shadow-card min-h-[400px]">
        
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h2 className="text-2xl font-bold text-text">Basic Information</h2>
            <div className="space-y-2">
              <label className="text-sm font-bold text-text">Course Title</label>
              <input type="text" placeholder="e.g. Advanced Rust Programming" className="w-full bg-bg border border-border rounded-[5px] px-4 py-3 text-sm focus:border-primary outline-none text-text transition-all font-medium" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-text">Description</label>
              <textarea rows="4" placeholder="Briefly describe what students will learn..." className="w-full bg-bg border border-border rounded-[5px] px-4 py-3 text-sm focus:border-primary outline-none text-text transition-all resize-none font-medium" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-text">Course Thumbnail</label>
              <div className="border-2 border-dashed border-border hover:border-primary transition-colors rounded-[5px] p-8 flex flex-col items-center justify-center text-center cursor-pointer bg-bg/50">
                <UploadCloud className="h-10 w-10 text-muted mb-3" />
                <p className="font-bold text-text text-sm">Click to upload or drag and drop</p>
                <p className="text-xs text-muted font-medium mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-text">Curriculum Upload</h2>
              <button className="bg-bg border border-border px-4 py-2 rounded-[5px] text-xs font-bold text-text hover:border-primary transition-colors">Add Module</button>
            </div>
            
            <div className="border border-border rounded-[5px] bg-bg p-6 text-center">
              <Video className="h-12 w-12 mx-auto text-muted mb-3 opacity-50" />
              <p className="font-bold text-text mb-1">Drag video files here to upload</p>
              <p className="text-sm text-muted font-medium">Videos will be automatically compressed and transcribed.</p>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h2 className="text-2xl font-bold text-text">Pricing Strategy</h2>
            <div className="space-y-2 max-w-sm">
              <label className="text-sm font-bold text-text">Price (USD)</label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />
                <input type="number" placeholder="89.99" className="w-full bg-bg border border-border rounded-[5px] pl-12 pr-4 py-3 text-lg font-bold focus:border-primary outline-none text-text transition-all" />
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 text-center py-10 animate-in fade-in duration-300">
            <div className="h-24 w-24 bg-success/20 text-success rounded-[5px] flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-12 w-12" />
            </div>
            <h2 className="text-3xl font-bold text-text font-display">Ready to Publish!</h2>
            <p className="text-muted font-medium max-w-md mx-auto">Your course is fully configured. It will be submitted to the Cloud Nexus team for quality assurance review before going live.</p>
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-10 pt-6 border-t border-border flex items-center justify-between">
          <button 
            onClick={() => setStep(s => Math.max(1, s - 1))}
            className={`px-6 py-2.5 font-bold text-sm text-text transition-opacity ${step === 1 ? 'opacity-0 pointer-events-none' : 'opacity-100 hover:text-primary'}`}
          >
            Back
          </button>
          
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
                  border-[#d9e2ff]
                  dark:border-white/10

                  bg-white
                  dark:bg-[#2563ff]

                  px-6

                  text-[14px]
                  font-semibold

                  text-black
                  dark:text-white

                  overflow-hidden
                  rounded-none

                  shadow-[0_10px_30px_rgba(37,99,235,0.08)]
                  dark:shadow-[0_10px_30px_rgba(0,0,0,0.4)]

                  transition-all
                  duration-300

                  hover:-translate-y-[2px]
                  hover:border-[#2563ff]/40

                  [clip-path:polygon(12px_0,100%_0,100%_calc(100%-12px),calc(100%-12px)_100%,0_100%,0_12px)]
                "
          >
            {step === STEPS.length ? 'Submit for Review' : 'Save & Continue'} 
            {step !== STEPS.length && <ArrowRight className="h-4 w-4" />}
          </button>
        </div>

      </div>
    </div>
  );
}
