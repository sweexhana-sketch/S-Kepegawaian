import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";
import Sidebar from "@/components/Sidebar";
import { 
  FolderOpen, 
  Upload, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Search, 
  Trash2, 
  Eye, 
  Plus,
  Filter,
  Download,
  MoreVertical,
  ShieldCheck
} from "lucide-react";

const KATEGORI_LIST = ["Identitas", "Kepegawaian", "Pendidikan", "Kompetensi"];
const STATUS_CONFIG = {
  verified: { label: "Terverifikasi", className: "bg-emerald-50 text-emerald-600", icon: CheckCircle2 },
  pending: { label: "Menunggu", className: "bg-amber-50 text-amber-600", icon: Clock },
  rejected: { label: "Ditolak", className: "bg-rose-50 text-rose-600", icon: AlertCircle },
};

export default function DossierPage() {
  const { data: user, loading: userLoading } = useUser();
  const [pegawai, setPegawai] = useState(null);
  const [dokumen, setDokumen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterKategori, setFilterKategori] = useState("");

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  useEffect(() => {
    if (pegawai) fetchDokumen();
  }, [pegawai, filterKategori]);

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

  const fetchDokumen = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterKategori) params.append("kategori", filterKategori);
      const res = await fetch(`/api/dossier/list?${params}`);
      if (res.ok) {
        const d = await res.json();
        setDokumen(d.dokumen || []);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus dokumen ini?")) return;
    await fetch(`/api/dossier/${id}`, { method: "DELETE" });
    fetchDokumen();
  };

  const filtered = dokumen.filter(d =>
    d.jenis_dokumen?.toLowerCase().includes(search.toLowerCase()) ||
    d.deskripsi?.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: dokumen.length,
    verified: dokumen.filter(d => d.status === "verified").length,
    pending: dokumen.filter(d => d.status === "pending").length,
    rejected: dokumen.filter(d => d.status === "rejected").length,
  };

  if (userLoading || !pegawai) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sinkronisasi Dossier...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row">
      <Sidebar activePage="dossier" />

      <main className="flex-1 lg:ml-72 p-4 md:p-8 pt-24 lg:pt-8 transition-all duration-300">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Digital Dossier</h2>
            <p className="text-slate-500 text-sm font-medium">Arsip digital dokumen kepegawaian yang terorganisir.</p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="/dossier/upload"
              className="inline-flex items-center gap-3 px-6 py-3 bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all active:scale-95"
            >
              <Upload size={18} />
              Upload Dokumen
            </a>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
           {[
             { label: "Total Arsip", value: stats.total, color: "slate", icon: FolderOpen },
             { label: "Terverifikasi", value: stats.verified, color: "emerald", icon: ShieldCheck },
             { label: "Menunggu", value: stats.pending, color: "amber", icon: Clock },
             { label: "Ditolak", value: stats.rejected, color: "rose", icon: AlertCircle },
           ].map((s) => (
             <div key={s.label} className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm group hover:-translate-y-1 transition-all">
                <div className={`w-10 h-10 rounded-xl bg-${s.color}-50 flex items-center justify-center text-${s.color}-600 mb-6 group-hover:scale-110 transition-transform`}>
                   <s.icon size={20} />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
                <h3 className="text-2xl font-black text-slate-900">{s.value}</h3>
             </div>
           ))}
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-3xl border border-slate-200 p-4 mb-8 flex flex-col md:flex-row gap-4 items-center shadow-sm">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Cari nama dokumen atau deskripsi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-6 py-3 bg-slate-50 border-transparent rounded-2xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all outline-none"
            />
          </div>
          <div className="flex items-center gap-3">
             <select 
               value={filterKategori} 
               onChange={e => setFilterKategori(e.target.value)} 
               className="bg-white px-6 py-3 rounded-2xl text-xs font-black text-slate-600 uppercase tracking-widest border border-slate-200 outline-none focus:border-blue-600 transition-all"
             >
                <option value="">Semua Kategori</option>
                {KATEGORI_LIST.map(k => <option key={k} value={k}>{k}</option>)}
             </select>
             <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-blue-600 transition-colors">
               <Download size={20} />
             </button>
          </div>
        </div>

        {/* Document Content */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
          {loading ? (
             <div className="py-24 text-center opacity-30">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-[10px] font-black uppercase tracking-widest">Memuat...</p>
             </div>
          ) : filtered.length === 0 ? (
            <div className="py-24 text-center px-6">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                 <FolderOpen size={48} className="text-slate-200" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-1">Dossier Kosong</h3>
              <p className="text-slate-500 text-sm max-w-xs mx-auto mb-8 font-medium">Mulai dengan mengunggah dokumen digital pertama Anda untuk pengarsipan mandiri.</p>
              <a href="/dossier/upload" className="inline-flex items-center gap-3 px-6 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-blue-600 transition-all">
                 Unggah Dokumen <Upload size={14} />
              </a>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
                    {pegawai.role === "admin" && <th className="px-8 py-5">Pegawai</th>}
                    <th className="px-8 py-5">Dokumen</th>
                    <th className="px-8 py-5">Kategori</th>
                    <th className="px-8 py-5">Tgl Upload</th>
                    <th className="px-8 py-5">Status</th>
                    <th className="px-8 py-5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map(doc => {
                    const conf = STATUS_CONFIG[doc.status] || STATUS_CONFIG.pending;
                    const Icon = conf.icon;
                    return (
                      <tr key={doc.id} className="group hover:bg-slate-50/50 transition-colors">
                        {pegawai.role === "admin" && (
                          <td className="px-8 py-6">
                             <p className="font-bold text-slate-900">{doc.nama_lengkap}</p>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">{doc.nip}</p>
                          </td>
                        )}
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                 <FileText size={24} />
                              </div>
                              <div>
                                 <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{doc.jenis_dokumen}</p>
                                 {doc.deskripsi && <p className="text-[10px] font-medium text-slate-400 mt-0.5 line-clamp-1">{doc.deskripsi}</p>}
                              </div>
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <div className="inline-flex items-center px-3 py-1 bg-slate-100 rounded-xl text-[10px] font-black text-slate-600 uppercase tracking-widest">
                              {doc.kategori}
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <p className="text-xs font-bold text-slate-500">
                             {new Date(doc.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                           </p>
                        </td>
                        <td className="px-8 py-6">
                          <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${conf.className}`}>
                            <Icon size={12} />{conf.label}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            {doc.file_url && (
                              <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="p-2.5 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-xl transition-colors">
                                 <Eye size={20} />
                              </a>
                            )}
                            <button onClick={() => handleDelete(doc.id)} className="p-2.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl transition-colors">
                               <Trash2 size={20} />
                            </button>
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
