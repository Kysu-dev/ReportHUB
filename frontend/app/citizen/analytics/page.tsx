"use client";

import Sidebar from "@/components/sidebar";
import CitizenPageTitle from "@/components/citizen-page-title";

const citizenRoutes = [
  { label: "Dashboard", href: "/citizen/dashboard", icon: "dashboard" },
  { label: "Reports", href: "/citizen/reports", icon: "analytics" },
  { label: "Submit Report", href: "/citizen/submit", icon: "add_circle" },
  { label: "Settings", href: "/citizen/settings", icon: "settings" },
];

export default function CitizenAnalyticsPage() {
  return (
    <div className="bg-[#FFFDD0] min-h-screen flex flex-row">
      <Sidebar routes={citizenRoutes} userRole="citizen" />
      <div className="flex-1 ml-0 md:ml-72 p-6 md:p-12 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:24px_24px]">
        <CitizenPageTitle title="Analitik Laporan" className="mb-4" />
        <p className="mb-8 text-sm text-stone-600">
          Ringkasan tren laporan dan status penyelesaian.
        </p>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="border-4 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-lg font-black uppercase">Laporan Bulanan</h2>
            <p className="mt-2 text-sm text-stone-600">
              Ringkasan volume laporan tiap bulan.
            </p>
          </div>
          <div className="border-4 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-lg font-black uppercase">Status Terbaru</h2>
            <p className="mt-2 text-sm text-stone-600">
              Distribusi status laporan Anda.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
