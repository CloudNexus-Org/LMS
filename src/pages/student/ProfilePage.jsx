import { useState } from "react";
import {
  UploadCloud,
  CheckCircle,
  Shield,
  Camera,
  Sparkles,
} from "lucide-react";
import useIsDarkTheme from "../../hooks/useIsDarkTheme";

export default function ProfileSettingsPage() {
  const isDark = useIsDarkTheme();
  const [isSaved, setIsSaved] = useState(false);

  const cardBg = isDark ? "bg-[#0d111d]" : "bg-white";
  const cardBorder = isDark ? "border-white/10" : "border-gray-200";
  const surfaceBg = isDark ? "bg-[#0f172a]" : "bg-gray-50";
  const textPrimary = isDark ? "text-white" : "text-slate-900";
  const textSecondary = isDark ? "text-white/60" : "text-slate-600";
  const inputBg = isDark ? "bg-[#0f172a]" : "bg-gray-50";

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaved(true);

    setTimeout(() => {
      setIsSaved(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-bg text-text px-2 py-2">
      <div className="mx-auto max-w-[1600px]">
        {/* HEADER */}
        <div
          className={`
            relative

            overflow-hidden

            rounded-[6px]

            border
            ${cardBorder}
            ${cardBg}

            px-5
            py-5

            shadow-sm
          `}
        >
          <div
            className="
              absolute
              right-[-120px]
              top-[-120px]

              h-[260px]
              w-[260px]

              rounded-full

              bg-primary/10

              blur-[80px]
            "
          />

          <div
            className="
              relative
              z-10

              flex
              flex-col
              gap-5

              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >
            <div>
              <div
                className="
                  inline-flex
                  items-center
                  gap-2

                  rounded-[5px]

                  border border-primary/20

                  bg-primary/10

                  px-3
                  py-2

                  text-[10px]
                  font-black
                  uppercase
                  tracking-[0.22em]

                  text-primary
                "
              >
                
                Cloud Nexus Profile
              </div>

              <h1
                className={`
                  mt-3

                  text-[42px]
                  sm:text-[48px]

                  font-black

                  leading-[0.95]
                  tracking-[-0.05em]

                  ${textPrimary}
                `}
              >
               General Profile
              </h1>

              <p
                className={`
                  mt-3

                  max-w-[700px]

                  text-[14px]
                  sm:text-[15px]

                  leading-7

                  ${textSecondary}
                `}
              >
                Manage your identity, preferences, account privacy and
                learning experience.
              </p>
            </div>

            <div
              className="
                inline-flex
                items-center
                gap-2

                rounded-[5px]

                border border-green-500/20

                bg-green-500/10

                px-4
                py-3

                text-[11px]
                font-black
                uppercase
                tracking-[0.15em]

                text-green-500
              "
            >
              <Shield className="h-4 w-4" />
              Account Protected
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="mt-4">
          <div
            className={`
              overflow-hidden

              rounded-[6px]

              border
              ${cardBorder}
              ${cardBg}

              shadow-sm

              w-full
            `}
          >
            {/* TOP BAR */}
            <div
              className={`
                flex
                flex-col
                gap-5

                border-b
                ${cardBorder}

                px-5
                py-5

                sm:flex-row
                sm:items-center
                sm:justify-between
              `}
            >
              <div>
                <h2
                  className={`
                    text-[26px]
                    font-black
                    ${textPrimary}
                  `}
                >
                  General Profile
                </h2>

                <p
                  className={`
                    mt-1
                    text-sm
                    ${textSecondary}
                  `}
                >
                  Customize your personal workspace and account settings.
                </p>
              </div>

              <div
                className="
                  inline-flex
                  items-center
                  gap-2

                  rounded-[5px]

                  border border-green-500/20

                  bg-green-500/10

                  px-4
                  py-2

                  text-[11px]
                  font-bold
                  uppercase
                  tracking-[0.15em]

                  text-green-500
                "
              >
                <Shield className="h-4 w-4" />
                Protected
              </div>
            </div>

            {/* FORM */}
            <form
              onSubmit={handleSave}
              className="space-y-5 p-5"
            >
              {/* PROFILE */}
              <div
                className={`
                  flex
                  flex-col
                  gap-5

                  rounded-[6px]

                  border
                  ${cardBorder}

                  ${surfaceBg}

                  p-5

                  lg:flex-row
                  lg:items-center
                  lg:justify-between
                `}
              >
                <div className="flex items-center gap-5">
                  <div className="relative group">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                      alt="avatar"
                      className="
                        h-24
                        w-24

                        rounded-full
                        object-cover

                        border-2 border-primary/20
                      "
                    />

                    <div
                      className="
                        absolute
                        inset-0

                        flex
                        items-center
                        justify-center

                        rounded-full

                        bg-black/40

                        opacity-0
                        transition-opacity

                        group-hover:opacity-100
                      "
                    >
                      <UploadCloud className="h-8 w-8 text-white" />
                    </div>

                    <div
                      className="
                        absolute
                        bottom-0
                        right-0

                        flex
                        h-8
                        w-8

                        items-center
                        justify-center

                        rounded-full

                        bg-primary

                        text-white
                      "
                    >
                      <Camera size={14} />
                    </div>
                  </div>

                  <div>
                    <h3
                      className={`
                        text-xl
                        font-black
                        ${textPrimary}
                      `}
                    >
                      Profile Avatar
                    </h3>

                    <p
                      className={`
                        mt-2
                        text-sm
                        ${textSecondary}
                      `}
                    >
                      JPG, PNG or GIF. Maximum size of 800KB.
                    </p>

                    <button
                      type="button"
                      className="
                        mt-3

                        text-sm
                        font-bold

                        text-primary

                        hover:underline
                      "
                    >
                      Upload New Photo
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  className={`
                    relative
                    inline-flex

                    h-[48px]

                    items-center
                    justify-center

                    overflow-hidden
                    rounded-none

                    border
                    ${cardBorder}

                    ${cardBg}

                    px-6

                    text-sm
                    font-semibold

                    ${textPrimary}

                    transition-all
                    duration-300

                    hover:-translate-y-[2px]

                    [clip-path:polygon(12px_0,100%_0,100%_calc(100%-12px),calc(100%-12px)_100%,0_100%,0_12px)]
                  `}
                >
                  Remove Photo
                </button>
              </div>

              {/* INPUTS */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <label
                    className={`
                      text-sm
                      font-bold
                      ${textPrimary}
                    `}
                  >
                    First Name
                  </label>

                  <input
                    type="text"
                    defaultValue="Alex"
                    className={`
                      h-[54px]
                      w-full

                      rounded-[5px]

                      border
                      ${cardBorder}

                      ${inputBg}

                      px-4

                      text-sm
                      font-medium

                      ${textPrimary}

                      outline-none

                      transition-all

                      focus:border-primary
                    `}
                  />
                </div>

                <div className="space-y-2">
                  <label
                    className={`
                      text-sm
                      font-bold
                      ${textPrimary}
                    `}
                  >
                    Last Name
                  </label>

                  <input
                    type="text"
                    defaultValue="Chen"
                    className={`
                      h-[54px]
                      w-full

                      rounded-[5px]

                      border
                      ${cardBorder}

                      ${inputBg}

                      px-4

                      text-sm
                      font-medium

                      ${textPrimary}

                      outline-none

                      transition-all

                      focus:border-primary
                    `}
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div className="space-y-2">
                <label
                  className={`
                    text-sm
                    font-bold
                    ${textPrimary}
                  `}
                >
                  Email Address
                </label>

                <input
                  type="email"
                  defaultValue="alex.chen@example.com"
                  className={`
                    h-[54px]
                    w-full

                    rounded-[5px]

                    border
                    ${cardBorder}

                    ${inputBg}

                    px-4

                    text-sm
                    font-medium

                    ${textPrimary}

                    outline-none

                    transition-all

                    focus:border-primary
                  `}
                />
              </div>

              {/* BIO */}
              <div className="space-y-2">
                <label
                  className={`
                    text-sm
                    font-bold
                    ${textPrimary}
                  `}
                >
                  Short Bio
                </label>

                <textarea
                  rows="4"
                  defaultValue="Frontend developer learning advanced cloud architecture and scalable system design."
                  className={`
                    w-full

                    resize-none

                    rounded-[5px]

                    border
                    ${cardBorder}

                    ${inputBg}

                    px-4
                    py-4

                    text-sm
                    font-medium

                    ${textPrimary}

                    outline-none

                    transition-all

                    focus:border-primary
                  `}
                />
              </div>

              {/* FOOTER */}
              <div
                className={`
                  flex
                  flex-col
                  gap-4

                  border-t
                  ${cardBorder}

                  pt-5

                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                `}
              >
                <div
                  className={`
                    flex
                    items-center
                    gap-2

                    text-sm
                    font-semibold

                    ${
                      isSaved
                        ? "text-green-500 opacity-100"
                        : "opacity-0"
                    }

                    transition-all
                  `}
                >
                  <CheckCircle className="h-4 w-4" />
                  Changes Saved Successfully
                </div>

                <button
                  onClick={handleSave}
                  className="
                    relative
                    inline-flex

                    h-[50px]

                    items-center
                    justify-center
                    gap-2

                    overflow-hidden
                    rounded-none

                    bg-[#0a66c2]

                    px-8

                    text-[14px]
                    font-bold

                    text-white

                    transition-all
                    duration-300

                    hover:-translate-y-[2px]
                    hover:bg-[#004182]

                    [clip-path:polygon(14px_0,100%_0,100%_calc(100%-14px),calc(100%-14px)_100%,0_100%,0_14px)]
                  "
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}