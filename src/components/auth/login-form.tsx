"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";
import { OAuthButtons } from "@/components/auth/oauth-buttons";
import type { OAuthProviderId } from "@/lib/oauth";

export function LoginForm({ providers }: { providers: OAuthProviderId[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const resetSuccess = searchParams.get("reset") === "success";
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password.");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-display text-3xl tracking-tight text-slate-900">
          Welcome back
        </h1>
        <p className="text-sm leading-relaxed text-slate-500">
          Sign in to continue to your Cipher workspace.
        </p>
      </div>

      {resetSuccess ? (
        <p className="rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-800">
          Password updated. Sign in with your new credentials.
        </p>
      ) : null}

      <OAuthButtons providers={providers} callbackUrl={callbackUrl} />

      <div className="relative text-center text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
        <span className="absolute inset-x-0 top-1/2 h-px bg-slate-200" />
        <span className="relative bg-white px-3">or email</span>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Email</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-slate-900 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15"
            placeholder="you@company.com"
          />
        </label>

        <label className="block space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">Password</span>
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-teal-700 transition hover:text-teal-800"
            >
              Forgot password?
            </Link>
          </div>
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-slate-900 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15"
            placeholder="••••••••"
          />
        </label>

        {error ? (
          <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="text-center text-sm text-slate-500">
        New here?{" "}
        <Link
          href="/register"
          className="font-semibold text-teal-700 transition hover:text-teal-800"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
