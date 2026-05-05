"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { getCurrentUser } from "@/lib/utils";
import toast from "react-hot-toast";

export default function LoginAdminPage() {
  const router = useRouter();
  const { login, logout, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const success = await login(email, password);
    if (!success) {
      toast.error("Invalid email or password");
      return;
    }

    const user = getCurrentUser();
    if (!user || user.role !== "admin") {
      toast.error("Akun ini bukan admin");
      logout();
      return;
    }

    toast.success("Login successful!");
    router.push("/admin/dashboard");
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-x-hidden bg-[#F5F5DC] px-4 py-12 text-black">
      <div className="pointer-events-none absolute left-10 top-10 hidden h-16 w-16 rotate-12 border-4 border-black bg-[#F5F5DC] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:block" />
      <div className="pointer-events-none absolute bottom-20 right-10 hidden h-8 w-24 -rotate-6 border-4 border-black bg-[#EC4899] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:block" />
      <div className="pointer-events-none absolute right-1/4 top-1/4 hidden h-4 w-4 rounded-full bg-black lg:block" />
      <div className="pointer-events-none absolute bottom-1/4 left-1/4 hidden h-8 w-8 rotate-45 border-4 border-black lg:block" />

      <div className="relative z-10 w-full max-w-md -rotate-1 border-4 border-black bg-[#F5F5DC] p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-transform duration-300 hover:rotate-0 md:-rotate-2 md:p-10">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 border-4 border-black bg-white px-3 py-2 text-xs font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-[#EC4899]"
        >
          <ArrowLeft size={14} strokeWidth={2.5} />
          Kembali 
        </Link>
        <div className="mb-8">
          <h1 className="text-4xl font-black italic uppercase tracking-tighter md:text-5xl">
            Kendalikan Laporan.
          </h1>
          <h2 className="mt-2 inline-block -rotate-1 border-4 border-black bg-[#EC4899] px-2 text-2xl font-black uppercase md:text-3xl">
            Gerak Cepat.
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative mt-8">
            <div className="absolute -left-3 -top-3 z-10 border-4 border-black bg-[#F5F5DC] px-2 py-1 text-xs font-bold uppercase">
              Identitas
            </div>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Email admin"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-auto rounded-none border-4 border-black bg-[#F5F5DC] px-4 pb-3 pt-6 text-base font-medium focus-visible:border-black focus-visible:ring-0"
            />
          </div>

          <div className="relative mt-8">
            <div className="absolute -left-3 -top-3 z-10 border-4 border-black bg-[#F5F5DC] px-2 py-1 text-xs font-bold uppercase">
              Sandi
            </div>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-none border-4 border-black bg-[#F5F5DC] px-4 pb-3 pt-6 pr-12 text-base font-medium outline-none transition-colors focus:border-black"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-pressed={showPassword}
                aria-controls="password"
                className="absolute right-3 top-1/2 z-10 -translate-y-1/2 border-2 border-transparent p-1 text-black transition-all hover:border-black hover:bg-white"
                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              >
                {showPassword ? (
                  <EyeOff size={18} strokeWidth={2.5} />
                ) : (
                  <Eye size={18} strokeWidth={2.5} />
                )}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <Link
              href="#"
              className="border-b-4 border-black px-1 text-xs font-bold uppercase transition-colors hover:bg-[#EC4899]"
            >
              Lupa Password?
            </Link>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="h-auto w-full rounded-none border-4 border-black bg-[#EC4899] py-3 text-2xl font-black uppercase text-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
          >
            {isLoading ? "LOADING..." : "Login"}
          </Button>
        </form>

        <div className="mt-8 border-t-4 border-black pt-6 text-center">
          <p className="mb-3 text-base font-medium">Belum punya akun admin?</p>
          <Link
            href="#"
            className="inline-block border-4 border-black bg-white px-4 py-2 text-lg font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-[#EC4899]"
          >
            Hubungi Supervisor
          </Link>
        </div>

        <div className="mt-8 text-center opacity-70">
          <p className="text-xs italic">&quot;Nothing&apos;s broken here... yet&quot;</p>
        </div>
      </div>
    </main>
  );
}
