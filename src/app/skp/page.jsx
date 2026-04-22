import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";
import AppLayout from "@/utils/AppLayout";
import { FileText, Plus, Upload, CheckCircle2, Clock, AlertCircle, Eye, ChevronRight } from "lucide-react";

const STATUS_CONFIG = {
  draft: { label: "Draft", className: "bg-[#F3F4F6] text-[#6B7280]", icon: Clock },
  submitted: { label: "Diajukan", className: "bg-[#EFF6FF] text-[#2563EB]", icon: Clock },
  dinilai: { label: "Dinilai", className: "bg-[#ECFDF5] text-[#059669]", icon: CheckCircle2 },
  revisi: { label: "Perlu Revisi", className: "bg-[#FEF2F2] text-[#DC2626]", icon: AlertCircle },
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
    if (!userLoading && !user) { window.location.href = "/account/signin"; return; }
    if (user) fetchProfile();
  }, [user, userLoading]);

  useEffect(() => { if (pegawai) fetchSKP(); }, [pegawai, tahun, filterStatus]);

  const fetchProfile = async () => {
    const res = await fetch("/api/pegawai/profile");
    if (res.status === 404) { window.location.href = "/onboarding"; return; }
    if (res.ok) { const d = await res.json(); setPegawai(d.pegawai); }
  };

  const fetchSKP = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ tahun });
      if (filterStatus) params.append("status", filterStatus);
      const res = await fetch(`/api/skp/list?${params}`);
      if (res.ok) { const d = await res.json(); setSkpList(d.skp || []); }
    } finally { setLoading(false); }
  };

  const handleSubmit = async (id) => {
    await fetch(`/api/skp/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "submitted" }) });
    fetchSKP();
  };

  if (userLoading || !pegawai) return <div className="flex min-h-screen items-center justify-center bg-[#F9FAFB]"><div className="text-sm text-[#6B7280]">Memuat...</div></div>;

  const periodeLabels = { semester1: "Semester I", semester2: "Semester II", tahunan: "Tahunan" };

  return (
    <AppLayout pegawai={pegawai} activeHref="/skp">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-[#111827] tracking-tight mb-1">Sasaran Kinerja Pegawai (SKP)</h2>
          <p className="text-sm text-[#6B7280]">Upload dan pantau penilaian kinerja Anda</p>
        </div>
        <a href="/skp/upload" className="inline-flex items-center gap-2 px-4 py-2 bg-[#2563EB] text-white text-sm font-medium rounded-lg hover:bg-[#1D4ED8] transition-colors">
          <Upload size={16} /> Upload SKP
        </a>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm text-[#6B7280]">Tahun:</label>
          <select value={tahun} onChange={e => setTahun(e.target.value)} className="px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]">
            {TAHUN_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-[#6B7280]">Status:</label>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]">
            <option value="">Semua Status</option>
            {Object.entries(STATUS_CONFIG).map(([v, c]) => <option key={v} value={v}>{c.label}</option>)}
          </select>
        </div>
      </div>

      {/* SKP Cards / Table */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
        {loading ? (
          <div className="px-4 py-12 text-center text-sm text-[#6B7280]">Memuat data SKP...</div>
        ) : skpList.length === 0 ? (
          <div className="px-4 py-16 text-center">
            <div className="w-16 h-16 bg-[#F3F4F6] rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText size={32} className="text-[#9CA3AF]" />
            </div>
            <p className="text-sm font-medium text-[#111827] mb-1">Belum ada data SKP untuk tahun {tahun}</p>
            <p className="text-xs text-[#6B7280] mb-4">Upload SKP Anda untuk memulai</p>
            <a href="/skp/upload" className="inline-flex items-center gap-2 px-4 py-2 bg-[#2563EB] text-white text-sm rounded-lg hover:bg-[#1D4ED8]">
              <Upload size={16} /> Upload SKP Sekarang
            </a>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                  {pegawai.role !== "pegawai" && <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Pegawai</th>}
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Periode</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Tahun</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Target</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Nilai Akhir</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {skpList.map(skp => {
                  const conf = STATUS_CONFIG[skp.status] || STATUS_CONFIG.draft;
                  const Icon = conf.icon;
                  return (
                    <tr key={skp.id} className="hover:bg-[#F9FAFB] transition-colors">
                      {pegawai.role !== "pegawai" && (
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium text-[#111827]">{skp.nama_lengkap}</p>
                          <p className="text-xs text-[#6B7280] font-mono">{skp.nip}</p>
                        </td>
                      )}
                      <td className="px-4 py-3 text-sm text-[#111827]">{periodeLabels[skp.periode] || skp.periode}</td>
                      <td className="px-4 py-3 text-sm text-[#111827]">{skp.tahun}</td>
                      <td className="px-4 py-3 text-sm text-[#6B7280]">{skp.target_nilai ?? "-"}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-[#111827]">{skp.nilai_akhir ?? "-"}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${conf.className}`}>
                          <Icon size={12} /> {conf.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {skp.dokumen_url && (
                            <a href={skp.dokumen_url} target="_blank" rel="noopener noreferrer" className="p-1.5 hover:bg-[#EFF6FF] rounded transition-colors" title="Lihat Dokumen">
                              <Eye size={16} className="text-[#6B7280]" />
                            </a>
                          )}
                          {skp.status === "draft" && pegawai.role === "pegawai" && (
                            <button onClick={() => handleSubmit(skp.id)} className="px-3 py-1 bg-[#2563EB] text-white text-xs rounded-md hover:bg-[#1D4ED8] transition-colors">
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
    </AppLayout>
  );
}
