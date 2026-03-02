import React, { useState, useEffect } from 'react';
import { 
  LayoutGrid, Database, ClipboardList, Receipt, BadgeCheck, 
  Settings, LogOut, Bell, Menu, X, ScanEye, Files, FilePlus, 
  Activity, ArrowRight, Search, Plus, User, Save, ArrowLeft,
  FolderOpen, Download, Filter, AlertTriangle, CheckCircle,
  Eye, Aperture, Droplet, Edit3, Trash2, ShoppingCart
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';

import UveitisRegistry from './UveitisRegistry';
import UlkusRegistry from './UlkusRegistry';
import FundusRegistry from './FundusRegistry';

interface NetraLogRegistryDashboardProps {
  onBack: () => void;
  onNavigateToMarketplace?: () => void;
  userName: string;
  activeRegistries: string[]; // ['Uveitis', 'Fundus', 'Ulkus']
}

export default function NetraLogRegistryDashboard({ onBack, onNavigateToMarketplace, userName, activeRegistries }: NetraLogRegistryDashboardProps) {
  const [activeView, setActiveView] = useState<'dashboard' | 'registry' | 'laporan' | 'payment' | 'license' | 'add-registry' | 'uveitis-registry' | 'ulkus-registry' | 'fundus-registry'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedRegistryForAdd, setSelectedRegistryForAdd] = useState<string>('all');
  const [laporanTab, setLaporanTab] = useState<'visual' | 'history'>('visual');
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [selectedSourceRegistry, setSelectedSourceRegistry] = useState<string>('');
  const [selectedVariables, setSelectedVariables] = useState<string[]>([]);
  const [includeImages, setIncludeImages] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentContext, setPaymentContext] = useState<'request' | 'license' | 'add_service'>('request');
  const [requestHistory, setRequestHistory] = useState<any[]>([]);
  const [transactionHistory, setTransactionHistory] = useState<any[]>([
    { id: 'TRX-9981', date: '2024-05-15', item: 'Perpanjangan Registry Glaukoma', method: 'QRIS', amount: 1500000, status: 'Lunas' },
    { id: 'TRX-8822', date: '2024-04-10', item: 'Request Variabel (Uveitis)', method: 'VA BCA', amount: 150000, status: 'Lunas' },
    { id: 'TRX-7731', date: '2024-01-20', item: 'Paket Bundling Awal Tahun', method: 'Transfer Bank', amount: 3500000, status: 'Lunas' }
  ]);
  const [activeLicenses, setActiveLicenses] = useState<any[]>([
    { id: 1, name: 'Registry Glaukoma', type: 'Glaukoma', status: 'Aktif', expiry: '2025-12-31', cost: 1500000 },
    { id: 2, name: 'Registry Retina', type: 'Retina', status: 'Aktif', expiry: '2025-11-20', cost: 2000000 },
    { id: 3, name: 'Registry Ulkus Kornea', type: 'Ulkus', status: 'Aktif', expiry: '2024-06-15', cost: 1500000 }
  ]);

  const variableSets: Record<string, string[]> = {
    'uveitis': ['Diagnosis Utama', 'Lokasi Anatomi', 'Onset & Course', 'Visus Awal (LogMAR)', 'TIO Awal'],
    'fundus': ['Diagnosis Retina', 'Status Makula', 'CDR (Cup Disc Ratio)', 'Pendarahan Retina', 'Visus BCVA'],
    'ulkus': ['Ukuran Ulkus (mm)', 'Kedalaman (Depth)', 'Lokasi Infiltrat', 'Hasil Gram/KOH', 'Outcome Visus']
  };

  const calculateTotalCost = () => {
    let total = selectedVariables.length * 50000;
    if (includeImages) total += 500000;
    return total;
  };

  const COLORS = ['#0d9488', '#0f766e', '#3b82f6', '#f59e0b'];

  // Mock Data
  const diagnosisData = [
    { name: 'Jan', total: 65 },
    { name: 'Feb', total: 59 },
    { name: 'Mar', total: 80 },
    { name: 'Apr', total: 81 },
    { name: 'Mei', total: 56 },
    { name: 'Jun', total: 95 },
  ];

  const recentPatients = [
    { id: 'REG-2024-001', diagnosis: 'Glaukoma' },
    { id: 'REG-2024-002', diagnosis: 'Retina' },
    { id: 'REG-2024-003', diagnosis: 'Ulkus' },
  ];

  const [registryData, setRegistryData] = useState([
    { id: "REG-001", type: "Uveitis", diag: "Anterior Uveitis", date: "2026-01-08" },
    { id: "REG-002", type: "Fundus", diag: "Diabetic Retinopathy (PDR)", date: "2026-01-07" },
    { id: "REG-003", type: "Ulkus", diag: "Ulkus Kornea Bakteri", date: "2026-01-05" }
  ]);

  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = registryData.filter(item => {
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesSearch = item.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.diag.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const switchView = (view: typeof activeView) => {
    setActiveView(view);
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const renderDashboard = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 font-display">Selamat Pagi, {userName} 👋</h1>
          <p className="text-slate-500 mt-1">Ringkasan aktivitas penelitian Anda hari ini.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-500 shadow-sm flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Online
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Laporan" value="1,248" trend="+12%" icon={<Files className="w-5 h-5" />} color="brand" />
        <StatCard title="Entri Bulan Ini" value="86" trend="+5 hari ini" icon={<FilePlus className="w-5 h-5" />} color="blue" />
        <StatCard title="Top Diagnosis" value="POAG" subtitle="Glaukoma" icon={<Activity className="w-5 h-5" />} color="amber" />
        <div 
          onClick={() => switchView('registry')}
          className="bg-teal-600 text-white rounded-2xl p-5 border-none flex flex-col justify-center items-center text-center cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all"
        >
          <div className="bg-white/20 p-3 rounded-full mb-3 backdrop-blur-sm">
            <ArrowRight className="w-6 h-6 text-white" />
          </div>
          <div className="font-bold text-lg">Buka Registry</div>
          <div className="text-xs text-teal-100 mt-1">Lihat semua modul</div>
        </div>
      </div>

      {/* Charts & Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-bold text-slate-700 mb-6">Tren Diagnosa</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={diagnosisData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar dataKey="total" fill="#0d9488" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-bold text-slate-700">Pasien Terakhir</h3>
          </div>
          <div className="flex-grow overflow-y-auto">
            <table className="w-full text-left text-sm">
              <tbody className="divide-y divide-slate-100">
                {recentPatients.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-mono font-bold text-slate-600 text-xs">{p.id}</td>
                    <td className="p-4 text-right text-xs text-slate-500">{p.diagnosis}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRegistry = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Accumulation Header */}
      <div className="bg-gradient-to-r from-teal-800 to-teal-600 rounded-2xl p-6 shadow-lg mb-8 text-white relative overflow-hidden flex items-center justify-between">
        <div className="relative z-10">
          <h2 className="text-teal-100 text-sm font-bold uppercase tracking-wider mb-1">Total Akumulasi Laporan</h2>
          <div className="text-4xl font-display font-bold">884 <span className="text-lg font-medium text-teal-200">Kasus</span></div>
          <p className="text-xs text-teal-100 mt-2 opacity-80">Data akumulasi seluruh registry (Anonymized).</p>
        </div>
        <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm relative z-10">
          <Files className="w-8 h-8 text-white" />
        </div>
        <div className="absolute -right-10 -bottom-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      {/* Registry Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {activeRegistries.includes('Registry Uveitis') && (
          <RegistryCard 
            title="Registry Uveitis" 
            count="452" 
            icon={<Eye />} 
            color="emerald" 
            onAdd={() => { switchView('uveitis-registry'); }}
            onFilter={() => setFilterType('Uveitis')}
          />
        )}
        {activeRegistries.includes('Registry Fundus') && (
          <RegistryCard 
            title="Registry Fundus" 
            count="320" 
            icon={<Aperture />} 
            color="blue" 
            onAdd={() => { switchView('fundus-registry'); }}
            onFilter={() => setFilterType('Fundus')}
          />
        )}
        {activeRegistries.includes('Registry Ulkus Kornea') && (
          <RegistryCard 
            title="Registry Ulkus" 
            count="112" 
            icon={<Droplet />} 
            color="amber" 
            onAdd={() => { switchView('ulkus-registry'); }}
            onFilter={() => setFilterType('Ulkus')}
          />
        )}
        <div 
          onClick={() => {
            if (onNavigateToMarketplace) {
              onNavigateToMarketplace();
            } else {
              switchView('license');
            }
          }}
          className="bg-slate-50/50 border-dashed border-2 border-slate-300 rounded-2xl p-5 flex flex-col justify-center items-center text-center cursor-pointer transition-all hover:border-teal-400 hover:bg-teal-50/30 min-h-[180px] group"
        >
          <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center mb-2 group-hover:scale-110 group-hover:border-teal-300 transition-all shadow-sm">
            <Plus className="w-6 h-6 text-slate-400 group-hover:text-teal-600" />
          </div>
          <h3 className="text-sm font-bold text-slate-700 group-hover:text-teal-700">Tambah Layanan</h3>
          <p className="text-[10px] text-slate-500 mt-1 max-w-[180px]">Aktifkan paket registry spesialis lain sesuai kebutuhan klinik Anda.</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col lg:flex-row justify-between lg:items-center gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Tabel Data Laporan</h3>
            <p className="text-xs text-slate-500">Data registry anonim.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-700 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 shadow-sm w-full sm:w-auto cursor-pointer"
            >
              <option value="all">Semua Registry</option>
              <option value="Uveitis">Uveitis</option>
              <option value="Fundus">Fundus</option>
              <option value="Ulkus">Ulkus</option>
            </select>
            
            <div className="relative w-full sm:w-64">
              <input 
                type="text" 
                placeholder="Cari ID, Diagnosis..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-sm border border-slate-300 rounded-lg pl-9 pr-3 py-2 bg-white text-slate-700 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 w-full shadow-sm transition-colors"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
            
            <button 
              onClick={() => { 
                if (filterType === 'Uveitis') {
                  switchView('uveitis-registry');
                } else if (filterType === 'Fundus') {
                  switchView('fundus-registry');
                } else if (filterType === 'Ulkus') {
                  switchView('ulkus-registry');
                } else {
                  setSelectedRegistryForAdd('all'); 
                  switchView('add-registry'); 
                }
              }}
              className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm whitespace-nowrap active:scale-95"
            >
              <Plus className="w-4 h-4" /> Tambah Data
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                <th className="px-6 py-4 border-b border-slate-200">ID Laporan</th>
                <th className="px-6 py-4 border-b border-slate-200">Jenis Registry</th>
                <th className="px-6 py-4 border-b border-slate-200">Diagnosis Utama</th>
                <th className="px-6 py-4 border-b border-slate-200">Tanggal Input</th>
                <th className="px-6 py-4 border-b border-slate-200 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.length > 0 ? filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 text-sm font-mono font-bold text-slate-700">{item.id}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                      item.type === 'Uveitis' ? 'bg-emerald-100 text-emerald-700' : 
                      item.type === 'Fundus' ? 'bg-blue-100 text-blue-700' : 
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{item.diag}</td>
                  <td className="px-6 py-4 text-xs text-slate-500">{item.date}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded transition-colors"><Eye className="w-4 h-4" /></button>
                      <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"><Edit3 className="w-4 h-4" /></button>
                      <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">Tidak ada data ditemukan.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
          <span>Menampilkan {filteredData.length} dari {registryData.length} data</span>
          <div className="flex gap-1">
            <button className="px-2 py-1 border rounded hover:bg-slate-50 disabled:opacity-50">Prev</button>
            <button className="px-2 py-1 border rounded bg-teal-50 text-teal-700 border-teal-200">1</button>
            <button className="px-2 py-1 border rounded hover:bg-slate-50 disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAddRegistry = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="mb-6 flex items-center gap-4">
        <button onClick={() => switchView('registry')} className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 font-display">Input Data Registry</h1>
          <p className="text-slate-500 mt-1">Isi data pasien dan klinis untuk <span className="font-bold text-teal-600">{selectedRegistryForAdd === 'all' ? 'Modul' : selectedRegistryForAdd}</span></p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <form className="p-8 space-y-8">
          {/* Section: Data Demografi */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600"><User className="w-4 h-4" /></div>
              Data Demografi Pasien
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Nomor Rekam Medis (NRM)" placeholder="Contoh: 00-12-34-56" />
              <Input label="Tanggal Kunjungan Pertama" type="date" />
              <Input label="Tanggal Lahir" type="date" />
              <Select label="Jenis Kelamin" options={[{label: 'Laki-laki', value: 'L'}, {label: 'Perempuan', value: 'P'}]} />
              <Input label="Pekerjaan" placeholder="Pekerjaan Pasien" />
              <Select label="Poli / Unit" options={[{label: 'Rawat Jalan', value: 'RJ'}, {label: 'IGD', value: 'IGD'}, {label: 'Rawat Inap', value: 'RI'}]} />
            </div>
          </div>

          <div className="border-t border-slate-100"></div>

          {/* Section: Data Klinis */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"><Activity className="w-4 h-4" /></div>
              Data Klinis {selectedRegistryForAdd !== 'all' && `(${selectedRegistryForAdd})`}
            </h3>
            
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Input label="Diagnosis Utama" placeholder="Diagnosis ICD-10" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Anamnesis & Catatan Klinis</label>
                  <textarea rows={4} className="w-full px-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all" placeholder="Riwayat penyakit, keluhan utama..."></textarea>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => switchView('registry')} className="px-6 py-2.5 border border-slate-300 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all">Batal</button>
            <button 
              type="button" 
              onClick={() => { alert('Data Berhasil Disimpan!'); switchView('registry'); }}
              className="px-6 py-2.5 bg-teal-600 text-white rounded-xl font-bold text-sm hover:bg-teal-700 shadow-lg shadow-teal-200 transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Simpan Data
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const handlePayment = () => {
    const newTrx = {
      id: `TRX-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      item: paymentContext === 'request' ? `Request Variabel (${selectedSourceRegistry})` : 'Perpanjangan Lisensi',
      method: 'QRIS',
      amount: calculateTotalCost(),
      status: 'Lunas'
    };

    if (paymentContext === 'request') {
      const newRequest = {
        id: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toISOString().split('T')[0],
        registry: selectedSourceRegistry.toUpperCase(),
        variables: selectedVariables,
        cost: calculateTotalCost()
      };
      setRequestHistory([newRequest, ...requestHistory]);
      setShowRequestForm(false);
      setLaporanTab('history');
    }

    setTransactionHistory([newTrx, ...transactionHistory]);
    setShowPaymentModal(false);
    alert('Pembayaran Berhasil! Data Anda sedang diproses.');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">
      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">Konfirmasi Pembayaran</h3>
              <button onClick={() => setShowPaymentModal(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X className="w-5 h-5 text-slate-500" /></button>
            </div>
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="text-slate-500 text-sm mb-1">Total Tagihan</div>
                <div className="text-4xl font-display font-bold text-teal-600">Rp {calculateTotalCost().toLocaleString('id-ID')}</div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Item:</span>
                  <span className="font-bold text-slate-800">{paymentContext === 'request' ? 'Request Data Riset' : 'Lisensi Layanan'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Metode:</span>
                  <span className="font-bold text-slate-800">QRIS / E-Wallet</span>
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col items-center mb-8">
                <div className="w-48 h-48 bg-white p-2 border border-slate-200 rounded-lg mb-4 flex items-center justify-center">
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=NETRALOG-PAYMENT" alt="QRIS" className="w-full h-full" />
                </div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Scan untuk membayar</div>
              </div>

              <button 
                onClick={handlePayment}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-teal-200 transition-all active:scale-95"
              >
                Saya Sudah Bayar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className={`
        ${isSidebarOpen ? 'w-64' : 'w-0 md:w-20'} 
        bg-teal-900 border-r border-teal-800 flex flex-col flex-shrink-0 z-20 transition-all duration-300 shadow-xl overflow-hidden
      `}>
        <div className="h-16 flex items-center px-6 border-b border-teal-800 justify-between shrink-0">
          <div className={`flex items-center gap-3 ${!isSidebarOpen && 'md:hidden'}`}>
            <div className="bg-white/10 text-white p-1.5 rounded-lg border border-white/10"><ScanEye className="w-5 h-5" /></div>
            <h1 className="font-display font-bold text-white text-lg tracking-tight">Netra<span className="text-teal-200">Log</span></h1>
          </div>
          <button className="md:hidden text-white/70 hover:text-white" onClick={() => setIsSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-4 space-y-2 no-scrollbar">
          <SidebarSection title="Utama" isOpen={isSidebarOpen}>
            <SidebarLink 
              icon={<LayoutGrid />} 
              label="Dashboard" 
              active={activeView === 'dashboard'} 
              onClick={() => switchView('dashboard')} 
              isOpen={isSidebarOpen} 
            />
            <SidebarLink 
              icon={<Database />} 
              label="Data Registry" 
              active={activeView === 'registry' || activeView === 'add-registry'} 
              onClick={() => switchView('registry')} 
              isOpen={isSidebarOpen} 
            />
            <SidebarLink 
              icon={<ClipboardList />} 
              label="Laporan & Riset" 
              active={activeView === 'laporan'} 
              onClick={() => switchView('laporan')} 
              isOpen={isSidebarOpen} 
            />
          </SidebarSection>
          
          <SidebarSection title="Keuangan & Lisensi" isOpen={isSidebarOpen}>
            <SidebarLink 
              icon={<Receipt />} 
              label="Riwayat Pembayaran" 
              active={activeView === 'payment'} 
              onClick={() => switchView('payment')} 
              isOpen={isSidebarOpen} 
            />
            <SidebarLink 
              icon={<BadgeCheck />} 
              label="Lisensi Layanan" 
              active={activeView === 'license'} 
              onClick={() => switchView('license')} 
              isOpen={isSidebarOpen} 
            />
          </SidebarSection>

          <SidebarSection title="Akun" isOpen={isSidebarOpen}>
            <SidebarLink 
              icon={<Settings />} 
              label="Pengaturan" 
              active={false} 
              onClick={() => {}} 
              isOpen={isSidebarOpen} 
            />
          </SidebarSection>
        </div>

        <div className="p-4 border-t border-teal-800 bg-teal-950/50 shrink-0">
          <div className="flex items-center gap-3">
            <img src={`https://ui-avatars.com/api/?name=${userName}&background=0d9488&color=fff`} className="w-9 h-9 rounded-full border border-teal-700 shadow-sm" alt="Avatar" />
            {isSidebarOpen && (
              <div className="flex-grow min-w-0">
                <div className="text-sm font-bold text-white truncate">{userName}</div>
                <div className="text-xs text-teal-300 truncate">RS Mata Nasional</div>
              </div>
            )}
            <button onClick={onBack} className="text-teal-400 hover:text-red-400 transition-colors"><LogOut className="w-4 h-4" /></button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow flex flex-col h-screen overflow-hidden relative">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 z-10 shrink-0">
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg" onClick={() => setIsSidebarOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-lg font-bold text-slate-800 hidden md:block">
              {activeView === 'laporan' ? 'Laporan & Riset' : 
               activeView === 'payment' ? 'Riwayat Pembayaran' : 
               activeView === 'license' ? 'Status Lisensi Layanan' : 
               ''}
            </h2>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <div className="flex items-center gap-2">
              <button className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-full relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              </button>
            </div>
            <button 
              onClick={onBack}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Kembali ke Hub
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className={`flex-grow overflow-y-auto no-scrollbar ${(activeView === 'uveitis-registry' || activeView === 'ulkus-registry' || activeView === 'fundus-registry') ? '' : 'p-4 md:p-8'}`}>
          {activeView === 'dashboard' && renderDashboard()}
          {activeView === 'registry' && renderRegistry()}
          {activeView === 'add-registry' && renderAddRegistry()}
          {activeView === 'laporan' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 relative">
              {/* Main Header with CTA */}
              {!showRequestForm && (
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-800 font-display">Laporan & Permintaan Data Riset</h1>
                    <p className="text-slate-500 mt-1">Pusat analisis data registry dan layanan permintaan variabel.</p>
                  </div>
                  <button 
                    onClick={() => setShowRequestForm(true)}
                    className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-lg shadow-teal-200 flex items-center gap-2 transition-all hover:scale-105"
                  >
                    <Plus className="w-5 h-5" /> Request Variabel Baru
                  </button>
                </div>
              )}

              {/* SUB-NAVIGATION TABS */}
              {!showRequestForm && (
                <div className="flex border-b border-slate-200 mb-6 gap-6">
                  <button 
                    className={`pb-4 text-sm font-bold transition-all border-b-2 ${laporanTab === 'visual' ? 'border-teal-600 text-teal-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                    onClick={() => setLaporanTab('visual')}
                  >
                    Laporan Visual (Grafik)
                  </button>
                  <button 
                    className={`pb-4 text-sm font-bold transition-all border-b-2 ${laporanTab === 'history' ? 'border-teal-600 text-teal-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                    onClick={() => setLaporanTab('history')}
                  >
                    Riwayat Request
                  </button>
                </div>
              )}

              {/* INPUT REQUEST FORM */}
              {showRequestForm && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
                  <div className="p-6 bg-slate-900 text-white border-b border-slate-800">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <button 
                          onClick={() => setShowRequestForm(false)}
                          className="mb-4 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 w-fit"
                        >
                          <ArrowLeft className="w-4 h-4" /> Kembali ke Laporan
                        </button>
                        <h2 className="text-xl font-bold text-teal-400 flex items-center gap-2"><Database className="w-5 h-5" /> Form Request Data</h2>
                        <p className="text-slate-400 text-sm mt-1">Pilih variabel spesifik untuk dianalisis.</p>
                      </div>
                      <div className="bg-slate-800 px-4 py-2 rounded-lg border border-slate-700 text-right">
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider">Estimasi Biaya</div>
                        <div className="text-xl font-bold text-teal-400">Rp {calculateTotalCost().toLocaleString('id-ID')}</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Step 1: Select Registry */}
                    <div className="mb-6">
                      <label className="block text-sm font-bold text-slate-700 mb-2">1. Pilih Sumber Registry</label>
                      <select 
                        value={selectedSourceRegistry}
                        onChange={(e) => { setSelectedSourceRegistry(e.target.value); setSelectedVariables([]); }}
                        className="border border-slate-300 rounded-lg px-4 py-2 text-sm bg-white focus:border-teal-500 outline-none w-full md:w-64"
                      >
                        <option value="" disabled>-- Pilih Modul --</option>
                        <option value="uveitis">Registry Uveitis</option>
                        <option value="fundus">Registry Fundus/Retina</option>
                        <option value="ulkus">Registry Ulkus Kornea</option>
                      </select>
                    </div>

                    {/* Variable Selection Area */}
                    {selectedSourceRegistry ? (
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-3">2. Pilih Variabel Riset (Rp 50.000 / variabel)</label>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {variableSets[selectedSourceRegistry].map(v => (
                              <label key={v} className="cursor-pointer group">
                                <input 
                                  type="checkbox" 
                                  className="hidden" 
                                  checked={selectedVariables.includes(v)}
                                  onChange={() => {
                                    setSelectedVariables(prev => 
                                      prev.includes(v) ? prev.filter(item => item !== v) : [...prev, v]
                                    );
                                  }}
                                />
                                <div className={`border rounded-lg p-3 transition-all flex items-center justify-between ${
                                  selectedVariables.includes(v) 
                                    ? 'border-teal-600 bg-teal-50 text-teal-700' 
                                    : 'border-slate-200 bg-white hover:border-teal-300'
                                }`}>
                                  <span className="text-sm font-medium">{v}</span>
                                  {selectedVariables.includes(v) && <CheckCircle className="w-4 h-4" />}
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div className="p-4 bg-teal-50 rounded-xl border border-teal-100 flex items-start gap-3">
                          <input 
                            type="checkbox" 
                            id="addonImage" 
                            checked={includeImages}
                            onChange={(e) => setIncludeImages(e.target.checked)}
                            className="mt-1 w-5 h-5 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                          />
                          <div>
                            <label htmlFor="addonImage" className="text-sm font-bold text-slate-800 block cursor-pointer">Sertakan file gambar asli. Fundus atau Anterior.</label>
                            <p className="text-xs text-slate-600 mt-1">Biaya tambahan Rp 500.000. Ukuran file besar. Link download terpisah.</p>
                          </div>
                        </div>

                        <div className="flex justify-end pt-6 border-t border-slate-100 gap-3">
                          <button onClick={() => setShowRequestForm(false)} className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all">Batal</button>
                          <button 
                            onClick={() => {
                              if (selectedVariables.length === 0 && !includeImages) return alert('Pilih minimal satu variabel');
                              setShowPaymentModal(true);
                            }}
                            className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-teal-200 transition-all flex items-center gap-2"
                          >
                            <ShoppingCart className="w-5 h-5" /> Proses Pembayaran
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-xl">
                        <div className="text-slate-400 text-sm">Silakan pilih modul registry terlebih dahulu untuk melihat variabel.</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Visual Tab Content */}
              {!showRequestForm && laporanTab === 'visual' && (
                <div className="space-y-6">
                  {requestHistory.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
                      <BarChart className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                      <h3 className="text-slate-600 font-bold">Belum ada data untuk ditampilkan</h3>
                      <p className="text-sm text-slate-400">Lakukan request variabel terlebih dahulu.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Visual reports would go here */}
                      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h4 className="font-bold text-slate-800 mb-4">Distribusi Diagnosis</h4>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={[
                                  { name: 'Uveitis', value: 400 },
                                  { name: 'Retina', value: 300 },
                                  { name: 'Ulkus', value: 300 },
                                ]}
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label
                              >
                                {diagnosisData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                              <Legend />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* History Tab Content */}
              {!showRequestForm && laporanTab === 'history' && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <h3 className="text-lg font-bold text-slate-800">Riwayat Request</h3>
                    <div className="relative w-full sm:w-64">
                      <input type="text" placeholder="Cari ID Request..." className="text-sm border border-slate-300 rounded-lg pl-9 pr-3 py-2 bg-white text-slate-700 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 w-full shadow-sm transition-colors" />
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                          <th className="px-6 py-4 border-b border-slate-200">ID Transaksi</th>
                          <th className="px-6 py-4 border-b border-slate-200">Tanggal</th>
                          <th className="px-6 py-4 border-b border-slate-200">Registry</th>
                          <th className="px-6 py-4 border-b border-slate-200">Variabel</th>
                          <th className="px-6 py-4 border-b border-slate-200">Total Biaya</th>
                          <th className="px-6 py-4 border-b border-slate-200">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {requestHistory.length > 0 ? requestHistory.map((req) => (
                          <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 font-mono text-xs font-bold text-slate-600">{req.id}</td>
                            <td className="px-6 py-4 text-sm text-slate-500">{req.date}</td>
                            <td className="px-6 py-4 text-sm font-bold text-slate-700">{req.registry}</td>
                            <td className="px-6 py-4 text-xs text-slate-500 max-w-xs truncate">{req.variables.join(", ")}</td>
                            <td className="px-6 py-4 text-sm font-bold text-teal-700">Rp {req.cost.toLocaleString('id-ID')}</td>
                            <td className="px-6 py-4"><span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase">Lunas</span></td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic">Belum ada riwayat request.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
          {activeView === 'payment' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col lg:flex-row justify-between lg:items-center gap-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-slate-800">Riwayat Pembayaran</h3>
                    <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100">Semua Lunas</div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                    <div className="relative w-full sm:w-64">
                      <input type="text" placeholder="Cari ID Transaksi/Item..." className="text-sm border border-slate-300 rounded-lg pl-9 pr-3 py-2 bg-white text-slate-700 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 w-full shadow-sm transition-colors" />
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    </div>
                    <button className="bg-white border border-slate-300 hover:border-teal-500 hover:text-teal-600 text-slate-600 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95 whitespace-nowrap">
                      <Download className="w-4 h-4" /> Export
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                        <th className="px-6 py-4 border-b border-slate-200">ID Transaksi</th>
                        <th className="px-6 py-4 border-b border-slate-200">Tanggal</th>
                        <th className="px-6 py-4 border-b border-slate-200">Keterangan</th>
                        <th className="px-6 py-4 border-b border-slate-200">Metode</th>
                        <th className="px-6 py-4 border-b border-slate-200 text-right">Nominal</th>
                        <th className="px-6 py-4 border-b border-slate-200 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {transactionHistory.map((trx) => (
                        <tr key={trx.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 font-mono text-xs font-bold text-slate-600">{trx.id}</td>
                          <td className="px-6 py-4 text-sm text-slate-500">{trx.date}</td>
                          <td className="px-6 py-4 text-sm font-medium text-slate-800">{trx.item}</td>
                          <td className="px-6 py-4 text-sm text-slate-500"><span className="bg-white border border-slate-200 px-2 py-1 rounded text-xs">{trx.method}</span></td>
                          <td className="px-6 py-4 text-right text-sm font-bold text-teal-700">Rp {trx.amount.toLocaleString('id-ID')}</td>
                          <td className="px-6 py-4 text-center">
                            <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase flex items-center justify-center gap-1 w-fit mx-auto">
                              <CheckCircle className="w-3 h-3" /> {trx.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          {activeView === 'license' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="mb-6 flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-slate-800 font-display">Lisensi Layanan</h1>
                  <p className="text-slate-500 mt-1">Status berlangganan modul registry Anda.</p>
                </div>
                <button className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-lg shadow-teal-200 flex items-center gap-2 transition-all hover:scale-105">
                  <Plus className="w-5 h-5" /> Tambah Layanan Baru
                </button>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                {activeLicenses.map(license => (
                  <div key={license.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
                        <Database className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 text-lg">{license.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                            license.status === 'Aktif' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-amber-100 text-amber-700 border-amber-200'
                          }`}>{license.status}</span>
                          <span className="text-xs text-slate-500">Berlaku s/d {license.expiry}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto border-t md:border-t-0 border-slate-100 pt-4 md:pt-0">
                      <div className="text-right hidden md:block">
                        <div className="text-xs text-slate-400">Biaya Tahunan</div>
                        <div className="font-bold text-slate-700">Rp {license.cost.toLocaleString('id-ID')}</div>
                      </div>
                      <button className="flex-1 md:flex-none bg-white border border-slate-300 hover:border-teal-500 hover:text-teal-600 text-slate-600 px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-sm">
                        Perpanjang
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeView === 'uveitis-registry' && (
            <UveitisRegistry onBack={() => switchView('registry')} />
          )}
          {activeView === 'ulkus-registry' && (
            <UlkusRegistry onBack={() => switchView('registry')} />
          )}
          {activeView === 'fundus-registry' && (
            <FundusRegistry onBack={() => switchView('registry')} />
          )}
        </div>
      </main>
    </div>
  );
}

function SidebarSection({ title, children, isOpen }: { title: string, children: React.ReactNode, isOpen: boolean }) {
  return (
    <div className="mb-4">
      {isOpen && <div className="px-4 mb-2 text-[10px] font-bold text-teal-400 uppercase tracking-widest opacity-60">{title}</div>}
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function SidebarLink({ icon, label, active, onClick, isOpen }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void, isOpen: boolean }) {
  return (
    <button 
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
        ${active ? 'bg-teal-600 text-white shadow-lg' : 'text-teal-100 hover:bg-white/10'}
        ${!isOpen && 'justify-center px-0'}
      `}
    >
      <div className={`shrink-0 ${active ? 'text-white' : 'text-teal-300'}`}>
        {React.cloneElement(icon as React.ReactElement, { className: 'w-5 h-5' })}
      </div>
      {isOpen && <span className="text-sm font-medium truncate">{label}</span>}
    </button>
  );
}

function StatCard({ title, value, trend, subtitle, icon, color }: { title: string, value: string, trend?: string, subtitle?: string, icon: React.ReactNode, color: string }) {
  const colorClasses: Record<string, string> = {
    brand: 'bg-teal-50 text-teal-600',
    blue: 'bg-blue-50 text-blue-600',
    amber: 'bg-amber-50 text-amber-600',
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 relative overflow-hidden">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">{title}</div>
          <div className="text-3xl font-bold text-slate-800 mt-1">{value}</div>
          {subtitle && <div className="text-xs text-slate-400">{subtitle}</div>}
        </div>
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
      {trend && (
        <div className="text-[10px] text-slate-500">
          <span className="text-emerald-500 font-bold">{trend}</span> dari bulan lalu
        </div>
      )}
    </div>
  );
}

function RegistryCard({ title, count, icon, color, onAdd, onFilter }: { title: string, count: string, icon: React.ReactNode, color: string, onAdd: () => void, onFilter: () => void }) {
  const colorClasses: Record<string, string> = {
    emerald: 'bg-[#d1fae5] text-[#059669]', // Light green bg, dark green icon
    blue: 'bg-[#dbeafe] text-[#2563eb]',   // Light blue bg, dark blue icon
    amber: 'bg-[#fef3c7] text-[#d97706]',  // Light amber bg, dark amber icon
  };

  const badgeClasses: Record<string, string> = {
    emerald: 'text-[#059669] border-[#059669]',
    blue: 'text-[#2563eb] border-[#2563eb]',
    amber: 'text-[#d97706] border-[#d97706]',
  };

  const buttonClasses: Record<string, string> = {
    emerald: 'bg-[#059669] hover:bg-[#047857]',
    blue: 'bg-[#2563eb] hover:bg-[#1d4ed8]',
    amber: 'bg-[#d97706] hover:bg-[#b45309]',
  };

  return (
    <div 
      onClick={onFilter}
      className="bg-white border border-slate-200 rounded-[20px] p-6 transition-all cursor-pointer hover:shadow-md flex flex-col h-full"
    >
      <div className="flex justify-between items-start mb-6">
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${colorClasses[color]}`}>
          {React.cloneElement(icon as React.ReactElement, { className: 'w-7 h-7' })}
        </div>
        <span className={`px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider border ${badgeClasses[color]} bg-white`}>
          Aktif
        </span>
      </div>
      
      <div className="flex-1">
        <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
        <div className="flex items-baseline gap-2 mb-6">
          <span className="text-4xl font-bold text-slate-800">{count}</span>
          <span className="text-sm font-medium text-slate-500">Laporan</span>
        </div>
      </div>
      
      <div className="pt-4 border-t border-slate-100 mt-auto">
        <button 
          onClick={(e) => { e.stopPropagation(); onAdd(); }}
          className={`w-full text-white text-sm font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm ${buttonClasses[color]}`}
        >
          <Plus className="w-4 h-4" /> Tambah Data
        </button>
      </div>
    </div>
  );
}

function Input({ label, placeholder, type = 'text' }: { label: string, placeholder?: string, type?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
      <input 
        type={type} 
        className="w-full px-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all" 
        placeholder={placeholder} 
      />
    </div>
  );
}

function Select({ label, options }: { label: string, options: {label: string, value: string}[] }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
      <select className="w-full px-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all bg-white">
        <option value="">-- Pilih --</option>
        {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
    </div>
  );
}
