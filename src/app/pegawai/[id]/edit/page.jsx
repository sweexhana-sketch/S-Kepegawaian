import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";
import { ArrowLeft } from "lucide-react";

const GOLONGAN_LIST = [
  { value: "I/a", label: "I/a - Juru Muda", pangkat: "Juru Muda" },
  { value: "I/b", label: "I/b - Juru Muda Tingkat I", pangkat: "Juru Muda Tingkat I" },
  { value: "I/c", label: "I/c - Juru", pangkat: "Juru" },
  { value: "I/d", label: "I/d - Juru Tingkat I", pangkat: "Juru Tingkat I" },
  { value: "II/a", label: "II/a - Pengatur Muda", pangkat: "Pengatur Muda" },
  { value: "II/b", label: "II/b - Pengatur Muda Tingkat I", pangkat: "Pengatur Muda Tingkat I" },
  { value: "II/c", label: "II/c - Pengatur", pangkat: "Pengatur" },
  { value: "II/d", label: "II/d - Pengatur Tingkat I", pangkat: "Pengatur Tingkat I" },
  { value: "III/a", label: "III/a - Penata Muda", pangkat: "Penata Muda" },
  { value: "III/b", label: "III/b - Penata Muda Tingkat I", pangkat: "Penata Muda Tingkat I" },
  { value: "III/c", label: "III/c - Penata", pangkat: "Penata" },
  { value: "III/d", label: "III/d - Penata Tingkat I", pangkat: "Penata Tingkat I" },
  { value: "IV/a", label: "IV/a - Pembina", pangkat: "Pembina" },
  { value: "IV/b", label: "IV/b - Pembina Tingkat I", pangkat: "Pembina Tingkat I" },
  { value: "IV/c", label: "IV/c - Pembina Utama Muda", pangkat: "Pembina Utama Muda" },
  { value: "IV/d", label: "IV/d - Pembina Utama Madya", pangkat: "Pembina Utama Madya" },
  { value: "IV/e", label: "IV/e - Pembina Utama", pangkat: "Pembina Utama" },
];

const BIDANG_MAP = {
  "Sekretariat": [
    "Sub Bagian Perencanaan",
    "Sub Bagian Umum dan Kepegawaian",
    "Sub Bagian Data dan Informasi Publik"
  ],
  "Bidang Sumber Daya Air": [
    "Seksi Perencanaan",
    "Seksi Pelaksanaan Sumber Daya Air",
    "Seksi Operasi dan Pemeliharaan"
  ],
  "Bidang Bina Marga": [
    "Seksi Perencanaan Teknik dan Evaluasi",
    "Seksi Pembangunan Jalan dan Jembatan",
    "Seksi Reservasi Jalan dan Jembatan"
  ],
  "Bidang Cipta Karya dan Tata Ruang": [
    "Seksi Penyehatan Lingkungan Permukiman dan Air Minum",
    "Seksi Penataan Bangunan dan Pengembangan Permukiman",
    "Seksi Tata Ruang"
  ],
  "Bidang Perumahan dan Bina Konstruksi": [
    "Seksi Perumahan dan Kawasan Permukiman",
    "Seksi Prasarana, Sarana dan Utilitas",
    "Seksi Bina Konstruksi"
  ],
  "UPTD": [],
  "Fungsional": []
};

const BIDANG_LIST = Object.keys(BIDANG_MAP);

export default function EditPegawaiPage({ params }) {
  const { data: user, loading: userLoading } = useUser();
  const [currentPegawai, setCurrentPegawai] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
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
        const p = detailData.pegawai;

        setFormData({
          nama_lengkap: p.nama_lengkap || "",
          tempat_lahir: p.tempat_lahir || "",
          tanggal_lahir: p.tanggal_lahir || "",
          jenis_kelamin: p.jenis_kelamin || "",
          agama: p.agama || "",
          status_pernikahan: p.status_pernikahan || "",
          alamat: p.alamat || "",
          no_telepon: p.no_telepon || "",
          email: p.email || "",
          status_pegawai: p.status_pegawai || "PNS",
          golongan: p.golongan || "",
          pangkat: p.pangkat || "",
          jabatan: p.jabatan || "",
          unit_kerja: p.unit_kerja || "",
          sub_unit: p.sub_unit || "",
          pendidikan_terakhir: p.pendidikan_terakhir || "",
          jurusan: p.jurusan || "",
          nama_institusi: p.nama_institusi || "",
          tahun_lulus: p.tahun_lulus || "",
          tmt_cpns: p.tmt_cpns || "",
          tmt_pns: p.tmt_pns || "",
          tmt_pangkat_terakhir: p.tmt_pangkat_terakhir || "",
          tmt_jabatan: p.tmt_jabatan || "",
          role: p.role || "pegawai",
          home_latitude: p.home_latitude || "",
          home_longitude: p.home_longitude || "",
        });
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      
      // Auto-update pangkat when golongan changes
      if (name === "golongan") {
        const found = GOLONGAN_LIST.find(g => g.value === value);
        if (found) {
          newData.pangkat = found.pangkat;
        }
      }

      // Reset sub_unit when unit_kerja changes
      if (name === "unit_kerja") {
        newData.sub_unit = "";
      }
      
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/pegawai/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal mengupdate pegawai");
      }

      setSuccess(true);
      setTimeout(() => {
        window.location.href = `/pegawai/${params.id}`;
      }, 1500);
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  if (userLoading || loading) {
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
                  {currentPegawai?.nama_lengkap}
                </p>
                <p className="text-xs text-[#6B7280]">
                  {currentPegawai?.role === 'admin' ? 'Administrator' : 'Pegawai'}
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
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Back Button */}
        <a
          href={`/pegawai/${params.id}`}
          className="inline-flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#111827] mb-6"
        >
          <ArrowLeft size={16} />
          Kembali ke Detail Pegawai
        </a>

        {/* Page Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-[#111827] tracking-tight mb-1">
            Edit Data Pegawai
          </h2>
          <p className="text-sm text-[#6B7280]">Update informasi pegawai</p>
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
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nama_lengkap"
                  value={formData.nama_lengkap}
                  onChange={handleChange}
                  required
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
                <select
                  name="golongan"
                  value={formData.golongan}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
                >
                  <option value="">Pilih Golongan</option>
                  {GOLONGAN_LIST.map((g) => (
                    <option key={g.value} value={g.value}>{g.label}</option>
                  ))}
                </select>
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
                  placeholder="Terisi otomatis berdasarkan golongan"
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none bg-slate-50"
                  readOnly
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
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
                />
              </div>

              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-[#111827] mb-2">
                    Bidang Penempatan (Unit Kerja)
                  </label>
                  <select
                    name="unit_kerja"
                    value={formData.unit_kerja}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
                  >
                    <option value="">Pilih Bidang Penempatan</option>
                    {BIDANG_LIST.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#111827] mb-2">
                    Sub Bagian / Seksi
                  </label>
                  <select
                    name="sub_unit"
                    value={formData.sub_unit}
                    onChange={handleChange}
                    disabled={!formData.unit_kerja || BIDANG_MAP[formData.unit_kerja]?.length === 0}
                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] disabled:bg-slate-50 disabled:text-slate-400"
                  >
                    <option value="">Pilih Sub Bagian / Seksi</option>
                    {formData.unit_kerja && BIDANG_MAP[formData.unit_kerja]?.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
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

              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-[#111827] mb-2">
                  Latitude Rumah (untuk Absensi Jumat)
                </label>
                <input
                  type="text"
                  name="home_latitude"
                  value={formData.home_latitude}
                  onChange={handleChange}
                  placeholder="Contoh: -0.883806"
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
                />
              </div>

              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-[#111827] mb-2">
                  Longitude Rumah (untuk Absensi Jumat)
                </label>
                <input
                  type="text"
                  name="home_longitude"
                  value={formData.home_longitude}
                  onChange={handleChange}
                  placeholder="Contoh: 131.295786"
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
                />
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
              Data berhasil diupdate! Mengalihkan...
            </div>
          )}

          {/* Buttons */}
          <div className="flex items-center gap-3 pt-6 border-t border-[#E5E7EB]">
            <button
              type="submit"
              disabled={saving || success}
              className="px-6 py-2.5 bg-[#2563EB] text-white text-sm font-medium rounded-lg hover:bg-[#1D4ED8] transition-colors disabled:opacity-50"
            >
              {saving ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
            <a
              href={`/pegawai/${params.id}`}
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
