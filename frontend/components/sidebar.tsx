"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  FileText,
  Map,
  Settings,
  AlertTriangle,
  History,
  Users,
  BarChart3,
  PlusCircle,
  type LucideIcon,
} from "lucide-react";

const IconMap: Record<string, LucideIcon> = {
  dashboard: LayoutDashboard,
  reports: FileText,
  map: Map,
  settings: Settings,
  alert: AlertTriangle,
  history: History,
  users: Users,
  analytics: BarChart3,
  add_circle: PlusCircle,
};

type RouteItem = {
  label: string;
  href: string;
  icon: string;
};

type SidebarProps = {
  routes: RouteItem[];
  userRole: "citizen" | "admin";
  onLogout?: () => void;
};

export default function Sidebar({ routes, userRole, onLogout }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const accentColor = userRole === "admin" ? "bg-[#EC4899]" : "bg-[#22C55E]";
  const handleLogout = () => {
    onLogout?.();
    setIsOpen(false);
    router.push("/#hero");
  };

  return (
    <>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed left-4 top-4 z-50 border-4 border-black bg-white p-2 transition-transform active:translate-x-1 active:translate-y-1 md:hidden"
        aria-label="Toggle Menu"
      >
        {isOpen ? <X size={24} strokeWidth={3} /> : <Menu size={24} strokeWidth={3} />}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen w-72 flex-col border-r-4 border-black bg-[#FFFBF0] transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="border-b-4 border-black p-8">
          <div className="flex flex-col">
            <span className="text-3xl font-black italic uppercase leading-none tracking-tighter">
              InfraAlert
            </span>
            <div
              className={`mt-1 inline-flex h-6 w-fit items-center border-2 border-black px-2 text-[10px] font-black uppercase tracking-widest ${accentColor}`}
            >
              {userRole === "admin" ? "Staff Portal" : "Citizen Portal"}
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-4 overflow-y-auto px-4 py-6">
          {routes.map((route) => {
            const IconComponent = IconMap[route.icon.toLowerCase()] || LayoutDashboard;
            const isActive = pathname === route.href;

            return (
              <Link
                key={route.href}
                href={route.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-4 border-4 border-black p-4 font-bold uppercase transition-all ${
                  isActive
                    ? `${accentColor} -rotate-1 -translate-y-1 translate-x-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`
                    : "bg-white hover:bg-stone-100"
                }`}
              >
                <IconComponent size={24} strokeWidth={3} />
                <span className="text-sm tracking-tight">{route.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t-4 border-black p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 border-4 border-black bg-white p-4 text-sm font-black uppercase tracking-widest transition-all hover:bg-red-50 active:translate-x-1 active:translate-y-1"
          >
            <LogOut size={20} strokeWidth={3} />
            Logout
          </button>

          <div className="mt-4 text-center">
            <p className="text-[10px] font-bold uppercase italic text-stone-500">
              &quot;Nothing&apos;s broken here... yet&quot;
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}