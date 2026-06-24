import { useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock3,
  FileText,
  Upload,
} from "lucide-react";
import { PENDING_ASSIGNMENTS } from "@/data/assignments";

const PRIORITY_STYLES = {
  high: "bg-danger/10 text-danger border-danger/20",
  medium: "bg-warning/10 text-warning border-warning/20",
  low: "bg-primary/10 text-primary border-primary/20",
};

function AssignmentCard({ assignment, onSubmit }) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    onSubmit(assignment.id);
    setSubmitting(false);
    setOpen(false);
  };

  return (
    <article className="dashboard-card overflow-hidden">
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${PRIORITY_STYLES[assignment.priority]}`}
            >
              {assignment.priority} priority
            </span>
            <span className="text-[12px] text-muted">{assignment.points} pts</span>
          </div>
          <h3 className="mt-2 font-display text-[18px] font-bold text-text">
            {assignment.title}
          </h3>
          <p className="mt-1 text-[13px] text-muted">{assignment.course}</p>
          <p className="mt-3 text-[13px] leading-relaxed text-muted">
            {assignment.description}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-[12px] text-muted">
            <span className="inline-flex items-center gap-1.5">
              <Calendar size={13} className="text-subtle" aria-hidden />
              Due {assignment.dueLabel}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock3 size={13} className="text-subtle" aria-hidden />
              Pending submission
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-primary-hover"
        >
          <Upload size={15} aria-hidden />
          {open ? "Close" : "Submit"}
        </button>
      </div>

      {open ? (
        <form
          onSubmit={handleSubmit}
          className="border-t border-border bg-bg/50 px-5 py-4"
        >
          <p className="text-[13px] font-medium text-text">
            {assignment.instructions}
          </p>
          <label className="mt-3 block">
            <span className="text-[12px] font-semibold text-muted">
              Submission link or notes
            </span>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Paste repo URL or add a short note…"
              className="mt-1.5 h-10 w-full rounded-lg border border-border bg-elevated px-3 text-[13px] text-text placeholder:text-subtle focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </label>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-[13px] font-semibold text-white hover:bg-primary-hover disabled:opacity-70"
            >
              {submitting ? "Submitting…" : "Submit assignment"}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center rounded-lg border border-border bg-elevated px-4 py-2 text-[13px] font-semibold text-text hover:border-primary hover:text-primary"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : null}
    </article>
  );
}

export default function PendingAssignmentsPage() {
  const [pending, setPending] = useState(PENDING_ASSIGNMENTS);
  const [submitted, setSubmitted] = useState([]);

  const handleSubmit = (id) => {
    const item = pending.find((a) => a.id === id);
    if (item) setSubmitted((prev) => [item, ...prev]);
    setPending((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <h1 className="text-[32px] font-bold tracking-tight text-text sm:text-[36px]">
          Pending Assignments
        </h1>
        <p className="mt-1 text-[15px] text-muted">
          Review due work and submit before the deadline.
        </p>
      </div>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="dashboard-card cert-summary-card">
          <p className="cert-summary-value">{pending.length}</p>
          <p className="cert-summary-label">Awaiting submission</p>
        </div>
        <div className="dashboard-card cert-summary-card">
          <p className="cert-summary-value">
            {pending.filter((a) => a.priority === "high").length}
          </p>
          <p className="cert-summary-label">Due soon</p>
        </div>
        <div className="dashboard-card cert-summary-card">
          <p className="cert-summary-value">{submitted.length}</p>
          <p className="cert-summary-label">Submitted this session</p>
        </div>
      </section>

      {pending.length === 0 ? (
        <div className="dashboard-card flex flex-col items-center justify-center px-6 py-16 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-success/10">
            <CheckCircle2 className="h-7 w-7 text-success" />
          </div>
          <h2 className="text-lg font-bold text-text">All caught up!</h2>
          <p className="mt-2 max-w-md text-[14px] text-muted">
            You have no pending assignments right now.
          </p>
          <Link
            to="/student/courses"
            className="mt-5 inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-[14px] font-semibold text-white hover:bg-primary-hover"
          >
            Back to My Courses
          </Link>
        </div>
      ) : (
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-[13px] text-muted">
            <AlertCircle size={15} className="text-warning" aria-hidden />
            <span>
              <span className="font-semibold text-text">{pending.length}</span>{" "}
              assignment{pending.length === 1 ? "" : "s"} need your attention
            </span>
          </div>
          <div className="space-y-4">
            {pending.map((assignment) => (
              <AssignmentCard
                key={assignment.id}
                assignment={assignment}
                onSubmit={handleSubmit}
              />
            ))}
          </div>
        </section>
      )}

      {submitted.length > 0 ? (
        <section className="space-y-3">
          <h2 className="dashboard-section-title flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            Recently submitted
          </h2>
          <ul className="space-y-2">
            {submitted.map((item) => (
              <li
                key={item.id}
                className="dashboard-card flex items-center justify-between gap-3 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-text">{item.title}</p>
                  <p className="text-[12px] text-muted">{item.course}</p>
                </div>
                <span className="inline-flex items-center gap-1 text-[12px] font-medium text-success">
                  <CheckCircle2 size={14} aria-hidden />
                  Submitted
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
