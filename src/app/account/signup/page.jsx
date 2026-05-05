import { useState } from "react";
import { Eye, EyeOff, ShieldCheck, Smartphone } from "lucide-react";

export default function SignUpPage() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [nip, setNip] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // TOTP Setup state
  const [totpSetup, setTotpSetup] = useState(null);
  const [totpToken, setTotpToken] = useState("");
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyError, setVerifyError] = useState(null);
  const [verifySuccess, setVerifySuccess] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email || !password || !name || !nip) {
      setError("Harap isi semua field (Nama, NIP, Email, Password)");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter");
      setLoading(false);
      return;
    }

    try {
      const registerRes = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, nip }),
      });

      const registerData = await registerRes.json();

      if (!registerRes.ok) {
        setError(registerData.error || "Gagal mendaftar");
        setLoading(false);
        return;
      }

      // Show TOTP setup screen
      setTotpSetup(registerData.totpSetup);
    } catch (err) {
      console.error("Signup error:", err);
      setError(err?.message || "Terjadi kesalahan saat mendaftar");
    } finally {
      setLoading(false);
    }
  };

  const onVerifyTotp = async (e) => {
    e.preventDefault();
    setVerifyLoading(true);
    setVerifyError(null);

    if (!totpToken || totpToken.length !== 6) {
      setVerifyError("Masukkan 6 digit kode dari aplikasi Authenticator");
      setVerifyLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: totpSetup.email, token: totpToken }),
      });

      const data = await res.json();

      if (!res.ok) {
        setVerifyError(data.error || "Kode tidak valid");
        setVerifyLoading(false);
        return;
      }

      setVerifySuccess(true);
    } catch (err) {
      setVerifyError("Terjadi kesalahan saat verifikasi");
      setVerifyLoading(false);
    }
  };

  // SUCCESS SCREEN
  if (verifySuccess) {
    return (
      <div
        className="flex min-h-screen w-full items-center justify-center bg-[#003366] relative overflow-hidden"
        style={{ fontFamily: "Inter, -apple-system, sans-serif" }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-[#FFCC00]/10 rounded-full -mr-32 -mt-32 blur-[100px]"></div>
        </div>
        <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl border-b-8 border-[#FFCC00] p-10 mx-4 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center shadow-lg">
              <ShieldCheck className="h-10 w-10 text-green-600" />
            </div>
          </div>
          <h1 className="text-2xl font-black text-[#003366] mb-3 uppercase tracking-tight">Akun Terverifikasi! 🎉</h1>
          <p className="text-sm text-slate-500 mb-8 leading-relaxed">
            Selamat! Akun Anda sudah aktif dan terlindungi dengan Authenticator. Setiap login, gunakan kode dari Google Authenticator.
          </p>
          <a
            href="/account/signin"
            className="inline-block w-full rounded-xl bg-[#003366] px-6 py-4 text-sm font-black text-[#FFCC00] text-center hover:bg-[#002244] transition-all uppercase tracking-widest"
          >
            Masuk Sekarang →
          </a>
        </div>
      </div>
    );
  }

  // TOTP SETUP SCREEN
  if (totpSetup) {
    // Deep link untuk buka Google Authenticator langsung dari HP
    const otpauthUri = totpSetup.otpauthUri || `otpauth://totp/SIMEGPUPR:${encodeURIComponent(totpSetup.email)}?secret=${totpSetup.secret}&issuer=SIMEGPUPR`;

    const copySecret = () => {
      navigator.clipboard.writeText(totpSetup.secret).then(() => {
        alert('Kode secret berhasil disalin!');
      });
    };

    return (
      <div
        className="flex min-h-screen w-full items-center justify-center bg-[#003366] relative overflow-hidden py-8"
        style={{ fontFamily: "Inter, -apple-system, sans-serif" }}
      >
        {/* Background Decor */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-[#FFCC00]/10 rounded-full -mr-32 -mt-32 blur-[100px]"></div>
          <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-white/5 rounded-full -ml-20 -mb-20 blur-[80px]"></div>
          
          {/* Tiled PUPR Logo Pattern */}
          <div 
            className="absolute inset-0 opacity-[0.15]"
            style={{
              backgroundImage: `url('https://upload.wikimedia.org/wikipedia/commons/b/bc/Logo_PUPR.png')`,
              backgroundSize: '180px',
              backgroundRepeat: 'repeat',
              filter: 'brightness(0) invert(1)'
            }}
          ></div>
        </div>

        <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl border-b-8 border-[#FFCC00] p-8 mx-4">
          {/* Header */}
          <div className="flex items-center justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-[#003366] flex items-center justify-center shadow-lg">
              <Smartphone className="h-8 w-8 text-[#FFCC00]" />
            </div>
          </div>
          <h1 className="text-2xl font-black text-[#003366] text-center mb-1 uppercase tracking-tight">Setup Keamanan</h1>
          <p className="text-xs text-slate-500 text-center mb-6 leading-relaxed">
            Aktifkan <strong>Google Authenticator</strong> untuk melindungi akun SIMPEG PUPR Anda.
          </p>

          {/* ===== TOMBOL UTAMA UNTUK HP ===== */}
          <div className="bg-[#FFCC00] rounded-2xl p-4 mb-6 text-center shadow-md">
            <p className="text-[11px] font-black text-[#003366] uppercase tracking-widest mb-3">📱 Buka di HP? Klik tombol ini!</p>
            <a
              href={otpauthUri}
              className="block w-full py-3 px-4 bg-[#003366] text-[#FFCC00] font-black text-sm rounded-xl uppercase tracking-wider hover:bg-[#002244] transition-all active:scale-95"
            >
              🔐 Buka Google Authenticator
            </a>
            <p className="text-[10px] text-[#003366]/70 mt-2">Tombol ini akan membuka aplikasi Authenticator secara otomatis</p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-slate-200"></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">atau</span>
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>

          {/* QR Code - untuk yang buka dari PC */}
          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 mb-5 text-center">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Scan QR Code (dari PC/Laptop)</p>
            <div className="flex justify-center">
              <img
                src={totpSetup.qrCode}
                alt="QR Code Authenticator"
                className="w-48 h-48 rounded-xl border-4 border-[#003366]/10"
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-2">Buka Google Authenticator → Tambah Akun → Scan QR</p>
          </div>

          {/* Secret Key - mudah disalin */}
          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 mb-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Kode Secret Manual</p>
              <button
                type="button"
                onClick={copySecret}
                className="text-[10px] font-black text-[#003366] bg-[#FFCC00] px-3 py-1 rounded-lg hover:bg-yellow-300 transition-colors uppercase tracking-wider"
              >
                📋 Salin
              </button>
            </div>
            <code className="block text-sm font-mono text-[#003366] break-all tracking-[0.2em] font-black bg-white border border-slate-200 rounded-xl px-3 py-2">
              {totpSetup.secret}
            </code>
            <p className="text-[9px] text-slate-400 mt-1">Masukkan kode ini secara manual di Google Authenticator jika tidak bisa scan/klik tombol</p>
          </div>

          {/* Verify */}
          <form onSubmit={onVerifyTotp} className="space-y-3">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Masukkan kode 6 digit dari aplikasi</p>
            <input
              required
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={totpToken}
              onChange={(e) => setTotpToken(e.target.value.replace(/\D/g, ''))}
              placeholder="· · · · · ·"
              className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-4 py-4 text-center text-3xl tracking-[0.6em] font-black text-[#003366] outline-none focus:border-[#FFCC00] focus:bg-white transition-all"
            />

            {verifyError && (
              <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-600 font-medium">
                ⚠️ {verifyError}
              </div>
            )}

            <button
              type="submit"
              disabled={verifyLoading || totpToken.length !== 6}
              className="w-full rounded-xl bg-[#003366] px-6 py-4 text-sm font-black text-[#FFCC00] transition-all hover:bg-[#002244] active:scale-[0.98] disabled:opacity-40 uppercase tracking-widest"
            >
              {verifyLoading ? "Memverifikasi..." : "✓ Aktifkan Akun"}
            </button>
          </form>

          <p className="text-center text-[10px] text-slate-400 mt-4">
            Kode berubah setiap 30 detik. Masukkan kode yang saat ini tampil di aplikasi.
          </p>
        </div>
      </div>
    );
  }

  // REGISTER FORM
  return (
    <div
      className="flex min-h-screen w-full items-center justify-center bg-[#003366] relative overflow-hidden py-12"
      style={{ fontFamily: "Inter, -apple-system, sans-serif" }}
    >
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#FFCC00]/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/5 rounded-full blur-[100px]"></div>
        
        {/* Tiled PUPR Logo Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: `url('https://upload.wikimedia.org/wikipedia/commons/b/bc/Logo_PUPR.png')`,
            backgroundSize: '180px',
            backgroundRepeat: 'repeat',
            filter: 'brightness(0) invert(1)'
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

        <h1 className="text-3xl font-black text-[#003366] tracking-tighter text-center mb-1 uppercase">
          DAFTAR<span className="text-[#FFCC00]">AKUN</span>
        </h1>
        <p className="text-[10px] font-black text-slate-400 text-center mb-10 uppercase tracking-[0.3em]">
          S-KEPEGAWAIAN DINAS PUPR
        </p>

        <div className="space-y-5">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#111827]">
              Nama Lengkap
            </label>
            <input
              required
              name="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama lengkap Anda"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-[#003366] outline-none focus-visible:ring-2 focus-visible:ring-[#FFCC00] transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#111827]">
              NIP (18 Digit)
            </label>
            <input
              required
              name="nip"
              type="text"
              value={nip}
              onChange={(e) => setNip(e.target.value)}
              placeholder="Contoh: 199001012020121001"
              maxLength={18}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-[#003366] outline-none focus-visible:ring-2 focus-visible:ring-[#FFCC00] transition-all"
            />
          </div>

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
                placeholder="Minimal 6 karakter"
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

          <div className="rounded-xl bg-yellow-50 border border-yellow-200 p-4">
            <p className="text-[11px] text-[#003366] leading-relaxed">
              <span className="font-black text-[#003366] uppercase">Keamanan 2 Langkah:</span> Setelah mendaftar, Anda wajib menyiapkan <strong>Google Authenticator</strong> untuk melindungi data kepegawaian Anda.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#003366] px-6 py-4 text-sm font-black text-[#FFCC00] transition-all hover:bg-[#002244] hover:shadow-lg active:scale-[0.98] disabled:opacity-50 uppercase tracking-widest"
          >
            {loading ? "Memproses..." : "Daftar & Setup Keamanan"}
          </button>

          <p className="text-center text-xs text-[#6B7280]">
            Sudah punya akun?{" "}
            <a
              href="/account/signin"
              className="text-[#003366] hover:text-[#FFCC00] font-black uppercase tracking-tighter border-b-2 border-transparent hover:border-[#FFCC00] transition-all"
            >
              Masuk di sini
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}
