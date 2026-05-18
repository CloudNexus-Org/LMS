export default function LoadingFallback() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-bg">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-border border-t-primary" />
        <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-muted">
          Loading
        </span>
      </div>
    </div>
  );
}
