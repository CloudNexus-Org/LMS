import { useMemo } from "react";
import {
  DollarSign,
  Download,
  ArrowUpRight,
  TrendingUp,
  Wallet,
  CreditCard,
  Sparkles,
  CalendarDays,
  ChevronRight,
  Clock3,
  ShieldCheck,
  BarChart3,
  Receipt,
} from "lucide-react";
import { useTheme } from "@/app/providers/ThemeProvider";

const PAYOUTS = [
  {
    id: "PO-2026-05",
    date: "May 1, 2026",
    amount: "$4,250.00",
    status: "Processing",
  },
  {
    id: "PO-2026-04",
    date: "Apr 1, 2026",
    amount: "$3,890.00",
    status: "Paid",
  },
  {
    id: "PO-2026-03",
    date: "Mar 1, 2026",
    amount: "$4,010.00",
    status: "Paid",
  },
];

export default function RevenuePage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const glowClasses = useMemo(() => ({
    primary: isDark ? "bg-blue-500/8 blur-[120px]" : "bg-blue-500/10 blur-[90px]",
  }), [isDark]);

  return (
    <div className="mx-auto max-w-7xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* HERO */}
      <div
        className="
          relative overflow-hidden
          rounded-[5px]
          border border-gray-200 dark:border-border
          bg-white/90 dark:bg-elevated/80
          p-8
          shadow-sm
        "
      >
        {/* GLOW */}
        <div className={`absolute right-[-100px] top-[-100px] h-[260px] w-[260px] rounded-lg ${glowClasses.primary}`} />

        <div className="relative z-10 flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
          {/* LEFT */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-[5px] border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-blue-500">
              <Sparkles className="h-3.5 w-3.5" />
              Revenue Center
            </div>

            <h1 className="mt-5 text-[42px] font-black tracking-[-0.05em] text-text leading-none">
              Revenue & Payouts
            </h1>

            <p className="mt-5 max-w-[720px] text-[15px] leading-8 text-muted font-medium">
              Track your earnings, payout history, withdrawals,
              analytics, and revenue growth across all your active
              courses.
            </p>

            {/* QUICK INFO */}
            <div className="mt-8 flex flex-wrap gap-4">
              {[
                {
                  icon: Wallet,
                  text: "Instant Withdrawals",
                },
                {
                  icon: ShieldCheck,
                  text: "Secure Transactions",
                },
                {
                  icon: CalendarDays,
                  text: "Monthly Payouts",
                },
              ].map((item, i) => {
                const Icon = item.icon;

                return (
                  <div
                    key={i}
                    className="
                      flex items-center gap-2
                      rounded-[5px]
                      border border-border
                      bg-bg/60
                      px-4 py-3
                    "
                  >
                    <Icon className="h-4 w-4 text-blue-500" />

                    <span className="text-sm font-bold text-text">
                      {item.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT PREVIEW */}
          <div
            className="
              relative overflow-hidden
              rounded-[5px]
              border border-gray-200 dark:border-border
              bg-gray-50 dark:bg-elevated/90
              p-6
              xl:w-[360px]
            "
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.05] via-transparent to-cyan-400/[0.04]" />

            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.15em] text-muted">
                    Monthly Growth
                  </p>

                  <h3 className="mt-2 text-4xl font-black text-text">
                    +18%
                  </h3>
                </div>

                <div className="rounded-[5px] bg-emerald-500/10 px-3 py-2 text-xs font-black uppercase tracking-[0.15em] text-emerald-500">
                  May 2026
                </div>
              </div>

              {/* MINI CHART */}
              <div className="mt-8 flex items-end gap-2">
                {[40, 55, 45, 75, 90, 120].map((h, i) => (
                  <div
                    key={i}
                    className="group flex-1"
                  >
                    <div
                      className="
                        relative overflow-hidden
                        rounded-t-[5px]
                        bg-gradient-to-t
                        from-blue-600
                        via-blue-500
                        to-cyan-400
                        transition-all duration-500
                        group-hover:-translate-y-2
                      "
                      style={{
                        height: `${h}px`,
                      }}
                    >
                      <div
                        className="
                          absolute inset-0
                          bg-[linear-gradient(120deg,transparent_20%,rgba(255,255,255,0.3)_50%,transparent_80%)]
                          animate-[shine_2.5s_linear_infinite]
                        "
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.15em] text-muted">
                <span>Jan</span>
                <span>Jun</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI GRID */}
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
  {[
    {
      title: "Available Balance",
      value: "$4,250",
      growth: "+12%",
      icon: Wallet,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      line: "bg-blue-500/20",
      hover: "hover:border-blue-500/20",
    },
    {
      title: "Lifetime Earnings",
      value: "$42.8k",
      growth: "+24%",
      icon: TrendingUp,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      line: "bg-emerald-500/20",
      hover: "hover:border-emerald-500/20",
    },
    {
      title: "Pending Payouts",
      value: "$2,140",
      growth: "+4%",
      icon: Clock3,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      line: "bg-orange-500/20",
      hover: "hover:border-orange-500/20",
    },
    {
      title: "Transactions",
      value: "148",
      growth: "+8%",
      icon: Receipt,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
      line: "bg-violet-500/20",
      hover: "hover:border-violet-500/20",
    },
  ].map((card, i) => {
    const Icon = card.icon;

    return (
      <div
        key={i}
        className={`
          group
          relative overflow-hidden

          rounded-[5px]

          border border-gray-200
          dark:border-border

          bg-white
          dark:bg-elevated/80

          px-5 py-4

          shadow-sm

          transition-all duration-300

          hover:-translate-y-1

          ${card.hover}

          hover:shadow-[0_20px_50px_rgba(37,99,235,0.10)]
        `}
      >
        

        {/* CONTENT */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            {/* ICON */}
            <div
              className={`
                flex h-11 w-11 items-center justify-center
                rounded-[10px]

                ${card.bg}
                ${card.color}

                shadow-sm
              `}
            >
              <Icon className="h-5 w-5" />
            </div>

            {/* VALUE + TITLE */}
            <div>
              <h3 className="text-[22px] font-black leading-none text-text">
                {card.value}
              </h3>

              <p
                className="
                  mt-1
                  text-[10px]
                  font-black
                  uppercase
                  tracking-[0.18em]
                  text-muted
                "
              >
                {card.title}
              </p>
            </div>

            {/* GROWTH */}
            <div
              className="
                ml-auto
                flex items-center gap-1

                rounded-[5px]

                bg-emerald-500/10

                px-2 py-1

                text-[10px]
                font-black

                text-emerald-500
              "
            >
              <ArrowUpRight className="h-3 w-3" />
              {card.growth}
            </div>
          </div>
        </div>
      </div>
    );
  })}
</div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* BALANCE CARD */}
        <div
          className="
            lg:col-span-2
            relative overflow-hidden
            rounded-[5px]
            border border-gray-200 dark:border-border
            bg-white dark:bg-elevated/80
            p-8 sm:p-10
            shadow-sm
          "
        >
          {/* BG ICON */}
          <div className="absolute top-0 right-0 p-8 opacity-[0.04]">
            <DollarSign className="h-56 w-56 text-text" />
          </div>

          {/* GLOW */}
          <div className="absolute right-[-120px] top-[-120px] h-[300px] w-[300px] rounded-lg bg-primary/5 blur-[100px]" />

          <div className="relative z-10 flex flex-col h-full justify-center">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-[0.18em] px-4 py-2 rounded-[5px] mb-6 max-w-max border border-emerald-500/20">
              <div className="h-2 w-2 rounded-lg bg-emerald-400 animate-pulse" />
              Next Payout: June 1, 2026
            </div>

            <p className="text-muted font-black uppercase tracking-[0.18em] text-xs mb-3">
              Available Balance
            </p>

            <h2 className="text-6xl font-black tracking-[-0.05em] mb-8 text-text">
              $4,250.00
            </h2>

            {/* ACTIONS */}
            <div className="flex flex-wrap gap-4">
              <button
                className="
                  relative
                  inline-flex
                  h-[48px]
                  min-w-[180px]
                  items-center
                  justify-center
                  gap-2
                  border border-border
                  dark:border-border
                  bg-primary
                  dark:bg-primary
                  px-6
                  text-[14px]
                  font-semibold
                  text-white
                  dark:text-white
                  overflow-hidden
                  rounded-lg
                  shadow-[0_10px_30px_rgba(37,99,235,0.08)]
                  dark:shadow-[0_10px_30px_rgba(0,0,0,0.4)]
                  transition-all
                  duration-300
                  hover:-translate-y-[2px]
                  hover:border-primary/40
                  dark:hover:border-primary/60
                "
              >
                Withdraw Funds
                <ArrowUpRight className="h-4 w-4" />
              </button>

              <button
                className="
                  relative
                  inline-flex
                  h-[48px]
                  min-w-[180px]
                  items-center
                  justify-center
                  gap-2
                  border border-border
                  dark:border-border
                  bg-white
                  dark:bg-elevated/80
                  px-6
                  text-[14px]
                  font-semibold
                  text-black
                  dark:text-text
                  overflow-hidden
                  rounded-lg
                  shadow-[0_10px_30px_rgba(37,99,235,0.06)]
                  dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)]
                  transition-all
                  duration-300
                  hover:-translate-y-[2px]
                  hover:border-primary/40
                  dark:hover:border-primary/40
                "
              >
                Tax Documents
                <Download className="h-4 w-4" />
              </button>
            </div>

            {/* STATS */}
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                {
                  label: "This Month",
                  value: "$4.2k",
                },
                {
                  label: "Avg. Revenue",
                  value: "$3.8k",
                },
                {
                  label: "Refund Rate",
                  value: "1.8%",
                },
                {
                  label: "Growth",
                  value: "+18%",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="
                    rounded-[5px]
                    border border-gray-200 dark:border-border
                    bg-gray-50 dark:bg-elevated/90
                    p-4
                  "
                >
                  <p className="text-[10px] font-black uppercase tracking-[0.15em] text-muted">
                    {item.label}
                  </p>

                  <h4 className="mt-2 text-2xl font-black text-text">
                    {item.value}
                  </h4>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SIDE CARD */}
        <div className="rounded-[5px] border border-gray-200 dark:border-border bg-white dark:bg-elevated/80 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-black text-text">
                Payment Method
              </h3>

              <p className="mt-1 text-sm text-muted font-medium">
                Default payout account.
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-[5px] bg-blue-500/10 text-blue-500">
              <CreditCard className="h-6 w-6" />
            </div>
          </div>

          {/* CARD */}
          <div
            className="
              relative overflow-hidden
              mt-8 rounded-[5px]
              bg-gradient-to-br
              from-blue-600
              via-blue-500
              to-cyan-400
              p-6
              text-white
            "
          >
            <div className="absolute right-[-40px] top-[-40px] h-[140px] w-[140px] rounded-lg bg-white/10" />

            <div className="relative z-10">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-white/70">
                Visa Platinum
              </p>

              <h3 className="mt-8 text-2xl font-black tracking-[0.3em]">
                •••• 4582
              </h3>

              <div className="mt-8 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.15em] text-white/70">
                    Card Holder
                  </p>

                  <h4 className="mt-2 text-sm font-black">
                    JOHN DOE
                  </h4>
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.15em] text-white/70">
                    Expires
                  </p>

                  <h4 className="mt-2 text-sm font-black">
                    08/28
                  </h4>
                </div>
              </div>
            </div>
          </div>

          <button
            className="
              mt-6 relative inline-flex h-[44px] min-w-[200px]
              items-center justify-center gap-2
              border border-border dark:border-border
              bg-primary dark:bg-elevated/80
              px-6
              text-[13px] font-semibold
              text-white dark:text-text
              overflow-hidden rounded-lg
              shadow-[0_8px_24px_rgba(37,99,235,0.06)]
              dark:shadow-[0_8px_24px_rgba(0,0,0,0.3)]
              transition-all duration-300
              hover:-translate-y-[2px] hover:border-primary/40
              dark:hover:border-primary/40
            "
          >
            Update Payment Method
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* PAYOUT HISTORY */}
      <div
        className="
          overflow-hidden
          rounded-[5px]
          border border-gray-200 dark:border-border
          bg-white dark:bg-elevated/80
          shadow-sm
        "
      >
        {/* HEADER */}
        <div className="border-b border-border p-6 sm:p-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-2xl font-black text-text">
              Payout History
            </h3>

            <p className="mt-2 text-sm text-muted font-medium">
              Track your recent payout transactions.
            </p>
          </div>

          <button
            className="
              relative inline-flex h-[44px] min-w-[160px]
              items-center justify-center gap-2
              border border-border dark:border-border
              bg-primary dark:bg-primary
              px-6
              text-[13px] font-semibold
              text-white dark:text-white
              overflow-hidden rounded-lg
              shadow-[0_8px_24px_rgba(37,99,235,0.08)]
              dark:shadow-[0_8px_24px_rgba(0,0,0,0.4)]
              transition-all duration-300
              hover:-translate-y-[2px] hover:border-primary/40
              dark:hover:border-primary/60
            "
          >
            Export Report
            <Download className="h-4 w-4" />
          </button>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-bg border-b border-border">
              <tr>
                <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.15em] text-muted">
                  Date
                </th>

                <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.15em] text-muted">
                  Transaction ID
                </th>

                <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.15em] text-muted">
                  Status
                </th>

                <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.15em] text-muted">
                  Amount
                </th>

                <th className="px-8 py-5 text-right text-[11px] font-black uppercase tracking-[0.15em] text-muted">
                  Receipt
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {PAYOUTS.map((inv) => (
                <tr
                  key={inv.id}
                  className="
                    group transition-all duration-300
                    hover:bg-bg/40
                  "
                >
                  <td className="px-8 py-6 font-black text-text">
                    {inv.date}
                  </td>

                  <td className="px-8 py-6 font-mono text-muted">
                    {inv.id}
                  </td>

                  <td className="px-8 py-6">
                    <span
                      className={`
                        inline-flex items-center rounded-lg px-3 py-1 text-[10px] font-black uppercase tracking-[0.15em]

                        ${
                          inv.status === "Paid"
                            ? "bg-emerald-500/10 text-emerald-500"
                            : "bg-orange-500/10 text-orange-500"
                        }
                      `}
                    >
                      {inv.status}
                    </span>
                  </td>

                  <td className="px-8 py-6 text-base font-black text-text">
                    {inv.amount}
                  </td>

                  <td className="px-8 py-6 text-right">
                    <button
                      className="
                        relative inline-flex h-[36px] min-w-[80px]
                        items-center justify-center gap-1.5
                        border border-border dark:border-border
                        bg-primary dark:bg-elevated/80
                        px-4
                        text-[12px] font-semibold
                        text-white dark:text-text
                        overflow-hidden rounded-lg
                        transition-all duration-300
                        hover:-translate-y-[2px] hover:border-primary/40
                        dark:hover:border-primary/40
                      "
                    >
                      <Download className="h-3.5 w-3.5" />
                      PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* EXTRA ANALYTICS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* REVENUE BREAKDOWN */}
        <div className="rounded-[5px] border border-gray-200 dark:border-border bg-white dark:bg-elevated/80 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-black text-text">
                Revenue Breakdown
              </h3>

              <p className="mt-1 text-sm text-muted font-medium">
                Earnings source distribution.
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-[5px] bg-blue-500/10 text-blue-500">
              <BarChart3 className="h-6 w-6" />
            </div>
          </div>

          <div className="mt-8 space-y-6">
            {[
              {
                title: "Course Sales",
                value: "72%",
              },
              {
                title: "Subscriptions",
                value: "18%",
              },
              {
                title: "Affiliate Revenue",
                value: "10%",
              },
            ].map((item, i) => (
              <div key={i}>
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-bold text-text">
                    {item.title}
                  </span>

                  <span className="text-sm font-black text-blue-500">
                    {item.value}
                  </span>
                </div>

                <div className="h-3 overflow-hidden rounded-lg bg-bg border border-border">
                  <div
                    className="
                      h-full rounded-lg
                      bg-gradient-to-r
                      from-blue-500
                      to-cyan-400
                    "
                    style={{
                      width: item.value,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* WITHDRAWAL TIMELINE */}
        <div className="rounded-[5px] border border-gray-200 dark:border-border bg-white dark:bg-elevated/80 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-black text-text">
                Withdrawal Timeline
              </h3>

              <p className="mt-1 text-sm text-muted font-medium">
                Upcoming payout schedule.
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-[5px] bg-emerald-500/10 text-emerald-500">
              <CalendarDays className="h-6 w-6" />
            </div>
          </div>

          <div className="mt-8 space-y-6">
            {[
              {
                date: "June 1",
                amount: "$4,250",
                status: "Processing",
              },
              {
                date: "July 1",
                amount: "$5,120",
                status: "Scheduled",
              },
              {
                date: "August 1",
                amount: "$6,480",
                status: "Estimated",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="
                  flex items-center justify-between
                  rounded-[5px]
                  border border-border
                  bg-bg/40
                  p-4
                "
              >
                <div className="flex items-center gap-4">
                  <div className="h-3 w-3 rounded-lg bg-blue-500" />

                  <div>
                    <p className="font-black text-text">
                      {item.date}
                    </p>

                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.15em] text-muted">
                      {item.status}
                    </p>
                  </div>
                </div>

                <h4 className="text-xl font-black text-blue-500">
                  {item.amount}
                </h4>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}