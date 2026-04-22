import { NavLink, Outlet } from 'react-router-dom';
import { FolderOpen, UploadCloud, FileText, ChevronRight } from 'lucide-react';
import clsx from 'classnames';

export default function DossierLayout() {
  const navItems = [
    { name: 'Dashboard Dossier', href: '/dossier', icon: FolderOpen, end: true },
    { name: 'Upload Dokumen', href: '/dossier/upload', icon: UploadCloud, end: false },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex flex-col md:flex-row">
      {/* Sidebar - Glassmorphism style */}
      <aside className="w-full md:w-64 bg-slate-900/50 backdrop-blur-xl border-r border-slate-800/60 p-6 flex flex-col gap-8 shadow-2xl relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
            <FileText size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Digital Dossier
            </h1>
            <p className="text-xs text-slate-400">SI KEPEGAWAIAN</p>
          </div>
        </div>

        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end={item.end}
              className={({ isActive }) => clsx(
                "flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group",
                isActive 
                  ? "bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(37,99,235,0.1)]" 
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon size={18} className="transition-transform group-hover:scale-110" />
                <span className="font-medium text-sm">{item.name}</span>
              </div>
              <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </NavLink>
          ))}
        </nav>

        {/* Decorative elements */}
        <div className="mt-auto relative rounded-2xl p-4 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
          <p className="text-xs text-slate-400 relative z-10 leading-relaxed">
            Pastikan semua dokumen diunggah dalam format PDF atau gambar dengan resolusi yang jelas.
          </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/20 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-cyan-900/10 blur-[100px] pointer-events-none"></div>
        
        <div className="flex-1 overflow-y-auto p-6 md:p-10 relative z-10 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
