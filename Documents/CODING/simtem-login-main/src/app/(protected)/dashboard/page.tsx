import { SignOutButton } from "@/components/auth/sign-out-button";
import { requireSession } from "@/lib/require-session";

export const metadata = {
  title: "Dashboard · Cipher",
};

export default async function DashboardPage() {
  const session = await requireSession();

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="auth-glow pointer-events-none absolute inset-0" />
      <header className="relative z-10 border-b border-slate-200/80 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <p className="font-display text-2xl text-slate-900">Cipher</p>
          <SignOutButton />
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-5xl px-6 py-16">
        <div className="max-w-2xl space-y-4">
          <p className="text-sm uppercase tracking-[0.24em] text-teal-700">
            Signed in
          </p>
          <h1 className="font-display text-4xl tracking-tight text-slate-900 sm:text-5xl">
            Welcome, {session.user.name ?? "there"}.
          </h1>
          <p className="text-lg leading-relaxed text-slate-600">
            You are authenticated as{" "}
            <span className="font-semibold text-slate-900">
              {session.user.email}
            </span>
            . This dashboard is protected by Auth.js proxy and a server-side
            session check.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {[
            ["Session", "JWT strategy via Auth.js v5"],
            ["Identity", session.user.id],
            ["Providers", "Credentials · Google · GitHub · Facebook"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-slate-200 bg-white/80 p-5"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                {label}
              </p>
              <p className="mt-3 break-all text-sm font-medium text-slate-800">
                {value}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
