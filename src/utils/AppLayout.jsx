/**
 * Shared Navigation component for SI Kepegawaian
 * Used across all module pages for consistent header + nav
 */

import { Bell } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard" },
  { href: "/pegawai", label: "Data Pegawai" },
  { href: "/skp", label: "SKP" },
  { href: "/kgb", label: "KGB" },
  { href: "/kenaikan-pangkat", label: "Kenaikan Pangkat" },
  { href: "/cuti", label: "Cuti & Izin" },
  { href: "/dossier", label: "Digital Dossier" },
];

export default function AppLayout({ children, pegawai, activeHref, notifCount = 0 }) {
  const currentPath =
    typeof window !== "undefined" ? window.location.pathname : activeHref;

  return (
    <div className="min-h-screen bg-[#F9FAFB]" style={{ fontFamily: "Inter, -apple-system, sans-serif" }}>
      {/* Header */}
      <div className="bg-white border-b border-[#E5E7EB] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src="https://ucarecdn.com/f5ae1e2c-7229-43a4-a8ad-ae05a4f4cac4/-/format/auto/"
                alt="Logo PUPR Papua Barat Daya"
                className="h-12 w-12 object-contain"
              />
              <div>
                <h1 className="text-lg font-semibold text-[#111827] tracking-tight">
                  S-Kepegawaian
                </h1>
                <p className="text-xs text-[#6B7280]">Dinas PUPR Papua Barat Daya</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a href="/notifikasi" className="relative p-2 hover:bg-[#F9FAFB] rounded-lg transition-colors">
                <Bell size={20} className="text-[#6B7280]" />
                {notifCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-[#EA580C] rounded-full" />
                )}
              </a>
              <div className="flex items-center gap-3 pl-4 border-l border-[#E5E7EB]">
                <div className="text-right">
                  <p className="text-sm font-medium text-[#111827]">
                    {pegawai?.nama_lengkap || "Pengguna"}
                  </p>
                  <p className="text-xs text-[#6B7280]">
                    {pegawai?.role === "admin"
                      ? "Administrator"
                      : pegawai?.role === "pimpinan"
                        ? "Pimpinan"
                        : "Pegawai"}
                  </p>
                </div>
                <a href="/account/logout" className="text-xs text-[#6B7280] hover:text-[#2563EB]">
                  Keluar
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-6 overflow-x-auto">
          <nav className="flex gap-0 min-w-max">
            {NAV_ITEMS.map((item) => {
              const isActive = currentPath === item.href ||
                (item.href !== "/" && currentPath?.startsWith(item.href));
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`py-3 px-4 border-b-2 text-sm whitespace-nowrap transition-colors -mb-[1px] ${
                    isActive
                      ? "border-[#2563EB] font-medium text-[#111827]"
                      : "border-transparent text-[#6B7280] hover:text-[#111827] hover:border-[#E5E7EB]"
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Page Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </div>
    </div>
  );
}
