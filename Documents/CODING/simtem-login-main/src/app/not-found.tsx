import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="max-w-md space-y-4 text-center">
        <p className="text-sm uppercase tracking-[0.24em] text-teal-700">
          404
        </p>
        <h1 className="font-display text-3xl text-slate-900">Page not found</h1>
        <p className="text-sm text-slate-500">
          The page you are looking for does not exist or was moved.
        </p>
        <Link
          href="/"
          className="inline-flex h-11 items-center rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white"
        >
          Back home
        </Link>
      </div>
    </div>
  );
}
