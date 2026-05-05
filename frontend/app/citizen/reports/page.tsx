"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/sidebar";
import { getReports, deleteReport, Report } from "@/lib/utils";
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

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const fetchReports = async () => {
    try {
      const data = await getReports();
      setReports(data || []);
    } catch (error) {
      console.error("Failed to load reports:", error);
      toast.error("Failed to load reports");
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this report?")) {
      try {
        await deleteReport(id);
        toast.success("Deleted!");
        fetchReports();
      } catch (error) {
        toast.error("Failed to delete");
      }
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const filteredReports = reports && reports.length > 0 
    ? reports.filter((r) => filter === "all" || r.status === filter)
    : [];

  if (loading) {
    return (
      <div className="bg-[#FFFDD0] min-h-screen flex flex-row">
        <Sidebar routes={citizenRoutes} userRole="citizen" />
        <div className="flex-1 ml-0 md:ml-72 p-6 md:p-12 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:24px_24px]">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFDD0] min-h-screen flex flex-row">
      <Sidebar routes={citizenRoutes} userRole="citizen" />
      <div className="flex-1 ml-0 md:ml-72 p-6 md:p-12 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:24px_24px]">
        <h1 className="text-[48px] font-extrabold uppercase mb-6">My Reports</h1>
        
        <div className="flex gap-4 mb-6">
          {["all", "pending", "in_progress", "resolved"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`border-4 border-black px-4 py-2 text-xs font-bold uppercase ${
                filter === s ? "bg-[#22C55E] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" : "bg-white"
              }`}
            >
              {s.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="bg-black text-white">
                <th className="p-4 text-left">ID</th>
                <th className="p-4 text-left">Type</th>
                <th className="p-4 text-left">Location</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    No reports found. Create your first report!
                  </td>
                </tr>
              ) : (
                filteredReports.map((r) => (
                  <tr key={r.id} className="border-t-4 border-black">
                    <td className="p-4 font-bold">#{r.report_id}</td>
                    <td className="p-4">{r.type}</td>
                    <td className="p-4">{r.location}</td>
                    <td className="p-4">
                      <span className={`${statusConfig[r.status]?.color || "bg-gray-400"} border-2 border-black px-2 py-1 text-xs font-bold uppercase`}>
                        {statusConfig[r.status]?.label || r.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4">{new Date(r.created_at).toLocaleDateString()}</td>
                    <td className="p-4 flex gap-2 justify-center">
                      <Link href={`/citizen/reports/${r.report_id}`}>
                        <button className="border-2 border-black p-2 hover:bg-black hover:text-white transition-colors">
                          <span className="material-symbols-outlined text-xl">visibility</span>
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(r.report_id)}
                        className="border-2 border-black p-2 hover:bg-red-500 hover:text-white transition-colors"
                      >
                        <span className="material-symbols-outlined text-xl">delete</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}