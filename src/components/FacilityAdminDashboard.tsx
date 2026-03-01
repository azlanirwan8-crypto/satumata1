import React, { useState } from 'react';
import { 
  Users, CreditCard, FileText, Settings,
  Bell, ChevronDown, Plus, TrendingUp,
  Package, Shield, Zap, Stethoscope,
  Calendar, Briefcase, Database, ClipboardCheck,
  LayoutGrid, ShoppingCart, Info, Clock,
  Activity, BarChart3, Wallet
} from 'lucide-react';
import MarketplaceView from './MarketplaceView';

interface FacilityAdminDashboardProps {
  onLogout: () => void;
  userName: string;
}

export default function FacilityAdminDashboard({ onLogout, userName }: FacilityAdminDashboardProps) {
  const [activeView, setActiveView] = useState<'dashboard' | 'marketplace'>('dashboard');
  const [activeAddOns, setActiveAddOns] = useState<string[]>(['Integrasi SATUSEHAT']);

  const toggleAddOn = (title: string) => {
    setActiveAddOns(prev => 
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    );
  };

  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showBranchDropdown, setShowBranchDropdown] = useState(false);
  const [currentBranch, setCurrentBranch] = useState(
    userName.includes('Klinik A') ? 'Klinik Mata Sentosa A' : 
    userName.includes('Klinik B') ? 'Klinik Mata Sentosa B' : 
    'RS Sehat Sentosa Group'
  );

  const branches = [
    { id: 'hq', name: 'RS Sehat Sentosa Group', type: 'Group', status: 'Online' },
    { id: 'west', name: 'Klinik Mata Sentosa A', type: 'Unit', status: 'Online' },
    { id: 'south', name: 'Klinik Mata Sentosa B', type: 'Unit', status: 'Online' }
  ];

  if (activeView === 'marketplace') {
    return (
      <MarketplaceView 
        onBack={() => setActiveView('dashboard')} 
        activeAddOns={activeAddOns}
        onToggleAddOn={toggleAddOn}
      />
    );
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen font-body text-gray-700 flex flex-col">
      {/* Header */}
      <header className="bg-[#01315F] text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="bg-white rounded-lg p-1.5 flex items-center justify-center shadow-sm">
              <img src="https://noviandri.com/wp-content/uploads/2025/11/SATUMATA-e1763948072282.png" alt="Satumata Logo" className="h-6 w-auto" referrerPolicy="no-referrer" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-lg tracking-wider leading-none text-white uppercase">Satumata</span>
              <span className="font-light text-white/70 text-[10px] uppercase tracking-widest leading-none">Facility Console</span>
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            {/* Branch Selector */}
            <div className="relative hidden md:block">
              <button 
                onClick={() => setShowBranchDropdown(!showBranchDropdown)}
                className="flex items-center bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full border border-white/20 transition-colors focus:outline-none group"
              >
                <span className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
                <span className="text-xs font-bold text-white mr-2">{currentBranch}</span>
                <ChevronDown className="w-3 h-3 text-white/70 group-hover:text-white" />
              </button>

              {showBranchDropdown && (
                <div className="absolute left-0 top-12 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                  {branches.map(b => (
                    <button 
                      key={b.id}
                      onClick={() => { setCurrentBranch(b.name); setShowBranchDropdown(false); }}
                      className="w-full text-left px-4 py-3 text-xs hover:bg-gray-50 flex items-center justify-between group"
                    >
                      <div>
                        <span className="font-bold text-satu-dark block">{b.name}</span>
                        <span className={`text-[10px] ${b.status === 'Online' ? 'text-green-600' : 'text-gray-400'}`}>{b.status} • {b.type}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button className="relative p-2 text-white/70 hover:text-white">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#01315F]"></span>
            </button>

            <div className="relative">
              <button 
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center gap-3 pl-0 md:pl-6 md:border-l border-white/10 hover:opacity-80 focus:outline-none"
              >
                <div className="text-right hidden md:block">
                  <p className="font-display font-bold text-sm leading-tight text-white">{userName}</p>
                  <p className="text-[10px] text-satu-gold font-bold tracking-wide uppercase">Direktur Ops (Corp)</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-white text-satu-dark flex items-center justify-center font-bold text-xs shadow-md border-2 border-white">RS</div>
              </button>

              {showProfileDropdown && (
                <div className="absolute right-0 top-12 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Profil RS</button>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Pengaturan</button>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button onClick={onLogout} className="w-full text-left px-4 py-2 text-sm text-satu-error hover:bg-red-50">Keluar</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Hero Stats */}
        <div className="relative bg-[#01315F] rounded-3xl p-8 text-white shadow-2xl overflow-hidden">
          <div className="absolute right-0 bottom-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-[120px] -mr-40 -mb-40"></div>
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <span className="text-blue-200 text-sm font-medium mb-1 block">Overview Operasional (Konsolidasi Nasional)</span>
              <h1 className="font-display font-bold text-4xl tracking-wide text-white">{currentBranch}</h1>
              <p className="text-blue-100/80 text-sm mt-2 max-w-lg">Pantau kinerja pelayanan, antrian, okupansi bed (BOR), dan pendapatan secara real-time.</p>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 lg:pb-0 no-scrollbar w-full lg:w-auto">
              <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-6 min-w-[200px] text-center">
                <span className="text-blue-200 text-[10px] font-bold uppercase tracking-widest mb-2 block">Total Kunjungan (Grup)</span>
                <div className="text-4xl font-bold font-display text-white">227</div>
                <div className="text-[10px] text-green-300 mt-2 flex justify-center items-center gap-1 font-bold">▲ 12%</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-6 min-w-[200px] text-center">
                <span className="text-blue-200 text-[10px] font-bold uppercase tracking-widest mb-2 block">Okupansi (BOR)</span>
                <div className="text-4xl font-bold font-display text-white">75%</div>
                <div className="text-[10px] text-yellow-300 mt-2 font-bold">34 Bed Tersedia</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-6 min-w-[200px] text-center">
                <span className="text-blue-200 text-[10px] font-bold uppercase tracking-widest mb-2 block">Total Pendapatan (Grup)</span>
                <div className="text-4xl font-bold font-display text-white">73<span className="text-xl font-normal text-white/70 ml-1">jt</span></div>
                <div className="text-[10px] text-blue-100/70 mt-2 font-bold">Hari Ini</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column (Sidebar) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Status Integrasi */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-display font-bold text-xs text-satu-dark mb-4 flex items-center gap-2 uppercase tracking-wider">
                <Shield className="w-4 h-4 text-green-500" />
                Status Integrasi
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-gray-600 font-bold">SATUSEHAT</span>
                  <span className="flex items-center gap-1.5 text-green-600 font-bold text-[10px]">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span> Online
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-gray-600 font-bold">BPJS V-Claim</span>
                  <span className="flex items-center gap-1.5 text-blue-600 font-bold text-[10px]">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span> Online
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-gray-400 font-bold">Alat OCT (Zeiss)</span>
                  <span className="flex items-center gap-1.5 text-gray-400 font-bold text-[10px]">
                    Offline
                  </span>
                </div>
              </div>
            </div>

            {/* Antrian Live */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-display font-bold text-xs text-satu-dark mb-4 flex items-center gap-2 uppercase tracking-wider">
                <Users className="w-4 h-4 text-satu-primary" />
                Antrian Live
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Poli Mata 1</p>
                    <p className="text-xs font-bold text-satu-dark">Dr. Handoko</p>
                  </div>
                  <div className="text-right">
                    <span className="block text-xl font-bold text-satu-dark leading-none">12</span>
                    <span className="text-[9px] text-gray-400 font-bold">Menunggu</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Poli Retina</p>
                    <p className="text-xs font-bold text-satu-dark">Dr. Sarah</p>
                  </div>
                  <div className="text-right">
                    <span className="block text-xl font-bold text-satu-dark leading-none">05</span>
                    <span className="text-[9px] text-gray-400 font-bold">Menunggu</span>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-[10px] text-gray-500 font-bold">Rata-rata Waktu Tunggu:</span>
                  <span className="text-[10px] text-red-500 font-bold">45 Menit (Tinggi)</span>
                </div>
              </div>
            </div>

            {/* Status Akreditasi */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-display font-bold text-xs text-satu-dark mb-4 flex items-center gap-2 uppercase tracking-wider">
                <ClipboardCheck className="w-4 h-4 text-orange-500" />
                Status Akreditasi
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-end mb-1">
                  <span className="text-xl font-display font-bold text-satu-primary">PARIPURNA</span>
                  <span className="text-xs font-bold text-gray-400">85%</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-satu-primary h-full rounded-full" style={{ width: '85%' }}></div>
                </div>
                <p className="text-[10px] text-gray-400 font-medium italic">Pembaruan terakhir: 12 Jan 2026</p>
                <button className="w-full py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[10px] font-bold text-satu-primary hover:bg-gray-100 transition-colors">
                  Buka Dashboard Akreditasi
                </button>
              </div>
            </div>

            {/* Kabar SATUMATA */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-display font-bold text-xs text-satu-dark mb-4 flex items-center gap-2 uppercase tracking-wider">
                <Info className="w-4 h-4 text-blue-500" />
                Kabar SATUMATA
              </h3>
              <div className="space-y-4">
                <div className="border-b border-gray-50 pb-3">
                  <p className="text-[10px] font-bold text-satu-primary uppercase mb-1">Update Sistem</p>
                  <h4 className="text-xs font-bold text-gray-800 leading-tight">Implementasi AI Retina v2.0 di seluruh cabang.</h4>
                  <p className="text-[9px] text-gray-400 mt-1">2 jam yang lalu</p>
                </div>
                <div className="border-b border-gray-50 pb-3">
                  <p className="text-[10px] font-bold text-satu-gold uppercase mb-1">Event</p>
                  <h4 className="text-xs font-bold text-gray-800 leading-tight">Workshop Nasional Penanganan Glaukoma 2026.</h4>
                  <p className="text-[9px] text-gray-400 mt-1">Kemarin</p>
                </div>
                <button className="w-full text-center text-[9px] font-bold text-gray-400 hover:text-satu-primary transition-colors">
                  Lihat Semua Berita
                </button>
              </div>
            </div>
          </div>

          {/* Right Column (Main Content) */}
          <div className="lg:col-span-9 space-y-8">
            {/* Promo Banner */}
            <div className="w-full bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-6 relative overflow-hidden shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-5 relative z-10">
                <div className="p-3 bg-white rounded-2xl text-green-600 shadow-sm shrink-0 border border-green-100">
                  <Zap className="w-8 h-8" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-display font-bold text-gray-800 text-lg">Diskon Spesial 20% Modul Kiosk</h3>
                    <span className="text-[8px] font-bold bg-green-600 text-white px-1.5 py-0.5 rounded uppercase">Promo</span>
                  </div>
                  <p className="text-sm text-gray-600">Tingkatkan efisiensi pendaftaran pasien.</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveView('marketplace')}
                className="relative z-10 px-8 py-3 bg-[#10B981] hover:bg-emerald-600 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
              >
                Lihat Promo
              </button>
            </div>

            {/* Statistik Keuangan RS */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-display font-bold text-base text-satu-dark flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-satu-gold" />
                  Statistik Keuangan RS
                </h3>
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 cursor-pointer">
                  <span className="text-[10px] font-bold text-gray-600">Minggu Ini</span>
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50/30 border border-blue-100 rounded-2xl p-6">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Total Pendapatan</p>
                  <h4 className="text-2xl font-display font-bold text-satu-dark">Rp 245.8 Jt</h4>
                </div>
                <div className="bg-green-50/30 border border-green-100 rounded-2xl p-6">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Est. Klaim BPJS</p>
                  <h4 className="text-2xl font-display font-bold text-green-700">Rp 182.5 Jt</h4>
                </div>
                <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-6">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Tunai & Swasta</p>
                  <h4 className="text-2xl font-display font-bold text-gray-800">Rp 63.3 Jt</h4>
                </div>
              </div>
            </div>

            {/* Section 1: Pelayanan Pasien */}
            <div className="space-y-4">
              <h2 className="font-display font-bold text-xl text-satu-dark">1. Pelayanan Pasien</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <ModuleButton icon={<Plus className="w-6 h-6" />} title="Pendaftaran" desc="Registrasi pasien." color="blue" />
                <ModuleButton icon={<Database className="w-6 h-6" />} title="Rekam Medis" desc="Master Data Pasien." color="blue" />
                <ModuleButton icon={<Calendar className="w-6 h-6" />} title="Janji Temu" desc="Booking & Jadwal." color="blue" />
                <ModuleButton icon={<FileText className="w-6 h-6" />} title="Kasir & Asuransi" desc="Billing & Klaim." color="green" />
              </div>
            </div>

            {/* Section 2: Pelayanan Medis */}
            <div className="space-y-4">
              <h2 className="font-display font-bold text-xl text-satu-dark">2. Pelayanan Medis</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <ModuleButton icon={<Stethoscope className="w-6 h-6" />} title="Rawat Jalan" desc="Antrian Poli & EMR." color="blue" />
                <ModuleButton icon={<Activity className="w-6 h-6" />} title="Farmasi" desc="E-Resep & Stok." color="green" />
              </div>
            </div>

            {/* Section 3: Manajemen & Admin */}
            <div className="space-y-4">
              <h2 className="font-display font-bold text-xl text-satu-dark">3. Manajemen & Admin</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <ModuleButton icon={<Clock className="w-6 h-6" />} title="Jadwal & Ruang" desc="Atur Shift & Poli." color="orange" />
                <ModuleButton icon={<Users className="w-6 h-6" />} title="SDM & Gaji" desc="Payroll & HR." color="blue" />
                <ModuleButton icon={<Package className="w-6 h-6" />} title="Inventaris" desc="Aset medis & BHP." color="gray" />
                <ModuleButton icon={<Database className="w-6 h-6" />} title="Master Data" desc="Tarif, Obat, Diagnosa." color="pink" />
                <ModuleButton icon={<Shield className="w-6 h-6" />} title="Manajemen Akreditasi" desc="Dokumen KARS." color="orange" />
                <ModuleButton icon={<BarChart3 className="w-6 h-6" />} title="Laporan & Analitik" desc="Laporan pendapatan." color="blue" />
                <ModuleButton icon={<Settings className="w-6 h-6" />} title="Pengaturan Faskes" desc="Profil, Logo & Kop surat." color="gray" />
                <ModuleButton icon={<LayoutGrid className="w-6 h-6" />} title="Marketplace Add Ons" desc="Tambah fitur." color="purple" onClick={() => setActiveView('marketplace')} />
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full border-t border-gray-200 mt-auto bg-white">
        <div className="flex flex-col md:flex-row items-center justify-between text-[10px] text-gray-400 font-bold uppercase tracking-widest">
          <div>&copy; 2026 SATUMATA Eye Hospital System. v2.5.0</div>
          <div className="flex items-center gap-8">
            <button className="hover:text-satu-primary transition-colors">Kebijakan Privasi</button>
            <button className="hover:text-satu-primary transition-colors">Syarat & Ketentuan</button>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span className="text-gray-500">System Online</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ModuleButton({ icon, title, desc, color, onClick }: { icon: React.ReactNode, title: string, desc: string, color: string, onClick?: () => void }) {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600 group-hover:bg-blue-600',
    green: 'bg-green-50 text-green-600 group-hover:bg-green-600',
    orange: 'bg-orange-50 text-orange-600 group-hover:bg-orange-600',
    gray: 'bg-gray-50 text-gray-600 group-hover:bg-gray-600',
    pink: 'bg-pink-50 text-pink-600 group-hover:bg-pink-600',
    purple: 'bg-purple-50 text-purple-600 group-hover:bg-purple-600',
  };

  return (
    <button 
      onClick={onClick}
      className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-satu-primary hover:shadow-xl hover:shadow-blue-500/5 transition-all group text-left flex flex-col h-full"
    >
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-colors group-hover:text-white ${colorClasses[color]}`}>
        {icon}
      </div>
      <h3 className="font-bold text-gray-800 text-sm mb-1">{title}</h3>
      <p className="text-[10px] text-gray-400 font-medium">{desc}</p>
    </button>
  );
}
