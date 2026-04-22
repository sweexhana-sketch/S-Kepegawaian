import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";
import AppLayout from "@/utils/AppLayout";
import { Calendar, Plus, CheckCircle2, Clock, XCircle, AlertCircle } from "lucide-react";

const JENIS_CUTI_LABEL = {
  cuti_tahunan: "Cuti Tahunan",
  cuti_besar: "Cuti Besar",
  cuti_sakit: "Cuti Sakit",
  cuti_melahirkan: "Cuti Melahirkan",
  cuti_alasan_penting: "Cuti Alasan Penting",
  cltn: "CLTN",
  izin: "Izin",
};

const STATUS_CONFIG = {
  menunggu: { label: "Menunggu", className: "bg-[#FEF3C7] text-[#B45309]", icon: Clock },
  disetujui: { label: "Disetujui", className: "bg-[#ECFDF5] text-[#059669]", icon: CheckCircle2 },
  ditolak: { label: "Ditolak", className: "bg-[#FEF2F2] text-[#DC2626]", icon: XCircle },
  dibatalkan: { label: "Dibatalkan", className: "bg-[#F3F4F6] text-[#6B7280]", icon: AlertCircle },
};

export default function CutiPage() {
  const { data: user, loading: userLoading } = useUser();
  const [pegawai, setPegawai] = useState(null);
  const [cutiList, setCutiList] = useState([]);
  const [saldo, setSaldo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    if (!userLoading && !user) { window.location.href = "/account/signin"; return; }
    if (user) fetchProfile();
  }, [user, userLoading]);

  useEffect(() => { if (pegawai) fetchCuti(); }, [pegawai, filterStatus]);

  const fetchProfile = async () => {
    const res = await fetch("/api/pegawai/profile");
    if (res.status === 404) { window.location.href = "/onboarding"; return; }
    if (res.ok) { const d = await res.json(); setPegawai(d.pegawai); }
  };

  const fetchCuti = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterStatus) params.append("status", filterStatus);
      const res = await fetch(`/api/cuti/list?${params}`);
      if (res.ok) { const d = await res.json(); setCutiList(d.cuti || []); setSaldo(d.saldo); }
    } finally { setLoading(false); }
  };

  const handleApproval = async (id, status) => {
    const catatan = status === "ditolak" ? prompt("Alasan penolakan:") : "";
    if (status === "ditolak" && catatan === null) return;
    await fetch(`/api/cuti/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, catatan_atasan: catatan }),
    });
    fetchCuti();
  };

  if (userLoading || !pegawai) return <div className="flex min-h-screen items-center justify-center bg-[#F9FAFB]"><div className="text-sm text-[#6B7280]">Memuat...</div></div>;

  return (
    <AppLayout pegawai={pegawai} activeHref="/cuti">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-[#111827] tracking-tight mb-1">Cuti & Izin</h2>
          <p className="text-sm text-[#6B7280]">Kelola pengajuan cuti dan izin pegawai</p>
        </div>
        <a href="/cuti/ajukan" className="inline-flex items-center gap-2 px-4 py-2 bg-[#2563EB] text-white text-sm font-medium rounded-lg hover:bg-[#1D4ED8] transition-colors">
          <Plus size={16} /> Ajukan Cuti
        </a>
      </div>

      {/* Saldo Cards - hanya untuk pegawai biasa */}
      {pegawai.role === "pegawai" && saldo && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Saldo Tahunan", value: saldo.saldo_tahunan ?? 0, unit: "hari", color: "bg-[#EFF6FF] text-[#2563EB]" },
            { label: "Saldo Besar", value: saldo.saldo_besar ?? 0, unit: "hari", color: "bg-[#F5F3FF] text-[#7C3AED]" },
            { label: "Diambil Tahun Ini", value: saldo.digunakan_tahun_ini ?? 0, unit: "hari", color: "bg-[#FEF3C7] text-[#B45309]" },
            { label: "Tahun", value: saldo.tahun ?? new Date().getFullYear(), unit: "", color: "bg-[#F3F4F6] text-[#374151]" },
          ].map(card => (
            <div key={card.label} className="bg-white rounded-xl border border-[#E5E7EB] p-4">
              <p className="text-xs text-[#6B7280] mb-1">{card.label}</p>
              <p className={`text-2xl font-bold ${card.color.split(" ")[1]}`}>{card.value} <span className="text-sm font-normal text-[#6B7280]">{card.unit}</span></p>
            </div>
          ))}
        </div>
      )}

      {/* Filter */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 mb-6 flex items-center gap-4">
        <label className="text-sm text-[#6B7280]">Status:</label>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]">
          <option value="">Semua Status</option>
          {Object.entries(STATUS_CONFIG).map(([v, c]) => <option key={v} value={v}>{c.label}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
        {loading ? (
          <div className="px-4 py-12 text-center text-sm text-[#6B7280]">Memuat data...</div>
        ) : cutiList.length === 0 ? (
          <div className="px-4 py-16 text-center">
            <div className="w-16 h-16 bg-[#F3F4F6] rounded-full flex items-center justify-center mx-auto mb-4"><Calendar size={32} className="text-[#9CA3AF]" /></div>
            <p className="text-sm font-medium text-[#111827] mb-1">Belum ada pengajuan cuti</p>
            <a href="/cuti/ajukan" className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-[#2563EB] text-white text-sm rounded-lg hover:bg-[#1D4ED8]">
              <Plus size={16} /> Ajukan Cuti Sekarang
            </a>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                  {pegawai.role !== "pegawai" && <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Pegawai</th>}
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Jenis</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Tanggal Mulai</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Selesai</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Hari</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Status</th>
                  {(pegawai.role === "admin" || pegawai.role === "pimpinan") && <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Aksi</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {cutiList.map(c => {
                  const conf = STATUS_CONFIG[c.status] || STATUS_CONFIG.menunggu;
                  const Icon = conf.icon;
                  return (
                    <tr key={c.id} className="hover:bg-[#F9FAFB] transition-colors">
                      {pegawai.role !== "pegawai" && (
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium text-[#111827]">{c.nama_lengkap}</p>
                          <p className="text-xs text-[#6B7280]">{c.jabatan}</p>
                        </td>
                      )}
                      <td className="px-4 py-3 text-sm text-[#111827]">{JENIS_CUTI_LABEL[c.jenis_cuti] || c.jenis_cuti}</td>
                      <td className="px-4 py-3 text-sm text-[#6B7280]">{new Date(c.tanggal_mulai).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</td>
                      <td className="px-4 py-3 text-sm text-[#6B7280]">{new Date(c.tanggal_selesai).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-[#111827]">{c.jumlah_hari} hr</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${conf.className}`}>
                          <Icon size={12} />{conf.label}
                        </span>
                      </td>
                      {(pegawai.role === "admin" || pegawai.role === "pimpinan") && (
                        <td className="px-4 py-3">
                          {c.status === "menunggu" && (
                            <div className="flex gap-2">
                              <button onClick={() => handleApproval(c.id, "disetujui")} className="px-3 py-1 bg-[#059669] text-white text-xs rounded-md hover:bg-[#047857] transition-colors">Setujui</button>
                              <button onClick={() => handleApproval(c.id, "ditolak")} className="px-3 py-1 bg-[#DC2626] text-white text-xs rounded-md hover:bg-[#B91C1C] transition-colors">Tolak</button>
                            </div>
                          )}
                        </td>
                      )}
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
