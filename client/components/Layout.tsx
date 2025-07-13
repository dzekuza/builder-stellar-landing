import { ReactNode } from "react";
import { Navigation } from "./Navigation";

interface LayoutProps {
  children: ReactNode;
  userRole?: "dj" | "barista" | "host" | "company" | null;
  isAuthenticated?: boolean;
}

export function Layout({
  children,
  userRole,
  isAuthenticated = false,
}: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <Navigation userRole={userRole} isAuthenticated={isAuthenticated} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
