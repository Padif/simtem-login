import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col lg:flex-row">
      <aside className="relative hidden overflow-hidden lg:flex lg:w-[46%] lg:flex-col lg:justify-between lg:px-12 lg:py-12">
        <div className="auth-panel absolute inset-0" />
        <div className="relative z-10">
          <Link href="/" className="font-display text-3xl text-white">
            Cipher
          </Link>
        </div>
        <div className="relative z-10 max-w-md space-y-4 text-white">
          <p className="text-sm uppercase tracking-[0.28em] text-teal-100/80">
            Secure access
          </p>
          <h2 className="font-display text-4xl leading-tight tracking-tight">
            Authentication that feels invisible until it matters.
          </h2>
          <p className="text-base leading-relaxed text-slate-200/90">
            Email credentials, social providers, and password recovery —
            packaged in one production-ready flow.
          </p>
        </div>
        <p className="relative z-10 text-sm text-slate-300/80">
          Built with Next.js App Router · Auth.js v5 · Prisma
        </p>
      </aside>

      <main className="relative flex flex-1 items-center justify-center px-6 py-12 sm:px-10">
        <div className="auth-glow pointer-events-none absolute inset-0" />
        <div className="relative w-full max-w-md">
          <div className="mb-10 flex items-center justify-between lg:hidden">
            <Link href="/" className="font-display text-2xl text-slate-900">
              Cipher
            </Link>
          </div>
          <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-8 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.35)] backdrop-blur">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
