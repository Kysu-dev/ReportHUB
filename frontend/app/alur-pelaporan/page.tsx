import Link from "next/link";
import Topbar from "@/components/topbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  AlertTriangle,
  Camera,
  CheckCircle,
  FileText,
  MapPin,
  Wrench,
} from "lucide-react";

const steps = [
  {
    title: "Temukan",
    description:
      "Masyarakat melihat infrastruktur rusak seperti jalan, jembatan kecil, atau gapura.",
    icon: AlertTriangle,
    badge: "Langkah 01",
  },
  {
    title: "Laporkan",
    description:
      "Isi detail laporan: lokasi, kategori, tingkat urgensi, dan keterangan tambahan.",
    icon: FileText,
    badge: "Langkah 02",
  },
  {
    title: "Foto Bukti",
    description:
      "Unggah foto kondisi di lapangan agar petugas mudah memverifikasi.",
    icon: Camera,
    badge: "Langkah 03",
  },
  {
    title: "Validasi",
    description:
      "Petugas memeriksa laporan, memastikan data valid, lalu menetapkan status.",
    icon: CheckCircle,
    badge: "Langkah 04",
  },
  {
    title: "Dikerjakan",
    description:
      "Tim lapangan menangani perbaikan dan memperbarui progres hingga selesai.",
    icon: Wrench,
    badge: "Langkah 05",
  },
];

export default function AlurPelaporanPage() {
  return (
    <div className="min-h-screen bg-[#FFFBF0] text-black">
      <Topbar />
      <header className="border-b-4 border-black bg-[#FFFBF0] px-6 py-12 md:px-12">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
          <div className="inline-flex w-fit items-center gap-2 border-4 border-black bg-white px-4 py-2 text-xs font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <MapPin size={14} strokeWidth={2.5} />
            Alur Pelaporan Infrastruktur Rusak
          </div>
          <h1 className="text-4xl font-black uppercase leading-tight md:text-5xl">
            Dari Temuan Warga sampai Perbaikan
          </h1>
          <p className="max-w-2xl border-l-4 border-black bg-white/70 py-2 pl-4 text-lg font-medium">
            InfraAlert memastikan laporan warga ditangani dengan cepat dan transparan.
            Ikuti alur di bawah untuk memahami proses dari awal hingga selesai.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button
              asChild
              variant="outline"
              className="h-auto rounded-none border-4 border-black bg-[#22C55E] px-6 py-3 text-base font-bold uppercase tracking-wide text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
            >
              <Link href="/auth/login-citizen">Mulai Lapor</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-6 py-12 md:px-12">
        <div className="grid gap-8 md:grid-cols-2">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card
                key={step.title}
                className={`rounded-none border-4 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] ${
                  index % 2 === 0 ? "-rotate-1" : "rotate-1"
                }`}
              >
                <CardContent className="flex h-full flex-col gap-4 p-6">
                  <div className="flex items-center justify-between">
                    <span className="border-2 border-black bg-[#22C55E] px-2 py-1 text-[11px] font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      {step.badge}
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center border-2 border-black bg-white">
                      <Icon size={20} strokeWidth={2.5} />
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-black uppercase">
                    {step.title}
                  </CardTitle>
                  <p className="text-base font-medium text-[#4b4b4b]">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <section className="mt-16 border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-2xl font-black uppercase">Status Laporan</h2>
          <p className="mt-3 text-base font-medium text-[#4b4b4b]">
            Setelah validasi, laporan akan mengikuti status berikut: Pending,
            In Progress, Resolved, atau Rejected. Setiap perubahan status akan
            muncul di dashboard warga.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="border-2 border-black bg-[#FCA311] px-3 py-1 text-xs font-black uppercase">
              Pending
            </span>
            <span className="border-2 border-black bg-[#3B82F6] px-3 py-1 text-xs font-black uppercase text-white">
              In Progress
            </span>
            <span className="border-2 border-black bg-[#10B981] px-3 py-1 text-xs font-black uppercase text-white">
              Resolved
            </span>
            <span className="border-2 border-black bg-[#EF4444] px-3 py-1 text-xs font-black uppercase text-white">
              Rejected
            </span>
          </div>
        </section>
      </main>
    </div>
  );
}
