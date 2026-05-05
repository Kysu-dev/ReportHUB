"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { getDashboardStats, getReports, DashboardStats, Report } from "@/lib/utils";

type ReportWithCitizen = Report & {
  citizen_name?: string;
  user_name?: string;
};

const statusConfig = {
  pending: { label: "PENDING", color: "bg-[#facc15]" },
  in_progress: { label: "IN PROGRESS", color: "bg-blue-400" },
  resolved: { label: "RESOLVED", color: "bg-[#EC4899]" },
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentReports, setRecentReports] = useState<ReportWithCitizen[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, reportsData] = await Promise.all([
          getDashboardStats(),
          getReports(),
        ]);
        setStats(statsData);
        setRecentReports(reportsData.slice(0, 8));
      } catch (error) {
        toast.error("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    { label: "TOTAL REPORTS", value: stats?.total_reports ?? 0, icon: "assignment", color: "bg-white" },
    { label: "PENDING", value: stats?.pending ?? 0, icon: "schedule", color: "bg-[#facc15]" },
    { label: "IN PROGRESS", value: stats?.in_progress ?? 0, icon: "engineering", color: "bg-blue-400" },
    { label: "RESOLVED", value: stats?.resolved ?? 0, icon: "check_circle", color: "bg-[#EC4899]" },
  ];

  return (
    <>
      {/* TopAppBar */}
      <header className="flex justify-between items-center w-full px-6 py-4 bg-[#FFFDD0] border-b-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <span className="text-3xl font-black uppercase tracking-tighter text-black border-4 border-black px-2 py-1 bg-[#EC4899]">
            InfraAlert
          </span>
        </div>
        <div className="flex items-center gap-6">
          <button className="text-black hover:text-[#EC4899] transition-colors p-2 border-4 border-transparent hover:border-black hover:bg-white">
            <span className="material-symbols-outlined text-3xl">notifications</span>
          </button>
          <div className="w-12 h-12 border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
            <img
              alt="Admin profile"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsWVdahJWZoJX_wbtdfmmIdo7BVKb7aU2Pco4yPa9dvyGANnGuxmVVy8Sf1s3VyCbXEf8nlQs3W93_ZlxeZkMf-dIXNEPrIZPKjdvDAD0tL2LAytQ5-pDOAVa8zyf4l2Z7C9fmkbS4f2J67FlYyoNnxYt-6YDZq8UTJ8BwyTW4D5gbpGKx-RUgfDZvd7oQ-1OnYFLZdF-ySFwBce_eLh6CaJnHWbf1M88LRBrYtsMLxR9EYHnwiSqmxToK9jGYCH5GTb6ccvYnlo4"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:24px_24px]">
        
        {/* Page Header */}
        <div className="mb-12 relative inline-block">
          <h1 className="text-[48px] leading-[1.1] tracking-[-0.02em] font-extrabold uppercase inline-block bg-[#FFFDD0] px-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            Admin Dashboard
          </h1>
          <div className="h-[4px] w-32 bg-[#EC4899] mt-2" />
          <p className="text-[18px] leading-[1.5] font-medium mt-6 max-w-2xl bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            Overview of all citizen reports and system statistics.
          </p>
        </div>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {loading
            ? [...Array(4)].map((_, idx) => (
                <div
                  key={idx}
                  className="bg-white border-4 border-black p-6 h-36 animate-pulse shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                />
              ))
            : statCards.map((stat) => (
                <div
                  key={stat.label}
                  className={`${stat.color} border-4 border-black p-6 relative overflow-hidden group hover:-translate-y-2 transition-transform shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}
                >
                  <h3 className="text-[14px] uppercase mb-2 relative z-10 border-b-4 border-black inline-block font-bold">
                    {stat.label}
                  </h3>
                  <p className="text-[64px] leading-none font-black relative z-10 mt-4">
                    {stat.value}
                  </p>
                  <span className="material-symbols-outlined absolute bottom-4 right-4 text-4xl text-black opacity-20">
                    {stat.icon}
                  </span>
                </div>
              ))}
        </section>

        {/* Recent Reports Table */}
        <section>
          <h2 className="text-[32px] font-bold uppercase mb-6 bg-white border-4 border-black px-4 py-2 inline-block shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            Recent Reports
          </h2>
          <div className="w-full overflow-x-auto bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-black text-white text-[14px] uppercase tracking-widest border-b-4 border-black font-bold">
                  <th className="p-4 border-r-4 border-black">ID</th>
                  <th className="p-4 border-r-4 border-black">CITIZEN ID</th>
                  <th className="p-4 border-r-4 border-black">ISSUE TYPE</th>
                  <th className="p-4 border-r-4 border-black">LOCATION</th>
                  <th className="p-4 border-r-4 border-black">STATUS</th>
                  <th className="p-4 border-r-4 border-black">DATE</th>
                  <th className="p-4 text-center">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-stone-500">
                      Loading reports...
                    </td>
                  </tr>
                ) : recentReports.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-stone-500">
                      No reports available yet.
                    </td>
                  </tr>
                ) : (
                  recentReports.map((report) => (
                    <tr key={report.id} className="border-b-4 border-black hover:bg-[#FFFDD0] transition-colors">
                      <td className="p-4 border-r-4 border-black font-black">#{report.report_id}</td>
                      <td className="p-4 border-r-4 border-black">
                        {report.citizen_name || report.user_name || `User #${report.user_id}`}
                      </td>
                      <td className="p-4 border-r-4 border-black">{report.type}</td>
                      <td className="p-4 border-r-4 border-black">{report.location}</td>
                      <td className="p-4 border-r-4 border-black">
                        <span
                          className={`${statusConfig[report.status]?.color || "bg-gray-400"} border-2 border-black px-2 py-1 text-[12px] uppercase inline-block font-bold`}
                        >
                          {statusConfig[report.status]?.label || report.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4 border-r-4 border-black">
                        {new Date(report.created_at).toLocaleDateString("id-ID")}
                      </td>
                      <td className="p-4 text-center">
                        <Link href={`/admin/reports/${report.report_id}`}>
                          <button className="bg-white border-2 border-black p-2 hover:bg-black hover:text-white transition-colors">
                            <span className="material-symbols-outlined text-[20px]">visibility</span>
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </>
  );
}