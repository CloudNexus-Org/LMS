import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ChevronDown,
  BookOpen,
  Users,
  Compass,
  GraduationCap,
  BarChart2,
  Award,
  MessageSquare,
} from "lucide-react";

import ThemeToggle from "../ui/ThemeToggle";
import Button from "../ui/Button";
import { SHELL_MAX_WIDTH, SHELL_PADDING } from "../ui/Container";

import cnlg from "@/assets/navbar/white.png";
import cnlg1 from "@/assets/navbar/Blac.png";

import useSmartNavbar from "../../hooks/useSmartNavbar";
import useIsDarkTheme from "../../hooks/useIsDarkTheme";
import { scrollToSection as scrollSectionUtil } from "../../utils/scroll";

const DEFAULT_LINKS = [
  {
    label: "Explore",
    items: [
      {
        icon: <Compass size={16} />,
        label: "How it works",
        description: "See how Cloud Nexus helps you grow",
        href: "#how-it-works",
      },
      {
        icon: <BarChart2 size={16} />,
        label: "Dashboard preview",
        description: "Get a feel for the learning experience",
        href: "#dashboard",
      },
    ],
  },
  {
    label: "Courses",
    items: [
      {
        icon: <BookOpen size={16} />,
        label: "All courses",
        description: "Browse our full course catalog",
        href: "/tracks",
      },
      {
        icon: <Award size={16} />,
        label: "Certificates",
        description: "Earn recognised industry certificates",
        href: "#certificates",
      },
    ],
  },
  {
    label: "Mentors",
    items: [
      {
        icon: <GraduationCap size={16} />,
        label: "Meet the mentors",
        description: "Learn from top industry experts",
        href: "/mentors",
      },
      {
        icon: <Users size={16} />,
        label: "Community",
        description: "Join thousands of learners worldwide",
        href: "#stats",
      },
    ],
  },
  {
    label: "Contact",
    href: "#contact",
  },
];

const NAV_HEIGHT = 64;

function DropdownPanel({ items, onSelect }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.98 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      className="absolute top-[calc(100%+10px)] left-1/2 z-50 min-w-[260px] -translate-x-1/2 rounded-xl border border-border bg-elevated p-1.5 shadow-2xl"
    >
      <div className="absolute -top-[5px] left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 border-l border-t border-border bg-elevated" />
      {items.map((item) => (
        <a
          key={item.label}
          href={item.href}
          onClick={(e) => onSelect(e, item.href)}
          className="group flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors duration-150 hover:bg-primary/5"
        >
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
            {item.icon}
          </span>
          <span className="flex flex-col gap-0.5">
            <span className="text-[13px] font-medium leading-none text-text">
              {item.label}
            </span>
            <span className="text-[12px] leading-snug text-muted">
              {item.description}
            </span>
          </span>
        </a>
      ))}
    </motion.div>
  );
}

function collectSectionHrefs(links) {
  const hrefs = [];
  for (const link of links) {
    if (link.items) {
      for (const item of link.items) {
        if (item.href?.startsWith("#")) hrefs.push(item.href);
      }
    } else if (link.href?.startsWith("#")) {
      hrefs.push(link.href);
    }
  }
  return hrefs;
}

export default function Navbar({
  navLinks = DEFAULT_LINKS,
  showAuthButtons = true,
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [openMobileItem, setOpenMobileItem] = useState(null);
  const [activeSection, setActiveSection] = useState("");
  const [logoFailed, setLogoFailed] = useState(false);

  const pendingScrollRef = useRef(null);
  const dropdownTimerRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();
  const isDarkTheme = useIsDarkTheme();
  const isHome = location.pathname === "/";

  const navbarState = useSmartNavbar({
    threshold: 14,
    topGuard: 80,
    stopDelay: 150,
  });

  const isVisible = isMobileMenuOpen ? true : navbarState.isVisible;
  const isScrolled = navbarState.isScrolled;

  const scrollToSection = useCallback((href) => {
    if (!href?.startsWith("#")) return false;
    const ok = scrollSectionUtil(href, NAV_HEIGHT);
    if (ok) setActiveSection(href);
    return ok;
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!isHome) {
        setActiveSection("");
        return;
      }
      const scrollPos = window.scrollY + 120;
      let current = "";
      for (const href of collectSectionHrefs(navLinks)) {
        const section = document.querySelector(href);
        if (!section) continue;
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        if (scrollPos >= top && scrollPos < bottom) {
          current = href;
          break;
        }
      }
      setActiveSection(current);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome, navLinks]);

  useEffect(() => {
    if (!isHome) return;
    const target = pendingScrollRef.current;
    if (!target) return;
    requestAnimationFrame(() => {
      scrollToSection(target);
      pendingScrollRef.current = null;
    });
  }, [isHome, location.pathname, scrollToSection]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handler = () => setOpenDropdown(null);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
    setOpenMobileItem(null);

    if (href?.startsWith("/")) {
      navigate(href);
      return;
    }

    if (isHome) {
      scrollToSection(href);
    } else {
      pendingScrollRef.current = href;
      navigate("/");
    }
  };

  const handleMouseEnter = (label) => {
    clearTimeout(dropdownTimerRef.current);
    setOpenDropdown(label);
  };

  const handleMouseLeave = () => {
    dropdownTimerRef.current = setTimeout(() => setOpenDropdown(null), 120);
  };

  const isLandingTop = isHome && !isScrolled;

  return (
    <>
      <motion.nav
        initial={false}
        animate={{
          y: isVisible ? "0%" : "-100%",
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={`fixed left-0 top-0 z-50 w-full transition-all duration-500 ${
          isLandingTop
            ? "border-transparent bg-transparent shadow-none"
            : isHome
              ? "border-b border-border/10 bg-bg/75 shadow-none backdrop-blur-xl"
              : "border-b border-border/10 bg-bg/90 shadow-[0_1px_0_0_rgba(255,255,255,0.03)] backdrop-blur-md"
        }`}
      >
        <div
          className={`relative z-10 mx-auto flex h-16 w-full items-center ${SHELL_MAX_WIDTH} ${SHELL_PADDING}`}
        >
          <Link
            to="/"
            onClick={() => {
              setActiveSection("");
              setIsMobileMenuOpen(false);
            }}
            className="relative z-10 flex shrink-0 items-center gap-2"
          >
            {!logoFailed ? (
              <img
                src={isDarkTheme ? cnlg : cnlg1}
                alt="Cloud Nexus Logo"
                className="h-[48px] w-auto object-contain sm:h-[54px] lg:h-[58px]"
                width={180}
                height={58}
                decoding="async"
                onError={() => setLogoFailed(true)}
              />
            ) : (
              <span className="font-display text-lg font-bold tracking-tight text-text sm:text-xl">
                Cloud Nexus
              </span>
            )}
          </Link>

          <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-1 lg:flex">
            {navLinks.map((link) => {
              const hasDropdown = !!link.items;
              const isOpen = openDropdown === link.label;
              const isActive =
                isHome &&
                (hasDropdown
                  ? link.items.some((item) => item.href === activeSection)
                  : link.href === activeSection);

              return (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => hasDropdown && handleMouseEnter(link.label)}
                  onMouseLeave={() => hasDropdown && handleMouseLeave()}
                  onClick={(e) => e.stopPropagation()}
                >
                  {hasDropdown ? (
                    <button
                      type="button"
                      className={`inline-flex items-center gap-1 rounded-md px-3 py-2 text-[14px] font-normal tracking-[-0.01em] transition-colors duration-150 ${
                        isActive || isOpen
                          ? "text-text"
                          : "text-muted hover:text-text"
                      }`}
                    >
                      {link.label}
                      <ChevronDown
                        size={13}
                        className={`transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  ) : (
                    <a
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className={`inline-flex items-center rounded-md px-3 py-2 text-[14px] font-normal tracking-[-0.01em] transition-colors duration-150 ${
                        isActive ? "text-text" : "text-muted hover:text-text"
                      }`}
                    >
                      {link.label}
                    </a>
                  )}

                  <AnimatePresence>
                    {hasDropdown && isOpen && (
                      <DropdownPanel
                        items={link.items}
                        onSelect={handleNavClick}
                      />
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          <div className="relative z-10 ml-auto flex items-center gap-2.5 sm:gap-3 lg:gap-4">
            <ThemeToggle className="hidden sm:inline-flex" />

            {showAuthButtons && (
              <div className="hidden items-center gap-5 lg:flex">
                <Link
                  to="/login"
                  className="px-1 text-[14px] font-normal text-muted transition-colors hover:text-text"
                >
                  Log in
                </Link>
                <Button
                  to="/signup"
                  variant="primary"
                  size="md"
                  className="bg-primary px-5 shadow-none hover:bg-primary-hover"
                >
                  Get Started
                </Button>
              </div>
            )}

            <button
              onClick={() => setIsMobileMenuOpen((v) => !v)}
              className="z-50 flex h-10 w-10 items-center justify-center rounded-lg border border-border transition-all duration-300 hover:border-primary/30 hover:bg-primary/5 lg:hidden"
              style={{
                backgroundColor: isLandingTop ? "transparent" : undefined,
                color: isDarkTheme ? "#ffffff" : "#000000",
              }}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.3 }}
              className="absolute left-0 top-16 z-40 w-full lg:hidden"
            >
              <div
                className={`relative overflow-hidden rounded-b-2xl border-t backdrop-blur-2xl ${
                  isDarkTheme
                    ? "border-white/10 bg-bg/98"
                    : "border-black/10 bg-white/98"
                }`}
              >
                <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-80" />

                <div className="px-6 pb-10 pt-7">
                  <div className="mb-5 flex items-center justify-between sm:hidden">
                    <span className="text-[13px] font-medium uppercase tracking-wider text-muted">
                      Menu
                    </span>
                    <ThemeToggle />
                  </div>

                  <div className="flex flex-col gap-2">
                    {navLinks.map((link, index) => {
                      const hasDropdown = !!link.items;
                      const isExpanded = openMobileItem === link.label;
                      const isActive = hasDropdown
                        ? link.items.some(
                            (item) =>
                              item.href === activeSection ||
                              (item.href === "/mentors" &&
                                location.pathname === "/mentors")
                          )
                        : activeSection === link.href;

                      if (!hasDropdown) {
                        return (
                          <motion.a
                            key={link.label}
                            href={link.href}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={(e) => handleNavClick(e, link.href)}
                            className={`flex items-center gap-3 rounded-xl border px-5 py-4 text-[15px] font-medium transition-colors ${
                              isDarkTheme
                                ? "border-white/10 bg-white/[0.03] text-white"
                                : "border-black/10 bg-black/[0.02] text-black"
                            } ${isActive ? "border-primary text-primary" : ""}`}
                          >
                            <MessageSquare size={16} className="text-primary" />
                            {link.label}
                          </motion.a>
                        );
                      }

                      return (
                        <motion.div
                          key={link.label}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="overflow-hidden rounded-xl border border-border/80"
                        >
                          <button
                            type="button"
                            onClick={() =>
                              setOpenMobileItem((prev) =>
                                prev === link.label ? null : link.label
                              )
                            }
                            className={`flex w-full items-center justify-between px-5 py-4 text-left text-[15px] font-medium transition-colors ${
                              isDarkTheme
                                ? "bg-white/[0.03] text-white"
                                : "bg-black/[0.02] text-black"
                            } ${isActive ? "text-primary" : ""}`}
                          >
                            <span>{link.label}</span>
                            <ChevronDown
                              size={16}
                              className={`transition-transform duration-300 ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                            />
                          </button>

                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25 }}
                                className="overflow-hidden border-t border-border/60"
                              >
                                {link.items.map((item) => (
                                  <a
                                    key={item.label}
                                    href={item.href}
                                    onClick={(e) => handleNavClick(e, item.href)}
                                    className="flex items-start gap-3 px-5 py-3.5 transition-colors hover:bg-primary/5"
                                  >
                                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                                      {item.icon}
                                    </span>
                                    <span>
                                      <span className="block text-[14px] font-medium text-text">
                                        {item.label}
                                      </span>
                                      <span className="mt-0.5 block text-[12px] text-muted">
                                        {item.description}
                                      </span>
                                    </span>
                                  </a>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
                  </div>

                  {showAuthButtons && (
                    <div className="mt-7 flex flex-col items-center gap-3">
                      <Link
                        to="/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-[14px] font-normal text-muted transition-colors hover:text-text"
                      >
                        Log in
                      </Link>
                      <Button
                        to="/signup"
                        variant="primary"
                        size="lg"
                        fullWidth
                        className="bg-primary shadow-none hover:bg-primary-hover"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Get Started
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
