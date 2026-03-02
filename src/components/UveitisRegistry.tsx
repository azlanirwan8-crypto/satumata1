import React, { useState, useEffect } from 'react';
import { ArrowLeft, Eye, Check, ChevronDown, ScanEye, UploadCloud, Film, Link as LinkIcon, AlertCircle, Info, Trash2, Zap, RefreshCw, Clock, TestTube, Microscope, FlaskConical, Pill, Droplet, CalendarCheck, CheckCircle, XCircle, Plus, UserX, HeartOff, MapPinOff, Edit3 } from 'lucide-react';

interface UveitisRegistryProps {
  onBack: () => void;
}

export default function UveitisRegistry({ onBack }: UveitisRegistryProps) {
  const [activeView, setActiveView] = useState<'dashboard' | 'form'>('dashboard');
  const [currentStep, setCurrentStep] = useState(1);
  const [activeVisitIndex, setActiveVisitIndex] = useState<number | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSkipModal, setShowSkipModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [confirmVisitData, setConfirmVisitData] = useState<any>(null);
  const [skipReason, setSkipReason] = useState('');
  const [otherReason, setOtherReason] = useState('');
  
  const VISIT_SCHEDULE = [
    { index: 1, label: "Kunjungan 1 (Baseline)", range: "0 - 3 Bulan" },
    { index: 2, label: "Kunjungan 2", range: "4 - 7 Bulan" },
    { index: 3, label: "Kunjungan 3", range: "8 - 12 Bulan" },
    { index: 4, label: "Kunjungan 4", range: "12 - 18 Bulan" },
    { index: 5, label: "Kunjungan 5", range: "18 - 24 Bulan" },
    { index: 6, label: "Kunjungan 6", range: "Tahun Ke-3" },
    { index: 7, label: "Kunjungan 7", range: "Tahun Ke-4" },
    { index: 8, label: "Kunjungan 8", range: "Tahun Ke-5" }
  ];

  const [registryData, setRegistryData] = useState<any[]>([]);

  const goToForm = (index: number) => {
    setActiveVisitIndex(index);
    setActiveView('form');
    setCurrentStep(1);
    window.scrollTo(0, 0);
  };

  const handleConfirmVisit = (isVisited: boolean) => {
    setShowConfirmModal(false);
    if (isVisited) {
      goToForm(confirmVisitData.index);
    } else {
      setSkipReason('');
      setOtherReason('');
      setShowSkipModal(true);
    }
  };

  const submitSkipReason = () => {
    if (!skipReason) {
      alert("Mohon pilih alasan terlebih dahulu.");
      return;
    }
    let finalReason = skipReason;
    if (skipReason === 'Lainnya') {
      if (!otherReason.trim()) {
        alert("Mohon tuliskan alasan spesifik.");
        return;
      }
      finalReason = otherReason;
    }

    const newData = [...registryData];
    const existingIndex = newData.findIndex(d => d.visitIndex === confirmVisitData.index);
    const entryData = { visitIndex: confirmVisitData.index, status: 'skipped', reason: finalReason, visitDate: new Date() };
    
    if (existingIndex !== -1) newData[existingIndex] = entryData;
    else newData.push(entryData);

    setRegistryData(newData);
    setShowSkipModal(false);
  };

  const saveForm = () => {
    setShowSuccessModal(true);
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    if (activeVisitIndex !== null) {
      const newData = [...registryData];
      const existingIndex = newData.findIndex(d => d.visitIndex === activeVisitIndex);
      const entryData = { visitIndex: activeVisitIndex, status: 'filled', reason: '', visitDate: new Date() };
      if (existingIndex !== -1) newData[existingIndex] = entryData;
      else newData.push(entryData);
      setRegistryData(newData);
    }
    setActiveView('dashboard');
    window.scrollTo(0, 0);
  };

  return (
    <div className="h-full w-full bg-slate-50 font-sans text-slate-700 flex flex-col">
      {activeView === 'dashboard' && (
        <div className="w-full h-full flex flex-col animate-fade-in">
          <div className="bg-white flex flex-col h-full overflow-hidden">
            <div className="bg-white px-8 py-6 border-b border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0 z-10 shadow-sm">
              <div className="flex items-center gap-5 w-full">
                <button onClick={onBack} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-600 transition-colors mr-2">
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="bg-care-50 p-4 rounded-2xl text-accent shadow-sm border border-care-100 shrink-0">
                  <Eye className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Riwayat Kunjungan</h1>
                  <p className="text-sm text-slate-500 font-medium mt-1">Registry Uveitis - Pasien NRM: <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700">123456</span></p>
                </div>
              </div>
            </div>
            
            <div className="p-6 md:p-10 bg-slate-50 flex-1 overflow-y-auto">
              <div className="w-full">
                {VISIT_SCHEDULE.map(schedule => {
                  const visitData = registryData.find(d => d.visitIndex === schedule.index);
                  const isFilled = visitData?.status === 'filled';
                  const isSkipped = visitData?.status === 'skipped';
                  
                  let cardClass = 'empty bg-white border border-slate-200';
                  if (isFilled) cardClass = 'filled bg-care-50 border border-care-200';
                  else if (isSkipped) cardClass = 'skipped bg-red-50 border border-red-200';

                  return (
                    <div key={schedule.index} className={`visit-card p-6 rounded-[24px] mb-5 flex flex-col md:flex-row justify-between md:items-center gap-6 group shadow-sm hover:shadow-md transition-all ${cardClass}`}>
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className={`text-lg font-bold ${isFilled ? 'text-care-800' : isSkipped ? 'text-red-900' : 'text-slate-700'}`}>
                            {schedule.label} <span className="text-sm font-normal opacity-60 ml-1 bg-slate-100 px-2 py-0.5 rounded-lg">({schedule.range})</span>
                          </h3>
                          {isFilled && <CheckCircle className="w-6 h-6 text-accent" />}
                          {isSkipped && <XCircle className="w-6 h-6 text-red-400" />}
                        </div>
                        <p className={`text-sm mt-2 pl-1 ${isFilled ? 'text-care-700 font-medium' : isSkipped ? 'text-red-800' : 'text-slate-400 italic'}`}>
                          {isFilled ? new Date(visitData.visitDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 
                           isSkipped ? <span>Kunjungan Dilewati <br/><span className="text-xs text-red-500 font-medium">Alasan: {visitData.reason}</span></span> : 
                           'Belum ada kunjungan'}
                        </p>
                      </div>
                      <div>
                        {isFilled ? (
                          <button onClick={() => goToForm(schedule.index)} className="px-5 py-2.5 rounded-xl bg-white border border-care-200 text-accent font-bold hover:bg-care-50 transition-colors flex items-center gap-2 text-sm shadow-sm hover:shadow-md">
                            <Edit3 className="w-4 h-4" /> Edit Data &rsaquo;
                          </button>
                        ) : isSkipped ? (
                          <button onClick={() => { setConfirmVisitData(schedule); setShowConfirmModal(true); }} className="px-5 py-2.5 rounded-xl bg-white border border-red-200 text-red-500 font-bold hover:bg-red-50 transition-colors flex items-center gap-2 text-sm shadow-sm hover:shadow-md">
                            <Plus className="w-4 h-4" /> Coba Tambah Data Lagi &rsaquo;
                          </button>
                        ) : (
                          <button onClick={() => { setConfirmVisitData(schedule); setShowConfirmModal(true); }} className="px-5 py-2.5 rounded-xl bg-care-50 text-accent font-bold hover:bg-care-100 transition-colors flex items-center gap-2 text-sm shadow-sm hover:shadow-md">
                            <Plus className="w-4 h-4" /> Tambah Data &rsaquo;
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeView === 'form' && (
        <div className="w-full h-full flex flex-col animate-fade-in">
          <div className="bg-white flex flex-col h-full overflow-hidden">
            <div className="bg-white px-8 py-6 border-b border-slate-200 flex justify-between items-center shrink-0 z-20 shadow-sm">
              <div className="flex items-center gap-4 w-full">
                <button onClick={() => setActiveView('dashboard')} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-600 transition-colors mr-2">
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="bg-care-50 p-3 rounded-2xl text-accent shadow-sm border border-care-100 shrink-0">
                  <Eye className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Input Data Registry</h1>
                  <p className="text-sm text-slate-500 font-medium">Modul Data Klinis & Penunjang - <span className="text-accent font-bold bg-care-50 px-2 py-0.5 rounded-lg">{VISIT_SCHEDULE.find(s => s.index === activeVisitIndex)?.label}</span></p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-slate-50">
              <div className="bg-slate-50 px-4 md:px-8 py-8 border-b border-slate-100 overflow-x-auto sticky top-0 z-10 shadow-sm">
                <div className="flex items-center justify-between max-w-4xl mx-auto relative min-w-[500px]">
                  <div className="absolute top-6 left-0 w-full h-1.5 bg-slate-200 -z-0 rounded-full"></div>
                  {[
                    { step: 1, label: 'Klinis' },
                    { step: 2, label: 'Pencitraan' },
                    { step: 3, label: 'Diagnosis' },
                    { step: 4, label: 'Lab' },
                    { step: 5, label: 'Terapi' }
                  ].map((s) => (
                    <div key={s.step} className={`flex flex-col items-center relative z-10 cursor-pointer group ${currentStep === s.step ? 'step-active' : currentStep > s.step ? 'step-completed' : ''}`} onClick={() => setCurrentStep(s.step)}>
                      <div className="step-circle group-hover:ring-4 ring-care-100 transition-all">
                        {currentStep > s.step ? <Check className="w-5 h-5" /> : s.step}
                      </div>
                      <span className={`text-xs font-bold mt-3 uppercase tracking-wide ${currentStep === s.step ? 'text-accent' : 'text-gray-400'}`}>{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <form className="p-6 md:p-10 max-w-5xl mx-auto" onSubmit={(e) => { e.preventDefault(); saveForm(); }}>
            {currentStep === 1 && (
              <div className="animate-scale-in">
                {/* Form Step 1 Content */}
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-bold text-slate-700 border-l-8 border-accent pl-4 rounded-l-sm">Pemeriksaan Awal</h3>
                  <div className="text-sm text-accent bg-care-50 px-4 py-2 rounded-xl border border-care-100">Tgl: <span className="font-bold">{new Date().toLocaleDateString('id-ID')}</span></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                  <div>
                    <label className="form-label-modern required">Tanggal Pemeriksaan</label>
                    <input type="date" className="input-minimal" defaultValue={new Date().toISOString().split('T')[0]} />
                  </div>
                  <div>
                    <label className="form-label-modern">Tanggal Kunjungan Pertama</label>
                    <input type="date" className="input-minimal" />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="form-label-modern required">Unit / Poli</label>
                  <div className="select-wrapper">
                    <select className="select-soft" defaultValue="">
                      <option value="" disabled>Pilih Unit...</option>
                      <option>Infeksi dan Imunologi</option>
                      <option>Vitreoretina</option>
                      <option>Glaukoma</option>
                      <option>Umum</option>
                    </select>
                    <ChevronDown className="select-arrow w-5 h-5" />
                  </div>
                </div>

                <div className="mb-10">
                  <label className="form-label-modern required">Diagnosis Okular Inisial</label>
                  <textarea className="textarea-minimal" rows={2} placeholder="Diagnosis awal (Free text)..."></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                  <div className="card-modern !mb-0 !p-6 bg-slate-50 border-0 shadow-inner">
                    <div className="card-header-modern">OD (Mata Kanan)</div>
                    <label className="field-label-sm text-accent">Visus Dasar (UCVA)</label>
                    <div className="grid grid-cols-2 gap-4 mb-5">
                      <input type="text" className="input-minimal bg-white" placeholder="Snellen 6/..." />
                      <input type="number" step="0.01" className="input-minimal bg-white" placeholder="Desimal" readOnly />
                    </div>
                    <label className="field-label-sm text-accent">Visus Koreksi (BCVA)</label>
                    <div className="grid grid-cols-2 gap-4 mb-5">
                      <input type="text" className="input-minimal bg-white" placeholder="Snellen 6/..." />
                      <input type="number" step="0.01" className="input-minimal bg-white" placeholder="Desimal" readOnly />
                    </div>
                    <label className="field-label-sm text-accent">Tekanan (TIO)</label>
                    <div className="relative"><input type="number" className="input-minimal bg-white" placeholder="0" /><span className="absolute right-4 top-3.5 text-xs text-slate-400 font-bold">mmHg</span></div>
                  </div>
                  
                  <div className="card-modern !mb-0 !p-6 bg-slate-50 border-0 shadow-inner">
                    <div className="card-header-modern">OS (Mata Kiri)</div>
                    <label className="field-label-sm text-accent">Visus Dasar (UCVA)</label>
                    <div className="grid grid-cols-2 gap-4 mb-5">
                      <input type="text" className="input-minimal bg-white" placeholder="Snellen 6/..." />
                      <input type="number" step="0.01" className="input-minimal bg-white" placeholder="Desimal" readOnly />
                    </div>
                    <label className="field-label-sm text-accent">Visus Koreksi (BCVA)</label>
                    <div className="grid grid-cols-2 gap-4 mb-5">
                      <input type="text" className="input-minimal bg-white" placeholder="Snellen 6/..." />
                      <input type="number" step="0.01" className="input-minimal bg-white" placeholder="Desimal" readOnly />
                    </div>
                    <label className="field-label-sm text-accent">Tekanan (TIO)</label>
                    <div className="relative"><input type="number" className="input-minimal bg-white" placeholder="0" /><span className="absolute right-4 top-3.5 text-xs text-slate-400 font-bold">mmHg</span></div>
                  </div>
                </div>

                <div className="mt-10 text-right">
                  <button type="button" onClick={() => setCurrentStep(2)} className="bg-accent text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg hover:shadow-care-500/30 hover:-translate-y-1 transition-all flex items-center gap-3 ml-auto">
                    Selanjutnya <ArrowLeft className="w-5 h-5 rotate-180" />
                  </button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="animate-scale-in">
                <h3 className="text-xl font-bold text-slate-700 mb-6 border-l-8 border-accent pl-4 rounded-l-sm">Dokumen Pencitraan</h3>
                <div className="bg-care-50 text-care-800 text-xs p-4 rounded-2xl mb-6 flex items-center gap-3 border border-care-100">
                  <Info className="w-5 h-5" />
                  <span>Tersedia: OCT, Humphrey, Foto Thorax, OPTOS, FFA.</span>
                </div>

                <div className="card-modern mb-8">
                  <div className="card-header-modern">Pemeriksaan Tambahan (OPTOS & FFA)</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-2xl bg-slate-50">
                      <span className="font-bold text-slate-700 text-sm">OPTOS</span>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="radio" name="optos_check" value="yes" className="accent-accent" /> Ya</label>
                        <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="radio" name="optos_check" value="no" defaultChecked className="accent-accent" /> Tidak</label>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-2xl bg-slate-50">
                      <span className="font-bold text-slate-700 text-sm">FFA (Fluorescein Angiography)</span>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="radio" name="ffa_check" value="yes" className="accent-accent" /> Ya</label>
                        <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="radio" name="ffa_check" value="no" defaultChecked className="accent-accent" /> Tidak</label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-6 border-t border-slate-100">
                  <button type="button" onClick={() => setCurrentStep(1)} className="text-slate-500 font-bold hover:text-slate-800 px-6">Kembali</button>
                  <button type="button" onClick={() => setCurrentStep(3)} className="bg-accent text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg hover:shadow-care-500/30 hover:-translate-y-1 transition-all">Selanjutnya</button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="animate-scale-in">
                <h3 className="text-xl font-bold text-slate-700 mb-6 border-l-8 border-accent pl-4 rounded-l-sm">Diagnosis & Klasifikasi</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div className="card-modern">
                    <div className="card-header-modern">Mata Kanan (OD)</div>
                    <div className="select-wrapper mb-4">
                      <label className="form-label-modern">Lokasi anatomi</label>
                      <select className="select-soft" defaultValue="">
                        <option value="" disabled>Pilih Diagnosis...</option>
                        <option>Anterior Uveitis</option>
                        <option>Intermediate Uveitis</option>
                        <option>Posterior Uveitis</option>
                        <option>Anterior et Intermediate</option>
                        <option>Panuveitis</option>
                        <option>Sclerouveitis</option>
                      </select>
                      <ChevronDown className="select-arrow w-5 h-5" />
                    </div>
                  </div>
                  <div className="card-modern">
                    <div className="card-header-modern">Mata Kiri (OS)</div>
                    <div className="select-wrapper mb-4">
                      <label className="form-label-modern">Lokasi anatomi</label>
                      <select className="select-soft" defaultValue="">
                        <option value="" disabled>Pilih Diagnosis...</option>
                        <option>Anterior Uveitis</option>
                        <option>Intermediate Uveitis</option>
                        <option>Posterior Uveitis</option>
                        <option>Anterior et Intermediate</option>
                        <option>Panuveitis</option>
                        <option>Sclerouveitis</option>
                      </select>
                      <ChevronDown className="select-arrow w-5 h-5" />
                    </div>
                  </div>
                </div>

                <div className="card-modern">
                  <label className="form-label-modern mb-4">Course (Perjalanan Penyakit)</label>
                  <div className="selection-card-group mb-8">
                    <div>
                      <input type="radio" name="course" id="course_acute" className="selection-card-input" value="acute" />
                      <label htmlFor="course_acute" className="selection-card-label"><Zap className="w-8 h-8 mb-3 text-care-300 group-checked:text-accent" /> Acute</label>
                    </div>
                    <div>
                      <input type="radio" name="course" id="course_recurrent" className="selection-card-input" value="recurrent" />
                      <label htmlFor="course_recurrent" className="selection-card-label"><RefreshCw className="w-8 h-8 mb-3 text-care-300 group-checked:text-accent" /> Recurrent</label>
                    </div>
                    <div>
                      <input type="radio" name="course" id="course_chronic" className="selection-card-input" value="chronic" />
                      <label htmlFor="course_chronic" className="selection-card-label"><Clock className="w-8 h-8 mb-3 text-care-300 group-checked:text-accent" /> Chronic</label>
                    </div>
                  </div>
                  <label className="form-label-modern required">Diagnosis Lengkap</label>
                  <textarea className="textarea-minimal h-32" placeholder="Tulis diagnosis lengkap..."></textarea>
                </div>

                <div className="flex justify-between pt-6 border-t border-slate-100">
                  <button type="button" onClick={() => setCurrentStep(2)} className="text-slate-500 font-bold hover:text-slate-800 px-6">Kembali</button>
                  <button type="button" onClick={() => setCurrentStep(4)} className="bg-accent text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg hover:shadow-care-500/30 hover:-translate-y-1 transition-all">Selanjutnya</button>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="animate-scale-in">
                <h3 className="text-xl font-bold text-slate-700 mb-6 border-l-8 border-accent pl-4 rounded-l-sm">Pemeriksaan Laboratorium</h3>
                <p className="text-sm text-slate-500 mb-8 bg-slate-100 p-3 rounded-xl inline-block">Isi hasil laboratorium sesuai lini pemeriksaan yang dilakukan.</p>
                <div className="flex justify-between pt-6 border-t border-slate-100">
                  <button type="button" onClick={() => setCurrentStep(3)} className="text-slate-500 font-bold hover:text-slate-800 px-6">Kembali</button>
                  <button type="button" onClick={() => setCurrentStep(5)} className="bg-accent text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg hover:shadow-care-500/30 hover:-translate-y-1 transition-all">Selanjutnya</button>
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="animate-scale-in">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-bold text-slate-700 border-l-8 border-accent pl-4 rounded-l-sm">Tatalaksana & Komplikasi</h3>
                </div>
                <div className="flex justify-between pt-6 border-t border-slate-100">
                  <button type="button" onClick={() => setCurrentStep(4)} className="text-slate-500 font-bold hover:text-slate-800 px-6">Kembali</button>
                  <button type="submit" className="bg-emerald-600 text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-1 transition-all flex items-center gap-3">
                    Simpan Data Registry
                  </button>
                </div>
              </div>
            )}
          </form>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-sm p-8 relative border border-slate-100">
            <div className="text-center mb-8">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-care-50 mb-5 border border-care-100">
                <CalendarCheck className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Konfirmasi Kunjungan</h3>
              <p className="text-slate-500 mt-2 text-sm leading-relaxed">Apakah pasien ini melakukan <strong>{confirmVisitData?.label}</strong> dalam rentang waktu <strong>{confirmVisitData?.range}</strong>?</p>
            </div>
            <div className="space-y-3">
              <button onClick={() => handleConfirmVisit(true)} className="w-full py-3.5 bg-accent text-white rounded-2xl font-bold hover:shadow-care-500/30 hover:-translate-y-0.5 shadow-lg transition-all flex items-center justify-center gap-2">
                <Check className="w-5 h-5" /> Ya, Lanjutkan
              </button>
              <button onClick={() => handleConfirmVisit(false)} className="w-full py-3.5 bg-red-50 text-red-500 border border-red-100 rounded-2xl font-bold hover:bg-red-100 transition-all flex items-center justify-center gap-2">
                <Clock className="w-5 h-5" /> Tidak Ada Kunjungan
              </button>
            </div>
          </div>
        </div>
      )}

      {showSkipModal && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-md p-8 relative">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-900">Alasan Tidak Ada Kunjungan</h3>
              <p className="text-slate-400 text-sm mt-1">Pilih alasan mengapa pasien tidak melakukan kunjungan ini.</p>
            </div>
            <div className="space-y-3 mb-8">
              {[
                { val: 'Lost to Follow Up', icon: <UserX className="w-5 h-5 text-slate-400" /> },
                { val: 'Pasien Meninggal Dunia', icon: <HeartOff className="w-5 h-5 text-slate-400" /> },
                { val: 'Pindah Domisili / RS', icon: <MapPinOff className="w-5 h-5 text-slate-400" /> },
                { val: 'Lainnya', icon: <Edit3 className="w-5 h-5 text-slate-400" /> }
              ].map(opt => (
                <label key={opt.val} className="cursor-pointer block relative">
                  <input type="radio" name="skip_reason" value={opt.val} className="radio-reason sr-only" onChange={(e) => setSkipReason(e.target.value)} />
                  <div className={`p-4 border rounded-2xl text-sm font-medium transition-colors flex justify-between items-center ${skipReason === opt.val ? 'border-accent bg-care-50 text-care-700 shadow-sm' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                    <span>{opt.val}</span>
                    {opt.icon}
                  </div>
                </label>
              ))}
              {skipReason === 'Lainnya' && (
                <div className="mt-2 animate-fade-in">
                  <textarea rows={2} className="textarea-minimal" placeholder="Tuliskan alasan spesifik..." value={otherReason} onChange={e => setOtherReason(e.target.value)}></textarea>
                </div>
              )}
            </div>
            <div className="flex gap-4">
              <button onClick={() => setShowSkipModal(false)} className="w-1/3 py-3.5 bg-slate-50 text-slate-600 rounded-2xl font-bold hover:bg-slate-100 transition-all">Batal</button>
              <button onClick={submitSkipReason} className="w-2/3 py-3.5 bg-accent text-white rounded-2xl font-bold hover:shadow-care-500/30 hover:-translate-y-0.5 shadow-lg transition-all">Simpan Status</button>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={closeSuccessModal}></div>
          <div className="bg-white rounded-[32px] p-10 shadow-2xl relative z-10 max-w-sm w-full text-center animate-modal-in border border-white/50">
            <div className="checkmark-wrapper">
              <CheckCircle className="w-14 h-14 text-accent" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">Berhasil Disimpan!</h2>
            <p className="text-slate-500 mb-8 text-sm leading-relaxed">Data Registry Uveitis telah berhasil masuk ke dalam database sistem.</p>
            <button onClick={closeSuccessModal} className="w-full bg-accent hover:bg-care-600 text-white font-bold py-3.5 px-6 rounded-2xl transition-all shadow-lg shadow-care-500/30">
              Tutup & Kembali
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
