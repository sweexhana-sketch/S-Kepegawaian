import { useState } from "react";
import useAuth from "@/utils/useAuth";

export default function SignInPage() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signInWithCredentials } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email || !password) {
      setError("Harap isi semua field");
      setLoading(false);
      return;
    }

    try {
      await signInWithCredentials({
        email,
        password,
        callbackUrl: "/",
        redirect: true,
      });
    } catch (err) {
      setError("Email atau password salah");
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
          S-Kepegawaian
        </h1>
        <p className="text-sm text-[#6B7280] text-center mb-8">
          Dinas PUPR Provinsi Papua Barat Daya
        </p>

        <div className="space-y-5">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#111827]">
              Email
            </label>
            <input
              required
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan email Anda"
              className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#111827]">
              Password
            </label>
            <input
              required
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
              placeholder="Masukkan password Anda"
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
            {loading ? "Memuat..." : "Masuk"}
          </button>

          <p className="text-center text-xs text-[#6B7280]">
            Belum punya akun?{" "}
            <a
              href="/account/signup"
              className="text-[#2563EB] hover:text-[#1D4ED8] font-medium"
            >
              Daftar di sini
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}
