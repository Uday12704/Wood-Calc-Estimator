import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({
  children,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="flex min-h-screen items-center justify-center px-4 py-8">
        {children}
      </div>
    </div>
  );
}