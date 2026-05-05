import type { ReactNode } from "react";

export default function CitizenLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FFFDD0] font-body-md antialiased">
      {children}
    </div>
  );
}