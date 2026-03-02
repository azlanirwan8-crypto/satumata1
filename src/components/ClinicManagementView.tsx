import React, { useState } from 'react';
import { 
  ArrowLeft, 
  PlusCircle, 
  Search, 
  ChevronDown, 
  CornerDownRight, 
  Settings, 
  Archive, 
  Eye, 
  FileSearch2, 
  Building2, 
  Network, 
  CheckCircle2, 
  Clock,
  X,
  FileText,
  FileCheck,
  CheckCircle,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Filter,
  Edit3,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ClinicFormWizard from './ClinicFormWizard';
import ClinicDetailView from './ClinicDetailView';

export interface Clinic {
  id: string;
  name: string;
  code: string;
  location: string;
  type: string;
  contractStatus: 'Active' | 'Expiring' | 'Expired';
  accountStatus: 'Verified' | 'Pending' | 'Suspended' | 'Inactive';
  lastActivity: string;
  formData?: any;
  branches?: Clinic[];
  expiryDate?: string;
}

interface ClinicManagementViewProps {
  clinics: Clinic[];
  onBack: () => void;
  onAddFaskes: () => void;
  onEditFaskes: (clinic: Clinic) => void;
  onViewFaskes: (clinic: Clinic) => void;
  onDeleteFaskes: (id: string) => void;
  onSaveFaskes: (data: any) => void;
  onSaveBranch?: (parentId: string, data: any) => void;
  initialStatusFilter?: string;
}

export default function ClinicManagementView({ 
  clinics,
  onBack,
  onAddFaskes,
  onEditFaskes,
  onViewFaskes,
  onDeleteFaskes,
  onSaveFaskes,
  onSaveBranch,
  initialStatusFilter = 'Semua Status'
}: ClinicManagementViewProps) {
  const [currentView, setCurrentView] = useState<'list' | 'register' | 'detail'>('list');
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [expandedBranches, setExpandedBranches] = useState<string[]>([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [isAddBranchModalOpen, setIsAddBranchModalOpen] = useState(false);
  const [branchTargetClinic, setBranchTargetClinic] = useState<Clinic | null>(null);
  const [suspendTargetName, setSuspendTargetName] = useState('');
  const [reviewChecks, setReviewChecks] = useState({ check1: false, check2: false });
  const [branchFormData, setBranchFormData] = useState({ name: '', code: '', phone: '', address: '', pic: '', email: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('Semua');
  const [statusFilter, setStatusFilter] = useState(initialStatusFilter);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const toggleBranch = (id: string) => {
    setExpandedBranches(prev => 
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  };

  const handleViewDetail = (clinic: Clinic) => {
    setSelectedClinic(clinic);
    setCurrentView('detail');
  };

  const openSuspendModal = (name: string) => {
    setSuspendTargetName(name);
    setIsSuspendModalOpen(true);
  };

  const openAddBranchModal = (clinic: Clinic) => {
    setBranchTargetClinic(clinic);
    setIsAddBranchModalOpen(true);
  };

  const handleAddBranch = () => {
    if (branchTargetClinic && onSaveBranch) {
      onSaveBranch(branchTargetClinic.id, branchFormData);
      setIsAddBranchModalOpen(false);
      setBranchTargetClinic(null);
      setBranchFormData({ name: '', code: '', phone: '', address: '', pic: '', email: '' });
    }
  };

  const handleReviewApprove = () => {
    setIsReviewModalOpen(false);
    // Show toast logic here if needed
  };

  const filteredClinics = clinics
    .filter(c => {
      if (typeFilter === 'Semua Tipe') return true;
      if (typeFilter === 'Pusat / Mandiri') return !c.name.includes('Cab.'); // Simple heuristic for demo
      if (typeFilter === 'Cabang') return c.name.includes('Cab.');
      return true;
    })
    .filter(c => {
      if (statusFilter === 'Semua Status') return true;
      if (statusFilter === 'Aktif') return c.contractStatus === 'Active';
      if (statusFilter === 'Menunggu Persetujuan') return c.accountStatus === 'Pending';
      return true;
    })
    .filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const totalPages = Math.ceil(filteredClinics.length / itemsPerPage);
  const paginatedClinics = filteredClinics.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-700 border-green-200';
      case 'Expiring': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Expired': return 'bg-red-100 text-red-700 border-red-200';
      case 'Verified': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Suspended': return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'Inactive': return 'bg-gray-100 text-gray-500 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const faskesPusatCount = clinics.filter(c => !c.name.includes('Cab.')).length;
  const fasilitasCabangCount = clinics.filter(c => c.name.includes('Cab.')).length;
  const klinikAktifCount = clinics.filter(c => c.contractStatus === 'Active').length;
  const menungguPersetujuanCount = clinics.filter(c => c.accountStatus === 'Pending').length;

  if (currentView === 'register') {
    return <ClinicFormWizard onBack={() => setCurrentView('list')} onSubmit={(data) => { onSaveFaskes(data); setCurrentView('list'); }} />;
  }

  if (currentView === 'detail' && selectedClinic) {
    const freshClinic = clinics.find(c => c.id === selectedClinic.id) || selectedClinic;
    return (
      <ClinicDetailView 
        clinic={freshClinic} 
        onBack={() => { setCurrentView('list'); setSelectedClinic(null); }} 
        onSaveBranch={onSaveBranch}
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50/50 overflow-hidden">
      {/* Header & Infographic */}
      <div className="bg-white border-b border-gray-200 px-8 py-6 flex flex-col gap-6 shadow-sm z-10 shrink-0">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500" title="Kembali">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="font-display font-bold text-2xl text-satu-dark">Manajemen Faskes</h1>
              <p className="text-sm text-gray-500 mt-1">Kelola seluruh fasilitas kesehatan, verifikasi pendaftaran, dan status langganan.</p>
            </div>
          </div>
          <button onClick={() => setCurrentView('register')} className="flex items-center gap-2 bg-satu-primary hover:bg-satu-dark text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all active:scale-95">
            <PlusCircle className="w-5 h-5" />
            <span>Daftar Faskes</span>
          </button>
        </div>

        {/* Infographic Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-satu-primary flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Faskes Pusat / Mandiri</p>
              <h3 className="text-xl font-display font-bold text-satu-dark leading-none mt-1">{faskesPusatCount}</h3>
            </div>
          </div>
          <div className="bg-purple-50/50 border border-purple-100 rounded-xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Fasilitas Cabang</p>
              <h3 className="text-xl font-display font-bold text-satu-dark leading-none mt-1">{fasilitasCabangCount}</h3>
            </div>
          </div>
          <div className="bg-green-50/50 border border-green-100 rounded-xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Klinik Aktif</p>
              <h3 className="text-xl font-display font-bold text-satu-dark leading-none mt-1">{klinikAktifCount}</h3>
            </div>
          </div>
          <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Menunggu Persetujuan</p>
              <h3 className="text-xl font-display font-bold text-satu-dark leading-none mt-1">{menungguPersetujuanCount}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar & Table */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-8 py-4 bg-white border-b border-gray-200 shrink-0 flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Cari Nama Klinik atau ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-satu-primary focus:ring-1 focus:ring-satu-primary/20 transition-colors" 
            />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-48 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-satu-primary font-medium text-gray-600 outline-none cursor-pointer"
          >
            <option value="Semua Status">Semua Status</option>
            <option value="Aktif">Aktif</option>
            <option value="Menunggu Persetujuan">Menunggu Persetujuan</option>
          </select>
          <select 
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-48 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-satu-primary font-medium text-gray-600 outline-none cursor-pointer"
          >
            <option value="Semua Tipe">Semua Tipe</option>
            <option value="Pusat / Mandiri">Pusat / Mandiri</option>
            <option value="Cabang">Cabang</option>
          </select>
        </div>

        <div className="flex-1 overflow-auto custom-scroll p-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider border-b border-gray-200 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4 font-bold text-satu-dark">Nama Klinik</th>
                  <th className="px-6 py-4 font-bold text-satu-dark">Paket Langganan</th>
                  <th className="px-6 py-4 font-bold text-satu-dark text-center">Status Akses</th>
                  <th className="px-6 py-4 font-bold text-satu-dark text-center">Tagihan</th>
                  <th className="px-6 py-4 font-bold text-satu-dark">Masa Aktif</th>
                  <th className="px-6 py-4 font-bold text-satu-dark text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {/* Dynamic Rows from Props */}
                {paginatedClinics.length > 0 ? (
                  paginatedClinics.map((clinic) => (
                    <React.Fragment key={clinic.id}>
                      <tr className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-5">
                          <div className="flex items-start gap-2">
                            {clinic.branches && clinic.branches.length > 0 ? (
                              <button 
                                onClick={() => toggleBranch(clinic.id)}
                                className={`p-1 rounded hover:bg-gray-100 text-gray-500 mt-0.5 transition-transform ${expandedBranches.includes(clinic.id) ? '' : '-rotate-90'}`}
                              >
                                <ChevronDown className="w-4 h-4" />
                              </button>
                            ) : (
                              <div className="w-6" />
                            )}
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-satu-primary group-hover:text-white transition-colors overflow-hidden shrink-0">
                                {clinic.formData?.logo ? (
                                  <img src={clinic.formData.logo} alt={clinic.name} className="w-full h-full object-cover" />
                                ) : (
                                  <Building2 className="w-5 h-5" />
                                )}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-bold text-slate-800">{clinic.name}</p>
                                  {clinic.branches && clinic.branches.length > 0 && (
                                    <span className="bg-blue-100 text-satu-primary text-[10px] px-2 py-0.5 rounded-full font-bold border border-blue-200 whitespace-nowrap">
                                      {clinic.branches.length} Cabang
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] text-gray-500 mt-1">
                                  <span className="bg-satu-primary/10 text-satu-primary font-bold px-1.5 py-0.5 rounded mr-1 border border-satu-primary/20">
                                    {clinic.branches && clinic.branches.length > 0 ? 'Pusat' : 'Mandiri'}
                                  </span>
                                  <span className="font-mono uppercase tracking-wider">ID: {clinic.code} • {clinic.type}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="font-bold text-satu-primary">Pro</div>
                          <div className="text-xs text-gray-500">Rp 1.500.000 / bln</div>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${getStatusColor(clinic.contractStatus)}`}>
                            {clinic.contractStatus.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <div className="font-bold text-gray-900 text-sm mb-1">Rp 2.500.000</div>
                          <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase bg-blue-50 text-blue-600">Lunas</span>
                        </td>
                        <td className="px-6 py-5 text-xs font-medium">{clinic.expiryDate || '-'}</td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex items-center justify-center gap-2">
                            <button 
                              onClick={() => handleViewDetail(clinic)}
                              className="p-1.5 hover:bg-blue-50 text-gray-400 hover:text-satu-primary rounded-lg transition-all" title="Edit"
                            >
                              <Settings className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => openSuspendModal(clinic.name)}
                              className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-all" title="Hapus"
                            >
                              <Archive className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Branch Rows */}
                      {expandedBranches.includes(clinic.id) && clinic.branches?.map((branch, index) => (
                        <tr key={branch.id} className="bg-gray-50/80 hover:bg-blue-50/50 transition-colors group/branch">
                          <td className="px-6 py-4 pl-12 relative">
                            {/* Tree Line Visuals */}
                            <div className={`absolute left-9 top-0 w-0.5 bg-gray-200 ${index === clinic.branches!.length - 1 ? 'h-1/2' : 'h-full'}`} />
                            <div className="absolute left-9 top-1/2 w-4 h-0.5 bg-gray-200" />
                            
                            <div className="flex items-center gap-3 pl-4">
                              <div className="w-8 h-8 bg-white rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 group-hover/branch:border-satu-primary group-hover/branch:text-satu-primary transition-colors shrink-0">
                                <Network className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-gray-700">{branch.name}</p>
                                <div className="text-[10px] text-gray-500 mt-0.5">
                                  <span className="bg-gray-200 text-gray-600 font-bold px-1.5 py-0.5 rounded mr-1">Cabang</span>
                                  <span className="font-mono">ID: {branch.code}</span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-xs italic text-gray-400">Mengikuti Pusat</td>
                          <td className="px-6 py-4 text-center">
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${getStatusColor(branch.accountStatus === 'Pending' ? 'Pending' : 'Active')}`}>
                              {branch.accountStatus === 'Pending' ? 'MENUNGGU VERIFIKASI' : 'AKTIF'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="font-bold text-gray-700 text-xs mb-1">Rp 500.000</div>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-gray-200 text-gray-600">Via Pusat</span>
                          </td>
                          <td className="px-6 py-4 text-xs text-gray-400">{branch.expiryDate || '-'}</td>
                          <td className="px-6 py-4 text-center">
                            <button 
                              onClick={() => handleViewDetail(branch)}
                              className="p-1.5 text-gray-400 hover:text-satu-primary hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Settings className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400 italic">
                      <div className="flex flex-col items-center gap-2">
                        <Building2 className="w-10 h-10 text-gray-300" />
                        <p>Belum ada data faskes.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="p-6 border-t border-gray-100 flex items-center justify-between bg-slate-50/30">
          <p className="text-xs text-gray-500">
            Menampilkan <span className="font-bold text-slate-800">{Math.min((currentPage - 1) * itemsPerPage + 1, filteredClinics.length)} - {Math.min(currentPage * itemsPerPage, filteredClinics.length)}</span> dari <span className="font-bold text-slate-800">{filteredClinics.length}</span> faskes
          </p>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-200 rounded-lg text-gray-400 hover:bg-white hover:text-satu-primary transition-all disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-400"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                if (
                  totalPages <= 5 || 
                  pageNum === 1 || 
                  pageNum === totalPages || 
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1) ||
                  (currentPage <= 2 && pageNum <= 4) ||
                  (currentPage >= totalPages - 1 && pageNum >= totalPages - 3)
                ) {
                  return (
                    <button 
                      key={i}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${
                        currentPage === pageNum 
                          ? 'bg-satu-primary text-white' 
                          : 'text-gray-500 hover:bg-gray-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                } else if (
                  (pageNum === currentPage - 2 && currentPage > 3) || 
                  (pageNum === currentPage + 2 && currentPage < totalPages - 2)
                ) {
                  return <span key={i} className="text-gray-400 text-xs px-1">...</span>;
                }
                return null;
              })}
            </div>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-2 border border-gray-200 rounded-lg text-gray-400 hover:bg-white hover:text-satu-primary transition-all disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-400"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      <AnimatePresence>
        {isReviewModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="px-6 py-5 border-b bg-gray-50 flex justify-between items-center shrink-0">
                <div>
                  <h3 className="text-lg font-display font-bold text-satu-dark">Tinjau Pendaftaran Fasilitas Kesehatan</h3>
                  <p className="text-xs text-gray-500 mt-1">ID Pengajuan: <span className="font-mono font-bold text-gray-800">K-00341</span></p>
                </div>
                <button onClick={() => setIsReviewModalOpen(false)} className="p-2 rounded-full hover:bg-gray-200 transition-colors"><X className="w-5 h-5 text-gray-500" /></button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scroll p-8 bg-white space-y-8">
                {/* Info 1 */}
                <div className="border border-gray-200 rounded-xl p-5 relative">
                  <span className="absolute -top-3 left-4 bg-white px-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Informasi Klinik</span>
                  <div className="grid grid-cols-2 gap-y-4 text-sm">
                    <div><p className="text-gray-500 text-xs mb-1">Nama Fasilitas</p><p className="font-bold text-gray-800">Klinik Mata Nusantara</p></div>
                    <div><p className="text-gray-500 text-xs mb-1">Tingkatan Faskes / Jenis</p><p className="font-bold text-gray-800">FKRTL / Klinik Utama</p></div>
                    <div><p className="text-gray-500 text-xs mb-1">Kode Kemenkes</p><p className="font-mono font-bold text-gray-800">327112345</p></div>
                    <div><p className="text-gray-500 text-xs mb-1">Pilihan Paket</p><p className="font-bold text-satu-primary text-base">Pro</p></div>
                    <div className="col-span-2"><p className="text-gray-500 text-xs mb-1">Alamat Lengkap</p><p className="font-bold text-gray-800">Jl. Merdeka No. 12, Kel. Babakan, Kota Bandung, 40111</p></div>
                  </div>
                </div>

                {/* Info 2 */}
                <div className="border border-gray-200 rounded-xl p-5 relative">
                  <span className="absolute -top-3 left-4 bg-white px-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Penanggung Jawab</span>
                  <div className="grid grid-cols-2 gap-y-4 text-sm">
                    <div><p className="text-gray-500 text-xs mb-1">Nama PIC (Medis)</p><p className="font-bold text-gray-800">Dr. Rina Hartati, Sp.M</p></div>
                    <div><p className="text-gray-500 text-xs mb-1">Jabatan</p><p className="font-bold text-gray-800">Direktur Klinik</p></div>
                    <div><p className="text-gray-500 text-xs mb-1">Email / Kontak Utama</p><p className="font-bold text-gray-800">rina.h@email.com / 08123456789</p></div>
                    <div><p className="text-gray-500 text-xs mb-1">PIC Billing & Keuangan</p><p className="font-bold text-gray-800">finance@matanusantara.com</p></div>
                  </div>
                </div>

                {/* Info 3 */}
                <div className="border border-gray-200 rounded-xl p-5 relative">
                  <span className="absolute -top-3 left-4 bg-white px-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Lampiran Legalitas</span>
                  <div className="space-y-3 mt-2">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <div>
                        <span className="text-sm font-bold text-gray-700 block"><FileText className="w-4 h-4 inline mr-2 text-gray-400" /> Akta Pendirian / Izin Usaha</span>
                        <span className="text-[10px] text-gray-500 ml-6">NIB: 912301923091</span>
                      </div>
                      <button className="text-xs font-bold text-satu-primary hover:underline flex items-center gap-1">Lihat <ExternalLink className="w-3 h-3" /></button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <div>
                        <span className="text-sm font-bold text-gray-700 block"><FileCheck className="w-4 h-4 inline mr-2 text-gray-400" /> Izin Operasional Klinik</span>
                        <span className="text-[10px] text-orange-600 font-bold ml-6">Expired: 12 Nov 2026</span>
                      </div>
                      <button className="text-xs font-bold text-satu-primary hover:underline flex items-center gap-1">Lihat <ExternalLink className="w-3 h-3" /></button>
                    </div>
                  </div>
                </div>

                {/* Admin Checklist */}
                <div className="bg-orange-50 p-5 rounded-xl border border-orange-100">
                  <h4 className="text-sm font-bold text-orange-800 mb-3">Checklist Persetujuan Admin</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={reviewChecks.check1} 
                        onChange={(e) => setReviewChecks(prev => ({ ...prev, check1: e.target.checked }))}
                        className="w-4 h-4 rounded text-satu-primary focus:ring-satu-primary border-gray-300" 
                      />
                      <span className="text-sm text-gray-700 font-medium">Data klinik dan kontak valid.</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={reviewChecks.check2} 
                        onChange={(e) => setReviewChecks(prev => ({ ...prev, check2: e.target.checked }))}
                        className="w-4 h-4 rounded text-satu-primary focus:ring-satu-primary border-gray-300" 
                      />
                      <span className="text-sm text-gray-700 font-medium">Dokumen legalitas sah dan terbaca. Masa berlaku valid.</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3 shrink-0">
                <button onClick={() => setIsReviewModalOpen(false)} className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-100 transition-colors">Tolak Pengajuan</button>
                <button 
                  onClick={handleReviewApprove} 
                  disabled={!reviewChecks.check1 || !reviewChecks.check2}
                  className="px-6 py-2.5 bg-satu-success text-white rounded-xl text-sm font-bold shadow-md hover:bg-green-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle className="w-4 h-4" /> Setujui & Aktifkan
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Suspend Modal */}
      <AnimatePresence>
        {isSuspendModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden p-6 text-center"
            >
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-600">
                <Archive className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-display font-bold text-gray-900 mb-2">Tangguhkan Data Faskes?</h3>
              <p className="text-sm text-gray-500 mb-2">Anda akan menangguhkan akses dan data <b className="text-gray-800">{suspendTargetName}</b>.</p>
              <p className="text-[11px] text-orange-600 bg-orange-50 p-2 rounded mb-6 text-left leading-relaxed border border-orange-100">
                <b>Peringatan Sesuai Permenkes:</b> Faskes ini tidak akan dihapus permanen untuk menjaga integritas rekam medis (*Soft Suspend*). Login pegawai faskes ini akan dinonaktifkan sementara.
              </p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setIsSuspendModalOpen(false)} className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50">Batal</button>
                <button onClick={() => setIsSuspendModalOpen(false)} className="px-5 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-bold shadow-md hover:bg-orange-600">Ya, Tangguhkan</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Branch Modal */}
      <AnimatePresence>
        {isAddBranchModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="px-6 py-5 border-b bg-gray-50 flex justify-between items-center shrink-0">
                <div>
                  <h3 className="text-lg font-display font-bold text-satu-dark">Pendaftaran Cabang Baru</h3>
                  <p className="text-xs text-gray-500 mt-1">Induk: <span className="font-bold text-gray-800">{branchTargetClinic?.name}</span></p>
                </div>
                <button onClick={() => setIsAddBranchModalOpen(false)} className="p-2 rounded-full hover:bg-gray-200 transition-colors"><X className="w-5 h-5 text-gray-500" /></button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scroll p-6 bg-white">
                <div className="bg-blue-50/50 p-4 border border-blue-100 rounded-xl mb-6 text-xs text-blue-800 leading-relaxed">
                  <i className="inline-block mr-1"><Network className="w-3 h-3" /></i> Cabang baru akan berbagi database EMR (Rekam Medis) dengan Faskes Induk. Penagihan biaya langganan tambahan untuk cabang ini akan <b>digabungkan ke dalam Invoice Induk</b> pada bulan berjalan.
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-2">Nama Lengkap Cabang <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-satu-primary/20 outline-none text-sm font-bold text-gray-800" 
                      placeholder="Contoh: Klinik Mata Nusantara Cab. Bogor" 
                      value={branchFormData.name}
                      onChange={(e) => setBranchFormData({...branchFormData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">Kode Kemenkes Cabang</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-satu-primary/20 outline-none font-mono text-sm" 
                      placeholder="Opsional" 
                      value={branchFormData.code}
                      onChange={(e) => setBranchFormData({...branchFormData, code: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">Nomor Telepon Cabang</label>
                    <input 
                      type="tel" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-satu-primary/20 outline-none text-sm" 
                      placeholder="0251-xxxxxx" 
                      value={branchFormData.phone}
                      onChange={(e) => setBranchFormData({...branchFormData, phone: e.target.value})}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-2">Alamat Lengkap Cabang</label>
                    <textarea 
                      rows={2} 
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-satu-primary/20 outline-none text-sm"
                      value={branchFormData.address}
                      onChange={(e) => setBranchFormData({...branchFormData, address: e.target.value})}
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">Nama Penanggung Jawab Cabang</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-satu-primary/20 outline-none text-sm" 
                      placeholder="Kepala Cabang" 
                      value={branchFormData.pic}
                      onChange={(e) => setBranchFormData({...branchFormData, pic: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">Email Akun Admin Cabang <span className="text-red-500">*</span></label>
                    <input 
                      type="email" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-satu-primary/20 outline-none text-sm" 
                      placeholder="admin.bogor@matanusantara.com" 
                      value={branchFormData.email}
                      onChange={(e) => setBranchFormData({...branchFormData, email: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3 shrink-0">
                <button onClick={() => setIsAddBranchModalOpen(false)} className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-100 transition-colors">Batal</button>
                <button onClick={handleAddBranch} className="px-6 py-2.5 bg-satu-primary text-white rounded-xl text-sm font-bold shadow-md hover:bg-satu-dark transition-colors flex items-center gap-2">
                  <PlusCircle className="w-4 h-4" /> Simpan Cabang
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
