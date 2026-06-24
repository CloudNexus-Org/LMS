import { useState, useMemo, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Search, Shield, Edit3, Ban, ShieldCheck,
  UserPlus, Users, X,
  UserCheck, UserX, Download, Clock,
  Eye, CheckCircle2, Trash2, AlertTriangle,
} from 'lucide-react';
import { loadAdminUsers, saveAdminUsers, updateAdminUser, removeAdminUser, toggleUserBan, MENTOR_TRACK_OPTIONS } from '@/data/adminUsers';

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
  const location = useLocation();
  const navigate = useNavigate();
  const [users, setUsers] = useState(() => loadAdminUsers());
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const persistUsers = (next) => {
    setUsers(next);
    saveAdminUsers(next);
  };

  const showToast = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const handleView = (user) => {
    setSelectedUser(user);
  };

  const handleEdit = (user) => {
    setEditingUser({ ...user });
    setSelectedUser(null);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingUser) return;

    const name = editingUser.name?.trim();
    const email = editingUser.email?.trim().toLowerCase();

    if (!name || !email) {
      showToast('Name and email are required.');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      showToast('Please enter a valid email address.');
      return;
    }

    const duplicate = users.some(
      (u) => u.id !== editingUser.id && u.email.toLowerCase() === email
    );
    if (duplicate) {
      showToast('Another user already uses this email.');
      return;
    }

    const next = updateAdminUser(users, editingUser.id, {
      name,
      email,
      role: editingUser.role,
      status: editingUser.status,
      professionalRole: editingUser.professionalRole,
      company: editingUser.company,
      trackLabel: editingUser.trackLabel,
      location: editingUser.location,
      bio: editingUser.bio,
    });

    persistUsers(next);
    setEditingUser(null);
    showToast(`${name} was updated successfully.`);
  };

  const handleBanToggle = (user) => {
    if (user.role === 'Admin') {
      showToast('Admin accounts cannot be banned.');
      return;
    }

    const next = toggleUserBan(users, user.id);
    persistUsers(next);

    const updated = next.find((u) => u.id === user.id);
    if (selectedUser?.id === user.id) {
      setSelectedUser(updated ?? null);
    }

    showToast(
      updated?.status === 'Banned'
        ? `${user.name} has been banned.`
        : `${user.name} has been unbanned.`
    );
  };

  const handleDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.role === 'Admin') {
      showToast('Admin accounts cannot be deleted.');
      setDeleteTarget(null);
      return;
    }

    const next = removeAdminUser(users, deleteTarget.id);
    persistUsers(next);

    if (selectedUser?.id === deleteTarget.id) setSelectedUser(null);
    if (editingUser?.id === deleteTarget.id) setEditingUser(null);

    showToast(`${deleteTarget.name} was removed from the directory.`);
    setDeleteTarget(null);
  };

  const updateEditField = (field, value) => {
    setEditingUser((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  useEffect(() => {
    setUsers(loadAdminUsers());
  }, [location.key]);

  useEffect(() => {
    if (!location.state?.mentorAdded) return;

    setSuccessMessage(`${location.state.mentorAdded} was added as a mentor.`);
    navigate(location.pathname, { replace: true, state: {} });

    const timer = setTimeout(() => setSuccessMessage(''), 5000);
    return () => clearTimeout(timer);
  }, [location.state, location.pathname, navigate]);

  const filtered = useMemo(() => users.filter(u => {
    const q = search.toLowerCase();
    const matchQ = u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const matchRole = roleFilter === 'All' || u.role === roleFilter;
    const matchStatus = statusFilter === 'All' || u.status === statusFilter;
    return matchQ && matchRole && matchStatus;
  }), [search, roleFilter, statusFilter, users]);

  const total = users.length;
  const active = users.filter(u => u.status === 'Active').length;
  const banned = users.filter(u => u.status === 'Banned').length;
  const mentors = users.filter(u => u.role === 'Mentor').length;

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
          <Link
            to="/admin/users/add-mentor"
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-primary-hover"
          >
            <UserPlus className="h-4 w-4" />
            Add Mentor
          </Link>
        </div>
      </div>

      {successMessage ? (
        <div className="flex items-center gap-2 rounded-lg border border-success/25 bg-success/10 px-4 py-3 text-sm font-semibold text-success">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {successMessage}
        </div>
      ) : null}

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
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleView(user)}
                          className="h-8 w-8 flex items-center justify-center rounded-[5px] border border-border text-muted hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all"
                          title="View"
                          aria-label={`View ${user.name}`}
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEdit(user)}
                          className="h-8 w-8 flex items-center justify-center rounded-[5px] border border-border text-muted hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all"
                          title="Edit"
                          aria-label={`Edit ${user.name}`}
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleBanToggle(user)}
                          disabled={user.role === 'Admin'}
                          className="h-8 w-8 flex items-center justify-center rounded-[5px] border border-border text-muted hover:text-danger hover:border-danger/40 hover:bg-danger/5 transition-all disabled:cursor-not-allowed disabled:opacity-40"
                          title={user.status === 'Banned' ? 'Unban user' : 'Ban user'}
                          aria-label={user.status === 'Banned' ? `Unban ${user.name}` : `Ban ${user.name}`}
                        >
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
          <p className="text-xs font-bold text-muted">Showing {filtered.length} of {users.length} users</p>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map(p => (
              <button key={p} className={`h-7 w-7 rounded-[5px] text-xs font-bold transition-all ${p === 1 ? 'bg-primary text-white' : 'text-muted hover:bg-bg border border-border hover:text-text'}`}>{p}</button>
            ))}
          </div>
        </div>
      </div>

      {/* ── USER DETAIL MODAL ── */}
      {selectedUser && (() => {
        const viewed = users.find((u) => u.id === selectedUser.id) ?? selectedUser;
        return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedUser(null)}>
          <div className="bg-surface border border-border rounded-[5px] shadow-elevated w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-4">
                <div className={`h-14 w-14 rounded-lg bg-gradient-to-br ${GRAD_COLORS[viewed.id % GRAD_COLORS.length]} flex items-center justify-center text-white font-bold text-lg shadow-sm`}>
                  {viewed.avatar}
                </div>
                <div>
                  <h3 className="font-bold text-text text-lg">{viewed.name}</h3>
                  <p className="text-sm text-muted">{viewed.email}</p>
                </div>
              </div>
              <button type="button" onClick={() => setSelectedUser(null)} className="text-muted hover:text-text p-1">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              {[
                { label: 'Role', value: viewed.role },
                { label: 'Status', value: viewed.status },
                { label: 'Joined', value: viewed.joined },
                { label: 'Last Active', value: viewed.lastActive },
                { label: 'Courses', value: viewed.courses || '—' },
                { label: 'Total Spend', value: viewed.spend },
                ...(viewed.role === 'Mentor' && viewed.trackLabel
                  ? [{ label: 'Track', value: viewed.trackLabel }]
                  : []),
                ...(viewed.professionalRole
                  ? [{ label: 'Title', value: viewed.professionalRole }]
                  : []),
                ...(viewed.company ? [{ label: 'Company', value: viewed.company }] : []),
              ].map(item => (
                <div key={item.label} className="bg-bg border border-border rounded-xl p-3">
                  <p className="text-xs font-bold text-muted uppercase tracking-wider">{item.label}</p>
                  <p className="font-bold text-text mt-1">{item.value}</p>
                </div>
              ))}
            </div>

            {viewed.bio ? (
              <p className="mb-5 rounded-xl border border-border bg-bg/50 p-3 text-sm text-muted">
                {viewed.bio}
              </p>
            ) : null}

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => handleEdit(viewed)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary text-white rounded-[5px] text-sm font-bold hover:bg-primary-hover transition-all min-w-[120px]"
              >
                <Edit3 className="h-4 w-4" /> Edit
              </button>
              <button
                type="button"
                onClick={() => handleBanToggle(viewed)}
                disabled={viewed.role === 'Admin'}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-warning/10 border border-warning/20 rounded-[5px] text-sm font-bold text-warning hover:bg-warning hover:text-white transition-all disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Ban className="h-4 w-4" />
                {viewed.status === 'Banned' ? 'Unban' : 'Ban'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedUser(null);
                  if (viewed.role !== 'Admin') setDeleteTarget(viewed);
                  else showToast('Admin accounts cannot be deleted.');
                }}
                disabled={viewed.role === 'Admin'}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-danger/10 border border-danger/20 rounded-[5px] text-sm font-bold text-danger hover:bg-danger hover:text-white transition-all disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
        );
      })()}

      {/* ── EDIT USER MODAL ── */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setEditingUser(null)}>
          <form
            className="bg-surface border border-border rounded-[5px] shadow-elevated w-full max-w-lg p-6 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSaveEdit}
          >
            <div className="flex items-start justify-between mb-5">
              <div>
                <h3 className="font-bold text-text text-lg">Edit user</h3>
                <p className="text-sm text-muted">Update account details and access.</p>
              </div>
              <button type="button" onClick={() => setEditingUser(null)} className="text-muted hover:text-text p-1">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <label className="block">
                <span className="mb-1.5 block text-[11px] font-medium text-muted">Full name</span>
                <input
                  value={editingUser.name}
                  onChange={(e) => updateEditField('name', e.target.value)}
                  className="w-full h-11 rounded-xl border border-border bg-bg px-4 text-sm text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-[11px] font-medium text-muted">Email</span>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => updateEditField('email', e.target.value)}
                  className="w-full h-11 rounded-xl border border-border bg-bg px-4 text-sm text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                  required
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-1.5 block text-[11px] font-medium text-muted">Role</span>
                  <select
                    value={editingUser.role}
                    onChange={(e) => updateEditField('role', e.target.value)}
                    disabled={editingUser.role === 'Admin'}
                    className="w-full h-11 rounded-xl border border-border bg-bg px-4 text-sm text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:opacity-60"
                  >
                    <option value="Student">Student</option>
                    <option value="Mentor">Mentor</option>
                    <option value="Admin">Admin</option>
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-[11px] font-medium text-muted">Status</span>
                  <select
                    value={editingUser.status}
                    onChange={(e) => updateEditField('status', e.target.value)}
                    disabled={editingUser.role === 'Admin'}
                    className="w-full h-11 rounded-xl border border-border bg-bg px-4 text-sm text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:opacity-60"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Banned">Banned</option>
                  </select>
                </label>
              </div>

              {editingUser.role === 'Mentor' ? (
                <>
                  <label className="block">
                    <span className="mb-1.5 block text-[11px] font-medium text-muted">Professional role</span>
                    <input
                      value={editingUser.professionalRole || ''}
                      onChange={(e) => updateEditField('professionalRole', e.target.value)}
                      className="w-full h-11 rounded-xl border border-border bg-bg px-4 text-sm text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-[11px] font-medium text-muted">Company</span>
                    <input
                      value={editingUser.company || ''}
                      onChange={(e) => updateEditField('company', e.target.value)}
                      className="w-full h-11 rounded-xl border border-border bg-bg px-4 text-sm text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-[11px] font-medium text-muted">Teaching track</span>
                    <select
                      value={editingUser.trackLabel || MENTOR_TRACK_OPTIONS[0]}
                      onChange={(e) => updateEditField('trackLabel', e.target.value)}
                      className="w-full h-11 rounded-xl border border-border bg-bg px-4 text-sm text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                    >
                      {MENTOR_TRACK_OPTIONS.map((track) => (
                        <option key={track} value={track}>{track}</option>
                      ))}
                    </select>
                  </label>
                </>
              ) : null}
            </div>

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
              {editingUser.role !== 'Admin' ? (
                <button
                  type="button"
                  onClick={() => {
                    setDeleteTarget(editingUser);
                    setEditingUser(null);
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-danger/30 px-4 py-2.5 text-sm font-bold text-danger hover:bg-danger/10"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete user
                </button>
              ) : (
                <span />
              )}
              <div className="flex gap-2 sm:ml-auto">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-muted hover:text-text"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-primary-hover"
                >
                  Save changes
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ── DELETE CONFIRMATION ── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setDeleteTarget(null)}>
          <div
            className="bg-surface border border-border rounded-[5px] shadow-elevated w-full max-w-sm p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-danger/10 text-danger">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-text">Delete user?</h3>
            <p className="mt-2 text-sm text-muted">
              Remove <span className="font-semibold text-text">{deleteTarget.name}</span> from the directory?
              This cannot be undone.
            </p>
            <div className="mt-6 flex gap-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="flex-1 rounded-lg border border-border py-2.5 text-sm font-semibold text-muted hover:text-text"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 rounded-lg bg-danger py-2.5 text-sm font-bold text-white hover:opacity-90"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
