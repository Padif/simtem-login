"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";
import { OAuthButtons } from "@/components/auth/oauth-buttons";
import type { OAuthProviderId } from "@/lib/oauth";

export function RegisterForm({ providers }: { providers: OAuthProviderId[] }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setFieldErrors({});
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
      confirmPassword: String(form.get("confirmPassword") ?? ""),
    };

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      setLoading(false);
      setError(data.error ?? "Registration failed");
      if (data.issues) setFieldErrors(data.issues);
      return;
    }

    const result = await signIn("credentials", {
      email: payload.email,
      password: payload.password,
      redirect: false,
      callbackUrl: "/dashboard",
    });

    setLoading(false);

    if (result?.error) {
      router.push("/login");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-display text-3xl tracking-tight text-slate-900">
          Create your account
        </h1>
        <p className="text-sm leading-relaxed text-slate-500">
          Start with email or connect a trusted provider in seconds.
        </p>
      </div>

      <OAuthButtons providers={providers} />

      <div className="relative text-center text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
        <span className="absolute inset-x-0 top-1/2 h-px bg-slate-200" />
        <span className="relative bg-white px-3">or register</span>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Full name</span>
          <input
            name="name"
            type="text"
            required
            autoComplete="name"
            className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-slate-900 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15"
            placeholder="Alex Rivera"
          />
          {fieldErrors.name?.[0] ? (
            <span className="text-xs text-rose-600">{fieldErrors.name[0]}</span>
          ) : null}
        </label>

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
          {fieldErrors.email?.[0] ? (
            <span className="text-xs text-rose-600">
              {fieldErrors.email[0]}
            </span>
          ) : null}
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Password</span>
          <input
            name="password"
            type="password"
            required
            autoComplete="new-password"
            className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-slate-900 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15"
            placeholder="Min. 8 chars, mixed case + number"
          />
          {fieldErrors.password?.[0] ? (
            <span className="text-xs text-rose-600">
              {fieldErrors.password[0]}
            </span>
          ) : null}
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">
            Confirm password
          </span>
          <input
            name="confirmPassword"
            type="password"
            required
            autoComplete="new-password"
            className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-slate-900 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15"
            placeholder="Repeat password"
          />
          {fieldErrors.confirmPassword?.[0] ? (
            <span className="text-xs text-rose-600">
              {fieldErrors.confirmPassword[0]}
            </span>
          ) : null}
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
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-teal-700 transition hover:text-teal-800"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
