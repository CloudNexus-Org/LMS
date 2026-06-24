import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

import ThemeToggle from "../ui/ThemeToggle";
import CartButton from "../courses/CartButton";
import { SHELL_MAX_WIDTH, SHELL_PADDING } from "../ui/Container";

import cnlg from "@/assets/navbar/white.png";
import cnlg1 from "@/assets/navbar/Blac.png";

import useSmartNavbar from "../../hooks/useSmartNavbar";
import useIsDarkTheme from "../../hooks/useIsDarkTheme";
import { scrollToSection as scrollSectionUtil } from "../../utils/scroll";

const DEFAULT_LINKS = [
  { label: "Explore", href: "#how-it-works" },
  { label: "Courses", href: "/courses" },
  { label: "Mentors", href: "/mentors" },
  { label: "Contact", href: "#contact" },
];

const NAV_HEIGHT = 64;

function collectSectionHrefs(links) {
  return links
    .map((link) => link.href)
    .filter((href) => href?.startsWith("#"));
}

export default function Navbar({
  navLinks = DEFAULT_LINKS,
  showAuthButtons = true,
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [logoFailed, setLogoFailed] = useState(false);

  const pendingScrollRef = useRef(null);

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

  const isLinkActive = (link) => {
    if (link.href?.startsWith("/")) {
      return location.pathname === link.href;
    }
    return isHome && link.href === activeSection;
  };

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

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);

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

  const isLandingTop = isHome && !isScrolled;

  const linkClassName = (isActive) =>
    `inline-flex items-center rounded-md px-3 py-2 text-[14px] font-normal tracking-[-0.01em] transition-colors duration-150 ${
      isActive ? "text-text" : "text-muted hover:text-text"
    }`;

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
              const isActive = isLinkActive(link);

              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={linkClassName(isActive)}
                >
                  {link.label}
                </a>
              );
            })}
          </div>

          <div className="relative z-10 ml-auto flex items-center gap-2.5 sm:gap-3 lg:gap-4">
            <CartButton />
            <ThemeToggle className="hidden sm:inline-flex" />

            {showAuthButtons && (
              <div className="hidden items-center lg:flex">
                <Link
                  to="/login"
                  className="px-1 text-[14px] font-normal text-muted transition-colors hover:text-text"
                >
                  Log in
                </Link>
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
                      const isActive = isLinkActive(link);

                      return (
                        <motion.a
                          key={link.label}
                          href={link.href}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={(e) => handleNavClick(e, link.href)}
                          className={`flex items-center rounded-xl border px-5 py-4 text-[15px] font-medium transition-colors ${
                            isDarkTheme
                              ? "border-white/10 bg-white/[0.03] text-white"
                              : "border-black/10 bg-black/[0.02] text-black"
                          } ${isActive ? "border-primary text-primary" : ""}`}
                        >
                          {link.label}
                        </motion.a>
                      );
                    })}
                  </div>

                  {showAuthButtons && (
                    <div className="mt-7 flex justify-center">
                      <Link
                        to="/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-[14px] font-normal text-muted transition-colors hover:text-text"
                      >
                        Log in
                      </Link>
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
