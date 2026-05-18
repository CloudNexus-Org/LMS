import { Users, Search, Filter, Mail, MoreVertical, ShieldCheck, ChevronDown } from 'lucide-react';

const STUDENTS = [
  { id: 1, name: 'Alex Chen', email: 'alex.chen@example.com', enrolled: 'Advanced State Management', progress: 85, lastActive: '2 hours ago', status: 'Active' },
  { id: 2, name: 'Sarah Miller', email: 'sarah.m@example.com', enrolled: 'Cloud Architecture', progress: 32, lastActive: '5 hours ago', status: 'Active' },
  { id: 3, name: 'James Wilson', email: 'j.wilson@example.com', enrolled: 'Cloud Architecture', progress: 100, lastActive: '1 day ago', status: 'Completed' },
  { id: 4, name: 'Emily Davis', email: 'emily.d@example.com', enrolled: 'Advanced State Management', progress: 12, lastActive: '3 days ago', status: 'Inactive' },
  { id: 5, name: 'Michael Brown', email: 'mbrown99@example.com', enrolled: 'Rust for Frontend Devs', progress: 0, lastActive: '1 week ago', status: 'Inactive' },
];

export default function StudentsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text font-display tracking-tight">Student Roster</h1>
          <p className="text-muted mt-1 font-medium">Manage and communicate with your learners.</p>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
        
        {/* Table Toolbar */}
        <div className="p-4 border-b border-border flex flex-col sm:flex-row items-center gap-4 justify-between bg-bg/50">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              className="w-full bg-surface border border-border rounded-lg pl-9 pr-4 py-2 text-sm focus:border-primary outline-none text-text transition-all font-medium" 
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-surface border border-border rounded-lg text-xs font-bold text-text hover:bg-bg transition-colors shadow-sm">
              <Filter className="h-4 w-4" /> Filter
            </button>
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-surface border border-border rounded-lg text-xs font-bold text-text hover:bg-bg transition-colors shadow-sm">
              Course <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-bg border-b border-border">
              <tr>
                <th className="px-6 py-4 font-bold text-muted uppercase tracking-wider text-[11px]">Student Name</th>
                <th className="px-6 py-4 font-bold text-muted uppercase tracking-wider text-[11px]">Enrolled Course</th>
                <th className="px-6 py-4 font-bold text-muted uppercase tracking-wider text-[11px]">Progress</th>
                <th className="px-6 py-4 font-bold text-muted uppercase tracking-wider text-[11px]">Last Active</th>
                <th className="px-6 py-4 font-bold text-muted uppercase tracking-wider text-[11px] text-right">Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {STUDENTS.map((student) => (
                <tr key={student.id} className="hover:bg-bg/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-primary-soft text-primary font-bold flex items-center justify-center text-xs shrink-0">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-bold text-text">{student.name}</p>
                        <p className="text-xs text-muted font-medium">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-muted">{student.enrolled}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-1.5 bg-bg rounded-full overflow-hidden border border-border relative">
                        <div 
                          className={`absolute top-0 left-0 h-full rounded-full ${student.progress === 100 ? 'bg-success' : 'bg-primary'}`} 
                          style={{ width: `${student.progress}%` }} 
                        />
                      </div>
                      <span className="text-xs font-bold text-text">{student.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`h-1.5 w-1.5 rounded-full ${student.status === 'Active' ? 'bg-success' : student.status === 'Completed' ? 'bg-primary' : 'bg-muted'}`}></span>
                      <span className="text-xs text-muted font-medium">{student.lastActive}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-border text-text hover:bg-surface hover:text-primary hover:border-primary transition-all">
                      <Mail className="h-4 w-4" />
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
