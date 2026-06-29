import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

import { MEGA_MENU_SECTIONS, explorePath } from '@/data/exploreMenu';

const EASE = [0.16, 1, 0.3, 1];
const HOVER_CLOSE_DELAY = 140;

function MenuColumn({ title, children, delay = 0 }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: EASE, delay }}
      className="min-w-0"
    >
      <h3 className="mb-2.5 text-[13px] font-semibold tracking-[-0.01em] text-text">
        {title}
      </h3>
      {children}
    </motion.div>
  );
}

function MenuLinkList({ items, type, onNavigate, viewAllHref }) {
  return (
    <div>
      <ul className="space-y-0.5">
        {items.map((item) => (
          <li key={item.slug}>
            <Link
              to={item.to ?? explorePath(type, item.slug)}
              onClick={onNavigate}
              className="
                group flex items-center rounded-md px-2 py-1.5 text-[13.5px] text-muted
                transition-colors duration-150
                hover:bg-primary/5 hover:text-primary
              "
            >
              <span className="transition-transform duration-150 group-hover:translate-x-0.5">
                {item.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      {viewAllHref && (
        <Link
          to={viewAllHref}
          onClick={onNavigate}
          className="mt-2.5 inline-block text-[13px] font-medium text-primary underline-offset-2 hover:underline"
        >
          View all
        </Link>
      )}
    </div>
  );
}

function MegaMenuPanel({ onClose, onHoverStart, onHoverEnd }) {
  const shouldReduceMotion = useReducedMotion();
  const handleNavigate = () => onClose();

  return (
    <>
      <motion.div
        aria-hidden
        initial={shouldReduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: EASE }}
        className="pointer-events-none fixed inset-0 top-16 z-40 bg-black/20"
      />

      <motion.div
        data-explore-menu
        onMouseEnter={onHoverStart}
        onMouseLeave={onHoverEnd}
        initial={shouldReduceMotion ? false : { opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.25, ease: EASE }}
        className="
          fixed left-[30%] right-[20%] top-16 z-50
          rounded-b-xl border border-t-0 border-border/60 bg-bg
          shadow-[var(--shadow-elevated-value)]
        "
      >
        <div className="py-5 pl-10 pr-4">
          <div className="grid grid-cols-3 gap-4">
            {MEGA_MENU_SECTIONS.map((section, index) => (
              <MenuColumn
                key={section.id}
                title={section.title}
                delay={index * 0.04}
              >
                <MenuLinkList
                  items={section.items}
                  type={section.type}
                  onNavigate={handleNavigate}
                  viewAllHref={explorePath(section.type)}
                />
              </MenuColumn>
            ))}
          </div>

          <div className="mt-4 border-t border-border/60 pt-3.5 text-[13px] text-muted">
            <span>Not sure where to begin? </span>
            <Link
              to="/courses"
              onClick={handleNavigate}
              className="font-medium text-primary hover:underline"
            >
              Browse all courses
            </Link>
          </div>
        </div>
      </motion.div>
    </>
  );
}

function MobileExploreAccordion({ onNavigate }) {
  const [openSection, setOpenSection] = useState(null);
  const toggle = (id) => setOpenSection((prev) => (prev === id ? null : id));

  return (
    <div className="flex flex-col gap-2">
      {MEGA_MENU_SECTIONS.map((section) => {
        const isOpen = openSection === section.id;

        return (
          <div
            key={section.id}
            className="overflow-hidden rounded-xl border border-border/80 bg-elevated/40"
          >
            <button
              type="button"
              onClick={() => toggle(section.id)}
              className="flex w-full items-center justify-between px-4 py-3.5 text-left text-[14px] font-medium text-text"
              aria-expanded={isOpen}
            >
              {section.title}
              <ChevronDown
                size={16}
                className={`shrink-0 text-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                aria-hidden
              />
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: EASE }}
                  className="overflow-hidden"
                >
                  <ul className="space-y-0.5 border-t border-border/50 px-2 pb-3 pt-2">
                    {section.items.map((item) => (
                      <li key={item.slug}>
                        <Link
                          to={item.to ?? explorePath(section.type, item.slug)}
                          onClick={onNavigate}
                          className="block rounded-lg px-3 py-2.5 text-[14px] text-muted transition-colors hover:bg-primary/5 hover:text-primary"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <Link
                        to={explorePath(section.type)}
                        onClick={onNavigate}
                        className="block rounded-lg px-3 py-2.5 text-[13px] font-medium text-primary"
                      >
                        View all
                      </Link>
                    </li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

function ExploreMegaMenuTrigger({ isOpen }) {
  return (
    <span
      aria-expanded={isOpen}
      aria-haspopup="true"
      className={`
        inline-flex h-10 items-center gap-1 rounded-md px-3 text-[14px] font-normal
        tracking-[-0.01em] transition-all duration-200
        ${isOpen
          ? 'bg-primary/10 text-primary'
          : 'text-muted hover:bg-primary/5 hover:text-text'
        }
      `}
    >
      Explore
      <ChevronDown
        size={14}
        className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        aria-hidden
      />
    </span>
  );
}

export default function ExploreMegaMenu({ isOpen, onOpenChange }) {
  const closeTimerRef = useRef(null);

  const openMenu = useCallback(() => {
    clearTimeout(closeTimerRef.current);
    onOpenChange(true);
  }, [onOpenChange]);

  const scheduleClose = useCallback(() => {
    closeTimerRef.current = setTimeout(() => onOpenChange(false), HOVER_CLOSE_DELAY);
  }, [onOpenChange]);

  useEffect(() => {
    return () => clearTimeout(closeTimerRef.current);
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onOpenChange(false);
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onOpenChange]);

  const close = () => onOpenChange(false);

  return (
    <div
      data-explore-menu
      className="relative hidden items-center lg:flex"
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
    >
      <ExploreMegaMenuTrigger isOpen={isOpen} />

      {isOpen && (
        <div
          aria-hidden
          className="absolute left-0 top-full z-50 h-3 w-40"
          onMouseEnter={openMenu}
          onMouseLeave={scheduleClose}
        />
      )}

      <AnimatePresence>
        {isOpen && (
          <MegaMenuPanel
            onClose={close}
            onHoverStart={openMenu}
            onHoverEnd={scheduleClose}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export { MobileExploreAccordion };
