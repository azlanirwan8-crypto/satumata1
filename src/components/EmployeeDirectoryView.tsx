import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  PlusCircle, 
  Eye, 
  Edit3, 
  Trash2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export interface Employee {
  id: string;
  name: string;
  nip: string;
  nik?: string;
  profession: string;
  jobTitle: string;
  category: 'medis' | 'non-medis';
  status: string;
  img: string;
  email: string; // System email (username)
  phone: string;
  str?: string;
  strExp?: string;
  sip?: string;
  sipExp?: string;
  pob: string;
  dob: string;
  gender: string;
  religion: string;
  marital: string;
  ktpAddress: string;
  address: string;
  expertise: string;
  empStatus: string;
  expYears: string;
  npwp: string;
  emailPersonal: string;
  // New fields for linked user
  password?: string;
  roles?: string[];
  // Education & Experience
  education?: Array<{ level: string; univ: string; year: string }>;
  experience?: Array<{ role: string; instansi: string; thn: string }>;
  // RKK & Schedule (Medical only)
  rkk?: Array<{ action: string; category: string; status: string }>;
  schedule?: Record<string, { active: boolean; slots: Array<{ start: string; end: string }> }>;
  // Training & SKP
  training?: Array<{ name: string; date: string; skp: string }>;
  mandatoryTraining?: Record<string, string>;
  // Salary & Bank
  gajiPokok?: string;
  tunjanganTetap?: string;
  tunjanganTidakTetap?: string;
  insentif?: string;
  bonus?: string;
  komisi?: string;
  benefit?: string;
  fasilitas?: string;
  // Jasmed
  jasmedScheme?: 'fee' | 'point';
  jasmedItems?: Array<{ action: string; qty: number; rate: number }>;
  jasmedPoin?: string;
  jasmedRatePoin?: string;
  // Bank
  bank?: string;
  noRek?: string;
  atasNama?: string;
}

interface EmployeeDirectoryViewProps {
  employees: Employee[];
  onAddEmployee: () => void;
  onEditEmployee: (emp: Employee) => void;
  onDeleteEmployee: (id: string) => void;
  onViewEmployee: (emp: Employee) => void;
  onBack: () => void;
  hideHeader?: boolean;
}

export default function EmployeeDirectoryView({
  employees,
  onAddEmployee,
  onEditEmployee,
  onDeleteEmployee,
  onViewEmployee,
  onBack,
  hideHeader = false
}: EmployeeDirectoryViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filteredEmployees = employees.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.nip.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.profession.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const paginatedEmployees = filteredEmployees.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 flex flex-col h-full"
    >
      {!hideHeader && (
        <div className="bg-white border-b border-gray-200 px-8 py-5 flex justify-between items-end shadow-sm z-10 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="font-display font-bold text-2xl text-satu-dark">Direktori Pegawai</h1>
              <p className="text-sm text-gray-500 mt-1">Database lengkap data diri, pendidikan, dan legalitas pegawai.</p>
            </div>
          </div>
          <button 
            onClick={onAddEmployee}
            className="flex items-center gap-2 bg-satu-primary hover:bg-satu-dark text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all active:scale-95"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Tambah Pegawai</span>
          </button>
        </div>
      )}

      <div className="px-8 py-4 flex flex-wrap gap-4 items-center justify-between bg-gray-50/50 border-b border-gray-200 shrink-0">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Cari Nama, NIP, atau Profesi..." 
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-satu-primary"
          />
        </div>
        {hideHeader && (
          <button 
            onClick={onAddEmployee}
            className="flex items-center gap-2 bg-satu-primary hover:bg-satu-dark text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all active:scale-95"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Tambah Pegawai</span>
          </button>
        )}
      </div>

      <div className="flex-1 overflow-auto custom-scroll px-8 pb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-4">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider border-b border-gray-200 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 font-bold text-satu-dark">Pegawai</th>
                <th className="px-6 py-4 font-bold text-satu-dark">Profesi & Jabatan</th>
                <th className="px-6 py-4 font-bold text-satu-dark">Kategori</th>
                <th className="px-6 py-4 font-bold text-satu-dark">Status</th>
                <th className="px-6 py-4 font-bold text-satu-dark text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors border-b">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-50 text-satu-primary flex items-center justify-center font-bold text-xs">
                        {emp.img}
                      </div>
                      <div>
                        <div className="font-bold text-satu-dark text-sm">{emp.name}</div>
                        <div className="text-xs text-gray-400">NIP: {emp.nip || '-'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-800">{emp.profession}</div>
                    <div className="text-xs text-gray-500">{emp.jobTitle}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-bold capitalize">
                      {emp.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-green-600 text-xs font-bold flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                      {emp.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button 
                        onClick={() => onViewEmployee(emp)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Lihat Detail"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onEditEmployee(emp)}
                        className="p-1.5 text-gray-400 hover:text-satu-gold hover:bg-yellow-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setConfirmDeleteId(emp.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedEmployees.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500 italic">
                    Tidak ada data pegawai ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          
          {/* Pagination */}
          <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
            <p className="text-xs text-gray-500">
              Menampilkan <span className="font-bold text-gray-800">{Math.min((currentPage - 1) * itemsPerPage + 1, filteredEmployees.length)} - {Math.min(currentPage * itemsPerPage, filteredEmployees.length)}</span> dari <span className="font-bold text-gray-800">{filteredEmployees.length}</span> pegawai
            </p>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 border border-gray-200 rounded-lg text-gray-400 hover:bg-white hover:text-satu-primary transition-all disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-400"
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
                        className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${
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
                className="p-1.5 border border-gray-200 rounded-lg text-gray-400 hover:bg-white hover:text-satu-primary transition-all disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-400"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
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
              <h3 className="text-lg font-display font-bold text-gray-900 mb-2">Hapus Data Pegawai?</h3>
              <p className="text-sm text-gray-500 mb-6">Tindakan ini tidak dapat dibatalkan. Data yang dihapus akan hilang dari sistem.</p>
              <div className="flex justify-center gap-3">
                <button 
                  onClick={() => setConfirmDeleteId(null)}
                  className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50"
                >
                  Batal
                </button>
                <button 
                  onClick={() => {
                    onDeleteEmployee(confirmDeleteId);
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
    </motion.div>
  );
}
