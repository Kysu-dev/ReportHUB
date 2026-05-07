"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/sidebar";
import CitizenPageTitle from "@/components/citizen-page-title";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

const citizenRoutes = [
  { label: "Dashboard", href: "/citizen/dashboard", icon: "dashboard" },
  { label: "Reports", href: "/citizen/reports", icon: "analytics" },
  { label: "Submit Report", href: "/citizen/submit", icon: "add_circle" },
  { label: "Settings", href: "/citizen/settings", icon: "settings" },
];

const CLOUDINARY_CLOUD_NAME = "dizxhou7e";
const CLOUDINARY_UPLOAD_PRESET = "infraalert-preset";

export default function SubmitReportPage() {
  const router = useRouter();
  const { token } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("");
  const [severity, setSeverity] = useState("medium");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi sebelum submit
    if (!type) {
      toast.error("Please select an issue type");
      return;
    }
    if (!location.trim()) {
      toast.error("Please enter a location");
      return;
    }

    setLoading(true);

    let imageUrl = "";

    // STEP 1: Upload gambar ke Cloudinary
    if (imageFile) {
      const cloudinaryFormData = new FormData();
      cloudinaryFormData.append("file", imageFile);
      cloudinaryFormData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      try {
        const cloudinaryRes = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: cloudinaryFormData,
          }
        );

        const cloudinaryData = await cloudinaryRes.json();
        if (!cloudinaryRes.ok) {
          throw new Error(cloudinaryData.error?.message || "Cloudinary upload failed");
        }
        imageUrl = cloudinaryData.secure_url;
        toast.success("Foto berhasil diupload!");
      } catch (err: any) {
        toast.error(err.message || "Gagal upload foto");
        setLoading(false);
        return;
      }
    }

    // STEP 2: Submit report ke backend
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "/api";
      
      const payload = {
        type,
        severity,
        location,
        description,
        image_url: imageUrl,
      };

      console.log("Submitting report:", payload);

      const response = await fetch(`${apiBase}/reports`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log("Response status:", response.status, "Response:", result);

      if (!response.ok) {
        throw new Error(result.error || result.message || `Error ${response.status}`);
      }

      if (result.success) {
        toast.success("Report submitted successfully!");
        router.push("/citizen/reports");
      } else {
        toast.error(result.error || result.message || "Failed to submit report");
      }
    } catch (error: unknown) {
      console.error("Submit error:", error);
      const errorMsg = error instanceof Error ? error.message : "Something went wrong";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FFFDD0] min-h-screen flex flex-row">
      <Sidebar routes={citizenRoutes} userRole="citizen" />
      <div className="flex-1 ml-0 md:ml-72 p-6 md:p-12 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:24px_24px]">
        <CitizenPageTitle title="Submit Report" className="mb-6" />
        
        <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
          <div>
            <label className="text-[14px] font-bold uppercase block mb-2">Issue Type *</label>
            <select 
              value={type} 
              onChange={(e) => setType(e.target.value)} 
              className="w-full border-4 border-black bg-[#FFFDD0] p-3" 
              required
            >
              <option value="">Select...</option>
              <option value="Pothole">Pothole</option>
              <option value="Broken Light">Broken Light</option>
              <option value="Road Damage">Road Damage</option>
              <option value="Water Leak">Water Leak</option>
              <option value="Graffiti">Graffiti</option>
            </select>
          </div>

          <div>
            <label className="text-[14px] font-bold uppercase block mb-2">Severity</label>
            <div className="flex gap-4 flex-wrap">
              {["low", "medium", "high", "critical"].map((s) => (
                <label key={s} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="severity"
                    value={s}
                    checked={severity === s}
                    onChange={(e) => setSeverity(e.target.value)}
                    className="w-5 h-5 border-4 border-black accent-black"
                  />
                  <span className="uppercase text-[12px] font-bold">{s}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[14px] font-bold uppercase block mb-2">Location *</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full border-4 border-black bg-[#FFFDD0] p-3"
              placeholder="Street address or landmark"
              required
            />
          </div>

          <div>
            <label className="text-[14px] font-bold uppercase block mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border-4 border-black bg-[#FFFDD0] p-3"
              rows={4}
              placeholder="Describe the issue..."
            />
          </div>

          {/* Upload Image */}
          <div>
            <label className="text-[14px] font-bold uppercase block mb-2">Photo Evidence</label>
            <div className="border-4 border-dashed border-black p-6 text-center cursor-pointer hover:bg-[#22C55E]/20 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer block">
                <span className="material-symbols-outlined text-5xl">add_a_photo</span>
                <p className="mt-2">Click to upload image</p>
                <p className="text-[12px] text-stone-500">Max 5MB, JPG/PNG</p>
              </label>
            </div>
            {imagePreview && (
              <div className="mt-4">
                <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover border-4 border-black" />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full border-4 border-black bg-[#22C55E] p-4 text-xl font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
          >
            {loading ? "SUBMITTING..." : "SUBMIT REPORT"}
          </button>
        </form>
      </div>
    </div>
  );
}