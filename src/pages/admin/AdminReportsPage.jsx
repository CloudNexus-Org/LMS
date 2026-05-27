import { useState } from 'react';
import {
  Download, PieChart,
  Users, DollarSign, BookOpen, Star, ArrowUpRight,
  ArrowDownRight, Globe, Sparkles, Award,
  ChevronRight
} from 'lucide-react';

function Sparkline({ data, color = 'var(--primary)', height = 40 }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 100;
  const h = height;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="opacity-80">
      <polyline fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points={pts} />
    </svg>
  );
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const GROWTH_DATA = [380, 520, 470, 680, 820, 940, 860, 1050, 1120, 1280, 1180, 1420];
const REVENUE_DATA = [28, 34, 30, 48, 62, 75, 68, 88, 95, 110, 98, 124];
const COMPLETION_DATA = [42, 45, 38, 52, 58, 62, 55, 68, 65, 72, 70, 75];

const KPI_CARDS = [
  { label: 'Total Revenue (YTD)', value: '$428.5k', trend: '+24%', positive: true, spark: REVENUE_DATA, sparkColor: 'var(--success)', icon: DollarSign, color: 'text-success', bg: 'bg-success/10' },
  { label: 'New Users (YTD)', value: '12,482', trend: '+18%', positive: true, spark: GROWTH_DATA.map(v => v / 10), sparkColor: 'var(--primary)', icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
  { label: 'Courses Published', value: '284', trend: '+42', positive: true, spark: [8, 10, 7, 12, 14, 18, 15, 20, 22, 25, 23, 28], sparkColor: 'var(--accent)', icon: BookOpen, color: 'text-accent', bg: 'bg-accent/10' },
  { label: 'Avg Completion Rate', value: '63%', trend: '+5%', positive: true, spark: COMPLETION_DATA, sparkColor: 'var(--warning)', icon: Award, color: 'text-warning', bg: 'bg-warning/10' },
];

const TOP_COURSES = [
  { rank: 1, name: 'AWS Cloud Architect Pro', mentor: 'Sarah Chen', students: 2840, revenue: '$28,400', rating: 4.9, growth: '+22%', up: true },
  { rank: 2, name: 'Kubernetes & DevOps Mastery', mentor: 'Liam Carter', students: 2210, revenue: '$22,100', rating: 4.8, growth: '+18%', up: true },
  { rank: 3, name: 'React & Next.js Complete', mentor: 'Priya Nair', students: 1985, revenue: '$19,850', rating: 4.7, growth: '+15%', up: true },
  { rank: 4, name: 'Python for Data Science', mentor: 'Omar Hassan', students: 1740, revenue: '$17,400', rating: 4.6, growth: '-3%', up: false },
  { rank: 5, name: 'System Design at Scale', mentor: 'Yuki Tanaka', students: 1320, revenue: '$13,200', rating: 4.8, growth: '+12%', up: true },
];

const TOP_MENTORS = [
  { name: 'Sarah Chen', courses: 4, students: 5840, revenue: '$58,400', rating: 4.9, avatar: 'SC', grad: 'from-blue-500 to-cyan-400' },
  { name: 'Liam Carter', courses: 3, students: 4210, revenue: '$42,100', rating: 4.8, avatar: 'LC', grad: 'from-violet-500 to-fuchsia-400' },
  { name: 'Priya Nair', courses: 5, students: 3985, revenue: '$39,850', rating: 4.7, avatar: 'PN', grad: 'from-emerald-500 to-lime-400' },
];

const GEO_DATA = [
  { region: 'North America', pct: 42, color: 'bg-primary' },
  { region: 'Europe', pct: 28, color: 'bg-accent' },
  { region: 'Asia Pacific', pct: 20, color: 'bg-success' },
  { region: 'Rest of World', pct: 10, color: 'bg-warning' },
];

export default function AdminReportsPage() {
  const [period, setPeriod] = useState('year');

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">

      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-[5px] border border-primary/20 bg-primary/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-primary mb-3">
            <Sparkles className="h-3 w-3" /> Analytics & Reports
          </div>
          <h1 className="text-[42px] font-bold text-text font-display tracking-tight">Platform Reports</h1>
          <p className="text-muted mt-1 font-medium">Detailed insights into platform growth, user engagement, and revenue.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Period tabs */}
          <div className="flex items-center gap-1 bg-bg border border-border rounded-[5px] p-1">
            {['month', 'quarter', 'year'].map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-[5px] text-xs font-bold transition-all capitalize ${period === p ? 'bg-primary text-white shadow-sm' : 'text-muted hover:text-text'}`}>
                {p === 'month' ? 'Month' : p === 'quarter' ? 'Quarter' : 'Year'}
              </button>
            ))}
          </div>
          <button className="
                  relative
                  inline-flex

                  h-[48px]
                  w-full
                  sm:w-auto
                  min-w-[90px]

                  items-center
                  justify-center

                  border
                  border-border
                  dark:border-border

                  bg-white
                  dark:bg-primary

                  px-6

                  text-[14px]
                  font-semibold

                  text-black
                  dark:text-white

                  overflow-hidden
                  rounded-none

                  shadow-[0_10px_30px_rgba(37,99,235,0.08)]
                  dark:shadow-[0_10px_30px_rgba(0,0,0,0.4)]

                  transition-all
                  duration-300

                  hover:-translate-y-[2px]
                  hover:border-primary/40
                  dark:hover:border-primary/60

                  [clip-path:polygon(12px_0,100%_0,100%_calc(100%-12px),calc(100%-12px)_100%,0_100%,0_12px)]
                ">
            <Download className="h-4 w-4" /> Export
          </button>
        </div>
      </div>

      {/* ── KPI CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {KPI_CARDS.map(kpi => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="bg-surface border border-border rounded-[5px] p-5 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className={`h-9 w-9 rounded-[5px] ${kpi.bg} ${kpi.color} flex items-center justify-center`}>
                  <Icon className="h-4 w-4" />
                </div>
                <span className={`flex items-center gap-0.5 text-xs font-bold px-2 py-1 rounded-[5px] ${kpi.positive ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                  {kpi.positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {kpi.trend}
                </span>
              </div>
              <p className="text-2xl font-display font-bold text-text">{kpi.value}</p>
              <p className="text-xs font-bold text-muted mt-0.5 mb-3">{kpi.label}</p>
              <Sparkline data={kpi.spark} color={kpi.sparkColor} />
            </div>
          );
        })}
      </div>

      {/* ── ENROLLMENT CHART + CATEGORY BREAKDOWN ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* User Growth Chart */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-[5px] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-bold text-lg text-text">User Growth</h3>
              <p className="text-xs text-muted font-medium mt-0.5">Monthly new student enrollments</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold">
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-[5px] bg-primary/80" /> Students</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-[5px] bg-success/70" /> Mentors</span>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="relative mt-6">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-15 pb-8">
              {[0, 1, 2, 3].map(i => <div key={i} className="w-full h-px bg-muted" />)}
            </div>
            <div className="flex items-end gap-1.5 h-48 pt-2 border-b border-border">
              {MONTHS.map((month, i) => {
                const students = Math.round((GROWTH_DATA[i] / 1420) * 100);
                const mentors = Math.round(students * 0.35);
                return (
                  <div key={month} className="flex-1 flex flex-col items-center gap-0.5 h-full justify-end group">
                    <div className="w-full flex items-end gap-0.5 h-40">
                      <div className="flex-1 bg-primary/80 rounded-[5px] transition-all duration-700 group-hover:bg-primary" style={{ height: `${students}%` }} />
                      <div className="flex-1 bg-success/70 rounded-[5px] transition-all duration-700 group-hover:bg-success" style={{ height: `${mentors}%` }} />
                    </div>
                    <span className="text-[9px] font-bold text-muted mt-1">{month.slice(0, 3)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-surface border border-border rounded-[5px] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-lg text-text">Top Categories</h3>
            <PieChart className="h-4 w-4 text-muted" />
          </div>
          <div className="space-y-5">
            {[
              { name: 'Cloud & DevOps', share: 45, color: 'bg-primary', text: 'text-primary' },
              { name: 'Frontend Engineering', share: 30, color: 'bg-success', text: 'text-success' },
              { name: 'Backend & Systems', share: 15, color: 'bg-warning', text: 'text-warning' },
              { name: 'Data & AI', share: 10, color: 'bg-accent', text: 'text-accent' },
            ].map(cat => (
              <div key={cat.name}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-bold text-text text-xs">{cat.name}</span>
                  <span className={`font-bold text-xs ${cat.text}`}>{cat.share}%</span>
                </div>
                <div className="w-full h-2 bg-bg rounded-full overflow-hidden border border-border">
                  <div className={`h-full ${cat.color} rounded-full transition-all duration-700`} style={{ width: `${cat.share}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Geo distribution */}
          <div className="mt-6 pt-5 border-t border-border">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="h-4 w-4 text-muted" />
              <h4 className="font-bold text-sm text-text">User Geography</h4>
            </div>
            <div className="space-y-3">
              {GEO_DATA.map(geo => (
                <div key={geo.region}>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-bold text-muted">{geo.region}</span>
                    <span className="text-xs font-bold text-text">{geo.pct}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-bg rounded-full overflow-hidden border border-border">
                    <div className={`h-full ${geo.color} rounded-full`} style={{ width: `${geo.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── TOP COURSES TABLE ── */}
      <div className="bg-surface border border-border rounded-[5px] shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h3 className="font-bold text-lg text-text">Top Performing Courses</h3>
            <p className="text-xs text-muted font-medium mt-0.5">Ranked by enrollment and revenue</p>
          </div>
          <button className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
            View All <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead className="bg-bg/50 border-b border-border">
              <tr>
                {['#', 'Course', 'Mentor', 'Students', 'Rating', 'Revenue', 'Growth'].map(h => (
                  <th key={h} className="px-5 py-4 text-[11px] font-bold text-muted uppercase tracking-wider text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {TOP_COURSES.map(course => (
                <tr key={course.rank} className="hover:bg-bg/40 transition-colors group">
                  <td className="px-5 py-4 text-xs font-bold text-muted">{course.rank}</td>
                  <td className="px-5 py-4">
                    <p className="font-bold text-text text-sm">{course.name}</p>
                  </td>
                  <td className="px-5 py-4 text-xs font-medium text-muted">{course.mentor}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-muted" />
                      <span className="font-bold text-text text-xs">{course.students.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 text-warning fill-warning" />
                      <span className="font-bold text-text text-xs">{course.rating}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-bold text-success">{course.revenue}</td>
                  <td className="px-5 py-4">
                    <span className={`flex items-center gap-0.5 text-xs font-bold ${course.up ? 'text-success' : 'text-danger'}`}>
                      {course.up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                      {course.growth}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── TOP MENTORS ── */}
      <div className="bg-surface border border-border rounded-[5px] shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-bold text-lg text-text">Top Mentors</h3>
            <p className="text-xs text-muted font-medium mt-0.5">By total student impact and revenue</p>
          </div>
          <button className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
            All Mentors <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {TOP_MENTORS.map((mentor) => (
            <div key={mentor.name} className="bg-bg border border-border rounded-[5px] p-4 hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-200">
              <div className="flex items-center gap-3 mb-4">
                <div className={`h-11 w-11 rounded-full bg-gradient-to-br ${mentor.grad} flex items-center justify-center text-white text-sm font-bold shadow-sm overflow-hidden relative`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent" />
                  <span className="relative z-10">{mentor.avatar}</span>
                </div>
                <div>
                  <p className="font-bold text-text text-sm">{mentor.name}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star className="h-3 w-3 text-warning fill-warning" />
                    <span className="text-xs font-bold text-muted">{mentor.rating}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-[11px] font-bold text-muted">Courses</p>
                  <p className="font-bold text-text text-sm mt-0.5">{mentor.courses}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-muted">Students</p>
                  <p className="font-bold text-text text-sm mt-0.5">{(mentor.students / 1000).toFixed(1)}k</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-muted">Revenue</p>
                  <p className="font-bold text-success text-sm mt-0.5">{mentor.revenue.replace('$', '$')}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
