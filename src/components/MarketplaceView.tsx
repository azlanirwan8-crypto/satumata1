import React, { useState } from 'react';
import { 
  ArrowLeft, Info, Check, 
  Database, Share2, MessageSquare, 
  Monitor, Tv, BarChart3, 
  Bed, Scissors, FlaskConical, 
  Tag, LayoutGrid, Zap, ShoppingCart, ChevronDown, AlertTriangle, CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MarketplaceViewProps {
  onBack: () => void;
  activeAddOns: string[];
  onToggleAddOn: (title: string) => void;
}

interface AddOn {
  id: string;
  title: string;
  category: string;
  description: string;
  price: string;
  isFree: boolean;
  isActive: boolean;
  icon: React.ReactNode;
}

export default function MarketplaceView({ onBack, activeAddOns, onToggleAddOn }: MarketplaceViewProps) {
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [selectedAddOn, setSelectedAddOn] = useState<AddOn | null>(null);
  const [subscriptionDuration, setSubscriptionDuration] = useState('Bulanan');
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState<AddOn | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const addOns: AddOn[] = [
    {
      id: 'netralog',
      title: 'NetraLog Registry',
      category: 'Modul Utama',
      description: 'Instrumen riset digital & bank data kasus dokter mata.',
      price: 'Gratis',
      isFree: true,
      isActive: activeAddOns.includes('NetraLog Registry'),
      icon: <Database className="w-6 h-6" />
    },
    {
      id: 'praktek-mandiri',
      title: 'Praktek Mandiri',
      category: 'Modul Profesional',
      description: 'Manajemen jadwal & tarif untuk praktik pribadi.',
      price: 'Rp 150.000 /bln',
      isFree: false,
      isActive: activeAddOns.includes('Praktek Mandiri'),
      icon: <Zap className="w-6 h-6" />
    },
    {
      id: 'uveitis',
      title: 'Registry Uveitis',
      category: 'NetraLog Registry',
      description: 'Pencatatan terstandar untuk kasus inflamasi intraokular.',
      price: 'Rp 250.000 /bln',
      isFree: false,
      isActive: activeAddOns.includes('Registry Uveitis'),
      icon: <LayoutGrid className="w-6 h-6" />
    },
    {
      id: 'ulkus',
      title: 'Registry Ulkus Kornea',
      category: 'NetraLog Registry',
      description: 'Tracking etiologi & outcome terapi keratitis.',
      price: 'Rp 200.000 /bln',
      isFree: false,
      isActive: activeAddOns.includes('Registry Ulkus Kornea'),
      icon: <LayoutGrid className="w-6 h-6" />
    },
    {
      id: 'fundus',
      title: 'Registry Fundus',
      category: 'NetraLog Registry',
      description: 'Database citra retina & makula.',
      price: 'Rp 350.000 /bln',
      isFree: false,
      isActive: activeAddOns.includes('Registry Fundus'),
      icon: <LayoutGrid className="w-6 h-6" />
    },
    {
      id: 'ai-retina',
      title: 'AI Diagnostik Retina',
      category: 'Pemeriksaan Klinis',
      description: 'Analisis fundus otomatis untuk DR & AMD.',
      price: 'Rp 750.000 /bln',
      isFree: false,
      isActive: activeAddOns.includes('AI Diagnostik Retina'),
      icon: <Zap className="w-6 h-6" />
    },
    {
      id: 'dicom',
      title: 'DICOM Viewer Pro',
      category: 'Penunjang & Diagnostik',
      description: 'Advanced tools untuk baca OCT/MRI.',
      price: 'Rp 1.200.000 /bln',
      isFree: false,
      isActive: activeAddOns.includes('DICOM Viewer Pro'),
      icon: <Monitor className="w-6 h-6" />
    },
    {
      id: 'satusehat',
      title: 'Integrasi SATUSEHAT',
      category: 'Kepatuhan Regulasi',
      description: 'Konektor wajib Kemenkes RI.',
      price: 'Gratis',
      isFree: true,
      isActive: activeAddOns.includes('Integrasi SATUSEHAT'),
      icon: <Database className="w-6 h-6" />
    }
  ];

  const filteredAddOns = addOns.filter(item => {
    if (activeFilter === 'Semua') return true;
    if (activeFilter === 'Gratis') return item.isFree;
    if (activeFilter === 'Berbayar') return !item.isFree;
    if (activeFilter === 'Aktif') return item.isActive;
    return true;
  });

  const handleToggleClick = (item: AddOn) => {
    if (item.isActive) {
      setShowDeactivateConfirm(item);
    } else {
      setSelectedAddOn(item);
      setSubscriptionDuration('Bulanan');
    }
  };

  const handleConfirmActivation = () => {
    if (selectedAddOn) {
      onToggleAddOn(selectedAddOn.title);
      setSelectedAddOn(null);
      setShowSuccessModal(true);
    }
  };

  const handleConfirmDeactivation = () => {
    if (showDeactivateConfirm) {
      onToggleAddOn(showDeactivateConfirm.title);
      setShowDeactivateConfirm(null);
    }
  };

  const calculateTotal = (priceStr: string, duration: string) => {
    if (priceStr === 'Gratis') return 'Gratis';
    
    // Extract numeric value from string like "Rp 200.000 /bln"
    const numericMatch = priceStr.match(/\d+(\.\d+)?/g);
    if (!numericMatch) return priceStr;
    
    const basePrice = parseInt(numericMatch.join('').replace(/\./g, ''), 10);
    
    if (duration === 'Tahunan') {
      // Assuming 12 months, maybe with a discount, but let's just multiply by 12 for now
      const total = basePrice * 12;
      return `Rp ${total.toLocaleString('id-ID')}`;
    }
    
    return `Rp ${basePrice.toLocaleString('id-ID')}`;
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen p-8 animate-fade-in relative">
      <div className="max-w-[1440px] mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-display font-bold text-[#01315F]">Marketplace Add Ons</h1>
            <p className="text-gray-500 mt-1">Upgrade infrastruktur digital Klinik/RS Anda.</p>
          </div>
          
          <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-100">
            {['Semua', 'Gratis', 'Berbayar', 'Aktif'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2 text-sm font-bold rounded-lg transition-all ${
                  activeFilter === filter 
                    ? 'bg-[#01315F] text-white shadow-md' 
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAddOns.map((item) => (
            <div 
              key={item.id} 
              className={`bg-white rounded-2xl p-6 shadow-sm border transition-all hover:shadow-md flex flex-col h-full ${
                item.isActive ? 'border-green-200 ring-1 ring-green-100' : 'border-gray-100'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  item.isActive ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-400'
                }`}>
                  {item.icon}
                </div>
                <button className="text-gray-300 hover:text-gray-500">
                  <Info className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-gray-800 text-base">{item.title}</h3>
                  <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${
                    item.isFree ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {item.isFree ? 'Gratis' : 'Berbayar'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-3">
                  <LayoutGrid className="w-3 h-3" />
                  Kategori: {item.category}
                </div>
                <p className="text-xs text-gray-500 leading-relaxed mb-6">{item.description}</p>
              </div>

              <div className="flex justify-between items-end pt-4 border-t border-gray-50">
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Harga</p>
                  <p className="text-sm font-bold text-gray-800">{item.price}</p>
                </div>
                <button 
                  onClick={() => handleToggleClick(item)}
                  className={`px-6 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                  item.isActive 
                    ? 'bg-green-500 text-white hover:bg-green-600' 
                    : 'bg-[#01315F] text-white hover:bg-[#00284d]'
                }`}>
                  {item.isActive ? 'Aktif' : 'Aktifkan'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Navigation */}
        <div className="flex justify-center pt-8">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 px-8 py-3 bg-white hover:bg-gray-50 text-gray-600 font-bold text-sm rounded-xl border border-gray-200 shadow-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Dashboard
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {selectedAddOn && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-[#01315F] mb-6">
                <ShoppingCart className="w-8 h-8" />
              </div>
              
              <h2 className="text-xl font-display font-bold text-gray-900 mb-2">Konfirmasi Langganan</h2>
              <p className="text-sm text-gray-500 mb-8">
                Anda akan berlangganan modul <span className="font-bold text-[#01315F]">{selectedAddOn.title}</span>.
              </p>

              <div className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl p-5 mb-6 text-left">
                <div className="mb-4">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Pilih Durasi</label>
                  <div className="relative">
                    <select 
                      value={subscriptionDuration}
                      onChange={(e) => setSubscriptionDuration(e.target.value)}
                      className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-800 focus:outline-none focus:border-[#01315F] focus:ring-1 focus:ring-[#01315F] transition-all"
                    >
                      <option value="Bulanan">Bulanan</option>
                      <option value="Tahunan">Tahunan</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                  <span className="font-bold text-[#01315F] text-sm">Total Tagihan</span>
                  <span className="font-bold text-[#01315F] text-sm">
                    {calculateTotal(selectedAddOn.price, subscriptionDuration)}
                  </span>
                </div>
              </div>

              <p className="text-[10px] text-gray-400 mb-8 self-start text-left">
                *Modul akan aktif di seluruh fasilitas Anda sebagai Dokter.
              </p>

              <div className="flex gap-4 w-full">
                <button 
                  onClick={() => setSelectedAddOn(null)}
                  className="flex-1 py-3.5 bg-white border border-gray-200 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button 
                  onClick={handleConfirmActivation}
                  className="flex-1 py-3.5 bg-[#01315F] hover:bg-[#00284d] text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-900/20 transition-all active:scale-95"
                >
                  Bayar & Aktifkan
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Deactivation Confirmation Modal */}
      <AnimatePresence>
        {showDeactivateConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-6">
                <AlertTriangle className="w-8 h-8" />
              </div>
              
              <h2 className="text-xl font-display font-bold text-gray-900 mb-2">Nonaktifkan Modul?</h2>
              <p className="text-sm text-gray-500 mb-6">
                Anda akan menonaktifkan modul <span className="font-bold text-[#01315F]">{showDeactivateConfirm.title}</span>.
              </p>

              <div className="w-full bg-red-50/50 border border-red-100 rounded-2xl p-5 mb-8 text-left">
                <p className="text-xs text-red-700 mb-3">
                  <span className="font-bold">Perhatian:</span> Akses ke fitur modul ini akan dihentikan sementara. Data Anda tetap tersimpan aman.
                </p>
                <div className="border-t border-red-100 pt-3">
                  <p className="text-xs text-red-700">
                    Masa langganan Anda masih aktif, Anda dapat mengaktifkannya kembali kapan saja tanpa biaya tambahan.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 w-full">
                <button 
                  onClick={() => setShowDeactivateConfirm(null)}
                  className="flex-1 py-3.5 bg-white border border-gray-200 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button 
                  onClick={handleConfirmDeactivation}
                  className="flex-1 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-red-600/20 transition-all active:scale-95"
                >
                  Ya, Nonaktifkan
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-500 mb-6">
                <CheckCircle className="w-10 h-10" />
              </div>
              
              <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">Berhasil Aktif!</h2>
              <p className="text-sm text-gray-500 mb-8">
                Modul telah ditambahkan ke dashboard Anda.
              </p>

              <button 
                onClick={() => {
                  setShowSuccessModal(false);
                  onBack();
                }}
                className="w-full py-3.5 bg-[#01315F] hover:bg-[#00284d] text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-900/20 transition-all active:scale-95"
              >
                Buka Dashboard
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
