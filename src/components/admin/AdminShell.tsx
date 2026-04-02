import type { ReactNode } from "react";
import AdminHeader from "./AdminHeader";
import AdminShellClient from "./AdminShellClient";

type AdminShellProps = {
  children: ReactNode;
};

export default function AdminShell({ children }: AdminShellProps) {
  return (
    <AdminShellClient header={<AdminHeader />}>
      {children}
    </AdminShellClient>
  );
}