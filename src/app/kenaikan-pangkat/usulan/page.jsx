import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";
import AppLayout from "@/utils/AppLayout";
import { ArrowLeft, Check, X, Loader2, Info } from "lucide-react";

const JENIS_KP = [
  "Kenaikan Pangkat Reguler",
  "Kenaikan Pangkat Pilihan",
  "Kenaikan Pangkat Pengabdian",
  "Kenaikan Pangkat Anumerta",
];

const GOLONGAN_LIST = ["I/a", "I/b", "I/c", "I/d", "II/a", "II/b", "II/c", "II/d", "III/a", "III/b", "III/c", "III/d", "IV/a", "IV/b", "IV/c", "IV/d", "IV/e"];

export default function KPUsulanPage() {
  const { data: user, loading: userLoading } = useUser();
  const [pegawai, setPegawai] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    jenis_kenaikan: "", golongan_baru: "", pangkat_baru: "",
    tmt_usulan: "", periode_usulan: "", catatan: "",
  });

  useEffect(() => {
    if (!userLoading && !user) { window.location.href = "/account/signin"; return; }
    if (user) fetchProfile();
  }, [user, userLoading]);

  const fetchProfile = async () => {
    const res = await fetch("/api/pegawai/profile");
    if (res.status === 404) { window.location.href = "/onboarding"; return; }
    if (res.ok) { const d = await res.json(); setPegawai(d.pegawai); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.jenis_kenaikan || !form.tmt_usulan) { setError("Jenis kenaikan dan TMT wajib diisi"); return; }
    setSubmitting(true); setError("");
    try {
      const res = await fetch("/api/kenaikan-pangkat/create", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mengajukan usulan");
      setSuccess(true);
      setTimeout(() => { window.location.href = "/kenaikan-pangkat"; }, 2000);
    } catch (err) { setError(err.message); } finally { setSubmitting(false); }
  };

  if (userLoading || !pegawai) return <div className="flex min-h-screen items-center justify-center bg-[#F9FAFB]"><div className="text-sm text-[#6B7280]">Memuat...</div></div>;

  return (
    <AppLayout pegawai={pegawai} activeHref="/kenaikan-pangkat">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <a href="/kenaikan-pangkat" className="p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors"><ArrowLeft size={20} className="text-[#6B7280]" /></a>
          <div>
            <h2 className="text-2xl font-semibold text-[#111827] tracking-tight">Form Usulan Kenaikan Pangkat</h2>
            <p className="text-sm text-[#6B7280]">Isi formulir pengajuan kenaikan pangkat</p>
          </div>
        </div>

        {success && <div className="mb-6 p-4 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl flex items-center gap-3"><Check size={20} className="text-[#059669]" /><p className="text-sm text-[#059669] font-medium">Usulan berhasil diajukan!</p></div>}
        {error && <div className="mb-6 p-4 bg-[#FEF2F2] border border-[#FECACA] rounded-xl flex items-center gap-3"><X size={20} className="text-[#DC2626]" /><p className="text-sm text-[#DC2626]">{error}</p></div>}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-5">
          <div className="flex items-center gap-3 p-3 bg-[#EFF6FF] rounded-lg">
            <Info size={16} className="text-[#2563EB] flex-shrink-0" />
            <div className="text-sm">
              <span className="text-[#1D4ED8] font-medium">{pegawai.nama_lengkap}</span>
              <span className="text-[#6B7280] mx-2">·</span>
              <span className="text-[#6B7280]">Pangkat saat ini: {pegawai.pangkat} ({pegawai.golongan})</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">Jenis Kenaikan Pangkat <span className="text-[#DC2626]">*</span></label>
            <select required value={form.jenis_kenaikan} onChange={e => setForm(f => ({ ...f, jenis_kenaikan: e.target.value }))}
              className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]">
              <option value="">Pilih jenis...</option>
              {JENIS_KP.map(j => <option key={j} value={j}>{j}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">Golongan Baru</label>
              <select value={form.golongan_baru} onChange={e => setForm(f => ({ ...f, golongan_baru: e.target.value }))}
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]">
                <option value="">Pilih golongan...</option>
                {GOLONGAN_LIST.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">Pangkat Baru</label>
              <input type="text" placeholder="Contoh: Penata" value={form.pangkat_baru}
                onChange={e => setForm(f => ({ ...f, pangkat_baru: e.target.value }))}
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">TMT Usulan <span className="text-[#DC2626]">*</span></label>
              <input type="date" required value={form.tmt_usulan}
                onChange={e => setForm(f => ({ ...f, tmt_usulan: e.target.value }))}
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">Periode Usulan</label>
              <select value={form.periode_usulan} onChange={e => setForm(f => ({ ...f, periode_usulan: e.target.value }))}
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]">
                <option value="">Pilih...</option>
                <option value="April">April</option>
                <option value="Oktober">Oktober</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">Catatan</label>
            <textarea rows={3} placeholder="Catatan atau informasi tambahan..." value={form.catatan}
              onChange={e => setForm(f => ({ ...f, catatan: e.target.value }))}
              className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] resize-none" />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <a href="/kenaikan-pangkat" className="px-4 py-2 border border-[#E5E7EB] text-sm text-[#374151] rounded-lg hover:bg-[#F9FAFB] transition-colors">Batal</a>
            <button type="submit" disabled={submitting} className="inline-flex items-center gap-2 px-6 py-2 bg-[#2563EB] text-white text-sm font-medium rounded-lg hover:bg-[#1D4ED8] disabled:opacity-50 transition-colors">
              {submitting ? <><Loader2 size={16} className="animate-spin" /> Mengajukan...</> : "Ajukan Usulan"}
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
