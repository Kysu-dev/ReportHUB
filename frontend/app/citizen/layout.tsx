import type { ReactNode } from "react";
import { Inter } from "next/font/google";

const newsreader = Inter({
  subsets: ["latin"],
  variable: "--font-newsreader",
});

const publicSans = Inter({
  subsets: ["latin"],
  variable: "--font-public-sans",
});

export default function CitizenLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`${newsreader.variable} ${publicSans.variable} min-h-screen bg-[#FFFDD0] font-body-md antialiased`}>
      {children}
    </div>
  );
}