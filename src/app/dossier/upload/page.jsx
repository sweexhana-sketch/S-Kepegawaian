import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";
import useUpload from "@/utils/useUpload";
import AppLayout from "@/utils/AppLayout";
import { ArrowLeft, Upload, Check, X, Loader2, Info } from "lucide-react";

const DOC_CATEGORIES = [
  { name: "Identitas", types: ["KTP", "Kartu Keluarga", "NPWP", "Akta Kelahiran", "Pas Foto"] },
  { name: "Kepegawaian", types: ["SK CPNS", "SK PNS", "SK Pangkat Terakhir", "SK Jabatan", "Karis/Karsu", "SK Mutasi"] },
  { name: "Pendidikan", types: ["Ijazah Terakhir", "Transkrip Nilai", "Ijazah SD", "Ijazah SMP", "Ijazah SMA"] },
  { name: "Kompetensi", types: ["Sertifikat Diklat PIM", "Sertifikat Teknis", "Sertifikat Seminar", "Sertifikat Bahasa"] },
];

export default function DossierUploadPage() {
  const { data: user, loading: userLoading } = useUser();
  const [upload, { loading: uploadLoading }] = useUpload();
  const [pegawai, setPegawai] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [form, setForm] = useState({ kategori: "", jenis_dokumen: "", deskripsi: "", masa_berlaku: "" });

  const availableTypes = form.kategori
    ? DOC_CATEGORIES.find(c => c.name === form.kategori)?.types || []
    : [];

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
    if (!file) { setError("Pilih file dokumen terlebih dahulu"); return; }
    if (!form.kategori || !form.jenis_dokumen) { setError("Kategori dan jenis dokumen wajib diisi"); return; }
    setSubmitting(true); setError("");
    try {
      const uploadResult = await upload({ file });
      if (uploadResult.error) throw new Error("Gagal mengupload file: " + uploadResult.error);

      const res = await fetch("/api/dossier/create", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, file_url: uploadResult.url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan dokumen");
      setSuccess(true);
      setTimeout(() => { window.location.href = "/dossier"; }, 2000);
    } catch (err) { setError(err.message); } finally { setSubmitting(false); }
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragActive(false);
    if (e.dataTransfer.files?.[0]) setFile(e.dataTransfer.files[0]);
  };

  if (userLoading || !pegawai) return <div className="flex min-h-screen items-center justify-center bg-[#F9FAFB]"><div className="text-sm text-[#6B7280]">Memuat...</div></div>;

  return (
    <AppLayout pegawai={pegawai} activeHref="/dossier">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <a href="/dossier" className="p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors"><ArrowLeft size={20} className="text-[#6B7280]" /></a>
          <div>
            <h2 className="text-2xl font-semibold text-[#111827] tracking-tight">Upload Dokumen</h2>
            <p className="text-sm text-[#6B7280]">Unggah dokumen kepegawaian ke arsip digital</p>
          </div>
        </div>

        {success && <div className="mb-6 p-4 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl flex items-center gap-3"><Check size={20} className="text-[#059669]" /><p className="text-sm text-[#059669] font-medium">Dokumen berhasil diupload! Menunggu verifikasi admin.</p></div>}
        {error && <div className="mb-6 p-4 bg-[#FEF2F2] border border-[#FECACA] rounded-xl flex items-center gap-3"><X size={20} className="text-[#DC2626]" /><p className="text-sm text-[#DC2626]">{error}</p></div>}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">Kategori <span className="text-[#DC2626]">*</span></label>
              <select required value={form.kategori} onChange={e => setForm(f => ({ ...f, kategori: e.target.value, jenis_dokumen: "" }))}
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]">
                <option value="">Pilih kategori...</option>
                {DOC_CATEGORIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">Jenis Dokumen <span className="text-[#DC2626]">*</span></label>
              <select required disabled={!form.kategori} value={form.jenis_dokumen} onChange={e => setForm(f => ({ ...f, jenis_dokumen: e.target.value }))}
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] disabled:opacity-50">
                <option value="">Pilih jenis...</option>
                {availableTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">Keterangan / Nomor Dokumen</label>
            <input type="text" placeholder="Contoh: SK No. 123/BKD/2023" value={form.deskripsi}
              onChange={e => setForm(f => ({ ...f, deskripsi: e.target.value }))}
              className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]" />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">Masa Berlaku (opsional)</label>
            <input type="date" value={form.masa_berlaku} onChange={e => setForm(f => ({ ...f, masa_berlaku: e.target.value }))}
              className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]" />
          </div>

          {/* Drag & Drop */}
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">File Dokumen <span className="text-[#DC2626]">*</span></label>
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${dragActive ? "border-[#2563EB] bg-[#EFF6FF]" : file ? "border-[#059669] bg-[#ECFDF5]" : "border-[#E5E7EB] hover:border-[#2563EB] hover:bg-[#F9FAFB]"}`}
              onDragEnter={() => setDragActive(true)} onDragLeave={() => setDragActive(false)}
              onDragOver={e => e.preventDefault()} onDrop={handleDrop}
              onClick={() => document.getElementById("dossier-file").click()}
            >
              <input id="dossier-file" type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png"
                onChange={e => { if (e.target.files?.[0]) setFile(e.target.files[0]); }} />
              {file ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 bg-[#ECFDF5] rounded-full flex items-center justify-center"><Check size={20} className="text-[#059669]" /></div>
                  <p className="text-sm font-medium text-[#059669]">{file.name}</p>
                  <p className="text-xs text-[#6B7280]">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  <button type="button" onClick={e => { e.stopPropagation(); setFile(null); }} className="text-xs text-[#DC2626] hover:underline flex items-center gap-1">
                    <X size={12} /> Hapus file
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 bg-[#F3F4F6] rounded-full flex items-center justify-center"><Upload size={20} className="text-[#9CA3AF]" /></div>
                  <p className="text-sm text-[#6B7280]"><span className="text-[#2563EB] font-medium">Klik untuk upload</span> atau seret file ke sini</p>
                  <p className="text-xs text-[#9CA3AF]">PDF, JPG, PNG — Maks. 5MB</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <a href="/dossier" className="px-4 py-2 border border-[#E5E7EB] text-sm text-[#374151] rounded-lg hover:bg-[#F9FAFB] transition-colors">Batal</a>
            <button type="submit" disabled={submitting || uploadLoading}
              className="inline-flex items-center gap-2 px-6 py-2 bg-[#2563EB] text-white text-sm font-medium rounded-lg hover:bg-[#1D4ED8] disabled:opacity-50 transition-colors">
              {submitting || uploadLoading ? <><Loader2 size={16} className="animate-spin" /> Mengupload...</> : <><Upload size={16} /> Upload Dokumen</>}
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
