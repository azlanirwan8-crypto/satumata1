import React, { useState } from 'react';
import { PlusCircle, Database, ArrowLeft, ShoppingCart, BarChart2, FolderOpen, Download, Filter, Search, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import * as XLSX from 'xlsx';
import { RequestHistoryItem } from '../types';
import { VARIABLE_SETS } from '../constants';
import { cn } from '../lib/utils';

interface LaporanViewProps {
  history: RequestHistoryItem[];
  onRequest: (data: any) => void;
}

export default function LaporanView({ history, onRequest }: LaporanViewProps) {
  const [activeTab, setActiveTab] = useState<'visual' | 'history'>('visual');
  const [showForm, setShowForm] = useState(false);
  const [selectedRegistry, setSelectedRegistry] = useState('');
  const [selectedVars, setSelectedVars] = useState<string[]>([]);
  const [hasAddon, setHasAddon] = useState(false);
  const [openAccordions, setOpenAccordions] = useState<string[]>([]);

  const totalCost = (selectedVars.length * 50000) + (hasAddon ? 500000 : 0);

  const toggleVar = (v: string) => {
    setSelectedVars(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);
  };

  const toggleAccordion = (id: string) => {
    setOpenAccordions(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleExport = (registry: string) => {
    const data = [
      { Registry: registry, Variable: 'Diagnosis', Label: 'Kategori A', Count: 40 },
      { Registry: registry, Variable: 'Diagnosis', Label: 'Kategori B', Count: 30 },
    ];
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data Laporan");
    XLSX.writeFile(wb, `${registry}_Report.xlsx`);
  };

  return (
    <div className="fade-in relative">
      {!showForm ? (
        <>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 font-display">Laporan & Permintaan Data Riset</h1>
              <p className="text-slate-500 mt-1">Pusat analisis data registry dan layanan permintaan variabel.</p>
            </div>
            <button 
              onClick={() => setShowForm(true)}
              className="bg-brand-600 hover:bg-brand-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-lg shadow-brand-200 flex items-center gap-2 transition-all hover:scale-105"
            >
              <PlusCircle className="w-5 h-5" /> Request Variabel Baru
            </button>
          </div>

          <div className="flex border-b border-slate-200 mb-6 gap-6">
            <button 
              className={cn("tab-btn", activeTab === 'visual' && "active")}
              onClick={() => setActiveTab('visual')}
            >
              Laporan Visual (Grafik)
            </button>
            <button 
              className={cn("tab-btn", activeTab === 'history' && "active")}
              onClick={() => setActiveTab('history')}
            >
              Riwayat Request
            </button>
          </div>

          {activeTab === 'visual' ? (
            <div className="space-y-4">
              {history.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
                  <BarChart2 className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                  <h3 className="text-slate-600 font-bold">Belum ada data untuk ditampilkan</h3>
                  <p className="text-sm text-slate-400">Lakukan request variabel terlebih dahulu.</p>
                </div>
              ) : (
                Object.entries(
                  history.reduce((acc, req) => {
                    if (!acc[req.registry]) acc[req.registry] = new Set();
                    req.variables.forEach(v => acc[req.registry].add(v));
                    return acc;
                  }, {} as Record<string, Set<string>>)
                ).map(([registry, variables]) => (
                  <div key={registry} className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">
                    <div 
                      className="w-full flex justify-between items-center p-4 bg-slate-50 border-b border-slate-100 cursor-pointer"
                      onClick={() => toggleAccordion(registry)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-brand-600 shadow-sm">
                          <FolderOpen className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <h3 className="font-bold text-slate-700">{registry}</h3>
                          <div className="text-xs text-slate-500">{variables.size} Variabel Terpilih</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleExport(registry); }}
                          className="bg-white hover:bg-emerald-50 text-emerald-600 border border-emerald-200 text-xs font-bold px-3 py-2 rounded-lg shadow-sm transition-all flex items-center gap-1"
                        >
                          <Download className="w-3 h-3" /> Export
                        </button>
                        <span className="text-xs font-bold text-slate-500 px-3 py-2 rounded-lg hover:bg-slate-100">
                          {openAccordions.includes(registry) ? 'Tutup Laporan' : 'Lihat Laporan'}
                        </span>
                      </div>
                    </div>
                    
                    <div className={cn("accordion-content", openAccordions.includes(registry) && "open")}>
                      <div className="p-4 bg-slate-50/50 border-b border-slate-100">
                        <div className="flex flex-wrap gap-4 items-end">
                          <div className="w-full sm:w-auto flex-1 min-w-[140px]">
                            <label className="block text-xs font-bold text-slate-500 mb-1">Gender</label>
                            <select className="w-full text-xs border border-slate-200 rounded px-2 py-2 bg-white outline-none focus:border-brand-500">
                              <option value="all">Semua Gender</option>
                              <option value="L">Laki-laki</option>
                              <option value="P">Perempuan</option>
                            </select>
                          </div>
                          <div className="w-full md:w-auto flex gap-2 ml-auto mt-2 md:mt-0">
                            <button className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold px-4 py-2 rounded shadow-sm transition-all flex items-center justify-center gap-1">
                              <Filter className="w-3 h-3" /> Terapkan
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {Array.from(variables).map(v => (
                          <div key={v} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                            <h4 className="font-bold text-slate-700 mb-4 text-xs uppercase flex items-center justify-between tracking-wide">
                              {v}
                              <button className="text-[10px] text-brand-600 bg-brand-50 px-2 py-1 rounded border border-brand-100">XLS</button>
                            </h4>
                            <div className="h-56">
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={[{name: 'A', value: 40}, {name: 'B', value: 30}, {name: 'C', value: 20}]}>
                                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                  <XAxis dataKey="name" tick={{fontSize: 10}} />
                                  <YAxis tick={{fontSize: 10}} />
                                  <Tooltip />
                                  <Bar dataKey="value" fill="#0d9488" radius={[4, 4, 0, 0]} />
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-card border border-slate-200 overflow-hidden">
              <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <h3 className="text-lg font-bold text-slate-800">Riwayat Request</h3>
                <div className="relative w-full sm:w-64">
                  <input type="text" placeholder="Cari ID Request..." className="text-sm border border-slate-300 rounded-lg pl-9 pr-3 py-2 bg-white text-slate-700 outline-none focus:border-brand-500 w-full shadow-sm" />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                </div>
              </div>
              <table className="data-table w-full">
                <thead>
                  <tr><th>ID Transaksi</th><th>Tanggal</th><th>Registry</th><th>Variabel</th><th>Total Biaya</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {history.length === 0 ? (
                    <tr><td colSpan={6} className="p-8 text-center text-slate-400 italic">Belum ada riwayat request.</td></tr>
                  ) : (
                    history.map(req => (
                      <tr key={req.id} className="hover:bg-slate-50 border-b border-slate-50">
                        <td className="px-6 py-4 font-mono text-xs font-bold text-slate-600">{req.id}</td>
                        <td className="px-6 py-4 text-sm text-slate-500">{req.date}</td>
                        <td className="px-6 py-4 text-sm font-bold text-slate-700">{req.registry}</td>
                        <td className="px-6 py-4 text-xs text-slate-500 max-w-xs truncate">{req.variables.join(", ")}</td>
                        <td className="px-6 py-4 text-sm font-bold text-brand-700">Rp {req.cost.toLocaleString('id-ID')}</td>
                        <td className="px-6 py-4"><span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase">Lunas</span></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-2xl shadow-card border border-slate-200 overflow-hidden mb-8">
          <div className="p-6 bg-slate-900 text-white border-b border-slate-800">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <button 
                  onClick={() => setShowForm(false)}
                  className="mb-4 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 w-fit"
                >
                  <ArrowLeft className="w-4 h-4" /> Kembali ke Laporan
                </button>
                <h2 className="text-xl font-bold text-brand-400 flex items-center gap-2"><Database className="w-5 h-5" /> Form Request Data</h2>
                <p className="text-slate-400 text-sm mt-1">Pilih variabel spesifik untuk dianalisis.</p>
              </div>
              <div className="bg-slate-800 px-4 py-2 rounded-lg border border-slate-700 text-right">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">Estimasi Biaya</div>
                <div className="text-xl font-bold text-brand-400">Rp {totalCost.toLocaleString('id-ID')}</div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-700 mb-2">1. Pilih Sumber Registry</label>
              <select 
                value={selectedRegistry}
                onChange={(e) => { setSelectedRegistry(e.target.value); setSelectedVars([]); }}
                className="border border-slate-300 rounded-lg px-4 py-2 text-sm bg-white focus:border-brand-500 outline-none w-full md:w-64"
              >
                <option value="" disabled>-- Pilih Modul --</option>
                <option value="uveitis">Registry Uveitis</option>
                <option value="fundus">Registry Fundus/Retina</option>
                <option value="ulkus">Registry Ulkus Kornea</option>
              </select>
            </div>

            {!selectedRegistry ? (
              <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-xl">
                <div className="text-slate-400 text-sm">Silakan pilih modul registry terlebih dahulu untuk melihat variabel.</div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3">2. Pilih Variabel Riset (Rp 50.000 / variabel)</label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {VARIABLE_SETS[selectedRegistry].map(v => (
                    <label key={v} className="cursor-pointer relative">
                      <input 
                        type="checkbox" 
                        className="hidden" 
                        checked={selectedVars.includes(v)}
                        onChange={() => toggleVar(v)}
                      />
                      <div className={cn(
                        "border rounded-lg p-3 transition-all bg-white h-full flex items-center justify-between",
                        selectedVars.includes(v) ? "border-brand-600 bg-brand-50" : "border-slate-200 hover:border-brand-300"
                      )}>
                        <span className="text-sm text-slate-700 font-medium">{v}</span>
                        {selectedVars.includes(v) && <CheckCircle className="w-4 h-4 text-brand-600" />}
                      </div>
                    </label>
                  ))}
                </div>
                <div className="mb-6 p-4 bg-brand-50 rounded-xl border border-brand-100 flex items-start gap-3">
                  <input 
                    type="checkbox" 
                    id="addonImage" 
                    checked={hasAddon}
                    onChange={(e) => setHasAddon(e.target.checked)}
                    className="mt-1 w-5 h-5 text-brand-600 rounded border-slate-300 focus:ring-brand-500" 
                  />
                  <div>
                    <label htmlFor="addonImage" className="text-sm font-bold text-slate-800 block cursor-pointer">Sertakan file gambar asli. Fundus atau Anterior.</label>
                    <p className="text-xs text-slate-600 mt-1">Biaya tambahan Rp 500.000. Ukuran file besar. Link download terpisah.</p>
                  </div>
                </div>
                <div className="flex justify-end pt-6 border-t border-slate-100 mt-6 gap-3">
                  <button onClick={() => setShowForm(false)} className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all">Batal</button>
                  <button 
                    onClick={() => {
                      onRequest({ registry: selectedRegistry, variables: selectedVars, cost: totalCost, image: hasAddon });
                      setShowForm(false);
                    }}
                    className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-brand-200 transition-all flex items-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" /> Proses Pembayaran
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
