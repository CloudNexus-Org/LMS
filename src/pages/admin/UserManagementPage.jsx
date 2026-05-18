import { Search, Filter, Shield, MoreVertical, Edit3, Ban, ShieldCheck } from 'lucide-react';

const USERS = [
  { id: 1, name: 'Alex Chen', email: 'alex.chen@example.com', role: 'Student', joined: 'Mar 2026', status: 'Active' },
  { id: 2, name: 'Dr. Arjan Singh', email: 'arjan@cloudnexus.com', role: 'Mentor', joined: 'Jan 2024', status: 'Active' },
  { id: 3, name: 'Admin User', email: 'admin@cloudnexus.com', role: 'Admin', joined: 'Dec 2023', status: 'Active' },
  { id: 4, name: 'Spam Account', email: 'fake@example.com', role: 'Student', joined: 'May 2026', status: 'Banned' },
];

export default function UserManagementPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-text font-display tracking-tight">User Management</h1>
        <p className="text-muted mt-1 font-medium">Manage students, mentors, and platform administrators.</p>
      </div>

      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row items-center gap-4 justify-between bg-bg/50">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <input 
              type="text" 
              placeholder="Search by name, email, or ID..." 
              className="w-full bg-surface border border-border rounded-lg pl-9 pr-4 py-2 text-sm focus:border-primary outline-none text-text transition-all font-medium" 
            />
          </div>
          <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-surface border border-border rounded-lg text-xs font-bold text-text hover:bg-bg transition-colors shadow-sm">
            <Filter className="h-4 w-4" /> Filter Role
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-bg border-b border-border">
              <tr>
                <th className="px-6 py-4 font-bold text-muted uppercase tracking-wider text-[11px]">User Details</th>
                <th className="px-6 py-4 font-bold text-muted uppercase tracking-wider text-[11px]">Role</th>
                <th className="px-6 py-4 font-bold text-muted uppercase tracking-wider text-[11px]">Joined</th>
                <th className="px-6 py-4 font-bold text-muted uppercase tracking-wider text-[11px]">Status</th>
                <th className="px-6 py-4 font-bold text-muted uppercase tracking-wider text-[11px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {USERS.map((user) => (
                <tr key={user.id} className="hover:bg-bg/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-bg border border-border text-muted font-bold flex items-center justify-center text-xs shrink-0">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-bold text-text">{user.name}</p>
                        <p className="text-xs text-muted font-medium">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border ${
                      user.role === 'Admin' ? 'bg-danger/10 border-danger/20 text-danger' : 
                      user.role === 'Mentor' ? 'bg-primary/10 border-primary/20 text-primary' : 
                      'bg-surface border-border text-text'
                    }`}>
                      {user.role === 'Admin' ? <ShieldCheck className="h-3 w-3" /> : user.role === 'Mentor' ? <Shield className="h-3 w-3" /> : null}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-muted">{user.joined}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${
                      user.status === 'Active' ? 'text-success' : 'text-danger'
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${user.status === 'Active' ? 'bg-success' : 'bg-danger'}`} />
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="h-8 w-8 flex items-center justify-center rounded-lg border border-border text-text hover:bg-surface hover:text-primary transition-colors">
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button className="h-8 w-8 flex items-center justify-center rounded-lg border border-border text-text hover:bg-surface hover:text-danger hover:border-danger transition-colors">
                        <Ban className="h-4 w-4" />
                      </button>
                    </div>
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
