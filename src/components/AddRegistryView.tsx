import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Activity, Save, Check, Microscope, Pill, Stethoscope, Camera, Trash2, AlertTriangle, ChevronDown, Plus, Eye, Aperture, Droplet, ScanEye, ShieldAlert, History, Table, FileText } from 'lucide-react';
import { FormMode, RegistryEntry } from '../types';
import { cn } from '../lib/utils';

interface AddRegistryViewProps {
  type: string;
  mode: FormMode;
  initialData?: RegistryEntry | null;
  onBack: () => void;
  onSave: (data: any) => void;
}

export default function AddRegistryView({ type, mode, initialData, onBack, onSave }: AddRegistryViewProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Info
    nrm: '',
    tanggalPeriksa: new Date().toISOString().split('T')[0],
    tanggalKunjunganPertama: '',
    dob: '',
    gender: '',
    job: '',
    unit: '',
    unitLain: '',
    diagnosis: '',
    keluhanUtama: '',
    suku: '',
    
    // Step 1: Factors & History
    faktorOkular: 'Tidak Ada',
    faktorOkularLain: '',
    faktorSistemik: 'Tidak Ada',
    komorbidLain: '',
    faktorPekerjaan: 'Tidak Ada',
    onsetDays: '',
    lateralitas: '',
    obatSendiri: 'Tidak Ada',
    obatSendiriLain: '',
    rwAntibiotik: false,
    rwAntibiotikNote: '',
    rwSteroid: false,
    rwSteroidNote: '',
    rwAnalgetik: false,
    rwAnalgetikNote: '',
    rwLain: false,
    rwLainNote: '',

    // Step 2: Physical Exam
    odUcva: '',
    odUcvaDec: '',
    odBcva: '',
    odBcvaDec: '',
    odTio: '',
    odInjeksi: '',
    odFluorescein: '',
    
    osUcva: '',
    osUcvaDec: '',
    osBcva: '',
    osBcvaDec: '',
    osTio: '',
    osInjeksi: '',
    osFluorescein: '',

    // Ulkus Characteristics
    ulkusPanjang: '',
    ulkusLebar: '',
    ulkusDerajat: 'Kecil (< 2mm)',
    ulkusKedalaman: '< 1/3 (Superfisial)',
    ulkusSeverity: 'Ringan',
    ulkusLokasi: '',
    acReaction: 'Tenang (0)',
    purulensi: 'Tidak Ada',
    hipopion: 'Tidak Ada',
    hipopionMm: '',

    // Step 3: Microbiology
    etiologi: '',
    gram: 'Tidak Dilakukan',
    gramNote: '',
    koh: 'Tidak Dilakukan',
    kohNote: '',
    kultur: 'Tidak Ditemukan Mikroorganisme',
    sensitivitas: {} as Record<string, string>,
    penunjang: [] as string[],
    penunjangLain: '',
    
    // Step 4: Therapy
    abTopikal: 'Tidak Diberikan',
    abTopikalNote: '',
    antijamur: '',
    antiviral: '',
    antiparasit: '',
    adjuvan: '',
    nsaid: '',
    steroid: '',
    terapiLain: '',
    tindakanOperatif: 'Tidak Ada',
    
    notes: ''
  });

  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    if (initialData) {
      if (initialData.details) {
        setFormData(prev => ({
          ...prev,
          ...initialData.details
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          diagnosis: initialData.diag,
        }));
      }
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'view') return;
    onSave(formData);
  };

  const registryType = type === 'all' ? 'Umum' : type;
  const isReadOnly = mode === 'view';
  const isUlkus = registryType === 'Ulkus';

  const typeColors = {
    'Uveitis': { text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', btn: 'bg-emerald-600 hover:bg-emerald-700', shadow: 'shadow-emerald-200' },
    'Fundus': { text: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', btn: 'bg-blue-600 hover:bg-blue-700', shadow: 'shadow-blue-200' },
    'Retina': { text: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', btn: 'bg-blue-600 hover:bg-blue-700', shadow: 'shadow-blue-200' },
    'Ulkus': { text: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', btn: 'bg-amber-600 hover:bg-amber-700', shadow: 'shadow-amber-200' },
    'Umum': { text: 'text-brand-600', bg: 'bg-brand-50', border: 'border-brand-100', btn: 'bg-brand-600 hover:bg-brand-700', shadow: 'shadow-brand-200' }
  };

  const colors = (typeColors as any)[registryType] || typeColors['Umum'];

  const title = mode === 'create' ? 'Input Data Registry' : mode === 'edit' ? 'Edit Data Registry' : 'Detail Data Registry';
  const subtitle = mode === 'view' ? 'Lihat rincian data' : 'Isi data pasien dan klinis';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray: File[] = Array.from(e.target.files);
      const newPreviews = filesArray.map((file: File) => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removePreview = (index: number) => {
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const convertSnellen = (val: string) => {
    const parts = val.split('/');
    if (parts.length === 2) {
      const num = parseFloat(parts[0]);
      const den = parseFloat(parts[1]);
      if (!isNaN(num) && !isNaN(den) && den !== 0) {
        return (num / den).toFixed(2);
      }
    }
    return '';
  };

  const renderUlkusStepper = () => (
    <div className={cn("px-8 py-6 border-b border-slate-200 mb-8 rounded-xl", colors.bg)}>
      <div className="flex items-center justify-between max-w-4xl mx-auto relative">
        <div className="absolute top-5 left-0 w-full h-1 bg-slate-200 -z-0 rounded-full"></div>
        <div 
          className={cn("absolute top-5 left-0 h-1 transition-all duration-300 -z-0 rounded-full", colors.btn.split(' ')[0])} 
          style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
        ></div>
        
        {[
          { step: 1, label: 'Klinis', icon: <Activity className="w-4 h-4" /> },
          { step: 2, label: 'Fisik', icon: <ScanEye className="w-4 h-4" /> },
          { step: 3, label: 'Mikro', icon: <Microscope className="w-4 h-4" /> },
          { step: 4, label: 'Terapi', icon: <Pill className="w-4 h-4" /> },
        ].map((s) => (
          <div 
            key={s.step}
            className="flex flex-col items-center relative z-10 cursor-pointer group"
            onClick={() => setCurrentStep(s.step)}
          >
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all border-2",
              currentStep === s.step ? cn(colors.btn.split(' ')[0], "text-white border-transparent scale-110 shadow-lg") : 
              currentStep > s.step ? "bg-emerald-500 text-white border-emerald-500" : "bg-white text-slate-400 border-slate-200"
            )}>
              {currentStep > s.step ? <Check className="w-5 h-5" /> : s.icon}
            </div>
            <span className={cn(
              "text-[10px] font-bold mt-2 uppercase tracking-wider",
              currentStep === s.step ? colors.text : "text-slate-400"
            )}>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );

  if (isUlkus) {
    return (
      <div className="fade-in">
        <div className="mb-6 flex items-center gap-4">
          <button onClick={onBack} className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 font-display">{title}</h1>
            <p className="text-slate-500 mt-1">{subtitle} untuk <span className={cn("font-bold", colors.text)}>{registryType}</span></p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-card border border-slate-200 overflow-hidden">
          {renderUlkusStepper()}
          
          <form onSubmit={handleSubmit} className="p-8 pt-0">
            {/* STEP 1: KLINIS */}
            {currentStep === 1 && (
              <div className="animate-scale-in">
                <div className="flex justify-between items-center mb-6">
                  <h3 className={cn("text-lg font-bold text-slate-800 border-l-4 pl-3", colors.text.replace('text-', 'border-'))}>Identitas & Anamnesis</h3>
                  <div className={cn("text-xs px-3 py-1.5 rounded-lg border font-bold", colors.text, colors.bg, colors.border)}>
                    Tgl: {new Date().toLocaleDateString('id-ID')}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Tanggal Pemeriksaan <span className="text-red-500">*</span></label>
                    <input type="date" className="input-minimal" value={formData.tanggalPeriksa} onChange={e => setFormData({...formData, tanggalPeriksa: e.target.value})} disabled={isReadOnly} required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Tanggal Kunjungan Pertama</label>
                    <input type="date" className="input-minimal" value={formData.tanggalKunjunganPertama} onChange={e => setFormData({...formData, tanggalKunjunganPertama: e.target.value})} disabled={isReadOnly} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Unit / Poli <span className="text-red-500">*</span></label>
                    <select className="input-minimal" value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} disabled={isReadOnly} required>
                      <option value="">Pilih Unit...</option>
                      <option>Umum</option>
                      <option>Infeksi & Imunologi</option>
                      <option>Kornea</option>
                      <option>IGD</option>
                      <option>Rawat Inap</option>
                      <option>Lainnya</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Diagnosis Kerja <span className="text-red-500">*</span></label>
                    <input type="text" className="input-minimal" placeholder="Contoh: Ulkus Kornea Bakterial OD" value={formData.diagnosis} onChange={e => setFormData({...formData, diagnosis: e.target.value})} disabled={isReadOnly} required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Keluhan Utama <span className="text-red-500">*</span></label>
                    <textarea className="input-minimal" rows={3} placeholder="Jelaskan keluhan utama..." value={formData.keluhanUtama} onChange={e => setFormData({...formData, keluhanUtama: e.target.value})} disabled={isReadOnly} required></textarea>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Suku Bangsa</label>
                      <input type="text" className="input-minimal" placeholder="Contoh: Jawa, Sunda..." value={formData.suku} onChange={e => setFormData({...formData, suku: e.target.value})} disabled={isReadOnly} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Pekerjaan</label>
                      <input type="text" className="input-minimal" placeholder="Contoh: Petani, Buruh..." value={formData.job} onChange={e => setFormData({...formData, job: e.target.value})} disabled={isReadOnly} />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-8">
                  <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <ShieldAlert className={cn("w-5 h-5", colors.text)} /> Faktor Risiko & Onset
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Faktor Okular</label>
                      <select className="input-minimal" value={formData.faktorOkular} onChange={e => setFormData({...formData, faktorOkular: e.target.value})} disabled={isReadOnly}>
                        <option>Tidak Ada</option><option>Trauma Fisik</option><option>Trauma Kimia</option><option>Lensa Kontak</option><option>Riwayat Operasi</option><option>Lainnya</option>
                      </select>
                      {formData.faktorOkular === 'Lainnya' && (
                        <input type="text" className="input-minimal mt-2 text-xs" placeholder="Sebutkan..." value={formData.faktorOkularLain} onChange={e => setFormData({...formData, faktorOkularLain: e.target.value})} disabled={isReadOnly} />
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Faktor Sistemik</label>
                      <select className="input-minimal" value={formData.faktorSistemik} onChange={e => setFormData({...formData, faktorSistemik: e.target.value})} disabled={isReadOnly}>
                        <option>Tidak Ada</option><option>Diabetes Mellitus</option><option>Autoimun</option><option>HIV/AIDS</option><option>Defisiensi Vit A</option><option>Lainnya</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Komorbid Lain</label>
                      <input type="text" className="input-minimal" placeholder="Penyakit lainnya..." value={formData.komorbidLain} onChange={e => setFormData({...formData, komorbidLain: e.target.value})} disabled={isReadOnly} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Faktor Risiko Pekerjaan</label>
                      <select className="input-minimal" value={formData.faktorPekerjaan} onChange={e => setFormData({...formData, faktorPekerjaan: e.target.value})} disabled={isReadOnly}>
                        <option>Tidak Ada</option><option>Petani</option><option>Buruh Bangunan</option><option>Pekerja Pabrik</option><option>Lainnya</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Lama Onset (Hari)</label>
                      <input type="number" className="input-minimal" placeholder="0" value={formData.onsetDays} onChange={e => setFormData({...formData, onsetDays: e.target.value})} disabled={isReadOnly} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Lateralitas (Anamnesis)</label>
                      <div className="flex gap-3">
                        {['OD', 'OS'].map(lat => (
                          <button 
                            key={lat}
                            type="button"
                            onClick={() => !isReadOnly && setFormData({...formData, lateralitas: lat})}
                            className={cn(
                              "flex-1 py-2.5 rounded-xl font-bold text-sm border-2 transition-all",
                              formData.lateralitas === lat ? cn(colors.bg, colors.text, colors.text.replace('text-', 'border-')) : "bg-white border-slate-200 text-slate-400"
                            )}
                          >
                            {lat}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                  <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <History className={cn("w-5 h-5", colors.text)} /> Riwayat Pengobatan Sebelum Datang
                  </h4>
                  <div className="mb-6">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Pengobatan Sendiri / Tradisional</label>
                    <select className="input-minimal" value={formData.obatSendiri} onChange={e => setFormData({...formData, obatSendiri: e.target.value})} disabled={isReadOnly}>
                      <option>Tidak Ada</option><option>Tetes Mata Warung</option><option>Air Sirih</option><option>Madu</option><option>Lainnya</option>
                    </select>
                    {formData.obatSendiri === 'Lainnya' && (
                      <input type="text" className="input-minimal mt-2 text-xs" placeholder="Sebutkan..." value={formData.obatSendiriLain} onChange={e => setFormData({...formData, obatSendiriLain: e.target.value})} disabled={isReadOnly} />
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { id: 'rwAntibiotik', label: 'Antibiotik', note: 'rwAntibiotikNote' },
                      { id: 'rwSteroid', label: 'Steroid', note: 'rwSteroidNote' },
                      { id: 'rwAnalgetik', label: 'Analgetik', note: 'rwAnalgetikNote' },
                      { id: 'rwLain', label: 'Lainnya', note: 'rwLainNote' },
                    ].map(item => (
                      <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-200">
                        <label className="flex items-center gap-3 cursor-pointer mb-2">
                          <input 
                            type="checkbox" 
                            checked={(formData as any)[item.id]} 
                            onChange={e => !isReadOnly && setFormData({...formData, [item.id]: e.target.checked})}
                            className={cn("w-4 h-4 rounded", colors.text.replace('text-', 'accent-'))}
                            disabled={isReadOnly}
                          />
                          <span className="font-bold text-sm text-slate-700">{item.label}</span>
                        </label>
                        {(formData as any)[item.id] && (
                          <input 
                            type="text" 
                            className="input-minimal text-xs py-2" 
                            placeholder="Nama obat & frekuensi..." 
                            value={(formData as any)[item.note]}
                            onChange={e => setFormData({...formData, [item.note]: e.target.value})}
                            disabled={isReadOnly}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: FISIK */}
            {currentStep === 2 && (
              <div className="animate-scale-in">
                <h3 className={cn("text-lg font-bold text-slate-800 mb-6 border-l-4 pl-3", colors.text.replace('text-', 'border-'))}>Pemeriksaan Fisik</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  {/* OD */}
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                    <div className="text-center font-bold text-blue-700 mb-4 pb-2 border-b border-blue-100">OD (Kanan)</div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Visus (UCVA)</label>
                          <div className="flex gap-2">
                            <input type="text" className="input-minimal bg-white" placeholder="6/..." value={formData.odUcva} onChange={e => setFormData({...formData, odUcva: e.target.value, odUcvaDec: convertSnellen(e.target.value)})} disabled={isReadOnly} />
                            <input type="text" className="input-minimal bg-slate-100 w-16 text-center text-[10px]" placeholder="Dec" value={formData.odUcvaDec} readOnly />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Visus (BCVA)</label>
                          <div className="flex gap-2">
                            <input type="text" className="input-minimal bg-white" placeholder="6/..." value={formData.odBcva} onChange={e => setFormData({...formData, odBcva: e.target.value, odBcvaDec: convertSnellen(e.target.value)})} disabled={isReadOnly} />
                            <input type="text" className="input-minimal bg-slate-100 w-16 text-center text-[10px]" placeholder="Dec" value={formData.odBcvaDec} readOnly />
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">TIO (mmHg)</label>
                          <input type="number" className="input-minimal bg-white" placeholder="0" value={formData.odTio} onChange={e => setFormData({...formData, odTio: e.target.value})} disabled={isReadOnly} />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Injeksi</label>
                          <select className="input-minimal bg-white text-[10px]" value={formData.odInjeksi} onChange={e => setFormData({...formData, odInjeksi: e.target.value})} disabled={isReadOnly}>
                            <option value="">-</option><option>Positif</option><option>Negatif</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Fluorescein</label>
                          <select className="input-minimal bg-white text-[10px]" value={formData.odFluorescein} onChange={e => setFormData({...formData, odFluorescein: e.target.value})} disabled={isReadOnly}>
                            <option value="">-</option><option>Positif</option><option>Negatif</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* OS */}
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                    <div className="text-center font-bold text-emerald-700 mb-4 pb-2 border-b border-emerald-100">OS (Kiri)</div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Visus (UCVA)</label>
                          <div className="flex gap-2">
                            <input type="text" className="input-minimal bg-white" placeholder="6/..." value={formData.osUcva} onChange={e => setFormData({...formData, osUcva: e.target.value, osUcvaDec: convertSnellen(e.target.value)})} disabled={isReadOnly} />
                            <input type="text" className="input-minimal bg-slate-100 w-16 text-center text-[10px]" placeholder="Dec" value={formData.osUcvaDec} readOnly />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Visus (BCVA)</label>
                          <div className="flex gap-2">
                            <input type="text" className="input-minimal bg-white" placeholder="6/..." value={formData.osBcva} onChange={e => setFormData({...formData, osBcva: e.target.value, osBcvaDec: convertSnellen(e.target.value)})} disabled={isReadOnly} />
                            <input type="text" className="input-minimal bg-slate-100 w-16 text-center text-[10px]" placeholder="Dec" value={formData.osBcvaDec} readOnly />
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">TIO (mmHg)</label>
                          <input type="number" className="input-minimal bg-white" placeholder="0" value={formData.osTio} onChange={e => setFormData({...formData, osTio: e.target.value})} disabled={isReadOnly} />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Injeksi</label>
                          <select className="input-minimal bg-white text-[10px]" value={formData.osInjeksi} onChange={e => setFormData({...formData, osInjeksi: e.target.value})} disabled={isReadOnly}>
                            <option value="">-</option><option>Positif</option><option>Negatif</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Fluorescein</label>
                          <select className="input-minimal bg-white text-[10px]" value={formData.osFluorescein} onChange={e => setFormData({...formData, osFluorescein: e.target.value})} disabled={isReadOnly}>
                            <option value="">-</option><option>Positif</option><option>Negatif</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 mb-8 shadow-sm">
                  <h4 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <ScanEye className={cn("w-5 h-5", colors.text)} /> Karakteristik Ulkus Kornea
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-3">Dimensi Ukuran Defek (mm)</label>
                      <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <input type="number" step="0.1" className="input-minimal bg-white text-center font-bold" placeholder="P" value={formData.ulkusPanjang} onChange={e => setFormData({...formData, ulkusPanjang: e.target.value})} disabled={isReadOnly} />
                        <span className="text-slate-300 font-bold">×</span>
                        <input type="number" step="0.1" className="input-minimal bg-white text-center font-bold" placeholder="L" value={formData.ulkusLebar} onChange={e => setFormData({...formData, ulkusLebar: e.target.value})} disabled={isReadOnly} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-3">Lokasi</label>
                      <div className="grid grid-cols-3 gap-3">
                        {['Sentral', 'Parasentral', 'Perifer'].map(loc => (
                          <button 
                            key={loc}
                            type="button"
                            onClick={() => !isReadOnly && setFormData({...formData, ulkusLokasi: loc})}
                            className={cn(
                              "py-3 rounded-xl text-[10px] font-bold border-2 transition-all",
                              formData.ulkusLokasi === loc ? cn(colors.bg, colors.text, colors.text.replace('text-', 'border-'), "shadow-sm") : "bg-white border-slate-100 text-slate-400"
                            )}
                          >
                            {loc}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Derajat Ukuran</label>
                      <select className="input-minimal" value={formData.ulkusDerajat} onChange={e => setFormData({...formData, ulkusDerajat: e.target.value})} disabled={isReadOnly}>
                        <option>Kecil (&lt; 2mm)</option><option>Sedang (2-6mm)</option><option>Besar (&gt; 6mm)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Kedalaman</label>
                      <select className="input-minimal" value={formData.ulkusKedalaman} onChange={e => setFormData({...formData, ulkusKedalaman: e.target.value})} disabled={isReadOnly}>
                        <option>&lt; 1/3 (Superfisial)</option>
                        <option>1/3 - 2/3 (Stromal)</option>
                        <option>&gt; 2/3 (Deep Stromal)</option>
                        <option>Perforasi / Descemetocele</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Severity (Keparahan)</label>
                      <select className="input-minimal" value={formData.ulkusSeverity} onChange={e => setFormData({...formData, ulkusSeverity: e.target.value})} disabled={isReadOnly}>
                        <option>Ringan</option><option>Sedang</option><option>Berat</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Purulensi</label>
                      <select className="input-minimal" value={formData.purulensi} onChange={e => setFormData({...formData, purulensi: e.target.value})} disabled={isReadOnly}>
                        <option>Tidak Ada</option><option>Sedikit</option><option>Banyak</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">AC Reaction</label>
                      <select className="input-minimal" value={formData.acReaction} onChange={e => setFormData({...formData, acReaction: e.target.value})} disabled={isReadOnly}>
                        <option>Tenang (0)</option><option>Trace (0.5+)</option><option>+1</option><option>+2</option><option>+3</option><option>+4</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Hipopion</label>
                      <div className="flex gap-2">
                        <select className="input-minimal" value={formData.hipopion} onChange={e => setFormData({...formData, hipopion: e.target.value})} disabled={isReadOnly}>
                          <option>Tidak Ada</option><option>Ada</option>
                        </select>
                        {formData.hipopion === 'Ada' && (
                          <input type="number" step="0.1" className="input-minimal w-20" placeholder="mm" value={formData.hipopionMm} onChange={e => setFormData({...formData, hipopionMm: e.target.value})} disabled={isReadOnly} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Camera className={cn("w-5 h-5", colors.text)} /> Foto Klinis
                  </h4>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-50 transition-all">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Plus className="w-8 h-8 text-slate-300 mb-2" />
                      <p className="text-xs text-slate-500">Klik untuk upload foto</p>
                    </div>
                    <input type="file" multiple className="hidden" onChange={handleFileChange} disabled={isReadOnly} />
                  </label>
                  {previews.length > 0 && (
                    <div className="flex flex-wrap gap-4 mt-6">
                      {previews.map((src, idx) => (
                        <div key={idx} className="relative group w-24 h-24 rounded-xl overflow-hidden border border-slate-200">
                          <img src={src} alt="Preview" className="w-full h-full object-cover" />
                          {!isReadOnly && (
                            <button 
                              type="button"
                              onClick={() => removePreview(idx)}
                              className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="w-5 h-5 text-white" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 3: MIKROBIOLOGI */}
            {currentStep === 3 && (
              <div className="animate-scale-in">
                <h3 className={cn("text-lg font-bold text-slate-800 mb-6 border-l-4 pl-3", colors.text.replace('text-', 'border-'))}>Hasil Mikrobiologi</h3>
                
                <div className="mb-8">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Etiologi (Penyebab Utama)</label>
                  <select className="input-minimal font-bold" value={formData.etiologi} onChange={e => setFormData({...formData, etiologi: e.target.value})} disabled={isReadOnly}>
                    <option value="">Pilih Etiologi...</option>
                    <option>Bakterial</option>
                    <option>Jamur (Fungal)</option>
                    <option>Viral</option>
                    <option>Parasit (Acanthamoeba)</option>
                    <option>Autoimun</option>
                    <option>Campuran</option>
                    <option>Belum Diketahui</option>
                  </select>
                </div>

                <div className="space-y-4 mb-8">
                  {/* Gram */}
                  <div className="border border-slate-200 rounded-2xl overflow-hidden">
                    <div className="bg-slate-50 p-4 font-bold text-sm text-slate-700 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Microscope className={cn("w-4 h-4", colors.text)} />
                        Pewarnaan Gram (Bakteri)
                      </div>
                      <select className="text-xs p-1 rounded border bg-white" value={formData.gram} onChange={e => setFormData({...formData, gram: e.target.value})} disabled={isReadOnly}>
                        <option>Tidak Dilakukan</option><option>Positif</option><option>Negatif</option>
                      </select>
                    </div>
                    {formData.gram !== 'Tidak Dilakukan' && (
                      <div className="p-4 bg-white">
                        <textarea className="input-minimal text-xs" placeholder="Deskripsi hasil Gram (misal: Coccus Gram Positif)..." value={formData.gramNote} onChange={e => setFormData({...formData, gramNote: e.target.value})} disabled={isReadOnly}></textarea>
                      </div>
                    )}
                  </div>

                  {/* KOH */}
                  <div className="border border-slate-200 rounded-2xl overflow-hidden">
                    <div className="bg-slate-50 p-4 font-bold text-sm text-slate-700 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Microscope className={cn("w-4 h-4", colors.text)} />
                        Pewarnaan KOH (Jamur)
                      </div>
                      <select className="text-xs p-1 rounded border bg-white" value={formData.koh} onChange={e => setFormData({...formData, koh: e.target.value})} disabled={isReadOnly}>
                        <option>Tidak Dilakukan</option><option>Positif</option><option>Negatif</option>
                      </select>
                    </div>
                    {formData.koh !== 'Tidak Dilakukan' && (
                      <div className="p-4 bg-white">
                        <textarea className="input-minimal text-xs" placeholder="Deskripsi hasil KOH (misal: Hifa Septat)..." value={formData.kohNote} onChange={e => setFormData({...formData, kohNote: e.target.value})} disabled={isReadOnly}></textarea>
                      </div>
                    )}
                  </div>

                  {/* Kultur */}
                  <div className="border border-slate-200 rounded-2xl overflow-hidden">
                    <div className="bg-slate-50 p-4 font-bold text-sm text-slate-700">Hasil Kultur</div>
                    <div className="p-4 bg-white">
                      <input type="text" className="input-minimal text-xs" placeholder="Nama mikroorganisme hasil kultur..." value={formData.kultur} onChange={e => setFormData({...formData, kultur: e.target.value})} disabled={isReadOnly} />
                    </div>
                  </div>
                </div>

                {/* Sensitivity Table */}
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-8 shadow-sm">
                  <div className="bg-slate-800 text-white p-4 font-bold text-sm flex items-center gap-2">
                    <Table className="w-4 h-4" /> Sensitivitas Antibiotik
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-[10px]">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="p-3 text-left font-bold text-slate-500 uppercase">Antibiotik</th>
                          <th className="p-3 text-center font-bold text-slate-500 uppercase">S</th>
                          <th className="p-3 text-center font-bold text-slate-500 uppercase">I</th>
                          <th className="p-3 text-center font-bold text-slate-500 uppercase">R</th>
                          <th className="p-3 text-center font-bold text-slate-500 uppercase">NA</th>
                        </tr>
                      </thead>
                      <tbody>
                        {['Amikacin', 'Ceftazidime', 'Ciprofloxacin', 'Gentamicin', 'Levofloxacin', 'Moxifloxacin', 'Tobramycin'].map(ab => (
                          <tr key={ab} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                            <td className="p-3 font-bold text-slate-700">{ab}</td>
                            {['S', 'I', 'R', 'NA'].map(val => (
                              <td key={`${ab}-${val}`} className="p-3 text-center">
                                <input 
                                  type="radio" 
                                  name={`sens-${ab}`} 
                                  checked={formData.sensitivitas[ab] === val}
                                  onChange={() => !isReadOnly && setFormData({...formData, sensitivitas: {...formData.sensitivitas, [ab]: val}})}
                                  className={cn("w-4 h-4", colors.text.replace('text-', 'accent-'))}
                                  disabled={isReadOnly}
                                />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                  <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-sm">
                    <FileText className={cn("w-4 h-4", colors.text)} /> Pemeriksaan Penunjang Lainnya
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {['GDS', 'HbA1c', 'HIV Test', 'Sifilis (VDRL/TPHA)', 'X-Ray Thorax', 'Lainnya'].map(test => (
                      <label key={test} className="flex items-center gap-3 cursor-pointer p-3 bg-white rounded-xl border border-slate-100 hover:border-slate-300 transition-all">
                        <input 
                          type="checkbox" 
                          checked={formData.penunjang.includes(test)}
                          onChange={e => {
                            if (isReadOnly) return;
                            const newPenunjang = e.target.checked 
                              ? [...formData.penunjang, test]
                              : formData.penunjang.filter(t => t !== test);
                            setFormData({...formData, penunjang: newPenunjang});
                          }}
                          className={cn("w-4 h-4 rounded", colors.text.replace('text-', 'accent-'))}
                          disabled={isReadOnly}
                        />
                        <span className="text-[10px] font-bold text-slate-600 uppercase">{test}</span>
                      </label>
                    ))}
                  </div>
                  {formData.penunjang.includes('Lainnya') && (
                    <input type="text" className="input-minimal mt-4 text-xs bg-white" placeholder="Sebutkan pemeriksaan lainnya..." value={formData.penunjangLain} onChange={e => setFormData({...formData, penunjangLain: e.target.value})} disabled={isReadOnly} />
                  )}
                </div>
              </div>
            )}

            {/* STEP 4: TERAPI */}
            {currentStep === 4 && (
              <div className="animate-scale-in">
                <h3 className={cn("text-lg font-bold text-slate-800 mb-6 border-l-4 pl-3", colors.text.replace('text-', 'border-'))}>Tatalaksana & Terapi</h3>
                
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-8 shadow-sm">
                  <h4 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <Stethoscope className={cn("w-5 h-5", colors.text)} /> Daftar Obat & Tindakan
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Antibiotik Topikal</label>
                      <div className="flex gap-3">
                        <select className="input-minimal w-1/3 bg-white" value={formData.abTopikal} onChange={e => setFormData({...formData, abTopikal: e.target.value})} disabled={isReadOnly}>
                          <option>Tidak Diberikan</option><option>Tunggal</option><option>Kombinasi</option><option>Fortified</option>
                        </select>
                        <input type="text" className="input-minimal flex-1 bg-white" placeholder="Nama obat & dosis..." value={formData.abTopikalNote} onChange={e => setFormData({...formData, abTopikalNote: e.target.value})} disabled={isReadOnly} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Antijamur</label>
                      <input type="text" className="input-minimal bg-white" placeholder="Nama obat & dosis..." value={formData.antijamur} onChange={e => setFormData({...formData, antijamur: e.target.value})} disabled={isReadOnly} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Antiviral</label>
                      <input type="text" className="input-minimal bg-white" placeholder="Nama obat & dosis..." value={formData.antiviral} onChange={e => setFormData({...formData, antiviral: e.target.value})} disabled={isReadOnly} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Antiparasit</label>
                      <input type="text" className="input-minimal bg-white" placeholder="Nama obat & dosis..." value={formData.antiparasit} onChange={e => setFormData({...formData, antiparasit: e.target.value})} disabled={isReadOnly} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Adjuvan / Sikloplegik</label>
                      <input type="text" className="input-minimal bg-white" placeholder="Nama obat & dosis..." value={formData.adjuvan} onChange={e => setFormData({...formData, adjuvan: e.target.value})} disabled={isReadOnly} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">NSAID / Anti Nyeri</label>
                      <input type="text" className="input-minimal bg-white" placeholder="Nama obat & dosis..." value={formData.nsaid} onChange={e => setFormData({...formData, nsaid: e.target.value})} disabled={isReadOnly} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Steroid</label>
                      <input type="text" className="input-minimal bg-white" placeholder="Nama obat & dosis..." value={formData.steroid} onChange={e => setFormData({...formData, steroid: e.target.value})} disabled={isReadOnly} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Terapi Lainnya</label>
                      <textarea className="input-minimal bg-white" rows={2} placeholder="Terapi lainnya..." value={formData.terapiLain} onChange={e => setFormData({...formData, terapiLain: e.target.value})} disabled={isReadOnly}></textarea>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Tindakan Operatif</label>
                      <select className="input-minimal bg-white" value={formData.tindakanOperatif} onChange={e => setFormData({...formData, tindakanOperatif: e.target.value})} disabled={isReadOnly}>
                        <option>Tidak Ada</option><option>Debridement</option><option>Keratektomi</option><option>Patch Graft</option><option>Keratoplasti Terapeutik</option><option>Eviserasi</option><option>Lainnya</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <FileText className={cn("w-5 h-5", colors.text)} /> Catatan Tambahan
                  </h4>
                  <textarea className="input-minimal" rows={4} placeholder="Tambahkan catatan klinis lainnya di sini..." value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} disabled={isReadOnly}></textarea>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-10 pt-6 border-t border-slate-100">
              <button 
                type="button" 
                onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : onBack()} 
                className="px-6 py-2.5 border border-slate-300 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all"
              >
                {currentStep === 1 ? (isReadOnly ? 'Tutup' : 'Batal') : 'Kembali'}
              </button>
              
              <div className="flex gap-3">
                {currentStep < 4 ? (
                  <button 
                    type="button" 
                    onClick={() => setCurrentStep(currentStep + 1)} 
                    className={cn("px-8 py-2.5 text-white rounded-xl font-bold text-sm shadow-lg transition-all", colors.btn, colors.shadow)}
                  >
                    Selanjutnya
                  </button>
                ) : (
                  !isReadOnly && (
                    <button type="submit" className="px-8 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all flex items-center gap-2">
                      <Save className="w-4 h-4" /> Simpan Data
                    </button>
                  )
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Default Form (for other types)
  return (
    <div className="fade-in">
      <div className="mb-6 flex items-center gap-4">
        <button onClick={onBack} className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 font-display">{title}</h1>
          <p className="text-slate-500 mt-1">{subtitle} untuk <span className="font-bold text-brand-600">{registryType}</span></p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-slate-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8">
          <div className="mb-8">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600"><User className="w-4 h-4" /></div>
              Data Demografi Pasien
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Nomor Rekam Medis (NRM)</label>
                <input 
                  type="text" 
                  value={formData.nrm}
                  onChange={(e) => setFormData({...formData, nrm: e.target.value})}
                  className="input-minimal" 
                  placeholder="Contoh: 00-12-34-56" 
                  required 
                  disabled={isReadOnly}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Tanggal Kunjungan Pertama</label>
                <input 
                  type="date" 
                  value={formData.visitDate}
                  onChange={(e) => setFormData({...formData, visitDate: e.target.value})}
                  className="input-minimal" 
                  required 
                  disabled={isReadOnly}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Tanggal Lahir</label>
                <input 
                  type="date" 
                  value={formData.dob}
                  onChange={(e) => setFormData({...formData, dob: e.target.value})}
                  className="input-minimal" 
                  required 
                  disabled={isReadOnly}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Jenis Kelamin</label>
                <select 
                  value={formData.gender}
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  className="input-minimal" 
                  required
                  disabled={isReadOnly}
                >
                  <option value="">-- Pilih --</option>
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 my-8"></div>

          <div className="mb-8">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"><Activity className="w-4 h-4" /></div>
              Data Klinis {registryType !== 'Umum' && `(${registryType})`}
            </h3>
            
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              {registryType === 'Uveitis' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Klasifikasi Anatomis</label>
                    <select 
                      className="input-minimal" 
                      value={formData.diagnosis}
                      onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
                      disabled={isReadOnly}
                    >
                      <option value="">-- Pilih --</option>
                      <option>Anterior Uveitis</option>
                      <option>Intermediate Uveitis</option>
                      <option>Posterior Uveitis</option>
                      <option>Panuveitis</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Visus Awal (LogMAR)</label>
                    <input type="number" step="0.1" className="input-minimal" placeholder="0.0 - 1.0" disabled={isReadOnly} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Tekanan Intraokular (mmHg)</label>
                    <input type="number" className="input-minimal" placeholder="TIO" disabled={isReadOnly} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Catatan Tambahan</label>
                    <textarea rows={3} className="input-minimal" value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} disabled={isReadOnly}></textarea>
                  </div>
                </div>
              ) : registryType === 'Fundus' || registryType === 'Retina' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Diagnosis Retina</label>
                    <input 
                      type="text" 
                      className="input-minimal" 
                      placeholder="Contoh: Diabetic Retinopathy" 
                      value={formData.diagnosis}
                      onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
                      disabled={isReadOnly}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Status Makula</label>
                    <select className="input-minimal" disabled={isReadOnly}>
                      <option>Normal</option>
                      <option>Edema (DME)</option>
                      <option>Scar / Atrofi</option>
                      <option>Hole</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Cup Disc Ratio (CDR)</label>
                    <input type="number" step="0.1" max="1.0" className="input-minimal" placeholder="0.1 - 0.9" disabled={isReadOnly} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Detail Pendarahan / Eksudat</label>
                    <textarea rows={3} className="input-minimal" value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} disabled={isReadOnly}></textarea>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Diagnosis Utama</label>
                    <input 
                      type="text" 
                      value={formData.diagnosis}
                      onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
                      className="input-minimal" 
                      placeholder="Diagnosis ICD-10" 
                      required 
                      disabled={isReadOnly}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Anamnesis & Catatan Klinis</label>
                    <textarea 
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      rows={4} 
                      className="input-minimal" 
                      placeholder="Riwayat penyakit, keluhan utama..."
                      disabled={isReadOnly}
                    ></textarea>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button type="button" onClick={onBack} className="px-6 py-2.5 border border-slate-300 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all">
              {isReadOnly ? 'Tutup' : 'Batal'}
            </button>
            {!isReadOnly && (
              <button type="submit" className="px-6 py-2.5 bg-brand-600 text-white rounded-xl font-bold text-sm hover:bg-brand-700 shadow-lg shadow-brand-200 transition-all flex items-center gap-2">
                <Save className="w-4 h-4" /> Simpan Data
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
