import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="auth-panel absolute inset-0 opacity-95" />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8 sm:px-10">
        <header className="flex items-center justify-between">
          <p className="font-display text-3xl text-white animate-[fade-up_0.7s_ease_both]">
            Cipher
          </p>
          <div className="flex items-center gap-3 animate-[fade-up_0.7s_ease_both_120ms]">
            <Link
              href="/login"
              className="inline-flex h-11 items-center rounded-xl px-4 text-sm font-semibold text-white/90 transition hover:bg-white/10"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="inline-flex h-11 items-center rounded-xl bg-white px-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Get started
            </Link>
          </div>
        </header>

        <section className="flex flex-1 flex-col justify-center py-16">
          <div className="max-w-3xl space-y-6">
            <p className="text-sm uppercase tracking-[0.28em] text-teal-100/90 animate-[fade-up_0.8s_ease_both_80ms]">
              Professional auth starter
            </p>
            <h1 className="font-display text-5xl leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl animate-[fade-up_0.9s_ease_both_140ms]">
              Cipher
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-slate-200/90 animate-[fade-up_0.9s_ease_both_220ms]">
              A complete Next.js login system with registration, OAuth, and
              password recovery — ready to wire into your product.
            </p>
            <div className="flex flex-wrap gap-3 pt-2 animate-[fade-up_0.9s_ease_both_300ms]">
              <Link
                href="/register"
                className="inline-flex h-12 items-center rounded-xl bg-teal-400 px-6 text-sm font-semibold text-slate-950 transition hover:bg-teal-300"
              >
                Create account
              </Link>
              <Link
                href="/login"
                className="inline-flex h-12 items-center rounded-xl border border-white/25 bg-white/10 px-6 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15"
              >
                Sign in
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
