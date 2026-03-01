import React from 'react';
import { Menu, Bell } from 'lucide-react';
import { ViewType } from '../types';

interface HeaderProps {
  currentView: ViewType;
  onToggleSidebar: () => void;
}

export default function Header({ currentView, onToggleSidebar }: HeaderProps) {
  const titles: Record<ViewType, string> = {
    'dashboard': 'Dashboard Overview',
    'registry': 'Data Registry',
    'laporan': 'Laporan & Riset',
    'payment': 'Riwayat Pembayaran',
    'license': 'Status Lisensi Layanan',
    'add-registry': 'Input Data Registry'
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 z-10 flex-shrink-0">
      <div className="flex items-center gap-4">
        <button className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg" onClick={onToggleSidebar}>
          <Menu className="w-6 h-6" />
        </button>
        <h2 className="text-lg font-bold text-slate-800 hidden md:block">
          {titles[currentView] || 'Dashboard'}
        </h2>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        <div className="flex items-center gap-2">
          <button className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-full relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
        </div>
      </div>
    </header>
  );
}
