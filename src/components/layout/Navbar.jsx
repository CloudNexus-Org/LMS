import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform, useMotionValue, useMotionTemplate } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import ThemeToggle from "../ui/ThemeToggle";
import Button from "../ui/Button";
import BrandMark from "../ui/BrandMark";
import useSmartNavbar from "../../hooks/useSmartNavbar";
import useIsDarkTheme from "../../hooks/useIsDarkTheme";
import { scrollToSection as scrollSectionUtil } from "../../utils/scroll";

const DEFAULT_LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Courses", href: "#courses" },
  { label: "Mentors", href: "#mentors" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#contact" },
];

const NAV_HEIGHT = 80;
const DETECTION_OFFSET = 100;
const NAVBAR_HIDE_TOP_GUARD = 80; // Changed to match NAV_HEIGHT
const NAVBAR_SCROLL_THRESHOLD = 80; // Changed to match NAV_HEIGHT so it naturally scrolls away first
const NAVBAR_STOP_DELAY = 150;

export default function Navbar({
  logoText = "CLOUD NEXUS",
  navLinks = DEFAULT_LINKS,
  showAuthButtons = true,
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const pendingScrollRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";
  const isTrackDetailPage = location.pathname.startsWith("/tracks/");
  const isDarkTheme = useIsDarkTheme();
  const { scrollY, scrollYProgress } = useScroll();
  const navbarState = useSmartNavbar({
    threshold: NAVBAR_SCROLL_THRESHOLD,
    topGuard: NAVBAR_HIDE_TOP_GUARD,
    stopDelay: NAVBAR_STOP_DELAY,
  });
  const isVisible = isMobileMenuOpen ? true : navbarState.isVisible;
  const isScrolled = navbarState.isScrolled;
  const [isNearTop, setIsNearTop] = useState(true);

  // For absolute parallax parity in the hero section:
  // The hero text moves with a parallax depth of [0, 800] -> [0, 120].
  // Net visual movement is [0, 800] -> [0, -680].
  // By mapping the navbar to this exact ratio, it visually anchors to the text layer!
  const mappedY = useTransform(scrollY, [0, 800], [0, -680]);

  // Smooth-scroll to a hash target and update the active state.
  const scrollToSection = useCallback((href) => {
    if (!href || !href.startsWith("#")) return false;
    const ok = scrollSectionUtil(href, NAV_HEIGHT);
    if (ok) setActiveSection(href);
    return ok;
  }, []);

  // Track if we are near the top to prevent animation jitter 
  // when switching from absolute to fixed position
  useEffect(() => {
    const handleScroll = () => {
      setIsNearTop(window.scrollY < NAV_HEIGHT * 2);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Active-section detection — picks the section whose VERTICAL RANGE
  // currently contains the scroll position. Works regardless of nav-link
  // order vs. DOM order.
  useEffect(() => {
    const handleScroll = () => {
      if (!isHome) {
        setActiveSection("");
        return;
      }

      const scrollPos = window.scrollY + DETECTION_OFFSET;
      let current = "";
      for (const link of navLinks) {
        const section = document.querySelector(link.href);
        if (!section) continue;
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        if (scrollPos >= top && scrollPos < bottom) {
          current = link.href;
          break;
        }
      }
      // If past the last detected section (footer area), keep the last one active.
      if (!current && window.scrollY > 0) {
        let lastMatch = "";
        for (const link of navLinks) {
          const section = document.querySelector(link.href);
          if (!section) continue;
          if (window.scrollY + DETECTION_OFFSET >= section.offsetTop) {
            lastMatch = link.href;
          }
        }
        current = lastMatch;
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [navLinks, isHome]);

  // After navigating home with a pending hash target, smooth-scroll to it
  // once the section has mounted (handles cross-page nav).
  useEffect(() => {
    if (!isHome) return;
    const target = pendingScrollRef.current;
    if (!target) return;

    let cancelled = false;
    const tryScroll = (attempt = 0) => {
      if (cancelled) return;
      const ok = scrollToSection(target);
      if (ok || attempt > 10) {
        pendingScrollRef.current = null;
        return;
      }
      setTimeout(() => tryScroll(attempt + 1), 80);
    };
    requestAnimationFrame(() => tryScroll());
    return () => {
      cancelled = true;
    };
  }, [isHome, location.pathname, location.key, scrollToSection]);

  // Body scroll lock for mobile menu
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu on route change (in case it stays open through navigation)
  useEffect(() => {
    const id = setTimeout(() => setIsMobileMenuOpen(false), 0);
    return () => clearTimeout(id);
  }, [location.pathname]);

  const handleNavClick = (e, href) => {
    if (!href || !href.startsWith("#")) return;
    e.preventDefault();
    setIsMobileMenuOpen(false);

    if (isHome) {
      scrollToSection(href);
    } else {
      // Cross-page hash navigation — store target and route home.
      pendingScrollRef.current = href;
      navigate("/");
    }
  };

  const handleBrandNavigate = useCallback(() => {
    setIsMobileMenuOpen(false);
    setActiveSection("");
  }, []);

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <motion.nav
        style={{ y: isNearTop && !isMobileMenuOpen ? mappedY : undefined }}
        initial={false}
        animate={isNearTop && !isMobileMenuOpen ? {} : {
          y: isVisible ? 0 : -NAV_HEIGHT,
          opacity: isVisible ? 1 : 0
        }}
        transition={{
          duration: 0.4,
          ease: "easeOut"
        }}
        className={`fixed left-0 top-0 z-50 w-full border-b transition-all duration-300 will-change-transform ${isTrackDetailPage && !isDarkTheme
          ? "border-border bg-white shadow-[0_1px_0_rgba(255,255,255,0.9),0_6px_18px_rgba(0,0,0,0.06)] backdrop-blur-0"
          : isScrolled
            ? isTrackDetailPage
              ? "border-border bg-surface shadow-sm backdrop-blur-0"
              : "border-border bg-surface shadow-sm backdrop-blur-0"
            : "border-transparent bg-transparent shadow-none backdrop-blur-0"} ${isVisible || isNearTop ? "pointer-events-auto" : "pointer-events-none"}`}
        aria-hidden={!isVisible && !isNearTop}
      >
        <div className="mx-auto flex h-[68px] w-full max-w-[1320px] items-center justify-between px-5 sm:px-6 lg:px-8">
          <BrandMark
            logoText={logoText}
            size="sm"
            onNavigate={handleBrandNavigate}
          />

          {/* Center nav */}
          <div className="hidden items-center gap-0.5 md:flex">
            {navLinks.map((link) => {
              const isActive = isHome && activeSection === link.href;
              const targetHref = isHome ? link.href : `/${link.href}`;
              return (
                <a
                  key={link.label}
                  href={targetHref}
                  onClick={(e) => handleNavClick(e, link.href)}
                  aria-current={isActive ? "page" : undefined}
                  className={`relative rounded-md px-3 py-1.5 text-[14px] font-medium transition-all duration-200 ${isActive
                    ? "bg-primary-soft text-primary"
                    : "text-text/85 hover:bg-surface hover:text-text"
                    }`}
                >
                  {link.label}
                </a>
              );
            })}
          </div>

          {/* Right cluster */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            {showAuthButtons ? (
              <div className="hidden items-center gap-2 lg:flex">
                <span aria-hidden className="h-5 w-px bg-border" />
                <Button to="/login" variant="ghost" size="sm">
                  Log in
                </Button>
                <Button
                  to="/signup"
                  variant="primary"
                  size="sm"
                  className="!rounded-[18px] !bg-[#215cff] !px-5 !text-white !shadow-[0_12px_28px_rgba(33,92,255,0.30)] hover:!bg-[#4b79ff]"
                  rightIcon={<ArrowRight size={13} />}
                >
                  Get started
                </Button>
              </div>
            ) : null}

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((v) => !v)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface text-text md:hidden"
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Scroll progress bar */}
        <motion.div
          aria-hidden
          style={{ scaleX: scrollYProgress }}
          className="absolute bottom-0 left-0 h-[2px] w-full origin-left bg-gradient-to-r from-primary via-accent to-primary"
        />
      </motion.nav>

      <div
        id="mobile-menu"
        className={`fixed inset-x-0 top-[68px] z-40 origin-top border-b ${isTrackDetailPage && !isDarkTheme ? "border-border bg-white backdrop-blur-0" : "border-border bg-surface backdrop-blur-0"} px-5 pb-6 pt-3 transition-all duration-200 md:hidden ${isMobileMenuOpen
          ? "translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-2 opacity-0"
          }`}
      >
        <div className="flex flex-col gap-1">
          {navLinks.map((link) => {
            const isActive = isHome && activeSection === link.href;
            const targetHref = isHome ? link.href : `/${link.href}`;
            return (
              <a
                key={link.label}
                href={targetHref}
                onClick={(e) => handleNavClick(e, link.href)}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center justify-between rounded-lg px-4 py-3 text-[15px] font-medium transition ${isActive
                  ? "bg-primary-soft text-primary"
                  : "text-text hover:bg-surface"
                  }`}
              >
                {link.label}
              </a>
            );
          })}
        </div>

        {showAuthButtons ? (
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button
              to="/login"
              variant="outline"
              size="md"
              fullWidth
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Log in
            </Button>
            <Button
              to="/signup"
              variant="primary"
              size="md"
              fullWidth
              onClick={() => setIsMobileMenuOpen(false)}
              className="!rounded-[18px] !bg-[#215cff] !text-white !shadow-[0_12px_28px_rgba(33,92,255,0.30)] hover:!bg-[#4b79ff]"
            >
              Get started
            </Button>
          </div>
        ) : null}
      </div>
    </>
  );
}
