import React, { useState } from 'react';
import { Files, Eye, Aperture, Droplet, Plus, Search, Trash2, Edit3 } from 'lucide-react';
import { RegistryEntry } from '../types';
import { cn } from '../lib/utils';

interface RegistryViewProps {
  data: RegistryEntry[];
  onAddData: (type: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onView: (id: string) => void;
}

export default function RegistryView({ data, onAddData, onDelete, onEdit, onView }: RegistryViewProps) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filteredData = data.filter(item => {
    const matchType = filter === 'all' || item.type === filter;
    const matchSearch = item.id.toLowerCase().includes(search.toLowerCase()) || 
                        item.diag.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const getCount = (type: string) => data.filter(d => d.type === type).length;

  return (
    <div className="fade-in">
      <div className="bg-gradient-to-r from-brand-800 to-brand-600 rounded-2xl p-6 shadow-lg mb-8 text-white relative overflow-hidden flex items-center justify-between">
        <div className="relative z-10">
          <h2 className="text-brand-100 text-sm font-bold uppercase tracking-wider mb-1">Total Akumulasi Laporan</h2>
          <div className="text-4xl font-display font-bold">{data.length} <span className="text-lg font-medium text-brand-200">Kasus</span></div>
          <p className="text-xs text-brand-100 mt-2 opacity-80">Data akumulasi seluruh registry (Anonymized).</p>
        </div>
        <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm relative z-10">
          <Files className="w-8 h-8 text-white" />
        </div>
        <div className="absolute -right-10 -bottom-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Module: Uveitis */}
        <div className="module-card group hover:border-emerald-500" onClick={() => setFilter('Uveitis')}>
          <div className="flex justify-between items-start mb-3">
            <div className="module-icon-wrapper bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Eye className="w-6 h-6" />
            </div>
            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider border border-emerald-100">Aktif</span>
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">Registry Uveitis</h3>
          <div className="text-2xl font-bold text-slate-800 mb-4">{getCount('Uveitis')} <span className="text-xs font-normal text-slate-500">Laporan</span></div>
          <div className="flex items-center justify-end pt-3 border-t border-slate-100">
            <button 
              onClick={(e) => { e.stopPropagation(); onAddData('Uveitis'); }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 shadow-sm hover:shadow-md"
            >
              <Plus className="w-3 h-3" /> Tambah Data
            </button>
          </div>
        </div>

        {/* Module: Fundus */}
        <div className="module-card group hover:border-blue-500" onClick={() => setFilter('Fundus')}>
          <div className="flex justify-between items-start mb-3">
            <div className="module-icon-wrapper bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Aperture className="w-6 h-6" />
            </div>
            <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider border border-blue-100">Aktif</span>
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">Registry Fundus</h3>
          <div className="text-2xl font-bold text-slate-800 mb-4">{getCount('Fundus')} <span className="text-xs font-normal text-slate-500">Laporan</span></div>
          <div className="flex items-center justify-end pt-3 border-t border-slate-100">
            <button 
              onClick={(e) => { e.stopPropagation(); onAddData('Fundus'); }}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 shadow-sm hover:shadow-md"
            >
              <Plus className="w-3 h-3" /> Tambah Data
            </button>
          </div>
        </div>

        {/* Module: Ulkus */}
        <div className="module-card group hover:border-amber-500" onClick={() => setFilter('Ulkus')}>
          <div className="flex justify-between items-start mb-3">
            <div className="module-icon-wrapper bg-amber-100 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Droplet className="w-6 h-6" />
            </div>
            <span className="bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider border border-amber-100">Aktif</span>
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">Registry Ulkus</h3>
          <div className="text-2xl font-bold text-slate-800 mb-4">{getCount('Ulkus')} <span className="text-xs font-normal text-slate-500">Laporan</span></div>
          <div className="flex items-center justify-end pt-3 border-t border-slate-100">
            <button 
              onClick={(e) => { e.stopPropagation(); onAddData('Ulkus'); }}
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 shadow-sm hover:shadow-md"
            >
              <Plus className="w-3 h-3" /> Tambah Data
            </button>
          </div>
        </div>

        <div className="module-card group border-dashed border-2 border-slate-300 bg-slate-50/50 hover:border-brand-400 hover:bg-brand-50/30 flex flex-col justify-center items-center text-center cursor-pointer transition-all min-h-[180px]">
          <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center mb-2 group-hover:scale-110 group-hover:border-brand-300 transition-all shadow-sm">
            <Plus className="w-6 h-6 text-slate-400 group-hover:text-brand-600" />
          </div>
          <h3 className="text-sm font-bold text-slate-700 group-hover:text-brand-700">Tambah Layanan</h3>
          <p className="text-[10px] text-slate-500 mt-1 max-w-[180px]">Aktifkan paket registry spesialis lain sesuai kebutuhan faskes Anda.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col lg:flex-row justify-between lg:items-center gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Tabel Data Laporan</h3>
            <p className="text-xs text-slate-500">Data registry anonim.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-700 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 shadow-sm w-full sm:w-auto cursor-pointer"
            >
              <option value="all">Semua Registry</option>
              <option value="Uveitis">Uveitis</option>
              <option value="Fundus">Fundus</option>
              <option value="Ulkus">Ulkus</option>
            </select>
            <div className="relative w-full sm:w-64">
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari ID, Diagnosis..." 
                className="text-sm border border-slate-300 rounded-lg pl-9 pr-3 py-2 bg-white text-slate-700 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 w-full shadow-sm transition-colors"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
            <button 
              onClick={() => onAddData('all')}
              className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm whitespace-nowrap active:scale-95"
            >
              <Plus className="w-4 h-4" /> Tambah Data
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table w-full">
            <thead>
              <tr><th>ID Laporan</th><th>Jenis Registry</th><th>Diagnosis Utama</th><th>Tanggal Input</th><th className="text-right">Aksi</th></tr>
            </thead>
            <tbody id="registryTableBody">
              {filteredData.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-400 italic">Tidak ada data ditemukan.</td></tr>
              ) : (
                filteredData.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors border-b border-slate-50">
                    <td className="px-6 py-4 text-sm font-mono font-bold text-slate-700">{item.id}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2 py-1 rounded text-[10px] font-bold uppercase",
                        item.type === 'Glaukoma' ? 'bg-emerald-100 text-emerald-700' : 
                        item.type === 'Retina' || item.type === 'Fundus' ? 'bg-blue-100 text-blue-700' : 
                        'bg-amber-100 text-amber-700'
                      )}>
                        {item.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{item.diag}</td>
                    <td className="px-6 py-4 text-xs text-slate-500">{item.date}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => onView(item.id)} className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded transition-colors"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => onEdit(item.id)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"><Edit3 className="w-4 h-4" /></button>
                        <button onClick={() => onDelete(item.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
          <span>Menampilkan {filteredData.length} dari {data.length} data</span>
          <div className="flex gap-1">
            <button className="px-2 py-1 border rounded hover:bg-slate-50">Prev</button>
            <button className="px-2 py-1 border rounded bg-brand-50 text-brand-700 border-brand-200">1</button>
            <button className="px-2 py-1 border rounded hover:bg-slate-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
