"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import AdminSidebar from "./AdminSidebar";

type AdminShellClientProps = {
  children: ReactNode;
  header: ReactNode;
};

export default function AdminShellClient({
  children,
  header,
}: AdminShellClientProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isSidebarOpen) {
      document.body.style.overflow = "";
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="lg:flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:sticky lg:top-0 lg:block lg:h-screen lg:w-[280px] lg:flex-shrink-0">
          <div className="h-full border-r border-[var(--border)] bg-white">
            <AdminSidebar />
          </div>
        </div>

        {/* Mobile Overlay */}
        <div
          className={[
            "fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 lg:hidden",
            isSidebarOpen
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0",
          ].join(" ")}
          onClick={() => setIsSidebarOpen(false)}
        />

        {/* Mobile Drawer */}
        <div
          className={[
            "fixed inset-y-0 left-0 z-50 w-[88%] max-w-[320px] transform border-r border-[var(--border)] bg-white shadow-2xl transition-transform duration-300 ease-out lg:hidden",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full",
          ].join(" ")}
        >
          <div className="h-full">
            <AdminSidebar onClose={() => setIsSidebarOpen(false)} />
          </div>
        </div>

        {/* Main content */}
        <div className="min-w-0 flex-1">
          {/* Mobile top bar */}
          <div className="sticky top-0 z-30 border-b border-[var(--border)] bg-white/95 backdrop-blur lg:hidden">
            <div className="flex items-center justify-between px-4 py-3">
              <button
                type="button"
                onClick={() => setIsSidebarOpen(true)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-white text-slate-700 shadow-sm transition hover:bg-slate-50"
                aria-label="Open sidebar"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="text-right">
                <p className="text-sm font-semibold text-slate-900">
                  ALKA Admin
                </p>
                <p className="text-xs text-slate-500">Management Panel</p>
              </div>
            </div>
          </div>

          {/* Desktop/server header */}
          <div>{header}</div>

          {/* Page */}
          <main className="p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}