import React, { useState, useEffect } from 'react';
import { 
  Plus, Database, ArrowLeft, Disc, Check, ChevronDown, 
  Info, PlusCircle, Save, Edit3, Trash2, Eye, X, XCircle, 
  UploadCloud, Film, ZoomIn, LayoutGrid, ScanEye, Pencil
} from 'lucide-react';

interface FundusRegistryProps {
  onBack: () => void;
}

export default function FundusRegistry({ onBack }: FundusRegistryProps) {
  const [view, setView] = useState<'dashboard' | 'form'>('dashboard');
  const [step, setStep] = useState(1);
  const [registryData, setRegistryData] = useState<any[]>([]);
  const [uploadedItems, setUploadedItems] = useState<any[]>([]);
  const [activeScoring, setActiveScoring] = useState<any>({ uid: null, eye: null, type: null, data: {} });
  const [showScoringModal, setShowScoringModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [lightboxType, setLightboxType] = useState<'Foto' | 'Video' | null>(null);
  const [imagingSections, setImagingSections] = useState<string[]>([]);

  // Form States
  const [formData, setFormData] = useState<any>({
    date: new Date().toISOString().split('T')[0],
    firstVisitDate: '',
    unit: '',
    diagInitial: '',
    od: { category: '', secondary: '', ucva: '', bcva: '', tio: '' },
    os: { category: '', secondary: '', ucva: '', bcva: '', tio: '' },
    conclusion: ''
  });

  const DIAGNOSIS_OPTIONS = [
    "Normal Fundus", "Diabetic Retinopathy (NPDR)", "Diabetic Retinopathy (PDR)", "Diabetic Macular Edema (DME)",
    "AMD (Dry)", "AMD (Wet)", "Glaucoma Suspect", "Primary Open Angle Glaucoma", "Angle Closure Glaucoma",
    "Retinal Vein Occlusion (BRVO)", "Retinal Vein Occlusion (CRVO)", "Retinal Detachment",
    "Central Serous Chorioretinopathy (CSCR)", "Myopic Maculopathy", "Hypertensive Retinopathy", "Vitreous Hemorrhage",
    "Lainnya (Tulis di Catatan)"
  ];

  // Custom CSS
  const customStyles = `
    :root { --active-color: #14b8a6; --active-bg: #f0fdfa; --border-color: #e2e8f0; --focus-ring: rgba(0, 131, 171, 0.25); }
    
    .input-minimal, .textarea-minimal, .select-soft { width: 100%; padding: 10px 16px; font-size: 13px; border: 1px solid #e2e8f0; border-radius: 8px; transition: all 0.2s ease; background-color: #fff; }
    .input-minimal:focus, .textarea-minimal:focus, .select-soft:focus { outline: none; border-color: #14b8a6; box-shadow: 0 0 0 3px rgba(0, 131, 171, 0.25); }
    .select-wrapper { position: relative; width: 100%; }
    .select-soft { appearance: none; padding-right: 30px; }
    .select-arrow { position: absolute; top: 50%; right: 12px; transform: translateY(-50%); pointer-events: none; color: #14b8a6; }

    .card-modern { background: white; border-radius: 16px; padding: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); border: 1px solid #e2e8f0; margin-bottom: 20px; }
    .card-header-modern { text-align: center; font-weight: 700; padding: 8px; background: #f8fafc; color: #14b8a6; border: 1px solid #e5f2f7; border-radius: 12px; margin-bottom: 16px; font-size: 0.9rem; }
    .form-label-modern { display: block; font-weight: 600; margin-bottom: 6px; font-size: 0.8rem; color: #1e293b; }

    .step-circle { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; transition: all 0.3s; background: #f1f5f9; color: #94a3b8; }
    .step-active .step-circle { background: #14b8a6; color: white; box-shadow: 0 4px 10px rgba(0, 131, 171, 0.25); }
    .step-completed .step-circle { background: #10b981; color: white; }

    .file-drop-area { border: 2px dashed #cbd5e1; border-radius: 12px; padding: 20px; text-align: center; transition: all 0.2s; background: #f8fafc; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 120px; }
    .file-drop-area:hover { border-color: #14b8a6; background: #e5f2f7; }
    
    .preview-container { margin-top: 12px; position: relative; }
    .preview-item { position: relative; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; background: #000; height: 140px; width: 100%; }
    .preview-media { width: 100%; height: 100%; object-fit: contain; cursor: zoom-in; transition: transform 0.3s; }
    .preview-media:hover { transform: scale(1.05); }
    
    .media-actions { position: absolute; top: 5px; right: 5px; z-index: 10; }
    .action-btn { background: rgba(255,255,255,0.9); border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.2s; border: 1px solid #ddd; }
    .action-btn:hover { transform: scale(1.1); background: white; }
    .btn-delete { color: #ef4444; }

    .eye-format-toggle { display: flex; background: #e2e8f0; border-radius: 8px; padding: 3px; margin: 0 auto 16px auto; width: fit-content; }
    .toggle-btn { padding: 6px 16px; border-radius: 6px; font-size: 0.75rem; font-weight: 600; color: #64748b; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 6px; }
    .toggle-btn.active { background: white; color: #14b8a6; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }

    .animate-scale-in { animation: scaleIn 0.2s ease-out forwards; }
    @keyframes scaleIn { from { opacity: 0; transform: scale(0.99); } to { opacity: 1; transform: scale(1); } }
    .required::after { content: " *"; color: #ef4444; }
    .field-label-sm { font-size: 0.7rem; font-weight: 700; color: #64748b; margin-bottom: 4px; display: block; letter-spacing: 0.02em; text-transform: uppercase; }

    .checkbox-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 8px; margin-bottom: 8px; }
    .checkbox-label { display: flex; align-items: center; gap: 6px; font-size: 0.7rem; color: #475569; cursor: pointer; background: #fff; border: 1px solid #e2e8f0; padding: 4px 8px; border-radius: 6px; transition: all 0.2s; }
    .checkbox-label:hover { border-color: #14b8a6; }
    .checkbox-label input { accent-color: #14b8a6; }
    
    .score-layout { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; height: 100%; align-content: start; }
    @media (max-width: 1024px) { .score-layout { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 768px) { .score-layout { grid-template-columns: 1fr; } }

    .score-card { 
        background: white; border: 1px solid #e2e8f0; border-radius: 12px; 
        display: flex; flex-direction: column; overflow: hidden; height: fit-content; 
        box-shadow: 0 1px 3px rgba(0,0,0,0.02);
    }
    
    .score-card-header { 
        background: #f8fafc; padding: 10px 12px; border-bottom: 1px solid #edf2f7;
        font-weight: 700; color: #334155; font-size: 0.8rem;
        display: flex; justify-content: space-between; align-items: center;
    }
    
    .score-card-body { padding: 12px; display: flex; flex-direction: column; gap: 10px; }

    .chip-group { display: flex; flex-wrap: wrap; gap: 4px; }
    .chip-btn {
        flex: 1; min-width: fit-content;
        padding: 6px 8px; border-radius: 6px; 
        font-size: 0.75rem; font-weight: 500; color: #64748b;
        background: #f1f5f9; border: 1px solid transparent;
        cursor: pointer; text-align: center; transition: all 0.15s ease;
        display: flex; align-items: center; justify-content: center;
    }
    .chip-btn:hover { background: #e2e8f0; color: #475569; }
    
    input[type="radio"]:checked + .chip-btn, 
    input[type="checkbox"]:checked + .chip-btn {
        background: #14b8a6; color: white; border-color: #14b8a6;
        box-shadow: 0 2px 4px rgba(0, 131, 171, 0.2); font-weight: 600;
    }

    .score-label-row { font-size: 0.75rem; color: #475569; margin-bottom: 4px; font-weight: 600; display: flex; justify-content: space-between; }
    .sub-label { font-size: 0.7rem; color: #94a3b8; font-weight: 500; text-transform: uppercase; margin-bottom: 2px; }

    .dashboard-table-container { 
        overflow-x: auto; 
        background: white; 
        border-radius: 16px; 
        border: 1px solid #cbd5e1; 
        box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); 
    }
    .dashboard-table { width: 100%; border-collapse: collapse; }
    .dashboard-table th { 
        background-color: #f1f5f9; 
        color: #475569; 
        font-weight: 700; 
        font-size: 0.75rem; 
        text-transform: uppercase; 
        letter-spacing: 0.05em; 
        padding: 16px 20px; 
        text-align: left; 
        border-bottom: 1px solid #cbd5e1; 
        border-right: 1px solid #e2e8f0; 
    }
    .dashboard-table th:last-child { border-right: none; }
    .dashboard-table td { 
        padding: 16px 20px; 
        border-bottom: 1px solid #e2e8f0; 
        border-right: 1px solid #e2e8f0; 
        color: #334155; 
        font-size: 0.875rem; 
        vertical-align: middle; 
        background-color: white;
    }
    .dashboard-table td:last-child { border-right: none; }
    .dashboard-table tr:last-child td { border-bottom: none; }
    .dashboard-table tr:hover td { background-color: #f0fdfa; }
    
    .status-badge { 
        display: inline-flex; align-items: center; justify-content: center; 
        padding: 4px 12px; border-radius: 9999px; font-size: 0.7rem; font-weight: 600; 
        background-color: #ecfdf5; color: #059669; border: 1px solid #d1fae5; 
    }

    .summary-table { width: 100%; font-size: 0.85rem; border-collapse: collapse; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; }
    .summary-table th { text-align: left; padding: 12px 16px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; color: #64748b; font-weight: 600; font-size: 0.75rem; text-transform: uppercase; white-space: nowrap; }
    .summary-table td { padding: 12px 16px; border-bottom: 1px solid #e2e8f0; vertical-align: middle; background: white; }
    .summary-table tr:last-child td { border-bottom: none; }
    .text-blue-row { color: #1e40af; background-color: #eff6ff; }
    .text-green-row { color: #065f46; background-color: #ecfdf5; }

    .view-label { font-size: 0.75rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; display: block; font-weight: 700; }
    .view-value { font-size: 0.9rem; color: #1e293b; font-weight: 500; }
    .view-section-title { font-size: 0.9rem; color: #0083ab; font-weight: 700; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 12px; }
  `;

  const addImagingSection = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    setImagingSections(prev => [...prev, newId]);
  };

  const removeSection = (id: string) => {
    setImagingSections(prev => prev.filter(sid => sid !== id));
    setUploadedItems(prev => prev.filter(item => item.sectionId !== id));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, sectionId: string, eye: 'OD' | 'OS', type: 'Foto' | 'Video') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const newItem = {
          id: Math.random().toString(36).substr(2, 9),
          sectionId,
          eye,
          type,
          fileUrl: event.target?.result,
          modality: (document.getElementById(`modality-${sectionId}`) as HTMLSelectElement)?.value || 'CFP',
          date: (document.getElementById(`img-date-${sectionId}`) as HTMLInputElement)?.value || new Date().toISOString().split('T')[0]
        };
        setUploadedItems(prev => [...prev.filter(i => !(i.sectionId === sectionId && i.eye === eye && i.type === type)), newItem]);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveData = () => {
    const newRecord = {
      id: Date.now(),
      ...formData,
      images: uploadedItems
    };
    setRegistryData(prev => [...prev, newRecord]);
    setView('dashboard');
    setStep(1);
    setUploadedItems([]);
    setImagingSections([]);
    setFormData({
        date: new Date().toISOString().split('T')[0],
        firstVisitDate: '',
        unit: '',
        diagInitial: '',
        od: { category: '', secondary: '', ucva: '', bcva: '', tio: '' },
        os: { category: '', secondary: '', ucva: '', bcva: '', tio: '' },
        conclusion: ''
    });
  };

  const deleteData = (id: number) => {
    if (confirm('Hapus data ini?')) {
      setRegistryData(prev => prev.filter(item => item.id !== id));
    }
  };

  const viewData = (record: any) => {
    setSelectedRecord(record);
    setShowViewModal(true);
  };

  return (
    <div className="h-full w-full bg-slate-50 font-sans text-slate-700 flex flex-col">
      <style>{customStyles}</style>

      {/* DASHBOARD VIEW */}
      {view === 'dashboard' && (
        <div className="w-full h-full flex flex-col animate-scale-in">
          <div className="bg-white flex flex-col h-full overflow-hidden">
            <div className="bg-white px-8 py-6 border-b border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0 z-10 shadow-sm">
              <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div className="bg-[#f0fdfa] p-3 rounded-xl text-[#14b8a6] shadow-sm border border-[#ccfbf1]">
                        <ScanEye className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Fundus Registry <span className="text-[#14b8a6]">Pro</span></h1>
                        <p className="text-sm text-slate-500 font-medium">Integrated Imaging & Structured Reporting V9.3</p>
                    </div>
                </div>
                <button onClick={() => { setView('form'); addImagingSection(); }} className="bg-[#14b8a6] hover:bg-[#0d9488] text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:shadow-[#14b8a6]/30 transition-all flex items-center gap-2">
                  <Plus className="w-5 h-5" /> Tambah Kunjungan
                </button>
              </div>
            </div>

            <div className="p-6 md:p-10 bg-slate-50 flex-1 overflow-y-auto">
              <div className="w-full">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-slate-700 border-l-4 border-[#14b8a6] pl-3">Riwayat Kunjungan Pasien</h2>
                </div>

                <div className="dashboard-table-container">
                  <table className="dashboard-table">
                    <thead>
                      <tr>
                        <th>Kunjungan</th>
                        <th>Tanggal</th>
                        <th>Diagnosis (OD / OS)</th>
                        <th>Modalitas</th>
                        <th>Status</th>
                        <th className="text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {registryData.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-8 text-slate-400 italic text-sm">
                            Belum ada data kunjungan.
                          </td>
                        </tr>
                      ) : (
                        registryData.slice().reverse().map((item) => (
                          <tr key={item.id} className="animate-scale-in">
                            <td>
                                <div className="font-bold text-slate-700">Ref #{item.id.toString().substr(-6)}</div>
                                <div className="text-xs text-slate-400">{item.unit}</div>
                            </td>
                            <td className="text-slate-600">{item.date}</td>
                            <td>
                                <div className="flex flex-col gap-1.5">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded border border-blue-200 min-w-[24px] text-center">OD</span>
                                        <span className="text-xs text-slate-700 font-medium truncate max-w-[180px]" title={item.od.category}>{item.od.category || '-'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-200 min-w-[24px] text-center">OS</span>
                                        <span className="text-xs text-slate-700 font-medium truncate max-w-[180px]" title={item.os.category}>{item.os.category || '-'}</span>
                                    </div>
                                </div>
                            </td>
                            <td className="text-sm text-slate-600">
                                {[...new Set(item.images?.map((img: any) => img.modality))].join(', ') || '-'}
                            </td>
                            <td><span className="status-badge">Selesai</span></td>
                            <td className="text-right">
                                <div className="flex justify-end gap-1">
                                    <button onClick={() => viewData(item)} className="text-slate-400 hover:text-[#14b8a6] p-2 rounded hover:bg-slate-50" title="Lihat"><Eye className="w-5 h-5" /></button>
                                    <button onClick={() => deleteData(item.id)} className="text-slate-400 hover:text-red-600 p-2 rounded hover:bg-red-50" title="Hapus"><Trash2 className="w-5 h-5" /></button>
                                </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FORM VIEW */}
      {view === 'form' && (
        <div className="w-full h-full flex flex-col animate-scale-in">
          <div className="bg-white flex flex-col h-full overflow-hidden">
            
            {/* Header */}
            <div className="bg-white px-8 py-6 border-b border-slate-200 flex justify-between items-center shrink-0 z-20 shadow-sm">
              <div className="flex items-center gap-5 w-full">
                <button onClick={() => setView('dashboard')} className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors">
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="bg-[#f0fdfa] p-3 rounded-xl text-[#14b8a6] shadow-sm border border-[#ccfbf1]">
                    <ScanEye className="w-8 h-8" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Fundus Registry <span className="text-[#14b8a6]">Pro</span></h1>
                    <p className="text-sm text-slate-500 font-medium">Integrated Imaging & Structured Reporting V9.3</p>
                </div>
              </div>
              <button onClick={() => setView('dashboard')} className="text-sm font-bold text-slate-500 hover:text-red-500 transition-colors whitespace-nowrap">Batal</button>
            </div>

            <div className="flex-1 overflow-y-auto bg-slate-50">
              {/* Stepper */}
              <div className="bg-slate-50 px-8 py-8 border-b border-slate-100 overflow-x-auto sticky top-0 z-10 shadow-sm">
                <div className="flex items-center justify-between max-w-3xl mx-auto relative min-w-[500px]">
                  <div className="absolute top-5 left-0 w-full h-1 bg-gray-200 -z-0 rounded-full"></div>
                  
                  {[
                    { id: 1, label: 'Klinis' },
                    { id: 2, label: 'Pencitraan & Interpretasi' },
                    { id: 3, label: 'Review' }
                  ].map((s) => (
                    <div 
                      key={s.id} 
                      className={`flex flex-col items-center relative z-10 cursor-pointer group ${step === s.id ? 'step-active' : step > s.id ? 'step-completed' : ''}`} 
                      onClick={() => setStep(s.id)}
                    >
                      <div className="step-circle group-hover:ring-2 ring-[#ccfbf1] transition-all">
                        {step > s.id ? <Check className="w-4 h-4" /> : s.id}
                      </div>
                      <span className={`text-xs font-bold mt-2 uppercase tracking-wide ${step === s.id ? 'text-[#14b8a6]' : 'text-gray-400'}`}>{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Content */}
              <div className="p-6 md:p-10">
                
                {/* STEP 1: KLINIS */}
                {step === 1 && (
                  <div className="animate-scale-in">
                    <h3 className="text-lg font-bold text-slate-700 mb-4 border-l-4 border-[#14b8a6] pl-3">Data Klinis & Diagnosis Okular</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div>
                            <label className="form-label-modern required">Tanggal Pemeriksaan</label>
                            <input type="date" className="input-minimal" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
                        </div>
                        <div>
                            <label className="form-label-modern">Tanggal Kunjungan Pertama</label>
                            <input type="date" className="input-minimal" value={formData.firstVisitDate} onChange={(e) => setFormData({...formData, firstVisitDate: e.target.value})} />
                        </div>
                        <div>
                            <label className="form-label-modern required">Unit / Poli</label>
                            <div className="select-wrapper">
                                <select className="select-soft" value={formData.unit} onChange={(e) => setFormData({...formData, unit: e.target.value})}>
                                    <option value="" disabled>Pilih Unit...</option>
                                    <option>Umum</option><option>Glaukoma</option><option>Infeksi dan Imunologi</option><option>Katarak dan Bedah Refraksi</option><option>Neuro-Oftalmologi</option><option>Pediatric Oftalmologi</option><option>Vitreoretina</option><option>Lainnya</option>
                                </select>
                                <ChevronDown className="select-arrow w-4 h-4" />
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="form-label-modern">Diagnosis Okular Inisial</label>
                        <textarea className="textarea-minimal h-16" placeholder="Diagnosis awal / kerja (Free text)..." value={formData.diagInitial} onChange={(e) => setFormData({...formData, diagInitial: e.target.value})}></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* OD Card */}
                        <div className="card-modern !p-5 bg-slate-50 border border-blue-200">
                            <div className="card-header-modern text-blue-800 bg-blue-50 border-blue-100">Mata Kanan (OD)</div>
                            <div className="mb-4 space-y-3">
                                <div>
                                    <label className="field-label-sm text-blue-800">Kategori Diagnosis Utama</label>
                                    <div className="select-wrapper">
                                        <select className="select-soft text-xs font-medium" value={formData.od.category} onChange={(e) => setFormData({...formData, od: {...formData.od, category: e.target.value}})}>
                                            <option value="" disabled>Pilih Kategori...</option>
                                            {DIAGNOSIS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                        </select>
                                        <ChevronDown className="select-arrow w-3 h-3 text-blue-500" />
                                    </div>
                                </div>
                                <div>
                                    <label className="field-label-sm text-blue-800">Diagnosis Sekunder</label>
                                    <input type="text" className="input-minimal" placeholder="Contoh: Cataract, PCO, dll" value={formData.od.secondary} onChange={(e) => setFormData({...formData, od: {...formData.od, secondary: e.target.value}})} />
                                </div>
                            </div>
                            <div className="border-t border-blue-200 pt-4 space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="field-label-sm text-blue-800">UCVA</label>
                                        <div className="flex gap-2 mb-2"><input placeholder="6/..." className="input-minimal text-center" /><input placeholder="Dec" className="input-minimal text-center" value={formData.od.ucva} onChange={(e) => setFormData({...formData, od: {...formData.od, ucva: e.target.value}})} /></div>
                                    </div>
                                    <div>
                                        <label className="field-label-sm text-blue-800">BCVA</label>
                                        <div className="flex gap-2 mb-2"><input placeholder="6/..." className="input-minimal text-center" /><input placeholder="Dec" className="input-minimal text-center" value={formData.od.bcva} onChange={(e) => setFormData({...formData, od: {...formData.od, bcva: e.target.value}})} /></div>
                                    </div>
                                </div>
                                <div>
                                    <label className="field-label-sm text-blue-800">TIO (mmHg)</label>
                                    <input type="number" className="input-minimal text-center" placeholder="e.g. 15" value={formData.od.tio} onChange={(e) => setFormData({...formData, od: {...formData.od, tio: e.target.value}})} />
                                </div>
                            </div>
                        </div>

                        {/* OS Card */}
                        <div className="card-modern !p-5 bg-slate-50 border border-emerald-200">
                            <div className="card-header-modern text-emerald-800 bg-emerald-50 border-emerald-100">Mata Kiri (OS)</div>
                            <div className="mb-4 space-y-3">
                                <div>
                                    <label className="field-label-sm text-emerald-800">Kategori Diagnosis Utama</label>
                                    <div className="select-wrapper">
                                        <select className="select-soft text-xs font-medium" value={formData.os.category} onChange={(e) => setFormData({...formData, os: {...formData.os, category: e.target.value}})}>
                                            <option value="" disabled>Pilih Kategori...</option>
                                            {DIAGNOSIS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                        </select>
                                        <ChevronDown className="select-arrow w-3 h-3 text-emerald-500" />
                                    </div>
                                </div>
                                <div>
                                    <label className="field-label-sm text-emerald-800">Diagnosis Sekunder</label>
                                    <input type="text" className="input-minimal" placeholder="Contoh: Cataract, PCO, dll" value={formData.os.secondary} onChange={(e) => setFormData({...formData, os: {...formData.os, secondary: e.target.value}})} />
                                </div>
                            </div>
                            <div className="border-t border-emerald-200 pt-4 space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="field-label-sm text-emerald-800">UCVA</label>
                                        <div className="flex gap-2 mb-2"><input placeholder="6/..." className="input-minimal text-center" /><input placeholder="Dec" className="input-minimal text-center" value={formData.os.ucva} onChange={(e) => setFormData({...formData, os: {...formData.os, ucva: e.target.value}})} /></div>
                                    </div>
                                    <div>
                                        <label className="field-label-sm text-emerald-800">BCVA</label>
                                        <div className="flex gap-2 mb-2"><input placeholder="6/..." className="input-minimal text-center" /><input placeholder="Dec" className="input-minimal text-center" value={formData.os.bcva} onChange={(e) => setFormData({...formData, os: {...formData.os, bcva: e.target.value}})} /></div>
                                    </div>
                                </div>
                                <div>
                                    <label className="field-label-sm text-emerald-800">TIO (mmHg)</label>
                                    <input type="number" className="input-minimal text-center" placeholder="e.g. 15" value={formData.os.tio} onChange={(e) => setFormData({...formData, os: {...formData.os, tio: e.target.value}})} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 text-right">
                        <button type="button" onClick={() => setStep(2)} className="bg-[#14b8a6] text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-[#0d9488] transition-all flex items-center gap-2 ml-auto">
                            Selanjutnya <ArrowLeft className="w-5 h-5 rotate-180" />
                        </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: UPLOAD & INTERPRETASI */}
                {step === 2 && (
                  <div className="animate-scale-in">
                    <h3 className="text-lg font-bold text-slate-700 mb-4 border-l-4 border-[#14b8a6] pl-3">Data Pencitraan & Interpretasi</h3>
                    
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4 flex gap-3 text-sm text-yellow-800">
                        <Info className="w-5 h-5 flex-shrink-0" />
                        <p>Upload file baru pada slot yang sama akan <b>mengganti (replace)</b> file sebelumnya. Gunakan fitur zoom (klik gambar) untuk membantu interpretasi.</p>
                    </div>

                    <div id="upload-container">
                        {imagingSections.map((sectionId, index) => (
                            <div key={sectionId} className="card-modern relative mb-6">
                                <div className="absolute top-4 right-4 z-10"><button type="button" onClick={() => removeSection(sectionId)} className="text-red-400 hover:text-red-600 p-1"><X className="w-5 h-5" /></button></div>
                                <h4 className="text-sm font-bold text-slate-700 mb-4 border-b pb-2">Pencitraan #{index + 1}</h4>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <label className="form-label-modern">Tanggal Pengambilan Foto</label>
                                        <input type="date" id={`img-date-${sectionId}`} className="input-minimal" defaultValue={new Date().toISOString().split('T')[0]} />
                                    </div>
                                    <div>
                                        <label className="form-label-modern">Modalitas</label>
                                        <div className="select-wrapper">
                                            <select className="select-soft" id={`modality-${sectionId}`}>
                                                <option value="CFP">Color Fundus Photo (CFP)</option>
                                                <option value="UWF">Ultra Wide Field (UWF)</option>
                                                <option value="FFA">Fluorescein Angiography (FFA)</option>
                                                <option value="ICGA">ICG Angiography (ICGA)</option>
                                                <option value="OCT">OCT Macula/Nerve</option>
                                            </select>
                                            <ChevronDown className="select-arrow w-4 h-4" />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* OD Column */}
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 h-full flex flex-col">
                                        <div className="text-center mb-3"><span className="text-xs font-bold text-blue-800 uppercase tracking-wide bg-blue-100 px-2 py-1 rounded">Mata Kanan (OD)</span></div>
                                        
                                        <div className="mb-4">
                                            <label className="file-drop-area bg-white">
                                                <UploadCloud className="w-6 h-6 text-slate-300 mb-2" />
                                                <span className="text-xs font-bold text-slate-600">Klik Upload OD (Foto)</span>
                                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileSelect(e, sectionId, 'OD', 'Foto')} />
                                            </label>
                                        </div>
                                        
                                        <div className="preview-container">
                                            {uploadedItems.filter(i => i.sectionId === sectionId && i.eye === 'OD').map((item, idx) => (
                                                <div key={idx} className="preview-item group">
                                                    <img src={item.fileUrl} className="preview-media" onClick={() => { setLightboxSrc(item.fileUrl); setLightboxType('Foto'); }} />
                                                    <div className="media-actions">
                                                        <button type="button" className="action-btn btn-delete" onClick={() => setUploadedItems(prev => prev.filter(i => i !== item))}>
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* OS Column */}
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 h-full flex flex-col">
                                        <div className="text-center mb-3"><span className="text-xs font-bold text-blue-800 uppercase tracking-wide bg-blue-100 px-2 py-1 rounded">Mata Kiri (OS)</span></div>
                                        
                                        <div className="mb-4">
                                            <label className="file-drop-area bg-white">
                                                <UploadCloud className="w-6 h-6 text-slate-300 mb-2" />
                                                <span className="text-xs font-bold text-slate-600">Klik Upload OS (Foto)</span>
                                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileSelect(e, sectionId, 'OS', 'Foto')} />
                                            </label>
                                        </div>

                                        <div className="preview-container">
                                            {uploadedItems.filter(i => i.sectionId === sectionId && i.eye === 'OS').map((item, idx) => (
                                                <div key={idx} className="preview-item group">
                                                    <img src={item.fileUrl} className="preview-media" onClick={() => { setLightboxSrc(item.fileUrl); setLightboxType('Foto'); }} />
                                                    <div className="media-actions">
                                                        <button type="button" className="action-btn btn-delete" onClick={() => setUploadedItems(prev => prev.filter(i => i !== item))}>
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <button type="button" onClick={addImagingSection} className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 font-bold hover:border-[#14b8a6] hover:text-[#14b8a6] hover:bg-[#f0fdfa] transition-all flex items-center justify-center gap-2 mb-6">
                        <PlusCircle className="w-5 h-5" /> Tambah Pencitraan Baru
                    </button>
                    
                    <div className="flex justify-between pt-4 border-t border-slate-100">
                        <button type="button" onClick={() => setStep(1)} className="text-slate-500 font-bold">Kembali</button>
                        <button type="button" onClick={() => setStep(3)} className="bg-[#14b8a6] text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-[#0d9488] transition-all">Review Final</button>
                    </div>
                  </div>
                )}

                {/* STEP 3: REVIEW & SIMPAN */}
                {step === 3 && (
                  <div className="animate-scale-in">
                      <h3 className="text-lg font-bold text-slate-700 mb-4 border-l-4 border-[#14b8a6] pl-3">Review & Kesimpulan Akhir</h3>
                    
                    <div className="card-modern mb-6">
                        <h4 className="font-bold text-slate-700 mb-3 border-b pb-2">Ringkasan File Upload</h4>
                        <div className="overflow-x-auto">
                            <table className="summary-table">
                                <thead>
                                    <tr>
                                        <th>Mata</th>
                                        <th>Modalitas</th>
                                        <th>Tipe</th>
                                        <th>Status File</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {uploadedItems.length === 0 ? (
                                        <tr className="text-center text-slate-400 italic"><td colSpan={4}>Belum ada data.</td></tr>
                                    ) : (
                                        uploadedItems.map((item, idx) => (
                                            <tr key={idx} className={item.eye === 'OD' ? 'text-blue-row' : 'text-green-row'}>
                                                <td>{item.eye}</td>
                                                <td>{item.modality}</td>
                                                <td>{item.type}</td>
                                                <td><span className="text-emerald-600 font-bold flex items-center gap-1"><Check className="w-3 h-3" /> Ready</span></td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="card-modern">
                        <label className="form-label-modern">Saran / Rencana Tindak Lanjut</label>
                        <textarea className="textarea-minimal h-24" placeholder="Contoh: Observasi 6 bulan, Pro Laser Photocoagulation..." value={formData.conclusion} onChange={(e) => setFormData({...formData, conclusion: e.target.value})}></textarea>
                    </div>
                    <div className="flex justify-between pt-4 border-t border-slate-100">
                        <button type="button" onClick={() => setStep(2)} className="text-slate-500 font-bold">Kembali</button>
                        <button type="button" onClick={saveData} className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-emerald-700 transition-all flex items-center gap-2">
                            <Save className="w-5 h-5" /> Simpan Follow Up
                        </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxSrc && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 animate-scale-in">
            <div className="absolute inset-0" onClick={() => setLightboxSrc(null)}></div>
            <button onClick={() => setLightboxSrc(null)} className="absolute top-6 right-6 text-white hover:text-red-400 z-50"><XCircle className="w-10 h-10" /></button>
            <div className="relative z-10 max-w-5xl max-h-[90vh] w-full p-4 flex justify-center items-center">
                {lightboxType === 'Video' ? (
                    <video src={lightboxSrc} controls autoPlay className="max-h-[85vh] max-w-full rounded shadow-lg"></video>
                ) : (
                    <img src={lightboxSrc} className="max-h-[85vh] max-w-full object-contain rounded shadow-lg" />
                )}
            </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl relative z-10 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto animate-scale-in">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-20">
                    <h3 className="text-xl font-bold text-slate-800">Detail Kunjungan</h3>
                    <button onClick={() => setShowViewModal(false)} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"><X className="w-5 h-5 text-slate-500" /></button>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div><span className="view-label">Unit</span><div className="view-value">{selectedRecord.unit}</div></div>
                        <div><span className="view-label">Tanggal Visit</span><div className="view-value">{selectedRecord.date}</div></div>
                    </div>
                    
                    <div className="view-section-title">Diagnosis & Klinis</div>
                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                            <span className="view-label text-blue-800">Mata Kanan (OD)</span>
                            <div className="view-value text-blue-900">{selectedRecord.od.category || '-'}</div>
                            <div className="text-xs text-slate-500 mt-1"><span className="font-semibold">Sekunder:</span> {selectedRecord.od.secondary || '-'}</div>
                        </div>
                        <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                            <span className="view-label text-emerald-800">Mata Kiri (OS)</span>
                            <div className="view-value text-emerald-900">{selectedRecord.os.category || '-'}</div>
                            <div className="text-xs text-slate-500 mt-1"><span className="font-semibold">Sekunder:</span> {selectedRecord.os.secondary || '-'}</div>
                        </div>
                    </div>

                    <div className="view-section-title">Data Pencitraan</div>
                    <div className="mb-6">
                        {selectedRecord.images && selectedRecord.images.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {selectedRecord.images.map((img: any, idx: number) => (
                                    <div key={idx} className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                        <img src={img.fileUrl} className="w-full h-32 bg-black object-contain rounded-lg border border-slate-300 shadow-sm" />
                                        <div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-white bg-slate-700 px-2 py-0.5 rounded w-fit">{img.modality} - {img.eye}</span>
                                                <span className="text-xs text-slate-500 mt-1">{img.date || '-'}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-400">Tidak ada data pencitraan.</div>
                        )}
                    </div>

                    <div className="view-section-title">Saran / Plan</div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-sm text-slate-700 whitespace-pre-wrap">{selectedRecord.conclusion || '-'}</div>
                </div>
                <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-2xl text-right">
                    <button onClick={() => setShowViewModal(false)} className="px-6 py-2 bg-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-300">Tutup</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
