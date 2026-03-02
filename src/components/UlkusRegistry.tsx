import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, Database, ArrowLeft, Disc, Check, ChevronDown, 
  ShieldAlert, History, ScanEye, Camera, Microscope, Pill, 
  Activity, Stethoscope, Save, Edit3, Trash2, AlertTriangle 
} from 'lucide-react';

interface UlkusRegistryProps {
  onBack: () => void;
}

export default function UlkusRegistry({ onBack }: UlkusRegistryProps) {
  const [view, setView] = useState<'dashboard' | 'form'>('dashboard');
  const [step, setStep] = useState(1);
  const [registryData, setRegistryData] = useState<any[]>([]);
  
  // Form States
  const [formData, setFormData] = useState<any>({
    tanggal: new Date().toISOString().split('T')[0],
    unit: '',
    diagnosis: '',
    etiologi: '',
    lat: ''
  });

  // Helper to toggle sections
  const [labSections, setLabSections] = useState({
    lab1: false,
    lab2: false,
    lab3: false
  });

  const toggleLab = (section: keyof typeof labSections) => {
    setLabSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const saveData = (e: React.FormEvent) => {
    e.preventDefault();
    const newData = {
      ...formData,
      tanggal: (document.getElementById('input_tanggal') as HTMLInputElement)?.value || formData.tanggal,
      unit: (document.getElementById('input_unit') as HTMLSelectElement)?.value || '-',
      diagnosis: (document.getElementById('input_diagnosis') as HTMLInputElement)?.value || 'Tidak Ada Diagnosis',
      etiologi: (document.getElementById('input_etiologi') as HTMLSelectElement)?.value || 'Belum Ditentukan',
      lat: (document.querySelector('input[name="lat"]:checked') as HTMLInputElement)?.value || '-'
    };
    
    setRegistryData([...registryData, newData]);
    setView('dashboard');
    setStep(1);
    // Reset form logic would go here
  };

  const deleteData = (index: number) => {
    if (confirm('Hapus data ini?')) {
      const newData = [...registryData];
      newData.splice(index, 1);
      setRegistryData(newData);
    }
  };

  // Custom CSS from the user's template
  const customStyles = `
    :root { --active-color: #14b8a6; --active-bg: #f0fdfa; --border-color: #e2e8f0; --focus-ring: rgba(20, 184, 166, 0.25); }
    
    /* Inputs & UI Elements */
    .input-minimal, .textarea-minimal, .select-soft { width: 100%; padding: 12px 18px; font-size: 14px; border: 2px solid transparent; background-color: #f1f5f9; border-radius: 16px; transition: all 0.2s ease; }
    .input-minimal:focus, .textarea-minimal:focus, .select-soft:focus { outline: none; background-color: #ffffff; border-color: #14b8a6; box-shadow: 0 4px 15px rgba(20, 184, 166, 0.1); }
    .select-wrapper { position: relative; width: 100%; }
    .select-soft { appearance: none; padding-right: 35px; cursor: pointer; }
    .select-arrow { position: absolute; top: 50%; right: 14px; transform: translateY(-50%); pointer-events: none; color: #14b8a6; }

    .card-modern { background: white; border-radius: 24px; padding: 24px; box-shadow: 0 4px 20px -2px rgba(0,0,0,0.05); border: 1px solid #f0fdfa; margin-bottom: 24px; }
    .card-header-modern { text-align: center; font-weight: 700; padding: 10px; background: #f0fdfa; color: #0f766e; border: 1px dashed #ccfbf1; border-radius: 16px; margin-bottom: 20px; font-size: 0.95rem; }
    .form-label-modern { display: block; font-weight: 600; margin-bottom: 8px; font-size: 0.85rem; color: #334155; margin-left: 4px; }

    .step-circle { width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; transition: all 0.3s; background: #f1f5f9; color: #94a3b8; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
    .step-active .step-circle { background: #14b8a6; color: white; box-shadow: 0 4px 12px rgba(20, 184, 166, 0.25); transform: scale(1.1); }
    .step-completed .step-circle { background: #10b981; color: white; }

    .file-drop-area { border: 2px dashed #cbd5e1; border-radius: 20px; padding: 24px; text-align: center; transition: all 0.2s; background: #f8fafc; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 150px; }
    .file-drop-area:hover { border-color: #14b8a6; background: #f0fdfa; }
    
    .eye-col { background: #fff; border: 1px solid #f1f5f9; border-radius: 20px; padding: 20px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); }
    .eye-col-header { text-align: center; font-weight: 700; padding: 8px; border-radius: 12px; margin-bottom: 16px; font-size: 0.9rem; }

    .sensi-table { width: 100%; border-collapse: separate; border-spacing: 0; font-size: 0.75rem; }
    .sensi-table th { background: #f0fdfa; padding: 10px; text-align: center; font-weight: 700; color: #0f766e; border-bottom: 2px solid #ccfbf1; }
    .sensi-table td { padding: 8px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
    .sensi-table tr:hover { background-color: #f8fafc; }
    .radio-cell { display: flex; align-items: center; justify-content: center; width: 100%; }
    .radio-cell input { accent-color: #14b8a6; cursor: pointer; width: 18px; height: 18px; }

    .loc-selector-label { display: block; padding: 12px; border: 2px solid #f1f5f9; background: #f8fafc; border-radius: 16px; text-align: center; cursor: pointer; transition: all 0.2s; }
    .loc-selector-input:checked + .loc-selector-label { background: white; border-color: #14b8a6; color: #14b8a6; box-shadow: 0 4px 12px rgba(20, 184, 166, 0.25); }

    .animate-scale-in { animation: scaleIn 0.2s ease-out forwards; }
    @keyframes scaleIn { from { opacity: 0; transform: scale(0.99); } to { opacity: 1; transform: scale(1); } }
    .required::after { content: " *"; color: #f43f5e; }
    .field-label-sm { font-size: 0.75rem; font-weight: 700; color: #64748b; margin-bottom: 6px; display: block; letter-spacing: 0.02em; text-transform: uppercase; margin-left: 4px; }

    .data-table-container { 
        overflow-x: auto; 
        background: white; 
        border-radius: 16px; 
        border: 1px solid #cbd5e1; 
        box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); 
    }
    .data-table { width: 100%; border-collapse: collapse; }
    .data-table th { 
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
    .data-table th:last-child { border-right: none; }
    .data-table td { 
        padding: 16px 20px; 
        border-bottom: 1px solid #e2e8f0; 
        border-right: 1px solid #e2e8f0; 
        color: #334155; 
        font-size: 0.875rem; 
        vertical-align: middle; 
        background-color: white;
    }
    .data-table td:last-child { border-right: none; }
    .data-table tr:last-child td { border-bottom: none; }
    .data-table tr:hover td { background-color: #f0fdfa; }
    
    .status-badge { display: inline-flex; align-items: center; padding: 4px 12px; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; }
    .status-verified { background-color: #ecfdf5; color: #059669; border: 1px solid #d1fae5; }
  `;

  const antibiotics = [ "Gentamicin", "Amikacin", "Kanamycin", "Neomycin", "Tobramycin", "Ampicillin", "Ampicillin/Sulbactam", "Amoxicillin/Clavulanat", "Piperacillin/Tazobactam", "Cefepime", "Cefotaxime", "Ceftazidime", "Ceftriaxone", "Cefoperazone", "Imipenem", "Meropenem", "Ciprofloxacin", "Levofloxacin", "Moxifloxacin", "Gatifloxacin", "Erythromycin", "Clindamycin", "Vancomycin", "Chloramphenicol", "Tetracycline", "Doxycycline", "Cotrimoxazole" ];

  return (
    <div className="h-full w-full bg-slate-50 font-sans text-slate-700 flex flex-col">
      <style>{customStyles}</style>

      {/* DASHBOARD VIEW */}
      {view === 'dashboard' && (
        <div className="w-full h-full flex flex-col animate-scale-in">
          <div className="bg-white flex flex-col h-full overflow-hidden">
            <div className="bg-white px-8 py-6 border-b border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0 z-10 shadow-sm">
              <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                  <div className="flex items-center gap-4 mb-2">
                      <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors">
                          <ArrowLeft className="w-6 h-6" />
                      </button>
                      <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Data Registry Pasien</h1>
                  </div>
                  <p className="text-slate-500 text-sm mt-1 ml-12">Sistem Pencatatan Ulkus Kornea Terpadu</p>
                </div>
                <button onClick={() => setView('form')} className="bg-[#14b8a6] hover:bg-[#0d9488] text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:shadow-[#14b8a6]/30 transition-all flex items-center gap-2">
                  <Plus className="w-5 h-5" /> Tambah Data Baru
                </button>
              </div>
            </div>

            <div className="p-6 md:p-10 bg-slate-50 flex-1 overflow-y-auto">
              <div className="w-full">
                <div className="data-table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Tanggal Periksa</th>
                        <th>Unit / Poli</th>
                        <th>Diagnosis Kerja</th>
                        <th>Mata (Lat)</th>
                        <th>Etiologi</th>
                        <th>Status</th>
                        <th className="text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {registryData.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center py-12 text-slate-400">
                            <div className="flex flex-col items-center justify-center gap-3">
                              <div className="bg-slate-100 p-4 rounded-full"><Database className="w-6 h-6" /></div>
                              <span>Belum ada data registry yang diinput.</span>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        registryData.map((data, index) => (
                          <tr key={index} className="animate-scale-in">
                            <td><span className="font-medium text-slate-700">{data.tanggal}</span></td>
                            <td>{data.unit}</td>
                            <td className="font-medium text-slate-800">{data.diagnosis}</td>
                            <td>
                              {data.lat === 'OD' ? <span className="text-blue-600 font-bold">OD</span> : 
                               data.lat === 'OS' ? <span className="text-emerald-600 font-bold">OS</span> : 
                               <span className="text-slate-400">-</span>}
                            </td>
                            <td><span className="bg-slate-100 px-2 py-1 rounded text-xs font-bold text-slate-600">{data.etiologi}</span></td>
                            <td><span className="status-badge status-verified">Terverifikasi</span></td>
                            <td className="text-right">
                              <div className="flex justify-end gap-2">
                                <button className="text-slate-400 hover:text-[#14b8a6] p-1 transition-colors" title="Edit"><Edit3 className="w-4 h-4" /></button>
                                <button className="text-slate-400 hover:text-red-500 p-1 transition-colors" onClick={() => deleteData(index)} title="Hapus"><Trash2 className="w-4 h-4" /></button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 text-center text-xs text-slate-400">&copy; 2025 Registry Ulkus Kornea - Standar UI V4</div>
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
                <div className="bg-care-50 p-4 rounded-2xl text-accent shadow-sm border border-care-100" style={{ backgroundColor: '#f0fdfa', color: '#14b8a6', borderColor: '#ccfbf1' }}>
                  <Disc className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Input Data Registry</h1>
                  <p className="text-sm text-slate-500 font-medium">Formulir Pasien Baru</p>
                </div>
              </div>
              <button onClick={() => setView('dashboard')} className="text-sm font-bold text-slate-500 hover:text-red-500 transition-colors whitespace-nowrap">Batal</button>
            </div>

            <div className="flex-1 overflow-y-auto bg-slate-50">
              {/* Stepper */}
              <div className="bg-slate-50 px-8 py-8 border-b border-slate-100 overflow-x-auto sticky top-0 z-10 shadow-sm">
                <div className="flex items-center justify-between max-w-4xl mx-auto relative min-w-[500px]">
                  <div className="absolute top-6 left-0 w-full h-1.5 bg-slate-200 -z-0 rounded-full"></div>
                  
                  {[
                    { id: 1, label: 'Klinis' },
                    { id: 2, label: 'Fisik' },
                    { id: 3, label: 'Mikrobiologi' },
                    { id: 4, label: 'Terapi' }
                  ].map((s) => (
                    <div 
                      key={s.id} 
                      className={`flex flex-col items-center relative z-10 cursor-pointer group ${step === s.id ? 'step-active' : step > s.id ? 'step-completed' : ''}`} 
                      onClick={() => setStep(s.id)}
                    >
                      <div className="step-circle group-hover:ring-4 ring-care-100 transition-all">
                        {step > s.id ? <Check className="w-5 h-5" /> : s.id}
                      </div>
                      <span className={`text-xs font-bold mt-3 uppercase tracking-wide ${step === s.id ? 'text-[#14b8a6]' : 'text-gray-400'}`}>{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Content */}
              <form className="p-6 md:p-10" onSubmit={saveData}>
            
            {/* STEP 1: DATA KLINIS */}
            {step === 1 && (
              <div className="animate-scale-in">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-bold text-slate-700 border-l-8 border-[#14b8a6] pl-4 rounded-l-sm">Identitas & Anamnesis</h3>
                  <div className="text-sm text-[#14b8a6] bg-[#f0fdfa] px-4 py-2 rounded-xl border border-[#ccfbf1]">Tgl: <span className="font-bold">{new Date().toLocaleDateString('id-ID')}</span></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                  <div>
                    <label className="form-label-modern required">Tanggal Pemeriksaan</label>
                    <input type="date" id="input_tanggal" className="input-minimal" defaultValue={new Date().toISOString().split('T')[0]} />
                  </div>
                  <div>
                    <label className="form-label-modern">Tanggal Kunjungan Pertama</label>
                    <input type="date" className="input-minimal" />
                  </div>
                  <div>
                    <label className="form-label-modern required">Unit / Poli</label>
                    <div className="select-wrapper">
                      <select id="input_unit" className="select-soft" defaultValue="">
                        <option value="" disabled>Pilih Unit...</option>
                        <option>Umum</option>
                        <option>Infeksi & Imunologi</option>
                        <option>Kornea</option>
                        <option>IGD</option>
                        <option>Rawat Inap</option>
                        <option>Lainnya</option>
                      </select>
                      <ChevronDown className="select-arrow w-5 h-5" />
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <div className="mb-6">
                    <label className="form-label-modern required">Diagnosis Kerja</label>
                    <input type="text" id="input_diagnosis" className="input-minimal" placeholder="Contoh: Ulkus Kornea Bakterial OD" />
                  </div>
                  <div>
                    <label className="form-label-modern required">Keluhan Utama</label>
                    <textarea className="textarea-minimal" rows={3} placeholder="Jelaskan keluhan utama pasien secara rinci..."></textarea>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div><label className="form-label-modern">Suku Bangsa</label><input type="text" className="input-minimal" placeholder="Jawa, Sunda, dll..." /></div>
                  <div><label className="form-label-modern">Pekerjaan</label><input type="text" className="input-minimal" placeholder="Petani, Buruh, dll..." /></div>
                </div>

                <div className="card-modern">
                  <h4 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-3 pb-3 border-b border-slate-100"><ShieldAlert className="w-6 h-6 text-[#14b8a6]" /> Faktor Risiko & Onset</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="form-label-modern">Faktor Okular</label>
                      <div className="select-wrapper">
                        <select className="select-soft">
                          <option>Tidak Ada</option><option>Trauma Fisik</option><option>Trauma Kimia</option><option>Lensa Kontak</option><option>Riwayat Operasi</option><option>Lainnya</option>
                        </select>
                        <ChevronDown className="select-arrow w-5 h-5" />
                      </div>
                    </div>
                    <div>
                      <label className="form-label-modern">Faktor Sistemik</label>
                      <div className="select-wrapper">
                        <select className="select-soft">
                          <option>Tidak Ada</option><option>Diabetes Mellitus</option><option>Autoimun</option><option>HIV/AIDS</option><option>Defisiensi Vit A</option>
                        </select>
                        <ChevronDown className="select-arrow w-5 h-5" />
                      </div>
                    </div>
                    <div>
                      <label className="form-label-modern">Komorbid Lain</label>
                      <input type="text" className="input-minimal" placeholder="Hipertensi, Ginjal, dll..." />
                    </div>
                    <div>
                      <label className="form-label-modern">Faktor Risiko Pekerjaan</label>
                      <div className="select-wrapper">
                        <select className="select-soft">
                          <option>Tidak Ada</option>
                          <option>Pertanian / Perkebunan</option>
                          <option>Konstruksi / Bangunan</option>
                          <option>Pabrik / Industri (Logam/Kimia)</option>
                          <option>Luar Ruangan (Outdoor)</option>
                          <option>Lainnya</option>
                        </select>
                        <ChevronDown className="select-arrow w-5 h-5" />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6 pt-6 border-t border-slate-100">
                    <div><label className="form-label-modern">Lama Onset (Hari)</label><input type="number" className="input-minimal" placeholder="0" /></div>
                    <div>
                      <label className="form-label-modern">Lateralitas (Anamnesis)</label>
                      <div className="flex gap-4">
                        <label className="flex-1 text-center cursor-pointer"><input type="radio" name="lat" className="hidden peer" value="OD" /><div className="py-3 border-2 border-transparent rounded-xl bg-slate-50 peer-checked:bg-blue-100 peer-checked:text-blue-800 peer-checked:border-blue-200 hover:bg-slate-100 text-sm font-bold transition-all">OD (Kanan)</div></label>
                        <label className="flex-1 text-center cursor-pointer"><input type="radio" name="lat" className="hidden peer" value="OS" /><div className="py-3 border-2 border-transparent rounded-xl bg-slate-50 peer-checked:bg-emerald-100 peer-checked:text-emerald-800 peer-checked:border-emerald-200 hover:bg-slate-100 text-sm font-bold transition-all">OS (Kiri)</div></label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card-modern">
                  <h4 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-3 pb-3 border-b border-slate-100"><History className="w-6 h-6 text-[#14b8a6]" /> Riwayat Pengobatan Sebelum Datang</h4>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="form-label-modern">Pengobatan Sendiri / Tradisional</label>
                      <div className="select-wrapper">
                        <select className="select-soft">
                          <option>Tidak Ada</option>
                          <option>Air Keran</option>
                          <option>Air Daun Sirih</option>
                          <option>Air Daun Telang</option>
                          <option>Air Kencing</option>
                          <option>Lainnya</option>
                        </select>
                        <ChevronDown className="select-arrow w-5 h-5" />
                      </div>
                    </div>

                    <div>
                      <label className="form-label-modern mb-3">Riwayat Obat-obatan</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {['Antibiotik', 'Steroid', 'Analgetik', 'Lainnya'].map((item) => (
                          <div key={item} className="bg-slate-50 p-4 rounded-xl border border-slate-100 transition-all hover:border-[#14b8a6] hover:bg-[#f0fdfa]">
                            <label className="flex items-center gap-3 cursor-pointer mb-2">
                              <input type="checkbox" className="accent-[#14b8a6] w-5 h-5 rounded" />
                              <span className="font-semibold text-sm text-slate-700">{item}</span>
                            </label>
                            <input type="text" className="input-minimal bg-white" placeholder={item === 'Lainnya' ? 'Sebutkan...' : 'Nama obat...'} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 text-right">
                  <button type="button" onClick={() => setStep(2)} className="bg-[#14b8a6] text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg hover:shadow-[#14b8a6]/30 hover:-translate-y-1 transition-all flex items-center gap-3 ml-auto">
                    Selanjutnya <ArrowLeft className="w-5 h-5 rotate-180" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: FISIK MATA */}
            {step === 2 && (
              <div className="animate-scale-in">
                <h3 className="text-xl font-bold text-slate-700 mb-6 border-l-8 border-[#14b8a6] pl-4 rounded-l-sm">Pemeriksaan Fisik</h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  {/* OD Column */}
                  <div className="eye-col">
                    <div className="eye-col-header bg-[#ccfbf1] text-[#0f766e]">OD (Mata Kanan)</div>
                    <div className="space-y-4">
                      <label className="field-label-sm text-[#14b8a6]">Visus (UCVA)</label>
                      <div className="grid grid-cols-2 gap-4 mb-2">
                        <input type="text" className="input-minimal bg-white" placeholder="Snellen 6/..." />
                        <input type="number" step="0.01" className="input-minimal bg-white" placeholder="Desimal" readOnly />
                      </div>
                      <label className="field-label-sm text-[#14b8a6]">Visus (BCVA)</label>
                      <div className="grid grid-cols-2 gap-4 mb-2">
                        <input type="text" className="input-minimal bg-white" placeholder="Snellen 6/..." />
                        <input type="number" step="0.01" className="input-minimal bg-white" placeholder="Desimal" readOnly />
                      </div>
                      <label className="field-label-sm text-[#14b8a6]">Tekanan (TIO)</label>
                      <div className="relative"><input type="number" className="input-minimal bg-white" placeholder="0" /><span className="absolute right-4 top-3.5 text-xs text-slate-400 font-bold">mmHg</span></div>
                      
                      <div className="pt-4 border-t border-slate-100 mt-4">
                        <div className="flex items-center justify-between mb-3 p-2 rounded-xl hover:bg-slate-50">
                          <span className="text-sm font-bold text-slate-600">Injeksi</span>
                          <div className="flex gap-3 text-sm"><label className="cursor-pointer flex items-center gap-1"><input type="radio" name="inj_od" className="accent-[#14b8a6]" /> Pos</label><label className="cursor-pointer flex items-center gap-1"><input type="radio" name="inj_od" className="accent-[#14b8a6]" /> Neg</label></div>
                        </div>
                        <div className="flex items-center justify-between mb-3 p-2 rounded-xl hover:bg-slate-50">
                          <span className="text-sm font-bold text-slate-600">Fluorescein / Seidel</span>
                          <div className="flex gap-3 text-sm"><label className="cursor-pointer flex items-center gap-1"><input type="radio" name="fl_od" className="accent-[#14b8a6]" /> Pos</label><label className="cursor-pointer flex items-center gap-1"><input type="radio" name="fl_od" className="accent-[#14b8a6]" /> Neg</label></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* OS Column */}
                  <div className="eye-col">
                    <div className="eye-col-header bg-emerald-100 text-emerald-800">OS (Mata Kiri)</div>
                    <div className="space-y-4">
                      <label className="field-label-sm text-emerald-600">Visus (UCVA)</label>
                      <div className="grid grid-cols-2 gap-4 mb-2">
                        <input type="text" className="input-minimal bg-white" placeholder="Snellen 6/..." />
                        <input type="number" step="0.01" className="input-minimal bg-white" placeholder="Desimal" readOnly />
                      </div>
                      <label className="field-label-sm text-emerald-600">Visus (BCVA)</label>
                      <div className="grid grid-cols-2 gap-4 mb-2">
                        <input type="text" className="input-minimal bg-white" placeholder="Snellen 6/..." />
                        <input type="number" step="0.01" className="input-minimal bg-white" placeholder="Desimal" readOnly />
                      </div>
                      <label className="field-label-sm text-emerald-600">Tekanan (TIO)</label>
                      <div className="relative"><input type="number" className="input-minimal bg-white" placeholder="0" /><span className="absolute right-4 top-3.5 text-xs text-slate-400 font-bold">mmHg</span></div>
                      
                      <div className="pt-4 border-t border-slate-100 mt-4">
                        <div className="flex items-center justify-between mb-3 p-2 rounded-xl hover:bg-slate-50">
                          <span className="text-sm font-bold text-slate-600">Injeksi</span>
                          <div className="flex gap-3 text-sm"><label className="cursor-pointer flex items-center gap-1"><input type="radio" name="inj_os" className="accent-emerald-600" /> Pos</label><label className="cursor-pointer flex items-center gap-1"><input type="radio" name="inj_os" className="accent-emerald-600" /> Neg</label></div>
                        </div>
                        <div className="flex items-center justify-between mb-3 p-2 rounded-xl hover:bg-slate-50">
                          <span className="text-sm font-bold text-slate-600">Fluorescein / Seidel</span>
                          <div className="flex gap-3 text-sm"><label className="cursor-pointer flex items-center gap-1"><input type="radio" name="fl_os" className="accent-emerald-600" /> Pos</label><label className="cursor-pointer flex items-center gap-1"><input type="radio" name="fl_os" className="accent-emerald-600" /> Neg</label></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card-modern">
                  <h4 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-3 pb-3 border-b border-slate-100"><ScanEye className="w-6 h-6 text-[#14b8a6]" /> Karakteristik Ulkus Kornea</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div>
                      <label className="form-label-modern">Dimensi Ukuran Defek (mm)</label>
                      <div className="flex items-center gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <div className="flex-1"><span className="text-xs text-slate-400 block text-center mb-2 font-bold tracking-wider">PANJANG</span><input type="number" step="0.1" className="input-minimal text-center font-bold text-xl bg-white" placeholder="0.0" /></div>
                        <span className="text-slate-300 font-bold text-2xl mt-6">×</span>
                        <div className="flex-1"><span className="text-xs text-slate-400 block text-center mb-2 font-bold tracking-wider">LEBAR</span><input type="number" step="0.1" className="input-minimal text-center font-bold text-xl bg-white" placeholder="0.0" /></div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-6 mt-6">
                        <div>
                          <label className="form-label-modern">Derajat Ukuran</label>
                          <div className="select-wrapper">
                            <select className="select-soft">
                              <option>Kecil (&lt; 2mm)</option>
                              <option>Sedang (2 - 6 mm)</option>
                              <option>Besar (&gt; 6 mm)</option>
                            </select>
                            <ChevronDown className="select-arrow w-5 h-5" />
                          </div>
                        </div>
                        <div>
                          <label className="form-label-modern">Kedalaman</label>
                          <div className="select-wrapper">
                            <select className="select-soft">
                              <option>&lt; 1/3 (Superfisial)</option>
                              <option>1/3 - 2/3 (Stromal)</option>
                              <option>&gt; 2/3 (Deep Stromal)</option>
                              <option>Perforasi / Descemetocele</option>
                            </select>
                            <ChevronDown className="select-arrow w-5 h-5" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <label className="form-label-modern">Severity (Keparahan)</label>
                        <div className="select-wrapper">
                          <select className="select-soft font-bold text-slate-700">
                            <option>Ringan</option>
                            <option>Sedang</option>
                            <option>Berat</option>
                          </select>
                          <ChevronDown className="select-arrow w-5 h-5" />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="form-label-modern text-center mb-4">Lokasi</label>
                      <div className="grid grid-cols-3 gap-4">
                        <label className="cursor-pointer group"><input type="radio" name="loc" className="loc-selector-input hidden" value="central" /><div className="loc-selector-label group-hover:bg-white group-hover:shadow-sm"><div className="w-8 h-8 rounded-full border-[6px] border-current mx-auto mb-2 opacity-70"></div><span className="text-xs font-bold">Sentral</span></div></label>
                        <label className="cursor-pointer group"><input type="radio" name="loc" className="loc-selector-input hidden" value="paracentral" /><div className="loc-selector-label group-hover:bg-white group-hover:shadow-sm"><div className="w-8 h-8 rounded-full border-4 border-current mx-auto mb-2 opacity-70"></div><span className="text-xs font-bold">Parasentral</span></div></label>
                        <label className="cursor-pointer group"><input type="radio" name="loc" className="loc-selector-input hidden" value="peripheral" /><div className="loc-selector-label group-hover:bg-white group-hover:shadow-sm"><div className="w-8 h-8 rounded-full border-2 border-current mx-auto mb-2 opacity-70"></div><span className="text-xs font-bold">Perifer</span></div></label>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-6 mt-6">
                        <div>
                          <label className="form-label-modern">AC Reaction</label>
                          <div className="select-wrapper">
                            <select className="select-soft">
                              <option>Tenang (0)</option>
                              <option>Trace (0.5+)</option>
                              <option>+1</option>
                              <option>+2</option>
                              <option>+3</option>
                              <option>+4 (Fibrin/Hipopion)</option>
                            </select>
                            <ChevronDown className="select-arrow w-5 h-5" />
                          </div>
                        </div>
                        <div>
                          <label className="form-label-modern">Purulensi</label>
                          <div className="select-wrapper">
                            <select className="select-soft">
                              <option>Tidak Ada</option>
                              <option>Ringan (Sekret)</option>
                              <option>Signifikan</option>
                            </select>
                            <ChevronDown className="select-arrow w-5 h-5" />
                          </div>
                        </div>
                      </div>

                      <div className="mt-6">
                        <label className="form-label-modern">Hipopion</label>
                        <div className="flex gap-4">
                          <div className="select-wrapper w-1/2">
                            <select className="select-soft">
                              <option>Tidak Ada</option>
                              <option>Ada</option>
                            </select>
                            <ChevronDown className="select-arrow w-5 h-5" />
                          </div>
                          <input type="number" step="0.1" className="input-minimal w-1/2 hidden" placeholder="Tinggi (mm)" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card-modern">
                  <h4 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-3 pb-3 border-b border-slate-100"><Camera className="w-6 h-6 text-[#14b8a6]" /> Foto Klinis (Slit Lamp)</h4>
                  
                  <div className="bg-red-50 text-red-800 border border-red-100 p-3 rounded-xl mb-4 text-xs flex items-center gap-2 mx-auto max-w-md justify-center font-semibold">
                    <AlertTriangle className="w-4 h-4 shrink-0" /><span>PERINGATAN: Maksimal 10MB per file.</span>
                  </div>
                  <label className="file-drop-area bg-white shadow-sm border-slate-200">
                    <input type="file" multiple accept="image/*" className="hidden" />
                    <Camera className="w-10 h-10 text-[#14b8a6] mb-3" /><span className="text-sm text-slate-500 font-medium">Klik untuk upload foto (Bisa pilih banyak)</span>
                  </label>
                </div>

                <div className="flex justify-between pt-6 border-t border-slate-100">
                  <button type="button" onClick={() => setStep(1)} className="text-slate-500 font-bold hover:text-slate-800 px-6">Kembali</button>
                  <button type="button" onClick={() => setStep(3)} className="bg-[#14b8a6] text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg hover:shadow-[#14b8a6]/30 hover:-translate-y-1 transition-all">Selanjutnya</button>
                </div>
              </div>
            )}

            {/* STEP 3: MIKROBIOLOGI */}
            {step === 3 && (
              <div className="animate-scale-in">
                <h3 className="text-xl font-bold text-slate-700 mb-6 border-l-8 border-[#14b8a6] pl-4 rounded-l-sm">Hasil Mikrobiologi</h3>

                <div className="mb-8">
                  <label className="form-label-modern required">Etiologi (Penyebab Utama)</label>
                  <div className="select-wrapper">
                    <select id="input_etiologi" className="select-soft font-bold text-slate-700" defaultValue="">
                      <option value="" disabled>Pilih Etiologi...</option>
                      <option>Bakterial</option>
                      <option>Jamur (Fungal)</option>
                      <option>Viral (Herpes Simplex/Zoster)</option>
                      <option>Parasit (Acanthamoeba)</option>
                      <option>Autoimun / Steril (Mooren/PUK)</option>
                      <option>Neurotropik</option>
                      <option>Lainnya</option>
                    </select>
                    <ChevronDown className="select-arrow w-5 h-5" />
                  </div>
                </div>

                {/* Pewarnaan & Kultur Accordion */}
                <div className="mb-6">
                  <div onClick={() => toggleLab('lab1')} className="bg-white border border-slate-100 p-5 rounded-2xl cursor-pointer hover:shadow-soft transition-all flex items-center gap-5 group">
                    <div className="w-12 h-12 rounded-full bg-blue-50 text-[#14b8a6] flex items-center justify-center border border-blue-100 group-hover:bg-[#14b8a6] group-hover:text-white transition-colors"><Microscope className="w-6 h-6" /></div>
                    <div className="flex-1"><h4 className="font-bold text-slate-700 text-lg">Pewarnaan & Kultur</h4><p className="text-sm text-slate-400 mt-1">Gram, KOH, Kultur Scraping</p></div><ChevronDown className={`w-6 h-6 text-slate-300 transition-transform duration-300 transform ${labSections.lab1 ? 'rotate-180' : ''}`} />
                  </div>
                  {labSections.lab1 && (
                    <div className="mt-3 pl-6 pr-6 pb-6 bg-slate-50 border-l-4 border-[#14b8a6] ml-8 rounded-r-2xl animate-scale-in">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                        <div>
                          <label className="form-label-modern">Pewarnaan Gram (Bakteri)</label>
                          <div className="select-wrapper mb-3">
                            <select className="select-soft">
                              <option>Tidak Dilakukan</option>
                              <option>Negatif</option>
                              <option>Positif</option>
                            </select>
                            <ChevronDown className="select-arrow w-5 h-5" />
                          </div>
                        </div>
                        <div>
                          <label className="form-label-modern">Pewarnaan KOH (Jamur)</label>
                          <div className="select-wrapper mb-3">
                            <select className="select-soft">
                              <option>Tidak Dilakukan</option>
                              <option>Negatif</option>
                              <option>Positif</option>
                            </select>
                            <ChevronDown className="select-arrow w-5 h-5" />
                          </div>
                        </div>
                        <div className="md:col-span-2">
                          <label className="form-label-modern">Hasil Kultur</label>
                          <div className="select-wrapper">
                            <select className="select-soft">
                              <option>Tidak Ditemukan Mikroorganisme</option>
                              <option>Staphylococcus aureus</option>
                              <option>Staphylococcus epidermidis</option>
                              <option>Pseudomonas aeruginosa</option>
                              <option>Streptococcus pneumoniae</option>
                              <option>Fusarium sp</option>
                              <option>Aspergillus sp</option>
                              <option>Candida sp</option>
                              <option>Acinetobacter sp</option>
                              <option>Klebsiella pneumoniae</option>
                              <option>Lainnya (Free text)</option>
                            </select>
                            <ChevronDown className="select-arrow w-5 h-5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Sensitivitas Obat Accordion */}
                <div className="mb-6">
                  <div onClick={() => toggleLab('lab2')} className="bg-white border border-slate-100 p-5 rounded-2xl cursor-pointer hover:shadow-soft transition-all flex items-center gap-5 group">
                    <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center border border-purple-100 group-hover:bg-purple-500 group-hover:text-white transition-colors"><Pill className="w-6 h-6" /></div>
                    <div className="flex-1"><h4 className="font-bold text-slate-700 text-lg">Sensitivitas Antibiotik</h4><p className="text-sm text-slate-400 mt-1">Uji Resistensi Obat</p></div><ChevronDown className={`w-6 h-6 text-slate-300 transition-transform duration-300 transform ${labSections.lab2 ? 'rotate-180' : ''}`} />
                  </div>
                  {labSections.lab2 && (
                    <div className="mt-3 pl-6 pr-6 pb-6 bg-slate-50 border-l-4 border-purple-400 ml-8 rounded-r-2xl animate-scale-in">
                      <div className="overflow-x-auto border rounded-xl border-slate-200 max-h-96 overflow-y-auto mt-4 scrollbar-thin scrollbar-thumb-slate-300">
                        <table className="sensi-table w-full">
                          <thead className="sticky top-0 z-10 shadow-sm">
                            <tr>
                              <th className="text-left w-1/3 rounded-tl-lg">Antibiotik</th>
                              <th className="w-16 bg-green-50 text-green-700">S</th>
                              <th className="w-16 bg-yellow-50 text-yellow-700">I</th>
                              <th className="w-16 bg-red-50 text-red-700">R</th>
                              <th className="w-16 bg-slate-50 text-slate-500 rounded-tr-lg">N/A</th>
                            </tr>
                          </thead>
                          <tbody>
                            {antibiotics.map((ab, idx) => (
                              <tr key={idx}>
                                <td className="sensi-label">{ab}</td>
                                <td><div className="radio-cell"><input type="radio" name={`sensi_${idx}`} value="S" /></div></td>
                                <td><div className="radio-cell"><input type="radio" name={`sensi_${idx}`} value="I" /></div></td>
                                <td><div className="radio-cell"><input type="radio" name={`sensi_${idx}`} value="R" /></div></td>
                                <td><div className="radio-cell"><input type="radio" name={`sensi_${idx}`} value="NA" defaultChecked /></div></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <p className="text-xs text-slate-400 mt-3 italic">* S: Sensitif, I: Intermediet, R: Resisten, N/A: Tidak Diuji</p>
                    </div>
                  )}
                </div>

                {/* Pemeriksaan Penunjang Sistemik Accordion */}
                <div className="mb-6">
                  <div onClick={() => toggleLab('lab3')} className="bg-white border border-slate-100 p-5 rounded-2xl cursor-pointer hover:shadow-soft transition-all flex items-center gap-5 group">
                    <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center border border-orange-100 group-hover:bg-orange-500 group-hover:text-white transition-colors"><Activity className="w-6 h-6" /></div>
                    <div className="flex-1"><h4 className="font-bold text-slate-700 text-lg">Pemeriksaan Penunjang (Sistemik & Lainnya)</h4><p className="text-sm text-slate-400 mt-1">Lab Darah, Radiologi, dll</p></div><ChevronDown className={`w-6 h-6 text-slate-300 transition-transform duration-300 transform ${labSections.lab3 ? 'rotate-180' : ''}`} />
                  </div>
                  {labSections.lab3 && (
                    <div className="mt-3 pl-6 pr-6 pb-6 bg-slate-50 border-l-4 border-orange-400 ml-8 rounded-r-2xl animate-scale-in">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
                        <label className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 hover:border-orange-200 transition-colors"><input type="checkbox" className="accent-orange-500 w-5 h-5 rounded" /> Darah Lengkap</label>
                        <label className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 hover:border-orange-200 transition-colors"><input type="checkbox" className="accent-orange-500 w-5 h-5 rounded" /> Mantoux TB</label>
                        <label className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 hover:border-orange-200 transition-colors"><input type="checkbox" className="accent-orange-500 w-5 h-5 rounded" /> HIV / AIDS</label>
                        <label className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 hover:border-orange-200 transition-colors"><input type="checkbox" className="accent-orange-500 w-5 h-5 rounded" /> HBsAg (Hepatitis B)</label>
                        <label className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 hover:border-orange-200 transition-colors"><input type="checkbox" className="accent-orange-500 w-5 h-5 rounded" /> Sifilis (VDRL/TPHA)</label>
                        <label className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 hover:border-orange-200 transition-colors"><input type="checkbox" className="accent-orange-500 w-5 h-5 rounded" /> Panel Autoimun (ANA/Anti-dsDNA)</label>
                        <label className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 hover:border-orange-200 transition-colors"><input type="checkbox" className="accent-orange-500 w-5 h-5 rounded" /> Urinalisis</label>
                        <label className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 hover:border-orange-200 transition-colors"><input type="checkbox" className="accent-orange-500 w-5 h-5 rounded" /> Radiologis (Thorax X-Ray)</label>
                        <div className="md:col-span-2">
                          <label className="form-label-modern">Lainnya</label>
                          <input type="text" className="input-minimal" placeholder="Tulis pemeriksaan lain..." />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-between pt-6 border-t border-slate-100">
                  <button type="button" onClick={() => setStep(2)} className="text-slate-500 font-bold hover:text-slate-800 px-6">Kembali</button>
                  <button type="button" onClick={() => setStep(4)} className="bg-[#14b8a6] text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg hover:shadow-[#14b8a6]/30 hover:-translate-y-1 transition-all">Selanjutnya</button>
                </div>
              </div>
            )}

            {/* STEP 4: TERAPI */}
            {step === 4 && (
              <div className="animate-scale-in">
                <h3 className="text-xl font-bold text-slate-700 mb-6 border-l-8 border-[#14b8a6] pl-4 rounded-l-sm">Tatalaksana & Terapi</h3>
                
                <div className="card-modern">
                  <h4 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-3 pb-3 border-b border-slate-100"><Stethoscope className="w-6 h-6 text-[#14b8a6]" /> Daftar Obat & Tindakan</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="md:col-span-2 bg-care-50 p-6 rounded-2xl border border-care-100" style={{ backgroundColor: '#f0fdfa', borderColor: '#ccfbf1' }}>
                      <label className="form-label-modern text-[#14b8a6]">Antibiotik Topikal</label>
                      <div className="select-wrapper mb-4">
                        <select className="select-soft bg-white">
                          <option>Tidak Diberikan</option><option>Tunggal</option><option>Kombinasi</option><option>Fortified</option>
                        </select>
                        <ChevronDown className="select-arrow w-5 h-5" />
                      </div>
                    </div>

                    <div>
                      <label className="form-label-modern">Antijamur (Antifungal)</label>
                      <input type="text" className="input-minimal" placeholder="Natamycin, Fluconazole, dll..." />
                    </div>
                    <div>
                      <label className="form-label-modern">Antiviral</label>
                      <input type="text" className="input-minimal" placeholder="Acyclovir, Ganciclovir, dll..." />
                    </div>
                    <div>
                      <label className="form-label-modern">Antiparasit</label>
                      <input type="text" className="input-minimal" placeholder="PHMB, Chlorhexidine, dll..." />
                    </div>
                    <div>
                      <label className="form-label-modern">Adjuvan / Sikloplegik</label>
                      <input type="text" className="input-minimal" placeholder="Atropine, Homatropine, dll..." />
                    </div>
                    <div>
                      <label className="form-label-modern">NSAID / Anti Nyeri</label>
                      <input type="text" className="input-minimal" placeholder="Natrium Diklofenak, Asam Mefenamat..." />
                    </div>
                    <div>
                      <label className="form-label-modern">Steroid</label>
                      <input type="text" className="input-minimal" placeholder="Dexamethasone, Prednisolone (Jika ada)..." />
                    </div>
                    <div className="md:col-span-2">
                      <label className="form-label-modern">Terapi Lainnya</label>
                      <input type="text" className="input-minimal" placeholder="Serum Autologus, Vitamin C, dll..." />
                    </div>

                    <div className="md:col-span-2 mt-4 pt-6 border-t border-slate-100">
                      <label className="form-label-modern">Tindakan Operatif</label>
                      <div className="select-wrapper">
                        <select className="select-soft font-bold text-slate-700">
                          <option>Tidak Ada</option><option>Keratoplasti (KPL)</option><option>Amniotic Membrane (AMT)</option><option>Flap Konjungtiva</option><option>Eviserasi / Enukleasi</option>
                        </select>
                        <ChevronDown className="select-arrow w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-6 border-t border-slate-100">
                  <button type="button" onClick={() => setStep(3)} className="text-slate-500 font-bold hover:text-slate-800 px-6">Kembali</button>
                  <button type="submit" className="bg-emerald-600 text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-1 transition-all flex items-center gap-3">
                    <Save className="w-5 h-5" /> Simpan Data Registry
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )}
</div>
);
}
