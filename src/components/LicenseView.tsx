import React from 'react';
import { PlusCircle, Eye, Aperture, Droplet, AlertCircle } from 'lucide-react';
import { License } from '../types';

interface LicenseViewProps {
  licenses: License[];
  onRenew: (id: number) => void;
  onAdd: () => void;
}

export default function LicenseView({ licenses, onRenew, onAdd }: LicenseViewProps) {
  return (
    <div className="fade-in">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 font-display">Lisensi Layanan</h1>
          <p className="text-slate-500 mt-1">Status berlangganan modul registry Anda.</p>
        </div>
        <button 
          onClick={onAdd}
          className="bg-brand-600 hover:bg-brand-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-lg shadow-brand-200 flex items-center gap-2 transition-all hover:scale-105"
        >
          <PlusCircle className="w-5 h-5" /> Tambah Layanan Baru
        </button>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {licenses.map(license => {
          const today = new Date();
          const expiry = new Date(license.expiry);
          const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          
          const isNearExpiry = diffDays <= 30;
          const Icon = license.type === 'Glaukoma' ? Eye : license.type === 'Retina' ? Aperture : Droplet;

          return (
            <div key={license.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center text-brand-600">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">{license.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${isNearExpiry ? "bg-amber-100 text-amber-700 border-amber-200" : "bg-emerald-100 text-emerald-700 border-emerald-200"}`}>
                      {license.status}
                    </span>
                    <span className="text-xs text-slate-500">Berlaku s/d {license.expiry}</span>
                  </div>
                  {isNearExpiry && (
                    <span className="text-amber-600 text-xs font-bold flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" /> Segera Habis ({diffDays} hari)
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4 w-full md:w-auto border-t md:border-t-0 border-slate-100 pt-4 md:pt-0">
                <div className="text-right hidden md:block">
                  <div className="text-xs text-slate-400">Biaya Tahunan</div>
                  <div className="font-bold text-slate-700">Rp {license.cost.toLocaleString('id-ID')}</div>
                </div>
                <button 
                  onClick={() => onRenew(license.id)}
                  className="flex-1 md:flex-none bg-white border border-slate-300 hover:border-brand-500 hover:text-brand-600 text-slate-600 px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-sm"
                >
                  Perpanjang
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
