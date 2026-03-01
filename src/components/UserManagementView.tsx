import React, { useState } from 'react';
import { ChevronLeft, Users, UserCircle, FileCheck, PlusCircle, Search, Edit3, Trash2, KeyRound, Stethoscope, AlertTriangle, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import EmployeeDirectoryView, { Employee } from './EmployeeDirectoryView';
import CredentialingView from './CredentialingView';

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: string;
  category?: 'medis' | 'non-medis';
  status: string;
  clinic: string;
  avatar: string;
}

import { Clinic } from './ClinicManagementView';

interface UserManagementViewProps {
  users: SystemUser[];
  employees?: Employee[];
  clinics?: Clinic[];
  onAddUser: (user: Partial<SystemUser>) => void;
  onEditUser: (user: SystemUser) => void;
  onDeleteUser: (id: string) => void;
  onResetPassword: (id: string) => void;
  onAddEmployee?: () => void;
  onEditEmployee?: (emp: Employee) => void;
  onDeleteEmployee?: (id: string) => void;
  onViewEmployee?: (emp: Employee) => void;
  onBack: () => void;
}

export default function UserManagementView({ 
  users,
  employees = [],
  clinics = [],
  onAddUser,
  onEditUser,
  onDeleteUser,
  onResetPassword,
  onAddEmployee,
  onEditEmployee,
  onDeleteEmployee,
  onViewEmployee,
  onBack 
}: UserManagementViewProps) {
  const [activeTab, setActiveTab] = useState<'data-user' | 'data-pegawai' | 'monitoring-sip'>('data-user');

  // Stats Calculation
  const totalPegawai = employees.length;
  const tenagaMedis = employees.filter(e => e.category === 'medis').length;
  const strSipExpired = employees.filter(e => {
    const today = new Date();
    const strDate = e.strExp ? new Date(e.strExp) : null;
    const sipDate = e.sipExp ? new Date(e.sipExp) : null;
    return (strDate && strDate < today) || (sipDate && sipDate < today);
  }).length;
  const userSystemCount = users.length;
  
  // Data User State
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null);
  const [formData, setFormData] = useState<Partial<SystemUser>>({
    name: '', email: '', role: '', category: 'medis', clinic: ''
  });
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', role: '', category: 'medis' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: SystemUser) => {
    setEditingUser(user);
    setFormData(user);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      onEditUser({ ...editingUser, ...formData } as SystemUser);
    } else {
      onAddUser(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden">
      <div className="bg-white border-b border-gray-200 px-8 py-6 flex flex-col gap-6 shadow-sm z-10 shrink-0 relative">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="font-display font-bold text-2xl text-satu-dark">Manajemen Pengguna</h1>
              <p className="text-sm text-gray-500 mt-1">Kelola akses dokter, staf faskes, dan administrator sistem.</p>
            </div>
          </div>
        </div>

        {/* Infographic Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Total Pegawai</p>
              <h3 className="text-3xl font-display font-bold text-satu-dark mt-1">{totalPegawai}</h3>
              <p className="text-xs text-green-600 font-bold mt-1 flex items-center gap-1">
                <span className="text-[10px]">↗</span> +2 Bulan Ini
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Tenaga Medis</p>
              <h3 className="text-3xl font-display font-bold text-satu-dark mt-1">{tenagaMedis}</h3>
              <div className="w-24 h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-satu-primary rounded-full" style={{ width: `${totalPegawai > 0 ? (tenagaMedis / totalPegawai) * 100 : 0}%` }}></div>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Stethoscope className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white border border-red-100 rounded-xl p-4 shadow-sm flex items-center justify-between relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-600"></div>
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">STR/SIP Expired</p>
              <h3 className="text-3xl font-display font-bold text-red-600 mt-1">{strSipExpired}</h3>
              <p className="text-xs text-red-600 font-bold mt-1">Perlu tindakan segera</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">User System</p>
              <h3 className="text-3xl font-display font-bold text-satu-dark mt-1">{userSystemCount}</h3>
              <p className="text-xs text-gray-400 mt-1">Active Accounts</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 pt-4 bg-white border-b border-gray-200 shrink-0 z-10 relative shadow-sm">
        <div className="flex gap-6">
          <button 
            onClick={() => setActiveTab('data-user')}
            className={`pb-3 font-bold text-sm border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'data-user' ? 'border-satu-primary text-satu-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            <Users className="w-4 h-4" />
            Data User
          </button>
          <button 
            onClick={() => setActiveTab('data-pegawai')}
            className={`pb-3 font-bold text-sm border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'data-pegawai' ? 'border-satu-primary text-satu-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            <UserCircle className="w-4 h-4" />
            Data Pegawai
          </button>
          <button 
            onClick={() => setActiveTab('monitoring-sip')}
            className={`pb-3 font-bold text-sm border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'monitoring-sip' ? 'border-satu-primary text-satu-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            <FileCheck className="w-4 h-4" />
            Monitoring SIP/STR
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative flex flex-col">
        {activeTab === 'data-user' && (
          <div className="flex-1 overflow-y-auto custom-scroll p-8">
            <div className="flex justify-between items-center mb-6">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Cari nama atau email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-satu-primary/20 focus:border-satu-primary outline-none transition-all text-sm"
                />
              </div>
              <button 
                onClick={handleOpenAdd}
                className="flex items-center gap-2 bg-satu-primary hover:bg-satu-dark text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all active:scale-95"
              >
                <PlusCircle className="w-5 h-5" />
                <span>Tambah User</span>
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex-1">
              <table className="w-full text-sm text-left text-gray-600">
                <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 font-bold text-satu-dark">User</th>
                    <th className="px-6 py-4 font-bold text-satu-dark">Kategori</th>
                    <th className="px-6 py-4 font-bold text-satu-dark">Role</th>
                    <th className="px-6 py-4 font-bold text-satu-dark">Status</th>
                    <th className="px-6 py-4 font-bold text-satu-dark text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                            {user.avatar}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">{user.name}</div>
                            <div className="text-xs text-gray-400">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${user.category === 'medis' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'}`}>
                          {user.category === 'medis' ? 'Medis' : 'Non-Medis'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-700 font-medium">{user.role}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-bold flex items-center gap-1.5 ${user.status === 'Verified' ? 'text-green-600' : 'text-orange-500'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Verified' ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => onResetPassword(user.id)} className="p-1.5 text-orange-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors" title="Reset Password">
                            <KeyRound className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleOpenEdit(user)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button onClick={() => setConfirmDeleteId(user.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Hapus">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500 italic">
                        Tidak ada data user ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {activeTab === 'data-pegawai' && (
          <div className="h-full overflow-hidden">
            <EmployeeDirectoryView 
              employees={employees}
              onAddEmployee={onAddEmployee || (() => {})}
              onEditEmployee={onEditEmployee || (() => {})}
              onDeleteEmployee={onDeleteEmployee || (() => {})}
              onViewEmployee={onViewEmployee || (() => {})}
              onBack={() => setActiveTab('data-user')}
              hideHeader={true}
            />
          </div>
        )}

        {activeTab === 'monitoring-sip' && (
          <div className="h-full overflow-hidden">
            <CredentialingView 
              employees={employees}
              onBack={() => setActiveTab('data-user')}
              hideHeader={true}
            />
          </div>
        )}
      </div>

      {/* Modal Form User */}
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
                  {editingUser ? 'Edit User' : 'Tambah User Baru'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                  <span className="text-gray-500 hover:text-gray-700 font-bold">✕</span>
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="bg-blue-50 text-blue-700 p-3 rounded-xl text-xs mb-4 border border-blue-100">
                  <strong>Info:</strong> Akun ini akan digunakan user untuk login. User dapat melengkapi profil pegawai mereka setelah login.
                </div>
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
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Email</label>
                  <input 
                    type="email" required 
                    value={formData.email || ''}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-2.5 border rounded-xl bg-gray-50 outline-none text-sm focus:border-satu-primary focus:ring-1 focus:ring-satu-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Faskes / Klinik</label>
                  <select 
                    value={formData.clinic || ''} required
                    onChange={(e) => setFormData({...formData, clinic: e.target.value})}
                    className="w-full px-4 py-2.5 border rounded-xl bg-gray-50 outline-none text-sm focus:border-satu-primary focus:ring-1 focus:ring-satu-primary"
                  >
                    <option value="">Pilih Faskes...</option>
                    {clinics.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
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
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Role</label>
                    <select 
                      value={formData.role || ''} required
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      className="w-full px-4 py-2.5 border rounded-xl bg-gray-50 outline-none text-sm focus:border-satu-primary focus:ring-1 focus:ring-satu-primary"
                    >
                      <option value="">Pilih Role...</option>
                      {formData.category === 'medis' ? (
                        <>
                          <option value="Dokter Umum">Dokter Umum</option>
                          <option value="Dokter Spesialis">Dokter Spesialis</option>
                          <option value="Perawat">Perawat</option>
                          <option value="Bidan">Bidan</option>
                        </>
                      ) : (
                        <>
                          <option value="Admin Faskes">Admin Faskes</option>
                          <option value="Pendaftaran">Pendaftaran</option>
                          <option value="Kasir">Kasir</option>
                          <option value="IT Support">IT Support</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>
                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50">
                    Batal
                  </button>
                  <button type="submit" className="px-6 py-2.5 bg-satu-primary text-white rounded-xl text-sm font-bold shadow-md hover:bg-satu-dark">
                    Simpan User
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
              <h3 className="text-lg font-display font-bold text-gray-900 mb-2">Hapus Akses User?</h3>
              <p className="text-sm text-gray-500 mb-6">Tindakan ini tidak dapat dibatalkan. User tidak akan bisa login ke sistem lagi.</p>
              <div className="flex justify-center gap-3">
                <button onClick={() => setConfirmDeleteId(null)} className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50">
                  Batal
                </button>
                <button 
                  onClick={() => {
                    onDeleteUser(confirmDeleteId);
                    setConfirmDeleteId(null);
                  }}
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
