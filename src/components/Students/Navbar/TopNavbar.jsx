import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import ThemeToggle from "../../ui/ThemeToggle";

const StudentNavbar = ({ onMenuClick }) => {
  const navigate = useNavigate();

  return (
    <header
      className="
        fixed top-0 left-0 right-0
        lg:left-72

        z-40

        flex h-16 sm:h-20
        items-center justify-between

        border-b border-border

        bg-elevated/80
        backdrop-blur-xl

        px-4 sm:px-6 lg:px-12
      "
    >
      {/* LEFT */}
      <div className="flex items-center gap-4 sm:gap-8">
        {/* MOBILE MENU */}
        <button
          onClick={onMenuClick}
          className="
            text-text
            transition-colors
            hover:text-primary
            lg:hidden
          "
        >
          <span className="material-symbols-outlined">
            menu
          </span>
        </button>

        {/* LOGO */}
        <Link
          to="/dashboard"
          className="
            text-xl font-bold
            tracking-tight

            text-primary

            sm:text-2xl
          "
        >
          Cloud Nexus
        </Link>

        {/* NAV LINKS */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLink
            to="/academy"
            className={({ isActive }) =>
              `
                text-[15px]
                font-medium
                transition-colors duration-300

                ${
                  isActive
                    ? "text-primary"
                    : "text-muted hover:text-text"
                }
              `
            }
          >
            Academy
          </NavLink>

          <NavLink
            to="/mentors"
            className={({ isActive }) =>
              `
                text-[15px]
                font-medium
                transition-colors duration-300

                ${
                  isActive
                    ? "text-primary"
                    : "text-muted hover:text-text"
                }
              `
            }
          >
            Mentors
          </NavLink>

          <NavLink
            to="/blog"
            className={({ isActive }) =>
              `
                text-[15px]
                font-medium
                transition-colors duration-300

                ${
                  isActive
                    ? "text-primary"
                    : "text-muted hover:text-text"
                }
              `
            }
          >
            Blog
          </NavLink>
        </nav>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* THEME TOGGLE */}
        <ThemeToggle />
        {/* BOOK ICON */}
        <button
          className="
            hidden sm:flex

            text-muted
            transition-colors duration-300

            hover:text-text
          "
        >
          <span className="material-symbols-outlined">
            menu_book
          </span>
        </button>

        {/* NOTIFICATION */}
        <button
          onClick={() => navigate("/mentor-dashboard")}
          className="
            relative

            text-muted
            transition-colors duration-300

            hover:text-text
          "
        >
          <span className="material-symbols-outlined">
            notifications
          </span>

          {/* DOT */}
          <span
            className="
              absolute right-0 top-0
              h-2 w-2 rounded-full
              bg-primary
            "
          />
        </button>

        {/* PROFILE */}
        <Link to="/profile">
          <div
            className="
              h-9 w-9 sm:h-10 sm:w-10

              overflow-hidden rounded-full

              border border-border

              transition-all duration-300
              hover:scale-105
              hover:border-primary/40
            "
          >
            <img
              src="https://i.pravatar.cc/100"
              className="h-full w-full object-cover"
              alt="profile"
            />
          </div>
        </Link>
      </div>
    </header>
  );
};

export default StudentNavbar;