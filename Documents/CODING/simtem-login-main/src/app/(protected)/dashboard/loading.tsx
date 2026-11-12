export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="h-20 border-b border-slate-200 bg-white/70" />
      <div className="mx-auto max-w-5xl space-y-4 px-6 py-16">
        <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
        <div className="h-12 w-80 animate-pulse rounded-xl bg-slate-200" />
        <div className="h-20 max-w-xl animate-pulse rounded-xl bg-slate-100" />
      </div>
    </div>
  );
}
