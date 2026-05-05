"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { getReportById, updateReportStatus } from "@/lib/utils";

const statusOptions = ["pending", "in_progress", "resolved"];
const statusLabels = { pending: "PENDING", in_progress: "IN PROGRESS", resolved: "RESOLVED" };
const statusColors = { pending: "bg-[#facc15]", in_progress: "bg-blue-400", resolved: "bg-[#EC4899]" };

export default function AdminReportDetailPage() {
  const params = useParams();
  const reportId = params.id as string;
  const [report, setReport] = useState<any>(null);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("pending");
  const [assignee, setAssignee] = useState("");
  const [notes, setNotes] = useState("");

  const fetchReport = async () => {
    try {
      setLoading(true);
      const data = await getReportById(reportId);
      setReport(data.report);
      setTimeline(data.timeline || []);
      setSelectedStatus(data.report?.status || "pending");
    } catch (error) {
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

  const handleUpdateStatus = async () => {
    if (!report) return;
    setSaving(true);
    try {
      await updateReportStatus(
        report.report_id,
        selectedStatus,
        notes.trim() || undefined,
        assignee.trim() || undefined
      );
      toast.success("Status updated");
      setNotes("");
      fetchReport();
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <header className="flex justify-between items-center w-full px-6 py-4 bg-[#FFFDD0] border-b-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <span className="text-3xl font-black uppercase tracking-tighter text-black border-4 border-black px-2 py-1 bg-[#EC4899]">
              InfraAlert
            </span>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-12 overflow-y-auto bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:24px_24px]">
          <div className="border-4 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-pulse">
            Loading report...
          </div>
        </main>
      </>
    );
  }

  if (!report) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="text-center">
          <h1 className="text-2xl font-black">Report Not Found</h1>
          <Link href="/admin/reports">
            <button className="mt-4 border-4 border-black bg-[#EC4899] px-6 py-2 font-bold">Back to Reports</button>
          </Link>
        </div>
      </div>
    );
  }

  const apiBase = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:8080";
  const imageUrl = report.image_url ? `${apiBase}${report.image_url}` : null;
  const citizenLabel = report.citizen_name || report.user_name || `User #${report.user_id}`;

  return (
    <>
      <header className="flex justify-between items-center w-full px-6 py-4 bg-[#FFFDD0] border-b-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <span className="text-3xl font-black uppercase tracking-tighter text-black border-4 border-black px-2 py-1 bg-[#EC4899]">
            InfraAlert
          </span>
        </div>
        <div className="w-12 h-12 border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          <img alt="Admin" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsWVdahJWZoJX_wbtdfmmIdo7BVKb7aU2Pco4yPa9dvyGANnGuxmVVy8Sf1s3VyCbXEf8nlQs3W93_ZlxeZkMf-dIXNEPrIZPKjdvDAD0tL2LAytQ5-pDOAVa8zyf4l2Z7C9fmkbS4f2J67FlYyoNnxYt-6YDZq8UTJ8BwyTW4D5gbpGKx-RUgfDZvd7oQ-1OnYFLZdF-ySFwBce_eLh6CaJnHWbf1M88LRBrYtsMLxR9EYHnwiSqmxToK9jGYCH5GTb6ccvYnlo4" />
        </div>
      </header>

      <main className="flex-1 p-6 md:p-12 overflow-y-auto bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:24px_24px]">
        
        <Link href="/admin/reports">
          <button className="flex items-center gap-2 border-4 border-black bg-white px-4 py-2 text-[12px] font-bold uppercase mb-6 hover:bg-[#EC4899] transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Back to Reports
          </button>
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-[48px] leading-[1.1] tracking-[-0.02em] font-extrabold uppercase">Report #{report.report_id}</h1>
            <p className="text-[16px] text-stone-600">
              Submitted on {new Date(report.created_at).toLocaleDateString("id-ID")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {imageUrl ? (
              <div className="border-4 border-black bg-white overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <img src={imageUrl} alt={report.type} className="w-full h-auto max-h-96 object-cover" />
                <div className="bg-[#EC4899] border-t-4 border-black px-4 py-2">
                  <p className="text-xs font-bold uppercase text-white">Evidence Photo</p>
                </div>
              </div>
            ) : (
              <div className="border-4 border-black bg-white flex flex-col items-center justify-center py-16 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <span className="material-symbols-outlined text-6xl text-stone-400">image_not_supported</span>
                <p className="text-stone-500 mt-2 font-bold">No photo uploaded</p>
              </div>
            )}

            <div className="border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
              <div className="bg-[#EC4899] border-b-4 border-black px-6 py-3">
                <h2 className="text-[20px] font-bold uppercase flex items-center gap-2 text-white">
                  <span className="material-symbols-outlined">info</span>
                  Report Details
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-[12px] font-bold uppercase text-stone-500">Issue Type</p>
                    <p className="font-bold">{report.type}</p>
                  </div>
                  <div>
                    <p className="text-[12px] font-bold uppercase text-stone-500">Severity</p>
                    <p className="font-bold uppercase">{report.severity}</p>
                  </div>
                  <div>
                    <p className="text-[12px] font-bold uppercase text-stone-500">Status</p>
                    <p className={`inline-block px-2 py-1 text-[12px] font-bold uppercase ${statusColors[report.status as keyof typeof statusColors]}`}>
                      {statusLabels[report.status as keyof typeof statusLabels]}
                    </p>
                  </div>
                  <div>
                    <p className="text-[12px] font-bold uppercase text-stone-500">Report ID</p>
                    <p className="font-mono font-bold">#{report.report_id}</p>
                  </div>
                </div>
                <div>
                  <p className="text-[12px] font-bold uppercase text-stone-500">Location</p>
                  <p className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px]">location_on</span>
                    {report.location}
                  </p>
                </div>
                <div>
                  <p className="text-[12px] font-bold uppercase text-stone-500">Description</p>
                  <p>{report.description || "No description provided."}</p>
                </div>
              </div>
            </div>

            <div className="border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
              <div className="bg-black border-b-4 border-black px-6 py-3">
                <h2 className="text-[20px] font-bold uppercase text-white flex items-center gap-2">
                  <span className="material-symbols-outlined">person</span>
                  Citizen Information
                </h2>
              </div>
              <div className="p-6 space-y-3">
                <div>
                  <p className="text-[12px] font-bold uppercase text-stone-500">Citizen</p>
                  <p>{citizenLabel}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <div className="border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden sticky top-28">
              <div className="bg-[#EC4899] border-b-4 border-black px-6 py-3">
                <h2 className="text-[20px] font-bold uppercase text-white flex items-center gap-2">
                  <span className="material-symbols-outlined">build</span>
                  Admin Actions
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-[14px] font-bold uppercase block mb-2">Update Status</label>
                  <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="w-full border-4 border-black bg-[#FFFDD0] p-3 font-medium">
                    {statusOptions.map((opt) => (<option key={opt} value={opt}>{statusLabels[opt as keyof typeof statusLabels]}</option>))}
                  </select>
                </div>
                <div>
                  <label className="text-[14px] font-bold uppercase block mb-2">Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add notes..."
                    className="w-full border-4 border-black bg-[#FFFDD0] p-3 font-medium"
                    rows={3}
                  />
                </div>
                <button
                  onClick={handleUpdateStatus}
                  disabled={saving}
                  className="w-full border-4 border-black bg-[#EC4899] p-3 font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50"
                >
                  {saving ? "UPDATING..." : "Update Status"}
                </button>
                <hr className="border-t-4 border-black" />
                <div>
                  <label className="text-[14px] font-bold uppercase block mb-2">Assign to Officer</label>
                  <input type="text" placeholder="Officer name..." value={assignee} onChange={(e) => setAssignee(e.target.value)} className="w-full border-4 border-black bg-[#FFFDD0] p-3 font-medium" />
                </div>
              </div>
            </div>

            <div className="border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
              <div className="bg-black border-b-4 border-black px-6 py-3">
                <h2 className="text-[20px] font-bold uppercase text-white flex items-center gap-2">
                  <span className="material-symbols-outlined">timeline</span>
                  Progress
                </h2>
              </div>
              <div className="p-6">
                {timeline.length === 0 ? (
                  <div className="text-center py-6">
                    <span className="material-symbols-outlined text-4xl text-stone-400">pending</span>
                    <p className="text-stone-500 mt-2 font-medium">No timeline updates yet</p>
                    <p className="text-stone-400 text-sm mt-1">Check back later for progress</p>
                  </div>
                ) : (
                  timeline.map((item, idx) => (
                    <div key={idx} className="flex gap-3 mb-3">
                      <div className={`w-4 h-4 border-2 border-black mt-1 ${idx === timeline.length - 1 ? "bg-[#EC4899]" : "bg-white"}`} />
                      <div>
                        <p className={`text-[14px] font-bold ${idx === timeline.length - 1 ? "text-black" : "text-stone-400"}`}>
                          {item.status === "pending"
                            ? "Report Submitted"
                            : item.status === "in_progress"
                              ? "In Progress"
                              : item.status === "resolved"
                                ? "Resolved"
                                : item.status}
                        </p>
                        <p className="text-[12px] text-stone-500">
                          {new Date(item.created_at).toLocaleString("id-ID")}
                        </p>
                        {item.notes && <p className="text-[12px] text-stone-400 italic">"{item.notes}"</p>}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}