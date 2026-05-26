import { useState } from 'react';
import {
  Users, Search, Filter, Mail, MoreVertical, ShieldCheck,
  ChevronDown, Sparkles, TrendingUp, Activity, UserCheck,
  MessageSquare, BookOpen, Clock, Star, Download, X,
  ArrowUpRight, Award, BarChart2, ChevronRight
} from 'lucide-react';

const STUDENTS = [
  { id: 1, name: 'Alex Chen', email: 'alex.chen@example.com', avatar: 'AC', enrolled: 'Advanced State Management', progress: 85, lastActive: '2 hours ago', status: 'Active', joined: 'Jan 12, 2026', grade: 'A', messages: 3 },
  { id: 2, name: 'Sarah Miller', email: 'sarah.m@example.com', avatar: 'SM', enrolled: 'Cloud Architecture', progress: 32, lastActive: '5 hours ago', status: 'Active', joined: 'Feb 3, 2026', grade: 'B+', messages: 0 },
  { id: 3, name: 'James Wilson', email: 'j.wilson@example.com', avatar: 'JW', enrolled: 'Cloud Architecture', progress: 100, lastActive: '1 day ago', status: 'Completed', joined: 'Dec 8, 2025', grade: 'A+', messages: 1 },
  { id: 4, name: 'Emily Davis', email: 'emily.d@example.com', avatar: 'ED', enrolled: 'Advanced State Management', progress: 12, lastActive: '3 days ago', status: 'Inactive', joined: 'Mar 20, 2026', grade: 'C', messages: 0 },
  { id: 5, name: 'Raj Patel', email: 'raj.p@example.com', avatar: 'RP', enrolled: 'Advanced State Management', progress: 60, lastActive: '1 hour ago', status: 'Active', joined: 'Feb 14, 2026', grade: 'B', messages: 2 },
  { id: 6, name: 'Mia Johansson', email: 'mia.j@example.com', avatar: 'MJ', enrolled: 'Cloud Architecture', progress: 75, lastActive: '4 hours ago', status: 'Active', joined: 'Jan 28, 2026', grade: 'A-', messages: 0 },
];

const GRAD_COLORS = [
  'from-blue-500 to-cyan-400',
  'from-emerald-500 to-lime-400',
  'from-orange-500 to-yellow-400',
  'from-violet-500 to-fuchsia-400',
  'from-pink-500 to-rose-400',
  'from-cyan-500 to-blue-400',
];

const STATUS_CONFIG = {
  Active: { color: 'text-success', bg: 'bg-success/10', dot: 'bg-success shadow-[0_0_8px_rgba(5,150,105,0.6)]' },
  Completed: { color: 'text-primary', bg: 'bg-primary/10', dot: 'bg-primary shadow-[0_0_8px_rgba(44,91,255,0.6)]' },
  Inactive: { color: 'text-warning', bg: 'bg-warning/10', dot: 'bg-warning shadow-[0_0_8px_rgba(217,119,6,0.5)]' },
};

export default function StudentsPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [selectedStudent, setSelectedStudent] = useState(null);

  const filtered = STUDENTS.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.enrolled.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || s.status === filter;
    return matchSearch && matchFilter;
  });

  const active = STUDENTS.filter(s => s.status === 'Active').length;
  const completed = STUDENTS.filter(s => s.status === 'Completed').length;
  const avgProgress = Math.round(STUDENTS.reduce((a, s) => a + s.progress, 0) / STUDENTS.length);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">

      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-primary mb-3">
            <Sparkles className="h-3 w-3" />
            Student Management
          </div>
          <h1 className="text-[42px] font-bold text-text font-display tracking-tight">Student Roster</h1>
          <p className="text-muted mt-1 font-medium">Manage learners, track progress, and foster engagement.</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-surface border border-border rounded-xl font-bold text-sm text-muted hover:text-text hover:border-primary/40 transition-all shadow-sm">
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>

      {/* ── KPI STRIP ── */}
<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
  {[
    {
      label: 'Total Students',
      value: STUDENTS.length,
      icon: Users,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      trend: '+12%',
      line: 'bg-blue-500/20',
      hover: 'hover:border-blue-500/20',
    },
    {
      label: 'Active Now',
      value: active,
      icon: Activity,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
      trend: '',
      line: 'bg-emerald-500/20',
      hover: 'hover:border-emerald-500/20',
    },
    {
      label: 'Completed',
      value: completed,
      icon: Award,
      color: 'text-violet-500',
      bg: 'bg-violet-500/10',
      trend: '',
      line: 'bg-violet-500/20',
      hover: 'hover:border-violet-500/20',
    },
    {
      label: 'Avg Progress',
      value: `${avgProgress}%`,
      icon: TrendingUp,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10',
      trend: '+5%',
      line: 'bg-orange-500/20',
      hover: 'hover:border-orange-500/20',
    },
  ].map((kpi) => {
    const Icon = kpi.icon;

    return (
      <div
        key={kpi.label}
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

          ${kpi.hover}

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

                ${kpi.bg}
                ${kpi.color}

                shadow-sm
              `}
            >
              <Icon className="h-5 w-5" />
            </div>

            {/* VALUE + TITLE */}
            <div>
              <h3 className="text-[25px] font-black leading-none text-text">
                {kpi.value}
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
                {kpi.label}
              </p>
            </div>

            {/* TREND */}
            {kpi.trend && (
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
                {kpi.trend}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  })}
</div>



      {/* ── TABLE CARD ── */}
      <div className="bg-surface border border-border rounded-2xl shadow-sm overflow-hidden">

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-5 border-b border-border bg-bg/30">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              type="text"
              placeholder="Search by name, email, course..."
              className="w-full h-10 rounded-xl border border-border bg-surface pl-10 pr-4 text-sm font-medium text-text focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-bg border border-border rounded-xl p-1">
            {['All', 'Active', 'Completed', 'Inactive'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === f ? 'bg-primary text-white shadow-sm' : 'text-muted hover:text-text'}`}
              >
                {f}
              </button>
            ))}
          </div>

          <span className="text-xs font-bold text-muted ml-auto">{filtered.length} students</span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[720px]">
            <thead className="border-b border-border bg-bg/50">
              <tr>
                {['Student', 'Course', 'Progress', 'Grade', 'Status', 'Last Active', ''].map(h => (
                  <th key={h} className="px-5 py-4 text-[11px] font-bold text-muted uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((student, i) => {
                const sc = STATUS_CONFIG[student.status];
                return (
                  <tr key={student.id} className="group hover:bg-bg/40 transition-colors">
                    {/* Student */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`relative h-10 w-10 rounded-full bg-gradient-to-br ${GRAD_COLORS[i % GRAD_COLORS.length]} flex items-center justify-center text-white text-xs font-bold shadow-sm flex-shrink-0 overflow-hidden`}>
                          <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent" />
                          <span className="relative z-10">{student.avatar}</span>
                          {student.messages > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-primary text-white text-[9px] font-bold flex items-center justify-center z-20">{student.messages}</span>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-text leading-tight">{student.name}</p>
                          <p className="text-xs text-muted">{student.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Course */}
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-bold px-2.5 py-1 rounded-lg">
                        <BookOpen className="h-3 w-3" />
                        <span className="truncate max-w-[140px]">{student.enrolled}</span>
                      </span>
                    </td>

                    {/* Progress */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-1.5 w-20 rounded-full bg-border overflow-hidden">
                          <div
                            className={`absolute left-0 top-0 h-full rounded-full transition-all duration-700 ${
                              student.progress >= 80 ? 'bg-gradient-to-r from-success to-lime-400' :
                              student.progress >= 40 ? 'bg-gradient-to-r from-primary to-cyan-400' :
                              'bg-gradient-to-r from-warning to-yellow-400'
                            }`}
                            style={{ width: `${student.progress}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-text">{student.progress}%</span>
                      </div>
                    </td>

                    {/* Grade */}
                    <td className="px-5 py-4">
                      <span className="text-sm font-bold text-text">{student.grade}</span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 ${sc.bg} ${sc.color} text-[11px] font-bold px-2.5 py-1 rounded-full`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${sc.dot}`} />
                        {student.status}
                      </span>
                    </td>

                    {/* Last Active */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-muted font-medium">
                        <Clock className="h-3.5 w-3.5" />
                        {student.lastActive}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setSelectedStudent(student)}
                          className="h-8 w-8 flex items-center justify-center rounded-xl border border-border text-muted hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all"
                          title="View Profile"
                        >
                          <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                        <button className="h-8 w-8 flex items-center justify-center rounded-xl border border-border text-muted hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all">
                          <Mail className="h-3.5 w-3.5" />
                        </button>
                        <button className="h-8 w-8 flex items-center justify-center rounded-xl border border-border text-muted hover:text-text hover:bg-bg transition-all">
                          <MoreVertical className="h-3.5 w-3.5" />
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
              <p className="font-bold text-text">No students found</p>
              <p className="text-sm text-muted mt-1">Try adjusting your search or filter.</p>
            </div>
          )}
        </div>

        {/* Table footer */}
        <div className="px-5 py-3 border-t border-border bg-bg/30 flex items-center justify-between">
          <p className="text-xs font-bold text-muted">Showing {filtered.length} of {STUDENTS.length} students</p>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map(p => (
              <button key={p} className={`h-7 w-7 rounded-lg text-xs font-bold transition-all ${p === 1 ? 'bg-primary text-white' : 'text-muted hover:bg-bg hover:text-text border border-border'}`}>{p}</button>
            ))}
          </div>
        </div>
      </div>

      {/* ── STUDENT DETAIL MODAL ── */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedStudent(null)}>
          <div className="bg-surface border border-border rounded-2xl shadow-elevated w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-4">
                <div className={`h-14 w-14 rounded-full bg-gradient-to-br ${GRAD_COLORS[selectedStudent.id % GRAD_COLORS.length]} flex items-center justify-center text-white font-bold shadow-sm`}>
                  {selectedStudent.avatar}
                </div>
                <div>
                  <h3 className="font-bold text-text text-lg">{selectedStudent.name}</h3>
                  <p className="text-sm text-muted">{selectedStudent.email}</p>
                </div>
              </div>
              <button onClick={() => setSelectedStudent(null)} className="text-muted hover:text-text p-1">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              {[
                { label: 'Joined', value: selectedStudent.joined },
                { label: 'Status', value: selectedStudent.status },
                { label: 'Progress', value: `${selectedStudent.progress}%` },
                { label: 'Grade', value: selectedStudent.grade },
              ].map(item => (
                <div key={item.label} className="bg-bg border border-border rounded-xl p-3">
                  <p className="text-xs font-bold text-muted uppercase tracking-wider">{item.label}</p>
                  <p className="font-bold text-text mt-1">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="bg-bg border border-border rounded-xl p-4 mb-5">
              <p className="text-xs font-bold text-muted uppercase tracking-wider mb-2">Enrolled Course</p>
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                <p className="font-bold text-text text-sm">{selectedStudent.enrolled}</p>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-xs font-bold text-muted mb-1.5">
                  <span>Progress</span><span>{selectedStudent.progress}%</span>
                </div>
                <div className="h-2 rounded-full bg-border overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-primary to-cyan-400" style={{ width: `${selectedStudent.progress}%` }} />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-hover transition-all">
                <Mail className="h-4 w-4" /> Message
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-bg border border-border rounded-xl text-sm font-bold text-muted hover:text-text hover:border-primary/40 transition-all">
                <BarChart2 className="h-4 w-4" /> Analytics
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}