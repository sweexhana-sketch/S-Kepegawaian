import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";
import AppLayout from "@/utils/AppLayout";
import { Calendar, AlertTriangle, CheckCircle2, Clock, TrendingUp, ChevronRight, Bell } from "lucide-react";

const STATUS_CONFIG = {
  pending: { label: "Menunggu", className: "bg-[#FEF3C7] text-[#B45309]" },
  proses: { label: "Diproses", className: "bg-[#EFF6FF] text-[#2563EB]" },
  selesai: { label: "Selesai", className: "bg-[#ECFDF5] text-[#059669]" },
};

function formatRupiah(num) {
  if (!num) return "-";
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(num);
}

function getDaysUntil(dateStr) {
  if (!dateStr) return null;
  const diff = new Date(dateStr) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function KGBPage() {
  const { data: user, loading: userLoading } = useUser();
  const [pegawai, setPegawai] = useState(null);
  const [kgbList, setKgbList] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userLoading && !user) { window.location.href = "/account/signin"; return; }
    if (user) fetchProfile();
  }, [user, userLoading]);

  useEffect(() => { if (pegawai) fetchKGB(); }, [pegawai]);

  const fetchProfile = async () => {
    const res = await fetch("/api/pegawai/profile");
    if (res.status === 404) { window.location.href = "/onboarding"; return; }
    if (res.ok) { const d = await res.json(); setPegawai(d.pegawai); }
  };

  const fetchKGB = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/kgb/list");
      if (res.ok) { const d = await res.json(); setKgbList(d.kgb || []); setUpcoming(d.upcoming || []); }
    } finally { setLoading(false); }
  };

  if (userLoading || !pegawai) return <div className="flex min-h-screen items-center justify-center bg-[#F9FAFB]"><div className="text-sm text-[#6B7280]">Memuat...</div></div>;

  return (
    <AppLayout pegawai={pegawai} activeHref="/kgb">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-[#111827] tracking-tight mb-1">Kenaikan Gaji Berkala (KGB)</h2>
          <p className="text-sm text-[#6B7280]">Monitoring dan early warning KGB pegawai</p>
        </div>
      </div>

      {/* Early Warning Banner */}
      {upcoming.length > 0 && (
        <div className="mb-6 p-4 bg-[#FFFBEB] border border-[#FCD34D] rounded-xl">
          <div className="flex items-start gap-3">
            <Bell size={20} className="text-[#B45309] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-[#B45309] mb-1">⚠️ Early Warning KGB</p>
              <p className="text-sm text-[#92400E]">{upcoming.length} pegawai memiliki KGB yang jatuh tempo dalam 3 bulan ke depan atau sudah lewat jatuh tempo.</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {upcoming.slice(0, 5).map(k => {
                  const days = getDaysUntil(k.tmt_kgb_baru);
                  return (
                    <span key={k.id} className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#FEF3C7] text-[#92400E] text-xs rounded-full font-medium">
                      {k.nama_lengkap} — {days !== null ? (days < 0 ? `${Math.abs(days)} hari lalu` : `${days} hari lagi`) : "-"}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* KGB Table */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
        {loading ? (
          <div className="px-4 py-12 text-center text-sm text-[#6B7280]">Memuat data KGB...</div>
        ) : kgbList.length === 0 ? (
          <div className="px-4 py-16 text-center">
            <div className="w-16 h-16 bg-[#F3F4F6] rounded-full flex items-center justify-center mx-auto mb-4"><Calendar size={32} className="text-[#9CA3AF]" /></div>
            <p className="text-sm font-medium text-[#111827]">Belum ada data KGB</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Pegawai</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">TMT KGB Baru</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Gaji Lama</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Gaji Baru</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Masa Kerja (Gol)</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Alert</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {kgbList.map(k => {
                  const conf = STATUS_CONFIG[k.status] || STATUS_CONFIG.pending;
                  const days = getDaysUntil(k.tmt_kgb_baru);
                  const isWarning = k.is_upcoming || k.is_overdue;
                  return (
                    <tr key={k.id} className={`hover:bg-[#F9FAFB] transition-colors ${isWarning ? "bg-[#FFFBEB]/50" : ""}`}>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-[#111827]">{k.nama_lengkap || pegawai.nama_lengkap}</p>
                        <p className="text-xs text-[#6B7280] font-mono">{k.nip || pegawai.nip}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-[#111827]">
                        {k.tmt_kgb_baru ? new Date(k.tmt_kgb_baru).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-[#6B7280]">{formatRupiah(k.gaji_lama)}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-[#059669]">{formatRupiah(k.gaji_baru)}</td>
                      <td className="px-4 py-3 text-sm text-[#6B7280]">{k.masa_kerja_golongan ? `${k.masa_kerja_golongan} tahun` : "-"}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${conf.className}`}>{conf.label}</span>
                      </td>
                      <td className="px-4 py-3">
                        {k.is_overdue ? (
                          <span className="inline-flex items-center gap-1 text-xs text-[#DC2626] font-medium"><AlertTriangle size={12} /> Terlambat</span>
                        ) : k.is_upcoming ? (
                          <span className="inline-flex items-center gap-1 text-xs text-[#B45309] font-medium"><Bell size={12} /> {days} hari lagi</span>
                        ) : (
                          <span className="text-xs text-[#9CA3AF]">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
