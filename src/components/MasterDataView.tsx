import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Database,
  Tag,
  Briefcase,
  Building2,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { MasterItem } from './SuperAdminDashboard';

type MasterCategory = 'roles' | 'faskes-types' | 'specializations' | 'document-types' | 'employee-status';

interface MasterDataViewProps {
  onBack: () => void;
  roles: MasterItem[];
  onUpdateRoles: (roles: MasterItem[]) => void;
}

export default function MasterDataView({ onBack, roles, onUpdateRoles }: MasterDataViewProps) {
  const [activeCategory, setActiveCategory] = useState<MasterCategory>('roles');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MasterItem | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Mock Data for other categories
  const [faskesTypes, setFaskesTypes] = useState<MasterItem[]>([
    { id: '1', name: 'Rumah Sakit Umum', code: 'RSU', description: 'General Hospital', status: 'Active' },
    { id: '2', name: 'Klinik Utama', code: 'KLU', description: 'Main Clinic', status: 'Active' },
    { id: '3', name: 'Klinik Pratama', code: 'KLP', description: 'Primary Clinic', status: 'Active' },
    { id: '4', name: 'Optik', code: 'OPT', description: 'Optical Clinic', status: 'Active' },
    { id: '5', name: 'Puskesmas', code: 'PUS', description: 'Community Health Center', status: 'Active' },
  ]);

  const [specializations, setSpecializations] = useState<MasterItem[]>([
    { id: '1', name: 'Mata (Ophthalmology)', code: 'Sp.M', status: 'Active' },
    { id: '2', name: 'Penyakit Dalam', code: 'Sp.PD', status: 'Active' },
    { id: '3', name: 'Anak', code: 'Sp.A', status: 'Active' },
    { id: '4', name: 'Bedah', code: 'Sp.B', status: 'Active' },
  ]);

  const [docTypes, setDocTypes] = useState<MasterItem[]>([
    { id: '1', name: 'STR (Surat Tanda Registrasi)', code: 'DOC-STR', status: 'Active' },
    { id: '2', name: 'SIP (Surat Izin Praktik)', code: 'DOC-SIP', status: 'Active' },
    { id: '3', name: 'Ijazah Terakhir', code: 'DOC-EDU', status: 'Active' },
    { id: '4', name: 'Sertifikat Kompetensi', code: 'DOC-KOM', status: 'Active' },
  ]);

  const [empStatuses, setEmpStatuses] = useState<MasterItem[]>([
    { id: '1', name: 'Pegawai Tetap', code: 'P-TETAP', status: 'Active' },
    { id: '2', name: 'Pegawai Kontrak', code: 'P-KONTRAK', status: 'Active' },
    { id: '3', name: 'Mitra Dokter', code: 'P-MITRA', status: 'Active' },
    { id: '4', name: 'Magang', code: 'P-MAGANG', status: 'Active' },
  ]);

  const getCurrentData = () => {
    switch (activeCategory) {
      case 'roles': return roles;
      case 'faskes-types': return faskesTypes;
      case 'specializations': return specializations;
      case 'document-types': return docTypes;
      case 'employee-status': return empStatuses;
      default: return [];
    }
  };

  const getCategoryLabel = () => {
    switch (activeCategory) {
      case 'roles': return 'Role User';
      case 'faskes-types': return 'Jenis Faskes';
      case 'specializations': return 'Spesialisasi';
      case 'document-types': return 'Jenis Dokumen';
      case 'employee-status': return 'Status Kepegawaian';
      default: return '';
    }
  };

  const filteredData = getCurrentData().filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.code && item.code.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newItem: MasterItem = {
      id: editingItem ? editingItem.id : Math.random().toString(36).substr(2, 9),
      name: formData.get('name') as string,
      code: formData.get('code') as string,
      description: formData.get('description') as string,
      status: 'Active'
    };

    const updateState = (setter: React.Dispatch<React.SetStateAction<MasterItem[]>> | ((items: MasterItem[]) => void)) => {
      if (activeCategory === 'roles') {
        onUpdateRoles(editingItem ? roles.map(i => i.id === editingItem.id ? newItem : i) : [newItem, ...roles]);
      } else {
        (setter as React.Dispatch<React.SetStateAction<MasterItem[]>>)(prev => editingItem ? prev.map(i => i.id === editingItem.id ? newItem : i) : [newItem, ...prev]);
      }
    };

    switch (activeCategory) {
      case 'roles': updateState(onUpdateRoles); break;
      case 'faskes-types': updateState(setFaskesTypes); break;
      case 'specializations': updateState(setSpecializations); break;
      case 'document-types': updateState(setDocTypes); break;
      case 'employee-status': updateState(setEmpStatuses); break;
    }

    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleDelete = () => {
    if (!confirmDeleteId) return;

    const updateState = (setter: React.Dispatch<React.SetStateAction<MasterItem[]>> | ((items: MasterItem[]) => void)) => {
      if (activeCategory === 'roles') {
        onUpdateRoles(roles.filter(i => i.id !== confirmDeleteId));
      } else {
        (setter as React.Dispatch<React.SetStateAction<MasterItem[]>>)(prev => prev.filter(i => i.id !== confirmDeleteId));
      }
    };

    switch (activeCategory) {
      case 'roles': updateState(onUpdateRoles); break;
      case 'faskes-types': updateState(setFaskesTypes); break;
      case 'specializations': updateState(setSpecializations); break;
      case 'document-types': updateState(setDocTypes); break;
      case 'employee-status': updateState(setEmpStatuses); break;
    }

    setConfirmDeleteId(null);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-5 flex justify-between items-end shadow-sm z-10 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="font-display font-bold text-2xl text-satu-dark">Master Data</h1>
            <p className="text-sm text-gray-500 mt-1">Pengaturan parameter global sistem SATUMATA.</p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 flex-shrink-0 overflow-y-auto py-6">
          <div className="px-4 mb-2">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">User & Organisasi</p>
          </div>
          <nav className="space-y-1 px-2 mb-6">
            <button 
              onClick={() => setActiveCategory('roles')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-xl transition-colors ${activeCategory === 'roles' ? 'bg-satu-primary text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Briefcase className="w-4 h-4" />
              Role User
            </button>
            <button 
              onClick={() => setActiveCategory('faskes-types')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-xl transition-colors ${activeCategory === 'faskes-types' ? 'bg-satu-primary text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Building2 className="w-4 h-4" />
              Jenis Faskes
            </button>
            <button 
              onClick={() => setActiveCategory('employee-status')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-xl transition-colors ${activeCategory === 'employee-status' ? 'bg-satu-primary text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Tag className="w-4 h-4" />
              Status Kepegawaian
            </button>
          </nav>

          <div className="px-4 mb-2">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Medis & Legalitas</p>
          </div>
          <nav className="space-y-1 px-2">
            <button 
              onClick={() => setActiveCategory('specializations')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-xl transition-colors ${activeCategory === 'specializations' ? 'bg-satu-primary text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Tag className="w-4 h-4" />
              Spesialisasi
            </button>
            <button 
              onClick={() => setActiveCategory('document-types')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-xl transition-colors ${activeCategory === 'document-types' ? 'bg-satu-primary text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <FileText className="w-4 h-4" />
              Jenis Dokumen
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-8 pb-0">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">{getCategoryLabel()}</h2>
              <button 
                onClick={() => {
                  setEditingItem(null);
                  setIsModalOpen(true);
                }}
                className="flex items-center gap-2 bg-satu-primary hover:bg-satu-dark text-white font-semibold text-sm px-4 py-2 rounded-xl shadow-md transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Data</span>
              </button>
            </div>

            <div className="relative max-w-md mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder={`Cari ${getCategoryLabel()}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-satu-primary/20 focus:border-satu-primary outline-none transition-all text-sm"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-8 pb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full text-sm text-left text-gray-600">
                <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 font-bold text-satu-dark w-20">Kode</th>
                    <th className="px-6 py-4 font-bold text-satu-dark">Nama</th>
                    <th className="px-6 py-4 font-bold text-satu-dark">Deskripsi</th>
                    <th className="px-6 py-4 font-bold text-satu-dark w-24">Status</th>
                    <th className="px-6 py-4 font-bold text-satu-dark text-right w-32">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredData.map((item) => (
                    <tr key={item.id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs font-bold text-gray-500">
                        {item.code || '-'}
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-800">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {item.description || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-md text-xs font-bold">
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => {
                              setEditingItem(item);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => setConfirmDeleteId(item.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredData.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500 italic">
                        Tidak ada data ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="px-6 py-5 border-b bg-gray-50/50 flex justify-between items-center">
                <h3 className="text-lg font-display font-bold text-satu-dark">
                  {editingItem ? `Edit ${getCategoryLabel()}` : `Tambah ${getCategoryLabel()}`}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                  <span className="text-gray-500 hover:text-gray-700 font-bold">✕</span>
                </button>
              </div>
              <form onSubmit={handleSave} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Nama</label>
                  <input 
                    name="name"
                    type="text" 
                    required 
                    defaultValue={editingItem?.name}
                    className="w-full px-4 py-2.5 border rounded-xl bg-gray-50 outline-none text-sm focus:border-satu-primary focus:ring-1 focus:ring-satu-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Kode (Opsional)</label>
                  <input 
                    name="code"
                    type="text" 
                    defaultValue={editingItem?.code}
                    className="w-full px-4 py-2.5 border rounded-xl bg-gray-50 outline-none text-sm focus:border-satu-primary focus:ring-1 focus:ring-satu-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Deskripsi</label>
                  <textarea 
                    name="description"
                    rows={3}
                    defaultValue={editingItem?.description}
                    className="w-full px-4 py-2.5 border rounded-xl bg-gray-50 outline-none text-sm focus:border-satu-primary focus:ring-1 focus:ring-satu-primary resize-none"
                  />
                </div>
                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50">
                    Batal
                  </button>
                  <button type="submit" className="px-6 py-2.5 bg-satu-primary text-white rounded-xl text-sm font-bold shadow-md hover:bg-satu-dark">
                    Simpan
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Delete Confirmation */}
        {confirmDeleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center"
            >
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                <Trash2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-display font-bold text-gray-900 mb-2">Hapus Data?</h3>
              <p className="text-sm text-gray-500 mb-6">Tindakan ini tidak dapat dibatalkan. Data yang dihapus akan hilang dari sistem.</p>
              <div className="flex justify-center gap-3">
                <button onClick={() => setConfirmDeleteId(null)} className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50">
                  Batal
                </button>
                <button 
                  onClick={handleDelete}
                  className="px-5 py-2.5 bg-red-600 text-white rounded-xl text-sm font-bold shadow-md hover:bg-red-700"
                >
                  Ya, Hapus
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
