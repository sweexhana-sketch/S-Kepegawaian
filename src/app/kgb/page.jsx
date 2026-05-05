import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";
import Sidebar from "@/components/Sidebar";
import { 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  ChevronRight, 
  Bell,
  Search,
  Filter,
  DollarSign,
  ArrowUpRight
} from "lucide-react";

const STATUS_CONFIG = {
  pending: { label: "Menunggu", className: "bg-amber-50 text-amber-600" },
  proses: { label: "Diproses", className: "bg-blue-50 text-blue-600" },
  selesai: { label: "Selesai", className: "bg-emerald-50 text-emerald-600" },
};

function formatRupiah(num) {
  if (!num) return "-";
  return new Intl.NumberFormat("id-ID", { 
    style: "currency", 
    currency: "IDR", 
    maximumFractionDigits: 0 
  }).format(num);
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
    if (user) fetchProfile();
  }, [user]);

  useEffect(() => {
    if (pegawai) fetchKGB();
  }, [pegawai]);

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

  const fetchKGB = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/kgb/list");
      if (res.ok) {
        const d = await res.json();
        setKgbList(d.kgb || []);
        setUpcoming(d.upcoming || []);
      }
    } catch (err) {
      console.error("Error fetching KGB:", err);
    } finally {
      setLoading(false);
    }
  };

  if (userLoading || !pegawai) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sinkronisasi KGB...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row">
      <Sidebar activePage="kgb" />

      <main className="flex-1 lg:ml-72 p-4 md:p-8 pt-24 lg:pt-8 transition-all duration-300">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Kenaikan Gaji Berkala</h2>
            <p className="text-slate-500 text-sm font-medium">Monitoring otomatis masa kerja dan penyesuaian gaji pegawai.</p>
          </div>
        </header>

        {/* Early Warning Banner */}
        {upcoming.length > 0 && (
          <div className="mb-10 p-8 bg-[#0F172A] rounded-[2.5rem] relative overflow-hidden text-white shadow-2xl shadow-blue-900/20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -mr-32 -mt-32"></div>
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-8">
              <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center flex-shrink-0">
                 <Bell size={32} className="animate-bounce" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-black mb-2 tracking-tight">Peringatan Jatuh Tempo KGB</h3>
                <p className="text-slate-400 text-sm font-medium leading-relaxed">
                  Terdapat <span className="text-white font-bold">{upcoming.length} pegawai</span> yang memiliki KGB jatuh tempo dalam waktu dekat. Segera lakukan pemrosesan dokumen.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {upcoming.slice(0, 4).map(k => {
                    const nextDate = k.tanggal_kgb_berikutnya || k.tmt_kgb_baru;
                    const days = getDaysUntil(nextDate);
                    return (
                      <div key={k.id} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                        {k.nama_lengkap} — {days < 0 ? `${Math.abs(days)} hari lalu` : `${days} hari lagi`}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* KGB Table */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
          <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
             <div className="flex items-center gap-3">
                <div className="w-2 h-6 bg-blue-600 rounded-full"></div>
                <h3 className="font-black text-slate-900 tracking-tight">Riwayat & Jadwal KGB</h3>
             </div>
             <div className="flex gap-2">
                <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-blue-600 transition-colors">
                   <Search size={18} />
                </button>
                <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-blue-600 transition-colors">
                   <Filter size={18} />
                </button>
             </div>
          </div>

          {loading ? (
            <div className="py-24 text-center opacity-30">
               <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
               <p className="text-[10px] font-black uppercase tracking-widest">Memuat...</p>
            </div>
          ) : kgbList.length === 0 ? (
            <div className="py-24 text-center">
              <Calendar size={48} className="text-slate-200 mx-auto mb-4" />
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Belum ada data KGB</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="px-8 py-5">Pegawai</th>
                    <th className="px-8 py-5">TMT KGB Baru</th>
                    <th className="px-8 py-5">Penyesuaian Gaji</th>
                    <th className="px-8 py-5">Masa Kerja</th>
                    <th className="px-8 py-5">Status</th>
                    <th className="px-8 py-5 text-right">Notifikasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {kgbList.map(k => {
                    const conf = STATUS_CONFIG[k.status] || STATUS_CONFIG.pending;
                    const nextDate = k.tanggal_kgb_berikutnya || k.tmt_kgb_baru;
                    const days = getDaysUntil(nextDate);
                    const isWarning = k.is_upcoming || k.is_overdue;
                    return (
                      <tr key={k.id} className={`group hover:bg-slate-50/50 transition-colors ${isWarning ? "bg-amber-50/30" : ""}`}>
                        <td className="px-8 py-6">
                          <p className="font-bold text-slate-900">{k.nama_lengkap || pegawai.nama_lengkap}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">{k.nip || pegawai.nip}</p>
                        </td>
                        <td className="px-8 py-6 text-sm font-bold text-slate-700">
                          {nextDate ? new Date(nextDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "-"}
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                             <div className="text-right">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Gaji Lama</p>
                                <p className="text-xs font-bold text-slate-500">{formatRupiah(k.gaji_lama)}</p>
                             </div>
                             <ArrowUpRight size={14} className="text-emerald-500" />
                             <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Gaji Baru</p>
                                <p className="text-sm font-black text-emerald-600">{formatRupiah(k.gaji_baru)}</p>
                             </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                           <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black text-slate-600 uppercase tracking-widest">
                              {k.masa_kerja_golongan ? `${k.masa_kerja_golongan} Tahun` : "-"}
                           </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${conf.className}`}>
                            {conf.label}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          {k.is_overdue ? (
                            <span className="inline-flex items-center gap-2 text-[10px] font-black text-rose-600 uppercase tracking-widest">
                               <AlertTriangle size={14} /> Terlambat
                            </span>
                          ) : k.is_upcoming ? (
                            <span className="inline-flex items-center gap-2 text-[10px] font-black text-orange-600 uppercase tracking-widest">
                               <Clock size={14} /> {days} Hari Lagi
                            </span>
                          ) : (
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Aman</span>
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
      </main>
    </div>
  );
}
