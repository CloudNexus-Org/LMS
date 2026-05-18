import { CreditCard, Download, Zap, Check } from 'lucide-react';

const INVOICES = [
  { id: 'INV-2026-05', date: 'May 1, 2026', amount: '$29.00', status: 'Paid' },
  { id: 'INV-2026-04', date: 'Apr 1, 2026', amount: '$29.00', status: 'Paid' },
  { id: 'INV-2026-03', date: 'Mar 1, 2026', amount: '$29.00', status: 'Paid' },
];

export default function BillingSubscriptionPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-text font-display tracking-tight">Billing & Subscription</h1>
        <p className="text-muted mt-1 font-medium">Manage your SaaS subscription and payment methods.</p>
      </div>

      {/* Current Plan Card */}
      <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-surface shadow-card p-8 sm:p-10">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Zap className="h-48 w-48 text-primary" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary-soft to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-primary text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4 shadow-sm">
              <Zap className="h-3 w-3 fill-white" /> Active Plan
            </div>
            <h2 className="text-4xl font-display font-bold text-text mb-2">Student Pro</h2>
            <p className="text-muted font-medium mb-6">Unlock all premium courses, mentors, and certificates.</p>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-text">$29</span>
              <span className="text-muted font-medium">/month</span>
            </div>
          </div>

          <div className="space-y-3 w-full sm:w-auto">
            <button className="w-full sm:w-auto px-8 py-3 bg-text text-bg rounded-xl font-bold text-sm shadow-md hover:opacity-90 transition-opacity">
              Upgrade to Mentor
            </button>
            <button className="w-full sm:w-auto px-8 py-3 bg-transparent text-text border border-border rounded-xl font-bold text-sm hover:bg-surface hover:border-border-strong transition-all">
              Cancel Subscription
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Payment Method */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="font-bold text-text text-xl">Payment Method</h3>
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-12 w-16 bg-[#1a1f36] rounded text-white flex items-center justify-center font-bold text-xl italic shadow-inner">
                Visa
              </div>
              <div>
                <p className="font-bold text-text">•••• •••• •••• 4242</p>
                <p className="text-sm text-muted">Expires 12/28</p>
              </div>
            </div>
            <button className="w-full py-2.5 border border-border rounded-lg text-sm font-bold text-text hover:bg-bg transition-colors">
              Update Method
            </button>
          </div>
        </div>

        {/* Billing History */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-bold text-text text-xl">Billing History</h3>
          <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-bg border-b border-border">
                  <tr>
                    <th className="px-6 py-4 font-bold text-muted">Date</th>
                    <th className="px-6 py-4 font-bold text-muted">Invoice</th>
                    <th className="px-6 py-4 font-bold text-muted">Amount</th>
                    <th className="px-6 py-4 font-bold text-muted text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {INVOICES.map((inv) => (
                    <tr key={inv.id} className="hover:bg-bg/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-text">{inv.date}</td>
                      <td className="px-6 py-4 text-muted font-mono">{inv.id}</td>
                      <td className="px-6 py-4 font-bold text-text">{inv.amount}</td>
                      <td className="px-6 py-4 text-right">
                        <button className="inline-flex items-center gap-2 text-primary hover:text-primary-hover font-semibold transition-colors">
                          <Download className="h-4 w-4" /> PDF
                        </button>
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
  );
}
