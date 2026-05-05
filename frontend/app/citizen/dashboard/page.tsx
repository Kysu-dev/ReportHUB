// app/citizen/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/sidebar";
import CitizenPageTitle from "@/components/citizen-page-title";
import { getDashboardStats, getReports, DashboardStats, Report } from "@/lib/api";
import toast from "react-hot-toast";

const citizenRoutes = [
  { label: "Dashboard", href: "/citizen/dashboard", icon: "dashboard" },
  { label: "Reports", href: "/citizen/reports", icon: "analytics" },
  { label: "Submit Report", href: "/citizen/submit", icon: "add_circle" },
  { label: "Settings", href: "/citizen/settings", icon: "settings" },
];

const statusConfig = {
  pending: { label: "PENDING", color: "bg-[#facc15]" },
  in_progress: { label: "IN PROGRESS", color: "bg-blue-400" },
  resolved: { label: "RESOLVED", color: "bg-[#22C55E]" },
};

export default function CitizenDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentReports, setRecentReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  const header = <CitizenPageTitle title="Citizen Dashboard" className="mb-6" />;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, reportsData] = await Promise.all([
          getDashboardStats(),
          getReports(),
        ]);
        setStats(statsData);
        setRecentReports(reportsData.slice(0, 5));
      } catch (error) {
        toast.error("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="bg-[#FFFDD0] min-h-screen flex flex-row">
        <Sidebar routes={citizenRoutes} userRole="citizen" />
        <div className="flex-1 ml-0 md:ml-72 p-6 md:p-12 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:24px_24px]">
          <div className="animate-pulse space-y-6">
            {header}
            <div className="grid grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-300 border-4 border-black"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFDD0] min-h-screen flex flex-row">
      <Sidebar routes={citizenRoutes} userRole="citizen" />
      
      <div className="flex-1 ml-0 md:ml-72 p-6 md:p-12 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:24px_24px]">
        {header}

        <div className="mb-10 flex flex-wrap items-center gap-4">
          <div className="h-[6px] w-32 border-2 border-black bg-[#22C55E]" />
          <div className="h-[6px] w-24 border-2 border-black bg-white" />
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 border-2 border-black bg-black" />
            <span className="h-3 w-3 border-2 border-black bg-white rotate-45" />
            <span className="h-3 w-3 border-2 border-black bg-[#22C55E]" />
          </div>
          <div className="flex gap-1">
            <span className="h-5 w-[2px] bg-black rotate-12" />
            <span className="h-5 w-[2px] bg-black -rotate-12" />
            <span className="h-5 w-[2px] bg-black rotate-12" />
            <span className="h-5 w-[2px] bg-black -rotate-12" />
          </div>
          <div className="h-[2px] flex-1 border-t-4 border-black min-w-[120px]" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white border-4 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-[14px] uppercase font-bold border-b-4 border-black inline-block pb-1">
              Total Reports
            </h3>
            <p className="text-6xl font-black mt-4">{stats?.total_reports || 0}</p>
          </div>
          <div className="bg-[#facc15] border-4 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-[14px] uppercase font-bold border-b-4 border-black inline-block pb-1">
              Pending
            </h3>
            <p className="text-6xl font-black mt-4">{stats?.pending || 0}</p>
          </div>
          <div className="bg-blue-400 border-4 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-[14px] uppercase font-bold border-b-4 border-black inline-block pb-1">
              In Progress
            </h3>
            <p className="text-6xl font-black mt-4">{stats?.in_progress || 0}</p>
          </div>
          <div className="bg-[#22C55E] border-4 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-[14px] uppercase font-bold border-b-4 border-black inline-block pb-1">
              Resolved
            </h3>
            <p className="text-6xl font-black mt-4">{stats?.resolved || 0}</p>
          </div>
        </div>

        <Link href="/citizen/submit">
          <button className="bg-[#22C55E] border-4 border-black px-12 py-6 text-2xl font-bold uppercase mb-12 -rotate-1 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all hover:rotate-0 hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
            + SUBMIT NEW REPORT
          </button>
        </Link>

        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div className="relative inline-block">
            <div
              className="absolute inset-0 -rotate-1 translate-x-1 translate-y-1 border-4 border-black bg-[#22C55E]"
              aria-hidden="true"
            />
            <h2 className="relative z-10 inline-block bg-white border-4 border-black px-4 py-2 text-2xl font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              Recent Reports
            </h2>
          </div>
          <div className="relative inline-block">
            <div
              className="absolute inset-0 -rotate-2 translate-x-1 translate-y-1 border-4 border-black bg-black"
              aria-hidden="true"
            />
            <span className="relative z-10 inline-block border-4 border-black bg-black px-3 py-2 text-xs font-black uppercase tracking-[0.2em] text-white">
              Latest Chaos
            </span>
          </div>
        </div>
        <div className="overflow-x-auto bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="bg-black text-white">
                <th className="p-4 text-left">ID</th><th className="p-4 text-left">Type</th><th className="p-4 text-left">Location</th>
                <th className="p-4 text-left">Status</th><th className="p-4 text-left">Date</th><th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentReports.map((report) => (
                <tr key={report.id} className="border-t-4 border-black">
                  <td className="p-4 font-bold">#{report.report_id}</td>
                  <td className="p-4">{report.type}</td>
                  <td className="p-4">{report.location}</td>
                  <td className="p-4"><span className={`${statusConfig[report.status].color} border-2 border-black px-2 py-1 text-xs font-bold uppercase`}>{statusConfig[report.status].label}</span></td>
                  <td className="p-4">{new Date(report.created_at).toLocaleDateString()}</td>
                  <td className="p-4 text-center">
                    <Link href={`/citizen/reports/${report.report_id}`}>
                      <button className="border-2 border-black p-2 hover:bg-black hover:text-white"><span className="material-symbols-outlined text-xl">visibility</span></button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}