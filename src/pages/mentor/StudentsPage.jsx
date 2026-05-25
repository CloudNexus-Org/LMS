import {
  Users,
  Search,
  Filter,
  Mail,
  MoreVertical,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  TrendingUp,
  Activity,
  UserCheck,
} from "lucide-react";

const STUDENTS = [
  {
    id: 1,
    name: "Alex Chen",
    email: "alex.chen@example.com",
    enrolled: "Advanced State Management",
    progress: 85,
    lastActive: "2 hours ago",
    status: "Active",
  },
  {
    id: 2,
    name: "Sarah Miller",
    email: "sarah.m@example.com",
    enrolled: "Cloud Architecture",
    progress: 32,
    lastActive: "5 hours ago",
    status: "Active",
  },
  {
    id: 3,
    name: "James Wilson",
    email: "j.wilson@example.com",
    enrolled: "Cloud Architecture",
    progress: 100,
    lastActive: "1 day ago",
    status: "Completed",
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily.d@example.com",
    enrolled: "Advanced State Management",
    progress: 12,
    lastActive: "3 days ago",
    status: "Inactive",
  },
];

export default function StudentsPage() {
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-[5px] border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-blue-500">
            <Sparkles className="h-3 w-3" />
            Student Management
          </div>

          <h1 className="mt-4 text-[42px] font-black tracking-tight text-text">
            Student Roster
          </h1>

          <p className="mt-2 text-[20px] text-muted">
            Manage learners, enrollments and student progress.
          </p>
        </div>

        
       
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-[5px] border border-border bg-surface shadow-[0_15px_50px_rgba(37,99,235,0.06)]">
        {/* TOOLBAR */}
        <div className="flex items-center justify-between border-b border-border bg-bg/40 p-4">
          {/* SEARCH */}
          <div className="relative w-[320px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />

            <input
              type="text"
              placeholder="Search students..."
              className="
                h-[42px]
                w-full
                rounded-[5px]
                border border-border
                bg-surface
                pl-10 pr-4

                text-[13px]
                font-medium
                text-text

                outline-none
                transition-all duration-300

                hover:border-[#2563ff]/20
                hover:shadow-[0_10px_25px_rgba(37,99,235,0.08)]

                focus:border-[#2563ff]
                focus:ring-2
                focus:ring-[#2563ff]/20
              "
            />
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-2">
            <button
              className="
                flex items-center gap-2
                rounded-[5px]
                border border-border
                bg-surface

                px-4 py-2

                text-[11px]
                font-black
                uppercase
                tracking-[0.15em]

                transition-all duration-300

                hover:-translate-y-[2px]
                hover:border-[#2563ff]/30
                hover:bg-[#2563ff]/5
                hover:text-[#2563ff]

                hover:shadow-[0_12px_30px_rgba(37,99,235,0.10)]
              "
            >
              <Filter className="h-3.5 w-3.5" />
              Filter
            </button>

            <button
              className="
                flex items-center gap-2
                rounded-[5px]
                border border-border
                bg-surface

                px-4 py-2

                text-[11px]
                font-black
                uppercase
                tracking-[0.15em]

                transition-all duration-300

                hover:-translate-y-[2px]
                hover:border-[#2563ff]/30
                hover:bg-[#2563ff]/5
                hover:text-[#2563ff]

                hover:shadow-[0_12px_30px_rgba(37,99,235,0.10)]
              "
            >
              Course
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-border bg-bg/50">
              <tr>
                <th className="px-5 py-4 text-[10px] font-black uppercase tracking-[0.18em] text-muted">
                  Student
                </th>

                <th className="px-5 py-4 text-[10px] font-black uppercase tracking-[0.18em] text-muted">
                  Course
                </th>

                <th className="px-5 py-4 text-[10px] font-black uppercase tracking-[0.18em] text-muted">
                  Progress
                </th>

                <th className="px-5 py-4 text-[10px] font-black uppercase tracking-[0.18em] text-muted">
                  Last Active
                </th>

                <th className="px-5 py-4 text-right text-[10px] font-black uppercase tracking-[0.18em] text-muted">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {STUDENTS.map((student, i) => (
                <tr
                  key={student.id}
                  className="
                    group
                    transition-all duration-300
                    hover:bg-bg/40
                  "
                >
                  {/* STUDENT */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {/* AVATAR */}
                      <div
                        className={`
                          relative
                          flex h-9 w-9 items-center justify-center
                          rounded-full
                          text-[11px]
                          font-black
                          text-white
                          overflow-hidden

                          ${
                            i % 4 === 0
                              ? "bg-gradient-to-br from-blue-500 to-cyan-400"
                              : i % 4 === 1
                              ? "bg-gradient-to-br from-emerald-500 to-lime-400"
                              : i % 4 === 2
                              ? "bg-gradient-to-br from-orange-500 to-yellow-400"
                              : "bg-gradient-to-br from-violet-500 to-fuchsia-400"
                          }

                          shadow-[0_10px_25px_rgba(0,0,0,0.08)]
                        `}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent" />

                        <span className="relative z-10">
                          {student.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>

                      <div>
                        <p className="text-[13px] font-bold text-text">
                          {student.name}
                        </p>

                        <p className="text-[11px] text-muted">
                          {student.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* COURSE */}
                  <td className="px-5 py-4">
                    <div className="inline-flex items-center gap-2 rounded-[5px] border border-blue-500/10 bg-blue-500/10 px-2.5 py-1.5 text-[11px] font-bold text-blue-500">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      {student.enrolled}
                    </div>
                  </td>

                  {/* PROGRESS */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-2 w-24 overflow-hidden rounded-full bg-bg">
                        <div
                          className={`
                            absolute left-0 top-0 h-full rounded-full

                            ${
                              student.progress >= 80
                                ? "bg-gradient-to-r from-emerald-500 to-lime-400"
                                : student.progress >= 40
                                ? "bg-gradient-to-r from-blue-500 to-cyan-400"
                                : "bg-gradient-to-r from-orange-500 to-yellow-400"
                            }
                          `}
                          style={{
                            width: `${student.progress}%`,
                          }}
                        />
                      </div>

                      <span className="text-[11px] font-black text-text">
                        {student.progress}%
                      </span>
                    </div>
                  </td>

                  {/* ACTIVE */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`
                          h-2 w-2 rounded-full

                          ${
                            student.status === "Active"
                              ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"
                              : student.status === "Completed"
                              ? "bg-blue-500 shadow-[0_0_10px_rgba(37,99,235,0.8)]"
                              : "bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)]"
                          }
                        `}
                      />

                      <span className="text-[11px] font-medium text-muted">
                        {student.lastActive}
                      </span>
                    </div>
                  </td>

                  {/* ACTIONS */}
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="
                          flex h-8 w-8 items-center justify-center
                          rounded-[5px]
                          border border-border
                          bg-surface

                          transition-all duration-300

                          hover:-translate-y-[2px]
                          hover:border-[#2563ff]/30
                          hover:bg-[#2563ff]/5
                          hover:text-[#2563ff]

                          hover:shadow-[0_12px_30px_rgba(37,99,235,0.10)]
                        "
                      >
                        <Mail className="h-3.5 w-3.5" />
                      </button>

                      <button
                        className="
                          flex h-8 w-8 items-center justify-center
                          rounded-[5px]
                          border border-border
                          bg-surface

                          transition-all duration-300

                          hover:-translate-y-[2px]
                          hover:border-[#2563ff]/30
                          hover:bg-[#2563ff]/5
                          hover:text-[#2563ff]

                          hover:shadow-[0_12px_30px_rgba(37,99,235,0.10)]
                        "
                      >
                        <MoreVertical className="h-3.5 w-3.5" />
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