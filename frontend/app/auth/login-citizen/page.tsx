// app/auth/login-citizen/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

export default function LoginCitizenPage() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      toast.success("Login successful!");
      router.push("/citizen/dashboard");
    } else {
      toast.error("Invalid email or password");
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-x-hidden bg-[#FFFDD0] px-4 py-12">
      <div className="pointer-events-none absolute left-10 top-10 hidden h-16 w-16 -rotate-6 border-4 border-black bg-[#FFFDD0] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:block animate-pulse" />
      <div className="pointer-events-none absolute bottom-20 right-10 hidden h-8 w-24 rotate-6 border-4 border-black bg-[#22C55E] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:block animate-pulse" />
      <div className="pointer-events-none absolute right-1/4 top-1/4 hidden h-4 w-4 rounded-full bg-black lg:block" />
      <div className="pointer-events-none absolute bottom-1/4 left-1/4 hidden h-8 w-8 rotate-45 border-4 border-black lg:block" />

      <div className="relative z-10 w-full max-w-md -rotate-1 border-4 border-black bg-[#FFFDD0] p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-transform duration-300 hover:rotate-0 md:-rotate-2 md:p-10">
        
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 border-4 border-black bg-white px-3 py-2 text-xs font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#22C55E]"
          >
            <ArrowLeft size={14} strokeWidth={2.5} />
            Kembali
          </Link>
          <div className="text-right">
            <p className="text-[10px] font-black uppercase tracking-wider text-black/50">Akses Warga</p>
            <p className="text-xs font-black uppercase tracking-tight">Login Citizen</p>
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-black italic uppercase tracking-tighter md:text-5xl">Lapor Kerusakan.</h1>
          <h2 className="mt-2 inline-block -rotate-1 border-4 border-black bg-[#22C55E] px-2 text-2xl font-black uppercase md:text-3xl">Ubah Kotamu.</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative mt-10">
            <div className="absolute -left-3 -top-3 z-20 border-4 border-black bg-[#FFFDD0] px-2 py-1 text-xs font-bold uppercase">Identitas</div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-none border-4 border-black bg-[#FFFDD0] px-4 py-4 text-base font-medium outline-none"
              required
            />
          </div>

          <div className="relative mt-10">
            <div className="absolute -left-3 -top-3 z-20 border-4 border-black bg-[#FFFDD0] px-2 py-1 text-xs font-bold uppercase">Sandi</div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          <div className="flex justify-end">
            <Link href="#" className="border-b-4 border-black px-1 text-xs font-bold uppercase hover:bg-[#22C55E]">Lupa Password?</Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="h-auto w-full rounded-none border-4 border-black bg-[#22C55E] py-3 text-2xl font-black uppercase text-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
          >
            {isLoading ? "LOADING..." : "LOGIN"}
          </button>
        </form>

        <div className="mt-8 border-t-4 border-black pt-6 text-center">
          <p className="mb-3 text-base font-medium">Belum punya akun?</p>
          <Link href="/auth/register" className="inline-block border-4 border-black bg-white px-4 py-2 text-lg font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#22C55E]">
            Daftar
          </Link>
        </div>
      </div>
    </main>
  );
}