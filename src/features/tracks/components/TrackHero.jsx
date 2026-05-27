import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import useIsDarkTheme from "@/hooks/useIsDarkTheme";
import Container from "@/components/ui/Container";

const MentorCoverflow = ({ mentors, isDarkTheme }) => {
  const [activeIndex, setActiveIndex] = useState(1);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % mentors.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + mentors.length) % mentors.length);
  };

  if (!mentors || mentors.length === 0) return null;

  return (
    <div className="relative w-full h-[550px] flex flex-col items-center justify-center" style={{ perspective: '1200px' }}>
      {/* 3D Container */}
      <div className="relative w-full max-w-[400px] h-[400px] flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
        <AnimatePresence initial={false}>
          {mentors.map((mentor, index) => {
            const offset = index - activeIndex;
            // Handle wrap around for exactly 3 items
            let normalizedOffset = offset;
            if (offset === 2) normalizedOffset = -1;
            if (offset === -2) normalizedOffset = 1;

            const isCenter = normalizedOffset === 0;
            const isLeft = normalizedOffset === -1;
            const isRight = normalizedOffset === 1;

            return (
              <motion.div
                key={mentor.name}
                initial={false}
                animate={{
                  x: isCenter ? '0%' : isLeft ? '-65%' : '65%',
                  scale: isCenter ? 1 : 0.8,
                  zIndex: isCenter ? 50 : 40,
                  opacity: isCenter ? 1 : 0.4, // Fades perfectly into solid background
                  rotateY: isCenter ? 0 : isLeft ? 25 : -25,
                }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className={`absolute w-[280px] h-[380px] rounded-3xl overflow-hidden shadow-2xl cursor-pointer bg-slate-900 transition-colors duration-500 ${
                  isCenter 
                    ? 'border-2 border-[#215cff] shadow-[0_0_40px_rgba(33,92,255,0.3)]' 
                    : `border ${isDarkTheme ? 'border-white/10' : 'border-black/10'}`
                }`}
                onClick={() => setActiveIndex(index)}
              >
                {/* Brand Color Glow for Active Card */}
                {isCenter && (
                  <div className="absolute inset-0 bg-[#215cff]/20 mix-blend-overlay z-10 pointer-events-none" />
                )}

                {/* Card Image */}
                <img src={mentor.photo} alt={mentor.name} className="w-full h-full object-cover opacity-90" draggable={false} />
                
                {/* Gradient Overlay for Text */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10 pointer-events-none" />
                
                {/* Text Content */}
                <div className="absolute bottom-0 left-0 w-full p-8 text-center z-20 pointer-events-none">
                  <h3 className="text-[24px] font-black text-white leading-none mb-2 tracking-wide uppercase">
                    {mentor.name.split(' ').pop()}
                  </h3>
                  <p className="text-[10px] text-white/70 font-semibold tracking-[0.3em] uppercase">
                    {mentor.company}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <div className="flex gap-6 mt-12 z-50">
        <button onClick={handlePrev} className={`w-12 h-12 rounded-full border-2 border-[#215cff] backdrop-blur-xl flex items-center justify-center hover:bg-[#215cff]/20 hover:scale-110 transition-all duration-300 shadow-[0_0_20px_rgba(33,92,255,0.3)] ${isDarkTheme ? 'bg-black/40 text-white' : 'bg-white text-[#215cff]'}`}>
          <ChevronLeft size={24} />
        </button>
        <button onClick={handleNext} className={`w-12 h-12 rounded-full border-2 border-[#215cff] backdrop-blur-xl flex items-center justify-center hover:bg-[#215cff]/20 hover:scale-110 transition-all duration-300 shadow-[0_0_20px_rgba(33,92,255,0.3)] ${isDarkTheme ? 'bg-black/40 text-white' : 'bg-white text-[#215cff]'}`}>
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

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
  const bgClass = isDarkTheme ? "bg-black" : "bg-white";
  const textClass = isDarkTheme ? "text-white" : "text-black";
  const mutedTextClass = isDarkTheme ? "text-white/75" : "text-black/75";
  const borderClass = isDarkTheme ? "border-white/10 bg-[#071017]" : "border-black/10 bg-white";
  const glowColorClass = "bg-primary/12";
  const buttonPrimaryClass = "bg-gradient-to-r from-[#215cff] to-[#4b79ff] hover:from-[#4b79ff] hover:to-[#215cff] text-white shadow-[0_12px_28px_rgba(33,92,255,0.30)]";
  const buttonSecondaryClass = isDarkTheme ? "border-white/10 bg-white/5 hover:bg-white/10 text-white/80" : "border-black/10 bg-black/5 hover:bg-black/10 text-black/80";

  return (
    <section className={`relative overflow-hidden min-h-screen ${isDarkTheme ? "bg-black" : "bg-white"} ${textClass}`}>
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
            <p className={`uppercase tracking-[0.25em] text-primary mb-5 text-[12px] font-bold`}>
              {subtitle}
            </p>

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
              <Link to="/signup" className={`px-8 py-4 ${buttonPrimaryClass} transition-all font-bold flex items-center gap-2 text-[15px] [clip-path:polygon(12px_0,100%_0,100%_calc(100%-12px),calc(100%-12px)_100%,0_100%,0_12px)]`}>
                Buy Now
                <ArrowRight size={18} />
              </Link>
              <a href="#curriculum" className={`px-8 py-4 border ${buttonSecondaryClass} transition-all flex items-center gap-2 text-[15px] font-semibold [clip-path:polygon(12px_0,100%_0,100%_calc(100%-12px),calc(100%-12px)_100%,0_100%,0_12px)]`}>
                Learn More
                <ArrowRight size={18} />
              </a>
            </div>
          </motion.div>

          {/* RIGHT: 3D Mentor Coverflow Carousel */}
          <motion.div
            initial={{opacity:0,x:100}}
            animate={{opacity:1,x:0}}
            transition={{duration:.8}}
            className="relative block"
          >
            {/* Render the new Coverflow component */}
            <MentorCoverflow mentors={heroMentors} isDarkTheme={isDarkTheme} />
            
          </motion.div>
        </div>
      </Container>
    </section>
  );
}