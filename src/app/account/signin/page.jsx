import { useState } from "react";
import useAuth from "@/utils/useAuth";
import { Eye, EyeOff } from "lucide-react";

export default function SignInPage() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
      className="flex min-h-screen w-full items-center justify-center bg-[#003366] relative overflow-hidden"
      style={{ fontFamily: "Inter, -apple-system, sans-serif" }}
    >
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#FFCC00]/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/5 rounded-full blur-[100px]"></div>
        
        {/* Tiled PUPR Logo Pattern - 70% transparency (30% opacity) */}
        <div 
          className="absolute inset-0 opacity-[0.3]"
          style={{
            backgroundImage: `url('https://upload.wikimedia.org/wikipedia/commons/b/bc/Logo_PUPR.png')`,
            backgroundSize: '200px',
            backgroundRepeat: 'repeat',
            filter: 'brightness(0) invert(1)',
            pointerEvents: 'none'
          }}
        ></div>
      </div>

      <form
        noValidate
        onSubmit={onSubmit}
        className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl border-b-8 border-[#FFCC00] p-10 mx-4"
      >
        <div className="flex items-center justify-center mb-8">
          <img
            src="https://ucarecdn.com/f5ae1e2c-7229-43a4-a8ad-ae05a4f4cac4/-/format/auto/"
            alt="Logo Papua Barat Daya"
            className="h-20 w-20 object-contain"
          />
        </div>

        <h1 className="text-3xl font-black text-[#003366] tracking-tighter text-center mb-1 uppercase italic">
          SIMPEG<span className="text-[#FFCC00] not-italic">PUPR</span>
        </h1>
        <p className="text-[10px] font-black text-slate-400 text-center mb-10 uppercase tracking-[0.3em]">
          Provinsi Papua Barat Daya
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
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-[#003366] outline-none focus-visible:ring-2 focus-visible:ring-[#FFCC00] transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#111827]">
              Password
            </label>
            <div className="relative">
              <input
                required
                name="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-[#003366] outline-none focus-visible:ring-2 focus-visible:ring-[#FFCC00] transition-all pr-12"
                placeholder="Masukkan password Anda"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#003366] px-6 py-4 text-sm font-black text-[#FFCC00] transition-all hover:bg-[#002244] hover:shadow-lg active:scale-[0.98] disabled:opacity-50 uppercase tracking-widest"
          >
            {loading ? "Memverifikasi..." : "Masuk ke Sistem"}
          </button>

          <p className="text-center text-xs text-[#6B7280]">
            Belum punya akun?{" "}
            <a
              href="/account/signup"
              className="text-[#003366] hover:text-[#FFCC00] font-black uppercase tracking-tighter border-b-2 border-transparent hover:border-[#FFCC00] transition-all"
            >
              Daftar di sini
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}
