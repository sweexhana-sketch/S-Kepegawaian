import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";
import Sidebar from "@/components/Sidebar";
import { 
  Calendar, 
  Plus, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  AlertCircle,
  Filter,
  Search,
  ChevronRight,
  Briefcase,
  User,
  MoreVertical,
  CalendarDays
} from "lucide-react";

const JENIS_CUTI_LABEL = {
  cuti_tahunan: "Cuti Tahunan",
  cuti_besar: "Cuti Besar",
  cuti_sakit: "Cuti Sakit",
  cuti_melahirkan: "Cuti Melahirkan",
  cuti_alasan_penting: "Cuti Alasan Penting",
  cltn: "CLTN",
  izin: "Izin",
};

const STATUS_CONFIG = {
  menunggu: { label: "Menunggu", className: "bg-amber-50 text-amber-600", icon: Clock },
  disetujui: { label: "Disetujui", className: "bg-emerald-50 text-emerald-600", icon: CheckCircle2 },
  ditolak: { label: "Ditolak", className: "bg-rose-50 text-rose-600", icon: XCircle },
  dibatalkan: { label: "Dibatalkan", className: "bg-slate-100 text-slate-500", icon: AlertCircle },
};

export default function CutiPage() {
  const { data: user, loading: userLoading } = useUser();
  const [pegawai, setPegawai] = useState(null);
  const [cutiList, setCutiList] = useState([]);
  const [saldo, setSaldo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  useEffect(() => {
    if (pegawai) fetchCuti();
  }, [pegawai, filterStatus]);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/pegawai/profile");
      if (res.status === 404) {
        window.location.href = "/onboarding";
        return;
      }
      if (res.ok) {
        const d = await res.json();
        setPegawai(d.pegawai);
      } else if (res.status === 401) {
        window.location.href = "/account/signin";
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  const fetchCuti = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterStatus) params.append("status", filterStatus);
      const res = await fetch(`/api/cuti/list?${params}`);
      if (res.ok) {
        const d = await res.json();
        setCutiList(d.cuti || []);
        setSaldo(d.saldo);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (id, status) => {
    const catatan = status === "ditolak" ? prompt("Alasan penolakan:") : "";
    if (status === "ditolak" && catatan === null) return;
    await fetch(`/api/cuti/${id}`, {
      method: "PATCH", 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, catatan_atasan: catatan }),
    });
    fetchCuti();
  };

  if (userLoading || !pegawai) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sinkronisasi Cuti...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row">
      <Sidebar activePage="cuti" />

      <main className="flex-1 lg:ml-72 p-4 md:p-8 pt-24 lg:pt-8 transition-all duration-300">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Cuti & Izin</h2>
            <p className="text-slate-500 text-sm font-medium">Kelola pengajuan cuti, izin, dan rekapitulasi kehadiran.</p>
          </div>

          <div className="flex items-center gap-4">
             <a
                href="/cuti/ajukan"
                className="inline-flex items-center gap-3 px-6 py-3 bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all active:scale-95"
              >
                <Plus size={18} />
                Ajukan Cuti
              </a>
          </div>
        </header>

        {/* Saldo Grid */}
        {pegawai.role === "pegawai" && saldo && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
             {[
               { label: "Saldo Tahunan", value: saldo.saldo_tahunan ?? 0, color: "blue", icon: CalendarDays },
               { label: "Saldo Besar", value: saldo.saldo_besar ?? 0, color: "indigo", icon: Briefcase },
               { label: "Digunakan", value: saldo.digunakan_tahun_ini ?? 0, color: "orange", icon: Clock },
               { label: "Tahun Berjalan", value: saldo.tahun ?? 2026, color: "emerald", icon: Calendar },
             ].map((card) => (
               <div key={card.label} className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm group hover:-translate-y-1 transition-all">
                  <div className={`w-10 h-10 rounded-xl bg-${card.color}-50 flex items-center justify-center text-${card.color}-600 mb-6 group-hover:scale-110 transition-transform`}>
                     <card.icon size={20} />
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{card.label}</p>
                  <div className="flex items-baseline gap-1">
                     <span className="text-3xl font-black text-slate-900">{card.value}</span>
                     <span className="text-xs font-bold text-slate-400">Hari</span>
                  </div>
               </div>
             ))}
          </div>
        )}

        {/* Filter Bar */}
        <div className="bg-white rounded-3xl border border-slate-200 p-4 mb-10 flex items-center gap-4">
           <div className="flex items-center gap-3 ml-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Filter Status</label>
              <select 
                value={filterStatus} 
                onChange={e => setFilterStatus(e.target.value)} 
                className="bg-slate-50 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 outline-none border border-transparent focus:border-blue-500/20 transition-all"
              >
                <option value="">Semua Status</option>
                {Object.entries(STATUS_CONFIG).map(([v, c]) => <option key={v} value={v}>{c.label}</option>)}
              </select>
           </div>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
          {loading ? (
            <div className="py-24 text-center opacity-30">
               <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
               <p className="text-[10px] font-black uppercase tracking-widest">Memuat...</p>
            </div>
          ) : cutiList.length === 0 ? (
            <div className="py-24 text-center">
              <Calendar size={48} className="text-slate-200 mx-auto mb-4" />
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Belum ada pengajuan cuti</p>
              <a href="/cuti/ajukan" className="mt-6 inline-flex items-center gap-2 text-xs font-black text-blue-600 uppercase tracking-widest hover:underline">
                Ajukan Sekarang <ChevronRight size={14} />
              </a>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
                    {pegawai.role !== "pegawai" && <th className="px-8 py-5">Pegawai</th>}
                    <th className="px-8 py-5">Jenis Cuti</th>
                    <th className="px-8 py-5">Periode Tanggal</th>
                    <th className="px-8 py-5">Durasi</th>
                    <th className="px-8 py-5">Status</th>
                    {(pegawai.role === "admin" || pegawai.role === "pimpinan") && <th className="px-8 py-5 text-right">Aksi</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {cutiList.map(c => {
                    const conf = STATUS_CONFIG[c.status] || STATUS_CONFIG.menunggu;
                    const Icon = conf.icon;
                    return (
                      <tr key={c.id} className="group hover:bg-slate-50/50 transition-colors">
                        {pegawai.role !== "pegawai" && (
                          <td className="px-8 py-6">
                            <p className="font-bold text-slate-900">{c.nama_lengkap}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate max-w-[150px]">{c.jabatan}</p>
                          </td>
                        )}
                        <td className="px-8 py-6">
                           <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-600 uppercase tracking-widest">
                              {JENIS_CUTI_LABEL[c.jenis_cuti] || c.jenis_cuti}
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-3">
                              <div className="text-right">
                                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Mulai</p>
                                 <p className="text-xs font-bold text-slate-700">{new Date(c.tanggal_mulai).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}</p>
                              </div>
                              <ArrowRight size={12} className="text-slate-300" />
                              <div>
                                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Selesai</p>
                                 <p className="text-xs font-bold text-slate-700">{new Date(c.tanggal_selesai).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex items-baseline gap-1">
                              <span className="text-lg font-black text-slate-900">{c.jumlah_hari}</span>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hari</span>
                           </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${conf.className}`}>
                            <Icon size={12} />{conf.label}
                          </span>
                        </td>
                        {(pegawai.role === "admin" || pegawai.role === "pimpinan") && (
                          <td className="px-8 py-6 text-right">
                            {c.status === "menunggu" && (
                              <div className="flex justify-end gap-2">
                                <button 
                                  onClick={() => handleApproval(c.id, "disetujui")} 
                                  className="px-4 py-2 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20"
                                >
                                  Setujui
                                </button>
                                <button 
                                  onClick={() => handleApproval(c.id, "ditolak")} 
                                  className="px-4 py-2 bg-white border border-rose-200 text-rose-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-rose-50 transition-all"
                                >
                                  Tolak
                                </button>
                              </div>
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
