"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/sidebar";
import toast from "react-hot-toast";

const citizenRoutes = [
  { label: "Dashboard", href: "/citizen/dashboard", icon: "dashboard" },
  { label: "Reports", href: "/citizen/reports", icon: "analytics" },
  { label: "Submit Report", href: "/citizen/submit", icon: "add_circle" },
  { label: "Settings", href: "/citizen/settings", icon: "settings" },
];

const statusConfig: Record<string, { label: string; color: string; textColor: string }> = {
  pending: { label: "PENDING", color: "bg-[#facc15]", textColor: "text-black" },
  in_progress: { label: "IN PROGRESS", color: "bg-blue-400", textColor: "text-black" },
  resolved: { label: "RESOLVED", color: "bg-[#22C55E]", textColor: "text-black" },
};

export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [report, setReport] = useState<any>(null);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const reportId = params.id as string;

  const fetchReport = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

      const response = await fetch(`${apiBase}/reports/${reportId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json();

      if (result.success) {
        setReport(result.data.report);
        setTimeline(result.data.timeline || []);
      } else {
        toast.error(result.error || "Report not found");
        router.push("/citizen/reports");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to load report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (reportId) {
      fetchReport();
    }
  }, [reportId]);

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

      const response = await fetch(`${apiBase}/reports/${reportId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Report deleted successfully");
        router.push("/citizen/reports");
      } else {
        toast.error(result.error || "Failed to delete");
      }
    } catch (error) {
      toast.error("Failed to delete report");
    }
    setShowDeleteConfirm(false);
  };

  if (loading) {
    return (
      <div className="bg-[#FFFDD0] min-h-screen flex flex-row">
        <Sidebar routes={citizenRoutes} userRole="citizen" />
        <div className="flex-1 ml-0 md:ml-72 p-6 md:p-12 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:24px_24px]">
          <div className="animate-pulse text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="bg-[#FFFDD0] min-h-screen flex flex-row">
        <Sidebar routes={citizenRoutes} userRole="citizen" />
        <div className="flex-1 ml-0 md:ml-72 p-6 md:p-12 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:24px_24px]">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Report not found</h1>
            <Link href="/citizen/reports">
              <button className="mt-4 border-4 border-black bg-[#22C55E] px-6 py-2 font-bold uppercase">Back</button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const apiBase = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:8080";
  const imageUrl = report.image_url ? `${apiBase}${report.image_url}` : null;

  return (
    <div className="bg-[#FFFDD0] min-h-screen flex flex-row">
      <Sidebar routes={citizenRoutes} userRole="citizen" />

      <div className="flex-1 ml-0 md:ml-72 p-6 md:p-12 overflow-y-auto bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:24px_24px]">
        {/* Header Back & Delete */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/citizen/reports">
            <button className="flex items-center gap-2 border-4 border-black bg-white px-4 py-2 text-[12px] font-bold uppercase hover:bg-[#22C55E] transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              Back to Reports
            </button>
          </Link>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="border-4 border-red-500 bg-white px-4 py-2 text-[12px] font-bold uppercase text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            Delete Report
          </button>
        </div>

        {/* Delete Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-[#FFFDD0] border-4 border-black p-6 max-w-md mx-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-2xl font-black uppercase mb-4">Delete Report?</h2>
              <p className="mb-6">
                Are you sure you want to delete report <span className="font-bold">#{report.report_id}</span>? This
                action cannot be undone.
              </p>
              <div className="flex gap-4 justify-end">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="border-4 border-black bg-white px-4 py-2 font-bold uppercase hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="border-4 border-red-500 bg-red-500 text-white px-4 py-2 font-bold uppercase hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header Card */}
        <div className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8 overflow-hidden">
          <div className="bg-black px-6 py-4">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <h1 className="text-4xl md:text-5xl font-black uppercase text-white">
                Report #{report.report_id}
              </h1>
              <span
                className={`${statusConfig[report.status]?.color || "bg-gray-400"} border-2 border-black px-4 py-2 text-sm font-bold uppercase ${statusConfig[report.status]?.textColor || "text-black"} shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}
              >
                {statusConfig[report.status]?.label || report.status.toUpperCase()}
              </span>
            </div>
            <p className="text-stone-400 mt-2">
              Submitted on{" "}
              {new Date(report.created_at).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {imageUrl ? (
              <div className="border-4 border-black bg-white overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <img src={imageUrl} alt={report.type} className="w-full h-auto max-h-96 object-cover" />
                <div className="bg-[#22C55E] border-t-4 border-black px-4 py-2">
                  <p className="text-xs font-bold uppercase">Evidence Photo</p>
                </div>
              </div>
            ) : (
              <div className="border-4 border-black bg-white flex flex-col items-center justify-center py-16 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <span className="material-symbols-outlined text-6xl text-stone-400">image_not_supported</span>
                <p className="text-stone-500 mt-2 font-bold">No photo uploaded</p>
              </div>
            )}

            <div className="border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
              <div className="bg-[#22C55E] border-b-4 border-black px-6 py-4">
                <h2 className="text-xl font-bold uppercase flex items-center gap-2">
                  <span className="material-symbols-outlined">info</span>
                  Report Details
                </h2>
              </div>
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-[11px] font-bold uppercase text-stone-500">Issue Type</p>
                    <p className="text-xl font-black mt-1">{report.type}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase text-stone-500">Severity</p>
                    <span className="inline-block mt-1 px-3 py-1 border-2 border-black text-xs font-bold uppercase">
                      {report.severity?.toUpperCase() || "MEDIUM"}
                    </span>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase text-stone-500">Report ID</p>
                    <p className="font-mono font-bold text-sm mt-1">#{report.report_id}</p>
                  </div>
                </div>

                <div>
                  <p className="text-[11px] font-bold uppercase text-stone-500">Location</p>
                  <p className="flex items-center gap-2 mt-1 text-lg font-medium">
                    <span className="material-symbols-outlined text-xl">location_on</span>
                    {report.location}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] font-bold uppercase text-stone-500">Description</p>
                  <p className="mt-2 leading-relaxed text-stone-700">
                    {report.description || "No description provided."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Timeline */}
          <div className="space-y-6">
            <div className="border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden sticky top-28">
              <div className="bg-black border-b-4 border-black px-6 py-4">
                <h2 className="text-xl font-bold uppercase text-white flex items-center gap-2">
                  <span className="material-symbols-outlined">timeline</span>
                  Progress Timeline
                </h2>
              </div>
              <div className="p-6">
                {timeline.length === 0 ? (
                  <div className="text-center py-8">
                    <span className="material-symbols-outlined text-4xl text-stone-400">pending</span>
                    <p className="text-stone-500 mt-2 font-medium">No timeline updates yet</p>
                    <p className="text-stone-400 text-sm mt-1">Check back later for progress</p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {timeline.map((item, idx) => (
                      <div key={idx} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-5 h-5 border-2 border-black ${idx === timeline.length - 1 ? "bg-[#22C55E]" : "bg-white"}`}
                          />
                          {idx < timeline.length - 1 && <div className="w-0.5 h-10 bg-black mt-1" />}
                        </div>
                        <div className="flex-1 pb-4">
                          <p
                            className={`text-sm font-black uppercase ${idx === timeline.length - 1 ? "text-black" : "text-stone-400"}`}
                          >
                            {item.status === "pending"
                              ? "Report Submitted"
                              : item.status === "in_progress"
                                ? "In Progress"
                                : item.status === "resolved"
                                  ? "Resolved"
                                  : item.status}
                          </p>
                          <p
                            className={`text-xs mt-1 ${idx === timeline.length - 1 ? "text-stone-600" : "text-stone-400"}`}
                          >
                            {new Date(item.created_at).toLocaleString("id-ID")}
                          </p>
                          {item.notes && (
                            <p className="text-xs text-stone-500 mt-2 italic">"{item.notes}"</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}