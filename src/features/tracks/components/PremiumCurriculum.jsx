import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, CheckCircle2, BarChart3, Clock } from 'lucide-react';
import useIsDarkTheme from '@/hooks/useIsDarkTheme';

export default function PremiumCurriculum({ track }) {
  const isDarkTheme = useIsDarkTheme();
  const [open, setOpen] = useState(0);
  const [showAll, setShowAll] = useState(false);

  // Theme-aware colors
  const sectionBgClass = isDarkTheme ? "bg-black" : "bg-slate-50";
  const headingTextClass = isDarkTheme ? "text-white" : "text-slate-950";
  const badgeBgClass = isDarkTheme ? "border-primary/20 bg-primary/10 text-primary" : "border-primary/30 bg-primary/15 text-primary";
  const textMutedClass = isDarkTheme ? "text-white/70" : "text-slate-600";

  const modules = track.curriculum;
  const displayModules = showAll ? modules : modules.slice(0, 5);
  const hasMore = modules.length > 5;

  return (
    <section className={`${sectionBgClass} w-full py-20 md:py-24 px-6 lg:px-8 relative z-20`}>
      <div className="max-w-[1200px] mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10 md:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`inline-block border ${badgeBgClass} px-5 py-2 text-[12px] font-bold tracking-widest uppercase rounded-md shadow-sm mb-3`}
          >
            Curriculum
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className={`text-3xl md:text-4xl lg:text-5xl mt-1 max-w-3xl mx-auto font-display font-medium tracking-normal ${headingTextClass} leading-[1.2]`}
          >
            Structured Curriculum Designed For Real Growth
          </motion.h2>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-[380px_1fr] gap-8 lg:gap-10 items-start">
          
          {/* Left: Sticky Prerequisite Card */}
          <div className="lg:sticky top-24">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className={`rounded-none p-4 md:p-5 shadow-sm border ${isDarkTheme ? "bg-white border-slate-200 text-slate-900" : "bg-black border-white/10 text-white"}`}
            >
              <h3 className={`text-xl md:text-2xl font-display font-semibold tracking-tight ${isDarkTheme ? "text-slate-900" : "text-white"}`}>
                Course Prerequisites
              </h3>
              
              <p className={`mt-3 text-[14px] leading-6 ${isDarkTheme ? "text-slate-600" : "text-white/70"}`}>
                Basic computer literacy and a passion for building are recommended to get the most out of this intensive track.
              </p>

              <div className={`flex flex-wrap gap-4 mt-6 pb-6 border-b ${isDarkTheme ? "border-slate-100" : "border-white/10"}`}>
                <div className={`flex items-center gap-3 font-semibold ${isDarkTheme ? "text-slate-900" : "text-white"}`}>
                  <BarChart3 className="text-primary" size={22} />
                  <span>{track.level?.split(' ')[0] || 'Beginner'}</span>
                </div>
                
                <div className={`flex items-center gap-3 font-semibold ${isDarkTheme ? "text-slate-900" : "text-white"}`}>
                  <Clock className="text-primary" size={22} />
                  <span>{track.durationWeeks} Weeks</span>
                </div>
              </div>

              <div className="mt-8">
                <p className={`text-[11px] font-bold uppercase tracking-[0.2em] mb-6 ${isDarkTheme ? "text-slate-500" : "text-white/50"}`}>
                  A quick overview of the course
                </p>
                
                <div className="space-y-2">
                  {[
                    'Access to Industry Ready Curriculum',
                    'Industry Level Intense Training',
                    'Access to Discord Community',
                    '1 on 1 Mentor Session'
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-3 items-center">
                      <div className="flex-shrink-0">
                        <CheckCircle2 className="text-primary" size={16} />
                      </div>
                      <span className={`text-[14px] font-medium ${isDarkTheme ? "text-slate-800" : "text-white/90"}`}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button className="btn btn-primary w-full mt-6 py-3 text-[15px] group flex items-center justify-center gap-2">
                View Full Syllabus
                <span className="group-hover:translate-x-1 transition-transform">â†’</span>
              </button>

            </motion.div>
          </div>

          {/* Right: Accordion Modules */}
          <div className="space-y-4">
            {displayModules.map((item, index) => {
              const isOpen = open === index;
              const fallbackDesc = `A comprehensive module focused on ${item.title.toLowerCase()}, covering essential concepts like ${item.topics?.join(', ')} to build solid, project-ready skills.`;
              const description = item.description || fallbackDesc;

              return (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: index * 0.05 }}
                  key={item.id} 
                  className={`rounded-lg overflow-hidden shadow-sm border transition-all duration-300 hover:shadow-md ${isDarkTheme ? 'bg-elevated border-border' : 'bg-white border-slate-200'}`}
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : index)}
                    className="w-full p-5 md:p-6 flex justify-between items-start md:items-center text-left group"
                  >
                    <div className="flex-1 pr-6">
                      <div className={`inline-block text-[11px] font-bold px-3 py-1 rounded-md mb-4 tracking-wider ${badgeBgClass}`}>
                        MODULE {index + 1}
                      </div>
                      
                      <h4 className={`text-2xl md:text-3xl font-display font-medium ${headingTextClass} group-hover:text-primary transition-colors`}>
                        {item.title}
                      </h4>
                      <p className={`${textMutedClass} mt-3 text-[15px] leading-relaxed max-w-2xl`}>
                        {description}
                      </p>
                    </div>

                    <motion.div 
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg transition-colors ${isOpen ? isDarkTheme ? 'bg-primary/20 text-primary' : 'bg-primary/10 text-primary' : isDarkTheme ? 'bg-white/10 text-white/60 group-hover:bg-primary/10 group-hover:text-primary' : 'bg-slate-200 text-slate-500 group-hover:bg-slate-300 group-hover:text-primary'}`}
                    >
                      <ChevronDown size={24} />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 md:px-6 pb-6 pt-2">
                          <div className={`w-full h-px ${isDarkTheme ? 'bg-white/10' : 'bg-slate-200'} mb-6`} />
                          <ul className="space-y-3">
                            {item.topics?.map((topic, tIdx) => (
                              <li key={tIdx} className={`flex items-start gap-3`}>
                                <div className="mt-1.5 w-1.5 h-1.5 bg-primary shrink-0" />
                                <span className={`${isDarkTheme ? 'text-white/80' : 'text-slate-700'} font-medium text-[15px]`}>
                                  {topic}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}

            {hasMore && (
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="pt-4 flex justify-center lg:justify-start"
              >
                <button
                  onClick={() => setShowAll(!showAll)}
                    className={`rounded-full px-6 py-3 font-semibold transition-colors flex items-center gap-2 ${isDarkTheme ? 'bg-white/5 border border-white/10 text-white/90 hover:bg-white/10' : 'bg-slate-100 border border-slate-300 text-slate-700 hover:bg-slate-200'}`}
                >
                  {showAll ? 'Show less' : 'Show more'}
                  <span aria-hidden>â†’</span>
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

    </section>
  );
}
