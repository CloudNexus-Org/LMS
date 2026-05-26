import { DollarSign, TrendingUp, Download, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function FinancialsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-text font-display tracking-tight">Platform Financials</h1>
        <p className="text-muted mt-1 font-medium">Track global revenue, platform cut, and mentor payouts.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-text text-bg rounded-[5px] p-8 sm:p-10 shadow-card relative overflow-hidden">
          <div className="relative z-10 flex flex-col h-full justify-center">
            <p className="text-bg/80 font-bold uppercase tracking-widest text-sm mb-2">Net Platform Revenue (YTD)</p>
            <h2 className="text-5xl sm:text-6xl font-display font-bold mb-4">$428,500.00</h2>
            <div className="flex items-center gap-2 text-success bg-[color:color-mix(in_oklab,var(--success)_20%,transparent)] px-3 py-1.5 rounded-lg w-max font-bold text-sm">
              <TrendingUp className="h-4 w-4" /> +24% vs Last Year
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 opacity-10">
            <DollarSign className="h-64 w-64" />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-surface border border-border rounded-[5px] p-6 shadow-sm flex-1 flex flex-col justify-center">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-muted uppercase tracking-wider">Total Sales</p>
              <ArrowUpRight className="h-4 w-4 text-success" />
            </div>
            <p className="text-2xl font-bold text-text font-display">$1,248,000</p>
          </div>
          <div className="bg-surface border border-border rounded-[5px] p-6 shadow-sm flex-1 flex flex-col justify-center">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-muted uppercase tracking-wider">Mentor Payouts</p>
              <ArrowDownRight className="h-4 w-4 text-danger" />
            </div>
            <p className="text-2xl font-bold text-text font-display">$819,500</p>
          </div>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-[5px] overflow-hidden shadow-sm">
        <div className="p-6 sm:p-8 border-b border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <h3 className="font-bold text-xl text-text">Recent Transactions</h3>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-bg border border-border rounded-[5px] text-xs font-bold text-text hover:border-primary transition-colors shadow-sm">
            <Download className="h-4 w-4" /> Export CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-bg border-b border-border">
              <tr>
                <th className="px-8 py-5 font-bold text-muted uppercase tracking-wider text-[11px]">Transaction ID</th>
                <th className="px-8 py-5 font-bold text-muted uppercase tracking-wider text-[11px]">Type</th>
                <th className="px-8 py-5 font-bold text-muted uppercase tracking-wider text-[11px]">Amount</th>
                <th className="px-8 py-5 font-bold text-muted uppercase tracking-wider text-[11px]">Platform Cut</th>
                <th className="px-8 py-5 font-bold text-muted uppercase tracking-wider text-[11px] text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                { id: 'TX-9281', type: 'Course Sale', amount: '+$89.99', cut: '+$26.99', date: '10 mins ago', positive: true },
                { id: 'TX-9280', type: 'Course Sale', amount: '+$129.99', cut: '+$38.99', date: '1 hour ago', positive: true },
                { id: 'PO-4091', type: 'Mentor Payout', amount: '-$4,250.00', cut: '--', date: 'Yesterday', positive: false },
                { id: 'TX-9279', type: 'Refund', amount: '-$89.99', cut: '-$26.99', date: 'Yesterday', positive: false },
              ].map((tx) => (
                <tr key={tx.id} className="hover:bg-bg/50 transition-colors">
                  <td className="px-8 py-5 text-text font-mono font-bold text-xs">{tx.id}</td>
                  <td className="px-8 py-5 font-medium text-muted">{tx.type}</td>
                  <td className={`px-8 py-5 font-bold ${tx.positive ? 'text-text' : 'text-danger'}`}>{tx.amount}</td>
                  <td className="px-8 py-5 font-bold text-success">{tx.cut}</td>
                  <td className="px-8 py-5 text-right font-medium text-muted text-xs">{tx.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
