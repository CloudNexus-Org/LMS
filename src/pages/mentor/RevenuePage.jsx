import { DollarSign, Download, ArrowUpRight, TrendingUp } from 'lucide-react';

const PAYOUTS = [
  { id: 'PO-2026-05', date: 'May 1, 2026', amount: '$4,250.00', status: 'Processing' },
  { id: 'PO-2026-04', date: 'Apr 1, 2026', amount: '$3,890.00', status: 'Paid' },
  { id: 'PO-2026-03', date: 'Mar 1, 2026', amount: '$4,010.00', status: 'Paid' },
];

export default function RevenuePage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-text font-display tracking-tight">Revenue & Payouts</h1>
        <p className="text-muted mt-1 font-medium">Track your earnings and payout history.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-text text-bg rounded-3xl p-8 sm:p-10 shadow-card relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <DollarSign className="h-48 w-48" />
          </div>
          <div className="relative z-10 flex flex-col h-full justify-center">
            <div className="inline-flex items-center gap-2 bg-bg/20 text-bg text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg mb-6 max-w-max backdrop-blur-sm border border-bg/10">
              Next Payout: June 1, 2026
            </div>
            <p className="text-bg/80 font-bold uppercase tracking-widest text-sm mb-2">Available Balance</p>
            <h2 className="text-5xl sm:text-6xl font-display font-bold mb-8">$4,250.00</h2>
            <div className="flex gap-4">
              <button className="px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm shadow-md hover:opacity-90 transition-opacity">
                Withdraw Funds
              </button>
              <button className="px-6 py-3 bg-transparent text-bg border border-bg/30 rounded-xl font-bold text-sm hover:bg-bg/10 transition-colors">
                Tax Documents
              </button>
            </div>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-3xl p-8 flex flex-col justify-center">
          <div className="h-12 w-12 bg-[color:color-mix(in_oklab,var(--success)_15%,transparent)] text-success rounded-xl flex items-center justify-center mb-6">
            <TrendingUp className="h-6 w-6" />
          </div>
          <p className="text-sm font-bold text-muted uppercase tracking-wider mb-2">Lifetime Earnings</p>
          <h3 className="text-3xl font-bold text-text font-display mb-2">$42,850.00</h3>
          <p className="text-sm font-semibold text-success flex items-center gap-1">+12% vs last year</p>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 sm:p-8 border-b border-border flex items-center justify-between">
          <h3 className="font-bold text-xl text-text">Payout History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-bg border-b border-border">
              <tr>
                <th className="px-8 py-5 font-bold text-muted uppercase tracking-wider text-[11px]">Date</th>
                <th className="px-8 py-5 font-bold text-muted uppercase tracking-wider text-[11px]">Transaction ID</th>
                <th className="px-8 py-5 font-bold text-muted uppercase tracking-wider text-[11px]">Status</th>
                <th className="px-8 py-5 font-bold text-muted uppercase tracking-wider text-[11px]">Amount</th>
                <th className="px-8 py-5 font-bold text-muted uppercase tracking-wider text-[11px] text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {PAYOUTS.map((inv) => (
                <tr key={inv.id} className="hover:bg-bg/50 transition-colors">
                  <td className="px-8 py-5 font-bold text-text">{inv.date}</td>
                  <td className="px-8 py-5 text-muted font-mono">{inv.id}</td>
                  <td className="px-8 py-5">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      inv.status === 'Paid' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 font-bold text-text text-base">{inv.amount}</td>
                  <td className="px-8 py-5 text-right">
                    <button className="inline-flex items-center gap-1.5 text-primary hover:text-primary-hover font-bold transition-colors bg-primary-soft px-3 py-1.5 rounded-lg text-xs">
                      <Download className="h-3.5 w-3.5" /> PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
