import { useState } from "react";
import {
  User,
  Lock,
  Bell,
  UploadCloud,
  CheckCircle,
  Shield,
  Camera,
  Sparkles,
  ChevronRight,
  Monitor,
  Sun,
  Smartphone,
} from "lucide-react";
import useIsDarkTheme from "../../hooks/useIsDarkTheme";

const TABS = [
  { id: "general", label: "General Profile", icon: User },
  { id: "security", label: "Security & Login", icon: Lock },
  { id: "preferences", label: "Preferences", icon: Bell },
];

export default function ProfileSettingsPage() {
  const isDark = useIsDarkTheme();
  const [activeTab, setActiveTab] = useState("general");
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
    <div className="min-h-screen bg-bg text-text mx-auto max-w-7xl px-1 sm:px-2">

      {/* HEADER */}
      <div className="mb-7">
        <h1
          className={`
            text-[42px]
            sm:text-[42px]
            font-black
            leading-[0.95]
            tracking-[-0.05em]
            ${textPrimary}
          `}
        >
          Account Settings
        </h1>

        <p
          className={`
            mt-3
            text-[15px]
            font-medium
            leading-7
            ${textSecondary}
          `}
        >
          Manage your identity, preferences,
          account privacy and learning experience.
        </p>
      </div>

      {/* MAIN */}
      <div className="grid gap-8 xl:grid-cols-[300px_1fr]">

        {/* SIDEBAR */}
        <div
          className={`
            h-fit
            rounded-[5px]
            border
            ${cardBorder}
            ${cardBg}
            p-4
            shadow-sm
          `}
        >

          {/* PROFILE MINI CARD */}
          <div
            className="
              overflow-hidden

              rounded-[5px]

              bg-gradient-to-br
              from-[#2563ff]
              to-[#215cff]

              p-5

              text-white
            "
          >

            <div className="flex items-center gap-4">

              <div className="relative">

                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                  alt="avatar"
                  className="
                    h-16
                    w-16

                    rounded-full
                    object-cover

                    border-2 border-white/30
                  "
                />

                <div
                  className="
                    absolute
                    bottom-0
                    right-0

                    flex
                    h-6
                    w-6

                    items-center
                    justify-center

                    rounded-full

                    bg-white

                    text-primary
                  "
                >
                  <Camera size={13} />
                </div>

              </div>

              <div>

                <h3 className="text-lg font-black">
                  Alex Chen
                </h3>

                <p className="text-sm text-white/70">
                  Student Pro Member
                </p>

              </div>

            </div>

            <div
              className="
                mt-5

                flex
                items-center
                justify-between

                rounded-[5px]

                border border-white/10

                bg-white/10

                px-4
                py-3
              "
            >

              <div>

                <p className="text-[11px] uppercase tracking-[0.18em] text-white/60">
                  Learning Streak
                </p>

                <h4 className="mt-1 text-2xl font-black">
                  12 Days
                </h4>

              </div>

              <Sparkles className="h-8 w-8 text-white/70" />

            </div>

          </div>

          {/* NAVIGATION */}
          <div className="mt-5 space-y-2">

            {TABS.map((tab) => {
              const Icon = tab.icon;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    group
                    flex
                    w-full
                    items-center
                    justify-between
                    rounded-[5px]
                    px-4
                    py-4
                    text-left
                    transition-all
                    duration-300
                    ${
                      activeTab === tab.id
                        ? "bg-primary text-white shadow-[0_10px_30px_rgba(37,99,235,0.18)]"
                        : `border border-transparent ${textSecondary} ${isDark ? "hover:border-white/10 hover:bg-[#0f172a]" : "hover:border-slate-200 hover:bg-slate-50"}`
                    }
                  `}
                >

                  <div className="flex items-center gap-3">

                    <Icon className="h-5 w-5" />

                    <span className="font-semibold">
                      {tab.label}
                    </span>

                  </div>

                  <ChevronRight
                    className={`
                      h-4
                      w-4

                      transition-transform

                      ${
                        activeTab === tab.id
                          ? "translate-x-0"
                          : "translate-x-[-4px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                      }
                    `}
                  />

                </button>
              );
            })}

          </div>

        </div>

        {/* RIGHT CONTENT */}
        <div
          className={`
            overflow-hidden
            rounded-[5px]
            border
            ${cardBorder}
            ${cardBg}
            shadow-sm
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
              px-6
              py-6
              sm:flex-row
              sm:items-center
              sm:justify-between
            `}
          >

            <div>

              <h2
                className={`
                  text-[28px]
                  font-black
                  ${textPrimary}
                `}
              >
                {activeTab === "general" && "General Profile"}
                {activeTab === "security" && "Security & Login"}
                {activeTab === "preferences" && "Preferences"}
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
              Account Protected
            </div>

          </div>

          {/* GENERAL */}
          {activeTab === "general" && (
            <form
              onSubmit={handleSave}
              className="space-y-8 p-6 sm:p-8"
            >

              {/* PROFILE */}
              <div
                className={`
                  flex
                  flex-col
                  gap-6
                  rounded-[5px]
                  border
                  ${cardBorder}
                  ${surfaceBg}
                  p-6
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
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
                    gap-2
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

              {/* FORM */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">

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
                  rows="5"
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
                  pt-6
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
          )}

          {/* SECURITY */}
          {activeTab === "security" && (
            <div className="space-y-8 p-6 sm:p-8">

              <div
                className={`
                  flex
                  flex-col
                  gap-5
                  rounded-[5px]
                  border
                  ${cardBorder}
                  ${surfaceBg}
                  p-6
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                `}
              >

                <div className="flex items-center gap-4">

                  <div
                    className="
                      flex
                      h-14
                      w-14
                      items-center
                      justify-center
                      rounded-full
                      bg-primary/10
                      text-primary
                    "
                  >
                    <Shield className="h-7 w-7" />
                  </div>

                  <div>

                    <h3
                      className={`
                        text-xl
                        font-black
                        ${textPrimary}
                      `}
                    >
                      Two-Factor Authentication
                    </h3>

                    <p
                      className={`
                        mt-1
                        text-sm
                        ${textSecondary}
                      `}
                    >
                      Protect your account with additional security verification.
                    </p>

                  </div>

                </div>

                <button
                  className="
                    relative
                    inline-flex

                    h-[48px]

                    items-center
                    justify-center

                    overflow-hidden
                    rounded-none

                    bg-primary

                    px-6

                    text-sm
                    font-bold

                    text-white

                    transition-all
                    duration-300

                    hover:-translate-y-[2px]

                    [clip-path:polygon(12px_0,100%_0,100%_calc(100%-12px),calc(100%-12px)_100%,0_100%,0_12px)]
                  "
                >
                  Enable 2FA
                </button>

              </div>

            </div>
          )}

          {/* PREFERENCES */}
          {activeTab === "preferences" && (
            <div className="space-y-6 p-6 sm:p-8">

              {[
                {
                  icon: Sun,
                  title: "Appearance",
                  desc: "Customize dark and light mode behavior.",
                },
                {
                  icon: Monitor,
                  title: "Device Sessions",
                  desc: "Manage active devices and login sessions.",
                },
                {
                  icon: Smartphone,
                  title: "Mobile Notifications",
                  desc: "Receive course updates on your phone.",
                },
              ].map((item, index) => {
                const Icon = item.icon;

                return (
                  <div
                    key={index}
                    className={`
                      flex
                      flex-col
                      gap-5
                      rounded-[5px]
                      border
                      ${cardBorder}
                      ${surfaceBg}
                      p-6
                      sm:flex-row
                      sm:items-center
                      sm:justify-between
                    `}
                  >
                    <div className="flex items-center gap-4">

                      <div
                        className="
                          flex
                          h-12
                          w-12

                          items-center
                          justify-center

                          rounded-full

                          bg-primary/10

                          text-primary
                        "
                      >
                        <Icon className="h-6 w-6" />
                      </div>

                      <div>

                        <h3
                          className={`
                            text-lg
                            font-black
                            ${textPrimary}
                          `}
                        >
                          {item.title}
                        </h3>

                        <p
                          className={`
                            mt-1
                            text-sm
                            ${textSecondary}
                          `}
                        >
                          {item.desc}
                        </p>

                      </div>

                    </div>

                    <button
                      className={`
                        relative
                        inline-flex
                        h-[46px]
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
                      Configure
                    </button>

                  </div>
                );
              })}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}