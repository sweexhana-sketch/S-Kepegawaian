import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";
import Sidebar from "@/components/Sidebar";
import { 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Calendar as CalendarIcon,
  Navigation,
  ShieldCheck,
  Bell
} from "lucide-react";

export default function AbsensiPage() {
  const { data: user, loading: userLoading } = useUser();
  const [pegawai, setPegawai] = useState(null);
  const [absensi, setAbsensi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [message, setMessage] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (user) {
      fetchStatus();
      requestLocation();
    }
  }, [user]);

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/absensi/status");
      if (res.ok) {
        const data = await res.json();
        setPegawai(data.pegawai);
        setAbsensi(data.absensi);
      }
    } catch (err) {
      console.error("Error fetching status:", err);
    } finally {
      setLoading(false);
    }
  };

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Browser Anda tidak mendukung geolokasi");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
        setLocationError(null);
      },
      (err) => {
        console.error(err);
        setLocationError("Gagal mendapatkan lokasi. Pastikan izin lokasi diaktifkan.");
      },
      { enableHighAccuracy: true }
    );
  };

  const handleCheckIn = async () => {
    if (!location) {
      requestLocation();
      return;
    }

    setActionLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/absensi/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latitude: location.lat, longitude: location.lng })
      });

      const data = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: data.message });
        fetchStatus();
      } else {
        setMessage({ type: "error", text: data.error });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Terjadi kesalahan sistem" });
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setActionLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/absensi/check-out", {
        method: "POST"
      });

      const data = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: data.message });
        fetchStatus();
      } else {
        setMessage({ type: "error", text: data.error });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Terjadi kesalahan sistem" });
    } finally {
      setActionLoading(false);
    }
  };

  if (userLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-slate-500 tracking-widest uppercase">Sinkronisasi...</p>
        </div>
      </div>
    );
  }

  const witTime = new Date(currentTime.getTime() + (9 * 60 * 60 * 1000));
  const canAbsen = true;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row overflow-x-hidden">
      <Sidebar activePage="absensi" />

      <main className="flex-1 lg:ml-72 p-4 md:p-8 pt-24 lg:pt-8 transition-all duration-300">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Presensi Online</h2>
            <p className="text-slate-500 text-sm font-medium">Sistem absensi berbasis lokasi dan waktu server WIT.</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="bg-white border border-slate-200 rounded-2xl px-6 py-3 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status Kehadiran</p>
                <p className={`text-xs font-bold ${absensi?.check_in_time ? 'text-emerald-600' : 'text-slate-500'}`}>
                  {absensi?.check_in_time ? (absensi?.check_out_time ? 'Selesai' : 'Sedang Bekerja') : 'Belum Absen'}
                </p>
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Control */}
          <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-50 rounded-full -mr-24 -mt-24 opacity-50"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-6 mb-10">
                <div className="w-20 h-20 rounded-3xl bg-slate-50 flex flex-col items-center justify-center border border-slate-100 shadow-sm">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-tighter">
                    {witTime.toLocaleDateString('id-ID', { month: 'short' })}
                  </span>
                  <span className="text-3xl font-black text-slate-900">
                    {witTime.getUTCDate()}
                  </span>
                </div>
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                    {witTime.toLocaleDateString('id-ID', { weekday: 'long' })}
                  </h2>
                  <p className="text-slate-500 font-medium">
                    {witTime.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>

              {!canAbsen ? (
                <div className="bg-amber-50 border border-amber-100 rounded-3xl p-8 flex items-start gap-6">
                  <div className="p-3 bg-white rounded-2xl shadow-sm text-amber-600">
                    <AlertCircle size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-amber-900">Absensi Belum Dibuka</h3>
                    <p className="text-sm text-amber-700 leading-relaxed mt-1">
                      Fitur absensi hanya tersedia pada hari **Senin (Kantor)** dan **Jumat (Rumah)**.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${location ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-500 shadow-inner'}`}>
                      <Navigation size={24} className={location ? "animate-pulse" : ""} />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Koordinat Presisi</p>
                      <p className="text-sm font-black text-slate-700 font-mono">
                        {locationError ? (
                          <span className="text-rose-500">{locationError}</span>
                        ) : location ? (
                          `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`
                        ) : (
                          "Mencari sinyal GPS..."
                        )}
                      </p>
                    </div>
                    <button 
                      onClick={requestLocation}
                      className="px-5 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-blue-600 hover:border-blue-600 transition-all uppercase tracking-widest shadow-sm"
                    >
                      Kalibrasi
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <button
                      onClick={handleCheckIn}
                      disabled={actionLoading || !!absensi?.check_in_time}
                      className={`h-20 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] transition-all flex flex-col items-center justify-center gap-2 border-2 ${
                        absensi?.check_in_time 
                        ? 'bg-emerald-50 border-emerald-100 text-emerald-600 cursor-not-allowed'
                        : 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-500/20 active:scale-95'
                      }`}
                    >
                      {absensi?.check_in_time ? <CheckCircle2 size={24} /> : <ShieldCheck size={24} />}
                      {absensi?.check_in_time ? "Sudah Check-In" : "Check-In"}
                    </button>
                    
                    <button
                      onClick={handleCheckOut}
                      disabled={actionLoading || !absensi?.check_in_time || !!absensi?.check_out_time}
                      className={`h-20 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] transition-all flex flex-col items-center justify-center gap-2 border-2 ${
                        absensi?.check_out_time 
                        ? 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed'
                        : !absensi?.check_in_time
                        ? 'bg-slate-100 border-slate-100 text-slate-300 cursor-not-allowed opacity-50'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-blue-600 hover:text-blue-600 shadow-sm active:scale-95'
                      }`}
                    >
                      {absensi?.check_out_time ? <CheckCircle2 size={24} /> : <Clock size={24} />}
                      {absensi?.check_out_time ? "Sudah Check-Out" : "Check-Out"}
                    </button>
                  </div>

                  {message && (
                    <div className={`p-5 rounded-2xl text-xs font-bold flex items-center gap-4 animate-in fade-in slide-in-from-top-2 border ${
                      message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'
                    }`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${message.type === 'success' ? 'bg-emerald-100' : 'bg-rose-100'}`}>
                        {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                      </div>
                      {message.text}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Side Info */}
          <div className="space-y-8">
            <div className="bg-[#0F172A] rounded-[2.5rem] p-10 text-white shadow-xl flex flex-col justify-between h-full">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-8 border border-blue-500/30">
                  <Clock className="text-blue-400" size={28} />
                </div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">Live Server (WIT)</p>
                <h3 className="text-5xl font-black tracking-tighter text-white">
                  {witTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false })}
                  <span className="text-xl text-slate-500 font-medium ml-2">WIT</span>
                </h3>
                <p className="text-xs text-slate-400 mt-4 font-medium italic">Waktu Indonesia Timur (UTC+09:00)</p>
              </div>
              
              <div className="mt-12 space-y-6 pt-10 border-t border-slate-800">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Jam Operasional</span>
                  <span className="text-xs font-bold bg-slate-800 px-3 py-1 rounded-full">08:00 - 16:00</span>
                </div>
                <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-1/2"></div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-200 p-8 space-y-6">
               <h4 className="font-black text-slate-900 text-xs uppercase tracking-widest">Informasi Radius</h4>
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                    <Navigation size={18} />
                  </div>
                  <p className="text-[10px] text-slate-500 font-bold leading-relaxed">
                    Radius aman absensi adalah **100 meter** dari titik lokasi yang ditentukan.
                  </p>
               </div>
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                    <MapPin size={18} />
                  </div>
                  <p className="text-[10px] text-slate-500 font-bold leading-relaxed">
                    Pastikan GPS dalam mode **Akurasi Tinggi** dan izin lokasi browser aktif.
                  </p>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
