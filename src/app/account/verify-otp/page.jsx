import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function VerifyOtpPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const email = searchParams.get("email");

  useEffect(() => {
    if (!email) {
      navigate("/account/signup");
    }
  }, [email, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!otp) {
      setError("Harap masukkan kode OTP");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Gagal memverifikasi OTP");
        setLoading(false);
        return;
      }

      // Success, redirect to signin
      alert(data.message || "Verifikasi berhasil. Silakan login.");
      navigate("/account/signin");

    } catch (err) {
      console.error("Verify OTP error:", err);
      setError(err?.message || "Terjadi kesalahan saat memverifikasi");
      setLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen w-full items-center justify-center bg-[#F9FAFB]"
      style={{ fontFamily: "Inter, -apple-system, sans-serif" }}
    >
      <form
        noValidate
        onSubmit={onSubmit}
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
          Verifikasi Email Anda
        </h1>
        <p className="text-sm text-[#6B7280] text-center mb-8">
          Kami telah mengirimkan 6 digit kode OTP ke email {email}. Silakan periksa inbox atau folder spam Anda.
        </p>

        <div className="space-y-5">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#111827]">
              Kode OTP
            </label>
            <input
              required
              name="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Masukkan 6 digit kode"
              maxLength={6}
              className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-center text-xl tracking-[0.5em] font-bold text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1D4ED8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2 disabled:opacity-50"
          >
            {loading ? "Memverifikasi..." : "Verifikasi"}
          </button>
        </div>
      </form>
    </div>
  );
}
