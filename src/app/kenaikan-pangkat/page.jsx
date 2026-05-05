import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";
import Sidebar from "@/components/Sidebar";
import { 
  Award, 
  Plus, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  Search,
  Filter,
  FileCheck,
  History
} from "lucide-react";

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
    if (user) fetchProfile();
  }, [user]);

  useEffect(() => {
    if (pegawai) fetchKP();
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

  const fetchKP = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterStatus) params.append("status", filterStatus);
      const res = await fetch(`/api/kenaikan-pangkat/list?${params}`);
      if (res.ok) {
        const d = await res.json();
        setKpList(d.kenaikan_pangkat || []);
      }
    } finally {
      setLoading(false);
    }
  };

  if (userLoading || !pegawai) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sinkronisasi Pangkat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row">
      <Sidebar activePage="pangkat" />

      <main className="flex-1 lg:ml-72 p-4 md:p-8 pt-24 lg:pt-8 transition-all duration-300">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Kenaikan Pangkat</h2>
            <p className="text-slate-500 text-sm font-medium">Monitoring usulan kenaikan pangkat dan golongan pegawai.</p>
          </div>

          <div className="flex items-center gap-4">
             <a
                href="/kenaikan-pangkat/usulan"
                className="inline-flex items-center gap-3 px-6 py-3 bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all active:scale-95"
              >
                <Plus size={18} />
                Buat Usulan Baru
              </a>
          </div>
        </header>

        {/* Filter Bar */}
        <div className="bg-white rounded-3xl border border-slate-200 p-4 mb-10 flex items-center">
           <div className="flex items-center gap-3 ml-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status Tahapan</label>
              <select 
                value={filterStatus} 
                onChange={e => setFilterStatus(e.target.value)} 
                className="bg-slate-50 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 outline-none border border-transparent focus:border-blue-500/20 transition-all"
              >
                <option value="">Semua Tahapan</option>
                {STATUS_FLOW.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
              </select>
           </div>
        </div>

        {/* List Content */}
        <div className="space-y-8">
           {loading ? (
             <div className="bg-white rounded-[2.5rem] border border-slate-200 py-24 text-center opacity-30">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-[10px] font-black uppercase tracking-widest">Memuat...</p>
             </div>
           ) : kpList.length === 0 ? (
             <div className="bg-white rounded-[2.5rem] border border-slate-200 py-24 text-center px-6">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                   <Award size={40} className="text-slate-200" />
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-1">Belum Ada Usulan Aktif</h3>
                <p className="text-slate-500 text-sm max-w-xs mx-auto mb-8 font-medium">Anda belum memiliki usulan kenaikan pangkat yang sedang diproses.</p>
                <a href="/kenaikan-pangkat/usulan" className="inline-flex items-center gap-3 px-6 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-blue-600 transition-all">
                   Mulai Usulan <ArrowRight size={14} />
                </a>
             </div>
           ) : (
             kpList.map(kp => {
               const currentStep = STATUS_IDX[kp.status] ?? 0;
               return (
                 <div key={kp.id} className="bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-sm hover:shadow-xl transition-all">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8 mb-12">
                       <div className="flex gap-6">
                          <div className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600 flex-shrink-0">
                             <Award size={32} />
                          </div>
                          <div>
                             {pegawai.role !== "pegawai" && (
                               <div className="mb-2">
                                 <span className="text-sm font-black text-slate-900 uppercase tracking-tight">{kp.nama_lengkap}</span>
                                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-3">NIP. {kp.nip}</span>
                               </div>
                             )}
                             <h4 className="text-xl font-black text-slate-900 tracking-tight mb-2">{kp.jenis_kenaikan}</h4>
                             <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl">
                                <p className="text-xs font-bold text-slate-500">{kp.pangkat_lama} <span className="text-[10px] font-black text-slate-400">({kp.golongan_lama})</span></p>
                                <ArrowRight size={14} className="text-blue-500" />
                                <p className="text-xs font-black text-blue-600">{kp.pangkat_baru || "?"} <span className="text-[10px] font-bold text-blue-400">({kp.golongan_baru || "?"})</span></p>
                             </div>
                          </div>
                       </div>
                       
                       <div className="text-right">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tanggal Usulan</p>
                          <p className="font-black text-slate-900">{new Date(kp.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
                       </div>
                    </div>

                    {/* Progress Track */}
                    <div className="relative pt-10 pb-4">
                       <div className="absolute top-14 left-0 w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-600 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(37,99,235,0.4)]" 
                            style={{ width: `${(currentStep / (STATUS_FLOW.length - 1)) * 100}%` }} 
                          />
                       </div>

                       <div className="relative flex justify-between">
                          {STATUS_FLOW.map((s, idx) => (
                            <div key={s.key} className="flex flex-col items-center">
                               <div 
                                 className={`w-10 h-10 rounded-2xl flex items-center justify-center z-10 transition-all duration-500 ${
                                   idx < currentStep 
                                   ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" 
                                   : idx === currentStep 
                                   ? "bg-white border-4 border-blue-600 text-blue-600 shadow-xl" 
                                   : "bg-white border-2 border-slate-100 text-slate-300"
                                 }`}
                               >
                                 {idx < currentStep ? <CheckCircle2 size={18} /> : idx + 1}
                               </div>
                               <div className="mt-4 text-center max-w-[80px]">
                                  <p className={`text-[10px] font-black uppercase tracking-tighter ${idx <= currentStep ? "text-slate-900" : "text-slate-300"}`}>
                                    {s.label}
                                  </p>
                                  <p className="text-[8px] font-bold text-slate-400 mt-1 leading-tight hidden lg:block">{s.desc}</p>
                               </div>
                            </div>
                          ))}
                       </div>
                    </div>

                    {kp.catatan && (
                      <div className="mt-10 p-5 bg-slate-50 rounded-3xl border border-slate-100 flex gap-4">
                         <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm border border-slate-100">
                            <History size={14} />
                         </div>
                         <div className="flex-1">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Catatan Verifikator</p>
                            <p className="text-xs font-medium text-slate-600 leading-relaxed">{kp.catatan}</p>
                         </div>
                      </div>
                    )}
                 </div>
               );
             })
           )}
        </div>
      </main>
    </div>
  );
}
