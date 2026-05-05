"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/alur-pelaporan", label: "Alur Pelaporan" },
];

function getActiveIndex(pathname: string) {
  const index = links.findIndex((link) => link.href === pathname);
  return index === -1 ? 0 : index;
}

export default function Topbar() {
  const pathname = usePathname();
  const activeIndex = getActiveIndex(pathname);
  const indicatorIndex = activeIndex;

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("infraalert-topbar-index", String(activeIndex));
    }
  }, [activeIndex]);

  return (
    <nav className="sticky top-0 z-50 flex w-full flex-col gap-3 border-b-4 border-black bg-[#FFFBF0] px-6 py-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:flex-row md:items-center md:justify-between md:gap-6 md:px-8">
      <div className="flex w-full items-center justify-between md:w-auto">
        <Link
          href="/"
          className="text-3xl font-black italic uppercase tracking-tight"
        >
          InfraAlert
        </Link>
      </div>

      {/* DESKTOP MENU */}
      <div className="relative hidden md:block">
        <div className="grid w-[320px] grid-cols-2 gap-4">
          {links.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={index === activeIndex ? "page" : undefined}
              className="relative z-10 flex items-center justify-center border-2 border-black px-2 py-1 text-[11px] font-bold uppercase transition-transform hover:-rotate-1 hover:scale-105"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-0 z-0 w-1/2 border-2 border-black bg-[#22C55E] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-transform duration-300 ease-out"
          style={{ transform: `translateX(${indicatorIndex * 100}%)` }}
        />
      </div>

      {/* MOBILE MENU */}
      <div className="flex w-full gap-2 overflow-x-auto pb-1 md:hidden">
        {links.map((link, index) => (
          <Link
            key={link.href}
            href={link.href}
            aria-current={index === activeIndex ? "page" : undefined}
            className={`shrink-0 border-2 border-black px-3 py-1 text-[11px] font-bold uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-rotate-1 hover:scale-105 ${
              index === activeIndex ? "bg-[#22C55E]" : "bg-white"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* RIGHT DECORATION - PATTERN */}
      <div className="hidden items-center gap-3 md:flex">
        <div className="flex gap-1">
          <div className="h-4 w-4 border-2 border-black bg-[#22C55E]" />
          <div className="h-4 w-4 border-2 border-black" />
          <div className="h-4 w-4 border-2 border-black bg-[#22C55E]" />
          <div className="h-4 w-4 border-2 border-black" />
        </div>
        
        <div className="text-sm font-black italic text-black/30 tracking-wider">
          {"///"}
        </div>
        
        <div className="flex gap-1">
          <div className="h-4 w-4 border-2 border-black rotate-45" />
          <div className="h-4 w-4 border-2 border-black bg-[#22C55E] rotate-45" />
          <div className="h-4 w-4 border-2 border-black rotate-45" />
        </div>

        <div className="text-xs font-black text-black/20">
          | | |
        </div>

        <div className="flex gap-[2px]">
          <div className="h-5 w-[2px] bg-black rotate-12" />
          <div className="h-5 w-[2px] bg-black -rotate-12" />
          <div className="h-5 w-[2px] bg-black rotate-12" />
          <div className="h-5 w-[2px] bg-black -rotate-12" />
        </div>
      </div>
    </nav>
  );
}