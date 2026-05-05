import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Calendar, 
  Award, 
  Clock, 
  FolderHeart,
  ChevronLeft,
  ChevronRight,
  Bell,
  LogOut,
  Menu,
  X
} from 'lucide-react';

export default function Sidebar({ activePage = 'dashboard' }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close mobile sidebar on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/' },
    { id: 'pegawai', label: 'Data Pegawai', icon: Users, href: '/pegawai' },
    { id: 'absensi', label: 'Absensi Online', icon: Clock, href: '/absensi' },
    { id: 'skp', label: 'SKP & Kinerja', icon: FileText, href: '/skp' },
    { id: 'kgb', label: 'Layanan KGB', icon: Calendar, href: '/kgb' },
    { id: 'pangkat', label: 'Kenaikan Pangkat', icon: Award, href: '/kenaikan-pangkat' },
    { id: 'cuti', label: 'Cuti & Izin', icon: Calendar, href: '/cuti' },
    { id: 'dossier', label: 'Digital Dossier', icon: FolderHeart, href: '/dossier' },
  ];

  const sidebarContent = (
    <>
      {/* Logo Section */}
      <div className="p-6 flex items-center justify-between border-b border-white/5 mb-4">
        <div className={`flex items-center gap-3 overflow-hidden ${(isCollapsed && !isMobileOpen) ? 'lg:opacity-0' : 'opacity-100'}`}>
          <div className="w-10 h-10 bg-[#FFCC00] rounded-xl flex items-center justify-center text-[#003366] shadow-lg shadow-yellow-500/20 flex-shrink-0">
            <span className="font-black text-xl">P</span>
          </div>
          <div className="whitespace-nowrap">
            <h1 className="text-white font-black text-lg tracking-tighter uppercase">SIMPEG<span className="text-[#FFCC00]">PUPR</span></h1>
            <p className="text-[9px] font-bold text-yellow-500/80 uppercase tracking-[0.2em]">Papua Barat Daya</p>
          </div>
        </div>
        
        {/* Desktop Collapse Toggle */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-500"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>

        {/* Mobile Close Toggle */}
        <button 
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-500"
        >
          <X size={24} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto no-scrollbar">
        {menuItems.map((item) => (
          <a
            key={item.id}
            href={item.href}
            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all group ${
              activePage === item.id 
                ? 'bg-[#FFCC00] text-[#003366] shadow-lg shadow-yellow-500/10' 
                : 'hover:bg-white/5 text-slate-300 hover:text-white'
            }`}
          >
            <item.icon size={20} className={activePage === item.id ? 'text-[#003366]' : 'text-slate-400 group-hover:text-[#FFCC00]'} />
            <span className={`font-bold text-sm transition-opacity duration-300 ${(isCollapsed && !isMobileOpen) ? 'lg:opacity-0 lg:w-0' : 'opacity-100'}`}>
              {item.label}
            </span>
            {!(isCollapsed && !isMobileOpen) && activePage === item.id && (
              <div className="ml-auto w-1.5 h-1.5 bg-[#003366] rounded-full"></div>
            )}
          </a>
        ))}
      </nav>

      {/* Footer / User Area */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/50">
        <a 
          href="/account/logout"
          className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-rose-500/10 hover:text-rose-400 transition-all group"
        >
          <LogOut size={20} className="group-hover:text-rose-400" />
          <span className={`font-bold text-xs uppercase tracking-widest ${(isCollapsed && !isMobileOpen) ? 'lg:opacity-0 lg:w-0' : 'opacity-100'}`}>
            Keluar Sistem
          </span>
        </a>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Header (Only visible on small screens) */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-40 flex items-center justify-between px-6">
         <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
               <span className="font-black text-sm">S</span>
            </div>
            <h1 className="text-slate-900 font-black text-sm tracking-tighter">SIMPEG<span className="text-blue-600">DIGITAL</span></h1>
         </div>
         <button 
           onClick={() => setIsMobileOpen(true)}
           className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
         >
           <Menu size={24} />
         </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Desktop & Mobile Drawer */}
      <aside 
        className={`fixed left-0 top-0 h-screen bg-[#003366] text-slate-400 transition-all duration-300 border-r border-white/5 flex flex-col
          ${isMobileOpen ? 'translate-x-0 w-72 z-[70]' : '-translate-x-full lg:translate-x-0'} 
          ${isCollapsed ? 'lg:w-20' : 'lg:w-72'} 
          z-50`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
