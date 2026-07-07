import { useMemo, useState, useEffect } from "react";
import {
  DollarSign,
  TrendingUp,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  X,
  Wallet,
  Receipt,
  Clock3,
} from "lucide-react";
import {
  csvFilename,
  downloadMultiSectionCsv,
} from "@/lib/exportCsv";
import useAuthStore from "@/store/useAuthStore";
import { fetchFinancialSummary, fetchTransactions } from "@/lib/api/adminApi";
import { Skeleton } from "@/components/ui/Skeletons";

const TYPE_FILTERS = ["All", "Course Sale", "Mentor Payout", "Refund"];

const TYPE_CONFIG = {
  "Course Sale": {
    color: "text-success",
    bg: "bg-success/10",
    border: "border-success/20",
  },
  "Mentor Payout": {
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
  },
  Refund: {
    color: "text-danger",
    bg: "bg-danger/10",
    border: "border-danger/20",
  },
};

function formatMoney(value) {
  const abs = Math.abs(value);
  const formatted = abs.toLocaleString("en-US", {
    minimumFractionDigits: abs % 1 ? 2 : 0,
    maximumFractionDigits: 2,
  });
  return value < 0 ? `-$${formatted}` : `+$${formatted}`;
}

export default function FinancialsPage() {
  const { user, token } = useAuthStore();
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  useEffect(() => {
    if (!user || !token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    Promise.all([
      fetchTransactions(user, token),
      fetchFinancialSummary(user, token),
    ])
      .then(([txList, sum]) => {
        setTransactions(Array.isArray(txList) ? txList : []);
        if (sum) setSummary(sum);
      })
      .catch(() => {
        setTransactions([]);
        setSummary(null);
      })
      .finally(() => setLoading(false));
  }, [user, token]);

  const filtered = useMemo(
    () =>
      transactions.filter((tx) => {
        const q = search.toLowerCase();
        const matchQ =
          tx.id.toLowerCase().includes(q) ||
          tx.student.toLowerCase().includes(q) ||
          tx.course.toLowerCase().includes(q);
        const matchType = typeFilter === "All" || tx.type === typeFilter;
        return matchQ && matchType;
      }),
    [search, typeFilter, transactions]
  );

  const sales = transactions.filter((t) => t.type === "Course Sale");
  const payouts = transactions.filter((t) => t.type === "Mentor Payout");

  const computedSales = sales.reduce((sum, t) => sum + Math.max(0, Number(t.amount) || 0), 0);
  const computedPayouts = payouts.reduce((sum, t) => sum + Math.abs(Number(t.amount) || 0), 0);
  const computedCut = sales.reduce((sum, t) => sum + Math.max(0, Number(t.cut) || 0), 0);

  const totalSales = summary?.totalSales ?? computedSales;
  const mentorPayouts = summary?.mentorPayouts ?? computedPayouts;
  const netRevenue = summary?.netRevenue ?? (computedCut || Math.max(0, computedSales - computedPayouts));
  const platformCut = summary?.platformCut ?? (computedCut || netRevenue);

  const stats = [
    {
      label: "Net platform revenue",
      value: `$${(netRevenue / 1000).toFixed(1)}k`,
      meta: `${transactions.length} ledger entries`,
      metaTone: "success",
      icon: DollarSign,
      iconColor: "text-success",
    },
    {
      label: "Total sales",
      value: `$${(totalSales / 1000).toFixed(0)}k`,
      meta: `${sales.length} course sale${sales.length === 1 ? '' : 's'} in ledger`,
      metaTone: "muted",
      icon: TrendingUp,
      iconColor: "text-primary",
    },
    {
      label: "Mentor payouts",
      value: `$${(mentorPayouts / 1000).toFixed(1)}k`,
      meta: totalSales > 0 ? `${Math.round((mentorPayouts / totalSales) * 100)}% of gross sales` : 'No sales yet',
      metaTone: "muted",
      icon: Wallet,
      iconColor: "text-accent",
    },
    {
      label: "Platform cut",
      value: `$${(platformCut / 1000).toFixed(1)}k`,
      meta: totalSales > 0 ? `${Math.round((platformCut / totalSales) * 100)}% margin` : '—',
      metaTone: "muted",
      icon: Receipt,
      iconColor: "text-warning",
    },
  ];

  const handleExportCsv = () => {
    downloadMultiSectionCsv(csvFilename("financials"), [
      {
        title: "Platform Financials Summary",
        headers: ["Metric", "Value", "Notes"],
        rows: [
          ["Net Platform Revenue (YTD)", netRevenue, `${transactions.length} transactions`],
          ["Total Sales", totalSales, `${sales.length} course sales in ledger`],
          ["Mentor Payouts", mentorPayouts, `${Math.round((mentorPayouts / totalSales) * 100)}% of gross`],
          ["Platform Cut", platformCut, `${Math.round((platformCut / totalSales) * 100)}% margin`],
        ],
      },
      {
        title: "All Transactions",
        headers: [
          "Transaction ID",
          "Type",
          "Student / Mentor",
          "Course",
          "Amount",
          "Platform Cut",
          "Date",
        ],
        rows: transactions.map((tx) => [
          tx.id,
          tx.type,
          tx.student,
          tx.course,
          formatMoney(tx.amount),
          tx.cut == null ? "" : formatMoney(tx.cut),
          tx.date,
        ]),
      },
    ]);
  };

  return (
    <div className="dashboard-page mx-auto w-full max-w-[1320px] space-y-4">
      {loading ? (
        <Skeleton className="h-[480px] w-full rounded-2xl" />
      ) : (
      <>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[32px] font-bold tracking-tight text-text sm:text-[36px]">
            Platform Financials
          </h1>
          <p className="mt-1 text-[15px] text-muted">
            Track global revenue, platform cut, and mentor payouts.
          </p>
        </div>
        <button
          type="button"
          onClick={handleExportCsv}
          className="inline-flex items-center gap-1.5 self-start rounded-lg border border-border px-4 py-2 text-[13px] font-medium text-muted transition-colors hover:text-text sm:self-center"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      <section className="admin-stat-strip" aria-label="Financial summary">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="admin-stat-cell">
              <div className={`admin-stat-icon ${stat.iconColor}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="admin-stat-value">{stat.value}</p>
                <p className="admin-stat-label">{stat.label}</p>
                <p
                  className={`admin-stat-meta ${
                    stat.metaTone === "muted" ? "admin-stat-meta-muted" : ""
                  }`}
                >
                  {stat.meta}
                </p>
              </div>
            </div>
          );
        })}
      </section>

      <div className="bg-surface overflow-hidden rounded-[5px] border border-border shadow-sm">
        <div className="flex flex-col items-start gap-3 border-b border-border bg-bg/30 p-5 sm:flex-row sm:items-center">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search ID, student, course..."
              className="h-10 w-full rounded-[5px] border border-border bg-surface pl-10 pr-8 text-sm font-medium text-text outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/20"
            />
            {search ? (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : null}
          </div>

          <div className="admin-filter-tabs rounded-[5px] border border-border bg-bg p-1">
            {TYPE_FILTERS.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setTypeFilter(type)}
                className={`admin-filter-tab ${typeFilter === type ? "admin-filter-tab-active" : ""}`}
              >
                {type}
              </button>
            ))}
          </div>

          <span className="ml-auto text-xs font-bold text-muted">
            {filtered.length} transaction{filtered.length === 1 ? "" : "s"}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead className="border-b border-border bg-bg/50">
              <tr>
                {[
                  "Transaction ID",
                  "Type",
                  "Student / Mentor",
                  "Course",
                  "Amount",
                  "Platform Cut",
                  "Date",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-muted"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((tx) => {
                const tc = TYPE_CONFIG[tx.type];
                return (
                  <tr key={tx.id} className="group transition-colors hover:bg-bg/40">
                    <td className="px-5 py-4 font-mono text-xs font-bold text-text">
                      {tx.id}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-[5px] border px-2.5 py-1 text-xs font-bold ${tc.bg} ${tc.border} ${tc.color}`}
                      >
                        {tx.type === "Course Sale" ? (
                          <ArrowUpRight className="h-3 w-3" />
                        ) : tx.type === "Refund" ? (
                          <ArrowDownRight className="h-3 w-3" />
                        ) : (
                          <Wallet className="h-3 w-3" />
                        )}
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-bold text-text">{tx.student}</p>
                    </td>
                    <td className="px-5 py-4 text-sm font-medium text-muted">
                      {tx.course}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`text-sm font-bold ${tx.amount >= 0 ? "text-success" : "text-danger"}`}
                      >
                        {formatMoney(tx.amount)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`text-sm font-bold ${
                          tx.cut == null
                            ? "text-muted"
                            : tx.cut >= 0
                              ? "text-success"
                              : "text-danger"
                        }`}
                      >
                        {tx.cut == null ? "—" : formatMoney(tx.cut)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-muted">
                        <Clock3 className="h-3.5 w-3.5" />
                        {tx.date}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filtered.length === 0 ? (
            <div className="py-20 text-center">
              <Receipt className="mx-auto mb-4 h-12 w-12 text-muted opacity-20" />
              <p className="font-bold text-text">No transactions found</p>
              <p className="mt-1 text-sm text-muted">
                Try adjusting your search or filters.
              </p>
            </div>
          ) : null}
        </div>

        <div className="flex items-center justify-between border-t border-border bg-bg/30 px-5 py-3">
          <p className="text-xs font-bold text-muted">
            Showing {filtered.length} of {transactions.length} transactions
          </p>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((p) => (
              <button
                key={p}
                type="button"
                className={`h-7 w-7 rounded-[5px] text-xs font-bold transition-all ${
                  p === 1
                    ? "bg-primary text-white"
                    : "border border-border text-muted hover:bg-bg hover:text-text"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
      </>
      )}
    </div>
  );
}
