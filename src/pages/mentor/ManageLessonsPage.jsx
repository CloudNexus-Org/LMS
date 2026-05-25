import { Edit3, EyeOff, MoreVertical, Plus, Users, Star, BarChart } from 'lucide-react';
import { Link } from 'react-router-dom';

const MOCK_COURSES = [
  { id: 1, title: 'Advanced State Management', status: 'Published', students: 842, rating: 4.8, revenue: '$8,420' },
  { id: 2, title: 'Cloud Architecture Patterns', status: 'Published', students: 406, rating: 4.9, revenue: '$4,060' },
  { id: 3, title: 'Rust for Frontend Devs', status: 'Draft', students: 0, rating: 0, revenue: '$0' },
];

export default function ManageLessonsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[42px] font-bold text-text font-display tracking-tight">Manage Courses</h1>
          <p className="text-muted mt-1 font-medium">Create, edit, and organize your curriculum.</p>
        </div>
        
        <Link to="/mentor/upload" className="
                  relative
                  inline-flex

                  h-[48px]
                  w-full
                  sm:w-auto
                  min-w-[120px]

                  items-center
                  justify-center

                  border
                  border-[#d9e2ff]
                  dark:border-white/10

                  bg-white
                  dark:bg-[#2563ff]

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
                  hover:border-[#2563ff]/40

                  [clip-path:polygon(12px_0,100%_0,100%_calc(100%-12px),calc(100%-12px)_100%,0_100%,0_12px)]
                ">
          <Plus className="h-4 w-4" /> New Course
        </Link>
      </div>

      <div className="bg-surface border border-border rounded-[5px] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-bg border-b border-border">
              <tr>
                <th className="px-6 py-5 font-bold text-muted uppercase tracking-wider text-[11px]">Course Name</th>
                <th className="px-6 py-5 font-bold text-muted uppercase tracking-wider text-[11px]">Status</th>
                <th className="px-6 py-5 font-bold text-muted uppercase tracking-wider text-[11px]">Students</th>
                <th className="px-6 py-5 font-bold text-muted uppercase tracking-wider text-[11px]">Rating</th>
                <th className="px-6 py-5 font-bold text-muted uppercase tracking-wider text-[11px]">Revenue</th>
                <th className="px-6 py-5 font-bold text-muted uppercase tracking-wider text-[11px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {MOCK_COURSES.map((course) => (
                <tr key={course.id} className="hover:bg-bg/50 transition-colors">
                  <td className="px-6 py-5 font-bold text-text text-base">{course.title}</td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-[5px] text-xs font-bold uppercase tracking-wider ${
                      course.status === 'Published' ? 'bg-success/20 text-success' : 'bg-border text-muted'
                    }`}>
                      {course.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 font-bold text-text">
                    <div className="flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-muted" /> {course.students}
                    </div>
                  </td>
                  <td className="px-6 py-5 font-bold text-text">
                    <div className="flex items-center gap-1.5">
                      <Star className="h-4 w-4 text-warning fill-warning" /> {course.rating || '--'}
                    </div>
                  </td>
                  <td className="px-6 py-5 font-bold text-success">{course.revenue}</td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="h-9 w-9 flex items-center justify-center rounded-[5px] border border-border text-text hover:bg-surface hover:border-primary hover:text-primary transition-all">
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button className="h-9 w-9 flex items-center justify-center rounded-[5px] border border-border text-text hover:bg-surface hover:text-danger hover:border-danger transition-all">
                        <EyeOff className="h-4 w-4" />
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
