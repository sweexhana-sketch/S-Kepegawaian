import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";
import Sidebar from "@/components/Sidebar";
import { 
  Search, 
  Plus, 
  Filter, 
  Download, 
  MoreHorizontal, 
  ChevronRight,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Bell
} from "lucide-react";

export default function PegawaiPage() {
  const { data: user, loading: userLoading } = useUser();
  const [pegawaiList, setPegawaiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPegawai, setCurrentPegawai] = useState(null);

  useEffect(() => {
    if (user) {
      fetchPegawai();
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/pegawai/profile");
      if (res.status === 404) {
        window.location.href = "/onboarding";
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setCurrentPegawai(data.pegawai);
      } else if (res.status === 401) {
        window.location.href = "/account/signin";
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  const fetchPegawai = async () => {
    try {
      const res = await fetch("/api/pegawai/list");
      if (res.ok) {
        const data = await res.json();
        setPegawaiList(data.pegawai || []);
      }
    } catch (err) {
      console.error("Error fetching pegawai:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPegawai = pegawaiList.filter((p) =>
    (p.nama_lengkap?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (p.nip || "").includes(searchTerm)
  );

  if (userLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Memuat Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row">
      <Sidebar activePage="pegawai" />

      <main className="flex-1 lg:ml-72 p-4 md:p-8 pt-24 lg:pt-8 transition-all duration-300">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Database Pegawai</h2>
            <p className="text-slate-500 text-sm font-medium">Manajemen data dan profil seluruh staf Dinas PUPR.</p>
          </div>

          <div className="flex items-center gap-4">
            {currentPegawai?.role === "admin" ? (
              <a
                href="/pegawai/tambah"
                className="inline-flex items-center gap-3 px-6 py-3 bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all active:scale-95"
              >
                <Plus size={18} />
                Tambah Pegawai
              </a>
            ) : (
              currentPegawai && (
                <a
                  href={`/pegawai/${currentPegawai.id}/edit`}
                  className="inline-flex items-center gap-3 px-6 py-3 bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                >
                  <Plus size={18} />
                  Lengkapi Data Profil
                </a>
              )
            )}
            <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-blue-600 transition-colors">
              <Download size={20} />
            </button>
          </div>
        </header>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-3xl border border-slate-200 p-4 mb-8 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Cari berdasarkan nama atau NIP..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-3 bg-slate-50 border-transparent rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all outline-none"
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-600 hover:border-blue-600 hover:text-blue-600 transition-all">
            <Filter size={16} />
            Filter
          </button>
        </div>

        {/* Grid View */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPegawai.map((p) => (
            <a
              key={p.id}
              href={`/pegawai/${p.id}`}
              className="group bg-white rounded-[2rem] border border-slate-200 p-8 hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col h-full"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl group-hover:scale-110 transition-transform">
                  {p.nama_lengkap?.charAt(0)}
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  p.status_pegawai === 'PNS' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                }`}>
                  {p.status_pegawai}
                </span>
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-black text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors mb-1">
                  {p.nama_lengkap}
                </h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-4">NIP. {p.nip || "-"}</p>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                    <Briefcase size={14} className="text-slate-400" />
                    <span className="truncate">{p.jabatan || "-"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                    <MapPin size={14} className="text-slate-400" />
                    <span className="truncate">{p.unit_kerja || "-"}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                <div className="flex -space-x-2">
                   <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
                     <Mail size={12} />
                   </div>
                   <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
                     <Phone size={12} />
                   </div>
                </div>
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Detail Profil <ChevronRight size={12} />
                </span>
              </div>
            </a>
          ))}
        </div>

        {filteredPegawai.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[2.5rem] border border-dashed border-slate-200">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-300">
              <User size={40} />
            </div>
            <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Tidak ada pegawai ditemukan</p>
          </div>
        )}
      </main>
    </div>
  );
}
