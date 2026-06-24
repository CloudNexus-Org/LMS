import { useState, useMemo } from 'react';
import {
  Search, Shield, Edit3, Ban, ShieldCheck,
  UserPlus, Users, X, Mail,
  UserCheck, UserX, Download, Clock,
  Eye, BarChart2,
} from 'lucide-react';

const USERS = [
  { id: 1, name: 'Alex Chen', email: 'alex.chen@example.com', role: 'Student', joined: 'Mar 12, 2026', status: 'Active', courses: 4, lastActive: '2 hours ago', avatar: 'AC', spend: '$360' },
  { id: 2, name: 'Dr. Arjan Singh', email: 'arjan@cloudnexus.com', role: 'Mentor', joined: 'Jan 5, 2024', status: 'Active', courses: 3, lastActive: '30 mins ago', avatar: 'AS', spend: '$0' },
  { id: 3, name: 'Sarah Miller', email: 'sarah.m@example.com', role: 'Student', joined: 'Feb 18, 2026', status: 'Active', courses: 6, lastActive: '5 hours ago', avatar: 'SM', spend: '$540' },
  { id: 4, name: 'Admin User', email: 'admin@cloudnexus.com', role: 'Admin', joined: 'Dec 1, 2023', status: 'Active', courses: 0, lastActive: '1 hour ago', avatar: 'AU', spend: '$0' },
  { id: 5, name: 'James Wilson', email: 'j.wilson@example.com', role: 'Student', joined: 'Jan 22, 2026', status: 'Inactive', courses: 2, lastActive: '3 days ago', avatar: 'JW', spend: '$180' },
  { id: 6, name: 'Priya Nair', email: 'priya.n@cloudnexus.com', role: 'Mentor', joined: 'Mar 3, 2025', status: 'Active', courses: 5, lastActive: '1 day ago', avatar: 'PN', spend: '$0' },
  { id: 7, name: 'Spam Account', email: 'fake1234@spam.com', role: 'Student', joined: 'May 5, 2026', status: 'Banned', courses: 0, lastActive: 'Never', avatar: 'SA', spend: '$0' },
  { id: 8, name: 'Emily Davis', email: 'emily.d@example.com', role: 'Student', joined: 'Apr 10, 2026', status: 'Active', courses: 3, lastActive: '4 hours ago', avatar: 'ED', spend: '$270' },
];

const GRAD_COLORS = [
  'from-blue-500 to-cyan-400', 'from-emerald-500 to-lime-400',
  'from-violet-500 to-fuchsia-400', 'from-orange-500 to-yellow-400',
  'from-pink-500 to-rose-400', 'from-cyan-500 to-blue-400',
  'from-red-500 to-orange-400', 'from-indigo-500 to-purple-400',
];

const ROLE_CONFIG = {
  Admin:   { color: 'text-danger',   bg: 'bg-danger/10',   border: 'border-danger/20',   icon: ShieldCheck },
  Mentor:  { color: 'text-primary',  bg: 'bg-primary/10',  border: 'border-primary/20',  icon: Shield },
  Student: { color: 'text-text',     bg: 'bg-border',      border: 'border-border',      icon: Users },
};

const STATUS_CONFIG = {
  Active:   { color: 'text-success', dot: 'bg-success shadow-[0_0_8px_rgba(5,150,105,0.6)]' },
  Inactive: { color: 'text-warning', dot: 'bg-warning shadow-[0_0_8px_rgba(217,119,6,0.5)]' },
  Banned:   { color: 'text-danger',  dot: 'bg-danger  shadow-[0_0_8px_rgba(220,38,38,0.5)]' },
};

export default function UserManagementPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedUser, setSelectedUser] = useState(null);

  const filtered = useMemo(() => USERS.filter(u => {
    const q = search.toLowerCase();
    const matchQ = u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const matchRole = roleFilter === 'All' || u.role === roleFilter;
    const matchStatus = statusFilter === 'All' || u.status === statusFilter;
    return matchQ && matchRole && matchStatus;
  }), [search, roleFilter, statusFilter]);

  const total = USERS.length;
  const active = USERS.filter(u => u.status === 'Active').length;
  const banned = USERS.filter(u => u.status === 'Banned').length;
  const mentors = USERS.filter(u => u.role === 'Mentor').length;

  const stats = [
    {
      label: 'Total users',
      value: total,
      meta: '+284 this month',
      metaTone: 'success',
      icon: Users,
      iconColor: 'text-primary',
    },
    {
      label: 'Active accounts',
      value: active,
      meta: `${Math.round((active / total) * 100)}% of directory`,
      metaTone: 'muted',
      icon: UserCheck,
      iconColor: 'text-success',
    },
    {
      label: 'Mentors',
      value: mentors,
      meta: 'Teaching roles',
      metaTone: 'muted',
      icon: Shield,
      iconColor: 'text-accent',
    },
    {
      label: 'Banned',
      value: banned,
      meta: 'Requires review',
      metaTone: banned > 0 ? 'warning' : 'muted',
      icon: UserX,
      iconColor: 'text-warning',
    },
  ];

  return (
    <div className="dashboard-page mx-auto w-full max-w-[1320px] space-y-4">

      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[32px] font-bold tracking-tight text-text sm:text-[36px]">
            User Management
          </h1>
          <p className="mt-1 text-[15px] text-muted">
            Review accounts, roles, and access for students, mentors, and administrators.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-[13px] font-medium text-muted transition-colors hover:text-text"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-primary-hover"
          >
            <UserPlus className="h-4 w-4" />
            Add User
          </button>
        </div>
      </div>

      <section className="admin-stat-strip" aria-label="User directory statistics">
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
                <p className={`admin-stat-meta ${
                  stat.metaTone === 'muted'
                    ? 'admin-stat-meta-muted'
                    : stat.metaTone === 'warning'
                      ? 'admin-stat-meta-warning'
                      : ''
                }`}>
                  {stat.meta}
                </p>
              </div>
            </div>
          );
        })}
      </section>

      {/* ── TABLE CARD ── */}
      <div className="bg-surface border border-border rounded-[5px] shadow-sm overflow-hidden">

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-5 border-b border-border bg-bg/30">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              type="text"
              placeholder="Search name, email..."
              className="w-full h-10 rounded-[5px] border border-border bg-surface pl-10 pr-8 text-sm font-medium text-text focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Role filter */}
          <div className="flex items-center gap-1 bg-bg border border-border rounded-[5px] p-1">
            {['All', 'Student', 'Mentor', 'Admin'].map(r => (
              <button key={r} onClick={() => setRoleFilter(r)}
                className={`px-3 py-1.5 rounded-[5px] text-xs font-bold transition-all ${roleFilter === r ? 'bg-primary text-white shadow-sm' : 'text-muted hover:text-text'}`}>
                {r}
              </button>
            ))}
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1 bg-bg border border-border rounded-[5px] p-1">
            {['All', 'Active', 'Inactive', 'Banned'].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-[5px] text-xs font-bold transition-all ${statusFilter === s ? 'bg-primary text-white shadow-sm' : 'text-muted hover:text-text'}`}>
                {s}
              </button>
            ))}
          </div>

          <span className="text-xs font-bold text-muted ml-auto">{filtered.length} users</span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead className="border-b border-border bg-bg/50">
              <tr>
                {['User', 'Role', 'Courses', 'Last Active', 'Status', 'Spend', ''].map(h => (
                  <th key={h} className="px-5 py-4 text-[11px] font-bold text-muted uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((user, i) => {
                const rc = ROLE_CONFIG[user.role];
                const sc = STATUS_CONFIG[user.status];
                const RoleIcon = rc.icon;
                return (
                  <tr key={user.id} className="group hover:bg-bg/40 transition-colors">
                    {/* User */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`relative h-10 w-10 rounded-lg bg-gradient-to-br ${GRAD_COLORS[i % GRAD_COLORS.length]} flex items-center justify-center text-white text-xs font-bold shadow-sm flex-shrink-0 overflow-hidden`}>
                          <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent" />
                          <span className="relative z-10">{user.avatar}</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-text leading-tight">{user.name}</p>
                          <p className="text-xs text-muted">{user.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[5px] text-xs font-bold border ${rc.bg} ${rc.border} ${rc.color}`}>
                        <RoleIcon className="h-3 w-3" /> {user.role}
                      </span>
                    </td>

                    {/* Courses */}
                    <td className="px-5 py-4">
                      <span className="text-sm font-bold text-text">{user.courses > 0 ? user.courses : '—'}</span>
                    </td>

                    {/* Last Active */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-muted font-medium">
                        <Clock className="h-3.5 w-3.5" />
                        {user.lastActive}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${sc.color}`}>
                        <span className={`h-1.5 w-1.5 rounded-lg ${sc.dot}`} />
                        {user.status}
                      </span>
                    </td>

                    {/* Spend */}
                    <td className="px-5 py-4">
                      <span className={`text-sm font-bold ${user.spend !== '$0' ? 'text-success' : 'text-muted'}`}>{user.spend}</span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setSelectedUser(user)} className="h-8 w-8 flex items-center justify-center rounded-[5px] border border-border text-muted hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all" title="View">
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button className="h-8 w-8 flex items-center justify-center rounded-[5px]  border border-border text-muted hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all" title="Edit">
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button className="h-8 w-8 flex items-center justify-center rounded-[5px] border border-border text-muted hover:text-danger hover:border-danger/40 hover:bg-danger/5 transition-all" title={user.status === 'Banned' ? 'Unban' : 'Ban'}>
                          <Ban className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="py-20 text-center">
              <Users className="h-12 w-12 mx-auto text-muted opacity-20 mb-4" />
              <p className="font-bold text-text">No users found</p>
              <p className="text-sm text-muted mt-1">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>

        {/* Pagination footer */}
        <div className="px-5 py-3 border-t border-border bg-bg/30 flex items-center justify-between">
          <p className="text-xs font-bold text-muted">Showing {filtered.length} of {USERS.length} users</p>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map(p => (
              <button key={p} className={`h-7 w-7 rounded-[5px] text-xs font-bold transition-all ${p === 1 ? 'bg-primary text-white' : 'text-muted hover:bg-bg border border-border hover:text-text'}`}>{p}</button>
            ))}
          </div>
        </div>
      </div>

      {/* ── USER DETAIL MODAL ── */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedUser(null)}>
          <div className="bg-surface border border-border rounded-[5px] shadow-elevated w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-4">
                <div className={`h-14 w-14 rounded-lg bg-gradient-to-br ${GRAD_COLORS[selectedUser.id % GRAD_COLORS.length]} flex items-center justify-center text-white font-bold text-lg shadow-sm`}>
                  {selectedUser.avatar}
                </div>
                <div>
                  <h3 className="font-bold text-text text-lg">{selectedUser.name}</h3>
                  <p className="text-sm text-muted">{selectedUser.email}</p>
                </div>
              </div>
              <button onClick={() => setSelectedUser(null)} className="text-muted hover:text-text p-1">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              {[
                { label: 'Role', value: selectedUser.role },
                { label: 'Status', value: selectedUser.status },
                { label: 'Joined', value: selectedUser.joined },
                { label: 'Last Active', value: selectedUser.lastActive },
                { label: 'Courses', value: selectedUser.courses || '—' },
                { label: 'Total Spend', value: selectedUser.spend },
              ].map(item => (
                <div key={item.label} className="bg-bg border border-border rounded-xl p-3">
                  <p className="text-xs font-bold text-muted uppercase tracking-wider">{item.label}</p>
                  <p className="font-bold text-text mt-1">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary text-white rounded-[5px] text-sm font-bold hover:bg-primary-hover transition-all">
                <Mail className="h-4 w-4" /> Message
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-bg border border-border rounded-[5px]   text-sm font-bold text-muted hover:text-text hover:border-primary/40 transition-all">
                <BarChart2 className="h-4 w-4" /> Analytics
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-danger/10 border border-danger/20 rounded-[5px] text-sm font-bold text-danger hover:bg-danger hover:text-white transition-all">
                <Ban className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
