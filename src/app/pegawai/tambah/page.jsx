import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";
import { ArrowLeft, Upload } from "lucide-react";

export default function TambahPegawaiPage() {
  const { data: user, loading: userLoading } = useUser();
  const [pegawai, setPegawai] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    nip: "",
    nama_lengkap: "",
    tempat_lahir: "",
    tanggal_lahir: "",
    jenis_kelamin: "",
    agama: "",
    status_pernikahan: "",
    alamat: "",
    no_telepon: "",
    email: "",
    status_pegawai: "PNS",
    golongan: "",
    pangkat: "",
    jabatan: "",
    unit_kerja: "",
    pendidikan_terakhir: "",
    jurusan: "",
    nama_institusi: "",
    tahun_lulus: "",
    tmt_cpns: "",
    tmt_pns: "",
    tmt_pangkat_terakhir: "",
    tmt_jabatan: "",
    role: "pegawai",
  });

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

        if (data.pegawai.role !== "admin") {
          if (typeof window !== "undefined") {
            window.location.href = "/pegawai";
          }
        }
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/pegawai/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal menambahkan pegawai");
      }

      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/pegawai";
      }, 2000);
    } catch (err) {
      setError(err.message);
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
                <p className="text-xs text-[#6B7280]">Administrator</p>
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
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Back Button */}
        <a
          href="/pegawai"
          className="inline-flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#111827] mb-6"
        >
          <ArrowLeft size={16} />
          Kembali ke Daftar Pegawai
        </a>

        {/* Page Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-[#111827] tracking-tight mb-1">
            Tambah Pegawai Baru
          </h2>
          <p className="text-sm text-[#6B7280]">
            Lengkapi data pegawai di bawah ini
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-[#E5E7EB] p-6"
        >
          {/* Data Pribadi */}
          <div className="mb-8">
            <h3 className="text-base font-semibold text-[#111827] mb-4 pb-2 border-b border-[#E5E7EB]">
              Data Pribadi
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#111827] mb-2">
                  NIP <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nip"
                  value={formData.nip}
                  onChange={handleChange}
                  maxLength={18}
                  required
                  placeholder="18 digit NIP"
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#111827] mb-2">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nama_lengkap"
                  value={formData.nama_lengkap}
                  onChange={handleChange}
                  required
                  placeholder="Nama lengkap dengan gelar"
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#111827] mb-2">
                  Tempat Lahir
                </label>
                <input
                  type="text"
                  name="tempat_lahir"
                  value={formData.tempat_lahir}
                  onChange={handleChange}
                  placeholder="Kota tempat lahir"
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#111827] mb-2">
                  Tanggal Lahir
                </label>
                <input
                  type="date"
                  name="tanggal_lahir"
                  value={formData.tanggal_lahir}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#111827] mb-2">
                  Jenis Kelamin
                </label>
                <select
                  name="jenis_kelamin"
                  value={formData.jenis_kelamin}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
                >
                  <option value="">Pilih</option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#111827] mb-2">
                  Agama
                </label>
                <select
                  name="agama"
                  value={formData.agama}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
                >
                  <option value="">Pilih</option>
                  <option value="Islam">Islam</option>
                  <option value="Kristen">Kristen</option>
                  <option value="Katolik">Katolik</option>
                  <option value="Hindu">Hindu</option>
                  <option value="Buddha">Buddha</option>
                  <option value="Konghucu">Konghucu</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#111827] mb-2">
                  Status Pernikahan
                </label>
                <select
                  name="status_pernikahan"
                  value={formData.status_pernikahan}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
                >
                  <option value="">Pilih</option>
                  <option value="Belum Menikah">Belum Menikah</option>
                  <option value="Menikah">Menikah</option>
                  <option value="Cerai Hidup">Cerai Hidup</option>
                  <option value="Cerai Mati">Cerai Mati</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#111827] mb-2">
                  No. Telepon
                </label>
                <input
                  type="tel"
                  name="no_telepon"
                  value={formData.no_telepon}
                  onChange={handleChange}
                  placeholder="08xxxxxxxxxx"
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#111827] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email@example.com"
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#111827] mb-2">
                  Alamat
                </label>
                <textarea
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Alamat lengkap"
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Data Kepegawaian */}
          <div className="mb-8">
            <h3 className="text-base font-semibold text-[#111827] mb-4 pb-2 border-b border-[#E5E7EB]">
              Data Kepegawaian
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-[#111827] mb-2">
                  Status Pegawai
                </label>
                <select
                  name="status_pegawai"
                  value={formData.status_pegawai}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
                >
                  <option value="PNS">PNS</option>
                  <option value="CPNS">CPNS</option>
                  <option value="PPPK">PPPK</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#111827] mb-2">
                  Golongan
                </label>
                <input
                  type="text"
                  name="golongan"
                  value={formData.golongan}
                  onChange={handleChange}
                  placeholder="Contoh: III/d"
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#111827] mb-2">
                  Pangkat
                </label>
                <input
                  type="text"
                  name="pangkat"
                  value={formData.pangkat}
                  onChange={handleChange}
                  placeholder="Contoh: Penata Tingkat I"
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#111827] mb-2">
                  Jabatan
                </label>
                <input
                  type="text"
                  name="jabatan"
                  value={formData.jabatan}
                  onChange={handleChange}
                  placeholder="Jabatan saat ini"
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#111827] mb-2">
                  Unit Kerja
                </label>
                <input
                  type="text"
                  name="unit_kerja"
                  value={formData.unit_kerja}
                  onChange={handleChange}
                  placeholder="Bidang/Bagian"
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#111827] mb-2">
                  TMT CPNS
                </label>
                <input
                  type="date"
                  name="tmt_cpns"
                  value={formData.tmt_cpns}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#111827] mb-2">
                  TMT PNS
                </label>
                <input
                  type="date"
                  name="tmt_pns"
                  value={formData.tmt_pns}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#111827] mb-2">
                  TMT Pangkat Terakhir
                </label>
                <input
                  type="date"
                  name="tmt_pangkat_terakhir"
                  value={formData.tmt_pangkat_terakhir}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#111827] mb-2">
                  TMT Jabatan
                </label>
                <input
                  type="date"
                  name="tmt_jabatan"
                  value={formData.tmt_jabatan}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#111827] mb-2">
                  Role Akses Sistem
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
                >
                  <option value="pegawai">Pegawai</option>
                  <option value="admin">Administrator</option>
                  <option value="pimpinan">Pimpinan</option>
                </select>
              </div>
            </div>
          </div>

          {/* Data Pendidikan */}
          <div className="mb-8">
            <h3 className="text-base font-semibold text-[#111827] mb-4 pb-2 border-b border-[#E5E7EB]">
              Data Pendidikan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-[#111827] mb-2">
                  Pendidikan Terakhir
                </label>
                <select
                  name="pendidikan_terakhir"
                  value={formData.pendidikan_terakhir}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
                >
                  <option value="">Pilih</option>
                  <option value="SMA/SMK">SMA/SMK</option>
                  <option value="D3">D3</option>
                  <option value="S1">S1</option>
                  <option value="S2">S2</option>
                  <option value="S3">S3</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#111827] mb-2">
                  Jurusan
                </label>
                <input
                  type="text"
                  name="jurusan"
                  value={formData.jurusan}
                  onChange={handleChange}
                  placeholder="Jurusan/Program Studi"
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#111827] mb-2">
                  Nama Institusi
                </label>
                <input
                  type="text"
                  name="nama_institusi"
                  value={formData.nama_institusi}
                  onChange={handleChange}
                  placeholder="Nama Universitas/Sekolah"
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#111827] mb-2">
                  Tahun Lulus
                </label>
                <input
                  type="number"
                  name="tahun_lulus"
                  value={formData.tahun_lulus}
                  onChange={handleChange}
                  placeholder="2020"
                  min="1950"
                  max="2030"
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
                />
              </div>
            </div>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 rounded-lg bg-green-50 border border-green-200 p-4 text-sm text-green-600">
              Pegawai berhasil ditambahkan! Mengalihkan...
            </div>
          )}

          {/* Buttons */}
          <div className="flex items-center gap-3 pt-6 border-t border-[#E5E7EB]">
            <button
              type="submit"
              disabled={loading || success}
              className="px-6 py-2.5 bg-[#2563EB] text-white text-sm font-medium rounded-lg hover:bg-[#1D4ED8] transition-colors disabled:opacity-50"
            >
              {loading ? "Menyimpan..." : "Simpan Data"}
            </button>
            <a
              href="/pegawai"
              className="px-6 py-2.5 border border-[#E5E7EB] text-[#111827] text-sm font-medium rounded-lg hover:bg-[#F9FAFB] transition-colors"
            >
              Batal
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
