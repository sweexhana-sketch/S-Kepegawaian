import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";

export default function OnboardingPage() {
  const { data: user, loading: userLoading } = useUser();
  const [nip, setNip] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!userLoading && !user) {
      if (typeof window !== "undefined") {
        window.location.href = "/account/signin";
      }
    }
  }, [user, userLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!nip || nip.length !== 18) {
      setError("NIP harus terdiri dari 18 digit");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/pegawai/link-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nip }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Gagal menghubungkan akun");
      }

      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (userLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F9FAFB]">
        <div className="text-sm text-[#6B7280]">Memuat...</div>
      </div>
    );
  }

  return (
    <div
      className="flex min-h-screen w-full items-center justify-center bg-[#F9FAFB]"
      style={{ fontFamily: "Inter, -apple-system, sans-serif" }}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-xl border border-[#E5E7EB] p-8"
      >
        <div className="flex items-center justify-center mb-8">
          <img
            src="https://ucarecdn.com/f5ae1e2c-7229-43a4-a8ad-ae05a4f4cac4/-/format/auto/"
            alt="Logo Papua Barat Daya"
            className="h-20 w-20 object-contain"
          />
        </div>

        <h1 className="text-2xl font-semibold text-[#111827] tracking-tight text-center mb-2">
          Hubungkan Akun Pegawai
        </h1>
        <p className="text-sm text-[#6B7280] text-center mb-8">
          Masukkan NIP Anda untuk melanjutkan
        </p>

        <div className="space-y-5">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#111827]">
              NIP (18 Digit)
            </label>
            <input
              required
              name="nip"
              type="text"
              maxLength={18}
              value={nip}
              onChange={(e) => setNip(e.target.value.replace(/\D/g, ""))}
              placeholder="Contoh: 199001012020121001"
              className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
            />
            <p className="text-xs text-[#6B7280]">
              NIP harus sudah terdaftar di database pegawai
            </p>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-600">
              Berhasil! Mengalihkan ke dashboard...
            </div>
          )}

          <button
            type="submit"
            disabled={loading || success}
            className="w-full rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1D4ED8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2 disabled:opacity-50"
          >
            {loading ? "Memproses..." : success ? "Berhasil!" : "Hubungkan"}
          </button>
        </div>
      </form>
    </div>
  );
}
