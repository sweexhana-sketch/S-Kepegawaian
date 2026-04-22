import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";
import AppLayout from "@/utils/AppLayout";
import { Award, Plus, ChevronRight, CheckCircle2, Clock, ArrowRight } from "lucide-react";

const STATUS_FLOW = [
  { key: "usulan", label: "Usulan Diajukan", desc: "Berkas usulan diterima" },
  { key: "di_bkd", label: "Di BKD", desc: "Sedang diproses BKD" },
  { key: "di_bkn", label: "Di BKN", desc: "Sedang diproses BKN" },
  { key: "sk_terbit", label: "SK Terbit", desc: "SK kenaikan pangkat diterbitkan" },
  { key: "selesai", label: "Selesai", desc: "Proses selesai" },
];

const STATUS_IDX = { usulan: 0, di_bkd: 1, di_bkn: 2, sk_terbit: 3, selesai: 4 };

export default function KenaikanPangkatPage() {
  const { data: user, loading: userLoading } = useUser();
  const [pegawai, setPegawai] = useState(null);
  const [kpList, setKpList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    if (!userLoading && !user) { window.location.href = "/account/signin"; return; }
    if (user) fetchProfile();
  }, [user, userLoading]);

  useEffect(() => { if (pegawai) fetchKP(); }, [pegawai, filterStatus]);

  const fetchProfile = async () => {
    const res = await fetch("/api/pegawai/profile");
    if (res.status === 404) { window.location.href = "/onboarding"; return; }
    if (res.ok) { const d = await res.json(); setPegawai(d.pegawai); }
  };

  const fetchKP = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterStatus) params.append("status", filterStatus);
      const res = await fetch(`/api/kenaikan-pangkat/list?${params}`);
      if (res.ok) { const d = await res.json(); setKpList(d.kenaikan_pangkat || []); }
    } finally { setLoading(false); }
  };

  if (userLoading || !pegawai) return <div className="flex min-h-screen items-center justify-center bg-[#F9FAFB]"><div className="text-sm text-[#6B7280]">Memuat...</div></div>;

  return (
    <AppLayout pegawai={pegawai} activeHref="/kenaikan-pangkat">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-[#111827] tracking-tight mb-1">Kenaikan Pangkat</h2>
          <p className="text-sm text-[#6B7280]">Tracking usulan kenaikan pangkat dan nominatif</p>
        </div>
        <a href="/kenaikan-pangkat/usulan" className="inline-flex items-center gap-2 px-4 py-2 bg-[#2563EB] text-white text-sm font-medium rounded-lg hover:bg-[#1D4ED8] transition-colors">
          <Plus size={16} /> Buat Usulan
        </a>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 mb-6 flex items-center gap-4">
        <label className="text-sm text-[#6B7280]">Status:</label>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]">
          <option value="">Semua</option>
          {STATUS_FLOW.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
        </select>
      </div>

      {/* KP List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-xl border border-[#E5E7EB] px-4 py-12 text-center text-sm text-[#6B7280]">Memuat data...</div>
        ) : kpList.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#E5E7EB] px-4 py-16 text-center">
            <div className="w-16 h-16 bg-[#F3F4F6] rounded-full flex items-center justify-center mx-auto mb-4"><Award size={32} className="text-[#9CA3AF]" /></div>
            <p className="text-sm font-medium text-[#111827] mb-1">Belum ada usulan kenaikan pangkat</p>
            <p className="text-xs text-[#6B7280] mb-4">Buat usulan baru untuk memulai proses kenaikan pangkat</p>
            <a href="/kenaikan-pangkat/usulan" className="inline-flex items-center gap-2 px-4 py-2 bg-[#2563EB] text-white text-sm rounded-lg hover:bg-[#1D4ED8]">
              <Plus size={16} /> Buat Usulan Baru
            </a>
          </div>
        ) : (
          kpList.map(kp => {
            const currentStep = STATUS_IDX[kp.status] ?? 0;
            return (
              <div key={kp.id} className="bg-white rounded-xl border border-[#E5E7EB] p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    {pegawai.role !== "pegawai" && (
                      <div className="mb-1">
                        <span className="text-sm font-semibold text-[#111827]">{kp.nama_lengkap}</span>
                        <span className="text-xs text-[#6B7280] font-mono ml-2">{kp.nip}</span>
                      </div>
                    )}
                    <p className="text-base font-semibold text-[#111827]">{kp.jenis_kenaikan}</p>
                    <p className="text-sm text-[#6B7280]">
                      {kp.pangkat_lama} ({kp.golongan_lama}) <ArrowRight size={14} className="inline" /> {kp.pangkat_baru || "?"} ({kp.golongan_baru || "?"})
                    </p>
                  </div>
                  <p className="text-xs text-[#6B7280]">
                    {kp.created_at ? new Date(kp.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : ""}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    {STATUS_FLOW.map((s, idx) => (
                      <div key={s.key} className="flex flex-col items-center gap-1 flex-1">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${idx < currentStep ? "bg-[#2563EB] border-[#2563EB] text-white" : idx === currentStep ? "bg-[#EFF6FF] border-[#2563EB] text-[#2563EB]" : "bg-white border-[#E5E7EB] text-[#9CA3AF]"}`}>
                          {idx < currentStep ? <CheckCircle2 size={14} /> : idx + 1}
                        </div>
                        <p className="text-[10px] text-center text-[#6B7280] hidden md:block leading-tight max-w-[60px]">{s.label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="absolute top-3.5 left-3.5 right-3.5 h-0.5 bg-[#E5E7EB] -z-10">
                    <div className="h-full bg-[#2563EB] transition-all" style={{ width: `${(currentStep / (STATUS_FLOW.length - 1)) * 100}%` }} />
                  </div>
                </div>

                {kp.catatan && <p className="text-xs text-[#6B7280] mt-3 p-2 bg-[#F9FAFB] rounded-lg">{kp.catatan}</p>}
              </div>
            );
          })
        )}
      </div>
    </AppLayout>
  );
}
