import Link from "next/link";
import Topbar from "@/components/topbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  AlertTriangle,
  Bell,
  Clock,
  CheckCircle,
  MapPin,
  Megaphone,
} from "lucide-react";

const highlights = [
  {
    title: "See it.",
    description: "Find something broken in the wild. Snap a quick pic.",
    icon: AlertTriangle,
    cardClass:
      "bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-1",
    iconWrapClass: "bg-[#22C55E]",
    iconClass: "text-black",
    textClass: "text-[#646464]",
  },
  {
    title: "Report it.",
    description: "Drop a pin, add the chaotic details, and blast it to the city.",
    icon: Megaphone,
    cardClass:
      "bg-[#22C55E] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-2 translate-y-4",
    iconWrapClass: "bg-black",
    iconClass: "text-white",
    textClass: "text-black font-semibold",
  },
  {
    title: "Fix it.",
    description: "Watch the progress bar fill up until the chaos is contained.",
    icon: CheckCircle,
    cardClass:
      "bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-2",
    iconWrapClass: "bg-[#FFFBF0]",
    iconClass: "text-black",
    textClass: "text-[#646464]",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FFFBF0] text-black">
      <Topbar />

      <main className="relative mx-auto w-full max-w-[1440px] px-4 py-16 md:px-8 md:py-24">
        <div
          className="pointer-events-none absolute left-10 top-10 -z-10 h-16 w-16 rotate-12 border-4 border-black bg-[#22C55E] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute right-20 top-40 -z-10 h-24 w-24 rotate-45 rounded-full border-4 border-dashed border-black"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute bottom-20 left-1/4 -z-10 h-8 w-32 -rotate-[15deg] bg-black"
          aria-hidden="true"
        />

        <section
          id="hero"
          className="mb-32 flex flex-col items-center justify-between gap-12 md:flex-row"
        >
          <div className="relative z-10 flex w-full flex-col items-start gap-8 md:w-1/2">
            <div className="relative">
              <div className="absolute -left-4 -top-4 h-12 w-12 rounded-full bg-black" />
              <h1 className="text-[clamp(3rem,8vw,6rem)] font-black uppercase leading-none tracking-tighter">
                LAPOR
                <br />
                INFRA
                <br />
                RUSAK
              </h1>
            </div>
            <p className="max-w-md border-l-4 border-black bg-white/50 py-2 pl-4 text-lg font-medium">
              Jalan berlubang, lampu mati, atau saluran tersumbat? Laporkan lokasi
              dan foto, lalu pantau progres perbaikannya dengan jelas.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Button
                asChild
                variant="outline"
                className="h-auto rounded-none border-4 border-black bg-[#22C55E] px-8 py-4 text-lg font-bold uppercase tracking-wide text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
              >
                <Link href="/auth/login-citizen">Lapor Sekarang</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-auto rounded-none border-4 border-black bg-white px-6 py-4 text-lg font-bold uppercase tracking-wide text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
              >
                <Link href="/auth/login-admin">Masuk Admin</Link>
              </Button>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 border-2 border-black bg-white px-3 py-2 text-xs font-bold uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <MapPin size={14} strokeWidth={2.5} />
                Geo-tag otomatis
              </div>
              <div className="flex items-center gap-2 border-2 border-black bg-white px-3 py-2 text-xs font-bold uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <Clock size={14} strokeWidth={2.5} />
                Laporan 24/7
              </div>
              <div className="flex items-center gap-2 border-2 border-black bg-white px-3 py-2 text-xs font-bold uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <Bell size={14} strokeWidth={2.5} />
                Notifikasi progres
              </div>
            </div>
          </div>
          <div className="relative z-10 flex w-full justify-center md:w-1/2 md:justify-end">
            <div className="relative w-full max-w-lg rotate-2 transition-transform duration-300 hover:rotate-0">
              <div className="aspect-square w-full">
                <img
                  src="/collage-hero.svg"
                  alt="InfraAlert collage with alert and report tiles"
                  className="h-full w-full border-4 border-black object-cover shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                  loading="lazy"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 border-2 border-white bg-black px-4 py-2 text-xs font-bold uppercase text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                #PotholePatrol
              </div>
            </div>
          </div>
        </section>

        <section className="mb-32 grid grid-cols-1 gap-8 md:grid-cols-3">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title} className={`${item.cardClass} rounded-none`}>
                <CardContent className="flex flex-col gap-4 p-6">
                  <div
                    className={`flex h-12 w-12 items-center justify-center border-2 border-black ${item.iconWrapClass}`}
                  >
                    <Icon size={20} strokeWidth={2.5} className={item.iconClass} />
                  </div>
                  <CardTitle className="text-2xl font-bold">
                    {item.title}
                  </CardTitle>
                  <p className={`text-base ${item.textClass}`}>{item.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </section>
      </main>

      <footer className="flex w-full flex-col items-center justify-between gap-6 border-t-4 border-black bg-black px-8 py-12 md:flex-row">
        <div className="text-xl font-black italic uppercase text-[#22C55E]">
          InfraAlert
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          <Link
            href="/privacy"
            className="text-sm font-bold text-white transition-transform hover:skew-x-2 hover:text-[#22C55E]"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="text-sm font-bold text-white transition-transform hover:skew-x-2 hover:text-[#22C55E]"
          >
            Terms of Service
          </Link>
          <Link
            href="/report"
            className="text-sm font-bold text-white transition-transform hover:skew-x-2 hover:text-[#22C55E]"
          >
            Report Issue
          </Link>
          <Link
            href="/community"
            className="text-sm font-bold text-white transition-transform hover:skew-x-2 hover:text-[#22C55E]"
          >
            Community Guidelines
          </Link>
        </div>
        <div className="text-xs font-bold text-[#22C55E]">
          (c) 2024 InfraAlert. Keep the chaos constructive.
        </div>
      </footer>
    </div>
  );
}
