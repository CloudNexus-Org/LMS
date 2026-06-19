import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Code2, Play } from "lucide-react";
import { Link } from "react-router-dom";
import useIsDarkTheme from "@/hooks/useIsDarkTheme";
import Container from "@/components/ui/Container";

export default function TrackHero({ track }) {
  const isDarkTheme = useIsDarkTheme();

  // Use track data falling back to default values from the design if they don't exist
  const subtitle = "CODE. CREATE. CONQUER.";
  const title = track.name || "Data Science And Analytics\nWith GenAI";
  const desc = track.longDescription || "Gain hands-on experience in data analysis, visualization, and AI integration.";

  // Fallback heroMentors if they don't exist
  const heroMentors = track.heroMentors || [
    { name: "Rohit Sharma", company: "Ex-AWS", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop&q=80" },
    { name: "Ananya Verma", company: "Ex-Azure", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=800&fit=crop&q=80" },
    { name: "Karan Patel", company: "Ex-Google", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=800&fit=crop&q=80" },
  ];

  // Theme-aware colors
  const textClass = isDarkTheme ? "text-white" : "text-black";
  const mutedTextClass = isDarkTheme ? "text-white/75" : "text-black/75";
  const buttonPrimaryClass = "rounded-full bg-primary hover:bg-primary-hover text-white px-8 py-3.5 font-semibold";
  const buttonSecondaryClass = isDarkTheme
    ? "rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white/80 px-8 py-3.5 font-semibold"
    : "rounded-full border border-black/10 bg-black/5 hover:bg-black/10 text-black/80 px-8 py-3.5 font-semibold";

  return (
    <section className={`relative overflow-hidden min-h-screen bg-transparent ${textClass}`}>
      <Container
        size="xl"
        className="
    relative
    z-20

    pt-28
    sm:pt-32
    md:pt-20
    lg:pt-20
  "
      >
        <div className="grid lg:grid-cols-2 items-center min-h-[620px] gap-12">
          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div 
              className={`inline-flex items-center gap-2.5 rounded-full border backdrop-blur-md px-4 py-1.5 mb-6 transition-all duration-500 shadow-[0_0_20px_rgba(33,92,255,0.15)] ${
                isDarkTheme 
                  ? "bg-[#0B1121]/90 border-blue-500/30" 
                  : "bg-white/90 border-[#215cff]/20"
              }`}
            >
              <Code2 size={16} strokeWidth={2.5} className={isDarkTheme ? "text-[#4b79ff]" : "text-[#215cff]"} />
              <p className={`text-[12px] sm:text-[12.5px] font-bold tracking-[0.15em] uppercase mt-0.5 ${
                isDarkTheme ? "text-[#4b79ff]" : "text-[#215cff]"
              }`}>
                CODE. CREATE. CONQUER.
              </p>
            </div>

            <h1 className={`text-4xl lg:text-[56px] font-display font-medium leading-[1.05] tracking-tight max-w-[700px] whitespace-pre-line ${textClass}`}>
              {title}
            </h1>

            <p className={`${mutedTextClass} mt-5 text-[15px] max-w-[680px] leading-relaxed`}>
              {desc}
            </p>

            {/* pricing */}
            <div className="mt-8 flex flex-col">
              <span className={`text-[11px] font-semibold ${isDarkTheme ? "text-zinc-500" : "text-slate-600"} uppercase tracking-widest mb-2`}>
                Course Investment
              </span>
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className={`text-primary text-4xl md:text-[48px] font-display font-medium tracking-normal leading-none`}>
                  Rs.6999
                </span>
                <span className={`${isDarkTheme ? "text-zinc-500" : "text-slate-500"} line-through text-xl font-medium ml-2`}>
                  Rs.14891
                </span>
                <span className={`text-[14px] ${isDarkTheme ? "text-zinc-400" : "text-slate-600"} font-medium ml-1`}>
                  (+GST)
                </span>
              </div>
            </div>

            {/* buttons */}
            <div className="flex flex-wrap gap-4 mt-10">
              <Link to="/signup" className={`${buttonPrimaryClass} transition-colors flex items-center gap-2 text-[15px]`}>
                Buy Now
                <ArrowRight size={18} />
              </Link>
              <Link to={`/learn/${track?.id || 'cloud'}`} className={`${buttonSecondaryClass} transition-colors flex items-center gap-2 text-[15px]`}>
                Learn More
                <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>

          {/* RIGHT: 3D Mentor Coverflow Carousel */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: .8 }}
            className="relative block"
          >
            {/* Render the actual UI for the Video Card mockup */}
            <div className="relative w-full max-w-[540px] mx-auto xl:ml-auto">
              
              {/* Ambient Glow */}
              <div className="absolute inset-0 -z-10 bg-[#215cff]/15 blur-[100px] rounded-full scale-90" />

              {/* The Glassmorphic Window Component */}
              <div className={`rounded-[2rem] border backdrop-blur-2xl p-4 md:p-5 shadow-[0_30px_60px_rgba(0,0,0,0.15)] relative group overflow-hidden ${
                isDarkTheme 
                  ? 'bg-[#0b1121]/50 border-white/10 shadow-black/60' 
                  : 'bg-white/30 border-white/50 shadow-[#215cff]/10'
              }`}>
                
                {/* Mac OS Window Controls */}
                <div className="flex gap-2 mb-4 px-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] shadow-sm" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] shadow-sm" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F] shadow-sm" />
                </div>

                {/* Video Thumbnail Area */}
                <div className="relative rounded-xl overflow-hidden aspect-[16/10] bg-slate-800 shadow-inner">
                  <img 
                    src="https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&h=500&fit=crop&q=80" 
                    alt="Course Preview"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

                  {/* Play Button - Ultra Glass */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/30 transition-colors duration-500">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.25)] group-hover:scale-110 group-hover:bg-white/30 transition-all cursor-pointer">
                      <Play size={28} className="text-white fill-white ml-1.5" />
                    </div>
                  </div>
                </div>

                {/* Tags Row */}
                <div className="flex flex-wrap gap-2.5 mt-5 px-1 justify-center sm:justify-start">
                  {["Machine Learning", "Deep Learning", "Gen-AI", "Python"].map((tag) => (
                    <span 
                      key={tag} 
                      className={`rounded-full border px-4 py-1.5 text-[11.5px] font-semibold transition-all cursor-default ${
                        isDarkTheme 
                          ? 'border-white/10 text-white/80 bg-white/5 hover:bg-white/10 hover:text-white' 
                          : 'border-black/10 text-black/70 bg-black/5 hover:bg-black/10 hover:text-black'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
