import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Tesseract from 'tesseract.js';
import { 
  X, 
  Upload, 
  MapPin, 
  ChevronDown, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Building2, 
  User, 
  FileText, 
  Package,
  Camera,
  Mail,
  Phone,
  CreditCard,
  Briefcase,
  LogOut
} from 'lucide-react';

interface FaskesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any;
  isViewOnly?: boolean;
}

export default function FaskesModal({ isOpen, onClose, onSave, initialData, isViewOnly }: FaskesModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(initialData?.formData || {
    // Step 1: Umum
    logo: null as string | null,
    namaKlinik: initialData?.name || '',
    kodeFaskes: initialData?.code || '',
    teleponKlinik: '',
    emailKlinik: '',
    alamat: initialData?.location || '',
    negara: 'Indonesia',
    provinsi: initialData?.location?.split(', ')[1] || '',
    kota: initialData?.location?.split(', ')[0] || '',
    kodePos: '',
    kecamatan: '',
    kelurahan: '',
    
    // Step 2: PJ
    ktpPJ: null as string | null,
    namaPJ: '',
    jabatanPJ: '',
    nikPJ: '',
    npwpPribadiPJ: '',
    hpPJ: '',
    emailAdmin: '',
    billingSameAsPJ: false,
    billingNama: '',
    billingEmail: '',
    billingHp: '',
    
    // Step 3: Legal
    jenisKlinik: initialData?.type || '',
    sipDokter: null as string | null,
    nib: null as string | null,
    npwpBadan: null as string | null,
    izinOperasional: null as string | null,
    
    // Step 4: Paket
    paket: 'Pro',
    subdomain: '',
    agreement1: false,
    agreement2: false,
    signature: null as string | null,
  });

  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggle = (name: string) => {
    setFormData(prev => ({ ...prev, [name]: !(prev as any)[name] }));
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSave = () => {
    setIsConfirmed(true);
  };

  const handleFinalSubmit = () => {
    onSave(formData);
    onClose();
    // Reset step for next time
    setTimeout(() => {
      setStep(1);
      setIsConfirmed(false);
    }, 300);
  };

  const signatureCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (isViewOnly) return;
    setIsDrawing(true);
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || isViewOnly) return;
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing || isViewOnly) return;
    setIsDrawing(false);
    const canvas = signatureCanvasRef.current;
    if (canvas) {
      setFormData(prev => ({ ...prev, signature: canvas.toDataURL() }));
    }
  };

  const clearSignature = (e: React.MouseEvent) => {
    e.stopPropagation();
    const canvas = signatureCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    setFormData(prev => ({ ...prev, signature: null }));
  };

  const [isOcrLoading, setIsOcrLoading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const result = reader.result as string;
        setFormData(prev => ({ ...prev, [name]: result }));

        if (name === 'ktpPJ') {
          setIsOcrLoading(true);
          try {
            const { data: { text } } = await Tesseract.recognize(
              result,
              'ind',
              { logger: m => console.log(m) }
            );
            
            const lines = text.split('\n');
            let foundNik = '';
            let foundName = '';
            
            for (let i = 0; i < lines.length; i++) {
              const line = lines[i];
              if (!foundNik) {
                const nikMatch = line.match(/\b\d{16}\b/);
                if (nikMatch) foundNik = nikMatch[0];
              }
              if (!foundName) {
                const nameMatch = line.match(/(?:Nama|NAMA|Narna|Name)\s*[:;]?\s*(.+)/i);
                if (nameMatch && nameMatch[1].trim().length > 0) {
                  foundName = nameMatch[1].trim().replace(/[^A-Za-z\s\.,]/g, '');
                }
              }
            }
            
            setFormData(prev => ({
              ...prev,
              nikPJ: foundNik || prev.nikPJ,
              namaPJ: foundName || prev.namaPJ,
            }));
          } catch (error) {
            console.error("OCR Error:", error);
          } finally {
            setIsOcrLoading(false);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        // In a real app, we'd reverse geocode this. 
        // For now, we'll just show a success message or fill a placeholder.
        setFormData(prev => ({ ...prev, alamat: prev.alamat + ` (Lat: ${position.coords.latitude}, Lng: ${position.coords.longitude})` }));
      });
    }
  };

  if (!isOpen) return null;

  if (isConfirmed) {
    return (
      <div className="w-full bg-slate-50 flex flex-col min-h-[calc(100vh-100px)] rounded-[32px] overflow-hidden border border-gray-200 shadow-sm animate-fade-in relative items-center justify-center p-8">
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl transition-all font-bold text-sm"
        >
          <LogOut className="w-4 h-4" />
          <span>KELUAR</span>
        </button>

        <div className="max-w-2xl w-full flex flex-col items-center">
          <img 
            src="https://noviandri.com/wp-content/uploads/2025/11/SATUMATA-e1763948072282.png" 
            alt="Logo" 
            className="h-12 w-auto mb-4"
            referrerPolicy="no-referrer"
          />
          <h1 className="text-2xl font-display font-bold text-satu-primary tracking-widest uppercase mb-6">SATUMATA</h1>
          
          <h2 className="text-3xl font-display font-bold text-slate-800 mb-2">Konfirmasi Data</h2>
          <p className="text-gray-500 mb-10">Mohon periksa kembali kelengkapan data sebelum dikirim.</p>

          <div className="w-full bg-white rounded-2xl border border-gray-200 p-8 shadow-sm mb-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-center">
                {formData.logo ? (
                  <img src={formData.logo} alt="Logo" className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <Building2 className="w-8 h-8 text-gray-300" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">{formData.namaKlinik || 'Nama Faskes'}</h3>
                <div className="inline-block mt-1 px-3 py-1 bg-satu-primary text-white text-xs font-bold rounded-lg">
                  Fasilitas Kesehatan
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-500 text-sm">Email</span>
                <span className="font-medium text-slate-800">{formData.emailKlinik || '-'}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-500 text-sm">Nomor Telepon</span>
                <span className="font-medium text-slate-800">{formData.teleponKlinik || '-'}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-500 text-sm">Paket Layanan</span>
                <span className="font-medium text-slate-800">{formData.paket}</span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <p className="text-xs text-gray-500 italic mb-6">
                Saya yang bertanda tangan di bawah ini menyatakan bahwa data yang diisi adalah benar dan sah secara hukum.
              </p>
              <div className="flex justify-between items-end">
                <div>
                  <div className="w-48 border-b border-gray-300 mb-2 pb-2">
                    {formData.signature && (
                      <img src={formData.signature} alt="Signature" className="h-12 object-contain" />
                    )}
                  </div>
                  <p className="font-bold text-slate-800 text-sm">{formData.namaPJ || 'Nama Penanggung Jawab'}</p>
                  <p className="text-xs text-gray-400">Digital Signature</p>
                </div>
                <div className="flex flex-col items-end">
                  <div className="w-20 h-20 bg-white p-1 border border-gray-200 rounded-lg mb-2">
                    {/* Dummy QR Code */}
                    <div className="w-full h-full bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1200px-QR_code_for_mobile_English_Wikipedia.svg.png')] bg-cover opacity-80" />
                  </div>
                  <p className="text-[8px] text-gray-400 font-mono">HASH: 8X92A...</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 w-full">
            <button 
              onClick={() => setIsConfirmed(false)}
              className="flex-1 py-4 border border-gray-200 text-slate-700 font-bold rounded-xl hover:bg-gray-50 transition-all"
            >
              Perbaiki Data
            </button>
            <button 
              onClick={handleFinalSubmit}
              className="flex-1 py-4 bg-satu-primary text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
            >
              Kirim Pendaftaran
            </button>
          </div>
        </div>
      </div>
    );
  }

  const steps = [
    { id: 1, name: 'Umum', icon: Building2 },
    { id: 2, name: 'PJ', icon: User },
    { id: 3, name: 'Legal', icon: FileText },
    { id: 4, name: 'Paket', icon: Package },
  ];

  return (
    <div className="w-full bg-slate-50 flex flex-col min-h-[calc(100vh-100px)] rounded-[32px] overflow-hidden border border-gray-200 shadow-sm animate-fade-in">
      {/* Header - Sticky */}
      <div className="px-10 py-6 border-b border-gray-200 flex items-center justify-between bg-white sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-satu-surface rounded-2xl flex items-center justify-center shadow-sm border border-gray-50">
            <img 
              src="https://noviandri.com/wp-content/uploads/2025/11/SATUMATA-e1763948072282.png" 
              alt="Logo" 
              className="h-10 w-auto"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wider">Know Your Business (KYB)</span>
              <div className="w-1 h-1 bg-gray-300 rounded-full" />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Verification Process</span>
            </div>
            <h2 className="text-2xl font-display font-bold text-slate-800 tracking-tight">Profil Lengkap Faskes</h2>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-xl transition-all text-gray-500 hover:text-gray-800 font-bold text-sm"
        >
          <X className="w-5 h-5" />
          <span>Tutup</span>
        </button>
      </div>

        {/* Stepper - Sticky below header */}
        <div className="px-10 py-5 bg-white border-b border-gray-200 sticky top-[104px] z-20">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            {steps.map((s, idx) => (
              <React.Fragment key={s.id}>
                <div className="flex flex-col items-center gap-2 relative z-10">
                  <motion.div 
                    animate={{ 
                      scale: step === s.id ? 1.1 : 1,
                      backgroundColor: step >= s.id ? '#235F94' : '#ffffff'
                    }}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 shadow-sm border ${
                      step >= s.id ? 'text-white border-satu-primary' : 'text-gray-400 border-gray-200'
                    } ${step === s.id ? 'shadow-lg shadow-blue-100 ring-4 ring-blue-50' : ''}`}
                  >
                    {step > s.id ? <Check className="w-5 h-5" /> : <s.icon className="w-4 h-4" />}
                  </motion.div>
                  <span className={`text-[9px] font-bold uppercase tracking-widest transition-colors duration-300 ${step >= s.id ? 'text-satu-primary' : 'text-gray-400'}`}>
                    {s.name}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div className="flex-1 h-[2px] mx-2 -mt-6 relative bg-gray-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: '0%' }}
                      animate={{ width: step > s.id ? '100%' : '0%' }}
                      className="absolute inset-0 bg-satu-primary"
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-10 bg-white">
          <div className={`max-w-5xl mx-auto ${isViewOnly ? 'pointer-events-none opacity-90' : ''}`}>
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Logo Upload */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Logo Faskes</label>
                  <label className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 hover:border-satu-primary hover:bg-blue-50/30 transition-all cursor-pointer group relative overflow-hidden">
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'logo')} disabled={isViewOnly} />
                    {formData.logo ? (
                      <img src={formData.logo} alt="Logo" className="absolute inset-0 w-full h-full object-contain p-2" />
                    ) : (
                      <>
                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-satu-primary group-hover:text-white transition-colors">
                          <Upload className="w-6 h-6" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-bold text-gray-700">Upload Logo</p>
                          <p className="text-xs text-gray-400">Format PNG/JPG, Max 2MB</p>
                        </div>
                      </>
                    )}
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Nama Faskes</label>
                    <input 
                      type="text" 
                      name="namaKlinik"
                      value={formData.namaKlinik}
                      onChange={handleInputChange}
                      placeholder="Contoh: Faskes Mata Sehat Sentosa"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-satu-primary/20 focus:border-satu-primary outline-none transition-all text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Kode Faskes (Kemenkes/BPJS)</label>
                    <input 
                      type="text" 
                      name="kodeFaskes"
                      value={formData.kodeFaskes}
                      onChange={handleInputChange}
                      placeholder="Opsional"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-satu-primary/20 focus:border-satu-primary outline-none transition-all text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Nomor Telepon Faskes</label>
                    <input 
                      type="text" 
                      name="teleponKlinik"
                      value={formData.teleponKlinik}
                      onChange={handleInputChange}
                      placeholder="021-xxxx"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-satu-primary/20 focus:border-satu-primary outline-none transition-all text-sm"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Email Resmi Faskes</label>
                    <input 
                      type="email" 
                      name="emailKlinik"
                      value={formData.emailKlinik}
                      onChange={handleInputChange}
                      placeholder="admin@faskessehat.com"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-satu-primary/20 focus:border-satu-primary outline-none transition-all text-sm"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Alamat Jalan</label>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <textarea 
                          name="alamat"
                          value={formData.alamat}
                          onChange={handleInputChange}
                          rows={2}
                          placeholder="Nama Jalan, No. Gedung, RT/RW"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-satu-primary/20 focus:border-satu-primary outline-none transition-all text-sm resize-none"
                        />
                      </div>
                      <button 
                        onClick={handleGetLocation}
                        className="flex flex-col items-center justify-center gap-2 text-blue-600 font-bold text-[10px] bg-blue-50 px-4 rounded-xl hover:bg-blue-100 transition-colors border border-blue-100"
                      >
                        <MapPin className="w-5 h-5" />
                        <span>Ambil Lokasi</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Negara</label>
                    <div className="relative">
                      <select 
                        name="negara"
                        value={formData.negara}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-satu-primary/20 focus:border-satu-primary outline-none transition-all text-sm appearance-none"
                      >
                        <option value="Indonesia">Indonesia</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Provinsi</label>
                    <div className="relative">
                      <select 
                        name="provinsi"
                        value={formData.provinsi}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-satu-primary/20 focus:border-satu-primary outline-none transition-all text-sm appearance-none"
                      >
                        <option value="">Pilih Provinsi</option>
                        <option value="DKI Jakarta">DKI Jakarta</option>
                        <option value="Jawa Barat">Jawa Barat</option>
                        <option value="Jawa Tengah">Jawa Tengah</option>
                        <option value="Jawa Timur">Jawa Timur</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Kota / Kabupaten</label>
                    <div className="relative">
                      <select 
                        name="kota"
                        value={formData.kota}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-satu-primary/20 focus:border-satu-primary outline-none transition-all text-sm appearance-none"
                      >
                        <option value="">Pilih Kota/Kabupaten</option>
                        <option value="Jakarta Selatan">Jakarta Selatan</option>
                        <option value="Bandung">Bandung</option>
                        <option value="Surabaya">Surabaya</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Kecamatan</label>
                    <div className="relative">
                      <select 
                        name="kecamatan"
                        value={formData.kecamatan}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-satu-primary/20 focus:border-satu-primary outline-none transition-all text-sm appearance-none"
                      >
                        <option value="">-- Pilih Kecamatan --</option>
                        <option value="Kecamatan A">Kecamatan A</option>
                        <option value="Kecamatan B">Kecamatan B</option>
                        <option value="Kecamatan C">Kecamatan C</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Kelurahan / Desa</label>
                    <div className="relative">
                      <select 
                        name="kelurahan"
                        value={formData.kelurahan}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-satu-primary/20 focus:border-satu-primary outline-none transition-all text-sm appearance-none"
                      >
                        <option value="">-- Pilih Kelurahan --</option>
                        <option value="Kelurahan 1">Kelurahan 1</option>
                        <option value="Kelurahan 2">Kelurahan 2</option>
                        <option value="Kelurahan 3">Kelurahan 3</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Kode Pos</label>
                    <input 
                      type="text" 
                      name="kodePos"
                      value={formData.kodePos}
                      onChange={handleInputChange}
                      placeholder="5 Digit"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-satu-primary/20 focus:border-satu-primary outline-none transition-all text-sm"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* KTP PJ Upload */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Upload KTP Penanggung Jawab (Auto-fill)</label>
                  <label className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 hover:border-satu-primary hover:bg-blue-50/30 transition-all cursor-pointer group relative overflow-hidden">
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'ktpPJ')} disabled={isViewOnly} />
                    {formData.ktpPJ ? (
                      <img src={formData.ktpPJ} alt="KTP PJ" className="absolute inset-0 w-full h-full object-contain p-2" />
                    ) : (
                      <>
                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-satu-primary group-hover:text-white transition-colors">
                          <Camera className="w-6 h-6" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-bold text-gray-700">Upload KTP PJ</p>
                          <p className="text-xs text-gray-400">Klik atau Drag & Drop</p>
                        </div>
                      </>
                    )}
                    {isOcrLoading && (
                      <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center z-10">
                        <div className="w-6 h-6 border-2 border-satu-primary border-t-transparent rounded-full animate-spin mb-2"></div>
                        <span className="text-xs font-bold text-satu-primary">Membaca KTP...</span>
                      </div>
                    )}
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Nama Lengkap PJ</label>
                    <input 
                      type="text" 
                      name="namaPJ"
                      value={formData.namaPJ}
                      onChange={handleInputChange}
                      placeholder="Nama & Gelar"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-satu-primary/20 focus:border-satu-primary outline-none transition-all text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Jabatan</label>
                    <input 
                      type="text" 
                      name="jabatanPJ"
                      value={formData.jabatanPJ}
                      onChange={handleInputChange}
                      placeholder="Contoh: Direktur"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-satu-primary/20 focus:border-satu-primary outline-none transition-all text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">NIK PJ</label>
                    <input 
                      type="text" 
                      name="nikPJ"
                      value={formData.nikPJ}
                      onChange={handleInputChange}
                      placeholder="16 Digit NIK"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-satu-primary/20 focus:border-satu-primary outline-none transition-all text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">NPWP Pribadi PJ</label>
                    <input 
                      type="text" 
                      name="npwpPribadiPJ"
                      value={formData.npwpPribadiPJ}
                      onChange={handleInputChange}
                      placeholder="Nomor NPWP"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-satu-primary/20 focus:border-satu-primary outline-none transition-all text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Nomor HP Aktif (WA)</label>
                    <input 
                      type="text" 
                      name="hpPJ"
                      value={formData.hpPJ}
                      onChange={handleInputChange}
                      placeholder="08xxxxxxxxxx"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-satu-primary/20 focus:border-satu-primary outline-none transition-all text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Email (Akun Admin)</label>
                    <input 
                      type="email" 
                      name="emailAdmin"
                      value={formData.emailAdmin}
                      onChange={handleInputChange}
                      placeholder="digunakan untuk login"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-satu-primary/20 focus:border-satu-primary outline-none transition-all text-sm"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-sm font-bold text-gray-700">Kontak Billing sama dengan Penanggung Jawab?</label>
                    <button 
                      onClick={() => handleToggle('billingSameAsPJ')}
                      className={`w-12 h-6 rounded-full transition-colors relative ${formData.billingSameAsPJ ? 'bg-satu-primary' : 'bg-gray-200'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.billingSameAsPJ ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>

                  {!formData.billingSameAsPJ && (
                    <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100 space-y-4">
                      <h4 className="text-sm font-bold text-satu-primary flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        Kontak Keuangan / Billing
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Nama Staff</label>
                          <input 
                            type="text" 
                            name="billingNama"
                            value={formData.billingNama}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-satu-primary/20 focus:border-satu-primary outline-none transition-all text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Email Tagihan</label>
                          <input 
                            type="email" 
                            name="billingEmail"
                            value={formData.billingEmail}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-satu-primary/20 focus:border-satu-primary outline-none transition-all text-sm"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">No HP / WA</label>
                          <input 
                            type="text" 
                            name="billingHp"
                            value={formData.billingHp}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-satu-primary/20 focus:border-satu-primary outline-none transition-all text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Pilih Jenis Faskes</label>
                  <div className="relative">
                    <select 
                      name="jenisKlinik"
                      value={formData.jenisKlinik}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-satu-primary/20 focus:border-satu-primary outline-none transition-all text-sm appearance-none"
                    >
                      <option value="">-- Pilih Jenis --</option>
                      <option value="Praktik Dokter">Praktik Dokter</option>
                      <option value="Faskes Pratama">Faskes Pratama</option>
                      <option value="Faskes Utama">Faskes Utama</option>
                      <option value="Rumah Sakit Khusus Mata">Rumah Sakit Khusus Mata</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {formData.jenisKlinik === 'Praktik Dokter' && (
                  <div className="space-y-4">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">SIP Dokter (Auto-fill)</label>
                    <label className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 hover:border-satu-primary hover:bg-blue-50/30 transition-all cursor-pointer group relative overflow-hidden">
                      <input type="file" className="hidden" accept="image/*,.pdf" onChange={(e) => handleFileUpload(e, 'sipDokter')} disabled={isViewOnly} />
                      {formData.sipDokter ? (
                        <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-blue-50/50">
                          <FileText className="w-8 h-8 text-satu-primary mb-2" />
                          <span className="text-xs font-bold text-satu-primary">File Terunggah</span>
                        </div>
                      ) : (
                        <>
                          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-satu-primary group-hover:text-white transition-colors">
                            <FileText className="w-6 h-6" />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-bold text-gray-700">Upload Surat Izin Praktik</p>
                          </div>
                        </>
                      )}
                    </label>
                  </div>
                )}

                {formData.jenisKlinik && formData.jenisKlinik !== 'Praktik Dokter' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">NIB (Auto-fill)</label>
                      <label className="border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 hover:border-satu-primary hover:bg-blue-50/30 transition-all cursor-pointer group relative overflow-hidden">
                        <input type="file" className="hidden" accept="image/*,.pdf" onChange={(e) => handleFileUpload(e, 'nib')} disabled={isViewOnly} />
                        {formData.nib ? (
                          <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-blue-50/50">
                            <FileText className="w-6 h-6 text-satu-primary mb-1" />
                            <span className="text-[10px] font-bold text-satu-primary">File Terunggah</span>
                          </div>
                        ) : (
                          <>
                            <FileText className="w-5 h-5 text-gray-400 group-hover:text-satu-primary" />
                            <p className="text-xs font-bold text-gray-700">Upload Nomor Induk Berusaha</p>
                          </>
                        )}
                      </label>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">NPWP Badan (Auto-fill)</label>
                      <label className="border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 hover:border-satu-primary hover:bg-blue-50/30 transition-all cursor-pointer group relative overflow-hidden">
                        <input type="file" className="hidden" accept="image/*,.pdf" onChange={(e) => handleFileUpload(e, 'npwpBadan')} disabled={isViewOnly} />
                        {formData.npwpBadan ? (
                          <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-blue-50/50">
                            <CreditCard className="w-6 h-6 text-satu-primary mb-1" />
                            <span className="text-[10px] font-bold text-satu-primary">File Terunggah</span>
                          </div>
                        ) : (
                          <>
                            <CreditCard className="w-5 h-5 text-gray-400 group-hover:text-satu-primary" />
                            <p className="text-xs font-bold text-gray-700">Upload Kartu NPWP</p>
                          </>
                        )}
                      </label>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Izin Operasional (Auto-fill)</label>
                      <label className="border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 hover:border-satu-primary hover:bg-blue-50/30 transition-all cursor-pointer group relative overflow-hidden">
                        <input type="file" className="hidden" accept="image/*,.pdf" onChange={(e) => handleFileUpload(e, 'izinOperasional')} disabled={isViewOnly} />
                        {formData.izinOperasional ? (
                          <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-blue-50/50">
                            <FileText className="w-6 h-6 text-satu-primary mb-1" />
                            <span className="text-[10px] font-bold text-satu-primary">File Terunggah</span>
                          </div>
                        ) : (
                          <>
                            <FileText className="w-5 h-5 text-gray-400 group-hover:text-satu-primary" />
                            <p className="text-xs font-bold text-gray-700">Upload Sertifikat Izin</p>
                          </>
                        )}
                      </label>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {step === 4 && (
              <motion.div 
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                {/* Paket Langganan */}
                <div>
                  <h3 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Pilih Paket Langganan</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { 
                        name: 'Starter', 
                        price: 'Rp500rb', 
                        features: ['1 Dokter', 'Kuota 500 Pasien', 'Basic Dashboard'],
                        isPopular: false
                      },
                      { 
                        name: 'Pro', 
                        price: 'Rp1.5jt', 
                        features: ['5 Dokter Spesialis', 'Unlimited Pasien', 'E-Resep & Bridging BPJS'],
                        isPopular: true
                      },
                      { 
                        name: 'Enterprise', 
                        price: 'Hubungi Kami', 
                        features: ['Unlimited Dokter', 'Custom Integrasi API', 'White Label & Support'],
                        isPopular: false
                      },
                    ].map((p) => (
                      <div 
                        key={p.name}
                        onClick={() => setFormData(prev => ({ ...prev, paket: p.name }))}
                        className={`p-6 rounded-2xl border-2 transition-all cursor-pointer relative ${
                          formData.paket === p.name ? 'border-satu-primary bg-blue-50/50 ring-4 ring-blue-50' : 'border-gray-100 hover:border-gray-200'
                        }`}
                      >
                        {p.isPopular && (
                          <div className="absolute -top-3 right-4 bg-satu-primary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                            Populer
                          </div>
                        )}
                        {formData.paket === p.name && (
                          <div className="absolute top-4 right-4 w-6 h-6 bg-satu-primary text-white rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4" />
                          </div>
                        )}
                        <h4 className="font-display font-bold text-lg text-slate-800 text-center">{p.name}</h4>
                        <p className="text-2xl font-bold text-satu-primary mt-2 text-center">
                          {p.price}
                          {p.price !== 'Hubungi Kami' && <span className="text-xs text-gray-400 font-normal">/bln</span>}
                        </p>
                        <ul className="mt-6 space-y-3">
                          {p.features.map(f => (
                            <li key={f} className="text-xs text-gray-600 flex items-center gap-2">
                              <Check className="w-3 h-3 text-green-500 flex-shrink-0" />
                              {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Subdomain */}
                <div>
                  <h3 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Subdomain Diinginkan</h3>
                  <div className="flex rounded-xl overflow-hidden border border-gray-200 focus-within:border-satu-primary focus-within:ring-4 focus-within:ring-blue-50 transition-all">
                    <input
                      type="text"
                      name="subdomain"
                      value={formData.subdomain}
                      onChange={handleInputChange}
                      placeholder="namaklinik"
                      className="flex-1 px-4 py-3 outline-none text-sm"
                    />
                    <div className="bg-gray-50 px-4 py-3 border-l border-gray-200 text-gray-500 text-sm font-medium flex items-center">
                      .oftalmo.id
                    </div>
                  </div>
                </div>

                {/* Agreements */}
                <div className="space-y-3 pt-4 border-t border-gray-100">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center mt-0.5">
                      <input 
                        type="checkbox" 
                        checked={formData.agreement1}
                        onChange={() => handleToggle('agreement1')}
                        className="peer sr-only" 
                      />
                      <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:bg-satu-primary peer-checked:border-satu-primary transition-all flex items-center justify-center group-hover:border-satu-primary">
                        <Check className="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100" />
                      </div>
                    </div>
                    <span className="text-sm text-gray-600 leading-relaxed">
                      Saya menyatakan bahwa data yang diisi adalah benar dan sah secara hukum.
                    </span>
                  </label>
                  
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center mt-0.5">
                      <input 
                        type="checkbox" 
                        checked={formData.agreement2}
                        onChange={() => handleToggle('agreement2')}
                        className="peer sr-only" 
                      />
                      <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:bg-satu-primary peer-checked:border-satu-primary transition-all flex items-center justify-center group-hover:border-satu-primary">
                        <Check className="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100" />
                      </div>
                    </div>
                    <span className="text-sm text-gray-600 leading-relaxed">
                      Saya menyetujui Syarat dan Ketentuan Layanan serta Kebijakan Privasi SATUMATA.
                    </span>
                  </label>
                </div>

                {/* Signature */}
                <div>
                  <h3 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Tanda Tangan Digital (Wajib)</h3>
                  <div className="border-2 border-dashed border-gray-200 rounded-2xl h-48 relative bg-white flex flex-col items-center justify-center group hover:border-satu-primary transition-all overflow-hidden">
                    <canvas
                      ref={signatureCanvasRef}
                      width={600}
                      height={200}
                      className={`w-full h-full ${isViewOnly ? 'pointer-events-none' : 'cursor-crosshair'} absolute inset-0 z-10 ${formData.signature ? 'hidden' : 'block'}`}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                    />
                    
                    {formData.signature ? (
                      <>
                        <img src={formData.signature} alt="Signature" className="max-h-full max-w-full object-contain p-4 relative z-0" />
                        {!isViewOnly && (
                          <button 
                            onClick={clearSignature}
                            className="absolute top-4 right-4 px-3 py-1.5 bg-white border border-red-200 text-red-600 text-xs font-bold rounded-lg hover:bg-red-50 transition-colors z-20"
                          >
                            Hapus
                          </button>
                        )}
                      </>
                    ) : (
                      <div className="text-center pointer-events-none relative z-0">
                        <p className="text-sm text-gray-400 font-medium">Silakan tanda tangan di sini</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          </div>
        </div>

        {/* Footer Actions - Sticky */}
        <div className="px-10 py-6 border-t border-gray-200 bg-white flex items-center justify-between sticky bottom-0 z-30 shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
          <button 
            onClick={step === 1 ? onClose : prevStep}
            className="px-8 py-3.5 border border-gray-200 text-gray-600 font-bold text-sm rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95"
          >
            {step === 1 ? 'Batalkan' : 'Kembali'}
          </button>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end mr-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Langkah {step} dari 4</span>
              <span className="text-xs font-bold text-satu-primary">{steps[step-1].name}</span>
            </div>
            {isViewOnly && step === 4 ? (
              <button 
                onClick={onClose}
                className="px-10 py-3.5 bg-satu-primary hover:bg-blue-700 text-white font-bold text-sm rounded-2xl transition-all shadow-xl shadow-blue-200 flex items-center gap-3 active:scale-95 group"
              >
                Tutup
              </button>
            ) : (
              <button 
                onClick={step === 4 ? handleSave : nextStep}
                className="px-10 py-3.5 bg-satu-primary hover:bg-blue-700 text-white font-bold text-sm rounded-2xl transition-all shadow-xl shadow-blue-200 flex items-center gap-3 active:scale-95 group"
              >
                {step === 4 ? (initialData ? 'Simpan Perubahan' : 'Ajukan & Konfirmasi') : 'Lanjutkan'}
                {step < 4 && <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                {step === 4 && <Check className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>
    </div>
  );
}
