import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";
import Sidebar from "@/components/Sidebar";
import { 
  FileText, 
  Plus, 
  Upload, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Eye, 
  ChevronRight,
  Filter,
  Search,
  Bell,
  TrendingUp,
  Download
} from "lucide-react";

const STATUS_CONFIG = {
  draft: { label: "Draft", className: "bg-slate-100 text-slate-600", icon: Clock },
  submitted: { label: "Diajukan", className: "bg-blue-50 text-blue-600", icon: Clock },
  dinilai: { label: "Dinilai", className: "bg-emerald-50 text-emerald-600", icon: CheckCircle2 },
  revisi: { label: "Perlu Revisi", className: "bg-rose-50 text-rose-600", icon: AlertCircle },
};

const TAHUN_OPTIONS = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

export default function SKPPage() {
  const { data: user, loading: userLoading } = useUser();
  const [pegawai, setPegawai] = useState(null);
  const [skpList, setSkpList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tahun, setTahun] = useState(new Date().getFullYear());
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  useEffect(() => {
    if (pegawai) fetchSKP();
  }, [pegawai, tahun, filterStatus]);

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

  const fetchSKP = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ tahun });
      if (filterStatus) params.append("status", filterStatus);
      const res = await fetch(`/api/skp/list?${params}`);
      if (res.ok) {
        const d = await res.json();
        setSkpList(d.skp || []);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (id) => {
    await fetch(`/api/skp/${id}`, { 
      method: "PATCH", 
      headers: { "Content-Type": "application/json" }, 
      body: JSON.stringify({ status: "submitted" }) 
    });
    fetchSKP();
  };

  if (userLoading || !pegawai) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sinkronisasi SKP...</p>
        </div>
      </div>
    );
  }

  const periodeLabels = { semester1: "Semester I", semester2: "Semester II", tahunan: "Tahunan" };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row">
      <Sidebar activePage="skp" />

      <main className="flex-1 lg:ml-72 p-4 md:p-8 pt-24 lg:pt-8 transition-all duration-300">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">SKP & Kinerja</h2>
            <p className="text-slate-500 text-sm font-medium">Monitoring target sasaran kinerja dan realisasi tahunan.</p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="/skp/upload"
              className="inline-flex items-center gap-3 px-6 py-3 bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all active:scale-95"
            >
              <Upload size={18} />
              Upload SKP Baru
            </a>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
           <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total SKP</p>
              <h3 className="text-3xl font-black text-slate-900">{skpList.length}</h3>
           </div>
           <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Telah Dinilai</p>
              <h3 className="text-3xl font-black text-emerald-600">{skpList.filter(s => s.status === 'dinilai').length}</h3>
           </div>
           <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status Draft</p>
              <h3 className="text-3xl font-black text-orange-500">{skpList.filter(s => s.status === 'draft').length}</h3>
           </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-3xl border border-slate-200 p-4 mb-8 flex flex-col md:flex-row gap-4 items-center">
          <div className="flex items-center gap-2 flex-1">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Tahun</label>
             <select 
               value={tahun} 
               onChange={e => setTahun(e.target.value)} 
               className="bg-slate-50 px-4 py-2 rounded-xl text-sm font-bold text-slate-700 outline-none border border-transparent focus:border-blue-500/20 transition-all"
             >
                {TAHUN_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
             </select>

             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Status</label>
             <select 
               value={filterStatus} 
               onChange={e => setFilterStatus(e.target.value)} 
               className="bg-slate-50 px-4 py-2 rounded-xl text-sm font-bold text-slate-700 outline-none border border-transparent focus:border-blue-500/20 transition-all"
             >
                <option value="">Semua Status</option>
                {Object.entries(STATUS_CONFIG).map(([v, c]) => <option key={v} value={v}>{c.label}</option>)}
             </select>
          </div>
          <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-blue-600 transition-colors">
            <Download size={20} />
          </button>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center opacity-30">
               <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
               <p className="text-xs font-black uppercase tracking-widest">Memuat Data...</p>
            </div>
          ) : skpList.length === 0 ? (
            <div className="py-24 flex flex-col items-center justify-center text-center px-6">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <FileText size={40} className="text-slate-300" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-1">Belum Ada Dokumen SKP</h3>
              <p className="text-slate-500 text-sm max-w-xs mx-auto mb-8 font-medium">Anda belum mengunggah dokumen SKP untuk periode tahun {tahun}.</p>
              <a href="/skp/upload" className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-blue-600 transition-all">
                Unggah Sekarang
              </a>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    {pegawai.role !== "pegawai" && <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pegawai</th>}
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Periode & Tahun</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Target vs Realisasi</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {skpList.map(skp => {
                    const conf = STATUS_CONFIG[skp.status] || STATUS_CONFIG.draft;
                    const Icon = conf.icon;
                    return (
                      <tr key={skp.id} className="group hover:bg-slate-50/50 transition-colors">
                        {pegawai.role !== "pegawai" && (
                          <td className="px-8 py-6">
                            <p className="font-bold text-slate-900">{skp.nama_lengkap}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">NIP. {skp.nip}</p>
                          </td>
                        )}
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 font-bold text-xs">
                                {skp.tahun}
                             </div>
                             <div>
                                <p className="font-bold text-slate-900">{periodeLabels[skp.periode] || skp.periode}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Siklus Tahunan</p>
                             </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-4">
                              <div className="text-right">
                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target</p>
                                 <p className="font-bold text-slate-700">{skp.target_nilai ?? "-"}</p>
                              </div>
                              <div className="w-px h-6 bg-slate-200"></div>
                              <div>
                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hasil</p>
                                 <p className="font-black text-blue-600">{skp.nilai_akhir ?? "-"}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${conf.className}`}>
                            <Icon size={12} /> {conf.label}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            {skp.dokumen_url && (
                              <a 
                                href={skp.dokumen_url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="p-2 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-xl transition-colors"
                              >
                                <Eye size={18} />
                              </a>
                            )}
                            {skp.status === "draft" && pegawai.role === "pegawai" && (
                              <button 
                                onClick={() => handleSubmit(skp.id)} 
                                className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-600 transition-all"
                              >
                                Submit
                              </button>
                            )}
                          </div>
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
