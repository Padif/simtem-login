"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="max-w-md space-y-4 text-center">
        <p className="text-sm uppercase tracking-[0.24em] text-teal-700">
          Something went wrong
        </p>
        <h1 className="font-display text-3xl text-slate-900">
          We could not load this page
        </h1>
        <p className="text-sm text-slate-500">
          {error.message || "An unexpected error occurred."}
        </p>
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-11 items-center rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
