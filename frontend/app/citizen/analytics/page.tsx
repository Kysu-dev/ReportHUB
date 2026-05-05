export default function CitizenAnalyticsPage() {
  return (
    <div className="space-y-6 p-6 md:p-12 min-h-screen bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:24px_24px]">
      <header>
        <h1 className="text-2xl font-semibold">Analitik Laporan</h1>
        <p className="mt-2 text-sm text-slate-500">
          Ringkasan tren laporan dan status penyelesaian.
        </p>
      </header>
      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border p-4">
          <h2 className="text-lg font-medium">Laporan Bulanan</h2>
          <p className="mt-2 text-sm text-slate-600">
            Ringkasan volume laporan tiap bulan.
          </p>
        </div>
        <div className="rounded-lg border p-4">
          <h2 className="text-lg font-medium">Status Terbaru</h2>
          <p className="mt-2 text-sm text-slate-600">
            Distribusi status laporan Anda.
          </p>
        </div>
      </section>
    </div>
  );
}
