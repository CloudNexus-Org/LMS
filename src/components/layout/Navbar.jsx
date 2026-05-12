import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, useScroll } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import ThemeToggle from "../ui/ThemeToggle";
import Button from "../ui/Button";
import BrandMark from "../ui/BrandMark";
import useScrollThreshold from "../../hooks/useScrollThreshold";
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
const SCROLLED_THRESHOLD = 8;

export default function Navbar({
  logoText = "CLOUD NEXUS",
  navLinks = DEFAULT_LINKS,
  showAuthButtons = true,
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const isScrolled = useScrollThreshold(SCROLLED_THRESHOLD);
  const pendingScrollRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";
  const { scrollYProgress } = useScroll();

  // Smooth-scroll to a hash target and update the active state.
  const scrollToSection = useCallback((href) => {
    if (!href || !href.startsWith("#")) return false;
    const ok = scrollSectionUtil(href, NAV_HEIGHT);
    if (ok) setActiveSection(href);
    return ok;
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
    setIsMobileMenuOpen(false);
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

      <nav
        className={`fixed left-0 top-0 z-50 w-full transition-colors duration-200 ${
          isScrolled
            ? "border-b border-border bg-bg/85 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        }`}
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
                  className={`relative rounded-md px-3 py-1.5 text-[13px] font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-primary-soft text-primary"
                      : "text-muted hover:bg-surface hover:text-text"
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
                  rightIcon={<ArrowRight size={13} />}
                  className="transition-transform duration-200 hover:scale-[1.03]"
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
      </nav>

      <div
        id="mobile-menu"
        className={`fixed inset-x-0 top-[68px] z-40 origin-top border-b border-border bg-bg/95 px-5 pb-6 pt-3 backdrop-blur-2xl transition-all duration-200 md:hidden ${
          isMobileMenuOpen
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
                className={`flex items-center justify-between rounded-lg px-4 py-3 text-[15px] font-medium transition ${
                  isActive
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
            >
              Get started
            </Button>
          </div>
        ) : null}
      </div>
    </>
  );
}
