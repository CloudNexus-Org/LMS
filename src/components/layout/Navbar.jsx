import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

import ThemeToggle from "../ui/ThemeToggle";
import cnlg from "../../assets/Cnlogo.png";
import cnlg1 from "../../assets/cnlogo1.png";

import useSmartNavbar from "../../hooks/useSmartNavbar";
import useIsDarkTheme from "../../hooks/useIsDarkTheme";
import { scrollToSection as scrollSectionUtil } from "../../utils/scroll";

const DEFAULT_LINKS = [
  { label: "Explore", href: "#how-it-works" },
  { label: "Courses", href: "#courses" },
  { label: "Mentors", href: "#mentors" },

  { label: "Contact", href: "#contact" },
];

const NAV_HEIGHT = 82;

export default function Navbar({
  logoText = "CLOUD NEXUS",
  navLinks = DEFAULT_LINKS,
  showAuthButtons = true,
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] =
    useState(false);

  const [activeSection, setActiveSection] =
    useState("");

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

  const isVisible = isMobileMenuOpen
    ? true
    : navbarState.isVisible;

  // SCROLL TO SECTION
  const scrollToSection = useCallback((href) => {
    if (!href?.startsWith("#")) return false;

    const ok = scrollSectionUtil(
      href,
      NAV_HEIGHT
    );

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
        const section = document.querySelector(
          link.href
        );

        if (!section) continue;

        const top = section.offsetTop;

        const bottom =
          top + section.offsetHeight;

        if (
          scrollPos >= top &&
          scrollPos < bottom
        ) {
          current = link.href;
          break;
        }
      }

      setActiveSection(current);
    };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    handleScroll();

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
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
  }, [
    isHome,
    location.pathname,
    scrollToSection,
  ]);

  // BODY LOCK
  useEffect(() => {
    document.body.style.overflow =
      isMobileMenuOpen ? "hidden" : "";

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

  const bgColor = isDarkTheme
    ? "#000000"
    : "#ffffff";

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
        className="
          fixed left-0 top-0 z-50 w-full
          border-b border-transparent
          shadow-none
          transition-all duration-500
        "
      >
        {/* BACKGROUND */}
        <div
          className="
            pointer-events-none
            absolute inset-0 -z-10
          "
          style={{
            backgroundColor: bgColor,

            clipPath:
              window.innerWidth < 1024
                ? "polygon(0 0,100% 0,100% 81px,0 81px)"
                : "polygon(0 0, 100% 0, 100% 81px, 83% 81px, 78.6% 56px, 21.4% 56px, 17% 81px, 0 81px)",
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
            px-4 sm:px-5 lg:px-[10px]
          "
        >
          {/* LOGO */}
          <Link
            to="/"
            onClick={() => {
              setActiveSection("");
              setIsMobileMenuOpen(false);
            }}
            className="flex items-center gap-3"
          >
            <img
              src={isDarkTheme ? cnlg : cnlg1}
              alt="Cloud Nexus Logo"
              className="
                h-[48px]
                w-[48px]
                object-contain
              "
            />

            <h1
              className={`
    text-[20px]
    font-extrabold
    tracking-tight

    ${isDarkTheme
                  ? "text-white"
                  : "text-black"
                }
  `}
            >
              CLOUD NEXUS
            </h1>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden items-center gap-5 lg:flex lg:gap-8">
            {navLinks.map((link) => {
              const isActive =
                isHome &&
                activeSection === link.href;

              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) =>
                    handleNavClick(
                      e,
                      link.href
                    )
                  }
                  className={`
                    relative pb-3
                    text-[13px]
                    font-semibold
                    transition-all duration-300

                    ${isActive
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
          <div className="flex items-center gap-3">
            <ThemeToggle />

            {/* DESKTOP BUTTONS */}
            {showAuthButtons && (
              <div className="hidden items-center gap-3 lg:flex">
                {/* LOGIN */}
                <Link
                  to="/login"
                  className="
                    relative
                    inline-flex h-[40px]
                    min-w-[90px]
                    items-center justify-center
                    overflow-hidden
                    border border-[#d9e2ff]
                    dark:border-white/10
                    bg-white
                    dark:bg-primary
                    px-6
                    text-[14px]
                    font-semibold
                    text-black
                    dark:text-white
                    shadow-[0_10px_30px_rgba(37,99,235,0.08)]
                    dark:shadow-[0_10px_30px_rgba(0,0,0,0.4)]
                    transition-all duration-300
                    hover:-translate-y-[2px]
                    hover:border-[#2563ff]/40
                    [clip-path:polygon(12px_0,100%_0,100%_calc(100%-12px),calc(100%-12px)_100%,0_100%,0_12px)]
                  "
                >
                  Log in
                </Link>

                {/* SIGNUP */}
                <Link
                  to="/signup"
                  className="
                    relative
                    inline-flex h-[40px]
                    min-w-[90px]
                    items-center justify-center
                    overflow-hidden
                    border border-[#d9e2ff]
                    dark:border-white/10
                    bg-white
                    dark:bg-primary
                    px-6
                    text-[14px]
                    font-semibold
                    text-black
                    dark:text-white
                    shadow-[0_10px_30px_rgba(37,99,235,0.08)]
                    dark:shadow-[0_10px_30px_rgba(0,0,0,0.4)]
                    transition-all duration-300
                    hover:-translate-y-[2px]
                    hover:border-[#2563ff]/40
                    [clip-path:polygon(12px_0,100%_0,100%_calc(100%-12px),calc(100%-12px)_100%,0_100%,0_12px)]
                  "
                >
                  Signup
                </Link>
              </div>
            )}

            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() =>
                setIsMobileMenuOpen((v) => !v)
              }
              className="
                z-20
                flex h-10 w-10
                items-center justify-center
                rounded-[8px]
                border border-border
                text-text
                transition-all duration-300
                hover:border-primary/30
                hover:bg-primary/5
                lg:hidden
              "
              style={{
                backgroundColor: bgColor,
              }}
            >
              {isMobileMenuOpen ? (
                <X size={18} />
              ) : (
                <Menu size={18} />
              )}
            </button>
          </div>
        </div>
      </motion.nav>
    </>
  );
}