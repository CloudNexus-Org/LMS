import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import StudentNavbar from "./TopNavbar";

const SideNavbar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const sideLinks = [
    {
      to: "/dashboard",
      label: "Curriculum",
      icon: "school",
    },
    {
      to: "/analytics",
      label: "Analytics",
      icon: "monitoring",
    },
    {
      to: "/community",
      label: "Community",
      icon: "groups",
    },
    {
      to: "/settings",
      label: "Settings",
      icon: "settings",
    },
  ];

  return (
    <>
      {/* MOBILE OVERLAY */}
      {isOpen && (
        <div
          onClick={onClose}
          className="
            fixed inset-0 z-40
            bg-black/50
            backdrop-blur-sm
            lg:hidden
          "
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed left-0 top-0 z-50
          flex h-screen w-72 flex-col justify-between

          border-r border-border
          bg-elevated/95
          backdrop-blur-xl

          p-5 sm:p-6

          transition-transform duration-300

          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* TOP */}
        <div>
          {/* LOGO */}
          <div className="mb-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* ICON BOX */}
              <div
                className="
                  flex h-11 w-11 items-center justify-center
                  rounded-xl

                  bg-primary/15
                  text-primary

                  shadow-[0_8px_25px_rgba(59,130,246,0.18)]
                "
              >
                <span className="material-symbols-outlined">
                  school
                </span>
              </div>

              {/* TEXT */}
              <div>
                <h1
                  className="
                    text-lg font-bold
                    text-text
                    sm:text-xl
                  "
                >
                  Learning Path
                </h1>

                <p
                  className="
                    text-xs
                    text-muted
                    sm:text-sm
                  "
                >
                  Career Transitioner
                </p>
              </div>
            </div>

            {/* CLOSE */}
            <button
              onClick={onClose}
              className="
                text-muted
                transition-colors
                hover:text-text
                lg:hidden
              "
            >
              <span className="material-symbols-outlined">
                close
              </span>
            </button>
          </div>

          {/* NAVIGATION */}
          <nav className="space-y-2">
            {sideLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `
                  flex items-center gap-3
                  rounded-xl
                  px-4 py-3

                  transition-all duration-300

                  ${
                    isActive
                      ? `
                        bg-primary/12
                        text-primary
                        shadow-[0_4px_20px_rgba(59,130,246,0.12)]
                      `
                      : `
                        text-muted
                        hover:bg-surface
                        hover:text-text
                      `
                  }
                `
                }
              >
                <span className="material-symbols-outlined">
                  {item.icon}
                </span>

                <span className="font-medium">
                  {item.label}
                </span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* BOTTOM */}
        <div>
          {/* BUTTON */}
          <button
            className="
              w-full rounded-xl
              bg-primary
              py-3

              font-semibold
              text-white

              shadow-[0_10px_30px_rgba(59,130,246,0.25)]

              transition-all duration-300
              hover:translate-y-[-2px]
            "
          >
            View Progress
          </button>

          {/* LINKS */}
          <div className="mt-6 space-y-2">
            <Link
              to="/help-center"
              onClick={onClose}
              className="
                flex items-center gap-3
                rounded-xl
                px-4 py-2

                text-muted

                transition-all duration-300

                hover:bg-surface
                hover:text-text
              "
            >
              <span className="material-symbols-outlined">
                help
              </span>

              Help Center
            </Link>

            <button
              onClick={() => navigate("/login")}
              className="
                flex w-full items-center gap-3
                rounded-xl
                px-4 py-2

                text-muted

                transition-all duration-300

                hover:bg-surface
                hover:text-text
              "
            >
              <span className="material-symbols-outlined">
                logout
              </span>

              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default SideNavbar;