"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

export default function AdminSettingsPage() {
  const router = useRouter();
  const { logout } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("id");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setName(currentUser.name || "");
      setEmail(currentUser.email || "");
      setPhone(currentUser.phone || "");
    }
  }, []);

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${apiBase}/user/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ name, email, phone }),
      });
      const result = await response.json();
      if (result.success) {
        toast.success("Profile updated successfully");
        const currentUser = getCurrentUser();
        const updatedUser = { ...(currentUser || {}), name, email, phone };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } else {
        toast.error(result.error || "Failed to update profile");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${apiBase}/user/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
      });
      const result = await response.json();
      if (result.success) {
        toast.success("Password updated successfully");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(result.error || "Failed to update password");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone!")) return;
    setLoading(true);
    try {
      const response = await fetch(`${apiBase}/user`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const result = await response.json();
      if (result.success) {
        toast.success("Account deleted successfully");
        logout();
        router.push("/");
      } else {
        toast.error(result.error || "Failed to delete account");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      const response = await fetch(`${apiBase}/user/export`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `admin_data_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success("Data exported successfully");
      } else {
        toast.error(data.error || "Failed to export data");
      }
    } catch (error) {
      toast.error("Something went wrong");
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
        
        {/* Page Header */}
        <div className="mb-12 relative inline-block">
          <h1 className="text-[48px] leading-[1.1] tracking-[-0.02em] font-extrabold uppercase inline-block bg-[#FFFDD0] px-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            Settings
          </h1>
          <div className="h-[4px] w-32 bg-[#EC4899] mt-2" />
          <p className="text-[18px] leading-[1.5] font-medium mt-6 max-w-2xl bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            Manage your account preferences and application settings.
          </p>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Profile Section */}
          <div className="border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
            <div className="bg-[#EC4899] border-b-4 border-black px-6 py-4">
              <h2 className="text-[20px] font-bold uppercase text-white flex items-center gap-2">
                <span className="material-symbols-outlined">person</span>
                Profile Information
              </h2>
            </div>
            <form onSubmit={handleUpdateProfile} className="p-6 space-y-5">
              <div>
                <label className="text-[14px] font-bold uppercase block mb-2">Full Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border-4 border-black bg-[#FFFDD0] p-3 text-[16px] font-medium focus:outline-none focus:bg-[#EC4899]/20"
                  required
                />
              </div>
              <div>
                <label className="text-[14px] font-bold uppercase block mb-2">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-4 border-black bg-[#FFFDD0] p-3 text-[16px] font-medium focus:outline-none focus:bg-[#EC4899]/20"
                  required
                />
              </div>
              <div>
                <label className="text-[14px] font-bold uppercase block mb-2">Phone Number</label>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border-4 border-black bg-[#FFFDD0] p-3 text-[16px] font-medium focus:outline-none focus:bg-[#EC4899]/20"
                />
              </div>
              <div>
                <label className="text-[14px] font-bold uppercase block mb-2">Role</label>
                <input 
                  type="text" 
                  defaultValue="Admin"
                  disabled
                  className="w-full border-4 border-black bg-stone-100 p-3 text-[16px] font-medium text-stone-500 cursor-not-allowed"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="border-4 border-black bg-[#EC4899] px-6 py-3 text-[14px] font-bold uppercase text-white hover:translate-x-1 hover:translate-y-1 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
              >
                {loading ? "SAVING..." : "Save Changes"}
              </button>
            </form>
          </div>

          {/* Preferences Section */}
          <div className="border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
            <div className="bg-[#EC4899] border-b-4 border-black px-6 py-4">
              <h2 className="text-[20px] font-bold uppercase text-white flex items-center gap-2">
                <span className="material-symbols-outlined">tune</span>
                Preferences
              </h2>
            </div>
            <div className="p-6 space-y-5">
              {/* Notification Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[14px] font-bold uppercase">Push Notifications</p>
                  <p className="text-[12px] text-stone-500">Receive updates about new reports</p>
                </div>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`w-14 h-8 border-4 border-black rounded-none transition-all ${
                    notifications ? "bg-[#EC4899] justify-end" : "bg-white justify-start"
                  } flex items-center px-1`}
                >
                  <div className="w-5 h-5 bg-black"></div>
                </button>
              </div>

              {/* Dark Mode Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[14px] font-bold uppercase">Dark Mode</p>
                  <p className="text-[12px] text-stone-500">Switch to dark theme</p>
                </div>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`w-14 h-8 border-4 border-black rounded-none transition-all ${
                    darkMode ? "bg-[#EC4899] justify-end" : "bg-white justify-start"
                  } flex items-center px-1`}
                >
                  <div className="w-5 h-5 bg-black"></div>
                </button>
              </div>

              {/* Language Select */}
              <div>
                <label className="text-[14px] font-bold uppercase block mb-2">Language</label>
                <select 
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full border-4 border-black bg-[#FFFDD0] p-3 text-[16px] font-medium cursor-pointer"
                >
                  <option value="id">Bahasa Indonesia</option>
                  <option value="en">English</option>
                </select>
              </div>

              {/* Items per page */}
              <div>
                <label className="text-[14px] font-bold uppercase block mb-2">Items per page</label>
                <select className="w-full border-4 border-black bg-[#FFFDD0] p-3 text-[16px] font-medium cursor-pointer">
                  <option value="10">10 items</option>
                  <option value="25">25 items</option>
                  <option value="50">50 items</option>
                  <option value="100">100 items</option>
                </select>
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
            <div className="bg-[#EC4899] border-b-4 border-black px-6 py-4">
              <h2 className="text-[20px] font-bold uppercase text-white flex items-center gap-2">
                <span className="material-symbols-outlined">lock</span>
                Security
              </h2>
            </div>
            <form onSubmit={handleUpdatePassword} className="p-6 space-y-5">
              <div>
                <label className="text-[14px] font-bold uppercase block mb-2">Current Password</label>
                <input 
                  type="password" 
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border-4 border-black bg-[#FFFDD0] p-3 text-[16px] font-medium"
                  required
                />
              </div>
              <div>
                <label className="text-[14px] font-bold uppercase block mb-2">New Password</label>
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border-4 border-black bg-[#FFFDD0] p-3 text-[16px] font-medium"
                  required
                />
              </div>
              <div>
                <label className="text-[14px] font-bold uppercase block mb-2">Confirm New Password</label>
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border-4 border-black bg-[#FFFDD0] p-3 text-[16px] font-medium"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="border-4 border-black bg-[#EC4899] px-6 py-3 text-[14px] font-bold uppercase text-white hover:translate-x-1 hover:translate-y-1 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
              >
                {loading ? "UPDATING..." : "Update Password"}
              </button>
            </form>
          </div>

          {/* Danger Zone */}
          <div className="border-4 border-red-500 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
            <div className="bg-red-500 border-b-4 border-black px-6 py-4">
              <h2 className="text-[20px] font-bold uppercase text-white flex items-center gap-2">
                <span className="material-symbols-outlined">warning</span>
                Danger Zone
              </h2>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[14px] font-bold uppercase">Delete Account</p>
                  <p className="text-[12px] text-stone-500">Permanently delete your account and all data</p>
                </div>
                <button
                  onClick={handleDeleteAccount}
                  disabled={loading}
                  className="border-4 border-red-500 bg-white px-6 py-3 text-[14px] font-bold uppercase text-red-500 hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[14px] font-bold uppercase">Export All Data</p>
                  <p className="text-[12px] text-stone-500">Download all reports and system data</p>
                </div>
                <button
                  onClick={handleExportData}
                  className="border-4 border-black bg-[#FFFDD0] px-6 py-3 text-[14px] font-bold uppercase hover:translate-x-1 hover:translate-y-1 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                  Export JSON
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="mt-12 text-center">
          <p className="text-[14px] text-black/50 italic border-t-4 border-black/20 pt-6">
            Admin Portal v1.0.0 | InfraAlert
          </p>
        </div>
      </main>
    </>
  );
}