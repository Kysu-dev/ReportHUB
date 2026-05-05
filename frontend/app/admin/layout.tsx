"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/sidebar";
import { getCurrentUser } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

const adminRoutes = [
  { label: "Dashboard", href: "/admin/dashboard", icon: "dashboard" },
  { label: "Reports", href: "/admin/reports", icon: "reports" },
  { label: "Analytics", href: "/admin/analytics", icon: "analytics" },
  { label: "Settings", href: "/admin/settings", icon: "settings" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { logout } = useAuthStore();
  const user = getCurrentUser();
  const isReady = Boolean(user && user.role === "admin");

  useEffect(() => {
    if (!user) {
      router.push("/auth/login-admin");
      return;
    }
    if (user.role !== "admin") {
      toast.error("Admin access only");
      router.push("/auth/login-admin");
      return;
    }
  }, [router, user]);

  if (!isReady) {
    return (
      <div className="bg-[#FFFDD0] min-h-screen flex items-center justify-center">
        <div className="border-4 border-black bg-white px-6 py-4 font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFDD0] text-black font-body-md antialiased min-h-screen flex flex-row selection:bg-[#EC4899] selection:text-black">
      <Sidebar routes={adminRoutes} userRole="admin" onLogout={logout} />
      <div className="flex-1 flex flex-col min-w-0 ml-0 md:ml-72">
        {children}
      </div>
    </div>
  );
}