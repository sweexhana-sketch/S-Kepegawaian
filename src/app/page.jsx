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
} from "lucide-react";

export default function DashboardPage() {
  const { data: user, loading: userLoading } = useUser();
  const [pegawai, setPegawai] = useState(null);
  const [stats, setStats] = useState(null);
  const [notifikasi, setNotifikasi] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userLoading && !user) {
      if (typeof window !== "undefined") {
        window.location.href = "/account/signin";
      }
      return;
    }

    if (user) {
      fetchDashboardData();
    }
  }, [user, userLoading]);

  const fetchDashboardData = async () => {
    try {
      const [profileRes, statsRes, notifRes] = await Promise.all([
        fetch("/api/pegawai/profile"),
        fetch("/api/dashboard/stats"),
        fetch("/api/notifikasi/list"),
      ]);

      if (profileRes.status === 404) {
        if (typeof window !== "undefined") {
          window.location.href = "/onboarding";
        }
        return;
      }

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
      <div className="flex min-h-screen items-center justify-center bg-[#F9FAFB]">
        <div className="text-sm text-[#6B7280]">Memuat...</div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#F9FAFB]"
      style={{ fontFamily: "Inter, -apple-system, sans-serif" }}
    >
      {/* Header */}
      <div className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src="https://ucarecdn.com/f5ae1e2c-7229-43a4-a8ad-ae05a4f4cac4/-/format/auto/"
                alt="Logo"
                className="h-12 w-12 object-contain"
              />
              <div>
                <h1 className="text-lg font-semibold text-[#111827] tracking-tight">
                  S-Kepegawaian
                </h1>
                <p className="text-xs text-[#6B7280]">
                  Dinas PUPR Papua Barat Daya
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-[#F9FAFB] rounded-lg transition-colors">
                <Bell size={20} className="text-[#6B7280]" />
                {notifikasi.filter((n) => !n.is_read).length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-[#EA580C] rounded-full"></span>
                )}
              </button>
              <div className="flex items-center gap-3 pl-4 border-l border-[#E5E7EB]">
                <div className="text-right">
                  <p className="text-sm font-medium text-[#111827]">
                    {pegawai?.nama_lengkap || user?.name}
                  </p>
                  <p className="text-xs text-[#6B7280]">
                    {pegawai?.role === "admin"
                      ? "Administrator"
                      : pegawai?.role === "pimpinan"
                        ? "Pimpinan"
                        : "Pegawai"}
                  </p>
                </div>
                <a
                  href="/account/logout"
                  className="text-xs text-[#6B7280] hover:text-[#2563EB]"
                >
                  Keluar
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex gap-8">
            <a
              href="/"
              className="py-3 border-b-2 border-[#2563EB] text-sm font-medium text-[#111827] -mb-[1px]"
            >
              Dashboard
            </a>
            <a
              href="/pegawai"
              className="py-3 border-b-2 border-transparent text-sm text-[#6B7280] hover:text-[#111827] -mb-[1px]"
            >
              Data Pegawai
            </a>
            <a
              href="/skp"
              className="py-3 border-b-2 border-transparent text-sm text-[#6B7280] hover:text-[#111827] -mb-[1px]"
            >
              SKP
            </a>
            <a
              href="/kgb"
              className="py-3 border-b-2 border-transparent text-sm text-[#6B7280] hover:text-[#111827] -mb-[1px]"
            >
              KGB
            </a>
            <a
              href="/kenaikan-pangkat"
              className="py-3 border-b-2 border-transparent text-sm text-[#6B7280] hover:text-[#111827] -mb-[1px]"
            >
              Kenaikan Pangkat
            </a>
            <a
              href="/cuti"
              className="py-3 border-b-2 border-transparent text-sm text-[#6B7280] hover:text-[#111827] -mb-[1px]"
            >
              Cuti & Izin
            </a>
            <a
              href="/dossier"
              className="py-3 border-b-2 border-transparent text-sm text-[#6B7280] hover:text-[#111827] -mb-[1px]"
            >
              Digital Dossier
            </a>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-[#111827] tracking-tight mb-1">
            Selamat Datang, {pegawai?.nama_lengkap?.split(" ")[0] || user?.name}
          </h2>
          <p className="text-sm text-[#6B7280]">
            {pegawai?.jabatan} · {pegawai?.unit_kerja}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] flex items-center justify-center">
                <Users size={20} className="text-[#2563EB]" />
              </div>
            </div>
            <p className="text-xs text-[#6B7280] mb-1">Total Pegawai</p>
            <p className="text-2xl font-semibold text-[#111827]">
              {stats?.totalPegawai || 0}
            </p>
          </div>

          <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#FEF3C7] flex items-center justify-center">
                <Calendar size={20} className="text-[#EA580C]" />
              </div>
            </div>
            <p className="text-xs text-[#6B7280] mb-1">KGB Bulan Ini</p>
            <p className="text-2xl font-semibold text-[#111827]">
              {stats?.kgbBulanIni || 0}
            </p>
          </div>

          <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#ECFDF5] flex items-center justify-center">
                <Award size={20} className="text-[#059669]" />
              </div>
            </div>
            <p className="text-xs text-[#6B7280] mb-1">
              Usulan Kenaikan Pangkat
            </p>
            <p className="text-2xl font-semibold text-[#111827]">
              {stats?.usulanKP || 0}
            </p>
          </div>

          <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#FEF2F2] flex items-center justify-center">
                <FileText size={20} className="text-[#DC2626]" />
              </div>
            </div>
            <p className="text-xs text-[#6B7280] mb-1">SKP Belum Disubmit</p>
            <p className="text-2xl font-semibold text-[#111827]">
              {stats?.skpBelumSubmit || 0}
            </p>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Notifikasi */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-semibold text-[#111827]">
                  Notifikasi & Pengingat
                </h3>
                <a
                  href="/notifikasi"
                  className="text-xs text-[#2563EB] hover:text-[#1D4ED8]"
                >
                  Lihat Semua
                </a>
              </div>
              <div className="space-y-3">
                {notifikasi.length === 0 ? (
                  <p className="text-sm text-[#6B7280] text-center py-8">
                    Tidak ada notifikasi
                  </p>
                ) : (
                  notifikasi.slice(0, 5).map((notif) => (
                    <div
                      key={notif.id}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-[#F9FAFB] transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#EFF6FF] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <AlertCircle size={16} className="text-[#2563EB]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#111827] mb-0.5">
                          {notif.judul}
                        </p>
                        <p className="text-xs text-[#6B7280] line-clamp-2">
                          {notif.pesan}
                        </p>
                        <p className="text-xs text-[#6B7280] mt-1">
                          {new Date(notif.created_at).toLocaleDateString(
                            "id-ID",
                            { day: "numeric", month: "short", year: "numeric" },
                          )}
                        </p>
                      </div>
                      {!notif.is_read && (
                        <div className="w-2 h-2 rounded-full bg-[#2563EB] flex-shrink-0 mt-2"></div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
              <h3 className="text-base font-semibold text-[#111827] mb-5">
                Menu Cepat
              </h3>
              <div className="space-y-2">
                <a
                  href="/pegawai/tambah"
                  className="flex items-center gap-3 p-3 rounded-lg border border-[#E5E7EB] hover:border-[#2563EB] hover:bg-[#EFF6FF] transition-all"
                >
                  <Users size={18} className="text-[#6B7280]" />
                  <span className="text-sm text-[#111827]">Tambah Pegawai</span>
                </a>
                <a
                  href="/skp/upload"
                  className="flex items-center gap-3 p-3 rounded-lg border border-[#E5E7EB] hover:border-[#2563EB] hover:bg-[#EFF6FF] transition-all"
                >
                  <FileText size={18} className="text-[#6B7280]" />
                  <span className="text-sm text-[#111827]">Upload SKP</span>
                </a>
                <a
                  href="/cuti/ajukan"
                  className="flex items-center gap-3 p-3 rounded-lg border border-[#E5E7EB] hover:border-[#2563EB] hover:bg-[#EFF6FF] transition-all"
                >
                  <Calendar size={18} className="text-[#6B7280]" />
                  <span className="text-sm text-[#111827]">Ajukan Cuti</span>
                </a>
                <a
                  href="/dossier/upload"
                  className="flex items-center gap-3 p-3 rounded-lg border border-[#E5E7EB] hover:border-[#2563EB] hover:bg-[#EFF6FF] transition-all"
                >
                  <TrendingUp size={18} className="text-[#6B7280]" />
                  <span className="text-sm text-[#111827]">Upload Dokumen</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
