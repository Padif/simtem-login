"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import type { OAuthProviderId } from "@/lib/oauth";

const providerMeta: Record<
  OAuthProviderId,
  { label: string; icon: React.ReactNode }
> = {
  google: {
    label: "Continue with Google",
    icon: (
      <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
        <path
          fill="currentColor"
          d="M21.6 12.23c0-.68-.06-1.36-.18-2H12v3.79h5.4a4.62 4.62 0 0 1-2 3.03v2.5h3.24c1.9-1.75 2.96-4.33 2.96-7.32z"
          className="text-[#4285F4]"
        />
        <path
          fill="#34A853"
          d="M12 22c2.7 0 4.97-.9 6.63-2.45l-3.24-2.5c-.9.6-2.05.96-3.39.96-2.61 0-4.82-1.76-5.61-4.13H3.05v2.58A10 10 0 0 0 12 22z"
        />
        <path
          fill="#FBBC05"
          d="M6.39 13.88A6 6 0 0 1 6.08 12c0-.65.11-1.29.3-1.88V7.54H3.05A10 10 0 0 0 2 12c0 1.61.39 3.14 1.05 4.46l3.34-2.58z"
        />
        <path
          fill="#EA4335"
          d="M12 5.98c1.47 0 2.79.5 3.83 1.5l2.87-2.87C16.96 2.97 14.7 2 12 2A10 10 0 0 0 3.05 7.54l3.34 2.58C7.18 7.74 9.39 5.98 12 5.98z"
        />
      </svg>
    ),
  },
  github: {
    label: "Continue with GitHub",
    icon: (
      <svg viewBox="0 0 24 24" className="size-5 fill-current" aria-hidden>
        <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.35 6.84 9.7.5.1.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.55-1.14-4.55-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.73 0 0 .84-.27 2.75 1.05A9.3 9.3 0 0 1 12 6.8c.85 0 1.71.12 2.51.35 1.91-1.32 2.75-1.05 2.75-1.05.55 1.42.2 2.47.1 2.73.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .26.18.58.69.48A10.03 10.03 0 0 0 22 12.26C22 6.58 17.52 2 12 2z" />
      </svg>
    ),
  },
  facebook: {
    label: "Continue with Facebook",
    icon: (
      <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
        <path
          fill="#1877F2"
          d="M24 12.07C24 5.48 18.63.1 12.07.1S.14 5.48.14 12.07c0 5.97 4.36 10.92 10.06 11.83v-8.37H7.2v-3.46h3v-2.64c0-2.96 1.76-4.6 4.46-4.6 1.29 0 2.64.23 2.64.23v2.9h-1.49c-1.46 0-1.92.91-1.92 1.84v2.27h3.27l-.52 3.46h-2.75v8.37C19.64 23 24 18.04 24 12.07z"
        />
      </svg>
    ),
  },
};

export function OAuthButtons({
  providers,
  callbackUrl = "/dashboard",
}: {
  providers: OAuthProviderId[];
  callbackUrl?: string;
}) {
  const [loading, setLoading] = useState<OAuthProviderId | null>(null);

  if (providers.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-center text-sm text-slate-500">
        Configure Google, GitHub, or Facebook credentials in{" "}
        <code className="font-mono text-xs text-teal-700">.env</code> to enable
        social login.
      </p>
    );
  }

  return (
    <div className="grid gap-3">
      {providers.map((id) => {
        const meta = providerMeta[id];
        return (
          <button
            key={id}
            type="button"
            disabled={loading !== null}
            onClick={async () => {
              setLoading(id);
              await signIn(id, { callbackUrl });
            }}
            className="group inline-flex h-12 items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-800 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {meta.icon}
            <span>{loading === id ? "Redirecting…" : meta.label}</span>
          </button>
        );
      })}
    </div>
  );
}
