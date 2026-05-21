import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Link } from "react-router-dom";
import useIsDarkTheme from "@/hooks/useIsDarkTheme";
import Container from "@/components/ui/Container";

export default function TrackHero({ track }) {
  const isDarkTheme = useIsDarkTheme();
  
  // Use track data falling back to default values from the design if they don't exist
  const subtitle = "CODE. CREATE. CONQUER.";
  const title = track.name || "Data Science And Analytics\nWith GenAI";
  const desc = track.longDescription || "Gain hands-on experience in data analysis, visualization, and AI integration.";
  
  const tags = track.skills || ["Machine Learning", "Deep Learning", "Gen-AI", "Python"];

  // Theme-aware colors
  const bgClass = isDarkTheme ? "bg-black" : "bg-white";
  const textClass = isDarkTheme ? "text-white" : "text-black";
  const mutedTextClass = isDarkTheme ? "text-white/75" : "text-black/75";
  const borderClass = isDarkTheme ? "border-white/10 bg-[#071017]" : "border-black/10 bg-white";
  const glowColorClass = "bg-primary/12";
  const buttonPrimaryClass = "bg-gradient-to-r from-[#215cff] to-[#4b79ff] hover:from-[#4b79ff] hover:to-[#215cff] text-white shadow-[0_12px_28px_rgba(33,92,255,0.30)]";
  const buttonSecondaryClass = isDarkTheme ? "border-white/10 bg-white/5 hover:bg-white/10 text-white/80" : "border-black/10 bg-black/5 hover:bg-black/10 text-black/80";
  const cardBgClass = isDarkTheme ? "bg-[#0b0f14] border-white/8" : "bg-white border-black/10 shadow-[0_4px_16px_rgba(0,0,0,0.08)]";
  const tagBgClass = isDarkTheme ? "bg-white/[0.03] border-white/10 text-white/80" : "bg-black/[0.03] border-black/10 text-black/80";

  return (
    <section className={`relative overflow-hidden min-h-screen ${bgClass} ${textClass}`}>
      {/* Background */}
      <div className="absolute inset-0">
        {/* primary color glow */}
        <div className={`absolute left-[35%] top-[10%] w-[700px] h-[700px] ${glowColorClass} blur-[160px] rounded-full`}/>
        {/* grid */}
        <div
          className={`absolute inset-0 ${isDarkTheme ? "opacity-[0.08]" : "opacity-[0.05]"}`}
          style={{
            backgroundImage: `
            linear-gradient(${isDarkTheme ? "rgba(255,255,255,.2)" : "rgba(0,0,0,.1)"} 1px, transparent 1px),
            linear-gradient(90deg, ${isDarkTheme ? "rgba(255,255,255,.2)" : "rgba(0,0,0,.1)"} 1px, transparent 1px)
            `,
            backgroundSize:"90px 90px"
          }}
        />
        {/* geometric lines */}
        <svg className={`absolute w-full h-full ${isDarkTheme ? "opacity-[0.08]" : "opacity-[0.05]"}`} preserveAspectRatio="none">
          <line x1="0" y1="100" x2="100%" y2="600" stroke={isDarkTheme ? "white" : "black"} />
          <line x1="100%" y1="0" x2="40%" y2="100%" stroke={isDarkTheme ? "white" : "black"} />
        </svg>
      </div>

      <Container size="lg" className="relative z-20 pt-12 md:pt-16">
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
              <Link to="/signup" className={`px-8 py-4 rounded-xl ${buttonPrimaryClass} transition-all font-bold flex items-center gap-2 text-[15px]`}>
                Buy Now
                <ArrowRight size={18} />
              </Link>
              <a href="#curriculum" className={`px-8 py-4 rounded-xl border ${buttonSecondaryClass} transition-all flex items-center gap-2 text-[15px] font-semibold`}>
                Learn More
                <ArrowRight size={18} />
              </a>
            </div>
          </motion.div>

          {/* RIGHT */}
          <motion.div
            initial={{opacity:0,x:100}}
            animate={{opacity:1,x:0}}
            transition={{duration:.8}}
            className="relative block"
          >
            {/* glow behind */}
            <div className={`absolute -inset-20 ${glowColorClass} blur-[140px] rounded-full`}/>

            <div className={`relative rounded-3xl border ${cardBgClass} backdrop-blur-xl p-6 overflow-hidden shadow-[0_0_50px_rgba(var(--color-primary-rgb),.15)]`}>
              {/* browser dots */}
              <div className="flex gap-2 mb-5">
                <div className="w-3 h-3 rounded-full bg-red-400"/>
                <div className="w-3 h-3 rounded-full bg-yellow-400"/>
                <div className="w-3 h-3 rounded-full bg-green-400"/>
              </div>

              {/* video */}
              <div className="relative overflow-hidden rounded-[20px] aspect-video">
                <img
                  src="https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=1200"
                  className="w-full h-full object-cover"
                  alt="Track Preview"
                />
                <div className={`absolute inset-0 ${isDarkTheme ? "bg-black/20" : "bg-black/5"}`}/>
                
                {/* play */}
                <Link
                  to={`/learn/${track.id}`}
                  className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full ${isDarkTheme ? "bg-white/20" : "bg-white/40"} backdrop-blur-xl flex items-center justify-center cursor-pointer hover:scale-110 duration-300`}
                >
                  <Play fill="white" size={28} />
                </Link>
              </div>

              {/* tags */}
              <div className="flex flex-wrap gap-2.5 mt-6">
                {tags.map((item) => (
                  <span
                    key={typeof item === 'string' ? item : item.name}
                    className={`px-3.5 py-1.5 rounded-lg border ${tagBgClass} text-[13px] font-medium`}
                  >
                    {typeof item === 'string' ? item : item.name}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}