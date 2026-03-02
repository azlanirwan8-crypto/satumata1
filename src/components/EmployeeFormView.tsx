import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Wallet, 
  Key, 
  ChevronRight, 
  ChevronLeft, 
  Save, 
  X,
  Plus,
  Trash2,
  Camera,
  FileText,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
  ArrowLeft,
  RefreshCcw,
  ScanFace,
  Upload,
  FileSignature,
  Calculator,
  CreditCard,
  Thermometer,
  Baby,
  HeartHandshake,
  Plane,
  Clock,
  Info,
  Download,
  Search,
  PlusCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { Employee } from './EmployeeDirectoryView';
import { MasterItem } from './SuperAdminDashboard';

interface EmployeeFormViewProps {
  initialData?: Employee | null;
  availableRoles?: MasterItem[];
  onSave: (data: Partial<Employee>) => void;
  onClose: () => void;
}

type TabType = 'pribadi' | 'akun' | 'profesi' | 'rkk' | 'jadwal' | 'pengalaman' | 'diklat' | 'gaji' | 'dokumen';

export default function EmployeeFormView({ initialData, availableRoles = [], onSave, onClose }: EmployeeFormViewProps) {
  const [wizardStep, setWizardStep] = useState<'category' | 'form'>(initialData ? 'form' : 'category');
  const [activeTab, setActiveTab] = useState<TabType>('pribadi');
  const [currentCategory, setCurrentCategory] = useState<'medis' | 'non-medis'>(initialData?.category || 'medis');
  const [isScanning, setIsScanning] = useState(false);
  const [scanType, setScanType] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState<Partial<Employee>>({
    name: '', nip: '', profession: '', jobTitle: '', category: 'medis', status: 'Active',
    email: '', phone: '', str: '', sip: '', pob: '', dob: '', gender: 'Laki-laki',
    religion: 'Islam', marital: 'Belum Kawin', ktpAddress: '', address: '',
    expertise: '', empStatus: 'Tetap', expYears: '0', npwp: '', emailPersonal: '',
    password: '', roles: [],
    education: [],
    experience: [],
    rkk: [],
    schedule: {
      'Senin': { active: true, slots: [{start: '08:00', end: '12:00'}] },
      'Selasa': { active: true, slots: [{start: '09:00', end: '17:00'}] },
      'Rabu': { active: true, slots: [{start: '09:00', end: '17:00'}] },
      'Kamis': { active: true, slots: [{start: '09:00', end: '17:00'}] },
      'Jumat': { active: true, slots: [{start: '09:00', end: '17:00'}] },
      'Sabtu': { active: false, slots: [] },
      'Minggu': { active: false, slots: [] },
    },
    training: [],
    mandatoryTraining: {},
    gajiPokok: '', tunjanganTetap: '', tunjanganTidakTetap: '', insentif: '',
    bonus: '', komisi: '', benefit: '', fasilitas: '',
    jasmedScheme: 'fee',
    jasmedItems: [{ action: 'Konsultasi Poli', qty: 50, rate: 30000 }],
    bank: '', noRek: '', atasNama: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        education: initialData.education || [],
        experience: initialData.experience || [],
        roles: initialData.roles || [],
        rkk: initialData.rkk || [],
        schedule: initialData.schedule || formData.schedule,
        training: initialData.training || [],
        jasmedItems: initialData.jasmedItems || formData.jasmedItems
      });
      setCurrentCategory(initialData.category);
    }
  }, [initialData]);

  const tabs: { id: TabType; label: string; medicalOnly?: boolean }[] = [
    { id: 'pribadi', label: '1. Data Pribadi' },
    { id: 'akun', label: '2. Akses Login' },
    { id: 'profesi', label: '3. Profesi & Legal' },
    { id: 'rkk', label: '4. Kewenangan Klinis', medicalOnly: true },
    { id: 'jadwal', label: '5. Jadwal Praktik', medicalOnly: true },
    { id: 'pengalaman', label: '6. Pendidikan & Kerja' },
    { id: 'diklat', label: '7. Diklat & SKP' },
    { id: 'gaji', label: '8. Gaji & Rekening' },
    { id: 'dokumen', label: '9. Berkas' },
  ];

  const filteredTabs = tabs.filter(t => !t.medicalOnly || currentCategory === 'medis');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const triggerOCR = (type: string) => {
    setIsScanning(true);
    setScanType(type);
    setTimeout(() => {
      setIsScanning(false);
      if (type === 'ktp') {
        setFormData(prev => ({
          ...prev,
          name: 'Dr. Handoko Sentosa, Sp.M',
          nik: '31710200330005',
          pob: 'Jakarta',
          dob: '1980-05-15',
          gender: 'Laki-laki'
        }));
      } else if (type === 'str') {
        setFormData(prev => ({ ...prev, str: '1234.STR.2023', strExp: '2028-12-31' }));
      } else if (type === 'sip') {
        setFormData(prev => ({ ...prev, sip: '503/001/SIP.D/2023', sipExp: '2028-12-31' }));
      } else if (type === 'ijazah') {
        setFormData(prev => ({
          ...prev,
          education: [...(prev.education || []), { level: 'Sp.M', univ: 'Universitas Indonesia', year: '2015' }]
        }));
      } else if (type === 'pengalaman') {
        setFormData(prev => ({
          ...prev,
          experience: [...(prev.experience || []), { role: 'Dokter Mata', instansi: 'RS Mata JEC', thn: '2016 - 2021' }]
        }));
      }
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, category: currentCategory });
  };

  const navigateTab = (dir: number) => {
    const currentIdx = filteredTabs.findIndex(t => t.id === activeTab);
    const nextIdx = currentIdx + dir;
    if (nextIdx >= 0 && nextIdx < filteredTabs.length) {
      setActiveTab(filteredTabs[nextIdx].id);
    }
  };

  if (wizardStep === 'category') {
    return (
      <div className="fixed inset-0 z-[70] flex flex-col bg-gray-50 overflow-hidden animate-fade-in">
        <div className="px-8 py-5 border-b border-gray-200 flex justify-between items-center bg-white shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h3 className="text-xl font-display font-bold text-satu-dark">Tambah Pegawai Baru</h3>
          </div>
        </div>
        <div className="flex-1 p-8 flex flex-col justify-center items-center">
          <div className="text-center mb-10">
            <h4 className="text-2xl font-bold text-gray-800 mb-2 font-display">Pilih Kategori Pegawai</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
            <div 
              onClick={() => { setCurrentCategory('medis'); setWizardStep('form'); }}
              className="group border-2 border-gray-200 rounded-3xl p-10 cursor-pointer bg-white hover:border-satu-primary hover:shadow-2xl transition-all text-center"
            >
              <div className="w-20 h-20 rounded-full bg-blue-50 text-satu-primary flex items-center justify-center mb-6 mx-auto group-hover:bg-satu-primary group-hover:text-white transition-colors">
                <Stethoscope className="w-10 h-10" />
              </div>
              <h5 className="text-xl font-bold group-hover:text-satu-primary">Tenaga Medis</h5>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">Dokter, Perawat, & Refraksionis. Wajib legalitas STR/SIP & Jadwal Praktik.</p>
            </div>
            <div 
              onClick={() => { setCurrentCategory('non-medis'); setWizardStep('form'); }}
              className="group border-2 border-gray-200 rounded-3xl p-10 cursor-pointer bg-white hover:border-gray-600 hover:shadow-2xl transition-all text-center"
            >
              <div className="w-20 h-20 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center mb-6 mx-auto group-hover:bg-gray-800 group-hover:text-white transition-colors">
                <Briefcase className="w-10 h-10" />
              </div>
              <h5 className="text-xl font-bold group-hover:text-gray-900">Non-Medis</h5>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">Admin, IT, HRD, & Umum. Tanpa legalitas medis.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[70] flex flex-col bg-white overflow-hidden animate-fade-in">
      {/* OCR Overlay */}
      <AnimatePresence>
        {isScanning && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-satu-dark/80 backdrop-blur-md z-[100] flex flex-col items-center justify-center text-white"
          >
            <div className="relative border-4 border-white/20 p-20 rounded-2xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-satu-gold shadow-[0_0_20px_#CFA766] animate-scan-move"></div>
              <ScanFace className="w-24 h-24 opacity-20" />
            </div>
            <h3 className="text-xl font-display font-bold mt-8 tracking-widest uppercase">Memindai {scanType.toUpperCase()}...</h3>
            <p className="text-white/60 text-sm mt-2">Mengekstrak data menggunakan AI SATUMATA</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="px-8 py-5 border-b border-gray-200 flex justify-between items-center bg-white shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => setWizardStep('category')} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h3 className="text-xl font-display font-bold text-satu-dark">
            {initialData ? 'Edit Data Pegawai' : 'Tambah Pegawai Baru'}
          </h3>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleSubmit}
            className="px-8 py-2.5 bg-satu-success text-white rounded-xl text-sm font-bold hover:bg-green-600 shadow-md transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Simpan Pegawai
          </button>
        </div>
      </div>

      <div className="bg-gray-50 border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => setWizardStep('category')} className="text-xs font-bold text-satu-primary flex items-center gap-1 hover:underline">
            <RefreshCcw className="w-3 h-3" /> Ganti Kategori
          </button>
          <span className="text-xs font-bold text-white bg-satu-primary px-3 py-1 rounded-full">
            {currentCategory === 'medis' ? 'Tenaga Medis' : 'Non-Medis'}
          </span>
        </div>
      </div>

      {/* Tab Header */}
      <div className="flex px-8 pt-2 overflow-x-auto custom-scroll border-b bg-white shrink-0">
        {filteredTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
              activeTab === tab.id ? 'border-satu-primary text-satu-primary font-bold bg-blue-50' : 'border-transparent text-gray-500 hover:text-satu-primary hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-8 custom-scroll bg-white">
        <form className="max-w-5xl mx-auto space-y-8">
          {activeTab === 'pribadi' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="border-2 border-indigo-100 bg-indigo-50/50 rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-white text-indigo-600 flex items-center justify-center shadow-sm">
                    <ScanFace className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-indigo-800">Input Data via e-KTP</h4>
                    <p className="text-sm text-indigo-600">Ekstrak data otomatis dari foto KTP.</p>
                  </div>
                </div>
                <button type="button" onClick={() => triggerOCR('ktp')} className="w-full bg-satu-primary text-white px-4 py-3 rounded-xl text-sm font-bold shadow-md hover:bg-satu-dark flex items-center justify-center gap-2 transition-colors">
                  <Upload className="w-4 h-4" /> Upload e-KTP
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Nama Lengkap & Gelar</label>
                  <input type="text" name="name" value={formData.name || ''} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-satu-primary/20 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">NIK (Sesuai KTP)</label>
                  <input type="text" name="nik" value={formData.nik || ''} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-xl outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">No. WhatsApp / Telepon</label>
                  <input type="text" name="phone" value={formData.phone || ''} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-xl outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email Pribadi</label>
                  <input type="email" name="emailPersonal" value={formData.emailPersonal || ''} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-xl outline-none" placeholder="email@pribadi.com" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Tempat Lahir</label>
                  <input type="text" name="pob" value={formData.pob || ''} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-xl outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Tanggal Lahir</label>
                  <input type="date" name="dob" value={formData.dob || ''} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-xl outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Jenis Kelamin</label>
                  <select name="gender" value={formData.gender || 'Laki-laki'} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-xl bg-white outline-none">
                    <option>Laki-laki</option><option>Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Agama</label>
                  <select name="religion" value={formData.religion || ''} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-xl bg-white outline-none">
                    <option value="">Pilih Agama</option>
                    <option>Islam</option><option>Kristen Protestan</option><option>Katolik</option><option>Hindu</option><option>Buddha</option><option>Khonghucu</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Status Perkawinan</label>
                  <select name="marital" value={formData.marital || 'Belum Kawin'} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-xl bg-white outline-none">
                    <option>Belum Kawin</option><option>Kawin</option><option>Cerai Hidup</option><option>Cerai Mati</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Alamat Lengkap Sesuai KTP</label>
                  <textarea name="ktpAddress" value={formData.ktpAddress || ''} onChange={handleInputChange} rows={2} className="w-full px-4 py-3 border rounded-xl outline-none resize-none" placeholder="Jalan, RT/RW, Kelurahan, Kecamatan..."></textarea>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Domisili Saat Ini</label>
                  <textarea name="address" value={formData.address || ''} onChange={handleInputChange} rows={2} className="w-full px-4 py-3 border rounded-xl outline-none resize-none" placeholder="Jika berbeda dengan KTP"></textarea>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'akun' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                <label className="block text-sm font-bold text-satu-dark mb-3">Hak Akses Sistem (Multi-Role)</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {availableRoles.map(role => (
                    <label key={role.id} className="flex items-center gap-2 p-3 bg-white border rounded-xl cursor-pointer hover:bg-blue-50 transition-colors">
                      <input 
                        type="checkbox" 
                        checked={formData.roles?.includes(role.name) || false}
                        onChange={(e) => {
                          const roles = [...(formData.roles || [])];
                          if (e.target.checked) roles.push(role.name);
                          else roles.splice(roles.indexOf(role.name), 1);
                          setFormData({ ...formData, roles });
                        }}
                        className="w-4 h-4 rounded text-satu-primary focus:ring-satu-primary"
                      />
                      <span className="text-xs font-bold text-gray-700">{role.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email (Username)</label>
                  <input type="email" name="email" value={formData.email || ''} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-xl outline-none" placeholder="pegawai@instansi.com" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Password Awal</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      name="password" 
                      value={formData.password || ''} 
                      onChange={handleInputChange} 
                      className="w-full px-4 py-3 border rounded-xl outline-none pr-10" 
                      placeholder="●●●●●●●●" 
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profesi' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Profesi Utama</label>
                  <select name="profession" value={formData.profession || ''} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-xl bg-white outline-none">
                    {currentCategory === 'medis' ? (
                      <>
                        <option value="">Pilih Profesi</option>
                        <option>Dokter Spesialis</option><option>Dokter Umum</option><option>Refraksionis Optisien</option><option>Perawat</option><option>Teknisi Elektromedis</option>
                      </>
                    ) : (
                      <>
                        <option value="">Pilih Profesi</option>
                        <option>Staf Admin</option><option>IT Support</option><option>Keuangan</option><option>HRD</option>
                      </>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Jabatan</label>
                  <input type="text" name="jobTitle" value={formData.jobTitle || ''} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-xl outline-none" placeholder="Contoh: Kepala Unit" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Bidang Keahlian</label>
                  <input type="text" name="expertise" value={formData.expertise || ''} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-xl outline-none" placeholder="Contoh: Katarak & Bedah Refraktif" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">NIP / Nomor Internal</label>
                  <input type="text" name="nip" value={formData.nip || ''} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-xl outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Status Kepegawaian</label>
                  <select name="empStatus" value={formData.empStatus || 'Tetap'} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-xl bg-white outline-none">
                    <option>Tetap</option><option>Kontrak</option><option>Paruh Waktu</option><option>Magang</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Lama Pengalaman Kerja (Tahun)</label>
                  <input type="number" name="expYears" value={formData.expYears || ''} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-xl outline-none" placeholder="0" />
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="font-display font-bold text-lg text-gray-800 border-b pb-2">Data Legalitas & Administrasi</h4>
                <div className="p-6 border-2 border-gray-200 rounded-2xl bg-gray-50/50">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 text-gray-600" />
                    <h4 className="text-sm font-bold text-gray-800 uppercase">Data NPWP</h4>
                  </div>
                  <input type="text" name="npwp" value={formData.npwp || ''} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-xl bg-white outline-none" placeholder="XX.XXX.XXX.X-XXX.XXX" />
                </div>

                {currentCategory === 'medis' && (
                  <div className="space-y-6">
                    <div className="p-6 border-2 border-blue-100 rounded-2xl bg-blue-50/30">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-bold text-blue-800 uppercase flex items-center gap-2"><FileCheck className="w-4 h-4" /> Data STR</h4>
                        <button type="button" onClick={() => triggerOCR('str')} className="text-xs bg-white text-blue-600 px-4 py-2 rounded-lg font-bold border hover:bg-blue-600 hover:text-white transition">Scan STR</button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" name="str" value={formData.str || ''} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-xl bg-white outline-none" placeholder="Nomor STR" />
                        <input type="date" name="strExp" value={formData.strExp || ''} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-xl bg-white outline-none" />
                      </div>
                    </div>
                    <div className="p-6 border-2 border-indigo-100 rounded-2xl bg-indigo-50/30">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-bold text-indigo-800 uppercase flex items-center gap-2"><FileSignature className="w-4 h-4" /> Data SIP</h4>
                        <button type="button" onClick={() => triggerOCR('sip')} className="text-xs bg-white text-indigo-600 px-4 py-2 rounded-lg font-bold border hover:bg-indigo-600 hover:text-white transition">Scan SIP</button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" name="sip" value={formData.sip || ''} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-xl bg-white outline-none" placeholder="Nomor SIP" />
                        <input type="date" name="sipExp" value={formData.sipExp || ''} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-xl bg-white outline-none" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'rkk' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
                <div>
                  <h4 className="font-display font-bold text-lg text-gray-800">Rincian Kewenangan Klinis (RKK)</h4>
                  <p className="text-sm text-gray-500 mt-1">Daftar kompetensi dan tindakan medis yang diizinkan.</p>
                </div>
                <button 
                  type="button" 
                  onClick={() => setFormData(prev => ({ ...prev, rkk: [...(prev.rkk || []), { action: '', category: 'Rawat Jalan', status: 'Mandiri Penuh' }] }))}
                  className="text-xs bg-satu-primary text-white px-3 py-1.5 rounded-lg font-bold hover:bg-satu-dark transition"
                >
                  + Tambah Tindakan
                </button>
              </div>
              <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full text-sm text-left text-gray-600">
                  <thead className="bg-gray-100 text-xs text-gray-500 uppercase font-bold border-b">
                    <tr>
                      <th className="px-4 py-3">Tindakan Medis</th>
                      <th className="px-4 py-3">Kategori</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {formData.rkk?.map((item, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-2">
                          <input 
                            type="text" value={item.action || ''} 
                            onChange={(e) => {
                              const newRkk = [...(formData.rkk || [])];
                              newRkk[idx].action = e.target.value;
                              setFormData({ ...formData, rkk: newRkk });
                            }}
                            className="w-full border-none focus:ring-0 text-sm font-bold bg-transparent" placeholder="Nama Tindakan" 
                          />
                        </td>
                        <td className="px-4 py-2">
                          <select 
                            value={item.category || 'Rawat Jalan'}
                            onChange={(e) => {
                              const newRkk = [...(formData.rkk || [])];
                              newRkk[idx].category = e.target.value;
                              setFormData({ ...formData, rkk: newRkk });
                            }}
                            className="border-none bg-transparent text-sm outline-none"
                          >
                            <option>Bedah Katarak</option><option>Bedah Retina</option><option>Rawat Jalan</option><option>Diagnostik</option>
                          </select>
                        </td>
                        <td className="px-4 py-2">
                          <select 
                            value={item.status || 'Mandiri Penuh'}
                            onChange={(e) => {
                              const newRkk = [...(formData.rkk || [])];
                              newRkk[idx].status = e.target.value;
                              setFormData({ ...formData, rkk: newRkk });
                            }}
                            className="border-none bg-transparent text-xs font-bold text-gray-600 outline-none"
                          >
                            <option>Mandiri Penuh</option><option>Supervisi</option><option>Tidak Diizinkan</option>
                          </select>
                        </td>
                        <td className="px-4 py-2 text-center">
                          <button type="button" onClick={() => {
                            const newRkk = [...(formData.rkk || [])];
                            newRkk.splice(idx, 1);
                            setFormData({ ...formData, rkk: newRkk });
                          }} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'jadwal' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
                <div>
                  <h4 className="font-display font-bold text-lg text-gray-800">Manajemen Jadwal Praktik</h4>
                  <p className="text-sm text-gray-500 mt-1">Atur sesi konsultasi dan biaya jasa medis dokter.</p>
                </div>
              </div>
              <div className="space-y-4">
                {Object.entries(formData.schedule || {}).map(([day, data]: [string, any]) => (
                  <div key={day} className={`p-4 rounded-xl border transition-all ${data.active ? 'bg-blue-50/50 border-blue-100 shadow-sm' : 'bg-gray-50 border-gray-100 opacity-60'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input 
                          type="checkbox" checked={data.active} 
                          onChange={(e) => {
                            const newSched = { ...formData.schedule };
                            newSched[day].active = e.target.checked;
                            if (e.target.checked && newSched[day].slots.length === 0) newSched[day].slots.push({ start: '09:00', end: '12:00' });
                            setFormData({ ...formData, schedule: newSched });
                          }}
                          className="w-5 h-5 text-satu-primary rounded focus:ring-satu-primary" 
                        />
                        <span className={`font-bold text-gray-800 ${data.active ? 'text-satu-primary' : ''}`}>{day}</span>
                      </label>
                      <button 
                        type="button" disabled={!data.active}
                        onClick={() => {
                          const newSched = { ...formData.schedule };
                          newSched[day].slots.push({ start: '09:00', end: '12:00' });
                          setFormData({ ...formData, schedule: newSched });
                        }}
                        className={`text-xs flex items-center gap-1 font-bold ${data.active ? 'text-satu-primary hover:text-satu-dark' : 'text-gray-400 cursor-not-allowed'}`}
                      >
                        <PlusCircle className="w-4 h-4" /> Tambah Sesi
                      </button>
                    </div>
                    <div className="space-y-2 pl-8">
                      {data.slots.map((slot: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input 
                            type="time" value={slot.start || ''} disabled={!data.active}
                            onChange={(e) => {
                              const newSched = { ...formData.schedule };
                              newSched[day].slots[idx].start = e.target.value;
                              setFormData({ ...formData, schedule: newSched });
                            }}
                            className="w-24 px-2 py-1.5 border rounded-lg text-sm bg-white outline-none" 
                          />
                          <span className="text-gray-400 text-xs">s/d</span>
                          <input 
                            type="time" value={slot.end || ''} disabled={!data.active}
                            onChange={(e) => {
                              const newSched = { ...formData.schedule };
                              newSched[day].slots[idx].end = e.target.value;
                              setFormData({ ...formData, schedule: newSched });
                            }}
                            className="w-24 px-2 py-1.5 border rounded-lg text-sm bg-white outline-none" 
                          />
                          <button type="button" disabled={!data.active} onClick={() => {
                            const newSched = { ...formData.schedule };
                            newSched[day].slots.splice(idx, 1);
                            setFormData({ ...formData, schedule: newSched });
                          }} className="p-1.5 text-gray-400 hover:text-red-500 rounded-md hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'pengalaman' && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <h4 className="font-display font-bold text-lg text-gray-800">Riwayat Pendidikan</h4>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => triggerOCR('ijazah')} className="text-xs bg-green-50 text-green-700 px-3 py-1.5 rounded-lg border border-green-200 font-bold hover:bg-green-100 transition">Scan Ijazah</button>
                    <button type="button" onClick={() => setFormData(prev => ({ ...prev, education: [...(prev.education || []), { level: '', univ: '', year: '' }] }))} className="text-xs bg-satu-primary text-white px-3 py-1.5 rounded-lg font-bold hover:bg-satu-dark transition">+ Tambah</button>
                  </div>
                </div>
                <div className="space-y-3">
                  {formData.education?.map((edu, idx) => (
                    <div key={idx} className="flex gap-2 p-4 bg-gray-50 border rounded-2xl">
                      <div className="flex-1 grid grid-cols-3 gap-4">
                        <input type="text" placeholder="Jenjang" value={edu.level || ''} onChange={(e) => {
                          const newEdu = [...(formData.education || [])];
                          newEdu[idx].level = e.target.value;
                          setFormData({ ...formData, education: newEdu });
                        }} className="px-3 py-2 border rounded-xl bg-white text-sm outline-none" />
                        <input type="text" placeholder="Institusi" value={edu.univ || ''} onChange={(e) => {
                          const newEdu = [...(formData.education || [])];
                          newEdu[idx].univ = e.target.value;
                          setFormData({ ...formData, education: newEdu });
                        }} className="px-3 py-2 border rounded-xl bg-white text-sm outline-none" />
                        <input type="text" placeholder="Tahun" value={edu.year || ''} onChange={(e) => {
                          const newEdu = [...(formData.education || [])];
                          newEdu[idx].year = e.target.value;
                          setFormData({ ...formData, education: newEdu });
                        }} className="px-3 py-2 border rounded-xl bg-white text-sm outline-none" />
                      </div>
                      <button type="button" onClick={() => {
                        const newEdu = [...(formData.education || [])];
                        newEdu.splice(idx, 1);
                        setFormData({ ...formData, education: newEdu });
                      }} className="text-red-400 hover:text-red-600"><Trash2 className="w-5 h-5" /></button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <h4 className="font-display font-bold text-lg text-gray-800">Pengalaman Kerja</h4>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => triggerOCR('pengalaman')} className="text-xs bg-orange-50 text-orange-700 px-3 py-1.5 rounded-lg border border-orange-200 font-bold hover:bg-orange-100 transition">Scan Paklaring</button>
                    <button type="button" onClick={() => setFormData(prev => ({ ...prev, experience: [...(prev.experience || []), { role: '', instansi: '', thn: '' }] }))} className="text-xs bg-satu-primary text-white px-3 py-1.5 rounded-lg font-bold hover:bg-satu-dark transition">+ Tambah</button>
                  </div>
                </div>
                <div className="space-y-3">
                  {formData.experience?.map((exp, idx) => (
                    <div key={idx} className="flex gap-2 p-4 bg-gray-50 border rounded-2xl">
                      <div className="flex-1 grid grid-cols-3 gap-4">
                        <input type="text" placeholder="Jabatan" value={exp.role || ''} onChange={(e) => {
                          const newExp = [...(formData.experience || [])];
                          newExp[idx].role = e.target.value;
                          setFormData({ ...formData, experience: newExp });
                        }} className="px-3 py-2 border rounded-xl bg-white text-sm outline-none" />
                        <input type="text" placeholder="Instansi" value={exp.instansi || ''} onChange={(e) => {
                          const newExp = [...(formData.experience || [])];
                          newExp[idx].instansi = e.target.value;
                          setFormData({ ...formData, experience: newExp });
                        }} className="px-3 py-2 border rounded-xl bg-white text-sm outline-none" />
                        <input type="text" placeholder="Periode" value={exp.thn || ''} onChange={(e) => {
                          const newExp = [...(formData.experience || [])];
                          newExp[idx].thn = e.target.value;
                          setFormData({ ...formData, experience: newExp });
                        }} className="px-3 py-2 border rounded-xl bg-white text-sm outline-none" />
                      </div>
                      <button type="button" onClick={() => {
                        const newExp = [...(formData.experience || [])];
                        newExp.splice(idx, 1);
                        setFormData({ ...formData, experience: newExp });
                      }} className="text-red-400 hover:text-red-600"><Trash2 className="w-5 h-5" /></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'diklat' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <div className="bg-gradient-to-r from-satu-dark to-satu-primary rounded-2xl p-6 text-white shadow-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-lg">Capaian SKP (Satuan Kredit Profesi)</h4>
                    <p className="text-xs text-white/70 mt-1">Periode STR: 2023 - 2028</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-display font-bold">15 <span className="text-sm font-normal text-white/60">/ 50 SKP</span></div>
                    <div className="text-xs bg-white/20 px-2 py-1 rounded mt-1 inline-block">Butuh 35 Poin lagi</div>
                  </div>
                </div>
                <div className="w-full bg-black/20 h-2 rounded-full mt-4 overflow-hidden">
                  <div className="bg-satu-gold h-full rounded-full" style={{ width: '30%' }}></div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-display font-bold text-lg text-gray-800 border-b pb-2">Pelatihan Wajib (Mandatory)</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['Bantuan Hidup Dasar (BHD)', 'PPI (Infeksi)', 'K3 Rumah Sakit'].map(t => (
                    <div key={t} className="p-4 border rounded-xl bg-gray-50">
                      <label className="flex items-center gap-2 mb-2 font-bold text-gray-700">
                        <input 
                          type="checkbox" 
                          checked={!!formData.mandatoryTraining?.[t]}
                          onChange={(e) => {
                            const newMandatory = { ...(formData.mandatoryTraining || {}) };
                            if (e.target.checked) {
                              newMandatory[t] = new Date().toISOString().split('T')[0]; // Default to today
                            } else {
                              delete newMandatory[t];
                            }
                            setFormData({ ...formData, mandatoryTraining: newMandatory });
                          }}
                          className="rounded text-satu-primary focus:ring-satu-primary" 
                        /> {t}
                      </label>
                      <input 
                        type="date" 
                        value={formData.mandatoryTraining?.[t] || ''}
                        disabled={!formData.mandatoryTraining?.[t]}
                        onChange={(e) => {
                          const newMandatory = { ...(formData.mandatoryTraining || {}) };
                          newMandatory[t] = e.target.value;
                          setFormData({ ...formData, mandatoryTraining: newMandatory });
                        }}
                        className="w-full text-xs p-2 border rounded bg-white outline-none disabled:opacity-50" 
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <h4 className="font-display font-bold text-lg text-gray-800">Riwayat Pelatihan Eksternal</h4>
                  <button 
                    type="button" 
                    onClick={() => setFormData(prev => ({ ...prev, training: [...(prev.training || []), { name: '', date: '', skp: '' }] }))}
                    className="text-xs bg-satu-primary text-white px-3 py-1.5 rounded-lg font-bold hover:bg-satu-dark transition"
                  >
                    + Input Pelatihan
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.training?.map((t, idx) => (
                    <div key={idx} className="flex gap-3 p-3 bg-white border rounded-xl items-center">
                      <div className="flex-1 grid grid-cols-3 gap-2">
                        <input type="text" placeholder="Nama Pelatihan" value={t.name || ''} onChange={(e) => {
                          const newT = [...(formData.training || [])];
                          newT[idx].name = e.target.value;
                          setFormData({ ...formData, training: newT });
                        }} className="text-sm border rounded px-2 py-1 outline-none" />
                        <input type="date" value={t.date || ''} onChange={(e) => {
                          const newT = [...(formData.training || [])];
                          newT[idx].date = e.target.value;
                          setFormData({ ...formData, training: newT });
                        }} className="text-sm border rounded px-2 py-1 outline-none" />
                        <input type="number" placeholder="SKP" value={t.skp || ''} onChange={(e) => {
                          const newT = [...(formData.training || [])];
                          newT[idx].skp = e.target.value;
                          setFormData({ ...formData, training: newT });
                        }} className="text-sm border rounded px-2 py-1 outline-none" />
                      </div>
                      <button type="button" onClick={() => {
                        const newT = [...(formData.training || [])];
                        newT.splice(idx, 1);
                        setFormData({ ...formData, training: newT });
                      }} className="text-red-400"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'gaji' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                <h4 className="font-bold text-emerald-900 mb-4 flex items-center gap-2"><Wallet className="w-5 h-5" /> Informasi Remunerasi</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Gaji Pokok</label>
                    <div className="flex items-center">
                      <span className="bg-white border border-r-0 rounded-l-xl px-4 py-3 text-gray-500 text-sm font-bold">Rp</span>
                      <input type="text" name="gajiPokok" value={formData.gajiPokok || ''} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-r-xl outline-none font-bold text-gray-800" placeholder="0" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Tunjangan Tetap</label>
                    <div className="flex items-center">
                      <span className="bg-white border border-r-0 rounded-l-xl px-4 py-3 text-gray-500 text-sm font-bold">Rp</span>
                      <input type="text" name="tunjanganTetap" value={formData.tunjanganTetap || ''} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-r-xl outline-none font-bold text-gray-800" placeholder="0" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Tunjangan Tidak Tetap</label>
                    <div className="flex items-center">
                      <span className="bg-white border border-r-0 rounded-l-xl px-4 py-3 text-gray-500 text-sm font-bold">Rp</span>
                      <input type="text" name="tunjanganTidakTetap" value={formData.tunjanganTidakTetap || ''} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-r-xl outline-none font-bold text-gray-800" placeholder="Makan, Transport, dll" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Insentif Kinerja</label>
                    <div className="flex items-center">
                      <span className="bg-white border border-r-0 rounded-l-xl px-4 py-3 text-gray-500 text-sm font-bold">Rp</span>
                      <input type="text" name="insentif" value={formData.insentif || ''} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-r-xl outline-none font-bold text-gray-800" placeholder="KPI Based" />
                    </div>
                  </div>
                </div>

                <div className="mt-8 border-t border-emerald-200 pt-6">
                  <h4 className="font-bold text-emerald-900 mb-4 flex items-center gap-2"><Calculator className="w-5 h-5" /> Kalkulator Jasa Medis (Jasmed)</h4>
                  <div className="flex gap-4 mb-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="jasmedScheme" value="fee" checked={formData.jasmedScheme === 'fee'} onChange={() => setFormData({ ...formData, jasmedScheme: 'fee' })} className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm font-bold text-gray-700">Fee for Service</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="jasmedScheme" value="point" checked={formData.jasmedScheme === 'point'} onChange={() => setFormData({ ...formData, jasmedScheme: 'point' })} className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm font-bold text-gray-700">Sistem Poin</span>
                    </label>
                  </div>

                  {formData.jasmedScheme === 'fee' ? (
                    <div className="bg-white p-4 rounded-xl border border-emerald-200">
                      <div className="space-y-3">
                        <div className="grid grid-cols-12 gap-2 items-center text-xs font-bold text-gray-500 uppercase mb-2">
                          <div className="col-span-5">Tindakan</div>
                          <div className="col-span-2">Jumlah</div>
                          <div className="col-span-3">Rate (Rp)</div>
                          <div className="col-span-2 text-right">Total</div>
                        </div>
                        {formData.jasmedItems?.map((item, idx) => (
                          <div key={idx} className="grid grid-cols-12 gap-2 items-center mb-2">
                            <div className="col-span-5"><input type="text" value={item.action || ''} onChange={(e) => {
                              const newItems = [...(formData.jasmedItems || [])];
                              newItems[idx].action = e.target.value;
                              setFormData({ ...formData, jasmedItems: newItems });
                            }} className="w-full border rounded px-2 py-1 text-sm outline-none" /></div>
                            <div className="col-span-2"><input type="number" value={item.qty || 0} onChange={(e) => {
                              const newItems = [...(formData.jasmedItems || [])];
                              newItems[idx].qty = parseInt(e.target.value);
                              setFormData({ ...formData, jasmedItems: newItems });
                            }} className="w-full border rounded px-2 py-1 text-sm text-center outline-none" /></div>
                            <div className="col-span-3"><input type="number" value={item.rate || 0} onChange={(e) => {
                              const newItems = [...(formData.jasmedItems || [])];
                              newItems[idx].rate = parseInt(e.target.value);
                              setFormData({ ...formData, jasmedItems: newItems });
                            }} className="w-full border rounded px-2 py-1 text-sm text-right outline-none" /></div>
                            <div className="col-span-2 text-right font-bold text-gray-800">{(item.qty * item.rate).toLocaleString()}</div>
                          </div>
                        ))}
                      </div>
                      <button type="button" onClick={() => setFormData(prev => ({ ...prev, jasmedItems: [...(prev.jasmedItems || []), { action: '', qty: 0, rate: 0 }] }))} className="mt-3 text-xs text-emerald-600 font-bold hover:underline">+ Tambah Item</button>
                    </div>
                  ) : (
                    <div className="bg-white p-4 rounded-xl border border-emerald-200">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1">Total Poin Kinerja</label>
                          <input type="text" name="jasmedPoin" value={formData.jasmedPoin || ''} onChange={handleInputChange} className="w-full border rounded px-3 py-2 font-bold text-gray-800 outline-none" placeholder="Contoh: 150.5" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1">Nilai Rupiah per Poin</label>
                          <input type="text" name="jasmedRatePoin" value={formData.jasmedRatePoin || ''} onChange={handleInputChange} className="w-full border rounded px-3 py-2 font-bold text-gray-800 outline-none" placeholder="Contoh: 10.000" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-6 border rounded-2xl bg-white">
                <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><CreditCard className="w-5 h-5" /> Rekening Bank (Payroll)</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Nama Bank</label>
                    <select name="bank" value={formData.bank || ''} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-xl bg-white outline-none">
                      <option value="">Pilih Bank</option><option>BCA</option><option>Mandiri</option><option>BNI</option><option>BRI</option><option>BSI</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Nomor Rekening</label>
                    <input type="text" name="noRek" value={formData.noRek || ''} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-xl outline-none" placeholder="Contoh: 1234567890" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Atas Nama</label>
                    <input type="text" name="atasNama" value={formData.atasNama || ''} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-xl outline-none" placeholder="Sesuai Buku Tabungan" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'dokumen' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <h4 className="font-display font-bold text-lg text-gray-800 border-b pb-2">Dokumen Digital</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {['Scan KTP', 'NPWP', 'Ijazah', 'STR', 'SIP', 'Sertifikat Pelatihan'].map(doc => (
                  <div key={doc} className="p-4 border rounded-2xl bg-gray-50 flex flex-col items-center justify-center gap-2 border-dashed h-40 group hover:bg-white hover:border-satu-primary transition-all cursor-pointer">
                    <FileText className="w-8 h-8 text-gray-300 group-hover:text-satu-primary" />
                    <span className="text-xs font-bold text-gray-500">{doc}</span>
                    <button type="button" className="text-[10px] bg-white border px-3 py-1 rounded-lg font-bold shadow-sm">Upload</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Footer Nav */}
      <div className="px-8 py-5 bg-white border-t border-gray-100 shrink-0 flex justify-between">
        <button 
          onClick={() => navigateTab(-1)} 
          className={`px-6 py-3 bg-gray-100 text-gray-600 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${filteredTabs.findIndex(t => t.id === activeTab) === 0 ? 'opacity-0 pointer-events-none' : ''}`}
        >
          <ChevronLeft className="w-4 h-4" /> Sebelumnya
        </button>
        <div className="flex gap-3">
          {filteredTabs.findIndex(t => t.id === activeTab) < filteredTabs.length - 1 ? (
            <button 
              onClick={() => navigateTab(1)} 
              className="px-8 py-3 bg-satu-primary text-white rounded-xl text-sm font-bold shadow-lg flex items-center gap-2 hover:bg-satu-dark transition-all"
            >
              Lanjut <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button 
              onClick={handleSubmit}
              className="px-8 py-3 bg-satu-success text-white rounded-xl text-sm font-bold shadow-lg flex items-center gap-2 hover:bg-green-600 transition-all"
            >
              <Save className="w-4 h-4" /> Simpan Pegawai
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
