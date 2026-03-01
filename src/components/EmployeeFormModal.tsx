import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Employee } from './EmployeeDirectoryView';

interface EmployeeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Employee>) => void;
  initialData?: Employee | null;
}

export default function EmployeeFormModal({ isOpen, onClose, onSave, initialData }: EmployeeFormModalProps) {
  const [formData, setFormData] = useState<Partial<Employee>>({
    name: '', nip: '', profession: '', jobTitle: '', category: 'medis', status: 'Active',
    email: '', phone: '', str: '', sip: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: '', nip: '', profession: '', jobTitle: '', category: 'medis', status: 'Active',
        email: '', phone: '', str: '', sip: ''
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="px-6 py-5 border-b bg-gray-50/50 flex justify-between items-center shrink-0">
              <h3 className="text-lg font-display font-bold text-satu-dark">
                {initialData ? 'Edit Pegawai' : 'Tambah Pegawai Baru'}
              </h3>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                <span className="text-gray-500 hover:text-gray-700 font-bold">✕</span>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scroll">
              <form id="employee-form" onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Nama Lengkap</label>
                    <input 
                      type="text" required 
                      value={formData.name || ''}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-2.5 border rounded-xl bg-gray-50 outline-none text-sm focus:border-satu-primary focus:ring-1 focus:ring-satu-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">NIP</label>
                    <input 
                      type="text" required 
                      value={formData.nip || ''}
                      onChange={(e) => setFormData({...formData, nip: e.target.value})}
                      className="w-full px-4 py-2.5 border rounded-xl bg-gray-50 outline-none text-sm focus:border-satu-primary focus:ring-1 focus:ring-satu-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Email</label>
                    <input 
                      type="email" required 
                      value={formData.email || ''}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-2.5 border rounded-xl bg-gray-50 outline-none text-sm focus:border-satu-primary focus:ring-1 focus:ring-satu-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">No. Telepon</label>
                    <input 
                      type="text" 
                      value={formData.phone || ''}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-2.5 border rounded-xl bg-gray-50 outline-none text-sm focus:border-satu-primary focus:ring-1 focus:ring-satu-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Profesi</label>
                    <input 
                      type="text" required 
                      value={formData.profession || ''}
                      onChange={(e) => setFormData({...formData, profession: e.target.value})}
                      className="w-full px-4 py-2.5 border rounded-xl bg-gray-50 outline-none text-sm focus:border-satu-primary focus:ring-1 focus:ring-satu-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Jabatan</label>
                    <input 
                      type="text" required 
                      value={formData.jobTitle || ''}
                      onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
                      className="w-full px-4 py-2.5 border rounded-xl bg-gray-50 outline-none text-sm focus:border-satu-primary focus:ring-1 focus:ring-satu-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Kategori</label>
                    <select 
                      value={formData.category || 'medis'}
                      onChange={(e) => setFormData({...formData, category: e.target.value as 'medis' | 'non-medis'})}
                      className="w-full px-4 py-2.5 border rounded-xl bg-gray-50 outline-none text-sm focus:border-satu-primary focus:ring-1 focus:ring-satu-primary"
                    >
                      <option value="medis">Medis</option>
                      <option value="non-medis">Non-Medis</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Status</label>
                    <select 
                      value={formData.status || 'Active'}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full px-4 py-2.5 border rounded-xl bg-gray-50 outline-none text-sm focus:border-satu-primary focus:ring-1 focus:ring-satu-primary"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                {formData.category === 'medis' && (
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mt-4">
                    <h4 className="font-bold text-blue-800 text-sm mb-3">Data Legalitas (STR & SIP)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">No. STR</label>
                        <input 
                          type="text" 
                          value={formData.str || ''}
                          onChange={(e) => setFormData({...formData, str: e.target.value})}
                          className="w-full px-4 py-2.5 border rounded-xl bg-white outline-none text-sm focus:border-satu-primary focus:ring-1 focus:ring-satu-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Masa Berlaku STR</label>
                        <input 
                          type="date" 
                          value={formData.strExp || ''}
                          onChange={(e) => setFormData({...formData, strExp: e.target.value})}
                          className="w-full px-4 py-2.5 border rounded-xl bg-white outline-none text-sm focus:border-satu-primary focus:ring-1 focus:ring-satu-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">No. SIP</label>
                        <input 
                          type="text" 
                          value={formData.sip || ''}
                          onChange={(e) => setFormData({...formData, sip: e.target.value})}
                          className="w-full px-4 py-2.5 border rounded-xl bg-white outline-none text-sm focus:border-satu-primary focus:ring-1 focus:ring-satu-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Masa Berlaku SIP</label>
                        <input 
                          type="date" 
                          value={formData.sipExp || ''}
                          onChange={(e) => setFormData({...formData, sipExp: e.target.value})}
                          className="w-full px-4 py-2.5 border rounded-xl bg-white outline-none text-sm focus:border-satu-primary focus:ring-1 focus:ring-satu-primary"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </div>

            <div className="px-6 py-5 border-t bg-gray-50/50 flex justify-end gap-3 shrink-0">
              <button type="button" onClick={onClose} className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50">
                Batal
              </button>
              <button type="submit" form="employee-form" className="px-6 py-2.5 bg-satu-primary text-white rounded-xl text-sm font-bold shadow-md hover:bg-satu-dark">
                Simpan Pegawai
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
