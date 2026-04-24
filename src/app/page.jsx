import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";
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
  LayoutDashboard
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
          <div className="text-sm text-blue-400 font-medium tracking-widest uppercase">Memuat...</div>
        </div>
      </div>
    );
  }

  // PORTAL VIEW
  if (!showDashboard) {
    return (
      <div className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center bg-gradient-to-br from-[#1E40AF] via-[#3B82F6] to-[#60A5FA]">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-300 rounded-full blur-[150px]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff22_1px,transparent_1px)] [background-size:32px_32px]"></div>
          {/* Subtle World Map Outline (SVG) */}
          <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid slice">
            <path d="M150,200 Q200,150 250,200 T350,200 T450,250 T550,200 T650,250 T750,200 T850,250" fill="none" stroke="white" strokeWidth="2" strokeDasharray="5,5" />
            <circle cx="200" cy="200" r="2" fill="white" />
            <circle cx="400" cy="250" r="2" fill="white" />
            <circle cx="600" cy="220" r="2" fill="white" />
            <circle cx="800" cy="270" r="2" fill="white" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl animate-in fade-in zoom-in duration-700">
          {/* Main Logo Container */}
          <div className="mb-12 relative">
            <div className="absolute -inset-4 bg-white/20 blur-xl rounded-full animate-pulse"></div>
            <div className="relative w-40 h-40 md:w-48 md:h-48 bg-white rounded-full p-6 shadow-2xl flex items-center justify-center border-4 border-white/30 backdrop-blur-sm">
              <img
                src="https://ucarecdn.com/f5ae1e2c-7229-43a4-a8ad-ae05a4f4cac4/-/format/auto/"
                alt="Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-white text-xl md:text-2xl font-light tracking-[0.2em] uppercase">
              Selamat Datang di
            </h2>
            
            <div className="flex flex-col items-center gap-4">
              <div className="bg-white px-8 py-3 rounded-xl shadow-xl">
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter">
                  <span className="text-[#1E40AF]">SIM</span>
                  <span className="text-[#3B82F6]">PEG</span>
                  <span className="ml-2 text-gray-300 font-light">DIGITAL</span>
                </h1>
              </div>
              <p className="text-blue-50 text-lg md:text-xl font-medium tracking-wide max-w-2xl leading-relaxed">
                Platform Digital Manajemen Kepegawaian Terpadu
                <span className="block text-white/80 text-base font-normal mt-2">Dinas Pekerjaan Umum & Perumahan Rakyat Provinsi Papua Barat Daya</span>
              </p>
            </div>

            <div className="pt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
              {user ? (
                <>
                  <button
                    onClick={() => setShowDashboard(true)}
                    className="group px-8 py-4 bg-white text-[#1E40AF] font-bold rounded-full shadow-lg hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-3"
                  >
                    <LayoutDashboard size={20} />
                    Masuk Ke Dashboard
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <a
                    href="/account/logout"
                    className="px-8 py-4 bg-white/10 text-white font-medium rounded-full border border-white/30 hover:bg-white/20 transition-all backdrop-blur-md flex items-center gap-2"
                  >
                    <LogOut size={18} />
                    Keluar
                  </a>
                </>
              ) : (
                <a
                  href="/account/signin"
                  className="group px-12 py-4 bg-white text-[#1E40AF] font-bold rounded-full shadow-lg hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-3"
                >
                  Masuk Ke Sistem
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-8 text-white/50 text-xs tracking-widest uppercase font-medium">
          &copy; 2026 SIMPEG DIGITAL · PAPUA BARAT DAYA
        </div>
      </div>
    );
  }

  // DASHBOARD VIEW
  return (
    <div
      className="min-h-screen bg-[#F8FAFC]"
      style={{ fontFamily: "Inter, -apple-system, sans-serif" }}
    >
      {/* Header */}
      <div className="bg-white border-b border-[#E2E8F0] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div 
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setShowDashboard(false)}
              >
                <img
                  src="https://ucarecdn.com/f5ae1e2c-7229-43a4-a8ad-ae05a4f4cac4/-/format/auto/"
                  alt="Logo"
                  className="h-10 w-10 object-contain"
                />
              </div>
              <div>
                <h1 className="text-lg font-bold text-[#0F172A] tracking-tight">
                  SIMPEG DIGITAL
                </h1>
                <p className="text-[10px] text-[#64748B] font-bold uppercase tracking-wider">
                  Provinsi Papua Barat Daya
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-[#F1F5F9] rounded-xl transition-colors">
                <Bell size={20} className="text-[#64748B]" />
                {notifikasi.filter((n) => !n.is_read).length > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                )}
              </button>
              <div className="flex items-center gap-3 pl-4 border-l border-[#E2E8F0]">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-[#0F172A]">
                    {pegawai?.nama_lengkap || user?.name}
                  </p>
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter">
                    {pegawai?.role || "USER"}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold">
                  {(pegawai?.nama_lengkap || user?.name || "U").charAt(0)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex gap-8 overflow-x-auto no-scrollbar">
            {[
              { label: "Dashboard", href: "/", active: true },
              { label: "Data Pegawai", href: "/pegawai" },
              { label: "SKP", href: "/skp" },
              { label: "KGB", href: "/kgb" },
              { label: "Kenaikan Pangkat", href: "/kenaikan-pangkat" },
              { label: "Cuti & Izin", href: "/cuti" },
              { label: "Digital Dossier", href: "/dossier" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`py-4 text-xs font-bold uppercase tracking-widest transition-all border-b-2 whitespace-nowrap ${
                  item.active
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-[#64748B] hover:text-[#0F172A]"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-black text-[#0F172A] tracking-tight mb-2">
              Halo, {pegawai?.nama_lengkap?.split(" ")[0] || user?.name}!
            </h2>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full uppercase tracking-wider">
                {pegawai?.jabatan || "Pegawai"}
              </span>
              <span className="text-xs text-[#64748B] font-medium">
                {pegawai?.unit_kerja || "Dinas PUPR"}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-[#64748B] font-bold uppercase tracking-widest">
              {new Date().toLocaleDateString("id-ID", { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: "Total Pegawai", value: stats?.totalPegawai || 0, icon: Users, color: "blue" },
            { label: "KGB Bulan Ini", value: stats?.kgbBulanIni || 0, icon: Calendar, color: "orange" },
            { label: "Usulan Kenaikan Pangkat", value: stats?.usulanKP || 0, icon: Award, color: "emerald" },
            { label: "SKP Belum Submits", value: stats?.skpBelumSubmit || 0, icon: FileText, color: "rose" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl border border-[#E2E8F0] p-6 hover:shadow-xl hover:-translate-y-1 transition-all group">
              <div className={`w-12 h-12 rounded-xl bg-${stat.color}-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <stat.icon size={24} className={`text-${stat.color}-600`} />
              </div>
              <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-3xl font-black text-[#0F172A]">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Notifikasi */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-6 bg-blue-600 rounded-full"></div>
                  <h3 className="text-xl font-bold text-[#0F172A]">
                    Notifikasi & Pengingat
                  </h3>
                </div>
                <a
                  href="/notifikasi"
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 uppercase tracking-widest"
                >
                  Lihat Semua
                </a>
              </div>
              <div className="space-y-4">
                {notifikasi.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 opacity-40">
                    <AlertCircle size={48} className="mb-4" />
                    <p className="text-sm font-bold uppercase tracking-widest">
                      Tidak ada notifikasi
                    </p>
                  </div>
                ) : (
                  notifikasi.slice(0, 5).map((notif) => (
                    <div
                      key={notif.id}
                      className="group flex items-start gap-4 p-4 rounded-xl border border-transparent hover:border-blue-100 hover:bg-blue-50/50 transition-all"
                    >
                      <div className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                        <AlertCircle size={18} className="text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-[#0F172A] mb-1">
                          {notif.judul}
                        </p>
                        <p className="text-xs text-[#64748B] leading-relaxed line-clamp-2">
                          {notif.pesan}
                        </p>
                        <p className="text-[10px] font-bold text-[#94A3B8] mt-2 uppercase tracking-tighter">
                          {new Date(notif.created_at).toLocaleDateString(
                            "id-ID",
                            { day: "numeric", month: "short", year: "numeric" },
                          )}
                        </p>
                      </div>
                      {!notif.is_read && (
                        <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-2"></div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-2 h-6 bg-orange-500 rounded-full"></div>
                <h3 className="text-xl font-bold text-[#0F172A]">
                  Menu Cepat
                </h3>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { label: "Tambah Pegawai", icon: Users, href: "/pegawai/tambah" },
                  { label: "Upload SKP", icon: FileText, href: "/skp/upload" },
                  { label: "Ajukan Cuti", icon: Calendar, href: "/cuti/ajukan" },
                  { label: "Upload Dokumen", icon: TrendingUp, href: "/dossier/upload" },
                ].map((action) => (
                  <a
                    key={action.label}
                    href={action.href}
                    className="flex items-center gap-4 p-4 rounded-xl border border-[#E2E8F0] hover:border-blue-600 hover:bg-blue-50 hover:shadow-md transition-all group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-[#64748B] group-hover:bg-white group-hover:text-blue-600 transition-colors">
                      <action.icon size={20} />
                    </div>
                    <span className="text-sm font-bold text-[#334155] group-hover:text-blue-700">{action.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

