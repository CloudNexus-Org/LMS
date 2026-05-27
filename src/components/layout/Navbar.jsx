import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ChevronDown,
} from "lucide-react";

import ThemeToggle from "../ui/ThemeToggle";

import cnlg from "../../assets/navbar/white.png";
import cnlg1 from "../../assets/navbar/Blac.png";

import useSmartNavbar from "../../hooks/useSmartNavbar";
import useIsDarkTheme from "../../hooks/useIsDarkTheme";

import { scrollToSection as scrollSectionUtil } from "../../utils/scroll";

const DEFAULT_LINKS = [
  {
    label: "Explore",
    href: "#how-it-works",
  },
  {
    label: "Courses",
    href: "#courses",
  },
  {
    label: "Mentors",
    href: "#mentors",
  },
  {
    label: "Contact",
    href: "#contact",
  },
];

const NAV_HEIGHT = 82;

export default function Navbar({
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

  const isHome =
    location.pathname === "/";

  const navbarState = useSmartNavbar({
    threshold: 14,
    topGuard: 80,
    stopDelay: 150,
  });

  const isVisible = isMobileMenuOpen
    ? true
    : navbarState.isVisible;

  // SCROLL TO SECTION
  const scrollToSection = useCallback(
    (href) => {
      if (!href?.startsWith("#"))
        return false;

      const ok = scrollSectionUtil(
        href,
        NAV_HEIGHT
      );

      if (ok) {
        setActiveSection(href);
      }

      return ok;
    },
    []
  );

  // ACTIVE SECTION
  useEffect(() => {
    const handleScroll = () => {
      if (!isHome) {
        setActiveSection("");

        return;
      }

      const scrollPos =
        window.scrollY + 120;

      let current = "";

      for (const link of navLinks) {
        const section =
          document.querySelector(
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

    const target =
      pendingScrollRef.current;

    if (!target) return;

    requestAnimationFrame(() => {
      scrollToSection(target);

      pendingScrollRef.current =
        null;
    });
  }, [
    isHome,
    location.pathname,
    scrollToSection,
  ]);

  // BODY LOCK
  useEffect(() => {
    document.body.style.overflow =
      isMobileMenuOpen
        ? "hidden"
        : "";

    return () => {
      document.body.style.overflow =
        "";
    };
  }, [isMobileMenuOpen]);

  const handleNavClick = (
    e,
    href
  ) => {
    e.preventDefault();

    setIsMobileMenuOpen(false);

    if (isHome) {
      scrollToSection(href);
    } else {
      pendingScrollRef.current =
        href;

      navigate("/");
    }
  };

  const bgColor = isDarkTheme
    ? "#050816"
    : "#ffffff";

  return (
    <>
      <motion.nav
        initial={false}
        animate={{
          y: isVisible
            ? "0%"
            : "-100%",
          opacity: isVisible ? 1 : 0,
        }}
        transition={{
          duration: 0.4,
          ease: "easeOut",
        }}
        className="
          fixed
          left-0
          top-0
          z-50
          w-full
          border-b
          border-transparent
          transition-all
          duration-500
        "
      >
        {/* BACKGROUND */}
        <div
         className="
  pointer-events-none
  absolute
  inset-0
  -z-10
  overflow-hidden
"
          style={{
            backgroundColor: bgColor,

            clipPath:
  window.innerWidth < 1024
    ? isMobileMenuOpen
      ? "polygon(0 0,100% 0,100% 100%,0 100%)"
      : "polygon(0 0, 100% 0, 100% 81px, 83% 81px, 78.6% 56px, 21.4% 56px, 17% 81px, 0 81px)"
                : "polygon(0 0, 100% 0, 100% 81px, 83% 81px, 78.6% 56px, 21.4% 56px, 17% 81px, 0 81px)",
          }}
        />

        {/* MAIN */}
        <div
          className="
            relative
            z-10
            mx-auto
            flex
            h-[82px]
            w-full
            max-w-[1440px]
            items-center
            justify-between
            px-4
            sm:px-5
            lg:px-[24px]
          "
        >
          {/* LOGO */}
<Link
  to="/"
  onClick={() => {
    setActiveSection("");
    setIsMobileMenuOpen(false);
  }}
  className="
    flex
    items-center
    shrink-0
  "
>
  <img
    src={isDarkTheme ? cnlg : cnlg1}
    alt="Cloud Nexus Logo"
    className="
      h-[42px]
      w-auto
      sm:h-[52px]
      lg:h-[58px]
      object-contain
    "
  />
</Link>

          {/* DESKTOP NAV */}
          <div
            className="
              hidden
              lg:flex
              items-center
              gap-8
            "
          >
            {navLinks.map((link) => {
              const isActive =
                isHome &&
                activeSection ===
                  link.href;

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
                    relative
                    pb-2
                    text-[14px]
                    font-semibold
                    transition-all
                    duration-300

                    ${
                      isActive
                        ? `
                          text-primary
                        `
                        : `
                          text-muted
                          dark:text-muted
                          hover:text-primary
                        `
                    }
                  `}
                >
                  {link.label}

                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="
                        absolute
                        bottom-0
                        left-0
                        h-[2px]
                        w-full
                        bg-primary
                      "
                    />
                  )}
                </a>
              );
            })}
          </div>

          {/* RIGHT */}
          <div
           className="
  flex
  items-center
  gap-2
  sm:gap-3
  mr-1
  sm:mr-2
  lg:mr-0
"
          >
            <ThemeToggle />

            {/* DESKTOP BUTTONS */}
            {showAuthButtons && (
              <div
                className="
                  hidden
                  lg:flex
                  items-center
                  gap-3
                "
              >
                {/* LOGIN */}
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
                    border
                    border-border
                    bg-primary
                    px-6
                    text-[14px]
                    font-semibold
                    text-white
                    shadow-[0_10px_30px_rgba(37,99,235,0.08)]
                    transition-all
                    duration-300
                    hover:-translate-y-[2px]
                    hover:border-primary/40
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
                    inline-flex
                    h-[40px]
                    min-w-[90px]
                    items-center
                    justify-center
                    overflow-hidden
                    border
                    border-primary
                    bg-primary
                    px-6
                    text-[14px]
                    font-semibold
                    text-white
                    shadow-[0_10px_30px_rgba(37,99,235,0.12)]
                    transition-all
                    duration-300
                    hover:-translate-y-[2px]
                    hover:shadow-lg
                    hover:shadow-primary/30
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
                setIsMobileMenuOpen(
                  (v) => !v
                )
              }
              className="
                z-50
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-[10px]
                border
                border-border
                transition-all
                duration-300
                hover:border-primary/30
                hover:bg-primary/5
                lg:hidden
              "
              style={{
                backgroundColor:
                  bgColor,

                color: isDarkTheme
                  ? "#ffffff"
                  : "#000000",
              }}
            >
              {isMobileMenuOpen ? (
                <X size={20} />
              ) : (
                <Menu size={20} />
              )}
            </button>
          </div>
        </div>

        {/* MOBILE DROPDOWN */}
<AnimatePresence>
  {isMobileMenuOpen && (
    <motion.div
      initial={{
        opacity: 0,
        y: -18,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        y: -18,
      }}
      transition={{
        duration: 0.3,
      }}
      className="lg:hidden absolute top-[82px] left-0 w-full z-40"
    >
      {/* MAIN DESIGN */}
      <div
        className={`
          relative
          overflow-hidden
          border-t
          backdrop-blur-2xl

          ${
            isDarkTheme
              ? `
                border-white/10
                bg-[#050816]/98
              `
              : `
                border-black/10
                bg-white/98
              `
          }
        `}
        style={{
          clipPath:
            "polygon(0 0,100% 0,100% calc(100% - 28px),86% calc(100% - 28px),82% 100%,18% 100%,14% calc(100% - 28px),0 calc(100% - 28px))",
        }}
      >
        {/* TOP LIGHT LINE */}
        <div
          className="
            absolute
            top-0
            left-0
            h-[1px]
            w-full
            bg-gradient-to-r
            from-transparent
            via-primary
            to-transparent
            opacity-80
          "
        />

        {/* CONTENT */}
        <div className="px-5 pt-6 pb-10">
          {/* NAVIGATION */}
          <div className="flex flex-col gap-3">
            {navLinks.map((link, index) => {
              const isActive =
                activeSection === link.href;

              return (
                <motion.a
                  key={link.label}
                  href={link.href}
                  initial={{
                    opacity: 0,
                    x: -20,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    delay: index * 0.05,
                  }}
                  onClick={(e) =>
                    handleNavClick(
                      e,
                      link.href
                    )
                  }
                  className={`
                    relative
                    flex
                    items-center
                    justify-between
                    overflow-hidden
                    border
                    px-5
                    py-4
                    text-[15px]
                    font-semibold
                    transition-all
                    duration-300

                    ${
                      isDarkTheme
                        ? `
                          border-white/10
                          bg-white/[0.03]
                          text-white
                        `
                        : `
                          border-black/10
                          bg-black/[0.02]
                          text-black
                        `
                    }

                    ${
                      isActive
                        ? `
                          border-primary
                          text-primary
                          shadow-[0_0_20px_rgba(37,99,235,0.25)]
                        `
                        : ""
                    }
                  `}
                  style={{
                    clipPath:
                      "polygon(0 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%,0 12px)",
                  }}
                >
                  <span>{link.label}</span>

                  <ChevronDown
                    size={16}
                    className="
                      transition-transform
                      duration-300
                      group-hover:rotate-180
                    "
                  />
                </motion.a>
              );
            })}
          </div>

          {/* BUTTONS */}
          {showAuthButtons && (
            <div className="mt-6 flex flex-col gap-3">
              {/* LOGIN */}
              <Link
                to="/login"
                onClick={() =>
                  setIsMobileMenuOpen(false)
                }
                className={`
  relative
  flex
  h-[50px]
  items-center
  justify-center
  overflow-hidden
  border
  text-[14px]
  font-semibold
  transition-all
  duration-300

  ${
    isDarkTheme
      ? `
        border-white/10
        bg-white/[0.04]
        text-white
      `
      : `
        border-black/10
        bg-white
        text-black
      `
  }
`}
                style={{
  clipPath:
    "polygon(12px 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%,0 12px)",
}}
              >
                Log in
              </Link>

              {/* SIGNUP */}
              <Link
                to="/signup"
                onClick={() =>
                  setIsMobileMenuOpen(false)
                }
                className="
  relative
  flex
  h-[50px]
  items-center
  justify-center
  overflow-hidden
  bg-primary
  text-[14px]
  font-semibold
  text-white
  transition-all
  duration-300
  shadow-[0_10px_30px_rgba(37,99,235,0.18)]
"
                style={{
  clipPath:
    "polygon(12px 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%,0 12px)",
}}
              >
                Signup
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
