import { Header } from "@/components/layout/ui";
import { type ReactNode } from "react";

export function BaseLayout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full">
      <Header />
      {children}
    </div>
  );
}
