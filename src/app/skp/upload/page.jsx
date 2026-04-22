import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";
import useUpload from "@/utils/useUpload";
import AppLayout from "@/utils/AppLayout";
import { Upload, ArrowLeft, FileText, Check, X, Loader2, Info } from "lucide-react";

const PERIODES = [
  { value: "semester1", label: "Semester I (Januari - Juni)" },
  { value: "semester2", label: "Semester II (Juli - Desember)" },
  { value: "tahunan", label: "Tahunan" },
];
const TAHUN_OPTIONS = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

export default function SKPUploadPage() {
  const { data: user, loading: userLoading } = useUser();
  const [upload, { loading: uploadLoading }] = useUpload();
  const [pegawai, setPegawai] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const [form, setForm] = useState({
    tahun: new Date().getFullYear(),
    periode: "",
    target_nilai: "",
    catatan: "",
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
    if (!form.periode) { setError("Pilih periode SKP terlebih dahulu"); return; }
    setSubmitting(true);
    setError("");
    try {
      let dokumen_url = null;
      if (file) {
        const result = await upload({ file });
        if (result.error) throw new Error("Gagal mengupload file: " + result.error);
        dokumen_url = result.url;
      }

      const res = await fetch("/api/skp/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, dokumen_url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan SKP");
      setSuccess(true);
      setTimeout(() => { window.location.href = "/skp"; }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragActive(false);
    if (e.dataTransfer.files?.[0]) setFile(e.dataTransfer.files[0]);
  };

  if (userLoading || !pegawai) return <div className="flex min-h-screen items-center justify-center bg-[#F9FAFB]"><div className="text-sm text-[#6B7280]">Memuat...</div></div>;

  return (
    <AppLayout pegawai={pegawai} activeHref="/skp">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <a href="/skp" className="p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors">
            <ArrowLeft size={20} className="text-[#6B7280]" />
          </a>
          <div>
            <h2 className="text-2xl font-semibold text-[#111827] tracking-tight">Upload SKP</h2>
            <p className="text-sm text-[#6B7280]">Unggah dokumen Sasaran Kinerja Pegawai</p>
          </div>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl flex items-center gap-3">
            <Check size={20} className="text-[#059669]" />
            <p className="text-sm text-[#059669] font-medium">SKP berhasil disimpan! Mengalihkan ke halaman SKP...</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-[#FEF2F2] border border-[#FECACA] rounded-xl flex items-center gap-3">
            <X size={20} className="text-[#DC2626]" />
            <p className="text-sm text-[#DC2626]">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-6">
          {/* Info pegawai */}
          <div className="flex items-center gap-3 p-3 bg-[#EFF6FF] rounded-lg">
            <Info size={16} className="text-[#2563EB] flex-shrink-0" />
            <div className="text-sm">
              <span className="text-[#1D4ED8] font-medium">{pegawai.nama_lengkap}</span>
              <span className="text-[#6B7280] mx-2">·</span>
              <span className="text-[#6B7280]">{pegawai.jabatan} · {pegawai.unit_kerja}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">Tahun <span className="text-[#DC2626]">*</span></label>
              <select value={form.tahun} onChange={e => setForm(f => ({ ...f, tahun: e.target.value }))}
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]">
                {TAHUN_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">Periode <span className="text-[#DC2626]">*</span></label>
              <select value={form.periode} onChange={e => setForm(f => ({ ...f, periode: e.target.value }))}
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]">
                <option value="">Pilih Periode...</option>
                {PERIODES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">Target Nilai (opsional)</label>
            <input type="number" min="0" max="100" placeholder="Contoh: 85" value={form.target_nilai}
              onChange={e => setForm(f => ({ ...f, target_nilai: e.target.value }))}
              className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]" />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">Catatan (opsional)</label>
            <textarea rows={3} placeholder="Catatan tambahan..." value={form.catatan}
              onChange={e => setForm(f => ({ ...f, catatan: e.target.value }))}
              className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] resize-none" />
          </div>

          {/* Drop Zone */}
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">Dokumen SKP (PDF/Gambar)</label>
            <div
              className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${dragActive ? "border-[#2563EB] bg-[#EFF6FF]" : file ? "border-[#059669] bg-[#ECFDF5]" : "border-[#E5E7EB] hover:border-[#2563EB] hover:bg-[#F9FAFB]"}`}
              onDragEnter={() => setDragActive(true)} onDragLeave={() => setDragActive(false)}
              onDragOver={e => e.preventDefault()} onDrop={handleDrop}
              onClick={() => document.getElementById("skp-file-input").click()}
            >
              <input id="skp-file-input" type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png"
                onChange={e => { if (e.target.files?.[0]) setFile(e.target.files[0]); }} />
              {file ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 bg-[#ECFDF5] rounded-full flex items-center justify-center">
                    <Check size={20} className="text-[#059669]" />
                  </div>
                  <p className="text-sm font-medium text-[#059669]">{file.name}</p>
                  <p className="text-xs text-[#6B7280]">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  <button type="button" onClick={e => { e.stopPropagation(); setFile(null); }}
                    className="text-xs text-[#DC2626] hover:underline flex items-center gap-1">
                    <X size={12} /> Hapus file
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 bg-[#F3F4F6] rounded-full flex items-center justify-center">
                    <Upload size={20} className="text-[#9CA3AF]" />
                  </div>
                  <p className="text-sm text-[#6B7280]"><span className="text-[#2563EB] font-medium">Klik untuk upload</span> atau seret file ke sini</p>
                  <p className="text-xs text-[#9CA3AF]">PDF, JPG, PNG — Maks. 5MB</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <a href="/skp" className="px-4 py-2 border border-[#E5E7EB] text-sm text-[#374151] rounded-lg hover:bg-[#F9FAFB] transition-colors">
              Batal
            </a>
            <button type="submit" disabled={submitting || uploadLoading}
              className="inline-flex items-center gap-2 px-6 py-2 bg-[#2563EB] text-white text-sm font-medium rounded-lg hover:bg-[#1D4ED8] disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              {submitting || uploadLoading ? <><Loader2 size={16} className="animate-spin" /> Menyimpan...</> : <><FileText size={16} /> Simpan SKP</>}
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
