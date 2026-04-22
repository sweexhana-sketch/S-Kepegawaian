import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  FileText,
} from "lucide-react";

export default function DetailPegawaiPage({ params }) {
  const { data: user, loading: userLoading } = useUser();
  const [currentPegawai, setCurrentPegawai] = useState(null);
  const [detailPegawai, setDetailPegawai] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userLoading && !user) {
      if (typeof window !== "undefined") {
        window.location.href = "/account/signin";
      }
      return;
    }

    if (user) {
      fetchData();
    }
  }, [user, userLoading, params.id]);

  const fetchData = async () => {
    try {
      const [profileRes, detailRes] = await Promise.all([
        fetch("/api/pegawai/profile"),
        fetch(`/api/pegawai/${params.id}`),
      ]);

      if (profileRes.status === 404) {
        if (typeof window !== "undefined") {
          window.location.href = "/onboarding";
        }
        return;
      }

      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setCurrentPegawai(profileData.pegawai);
      }

      if (detailRes.ok) {
        const detailData = await detailRes.json();
        setDetailPegawai(detailData.pegawai);
      } else {
        setError("Pegawai tidak ditemukan");
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (userLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F9FAFB]">
        <div className="text-sm text-[#6B7280]">Memuat...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F9FAFB]">
        <div className="text-center">
          <p className="text-sm text-red-600 mb-4">{error}</p>
          <a
            href="/pegawai"
            className="text-sm text-[#2563EB] hover:text-[#1D4ED8]"
          >
            Kembali ke Daftar Pegawai
          </a>
        </div>
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
            <div className="flex items-center gap-3 pl-4 border-l border-[#E5E7EB]">
              <div className="text-right">
                <p className="text-sm font-medium text-[#111827]">
                  {currentPegawai?.nama_lengkap}
                </p>
                <p className="text-xs text-[#6B7280]">
                  {currentPegawai?.role === "admin"
                    ? "Administrator"
                    : currentPegawai?.role === "pimpinan"
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

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Back Button */}
        <a
          href="/pegawai"
          className="inline-flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#111827] mb-6"
        >
          <ArrowLeft size={16} />
          Kembali ke Daftar Pegawai
        </a>

        {/* Profile Header */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 rounded-full bg-[#EFF6FF] flex items-center justify-center text-3xl font-semibold text-[#2563EB]">
                {detailPegawai?.nama_lengkap?.charAt(0)}
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-[#111827] mb-1">
                  {detailPegawai?.nama_lengkap}
                </h2>
                <p className="text-sm text-[#6B7280] mb-3">
                  NIP: {detailPegawai?.nip}
                </p>
                <div className="flex items-center gap-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      detailPegawai?.status_pegawai === "PNS"
                        ? "bg-[#ECFDF5] text-[#059669]"
                        : detailPegawai?.status_pegawai === "CPNS"
                          ? "bg-[#FEF3C7] text-[#EA580C]"
                          : "bg-[#F3F4F6] text-[#6B7280]"
                    }`}
                  >
                    {detailPegawai?.status_pegawai}
                  </span>
                  <span className="text-sm text-[#6B7280]">
                    {detailPegawai?.pangkat} ({detailPegawai?.golongan})
                  </span>
                </div>
              </div>
            </div>
            {currentPegawai?.role === "admin" && (
              <a
                href={`/pegawai/${params.id}/edit`}
                className="inline-flex items-center gap-2 px-4 py-2 border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#111827] hover:bg-[#F9FAFB] transition-colors"
              >
                <Edit size={16} />
                Edit Data
              </a>
            )}
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-[#E5E7EB]">
            <div className="flex items-center gap-3">
              <Briefcase size={18} className="text-[#6B7280]" />
              <div>
                <p className="text-xs text-[#6B7280]">Jabatan</p>
                <p className="text-sm font-medium text-[#111827]">
                  {detailPegawai?.jabatan || "-"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin size={18} className="text-[#6B7280]" />
              <div>
                <p className="text-xs text-[#6B7280]">Unit Kerja</p>
                <p className="text-sm font-medium text-[#111827]">
                  {detailPegawai?.unit_kerja || "-"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <GraduationCap size={18} className="text-[#6B7280]" />
              <div>
                <p className="text-xs text-[#6B7280]">Pendidikan</p>
                <p className="text-sm font-medium text-[#111827]">
                  {detailPegawai?.pendidikan_terakhir || "-"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Data Pribadi */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
            <h3 className="text-base font-semibold text-[#111827] mb-4 pb-3 border-b border-[#E5E7EB]">
              Data Pribadi
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-[#6B7280] mb-1">
                  Tempat, Tanggal Lahir
                </p>
                <p className="text-sm text-[#111827]">
                  {detailPegawai?.tempat_lahir || "-"},{" "}
                  {formatDate(detailPegawai?.tanggal_lahir)}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#6B7280] mb-1">Jenis Kelamin</p>
                <p className="text-sm text-[#111827]">
                  {detailPegawai?.jenis_kelamin || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#6B7280] mb-1">Agama</p>
                <p className="text-sm text-[#111827]">
                  {detailPegawai?.agama || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#6B7280] mb-1">Status Pernikahan</p>
                <p className="text-sm text-[#111827]">
                  {detailPegawai?.status_pernikahan || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#6B7280] mb-1">Alamat</p>
                <p className="text-sm text-[#111827]">
                  {detailPegawai?.alamat || "-"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-[#6B7280]" />
                <p className="text-sm text-[#111827]">
                  {detailPegawai?.no_telepon || "-"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-[#6B7280]" />
                <p className="text-sm text-[#111827]">
                  {detailPegawai?.email || "-"}
                </p>
              </div>
            </div>
          </div>

          {/* Data Kepegawaian */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
            <h3 className="text-base font-semibold text-[#111827] mb-4 pb-3 border-b border-[#E5E7EB]">
              Data Kepegawaian
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-[#6B7280] mb-1">Status Pegawai</p>
                <p className="text-sm text-[#111827]">
                  {detailPegawai?.status_pegawai || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#6B7280] mb-1">
                  Pangkat / Golongan
                </p>
                <p className="text-sm text-[#111827]">
                  {detailPegawai?.pangkat || "-"} /{" "}
                  {detailPegawai?.golongan || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#6B7280] mb-1">TMT CPNS</p>
                <p className="text-sm text-[#111827]">
                  {formatDate(detailPegawai?.tmt_cpns)}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#6B7280] mb-1">TMT PNS</p>
                <p className="text-sm text-[#111827]">
                  {formatDate(detailPegawai?.tmt_pns)}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#6B7280] mb-1">
                  TMT Pangkat Terakhir
                </p>
                <p className="text-sm text-[#111827]">
                  {formatDate(detailPegawai?.tmt_pangkat_terakhir)}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#6B7280] mb-1">TMT Jabatan</p>
                <p className="text-sm text-[#111827]">
                  {formatDate(detailPegawai?.tmt_jabatan)}
                </p>
              </div>
            </div>
          </div>

          {/* Data Pendidikan */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
            <h3 className="text-base font-semibold text-[#111827] mb-4 pb-3 border-b border-[#E5E7EB]">
              Data Pendidikan
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-[#6B7280] mb-1">
                  Pendidikan Terakhir
                </p>
                <p className="text-sm text-[#111827]">
                  {detailPegawai?.pendidikan_terakhir || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#6B7280] mb-1">Jurusan</p>
                <p className="text-sm text-[#111827]">
                  {detailPegawai?.jurusan || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#6B7280] mb-1">Nama Institusi</p>
                <p className="text-sm text-[#111827]">
                  {detailPegawai?.nama_institusi || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#6B7280] mb-1">Tahun Lulus</p>
                <p className="text-sm text-[#111827]">
                  {detailPegawai?.tahun_lulus || "-"}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
            <h3 className="text-base font-semibold text-[#111827] mb-4 pb-3 border-b border-[#E5E7EB]">
              Akses Cepat
            </h3>
            <div className="space-y-2">
              <a
                href={`/skp?pegawai=${params.id}`}
                className="flex items-center gap-3 p-3 rounded-lg border border-[#E5E7EB] hover:border-[#2563EB] hover:bg-[#EFF6FF] transition-all"
              >
                <FileText size={18} className="text-[#6B7280]" />
                <span className="text-sm text-[#111827]">Lihat SKP</span>
              </a>
              <a
                href={`/kgb?pegawai=${params.id}`}
                className="flex items-center gap-3 p-3 rounded-lg border border-[#E5E7EB] hover:border-[#2563EB] hover:bg-[#EFF6FF] transition-all"
              >
                <Calendar size={18} className="text-[#6B7280]" />
                <span className="text-sm text-[#111827]">Riwayat KGB</span>
              </a>
              <a
                href={`/kenaikan-pangkat?pegawai=${params.id}`}
                className="flex items-center gap-3 p-3 rounded-lg border border-[#E5E7EB] hover:border-[#2563EB] hover:bg-[#EFF6FF] transition-all"
              >
                <Briefcase size={18} className="text-[#6B7280]" />
                <span className="text-sm text-[#111827]">
                  Riwayat Kenaikan Pangkat
                </span>
              </a>
              <a
                href={`/dossier?pegawai=${params.id}`}
                className="flex items-center gap-3 p-3 rounded-lg border border-[#E5E7EB] hover:border-[#2563EB] hover:bg-[#EFF6FF] transition-all"
              >
                <FileText size={18} className="text-[#6B7280]" />
                <span className="text-sm text-[#111827]">Lihat Dossier</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
