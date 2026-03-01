import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Send, 
  Building2, 
  Network, 
  Info, 
  AlertTriangle, 
  User, 
  Building, 
  Globe, 
  ClipboardList, 
  Loader2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ClinicFormWizardProps {
  onBack: () => void;
  onSubmit: (data: any) => void;
}

export default function ClinicFormWizard({ onBack, onSubmit }: ClinicFormWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isCabang, setIsCabang] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    tipe_daftar: 'pusat',
    id_induk: '',
    nama: '',
    tingkatan: 'fkrtl',
    kode_kemenkes: '',
    telp: '',
    email: '',
    alamat: '',
    provinsi: '',
    kota: '',
    pic_nama: '',
    pic_jabatan: '',
    pic_nik: '',
    pic_hp: '',
    pic_email: '',
    billing_nama: '',
    billing_email: '',
    jenis_faskes_legalitas: 'klinik',
    paket: 'Pro',
    validasi_data: false,
    tos: false
  });

  const totalSteps = 5;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleTypeChange = (type: 'pusat' | 'cabang') => {
    setIsCabang(type === 'cabang');
    setFormData(prev => ({ ...prev, tipe_daftar: type }));
  };

  const validateStep = (step: number) => {
    if (step === 1) {
      if (!formData.nama) return false;
    }
    if (step === 2) {
      if (!formData.pic_nama || !formData.pic_nik || !formData.pic_hp || !formData.pic_email) return false;
    }
    return true;
  };

  const nextStep = () => {
    if (!validateStep(currentStep)) {
      // In a real app, show toast error here
      alert('Mohon lengkapi data wajib (*) sebelum melanjutkan.');
      return;
    }

    let next = currentStep + 1;
    // Skip Step 4 (Paket) if Cabang
    if (isCabang && currentStep === 3) next = 5;
    
    setCurrentStep(next);
  };

  const prevStep = () => {
    let prev = currentStep - 1;
    // Skip Step 4 (Paket) if Cabang
    if (isCabang && currentStep === 5) prev = 3;
    
    setCurrentStep(prev);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSubmit(formData);
    }, 1500);
  };

  const renderStepIndicator = (step: number, label: string) => {
    // Visual handling for skipped step 4
    if (isCabang && step === 4) {
      return (
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 flex items-center justify-center rounded-full font-bold transition-colors bg-gray-100 text-gray-300">-</div>
          <div className="mt-2 text-xs font-bold text-gray-300 line-through">{label}</div>
        </div>
      );
    }

    let circleClass = "w-10 h-10 flex items-center justify-center rounded-full font-bold transition-colors shadow-md ";
    let labelClass = "mt-2 text-xs font-bold ";
    let content: React.ReactNode = step;

    if (step < currentStep) {
      circleClass += "bg-satu-success text-white";
      labelClass += "text-satu-success";
      content = <Check className="w-5 h-5" />;
    } else if (step === currentStep) {
      circleClass += "bg-satu-primary text-white";
      labelClass += "text-satu-primary";
    } else {
      circleClass += "bg-gray-200 text-gray-500";
      labelClass += "text-gray-400";
    }

    return (
      <div className="flex flex-col items-center">
        <div className={circleClass}>{content}</div>
        <div className={labelClass}>{label}</div>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full w-full bg-gray-50/50 overflow-hidden relative">
      {/* Fixed Header */}
      <div className="bg-white border-b border-gray-200 shrink-0 shadow-md z-20 relative px-8 py-6 flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="font-display font-bold text-2xl text-satu-dark">Daftar Faskes Baru</h1>
          <p className="text-sm text-gray-500 mt-1">Lengkapi formulir untuk memulai digitalisasi faskes di ekosistem SATUMATA.</p>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 p-8 flex justify-center overflow-y-auto custom-scroll">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-sm border border-gray-100 p-8 h-fit mb-8">
          
          {/* Stepper UI */}
          <div className="flex items-center justify-between mb-10 w-full px-4">
            {renderStepIndicator(1, "Info Faskes")}
            <div className="flex-1 h-1 bg-gray-200 mx-2 rounded"></div>
            {renderStepIndicator(2, "Data PJ")}
            <div className="flex-1 h-1 bg-gray-200 mx-2 rounded"></div>
            {renderStepIndicator(3, "Legalitas")}
            <div className="flex-1 h-1 bg-gray-200 mx-2 rounded"></div>
            {renderStepIndicator(4, "Paket")}
            <div className="flex-1 h-1 bg-gray-200 mx-2 rounded"></div>
            {renderStepIndicator(5, "Konfirmasi")}
          </div>

          {/* Step Content */}
          <form onSubmit={(e) => e.preventDefault()}>
            
            {/* STEP 1: Info Klinik */}
            {currentStep === 1 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <h2 className="font-display text-xl font-bold text-gray-800 mb-6 border-b pb-2">1. Informasi Faskes</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Nama Faskes <span className="text-red-500">*</span></label>
                    <input 
                      type="text" name="nama" value={formData.nama} onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-satu-primary/20 focus:border-satu-primary outline-none transition-all" 
                      placeholder="Contoh: Klinik Mata Sehat Sentosa" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Tingkatan Faskes (BPJS)</label>
                    <select 
                      name="tingkatan" value={formData.tingkatan} onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-satu-primary/20 focus:border-satu-primary outline-none transition-all bg-white font-medium"
                    >
                      <option value="fktp">FKTP (Klinik Pratama / Praktik Mandiri)</option>
                      <option value="fkrtl">FKRTL (Klinik Utama / Rumah Sakit)</option>
                    </select>
                    <p className="text-[10px] text-gray-400 mt-1">Menentukan endpoint API BPJS (P-Care vs V-Claim).</p>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Kode Registrasi Kemenkes</label>
                    <input 
                      type="text" name="kode_kemenkes" value={formData.kode_kemenkes} onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-satu-primary/20 focus:border-satu-primary outline-none transition-all font-mono" 
                      placeholder="7 atau 14 Digit" 
                    />
                    <p className="text-[10px] text-gray-400 mt-1">Opsional saat ini, namun wajib untuk bridging SATUSEHAT.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Nomor Telepon Klinik</label>
                    <input 
                      type="tel" name="telp" value={formData.telp} onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-satu-primary/20 focus:border-satu-primary outline-none transition-all" 
                      placeholder="021-xxxxxxx" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Email Resmi Klinik</label>
                    <input 
                      type="email" name="email" value={formData.email} onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-satu-primary/20 focus:border-satu-primary outline-none transition-all" 
                      placeholder="info@klinik.com" 
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Alamat Lengkap</label>
                    <textarea 
                      name="alamat" rows={2} value={formData.alamat} onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-satu-primary/20 focus:border-satu-primary outline-none transition-all" 
                      placeholder="Jalan, Gedung, No..."
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Provinsi</label>
                    <select 
                      name="provinsi" value={formData.provinsi} onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-satu-primary/20 focus:border-satu-primary outline-none transition-all bg-white"
                    >
                      <option value="" disabled>Pilih Provinsi</option>
                      <option value="DKI Jakarta">DKI Jakarta</option>
                      <option value="Jawa Barat">Jawa Barat</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Kota / Kabupaten</label>
                    <select 
                      name="kota" value={formData.kota} onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-satu-primary/20 focus:border-satu-primary outline-none transition-all bg-white"
                    >
                      <option value="" disabled>Pilih Kota</option>
                      <option value="Jakarta Selatan">Jakarta Selatan</option>
                      <option value="Kota Depok">Kota Depok</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Data PJ */}
            {currentStep === 2 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <h2 className="font-display text-xl font-bold text-gray-800 mb-6 border-b pb-2">2. Data Penanggung Jawab (PIC)</h2>
                
                <h3 className="font-bold text-satu-dark mb-4 mt-2">A. PIC Operasional / Medis (Akun Utama)</h3>
                <div className="bg-blue-50/50 p-4 border border-blue-100 rounded-xl mb-6 text-sm text-blue-800 flex items-start gap-2">
                  <Info className="w-4 h-4 mt-0.5" />
                  <span>Akun Admin Utama Ekosistem akan dibuat berdasarkan email PIC ini.</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 border-b border-gray-100 pb-8">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Nama Lengkap & Gelar <span className="text-red-500">*</span></label>
                    <input 
                      type="text" name="pic_nama" value={formData.pic_nama} onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-satu-primary/20 focus:border-satu-primary outline-none transition-all" 
                      placeholder="Dr. Budi, Sp.M" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Jabatan</label>
                    <input 
                      type="text" name="pic_jabatan" value={formData.pic_jabatan} onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-satu-primary/20 focus:border-satu-primary outline-none transition-all" 
                      placeholder="Direktur Klinik / Penanggung Jawab" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">NIK KTP <span className="text-red-500">*</span></label>
                    <input 
                      type="text" name="pic_nik" value={formData.pic_nik} onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-satu-primary/20 focus:border-satu-primary outline-none transition-all" 
                      placeholder="16 Digit NIK" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Nomor HP / WA Aktif <span className="text-red-500">*</span></label>
                    <input 
                      type="tel" name="pic_hp" value={formData.pic_hp} onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-satu-primary/20 focus:border-satu-primary outline-none transition-all" 
                      placeholder="0812..." 
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Email Pribadi <span className="text-red-500">*</span></label>
                    <input 
                      type="email" name="pic_email" value={formData.pic_email} onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-satu-primary/20 focus:border-satu-primary outline-none transition-all" 
                      placeholder="budi@email.com" 
                    />
                  </div>
                </div>

                <h3 className="font-bold text-satu-dark mb-4">B. PIC Keuangan / Tagihan (Opsional)</h3>
                <p className="text-xs text-gray-500 mb-4">Isi jika pengiriman invoice dan urusan billing ditangani oleh staf/divisi yang berbeda (Misal: Manajer Keuangan).</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Nama Kontak Billing</label>
                    <input 
                      type="text" name="billing_nama" value={formData.billing_nama} onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-satu-primary/20 focus:border-satu-primary outline-none transition-all" 
                      placeholder="Nama Admin Finance" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Email Khusus Tagihan</label>
                    <input 
                      type="email" name="billing_email" value={formData.billing_email} onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-satu-primary/20 focus:border-satu-primary outline-none transition-all" 
                      placeholder="finance@klinik.com" 
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Legalitas */}
            {currentStep === 3 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <h2 className="font-display text-xl font-bold text-gray-800 mb-6 border-b pb-2">3. Legalitas Fasilitas Kesehatan</h2>
                <div className="bg-orange-50/50 p-4 border border-orange-100 rounded-xl mb-6 text-sm text-orange-800 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 mt-0.5" />
                  <span>Pastikan memasukkan <strong>Tanggal Masa Berlaku</strong> untuk memicu Early Warning System sebelum izin habis.</span>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Pilih Jenis Faskes Khusus Legalitas</label>
                    <select 
                      name="jenis_faskes_legalitas" value={formData.jenis_faskes_legalitas} onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-satu-primary/20 focus:border-satu-primary outline-none transition-all bg-white font-bold text-satu-primary"
                    >
                      <option value="klinik">Klinik (Pratama / Utama)</option>
                      <option value="rs">Rumah Sakit Khusus Mata</option>
                      <option value="praktek">Praktik Mandiri Dokter</option>
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-6 p-5 bg-gray-50 border border-gray-200 rounded-xl">
                    {(formData.jenis_faskes_legalitas === 'klinik' || formData.jenis_faskes_legalitas === 'rs') ? (
                      <>
                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div><label className="block text-xs font-bold text-gray-600 mb-1">Nomor Induk Berusaha (NIB)</label><input type="text" className="w-full p-3 border rounded-lg focus:border-satu-primary outline-none text-sm" /></div>
                          <div><label className="block text-xs font-bold text-gray-600 mb-1">NPWP Faskes</label><input type="text" className="w-full p-3 border rounded-lg focus:border-satu-primary outline-none text-sm" /></div>
                        </div>
                        <div className="bg-white p-4 border border-gray-200 rounded-lg">
                          <label className="block text-xs font-bold text-gray-600 mb-2">Izin Operasional Klinik</label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                             <input type="file" className="text-xs w-full border p-2 rounded-lg" />
                             <div>
                                <label className="block text-[10px] font-bold text-gray-500 mb-1">Masa Berlaku <span className="text-red-500">*</span></label>
                                <input type="date" className="w-full p-2 border rounded-lg focus:border-satu-primary outline-none text-xs" />
                             </div>
                          </div>
                        </div>
                        <div className="bg-white p-4 border border-gray-200 rounded-lg">
                          <label className="block text-xs font-bold text-gray-600 mb-2">Akta Pendirian Badan Usaha</label>
                          <input type="file" className="text-xs w-full border p-2 rounded-lg" />
                          <p className="text-[10px] text-gray-400 mt-2">Format PDF maksimal 5MB.</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
                          <div className="flex items-center justify-between mb-3">
                            <label className="block text-sm font-bold text-gray-700">Surat Tanda Registrasi (STR)</label>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                            <div className="md:col-span-5">
                              <label className="block text-[10px] font-bold text-gray-500 mb-1">Nomor STR</label>
                              <input type="text" placeholder="Contoh: 123456789" className="w-full p-2.5 border border-gray-300 rounded-lg focus:border-satu-primary outline-none text-sm" />
                            </div>
                            <div className="md:col-span-3">
                              <label className="block text-[10px] font-bold text-gray-500 mb-1">Masa Berlaku <span className="text-red-500">*</span></label>
                              <input type="date" className="w-full p-2.5 border border-gray-300 rounded-lg focus:border-satu-primary outline-none text-sm" />
                            </div>
                            <div className="md:col-span-4">
                              <label className="block text-[10px] font-bold text-gray-500 mb-1">Upload Dokumen</label>
                              <input type="file" className="w-full text-xs text-gray-500 file:mr-2 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                            </div>
                          </div>
                        </div>

                        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
                          <div className="flex items-center justify-between mb-3">
                            <label className="block text-sm font-bold text-gray-700">Surat Izin Praktik (SIP)</label>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                            <div className="md:col-span-5">
                              <label className="block text-[10px] font-bold text-gray-500 mb-1">Nomor SIP</label>
                              <input type="text" placeholder="Contoh: 503/..." className="w-full p-2.5 border border-gray-300 rounded-lg focus:border-satu-primary outline-none text-sm" />
                            </div>
                            <div className="md:col-span-3">
                              <label className="block text-[10px] font-bold text-gray-500 mb-1">Masa Berlaku <span className="text-red-500">*</span></label>
                              <input type="date" className="w-full p-2.5 border border-gray-300 rounded-lg focus:border-satu-primary outline-none text-sm" />
                            </div>
                            <div className="md:col-span-4">
                              <label className="block text-[10px] font-bold text-gray-500 mb-1">Upload Dokumen</label>
                              <input type="file" className="w-full text-xs text-gray-500 file:mr-2 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 4: Paket */}
            {currentStep === 4 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <h2 className="font-display text-xl font-bold text-gray-800 mb-6 border-b pb-2">4. Paket & Sistem</h2>
                
                <label className="block text-sm font-bold text-gray-700 mb-4">Pilih Paket Ekosistem</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {['Starter', 'Pro', 'Enterprise'].map((pkg) => (
                    <div key={pkg} className="relative">
                      <input 
                        type="radio" name="paket" id={`paket-${pkg}`} value={pkg} 
                        checked={formData.paket === pkg} onChange={handleInputChange}
                        className="hidden peer" 
                      />
                      <label htmlFor={`paket-${pkg}`} className="block border-2 border-gray-200 rounded-xl p-5 text-center cursor-pointer transition-all hover:border-satu-primary/50 bg-white peer-checked:border-satu-primary peer-checked:bg-blue-50/20 peer-checked:ring-1 peer-checked:ring-satu-primary relative overflow-hidden h-full">
                        {pkg === 'Pro' && <div className="absolute top-0 right-0 bg-satu-gold text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg">POPULER</div>}
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${pkg === 'Starter' ? 'bg-blue-50 text-blue-500' : pkg === 'Pro' ? 'bg-satu-primary/10 text-satu-primary' : 'bg-purple-50 text-purple-600'}`}>
                          {pkg === 'Starter' ? <User className="w-6 h-6" /> : pkg === 'Pro' ? <Building className="w-6 h-6" /> : <Building2 className="w-6 h-6" />}
                        </div>
                        <h3 className="font-display font-bold text-lg text-satu-dark">{pkg}</h3>
                        <p className="text-xs text-gray-500 mt-1 h-8">
                          {pkg === 'Starter' ? 'Max 3 User, 1.000 API/bln' : pkg === 'Pro' ? 'Max 15 User, 10.000 API/bln' : 'Unlimited User & API'}
                        </p>
                        <p className="text-xl font-bold text-satu-primary mt-3">
                          {pkg === 'Starter' ? 'Rp 500rb' : pkg === 'Pro' ? 'Rp 1.5jt' : 'Custom'} <span className="text-xs text-gray-400 font-normal">{pkg !== 'Enterprise' && '/bln'}</span>
                        </p>
                      </label>
                    </div>
                  ))}
                </div>

                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Akses Sistem Ekosistem</label>
                  <div className="flex items-center gap-3 mt-2">
                    <Globe className="text-gray-400 w-5 h-5" />
                    <div>
                      <p className="text-sm font-bold text-gray-800">Subdomain Otomatis</p>
                      <p className="text-xs text-gray-500">Alamat login admin (subdomain) akan dibuat secara otomatis berdasarkan nama faskes untuk mencegah duplikasi (Contoh: <span className="text-satu-primary font-mono bg-blue-50 px-1 rounded">klinikmata.satumata.id</span>).</p>
                      <p className="text-[10px] text-gray-400 mt-2 italic">*Custom domain mandiri dapat dikoordinasikan dengan tim IT Support pasca pendaftaran.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 5: Konfirmasi */}
            {currentStep === 5 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <h2 className="font-display text-xl font-bold text-gray-800 mb-6 border-b pb-2">5. Konfirmasi Pendaftaran</h2>
                
                <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-200">
                  <h3 className="font-bold text-satu-dark mb-4 flex items-center gap-2"><ClipboardList className="w-4 h-4" /> Ringkasan Data</h3>
                  <div className="grid grid-cols-2 gap-y-3 text-sm">
                    <div><span className="text-gray-500 block text-xs">Tipe Registrasi</span> <span className="font-bold text-satu-primary">{isCabang ? 'Penambahan Cabang' : 'Faskes Pusat / Mandiri'}</span></div>
                    <div><span className="text-gray-500 block text-xs">Nama Klinik</span> <span className="font-bold">{formData.nama}</span></div>
                    <div><span className="text-gray-500 block text-xs">Jenis Faskes</span> <span className="font-bold uppercase">{formData.jenis_faskes_legalitas}</span></div>
                    <div><span className="text-gray-500 block text-xs">Penanggung Jawab</span> <span className="font-bold">{formData.pic_nama}</span></div>
                    <div className="col-span-2"><span className="text-gray-500 block text-xs">Paket / Billing</span> <span className="font-bold">{isCabang ? 'Mengikuti Tagihan Faskes Induk' : formData.paket}</span></div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex items-center mt-0.5">
                      <input 
                        type="checkbox" name="validasi_data" checked={formData.validasi_data} onChange={handleCheckboxChange}
                        className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-gray-300 shadow-sm checked:border-satu-primary checked:bg-satu-primary transition-all" 
                      />
                      <Check className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
                    </div>
                    <div>
                      <span className="block text-sm font-bold text-gray-800">Validasi Data</span>
                      <span className="block text-xs text-gray-500">Saya menyatakan bahwa seluruh data dan dokumen yang dilampirkan adalah benar dan sah secara hukum.</span>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex items-center mt-0.5">
                      <input 
                        type="checkbox" name="tos" checked={formData.tos} onChange={handleCheckboxChange}
                        className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-gray-300 shadow-sm checked:border-satu-primary checked:bg-satu-primary transition-all" 
                      />
                      <Check className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
                    </div>
                    <div>
                      <span className="block text-sm font-bold text-gray-800">Persetujuan Layanan (ToS)</span>
                      <span className="block text-xs text-gray-500">Saya menyetujui Syarat & Ketentuan serta Kebijakan Privasi ekosistem SATUMATA.</span>
                    </div>
                  </label>
                </div>
              </motion.div>
            )}

          </form>

          {/* Wizard Footer Buttons */}
          <div className="mt-10 pt-6 border-t border-gray-100 flex justify-between items-center">
            <button 
              type="button" 
              onClick={prevStep} 
              className={`px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2 ${currentStep === 1 ? 'invisible' : ''}`}
            >
              <ChevronLeft className="w-4 h-4" /> Kembali
            </button>
            
            {currentStep < totalSteps ? (
              <button 
                type="button" 
                onClick={nextStep} 
                className="px-8 py-2.5 bg-satu-primary text-white font-bold text-sm rounded-xl hover:bg-satu-dark transition-all shadow-md flex items-center gap-2"
              >
                Lanjutkan <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button 
                type="button" 
                onClick={handleSubmit} 
                disabled={!formData.validasi_data || !formData.tos || isSubmitting}
                className="px-8 py-2.5 bg-satu-success text-white font-bold text-sm rounded-xl hover:bg-green-600 transition-all shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} 
                {isSubmitting ? 'Memproses...' : 'Kirim Pendaftaran'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
