"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { deleteReport, getReports, Report } from "@/lib/utils";

type ReportWithCitizen = Report & {
  citizen_name?: string;
  user_name?: string;
};

const statusConfig = {
  pending: { label: "PENDING", color: "bg-[#facc15]" },
  in_progress: { label: "IN PROGRESS", color: "bg-blue-400" },
  resolved: { label: "RESOLVED", color: "bg-[#EC4899]" },
};

const severityConfig = {
  low: { label: "LOW", color: "bg-green-200" },
  medium: { label: "MEDIUM", color: "bg-yellow-400" },
  high: { label: "HIGH", color: "bg-orange-500" },
  critical: { label: "CRITICAL", color: "bg-red-600 text-white" },
};

export default function AdminReportsPage() {
  const [reports, setReports] = useState<ReportWithCitizen[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const data = await getReports();
      setReports(data || []);
    } catch (error) {
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const filteredReports = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    return reports.filter((report) => {
      const matchesStatus = statusFilter === "all" || report.status === statusFilter;
      if (!matchesStatus) return false;
      if (!keyword) return true;

      const citizenName = report.citizen_name || report.user_name || "";
      return (
        report.report_id.toLowerCase().includes(keyword) ||
        report.type.toLowerCase().includes(keyword) ||
        report.location.toLowerCase().includes(keyword) ||
        citizenName.toLowerCase().includes(keyword) ||
        String(report.user_id).includes(keyword)
      );
    });
  }, [reports, searchTerm, statusFilter]);

  const handleDelete = async (reportId: string) => {
    if (!confirm("Delete this report?")) return;
    try {
      await deleteReport(reportId);
      toast.success("Report deleted");
      fetchReports();
    } catch (error) {
      toast.error("Failed to delete report");
    }
  };

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
        
        <div className="mb-12 relative inline-block">
          <h1 className="text-[48px] leading-[1.1] tracking-[-0.02em] font-extrabold uppercase inline-block bg-[#FFFDD0] px-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            All Reports
          </h1>
          <div className="h-[4px] w-32 bg-[#EC4899] mt-2" />
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
          <div className="flex gap-3 flex-wrap">
            {["all", "pending", "in_progress", "resolved"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`border-4 border-black px-4 py-2 text-[12px] font-bold uppercase transition-all ${
                  statusFilter === status ? "bg-[#EC4899] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" : "bg-white hover:bg-stone-100"
                }`}
              >
                {status === "all" ? "ALL" : status.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search by ID, type, or citizen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-4 border-black bg-[#FFFDD0] p-3 pr-10 w-full md:w-80 text-[14px] font-medium focus:outline-none focus:bg-[#EC4899]/20"
            />
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-black/50">search</span>
          </div>
        </div>

        {/* Reports Table */}
        <div className="w-full overflow-x-auto bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-black text-white text-[14px] uppercase tracking-widest border-b-4 border-black font-bold">
                <th className="p-4 border-r-4 border-black">ID</th>
                <th className="p-4 border-r-4 border-black">CITIZEN ID</th>
                <th className="p-4 border-r-4 border-black">TYPE</th>
                <th className="p-4 border-r-4 border-black">SEVERITY</th>
                <th className="p-4 border-r-4 border-black">LOCATION</th>
                <th className="p-4 border-r-4 border-black">STATUS</th>
                <th className="p-4 border-r-4 border-black">DATE</th>
                <th className="p-4 text-center">ACTIONS</th>
               </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-stone-500">
                    Loading reports...
                  </td>
                </tr>
              ) : filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-stone-500">
                    No reports found
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => (
                  <tr key={report.id} className="border-b-4 border-black hover:bg-[#FFFDD0] transition-colors">
                    <td className="p-4 border-r-4 border-black font-black">#{report.report_id}</td>
                    <td className="p-4 border-r-4 border-black">
                      {report.citizen_name || report.user_name || `User #${report.user_id}`}
                    </td>
                    <td className="p-4 border-r-4 border-black">{report.type}</td>
                    <td className="p-4 border-r-4 border-black">
                      <span className={`${severityConfig[report.severity as keyof typeof severityConfig]?.color || "bg-stone-200"} border-2 border-black px-2 py-1 text-[11px] font-bold uppercase`}>
                        {severityConfig[report.severity as keyof typeof severityConfig]?.label || report.severity.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 border-r-4 border-black">{report.location}</td>
                    <td className="p-4 border-r-4 border-black">
                      <span className={`${statusConfig[report.status as keyof typeof statusConfig]?.color || "bg-gray-400"} border-2 border-black px-2 py-1 text-[12px] uppercase inline-block font-bold`}>
                        {statusConfig[report.status as keyof typeof statusConfig]?.label || report.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 border-r-4 border-black">
                      {new Date(report.created_at).toLocaleDateString("id-ID")}
                    </td>
                    <td className="p-4 text-center flex items-center justify-center gap-2">
                      <Link href={`/admin/reports/${report.report_id}`}>
                        <button className="bg-white border-2 border-black p-2 hover:bg-black hover:text-white transition-colors">
                          <span className="material-symbols-outlined text-[20px]">visibility</span>
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(report.report_id)}
                        className="bg-white border-2 border-black p-2 hover:bg-red-500 hover:text-white transition-colors"
                      >
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}