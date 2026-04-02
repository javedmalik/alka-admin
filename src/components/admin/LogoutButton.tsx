"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";

interface LogoutButtonProps {
  variant?: "button" | "menu-item";
  className?: string;
  iconOnly?: boolean;
}

export default function LogoutButton({
  variant = "button",
  className = "",
  iconOnly = false,
}: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);

      const result = await signOut({
        redirect: false,
        callbackUrl: "/login",
      });

      window.location.replace(result?.url || "/login");
    } catch {
      window.location.replace("/login");
    }
  };

  if (variant === "menu-item") {
    return (
      <button
        type="button"
        onClick={handleLogout}
        disabled={isLoading}
        className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 disabled:opacity-50 ${className}`}
      >
        <LogOut className="h-4 w-4" />
        <span>{isLoading ? "Logging out..." : "Logout"}</span>
      </button>
    );
  }

  if (iconOnly) {
    return (
      <button
        type="button"
        onClick={handleLogout}
        disabled={isLoading}
        className={`rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-red-600 disabled:opacity-50 ${className}`}
        title="Logout"
      >
        <LogOut className="h-5 w-5" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoading}
      className={`flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600 hover:shadow-sm disabled:opacity-50 ${className}`}
    >
      <LogOut className="h-4 w-4" />
      <span>{isLoading ? "Logging out..." : "Logout"}</span>
    </button>
  );
}