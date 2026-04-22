import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  Download,
  Users,
} from "lucide-react";

export default function PegawaiPage() {
  const { data: user, loading: userLoading } = useUser();
  const [pegawai, setPegawai] = useState(null);
  const [pegawaiList, setPegawaiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!userLoading && !user) {
      if (typeof window !== "undefined") {
        window.location.href = "/account/signin";
      }
      return;
    }

    if (user) {
      fetchProfile();
    }
  }, [user, userLoading]);

  useEffect(() => {
    if (pegawai) {
      fetchPegawaiList();
    }
  }, [pegawai, search, filterStatus]);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/pegawai/profile");
      if (res.status === 404) {
        if (typeof window !== "undefined") {
          window.location.href = "/onboarding";
        }
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setPegawai(data.pegawai);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  const fetchPegawaiList = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (filterStatus) params.append("status", filterStatus);

      const res = await fetch(`/api/pegawai/list?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setPegawaiList(data.pegawai || []);
        setTotal(data.total || 0);
      }
    } catch (err) {
      console.error("Error fetching pegawai list:", err);
    } finally {
      setLoading(false);
    }
  };

  if (userLoading || !pegawai) {
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
            <div className="flex items-center gap-3 pl-4 border-l border-[#E5E7EB]">
              <div className="text-right">
                <p className="text-sm font-medium text-[#111827]">
                  {pegawai?.nama_lengkap}
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

      {/* Navigation */}
      <div className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex gap-8">
            <a
              href="/"
              className="py-3 border-b-2 border-transparent text-sm text-[#6B7280] hover:text-[#111827] -mb-[1px]"
            >
              Dashboard
            </a>
            <a
              href="/pegawai"
              className="py-3 border-b-2 border-[#2563EB] text-sm font-medium text-[#111827] -mb-[1px]"
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
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-[#111827] tracking-tight mb-1">
              Data Pegawai
            </h2>
            <p className="text-sm text-[#6B7280]">Kelola data kepegawaian</p>
          </div>
          {pegawai?.role === "admin" && (
            <a
              href="/pegawai/tambah"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#2563EB] text-white text-sm font-medium rounded-lg hover:bg-[#1D4ED8] transition-colors"
            >
              <Plus size={18} />
              Tambah Pegawai
            </a>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]"
              />
              <input
                type="text"
                placeholder="Cari nama atau NIP..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
            >
              <option value="">Semua Status</option>
              <option value="PNS">PNS</option>
              <option value="CPNS">CPNS</option>
              <option value="PPPK">PPPK</option>
            </select>
            <button className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] hover:bg-[#F9FAFB] transition-colors">
              <Download size={18} />
              Export Excel
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] flex items-center justify-center">
                <Users size={20} className="text-[#2563EB]" />
              </div>
              <div>
                <p className="text-xs text-[#6B7280]">Total Pegawai</p>
                <p className="text-xl font-semibold text-[#111827]">{total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#ECFDF5] flex items-center justify-center">
                <Users size={20} className="text-[#059669]" />
              </div>
              <div>
                <p className="text-xs text-[#6B7280]">PNS</p>
                <p className="text-xl font-semibold text-[#111827]">
                  {pegawaiList.filter((p) => p.status_pegawai === "PNS").length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#FEF3C7] flex items-center justify-center">
                <Users size={20} className="text-[#EA580C]" />
              </div>
              <div>
                <p className="text-xs text-[#6B7280]">CPNS</p>
                <p className="text-xl font-semibold text-[#111827]">
                  {
                    pegawaiList.filter((p) => p.status_pegawai === "CPNS")
                      .length
                  }
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#F3F4F6] flex items-center justify-center">
                <Users size={20} className="text-[#6B7280]" />
              </div>
              <div>
                <p className="text-xs text-[#6B7280]">PPPK</p>
                <p className="text-xl font-semibold text-[#111827]">
                  {
                    pegawaiList.filter((p) => p.status_pegawai === "PPPK")
                      .length
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                    NIP
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                    Nama
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                    Jabatan
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                    Unit Kerja
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                    Pangkat/Gol
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {loading ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-4 py-8 text-center text-sm text-[#6B7280]"
                    >
                      Memuat data...
                    </td>
                  </tr>
                ) : pegawaiList.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-4 py-8 text-center text-sm text-[#6B7280]"
                    >
                      Tidak ada data pegawai
                    </td>
                  </tr>
                ) : (
                  pegawaiList.map((p) => (
                    <tr
                      key={p.id}
                      className="hover:bg-[#F9FAFB] transition-colors"
                    >
                      <td className="px-4 py-3 text-sm text-[#111827] font-mono">
                        {p.nip}
                      </td>
                      <td className="px-4 py-3 text-sm text-[#111827] font-medium">
                        {p.nama_lengkap}
                      </td>
                      <td className="px-4 py-3 text-sm text-[#6B7280]">
                        {p.jabatan || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-[#6B7280]">
                        {p.unit_kerja || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-[#6B7280]">
                        {p.pangkat && p.golongan
                          ? `${p.pangkat} (${p.golongan})`
                          : "-"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            p.status_pegawai === "PNS"
                              ? "bg-[#ECFDF5] text-[#059669]"
                              : p.status_pegawai === "CPNS"
                                ? "bg-[#FEF3C7] text-[#EA580C]"
                                : "bg-[#F3F4F6] text-[#6B7280]"
                          }`}
                        >
                          {p.status_pegawai}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <a
                            href={`/pegawai/${p.id}`}
                            className="p-1.5 hover:bg-[#EFF6FF] rounded transition-colors"
                            title="Lihat Detail"
                          >
                            <Eye size={16} className="text-[#6B7280]" />
                          </a>
                          {pegawai?.role === "admin" && (
                            <>
                              <a
                                href={`/pegawai/${p.id}/edit`}
                                className="p-1.5 hover:bg-[#EFF6FF] rounded transition-colors"
                                title="Edit"
                              >
                                <Edit size={16} className="text-[#6B7280]" />
                              </a>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
