import React from 'react';
import { ScanEye, LayoutGrid, Database, ClipboardList, Receipt, BadgeCheck, Settings, LogOut, X } from 'lucide-react';
import { ViewType } from '../types';
import { cn } from '../lib/utils';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  isOpen: boolean;
  onToggle: () => void;
  onLogout: () => void;
}

export default function Sidebar({ currentView, onViewChange, isOpen, onToggle, onLogout }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid, section: 'Utama' },
    { id: 'registry', label: 'Data Registry', icon: Database, section: 'Utama' },
    { id: 'laporan', label: 'Laporan & Riset', icon: ClipboardList, section: 'Utama' },
    { id: 'payment', label: 'Riwayat Pembayaran', icon: Receipt, section: 'Keuangan & Lisensi' },
    { id: 'license', label: 'Lisensi Layanan', icon: BadgeCheck, section: 'Keuangan & Lisensi' },
  ];

  const sections = ['Utama', 'Keuangan & Lisensi', 'Akun'];

  return (
    <aside className={cn(
      "w-64 bg-brand-900 border-r border-brand-800 flex flex-col flex-shrink-0 z-20 transition-all duration-300 shadow-xl",
      isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
      "fixed md:relative h-full"
    )}>
      <div className="h-16 flex items-center px-6 border-b border-brand-800 justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/10 text-white p-1.5 rounded-lg border border-white/10">
            <ScanEye className="w-5 h-5" />
          </div>
          <h1 className="font-display font-bold text-white text-lg tracking-tight">
            Netra<span className="text-brand-200">Log</span>
          </h1>
        </div>
        <button className="md:hidden text-white/70 hover:text-white" onClick={onToggle}>
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-grow overflow-y-auto p-4 space-y-2 no-scrollbar">
        {sections.map(section => (
          <div key={section}>
            <div className="sidebar-title">{section}</div>
            {section === 'Akun' ? (
              <a className="sidebar-link">
                <Settings className="sidebar-icon w-5 h-5" /> Pengaturan
              </a>
            ) : (
              navItems.filter(item => item.section === section).map(item => (
                <a
                  key={item.id}
                  onClick={() => onViewChange(item.id as ViewType)}
                  className={cn(
                    "sidebar-link",
                    currentView === item.id && "active"
                  )}
                >
                  <item.icon className="sidebar-icon w-5 h-5" /> {item.label}
                </a>
              ))
            )}
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-brand-800 bg-brand-950/50">
        <div className="flex items-center gap-3">
          <img src="https://ui-avatars.com/api/?name=Dr+Andi&background=0d9488&color=fff" className="w-9 h-9 rounded-full border border-brand-700 shadow-sm" alt="Avatar" />
          <div className="flex-grow min-w-0">
            <div className="text-sm font-bold text-white truncate">Dr. Andi Sp.M(K)</div>
            <div className="text-xs text-brand-300 truncate">RS Mata Nasional</div>
          </div>
          <button 
            onClick={onLogout}
            className="p-2 text-brand-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
            title="Keluar"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
