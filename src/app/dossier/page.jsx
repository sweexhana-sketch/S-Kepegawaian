import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";
import useUpload from "@/utils/useUpload";
import AppLayout from "@/utils/AppLayout";
import { FolderOpen, Upload, FileText, CheckCircle2, Clock, AlertCircle, Search, Trash2, Eye, Plus } from "lucide-react";

const KATEGORI_LIST = ["Identitas", "Kepegawaian", "Pendidikan", "Kompetensi"];
const STATUS_CONFIG = {
  verified: { label: "Terverifikasi", className: "bg-[#ECFDF5] text-[#059669]", icon: CheckCircle2 },
  pending: { label: "Menunggu Verifikasi", className: "bg-[#FEF3C7] text-[#B45309]", icon: Clock },
  rejected: { label: "Ditolak", className: "bg-[#FEF2F2] text-[#DC2626]", icon: AlertCircle },
};

export default function DossierPage() {
  const { data: user, loading: userLoading } = useUser();
  const [pegawai, setPegawai] = useState(null);
  const [dokumen, setDokumen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterKategori, setFilterKategori] = useState("");

  useEffect(() => {
    if (!userLoading && !user) { window.location.href = "/account/signin"; return; }
    if (user) fetchProfile();
  }, [user, userLoading]);

  useEffect(() => { if (pegawai) fetchDokumen(); }, [pegawai, filterKategori]);

  const fetchProfile = async () => {
    const res = await fetch("/api/pegawai/profile");
    if (res.status === 404) { window.location.href = "/onboarding"; return; }
    if (res.ok) { const d = await res.json(); setPegawai(d.pegawai); }
  };

  const fetchDokumen = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterKategori) params.append("kategori", filterKategori);
      const res = await fetch(`/api/dossier/list?${params}`);
      if (res.ok) { const d = await res.json(); setDokumen(d.dokumen || []); }
    } finally { setLoading(false); }
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

  if (userLoading || !pegawai) return <div className="flex min-h-screen items-center justify-center bg-[#F9FAFB]"><div className="text-sm text-[#6B7280]">Memuat...</div></div>;

  return (
    <AppLayout pegawai={pegawai} activeHref="/dossier">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-[#111827] tracking-tight mb-1">Digital Dossier</h2>
          <p className="text-sm text-[#6B7280]">Arsip digital dokumen kepegawaian</p>
        </div>
        <a href="/dossier/upload" className="inline-flex items-center gap-2 px-4 py-2 bg-[#2563EB] text-white text-sm font-medium rounded-lg hover:bg-[#1D4ED8] transition-colors">
          <Upload size={16} /> Upload Dokumen
        </a>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Dokumen", value: stats.total, className: "bg-[#EFF6FF] text-[#2563EB]" },
          { label: "Terverifikasi", value: stats.verified, className: "bg-[#ECFDF5] text-[#059669]" },
          { label: "Menunggu", value: stats.pending, className: "bg-[#FEF3C7] text-[#B45309]" },
          { label: "Ditolak", value: stats.rejected, className: "bg-[#FEF2F2] text-[#DC2626]" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-[#E5E7EB] p-4">
            <p className="text-xs text-[#6B7280] mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.className.split(" ")[1]}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 mb-6 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
          <input type="text" placeholder="Cari dokumen..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]" />
        </div>
        <select value={filterKategori} onChange={e => setFilterKategori(e.target.value)} className="px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]">
          <option value="">Semua Kategori</option>
          {KATEGORI_LIST.map(k => <option key={k} value={k}>{k}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
        {loading ? (
          <div className="px-4 py-12 text-center text-sm text-[#6B7280]">Memuat dokumen...</div>
        ) : filtered.length === 0 ? (
          <div className="px-4 py-16 text-center">
            <div className="w-16 h-16 bg-[#F3F4F6] rounded-full flex items-center justify-center mx-auto mb-4"><FolderOpen size={32} className="text-[#9CA3AF]" /></div>
            <p className="text-sm font-medium text-[#111827] mb-1">{search || filterKategori ? "Dokumen tidak ditemukan" : "Belum ada dokumen"}</p>
            {!search && !filterKategori && (
              <a href="/dossier/upload" className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-[#2563EB] text-white text-sm rounded-lg hover:bg-[#1D4ED8]">
                <Upload size={16} /> Upload Dokumen Pertama
              </a>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                  {pegawai.role === "admin" && <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Pegawai</th>}
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Dokumen</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Kategori</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Tgl Upload</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {filtered.map(doc => {
                  const conf = STATUS_CONFIG[doc.status] || STATUS_CONFIG.pending;
                  const Icon = conf.icon;
                  return (
                    <tr key={doc.id} className="hover:bg-[#F9FAFB] transition-colors group">
                      {pegawai.role === "admin" && (
                        <td className="px-4 py-3 text-sm text-[#111827]">{doc.nama_lengkap}<br /><span className="text-xs text-[#6B7280] font-mono">{doc.nip}</span></td>
                      )}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 bg-[#EFF6FF] rounded-lg flex items-center justify-center flex-shrink-0">
                            <FileText size={16} className="text-[#2563EB]" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[#111827]">{doc.jenis_dokumen}</p>
                            {doc.deskripsi && <p className="text-xs text-[#6B7280] line-clamp-1">{doc.deskripsi}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2.5 py-1 bg-[#F3F4F6] text-[#374151] text-xs rounded-full">{doc.kategori}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-[#6B7280]">
                        {new Date(doc.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${conf.className}`}>
                          <Icon size={12} />{conf.label}
                        </span>
                        {doc.status === "rejected" && doc.catatan && (
                          <p className="text-[10px] text-[#DC2626] mt-1 max-w-[120px] line-clamp-1">{doc.catatan}</p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {doc.file_url && (
                            <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="p-1.5 hover:bg-[#EFF6FF] rounded transition-colors" title="Lihat"><Eye size={16} className="text-[#6B7280]" /></a>
                          )}
                          <button onClick={() => handleDelete(doc.id)} className="p-1.5 hover:bg-[#FEF2F2] rounded transition-colors" title="Hapus">
                            <Trash2 size={16} className="text-[#6B7280] hover:text-[#DC2626]" />
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
    </AppLayout>
  );
}
