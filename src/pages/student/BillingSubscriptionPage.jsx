import {
  CreditCard,
  Zap,
  Crown,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import useIsDarkTheme from "../../hooks/useIsDarkTheme";

const INVOICES = [
  {
    id: "INV-2026-05",
    date: "May 1, 2026",
    amount: "$29.00",
    status: "Paid",
  },
  {
    id: "INV-2026-04",
    date: "Apr 1, 2026",
    amount: "$29.00",
    status: "Paid",
  },
  {
    id: "INV-2026-03",
    date: "Mar 1, 2026",
    amount: "$29.00",
    status: "Paid",
  },
];

export default function BillingSubscriptionPage() {
  const isDark = useIsDarkTheme();

  const cardBg = isDark ? "bg-[#0d111d]" : "bg-white";
  const cardBorder = isDark ? "border-white/10" : "border-gray-200";
  const surfaceBg = isDark ? "bg-[#0f172a]" : "bg-gray-50";
  const textPrimary = isDark ? "text-white" : "text-slate-900";
  const textSecondary = isDark ? "text-white/60" : "text-slate-600";
  const glassGlow = isDark
    ? "shadow-[0_20px_60px_rgba(37,99,235,0.18)]"
    : "shadow-[0_20px_60px_rgba(37,99,235,0.08)]";

  return (
    <div className="min-h-screen bg-bg text-text p-1 transition-all duration-300">
      <div className="mx-auto max-w-7xl space-y-8 px-2 sm:px-4">

        {/* HERO */}
        <div
          className={`
            relative
            overflow-hidden
            rounded-[5px]
            border
            ${cardBorder}
            ${cardBg}
            ${glassGlow}
            p-6
            sm:p-8
            -mt-3
            -ml-4
            lg:p-10
            transition-all
            duration-300
          `}
        >

          {/* LIGHT MODE GLOW */}
          <div
            className={`
              absolute
              inset-0
              ${isDark ? "bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.14),transparent_35%)]" : "bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.08),transparent_30%)]"}
            `}
          />

          {/* GRID */}
          <div className="relative z-10  grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">

            {/* LEFT */}
            <div>

              {/* BADGE */}
              <div
                className="
                  inline-flex
                  items-center
                  gap-2
                  
                  rounded-[5px]

                  border border-primary/20

                  bg-primary/10

                  px-4
                  py-2

                  text-[11px]
                  font-bold
                  uppercase
                  tracking-[0.18em]

                  text-primary
                "
              >
                <Sparkles size={14} />
                Active Subscription
              </div>

              {/* TITLE */}
              <h1
                className={`
                  mt-6
                  text-[42px]
                  sm:text-[42px]
                  font-black
                  leading-[0.95]
                  tracking-[-0.05em]
                  ${textPrimary}
                `}
              >
                Student Pro
              </h1>

              {/* DESCRIPTION */}
              <p
                className={`
                  mt-5
                  max-w-2xl
                  text-[20px]
                  leading-8
                  ${textSecondary}
                `}
              >
                Unlock premium courses, expert mentorship,
                certification tracks, AI-powered learning,
                and advanced analytics with your current plan.
              </p>

              {/* PRICE */}
              <div className="mt-8 flex items-end gap-2">

                <span
                  className={`
                    text-[54px]
                    sm:text-[68px]
                    font-black
                    leading-none
                    ${textPrimary}
                  `}
                >
                  $29
                </span>

                <span
                  className={`
                    pb-2
                    text-sm
                    font-semibold
                    ${textSecondary}
                  `}
                >
                  per month
                </span>

              </div>

              {/* FEATURES */}
              <div className="mt-8 flex flex-wrap gap-3">

                {[
                  "Unlimited Courses",
                  "AI Mentor Access",
                  "Certificates",
                  "Priority Support",
                ].map((item, index) => (
                  <div
                    key={index}
                    className={`
                      inline-flex
                      items-center
                      gap-2
                      rounded-[5px]
                      border
                      ${cardBorder}
                      ${surfaceBg}
                      px-4
                      py-3
                      text-sm
                      font-semibold
                      ${textPrimary}
                      transition-all
                      duration-300
                    `}
                  >
                    <ShieldCheck
                      size={16}
                      className="text-primary"
                    />

                    {item}
                  </div>
                ))}

              </div>

            </div>

            {/* RIGHT PREMIUM CARD */}
            <div
              className="
                relative
                overflow-hidden

                rounded-[5px]

                bg-gradient-to-br
                from-[#2563ff]
                to-[#215cff]

                p-7

                text-white
              "
            >

              <div
                className="
                  absolute
                  right-[-40px]
                  top-[-40px]

                  opacity-10
                "
              >
                <Crown size={180} />
              </div>

              <div className="relative z-10">

                <div
                  className="
                    inline-flex
                    items-center
                    gap-2

                    rounded-[5px]

                    border border-white/10

                    bg-white/10

                    px-4
                    py-2

                    text-[11px]
                    font-bold
                    uppercase
                    tracking-[0.18em]
                  "
                >
                  <Zap size={14} />
                  Current Plan
                </div>

                <h2
                  className="
                    mt-6

                    text-[32px]
                    font-black

                    leading-tight
                  "
                >
                  Upgrade Your Learning Experience
                </h2>

                <p className="mt-4 text-sm leading-7 text-white/80">
                  Get mentor sessions, exclusive workshops,
                  advanced projects, and faster career growth.
                </p>

                {/* STATS */}
                <div className="mt-8 grid grid-cols-2 gap-4">

                  <div
                    className="
                      rounded-[5px]

                      border border-white/10

                      bg-white/10

                      p-5
                    "
                  >
                    <p className="text-xs uppercase tracking-[0.15em] text-white/70">
                      Courses
                    </p>

                    <h3 className="mt-3 text-3xl font-black">
                      120+
                    </h3>
                  </div>

                  <div
                    className="
                      rounded-[5px]

                      border border-white/10

                      bg-white/10

                      p-5
                    "
                  >
                    <p className="text-xs uppercase tracking-[0.15em] text-white/70">
                      Mentors
                    </p>

                    <h3 className="mt-3 text-3xl font-black">
                      40+
                    </h3>
                  </div>

                </div>

                {/* BUTTONS */}
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">

                  <button
                    className="
                      relative
                      inline-flex

                      h-[46px]
                      min-w-[180px]

                      items-center
                      justify-center
                      gap-2

                      overflow-hidden
                      rounded-lg

                      border border-white/10

                      bg-white

                      px-6

                      text-[14px]
                      font-semibold

                      text-black

                      transition-all
                      duration-300

                      hover:-translate-y-[2px]
                    "
                  >
                    Upgrade Plan
                    <ArrowRight size={16} />
                  </button>

                  <button
                    className="
                      relative
                      inline-flex

                      h-[46px]
                      min-w-[180px]

                      items-center
                      justify-center

                      overflow-hidden
                      rounded-lg

                      border border-white/10

                      bg-white/10

                      px-6

                      text-[14px]
                      font-semibold

                      text-white

                      transition-all
                      duration-300

                      hover:bg-white/15
                    "
                  >
                    Cancel Plan
                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* LOWER GRID */}
        <div className="grid grid-cols-1 -ml-4 gap-8 xl:grid-cols-12">

          {/* PAYMENT */}
          <div className="xl:col-span-4">

            <div
              className={`
      min-h-[414px]

      rounded-[5px]
      border
      ${cardBorder}
      ${cardBg}
      ${glassGlow}

      p-3

      transition-all
      duration-300
    `}
            >

              <div className="flex min-h-[350px]  flex-col">

                {/* HEADER */}
                <div className="flex items-center justify-between">

                  <h3
                    className={`
            text-[24px]
            font-black
            ${textPrimary}
          `}
                  >
                    Payment Method
                  </h3>

                  <div
                    className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-[5px]
            bg-primary/10
            text-primary
          "
                  >
                    <CreditCard size={20} />
                  </div>

                </div>

                {/* SUBTEXT */}
                <p
                  className={`
          mt-3
          text-sm
          leading-7
          ${textSecondary}
        `}
                >
                  Your active billing method used for all
                  subscription
                </p>

                {/* CARD */}
                <div
                  className={`
          mt-6
          overflow-hidden
          rounded-[5px]

          ${isDark
                      ? "bg-gradient-to-br from-[#111827] to-[#1e293b]"
                      : "bg-gradient-to-br from-[#eff6ff] to-[#dbeafe]"
                    }

          p-6

          ${textPrimary}
        `}
                >

                  {/* TOP */}
                  <div className="flex items-center justify-between">

                    <div>

                      <p
                        className={`
                text-xs
                uppercase
                tracking-[0.18em]
                ${textSecondary}
              `}
                      >
                        Visa Platinum
                      </p>

                      <h4 className="mt-2 text-lg font-black">
                        Cloud Nexus
                      </h4>

                    </div>

                    <div className="text-xl font-black italic">
                      VISA
                    </div>

                  </div>



                  {/* DETAILS */}
                  <div className="mt-6 flex items-center justify-between">

                    <div>

                      <p
                        className={`
                text-[10px]
                uppercase
                tracking-[0.18em]
                ${textSecondary}
              `}
                      >
                        Expires
                      </p>

                      <p className="mt-1 text-sm font-semibold">
                        12 / 28
                      </p>

                    </div>

                    <div>

                      <p
                        className={`
                text-[10px]
                uppercase
                tracking-[0.18em]
                ${textSecondary}
              `}
                      >
                        CVV
                      </p>

                      <p className="mt-1 text-sm font-semibold">
                        •••
                      </p>

                    </div>

                  </div>

                </div>

                {/* SECURITY BADGE */}
                <div
                  className={`
          mt-4

          inline-flex
          w-fit
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
        `}
                >
                  <ShieldCheck size={14} />
                  Secure Payment Enabled
                </div>

                {/* BUTTON */}
                <button
                  className={`
          mt-5
          relative
          inline-flex
          h-[48px]
          w-full

          items-center
          justify-center
          gap-2

          overflow-hidden
          rounded-lg

          border

          ${cardBorder}

          bg-primary

          px-6

          text-[14px]
          font-semibold

          ${textPrimary}

          transition-all
          duration-300
          

          hover:-translate-y-[2px]
          hover:border-primary/20
        `}
                >
                  Update Payment Method
                  <ArrowRight size={16} />
                </button>

              </div>

            </div>

          </div>

          {/* BILLING HISTORY */}
          <div className="xl:col-span-8">

            <div
              className={`
                overflow-hidden
                rounded-[5px]
                border
                ${cardBorder}
                ${cardBg}
                ${glassGlow}
                transition-all
                duration-300
              `}
            >

              {/* HEADER */}
              <div
                className={`
                  border-b
                  ${cardBorder}
                  px-7
                  py-6
                `}
              >

                <h3
                  className={`
                    text-[24px]
                    font-black
                    ${textPrimary}
                  `}
                >
                  Billing History
                </h3>

                <p
                  className={`
                    mt-1
                    text-sm
                    ${textSecondary}
                  `}
                >
                  Download all previous invoices and receipts.
                </p>

              </div>

              {/* TABLE */}
              <div className="overflow-x-auto">

                <table className="w-full min-w-[700px]">

                  <thead
                    className={`
                      ${surfaceBg}
                      border-b
                      ${cardBorder}
                    `}
                  >

                    <tr>

                      <th className={`px-7 py-5 text-left text-[11px] font-bold uppercase tracking-[0.18em] ${textSecondary}`}>
                        Invoice
                      </th>

                      <th className={`px-7 py-5 text-left text-[11px] font-bold uppercase tracking-[0.18em] ${textSecondary}`}>
                        Date
                      </th>

                      <th className={`px-7 py-5 text-left text-[11px] font-bold uppercase tracking-[0.18em] ${textSecondary}`}>
                        Status
                      </th>

                      <th className={`px-7 py-5 text-left text-[11px] font-bold uppercase tracking-[0.18em] ${textSecondary}`}>
                        Amount
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {INVOICES.map((inv, index) => (
                      <tr
                        key={index}
                        className={`
                          border-b
                          ${cardBorder}
                          last:border-none
                          ${isDark ? "hover:bg-[#0f172a]" : "hover:bg-gray-50"}
                          transition-all
                        `}
                      >

                        <td className={`px-7 py-6 font-mono text-sm ${textPrimary}`}>
                          {inv.id}
                        </td>

                        <td className={`px-7 py-6 text-sm ${textSecondary}`}>
                          {inv.date}
                        </td>

                        <td className="px-7 py-6">

                          <div
                            className="
                              inline-flex
                              items-center
                              rounded-[5px]
                              border border-green-500/20
                              bg-green-500/10
                              px-3
                              py-2
                              text-[11px]
                              font-bold
                              uppercase
                              tracking-[0.15em]

                              text-green-500
                            "
                          >
                            Paid
                          </div>

                        </td>

                        <td className={`px-7 py-6 text-sm font-black ${textPrimary}`}>
                          {inv.amount}
                        </td>

                      </tr>
                    ))}

                  </tbody>

                </table>

              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
