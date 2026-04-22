import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";
import AppLayout from "@/utils/AppLayout";
import { ArrowLeft, Check, X, Loader2, Info, Calendar } from "lucide-react";

const JENIS_CUTI = [
  { value: "cuti_tahunan", label: "Cuti Tahunan" },
  { value: "cuti_besar", label: "Cuti Besar" },
  { value: "cuti_sakit", label: "Cuti Sakit" },
  { value: "cuti_melahirkan", label: "Cuti Melahirkan" },
  { value: "cuti_alasan_penting", label: "Cuti Alasan Penting" },
  { value: "cltn", label: "Cuti di Luar Tanggungan Negara (CLTN)" },
  { value: "izin", label: "Izin" },
];

export default function CutiAjukanPage() {
  const { data: user, loading: userLoading } = useUser();
  const [pegawai, setPegawai] = useState(null);
  const [saldo, setSaldo] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    jenis_cuti: "", tanggal_mulai: "", tanggal_selesai: "",
    alasan: "", alamat_selama_cuti: "", telepon_selama_cuti: "",
  });

  const jumlahHari = form.tanggal_mulai && form.tanggal_selesai
    ? Math.ceil((new Date(form.tanggal_selesai) - new Date(form.tanggal_mulai)) / (1000 * 60 * 60 * 24)) + 1
    : 0;

  useEffect(() => {
    if (!userLoading && !user) { window.location.href = "/account/signin"; return; }
    if (user) fetchProfile();
  }, [user, userLoading]);

  const fetchProfile = async () => {
    const res = await fetch("/api/pegawai/profile");
    if (res.status === 404) { window.location.href = "/onboarding"; return; }
    if (res.ok) {
      const d = await res.json(); setPegawai(d.pegawai);
      const saldoRes = await fetch("/api/cuti/list");
      if (saldoRes.ok) { const sd = await saldoRes.json(); setSaldo(sd.saldo); }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (jumlahHari <= 0) { setError("Tanggal tidak valid"); return; }
    setSubmitting(true); setError("");
    try {
      const res = await fetch("/api/cuti/create", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mengajukan cuti");
      setSuccess(true);
      setTimeout(() => { window.location.href = "/cuti"; }, 2000);
    } catch (err) { setError(err.message); } finally { setSubmitting(false); }
  };

  if (userLoading || !pegawai) return <div className="flex min-h-screen items-center justify-center bg-[#F9FAFB]"><div className="text-sm text-[#6B7280]">Memuat...</div></div>;

  return (
    <AppLayout pegawai={pegawai} activeHref="/cuti">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <a href="/cuti" className="p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors"><ArrowLeft size={20} className="text-[#6B7280]" /></a>
          <div>
            <h2 className="text-2xl font-semibold text-[#111827] tracking-tight">Formulir Pengajuan Cuti</h2>
            <p className="text-sm text-[#6B7280]">Isi formulir pengajuan cuti atau izin</p>
          </div>
        </div>

        {success && <div className="mb-6 p-4 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl flex items-center gap-3"><Check size={20} className="text-[#059669]" /><p className="text-sm text-[#059669] font-medium">Cuti berhasil diajukan! Menunggu persetujuan atasan.</p></div>}
        {error && <div className="mb-6 p-4 bg-[#FEF2F2] border border-[#FECACA] rounded-xl flex items-center gap-3"><X size={20} className="text-[#DC2626]" /><p className="text-sm text-[#DC2626]">{error}</p></div>}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-5">
          {/* Saldo Info */}
          {saldo && (
            <div className="flex items-center gap-3 p-3 bg-[#EFF6FF] rounded-lg">
              <Info size={16} className="text-[#2563EB] flex-shrink-0" />
              <p className="text-sm text-[#1D4ED8]">
                Saldo cuti tahunan Anda: <strong>{saldo.saldo_tahunan ?? 0} hari</strong>
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">Jenis Cuti <span className="text-[#DC2626]">*</span></label>
            <select required value={form.jenis_cuti} onChange={e => setForm(f => ({ ...f, jenis_cuti: e.target.value }))}
              className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]">
              <option value="">Pilih jenis cuti...</option>
              {JENIS_CUTI.map(j => <option key={j.value} value={j.value}>{j.label}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">Tanggal Mulai <span className="text-[#DC2626]">*</span></label>
              <input type="date" required value={form.tanggal_mulai}
                onChange={e => setForm(f => ({ ...f, tanggal_mulai: e.target.value }))}
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">Tanggal Selesai <span className="text-[#DC2626]">*</span></label>
              <input type="date" required value={form.tanggal_selesai} min={form.tanggal_mulai}
                onChange={e => setForm(f => ({ ...f, tanggal_selesai: e.target.value }))}
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]" />
            </div>
          </div>

          {jumlahHari > 0 && (
            <div className="flex items-center gap-2 p-3 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
              <Calendar size={16} className="text-[#6B7280]" />
              <span className="text-sm text-[#374151]">Total: <strong className="text-[#2563EB]">{jumlahHari} hari kerja</strong></span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">Alasan Pengajuan <span className="text-[#DC2626]">*</span></label>
            <textarea required rows={3} placeholder="Jelaskan alasan pengajuan cuti..." value={form.alasan}
              onChange={e => setForm(f => ({ ...f, alasan: e.target.value }))}
              className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">Alamat Selama Cuti</label>
              <input type="text" placeholder="Alamat..." value={form.alamat_selama_cuti}
                onChange={e => setForm(f => ({ ...f, alamat_selama_cuti: e.target.value }))}
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">No. Telp Selama Cuti</label>
              <input type="tel" placeholder="08xxxxxxxxxx" value={form.telepon_selama_cuti}
                onChange={e => setForm(f => ({ ...f, telepon_selama_cuti: e.target.value }))}
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]" />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <a href="/cuti" className="px-4 py-2 border border-[#E5E7EB] text-sm text-[#374151] rounded-lg hover:bg-[#F9FAFB] transition-colors">Batal</a>
            <button type="submit" disabled={submitting} className="inline-flex items-center gap-2 px-6 py-2 bg-[#2563EB] text-white text-sm font-medium rounded-lg hover:bg-[#1D4ED8] disabled:opacity-50 transition-colors">
              {submitting ? <><Loader2 size={16} className="animate-spin" /> Mengajukan...</> : "Ajukan Cuti"}
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
