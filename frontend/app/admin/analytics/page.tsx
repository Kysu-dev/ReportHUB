"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { getDashboardStats, getReports, DashboardStats, Report } from "@/lib/utils";

const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, reportsData] = await Promise.all([
          getDashboardStats(),
          getReports(),
        ]);
        setStats(statsData);
        setReports(reportsData || []);
      } catch (error) {
        toast.error("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalReports = stats?.total_reports ?? reports.length;
  const pendingCount = stats?.pending ?? reports.filter((r) => r.status === "pending").length;
  const inProgressCount = stats?.in_progress ?? reports.filter((r) => r.status === "in_progress").length;
  const resolvedCount = stats?.resolved ?? reports.filter((r) => r.status === "resolved").length;

  const reportsByType = useMemo(() => {
    const map = new Map<string, number>();
    reports.forEach((report) => {
      map.set(report.type, (map.get(report.type) || 0) + 1);
    });
    return Array.from(map.entries())
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count);
  }, [reports]);

  const reportsByMonth = useMemo(() => {
    const counts = new Array(12).fill(0);
    reports.forEach((report) => {
      const date = new Date(report.created_at);
      const month = date.getMonth();
      if (!Number.isNaN(month)) {
        counts[month] += 1;
      }
    });
    return counts.map((count, idx) => ({ month: monthLabels[idx], count }));
  }, [reports]);

  const maxTypeCount = Math.max(1, ...reportsByType.map((item) => item.count));
  const maxMonthCount = Math.max(1, ...reportsByMonth.map((item) => item.count));

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
            Analytics
          </h1>
          <div className="h-[4px] w-32 bg-[#EC4899] mt-2" />
          <p className="text-[18px] leading-[1.5] font-medium mt-6 max-w-2xl bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            Overview of system performance and report statistics.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white border-4 border-black p-6 relative overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-[14px] uppercase mb-2 border-b-4 border-black inline-block font-bold">TOTAL REPORTS</h3>
            <p className="text-[64px] leading-none font-black mt-4">{totalReports}</p>
            <span className="material-symbols-outlined absolute bottom-4 right-4 text-4xl text-black opacity-20">assignment</span>
          </div>
          <div className="bg-[#facc15] border-4 border-black p-6 relative overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-[14px] uppercase mb-2 border-b-4 border-black inline-block font-bold">PENDING</h3>
            <p className="text-[64px] leading-none font-black mt-4">{pendingCount}</p>
            <span className="material-symbols-outlined absolute bottom-4 right-4 text-4xl text-black opacity-20">schedule</span>
          </div>
          <div className="bg-blue-400 border-4 border-black p-6 relative overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-[14px] uppercase mb-2 border-b-4 border-black inline-block font-bold">IN PROGRESS</h3>
            <p className="text-[64px] leading-none font-black mt-4">{inProgressCount}</p>
            <span className="material-symbols-outlined absolute bottom-4 right-4 text-4xl text-black opacity-20">engineering</span>
          </div>
          <div className="bg-[#EC4899] border-4 border-black p-6 relative overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-[14px] uppercase mb-2 border-b-4 border-black inline-block font-bold">RESOLVED</h3>
            <p className="text-[64px] leading-none font-black mt-4">{resolvedCount}</p>
            <span className="material-symbols-outlined absolute bottom-4 right-4 text-4xl text-black opacity-20">check_circle</span>
          </div>
        </div>

        {/* Reports by Type */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
            <div className="bg-black border-b-4 border-black px-6 py-3">
              <h2 className="text-[20px] font-bold uppercase text-white flex items-center gap-2">
                <span className="material-symbols-outlined">category</span>
                Reports by Type
              </h2>
            </div>
            <div className="p-6">
              {loading ? (
                <p className="text-stone-500">Loading breakdown...</p>
              ) : reportsByType.length === 0 ? (
                <p className="text-stone-500">No report data yet.</p>
              ) : (
                reportsByType.map((item) => (
                  <div key={item.type} className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-[14px] font-bold uppercase">{item.type}</span>
                      <span className="text-[14px] font-bold">{item.count}</span>
                    </div>
                    <div className="w-full bg-[#FFFDD0] border-2 border-black h-6">
                      <div
                        className="bg-[#EC4899] h-full flex items-center justify-end px-2 text-[11px] font-bold text-white"
                        style={{ width: `${Math.round((item.count / maxTypeCount) * 100)}%` }}
                      >
                        {Math.round((item.count / Math.max(totalReports, 1)) * 100)}%
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Reports by Month (Bar Chart) */}
          <div className="border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
            <div className="bg-black border-b-4 border-black px-6 py-3">
              <h2 className="text-[20px] font-bold uppercase text-white flex items-center gap-2">
                <span className="material-symbols-outlined">calendar_month</span>
                Reports by Month (2024)
              </h2>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-end h-64 gap-2">
                {reportsByMonth.map((item) => (
                  <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full bg-[#EC4899] border-2 border-black transition-all hover:bg-[#22C55E]"
                      style={{ height: `${Math.round((item.count / maxMonthCount) * 200)}px` }}
                    />
                    <span className="text-[12px] font-bold uppercase">{item.month}</span>
                    <span className="text-[10px] font-bold">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden mb-8">
          <div className="bg-black border-b-4 border-black px-6 py-3">
            <h2 className="text-[20px] font-bold uppercase text-white flex items-center gap-2">
              <span className="material-symbols-outlined">donut_large</span>
              Status Distribution
            </h2>
          </div>
          <div className="p-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="flex justify-between mb-2">
                  <span className="text-[14px] font-bold uppercase">Pending</span>
                  <span className="text-[14px] font-bold">{pendingCount}</span>
                </div>
                <div className="w-full bg-[#FFFDD0] border-2 border-black h-8">
                  <div className="bg-[#facc15] h-full flex items-center justify-end px-2 text-[12px] font-bold" style={{ width: `${(pendingCount / Math.max(totalReports, 1)) * 100}%` }}>
                    {Math.round((pendingCount / Math.max(totalReports, 1)) * 100)}%
                  </div>
                </div>
              </div>
              <div className="flex-1 min-w-[200px]">
                <div className="flex justify-between mb-2">
                  <span className="text-[14px] font-bold uppercase">In Progress</span>
                  <span className="text-[14px] font-bold">{inProgressCount}</span>
                </div>
                <div className="w-full bg-[#FFFDD0] border-2 border-black h-8">
                  <div className="bg-blue-400 h-full flex items-center justify-end px-2 text-[12px] font-bold" style={{ width: `${(inProgressCount / Math.max(totalReports, 1)) * 100}%` }}>
                    {Math.round((inProgressCount / Math.max(totalReports, 1)) * 100)}%
                  </div>
                </div>
              </div>
              <div className="flex-1 min-w-[200px]">
                <div className="flex justify-between mb-2">
                  <span className="text-[14px] font-bold uppercase">Resolved</span>
                  <span className="text-[14px] font-bold">{resolvedCount}</span>
                </div>
                <div className="w-full bg-[#FFFDD0] border-2 border-black h-8">
                  <div className="bg-[#EC4899] h-full flex items-center justify-end px-2 text-[12px] font-bold text-white" style={{ width: `${(resolvedCount / Math.max(totalReports, 1)) * 100}%` }}>
                    {Math.round((resolvedCount / Math.max(totalReports, 1)) * 100)}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="text-center">
          <p className="text-[14px] text-black/50 italic border-t-4 border-black/20 pt-6">
            Data based on latest reports | Last sync: {new Date().toLocaleDateString()}
          </p>
        </div>
      </main>
    </>
  );
}