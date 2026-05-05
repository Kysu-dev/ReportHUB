"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { register } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const { login: authLogin } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Register dulu
      const result = await register(formData);
      
      if (result.success) {
        toast.success("Registration successful! Logging in...");
        
        // 2. Langsung login otomatis
        const loginResult = await authLogin(formData.email, formData.password);
        
        if (loginResult) {
          toast.success("Welcome to InfraAlert!");
          // 3. Redirect ke dashboard citizen
          router.push("/citizen/dashboard");
        } else {
          toast.error("Registration OK, but auto-login failed. Please login manually.");
          router.push("/auth/login-citizen");
        }
      } else {
        toast.error(result.error || "Registration failed");
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Registration failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-x-hidden bg-[#FFFDD0] px-4 py-12 text-black">
      <div className="pointer-events-none absolute left-10 top-10 hidden h-16 w-16 -rotate-6 border-4 border-black bg-[#FFFDD0] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:block animate-pulse" />
      <div className="pointer-events-none absolute bottom-20 right-10 hidden h-8 w-24 rotate-6 border-4 border-black bg-[#22C55E] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:block animate-pulse" />
      <div className="pointer-events-none absolute right-1/4 top-1/4 hidden h-4 w-4 rounded-full bg-black lg:block" />
      <div className="pointer-events-none absolute bottom-1/4 left-1/4 hidden h-8 w-8 rotate-45 border-4 border-black lg:block" />

      <div className="relative z-10 w-full max-w-md -rotate-1 border-4 border-black bg-[#FFFDD0] p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-transform duration-300 hover:rotate-0 md:-rotate-2 md:p-10">
        
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 border-4 border-black bg-white px-3 py-2 text-xs font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#22C55E]"
          >
            <ArrowLeft size={14} strokeWidth={2.5} />
            Kembali
          </Link>
          
          <div className="text-right">
            <p className="text-[10px] font-black uppercase tracking-wider text-black/50">
              Daftar Akun
            </p>
            <p className="text-xs font-black uppercase tracking-tight">
              Warga Baru
            </p>
          </div>
        </div>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-black italic uppercase tracking-tighter md:text-5xl">
            Bergabung.
          </h1>
          <h2 className="mt-2 inline-block -rotate-1 border-4 border-black bg-[#22C55E] px-2 text-2xl font-black uppercase md:text-3xl">
            Jadi Bagian.
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div className="relative mt-8">
            <div className="absolute -left-3 -top-3 z-20 border-4 border-black bg-[#FFFDD0] px-2 py-1 text-xs font-bold uppercase">
              Nama Lengkap
            </div>
            <input
              type="text"
              name="name"
              placeholder="Nama lengkap"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-none border-4 border-black bg-[#FFFDD0] px-4 py-4 text-base font-medium outline-none"
              required
            />
          </div>

          {/* Email */}
          <div className="relative mt-8">
            <div className="absolute -left-3 -top-3 z-20 border-4 border-black bg-[#FFFDD0] px-2 py-1 text-xs font-bold uppercase">
              Email
            </div>
            <input
              type="email"
              name="email"
              placeholder="Email aktif"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-none border-4 border-black bg-[#FFFDD0] px-4 py-4 text-base font-medium outline-none"
              required
            />
          </div>

          {/* Phone */}
          <div className="relative mt-8">
            <div className="absolute -left-3 -top-3 z-20 border-4 border-black bg-[#FFFDD0] px-2 py-1 text-xs font-bold uppercase">
              Nomor Telepon
            </div>
            <input
              type="tel"
              name="phone"
              placeholder="Nomor WhatsApp"
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded-none border-4 border-black bg-[#FFFDD0] px-4 py-4 text-base font-medium outline-none"
            />
          </div>

          {/* Password */}
          <div className="relative mt-8">
            <div className="absolute -left-3 -top-3 z-20 border-4 border-black bg-[#FFFDD0] px-2 py-1 text-xs font-bold uppercase">
              Password
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Minimal 6 karakter"
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded-none border-4 border-black bg-[#FFFDD0] px-4 py-4 pr-12 text-base font-medium outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 border-2 border-transparent p-1 hover:border-black hover:bg-white"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="h-auto w-full rounded-none border-4 border-black bg-[#22C55E] py-3 text-2xl font-black uppercase text-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none disabled:opacity-50 disabled:hover:translate-x-0 disabled:hover:translate-y-0"
          >
            {loading ? "PROSES..." : "DAFTAR"}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-sm">
            Sudah punya akun?{" "}
            <Link href="/auth/login-citizen" className="font-bold uppercase underline hover:text-[#22C55E]">
              Login di sini
            </Link>
          </p>
        </div>

        {/* Decorative Footer */}
        <div className="mt-8 text-center opacity-70">
          <p className="text-xs italic">&quot;Nothing&apos;s broken here... yet&quot;</p>
        </div>
      </div>
    </main>
  );
}