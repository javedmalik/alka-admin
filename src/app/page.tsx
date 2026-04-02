import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="container-page flex min-h-screen flex-col items-center justify-center gap-6">
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-10 shadow-sm">
          <h1 className="text-center text-3xl font-semibold">ALKA Admin Panel</h1>
          <p className="mt-3 text-center text-sm text-[var(--muted)]">
            Base setup is ready.
          </p>

          <div className="mt-6 flex items-center justify-center gap-3">
            <Link
              href="/login"
              className="rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white"
            >
              Go to Login
            </Link>

            <Link
              href="/admin/dashboard"
              className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-medium"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}