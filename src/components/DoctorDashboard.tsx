import React, { useState } from 'react';
import { 
  Calendar, Activity, Bell, Search,
  Stethoscope, BookOpen, Video, Settings, Info,
  ChevronLeft, ChevronRight, CheckCircle,
  TrendingUp, FileText, Users, Clock,
  ShieldCheck, Wallet, LayoutGrid, MessageSquare
} from 'lucide-react';
import MarketplaceView from './MarketplaceView';
import NetraLogRegistryDashboard from './NetraLogRegistryDashboard';

interface DoctorDashboardProps {
  onLogout: () => void;
  userName: string;
}

export default function DoctorDashboard({ onLogout, userName }: DoctorDashboardProps) {
  const [activeView, setActiveView] = useState<'dashboard' | 'marketplace' | 'netralog-registry'>('dashboard');
  const [activeTab, setActiveTab] = useState('fasilitas');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 9, 1)); // Oct 2026
  const [selectedDateKey, setSelectedDateKey] = useState('2026-10-12');
  const [activeAddOns, setActiveAddOns] = useState<string[]>(['Integrasi SATUSEHAT']);

  const toggleAddOn = (title: string) => {
    setActiveAddOns(prev => 
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    );
  };

  const isNetraLogActive = activeAddOns.some(addon => 
    addon === 'NetraLog Registry' || 
    addon === 'Registry Uveitis' || 
    addon === 'Registry Ulkus Kornea' || 
    addon === 'Registry Fundus'
  );

  const activeRegistries = activeAddOns.filter(addon => 
    addon === 'Registry Uveitis' || 
    addon === 'Registry Ulkus Kornea' || 
    addon === 'Registry Fundus'
  );

  // Mock Data
  const scheduleData: Record<string, any[]> = {
    '2026-10-12': [
      { 
        time: '08:00 - 14:00', 
        loc: userName.includes('Ahmad') ? 'Klinik Mata Sentosa A' : 
             userName.includes('Siti') ? 'Klinik Mata Sentosa B' : 
             'RS Sehat Sentosa', 
        poli: 'Poli Mata 1', 
        type: 'rs' 
      },
      { time: '16:00 - 20:00', loc: 'Klinik Mata Utama', poli: 'R. Refraksi', type: 'kl' }
    ],
    '2026-10-13': [
      { time: '09:00 - 15:00', loc: 'Praktek Mandiri', poli: 'Ruko Blok A', type: 'pm' }
    ],
    '2026-10-14': [
      { time: '08:00 - 12:00', loc: 'RS Sehat Sentosa', poli: 'OK (Bedah)', type: 'rs' }
    ],
    '2026-10-16': [
      { time: '13:00 - 17:00', loc: 'Klinik Mata Utama', poli: 'Poli Umum', type: 'kl' }
    ]
  };

  const infoData = [
    { type: 'fasilitas', title: 'Rapat Komite Medis', meta: 'RS SEHAT | 10m lalu', desc: 'Pembahasan protokol baru penanganan Uveitis di Ruang Rapat Lt. 3.', badge: 'bg-blue-500' },
    { type: 'global', title: 'Fitur Baru: AI Retina v2.0', meta: 'UPDATE SISTEM | Baru Saja', desc: 'Peningkatan akurasi deteksi DR hingga 98%. Coba gratis di Add Ons.', badge: 'bg-indigo-600' },
    { type: 'fasilitas', title: 'Maintenance Alat OCT', meta: 'KLINIK | Kemarin', desc: 'Jadwal kalibrasi alat OCT Topcon hari Jumat, 15 Okt. Mohon sesuaikan jadwal pasien.', badge: 'bg-yellow-500' },
    { type: 'fasilitas', title: 'SIP Kedaluwarsa', meta: 'ADMINISTRASI | Penting', desc: 'SIP Anda di Klinik Utama berakhir dalam 28 hari. Segera perbarui.', badge: 'bg-red-500' }
  ];

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const hasSchedule = scheduleData[dateKey] && scheduleData[dateKey].length > 0;
      const isSelected = dateKey === selectedDateKey;

      days.push(
        <div 
          key={day}
          onClick={() => setSelectedDateKey(dateKey)}
          className={`h-8 w-8 rounded-full flex items-center justify-center cursor-pointer transition-all relative text-xs
            ${isSelected ? 'bg-satu-primary text-white font-bold shadow-md' : 'hover:bg-blue-50 text-gray-600'}`}
        >
          <span>{day}</span>
          {hasSchedule && !isSelected && (
            <div className="absolute bottom-1 w-1 h-1 bg-satu-gold rounded-full"></div>
          )}
        </div>
      );
    }
    return days;
  };

  if (activeView === 'marketplace') {
    return (
      <MarketplaceView 
        onBack={() => setActiveView('dashboard')} 
        activeAddOns={activeAddOns}
        onToggleAddOn={toggleAddOn}
      />
    );
  }

  if (activeView === 'netralog-registry') {
    return (
      <NetraLogRegistryDashboard 
        onBack={() => setActiveView('dashboard')}
        onNavigateToMarketplace={() => setActiveView('marketplace')}
        userName={userName}
        activeRegistries={activeRegistries}
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
              <span className="font-light text-white/70 text-[10px] uppercase tracking-widest leading-none">Professional Hub</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Search bar removed as per request */}

            <div className="relative">
              <button 
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center gap-3 hover:bg-white/10 p-2 rounded-lg transition-colors focus:outline-none"
              >
                <div className="text-right hidden sm:block">
                  <p className="font-display font-bold text-sm leading-tight text-white">{userName}</p>
                  <p className="text-[10px] text-satu-gold font-bold tracking-wide uppercase">Verified Professional</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-satu-gold border-2 border-white flex items-center justify-center text-satu-dark font-bold font-display shadow-sm overflow-hidden">
                  <img src={`https://ui-avatars.com/api/?name=${userName}&background=CFA766&color=01315F&bold=true`} className="w-full h-full object-cover" alt="Dr Profile" referrerPolicy="no-referrer" />
                </div>
              </button>
              
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Profil Saya</button>
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
        {/* Hero */}
        <div className="relative bg-[#01315F] rounded-3xl p-8 text-white shadow-xl overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <span className="text-blue-200 text-sm font-medium mb-1 block">Selamat Pagi,</span>
              <h1 className="font-display font-bold text-4xl tracking-wide">{userName}</h1>
              <p className="text-blue-100/80 text-sm mt-2 max-w-lg">Ringkasan aktivitas profesional dan agenda praktik Anda hari ini.</p>
            </div>
            <div className="flex gap-4">
              <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-6 min-w-[160px] flex flex-col items-center text-center">
                <span className="text-blue-200 text-[10px] font-bold uppercase tracking-widest mb-2 block">Total Pasien</span>
                <span className="text-4xl font-bold font-display">42</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-6 min-w-[160px] flex flex-col items-center text-center">
                <span className="text-blue-200 text-[10px] font-bold uppercase tracking-widest mb-2 block">Tindakan</span>
                <span className="text-4xl font-bold font-display text-white">8</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column (Sidebar) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Calendar */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-display font-bold text-xs text-satu-dark flex items-center gap-2 uppercase tracking-wider">
                  <Calendar className="w-4 h-4 text-satu-primary" />
                  Kalender Praktik
                </h3>
                <div className="flex items-center gap-1 bg-gray-50 rounded-lg px-1 py-0.5">
                  <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))} className="p-1 hover:bg-white hover:shadow-sm rounded text-gray-500 transition-all">
                    <ChevronLeft className="w-3 h-3" />
                  </button>
                  <span className="text-[10px] font-bold text-satu-dark w-16 text-center">
                    {currentMonth.toLocaleString('id-ID', { month: 'short', year: 'numeric' })}
                  </span>
                  <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))} className="p-1 hover:bg-white hover:shadow-sm rounded text-gray-500 transition-all">
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {['M', 'S', 'S', 'R', 'K', 'J', 'S'].map((d, idx) => (
                  <div key={`${d}-${idx}`} className="text-[9px] font-bold text-gray-400">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-xs mb-4">
                {renderCalendar()}
              </div>
              <div className="pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Jadwal: {new Date(selectedDateKey).toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })}
                  </p>
                  <button className="text-[10px] font-bold text-satu-primary hover:underline">
                    + Tambah
                  </button>
                </div>
                <div className="space-y-3 max-h-[250px] overflow-y-auto no-scrollbar">
                  {scheduleData[selectedDateKey]?.map((sch, i) => (
                    <div key={i} className={`p-3 rounded-xl border-l-4 shadow-sm ${sch.type === 'rs' ? 'border-l-blue-500 bg-blue-50/50' : sch.type === 'kl' ? 'border-l-satu-gold bg-yellow-50/50' : 'border-l-green-500 bg-green-50/50'}`}>
                      <p className="text-xs font-bold text-gray-800">{sch.time}</p>
                      <p className="text-[10px] font-bold text-gray-600 mt-0.5">{sch.loc}</p>
                      <p className="text-[10px] text-gray-400">{sch.poli}</p>
                    </div>
                  )) || (
                    <div className="text-center py-8 border border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                      <p className="text-xs font-bold text-gray-400 italic">Tidak ada jadwal</p>
                      <button className="mt-2 text-[10px] text-satu-primary font-bold hover:underline">Buat Jadwal Baru</button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Billing / Tagihan */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-display font-bold text-xs text-satu-dark mb-4 flex items-center gap-2 uppercase tracking-wider">
                <Wallet className="w-4 h-4 text-orange-500" />
                Tagihan Modul
              </h3>
              <div className="p-4 rounded-2xl bg-orange-50 border border-orange-100">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[8px] font-bold text-orange-600 bg-white px-1.5 py-0.5 rounded uppercase">Jatuh Tempo</span>
                  <span className="text-[10px] font-bold text-gray-800">Rp 150.000</span>
                </div>
                <h4 className="text-xs font-bold text-gray-800 mb-3">Modul Praktek Mandiri</h4>
                <button className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white text-[10px] font-bold rounded-xl transition-colors shadow-md">Bayar Sekarang</button>
              </div>
            </div>
          </div>

          {/* Right Column (Main Content) */}
          <div className="lg:col-span-9 space-y-8">
            {/* Sebaran Pasien */}
            <div className="space-y-4">
              <h2 className="font-display font-bold text-xl text-satu-dark">Sebaran Pasien Hari Ini</h2>
              <div className="flex overflow-x-auto gap-6 pb-4 no-scrollbar">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100 flex items-center justify-between min-w-[280px]">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm border border-blue-100">RS</div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-sm">RS Sehat Sentosa</h3>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Poli Mata 1</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-display font-bold text-satu-primary">19</p>
                    <p className="text-[9px] text-gray-400 font-bold uppercase">Pasien</p>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-yellow-100 flex items-center justify-between min-w-[280px]">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-yellow-50 text-satu-gold flex items-center justify-center font-bold text-sm border border-yellow-100">KL</div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-sm">Klinik Mata Utama</h3>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">R. Refraksi</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-display font-bold text-satu-gold">15</p>
                    <p className="text-[9px] text-gray-400 font-bold uppercase">Pasien</p>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-green-100 flex items-center justify-between min-w-[280px]">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center font-bold text-sm border border-green-100">PM</div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-sm">Praktek Mandiri</h3>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Ruko Blok A</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-display font-bold text-green-600">8</p>
                    <p className="text-[9px] text-gray-400 font-bold uppercase">Pasien</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modul Profesional */}
            <div className="space-y-4">
              <h2 className="font-display font-bold text-xl text-satu-dark">Modul Profesional</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <ModuleButton icon={<Stethoscope className="w-6 h-6" />} title="Pemeriksaan Klinis" desc="EMR, Diagnosa & Resep" color="blue" />
                <ModuleButton icon={<TrendingUp className="w-6 h-6" />} title="Kinerja Professional" desc="Statistik Jasa Medis" color="gold" />
                <ModuleButton 
                  icon={<BookOpen className="w-6 h-6" />} 
                  title="NetraLog Registry" 
                  desc="Bank Data Kasus" 
                  color="indigo" 
                  onClick={() => isNetraLogActive ? setActiveView('netralog-registry') : setActiveView('marketplace')}
                  isActive={isNetraLogActive}
                />
                <ModuleButton icon={<Video className="w-6 h-6" />} title="Telekonsultasi" desc="Konsultasi Online" color="blue" />
                <ModuleButton icon={<FileText className="w-6 h-6" />} title="E-Sertifikat" desc="Surat Sakit & Rujukan" color="green" />
                <ModuleButton icon={<MessageSquare className="w-6 h-6" />} title="Diskusi Kasus" desc="Forum Dokter Spesialis" color="purple" />
                <ModuleButton icon={<LayoutGrid className="w-6 h-6" />} title="Marketplace Add Ons" desc="Tambah fitur" color="gray" onClick={() => setActiveView('marketplace')} />
              </div>
            </div>

            {/* Papan Informasi */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 h-[450px] flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-display font-bold text-base text-satu-dark flex items-center gap-2">
                  <Info className="w-5 h-5 text-blue-500" />
                  Papan Informasi
                </h3>
                <div className="flex bg-gray-100 rounded-xl p-1">
                  <button 
                    onClick={() => setActiveTab('fasilitas')}
                    className={`px-4 py-1.5 text-[10px] font-bold rounded-lg transition-all ${activeTab === 'fasilitas' ? 'bg-white text-satu-primary shadow-sm' : 'text-gray-500'}`}
                  >
                    Fasilitas
                  </button>
                  <button 
                    onClick={() => setActiveTab('global')}
                    className={`px-4 py-1.5 text-[10px] font-bold rounded-lg transition-all ${activeTab === 'global' ? 'bg-white text-satu-primary shadow-sm' : 'text-gray-500'}`}
                  >
                    Satumata
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto no-scrollbar space-y-4">
                {infoData.filter(i => i.type === activeTab).map((info, i) => (
                  <div key={i} className={`p-4 rounded-2xl border transition-all hover:shadow-md ${info.type === 'global' ? 'bg-gray-50/50 border-gray-100' : 'bg-blue-50/30 border-blue-100'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-[9px] font-bold text-white px-2 py-0.5 rounded-full ${info.badge}`}>{info.meta.split('|')[0]}</span>
                      <span className="text-[9px] text-gray-400 font-medium">{info.meta.split('|')[1]}</span>
                    </div>
                    <p className="text-sm font-bold text-gray-800 mb-1">{info.title}</p>
                    <p className="text-[11px] text-gray-500 leading-relaxed">{info.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full border-t border-gray-200 bg-white mt-auto">
        <div className="flex flex-col md:flex-row items-center justify-between text-[10px] text-gray-400 font-bold uppercase tracking-widest">
          <div>&copy; 2026 SATUMATA Eye Hospital System. v2.5.0</div>
          <div className="flex items-center gap-8">
            <button className="hover:text-satu-primary transition-colors">Panduan EMR</button>
            <button className="hover:text-satu-primary transition-colors">Support IT</button>
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

function ModuleButton({ icon, title, desc, color, onClick, isActive }: { icon: React.ReactNode, title: string, desc: string, color: string, onClick?: () => void, isActive?: boolean }) {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600 group-hover:bg-blue-600',
    green: 'bg-green-50 text-green-600 group-hover:bg-green-600',
    gold: 'bg-yellow-50 text-satu-gold group-hover:bg-satu-gold',
    indigo: 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600',
    purple: 'bg-purple-50 text-purple-600 group-hover:bg-purple-600',
    gray: 'bg-gray-50 text-gray-600 group-hover:bg-gray-600',
  };

  return (
    <button 
      onClick={onClick}
      className={`bg-white rounded-2xl border p-6 hover:border-satu-primary hover:shadow-xl hover:shadow-blue-500/5 transition-all group text-left flex flex-col h-full relative ${
        isActive ? 'border-indigo-200 ring-1 ring-indigo-50' : 'border-gray-100'
      }`}
    >
      {isActive && (
        <div className="absolute top-3 right-3">
          <CheckCircle className="w-4 h-4 text-indigo-500" />
        </div>
      )}
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-colors group-hover:text-white ${colorClasses[color]}`}>
        {icon}
      </div>
      <h3 className="font-bold text-gray-800 text-sm mb-1">{title}</h3>
      <p className="text-[10px] text-gray-400 font-medium">{desc}</p>
    </button>
  );
}
