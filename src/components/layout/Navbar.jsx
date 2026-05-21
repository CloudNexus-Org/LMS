import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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

const NAV_HEIGHT = 82;

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
  const isDarkTheme = useIsDarkTheme();

  const isHome = location.pathname === "/";

  const navbarState = useSmartNavbar({
    threshold: 14,
    topGuard: 80,
    stopDelay: 150,
  });

  const isVisible = isMobileMenuOpen ? true : navbarState.isVisible;
  const isScrolled = navbarState.isScrolled;

  // SCROLL TO SECTION
  const scrollToSection = useCallback((href) => {
    if (!href?.startsWith("#")) return false;

    const ok = scrollSectionUtil(href, NAV_HEIGHT);

    if (ok) {
      setActiveSection(href);
    }

    return ok;
  }, []);

  // ACTIVE SECTION
  useEffect(() => {
    const handleScroll = () => {
      if (!isHome) {
        setActiveSection("");
        return;
      }

      const scrollPos = window.scrollY + 120;
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

      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome, navLinks]);

  // PENDING HASH
  useEffect(() => {
    if (!isHome) return;

    const target = pendingScrollRef.current;

    if (!target) return;

    requestAnimationFrame(() => {
      scrollToSection(target);
      pendingScrollRef.current = null;
    });
  }, [isHome, location.pathname, scrollToSection]);

  // BODY LOCK
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const handleNavClick = (e, href) => {
    e.preventDefault();

    setIsMobileMenuOpen(false);

    if (isHome) {
      scrollToSection(href);
    } else {
      pendingScrollRef.current = href;
      navigate("/");
    }
  };

  const bgColor = isDarkTheme ? "#000000" : "#ffffff";

  return (
    <>
      <motion.nav
        initial={false}
        animate={{
          y: isVisible ? "0%" : "-100%",
          opacity: isVisible ? 1 : 0,
        }}
        transition={{
          duration: 0.4,
          ease: "easeOut",
        }}
        className={`
          fixed left-0 top-0 z-50 w-full
          border-b
          transition-all duration-500
          border-transparent
          shadow-none
        `}
      >
        {/* NEW CLIPPED BACKGROUND FOR LINES DESIGN */}
        <div
          className="absolute inset-0 -z-10 pointer-events-none"
          style={{
            backgroundColor: bgColor,
            clipPath:
              "polygon(0 0, 100% 0, 100% 81px, 83% 81px, 78.6% 56px, 21.4% 56px, 17% 81px, 0 81px)",
          }}
        />

        {/* MAIN */}
        <div
          className="
            relative z-10
            mx-auto
            flex h-[82px]
            w-full max-w-[1440px]
            items-center justify-between
            px-1 sm:px-2 lg:px-[10px]
          "
        >
          {/* LOGO */}
          <BrandMark
            logoText={logoText}
            size="sm"
            onNavigate={() => {
              setActiveSection("");
              setIsMobileMenuOpen(false);
            }}
          />

          {/* CENTER NAV */}
          <div className="hidden items-center gap-5 md:flex lg:gap-8">
            {navLinks.map((link) => {
              const isActive = isHome && activeSection === link.href;

              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`
                    relative pb-3
                    text-[13px]
                    font-semibold
                    transition-all duration-300
                    ${
                      isActive
                        ? `
                        text-text
                        dark:text-text
                      `
                        : `
                        text-muted
                        dark:text-muted
                        hover:text-text
                        dark:hover:text-text
                      `
                    }
                  `}
                >
                  {link.label}
                </a>
              );
            })}
          </div>

          {/* RIGHT */}
          <div className=" flex items-center gap-3 -mt-1 -mr-16">
            <ThemeToggle />

            {showAuthButtons && (
              <div className="hidden items-center gap-3 lg:flex ">
                <Link
                  to="/login"
                  className="
                    relative
                    inline-flex
                    h-[40px]
                    min-w-[90px]
                    items-center
                    justify-center
                    overflow-hidden
                    border border-[#d9e2ff]
                    dark:border-white/10
                    bg-white
                    dark:bg-[#215cff]
                    px-6
                    text-[14px]
                    font-semibold
                    text-black
                    dark:text-white
                    shadow-[0_10px_30px_rgba(37,99,235,0.08)]
                    dark:shadow-[0_10px_30px_rgba(0,0,0,0.4)]
                    transition-all
                    duration-300
                    hover:-translate-y-[2px]
                    hover:border-[#2563ff]/40
                    [clip-path:polygon(12px_0,100%_0,100%_calc(100%-12px),calc(100%-12px)_100%,0_100%,0_12px)]
                  "
                >
                  <span className="relative z-10 block">Log in</span>
                </Link>

                {/* SIGNUP */}
                <Link
                  to="/signup"
                  className="
                    relative
                    inline-flex
                    h-[40px]
                    min-w-[90px]
                    items-center
                    justify-center
                    overflow-hidden
                    border border-[#d9e2ff]
                    dark:border-white/10
                    bg-white
                    dark:bg-[#2563ff]
                    px-6
                    text-[14px]
                    font-semibold
                    text-black
                    dark:text-white
                    shadow-[0_10px_30px_rgba(37,99,235,0.08)]
                    dark:shadow-[0_10px_30px_rgba(0,0,0,0.4)]
                    transition-all
                    duration-300
                    hover:-translate-y-[2px]
                    hover:border-[#2563ff]/40
                    [clip-path:polygon(12px_0,100%_0,100%_calc(100%-12px),calc(100%-12px)_100%,0_100%,0_12px)]
                  "
                >
                  <span className="relative z-10 block">Signup</span>
                </Link>
              </div>
            )}

            {/* MOBILE */}
            <button
              onClick={() => setIsMobileMenuOpen((v) => !v)}
              className="
                z-20
                flex h-10 w-10
                items-center justify-center
                border
                border-border
                text-text
                md:hidden
              "
              style={{
                backgroundColor: bgColor,
              }}
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* BOTTOM LINES */}

        {/* LEFT */}
        <div
          className="
            pointer-events-none
            absolute left-0 top-[81px]
            h-[1.5px]
            w-[17%]
            bg-[#cbd5e1]
            dark:bg-[#626161d7]
            opacity-90
            dark:opacity-100
          "
        />

        {/* LEFT CURVE */}
        <div
          className="
            pointer-events-none
            absolute left-[17%] top-[81px]
            h-[1.5px]
            w-[72px]
            origin-left rotate-[-20deg]
            bg-[#cbd5e1]
            dark:bg-[#3d5a96]
            opacity-90
            dark:opacity-100
          "
        />

        {/* CENTER */}
        <div
          className="
            pointer-events-none
            absolute left-[21%] top-[56px]
            h-[1.5px]
            w-[58%]
            bg-[#cbd5e1]
            dark:bg-[#29406d]
            opacity-90
            dark:opacity-100
          "
        />

        {/* RIGHT CURVE */}
        <div
          className="
            pointer-events-none
            absolute right-[17%] top-[81px]
            h-[1.5px]
            w-[72px]
            origin-right rotate-[20deg]
            bg-[#cbd5e1]
            dark:bg-[#3d5a96]
            opacity-90
            dark:opacity-100
          "
        />

        {/* RIGHT */}
        <div
          className="
            pointer-events-none
            absolute right-0 top-[81px]
            h-[1.5px]
            w-[17%]
            bg-[#cbd5e1]
            dark:bg-[#2f4675]
            opacity-90
            dark:opacity-100
          "
        />
      </motion.nav>

      {/* MOBILE MENU */}
      <div
        className={`
          fixed left-0 top-[82px]
          z-40
          h-[calc(100vh-82px)]
          w-full
          px-5 py-6
          transition-all duration-300
          md:hidden
          ${
            isMobileMenuOpen
              ? `
              translate-x-0
              opacity-100
            `
              : `
              pointer-events-none
              translate-x-full
              opacity-0
            `
          }
        `}
        style={{
          backgroundColor: bgColor,
        }}
      >
        <div className="flex flex-col gap-2">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href;

            return (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`
                  relative
                  border
                  px-4 py-4
                  text-[15px]
                  font-semibold
                  transition
                  ${
                    isActive
                      ? `
                      border-[#2563ff]/20
                      bg-[#2563ff]/10
                      text-[#2563ff]
                    `
                      : `
                      border-border
                      bg-surface
                      text-text
                    `
                  }
                `}
              >
                {link.label}
              </a>
            );
          })}
        </div>
      </div>
    </>
  );
}