import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";
import Sidebar from "@/components/Sidebar";
import {
  Bell,
  Users,
  FileText,
  TrendingUp,
  Calendar,
  Award,
  AlertCircle,
  ArrowRight,
  LogOut,
  LayoutDashboard,
  Search,
  ChevronRight,
  Clock,
  Briefcase
} from "lucide-react";

export default function HomePage() {
  const { data: user, loading: userLoading } = useUser();
  const [showDashboard, setShowDashboard] = useState(false);
  const [pegawai, setPegawai] = useState(null);
  const [stats, setStats] = useState(null);
  const [notifikasi, setNotifikasi] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    } else if (!userLoading) {
      setLoading(false);
    }
  }, [user, userLoading]);

  const fetchDashboardData = async () => {
    try {
      const [profileRes, statsRes, notifRes] = await Promise.all([
        fetch("/api/pegawai/profile"),
        fetch("/api/dashboard/stats"),
        fetch("/api/notifikasi/list"),
      ]);

      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setPegawai(profileData.pegawai);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      if (notifRes.ok) {
        const notifData = await notifRes.json();
        setNotifikasi(notifData.notifikasi || []);
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (userLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0F172A]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-blue-500/20 rounded-full border-2 border-blue-500/50 border-t-blue-500 animate-spin"></div>
          <div className="text-sm text-blue-400 font-medium tracking-widest uppercase">Sinkronisasi Data...</div>
        </div>
      </div>
    );
  }

  // PORTAL VIEW
  if (!showDashboard) {
    return (
      <div className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center bg-[#003366]">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#FFCC00]/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#FFCC00]/5 rounded-full blur-[150px]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:32px_32px]"></div>
          
          {/* Tiled Pattern - Tilted PUPR Logo */}
          <div 
            className="absolute opacity-[0.12]"
            style={{
              top: '-50%', left: '-50%', width: '200%', height: '200%',
              backgroundImage: `url('/pupr.png')`,
              backgroundSize: '140px',
              backgroundRepeat: 'repeat',
              transform: 'rotate(-25deg)',
              filter: 'brightness(0) invert(1)',
              pointerEvents: 'none'
            }}
          ></div>
        </div>

        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl animate-in fade-in zoom-in duration-700">
          {/* Main Logo Container */}
          <div className="mb-12 relative">
            <div className="absolute -inset-8 bg-[#FFCC00]/20 blur-3xl rounded-full animate-pulse"></div>
            <div className="relative w-40 h-40 md:w-48 md:h-48 bg-white rounded-[2.5rem] p-8 shadow-2xl flex items-center justify-center border-4 border-[#FFCC00]">
              <img
                src="https://ucarecdn.com/f5ae1e2c-7229-43a4-a8ad-ae05a4f4cac4/-/format/auto/"
                alt="Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-[#FFCC00] text-lg md:text-xl font-black tracking-[0.3em] uppercase">
              S-Kepegawaian PUPR
            </h2>
            
            <div className="flex flex-col items-center gap-4">
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white">
                SIMPEG<span className="text-[#FFCC00]">PUPR</span>
              </h1>
              <p className="text-blue-100 text-lg md:text-xl font-medium tracking-wide max-w-2xl leading-relaxed">
                Manajemen Kepegawaian Terintegrasi & Modern
                <span className="block text-yellow-500/80 text-base font-bold mt-2">Dinas Pekerjaan Umum & Perumahan Rakyat Provinsi Papua Barat Daya</span>
              </p>
            </div>

            <div className="pt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
              {user ? (
                <>
                  <button
                    onClick={() => setShowDashboard(true)}
                    className="group px-8 py-4 bg-[#FFCC00] text-[#003366] font-black rounded-2xl shadow-xl hover:scale-105 transition-all flex items-center gap-3 uppercase tracking-wider"
                  >
                    <LayoutDashboard size={20} />
                    Masuk Dashboard
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <a
                    href="/account/logout"
                    className="px-8 py-4 bg-white/10 text-white font-bold rounded-2xl border border-white/20 hover:bg-white/20 transition-all backdrop-blur-md flex items-center gap-2"
                  >
                    <LogOut size={18} />
                    Keluar
                  </a>
                </>
              ) : (
                <a
                  href="/account/signin"
                  className="group px-12 py-4 bg-[#FFCC00] text-[#003366] font-black rounded-2xl shadow-xl hover:scale-105 transition-all flex items-center gap-3 uppercase tracking-wider"
                >
                  Masuk Ke Sistem
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-8 text-slate-600 text-[10px] tracking-[0.4em] uppercase font-bold">
          &copy; 2026 SIMPEG DIGITAL · PAPUA BARAT DAYA
        </div>
      </div>
    );
  }

  // DASHBOARD VIEW
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex" style={{ fontFamily: "Inter, -apple-system, sans-serif" }}>
      <Sidebar activePage="dashboard" />

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-72 p-4 md:p-8 pt-24 lg:pt-8 transition-all duration-300">
        {/* Top bar for mobile/desktop */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="animate-in slide-in-from-left duration-700">
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Dashboard Utama</h2>
            <p className="text-slate-500 text-sm font-medium">Selamat datang kembali, Sistem Kepegawaian Digital.</p>
          </div>
          
          <div className="flex items-center gap-4 animate-in slide-in-from-right duration-700">
            <div className="relative hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Cari data..." 
                className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-yellow-500/10 transition-all outline-none w-64 shadow-sm"
              />
            </div>
            <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-[#003366] transition-colors shadow-sm relative">
              <Bell size={20} />
              <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* Hero Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Total Pegawai', value: stats?.totalPegawai || 0, icon: Users, color: 'blue', trend: '+12% bln ini' },
            { label: 'Layanan KGB', value: stats?.totalKgb || 0, icon: TrendingUp, color: 'emerald', trend: '4 Menunggu' },
            { label: 'SKP Selesai', value: '85%', icon: FileText, color: 'indigo', trend: 'Target: 100%' },
            { label: 'Absensi Hari Ini', value: '92%', icon: Clock, color: 'orange', trend: 'WIT Time' }
          ].map((stat, i) => (
            <div 
              key={stat.label}
              className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className={`absolute top-0 right-0 w-24 h-24 bg-[#FFCC00]/10 rounded-full -mr-12 -mt-12 opacity-50 group-hover:scale-150 transition-transform duration-700`}></div>
              <div className="relative z-10">
                <div className={`w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 text-[#003366] group-hover:bg-[#003366] group-hover:text-[#FFCC00] transition-colors duration-300`}>
                  <stat.icon size={24} />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                <h3 className="text-3xl font-black text-slate-900 mb-2">{stat.value}</h3>
                <p className={`text-[10px] font-bold text-[#003366] bg-[#FFCC00] px-2 py-1 rounded-lg inline-block`}>{stat.trend}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic Bento Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Work Card */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-sm">
               <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-4">
                     <div className="w-3 h-8 bg-[#FFCC00] rounded-full"></div>
                     <h3 className="text-2xl font-black text-[#003366] tracking-tight">Notifikasi & Agenda</h3>
                  </div>
                  <button className="text-xs font-black text-[#003366] uppercase tracking-widest hover:underline">Lihat Kalender</button>
               </div>

               <div className="space-y-6">
                {notifikasi.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 opacity-30">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                      <AlertCircle size={40} />
                    </div>
                    <p className="text-sm font-black uppercase tracking-[0.2em]">Belum ada aktivitas</p>
                  </div>
                ) : (
                  notifikasi.slice(0, 4).map((notif) => (
                    <div key={notif.id} className="group flex items-start gap-6 p-6 rounded-3xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                       <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                          <Clock size={20} className="text-blue-600" />
                       </div>
                       <div className="flex-1">
                           <div className="flex items-center justify-between mb-1">
                             <h4 className="font-bold text-[#003366]">{notif.judul}</h4>
                             <span className="text-[10px] font-bold text-slate-400">{new Date(notif.created_at).toLocaleDateString('id-ID')}</span>
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed line-clamp-1">{notif.pesan}</p>
                       </div>
                    </div>
                  ))
                )}
               </div>
            </div>

            {/* Quick Access Grid */}
            <div className="grid grid-cols-2 gap-6">
               <a href="/pegawai/tambah" className="bg-[#003366] rounded-[2rem] p-8 text-white group hover:bg-[#FFCC00] hover:text-[#003366] transition-all duration-500 overflow-hidden relative shadow-lg">
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/5 rounded-full group-hover:scale-150 transition-transform"></div>
                  <Users className="mb-4 text-[#FFCC00] group-hover:text-[#003366]" size={32} />
                  <h4 className="font-bold text-lg mb-1 uppercase tracking-tight">Daftarkan Pegawai</h4>
                  <p className="text-xs text-blue-100 group-hover:text-[#003366]/70">Registrasi anggota baru ke sistem</p>
               </a>
               <a href="/absensi" className="bg-white rounded-[2rem] border-2 border-[#003366]/10 p-8 group hover:border-[#FFCC00] transition-all duration-500 shadow-sm">
                  <Clock className="mb-4 text-[#003366]" size={32} />
                  <h4 className="font-bold text-lg text-[#003366] mb-1 uppercase tracking-tight">Monitor Absensi</h4>
                  <p className="text-xs text-slate-500">Cek status kehadiran real-time</p>
               </a>
            </div>
          </div>

          {/* Right Column / Quick Widgets */}
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-[#003366] to-[#004080] rounded-[2.5rem] p-10 text-white shadow-2xl shadow-blue-900/20 relative overflow-hidden border-b-4 border-[#FFCC00]">
               <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
               <Briefcase className="mb-8 text-[#FFCC00]" size={48} />
               <h3 className="text-2xl font-black tracking-tight mb-2 uppercase">Profil Kepegawaian</h3>
               <p className="text-blue-100 text-sm leading-relaxed mb-8 font-medium">Lengkapi data mandiri Anda untuk mempermudah proses administrasi.</p>
               <a href="/pegawai" className="inline-flex items-center gap-3 px-6 py-3 bg-[#FFCC00] text-[#003366] rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-lg">
                  Update Profil <ChevronRight size={16} />
               </a>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-sm">
               <h3 className="text-lg font-black text-[#003366] tracking-tight mb-8 uppercase">Statistik Cepat</h3>
               <div className="space-y-6">
                  {[
                    { label: "PNS", value: stats?.distribusi?.pns || 0, total: stats?.totalPegawai || 1, color: "#003366" },
                    { label: "CPNS", value: stats?.distribusi?.cpns || 0, total: stats?.totalPegawai || 1, color: "#FFCC00" },
                    { label: "PPPK", value: stats?.distribusi?.pppk || 0, total: stats?.totalPegawai || 1, color: "#94a3b8" },
                  ].map((item) => {
                    const percentage = Math.round((item.value / item.total) * 100);
                    return (
                      <div key={item.label} className="space-y-2">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                            <span className="text-slate-500">{item.label} ({item.value})</span>
                            <span className="text-slate-900 font-black">{percentage}%</span>
                        </div>
                        <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full transition-all duration-1000`} style={{ width: `${percentage}%`, backgroundColor: item.color }}></div>
                        </div>
                      </div>
                    );
                  })}
               </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

