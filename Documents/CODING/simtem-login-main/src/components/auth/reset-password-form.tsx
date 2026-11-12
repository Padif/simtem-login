"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const presetEmail = searchParams.get("email") ?? "";
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
      email: String(form.get("email") ?? ""),
      code: String(form.get("code") ?? ""),
      password: String(form.get("password") ?? ""),
      confirmPassword: String(form.get("confirmPassword") ?? ""),
    };

    const response = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data.error ?? "Unable to reset password");
      if (data.issues) setFieldErrors(data.issues);
      return;
    }

    router.push("/login?reset=success");
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-display text-3xl tracking-tight text-slate-900">
          Reset password
        </h1>
        <p className="text-sm leading-relaxed text-slate-500">
          Enter the 6-digit code from your email and choose a new password.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Email</span>
          <input
            name="email"
            type="email"
            required
            defaultValue={presetEmail}
            autoComplete="email"
            className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-slate-900 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">
            Verification code
          </span>
          <input
            name="code"
            type="text"
            inputMode="numeric"
            required
            maxLength={6}
            className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 font-mono text-lg tracking-[0.35em] text-slate-900 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15"
            placeholder="000000"
          />
          {fieldErrors.code?.[0] ? (
            <span className="text-xs text-rose-600">{fieldErrors.code[0]}</span>
          ) : null}
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">
            New password
          </span>
          <input
            name="password"
            type="password"
            required
            autoComplete="new-password"
            className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-slate-900 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15"
          />
          {fieldErrors.password?.[0] ? (
            <span className="text-xs text-rose-600">
              {fieldErrors.password[0]}
            </span>
          ) : null}
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">
            Confirm new password
          </span>
          <input
            name="confirmPassword"
            type="password"
            required
            autoComplete="new-password"
            className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-slate-900 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15"
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
          {loading ? "Updating…" : "Update password"}
        </button>
      </form>

      <p className="text-center text-sm text-slate-500">
        Need a new code?{" "}
        <Link
          href="/forgot-password"
          className="font-semibold text-teal-700 transition hover:text-teal-800"
        >
          Request again
        </Link>
      </p>
    </div>
  );
}
