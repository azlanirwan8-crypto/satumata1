import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Printer, 
  Save, 
  Building2, 
  Network, 
  UserCircle, 
  PackageCheck, 
  Receipt, 
  Layers, 
  PlusCircle, 
  Users, 
  Server, 
  Video, 
  Settings2, 
  Plus, 
  X, 
  Info 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Clinic } from './ClinicManagementView';

interface ClinicDetailViewProps {
  clinic: Clinic;
  onBack: () => void;
}

type DetailTab = 'profil' | 'cabang' | 'akun' | 'paket' | 'tagihan' | 'modul';

export default function ClinicDetailView({ clinic, onBack }: ClinicDetailViewProps) {
  const [activeTab, setActiveTab] = useState<DetailTab>('profil');
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [configModulName, setConfigModulName] = useState('');

  const openConfigModul = (name: string) => {
    setConfigModulName(name);
    setIsConfigModalOpen(true);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profil':
        return (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="font-display text-lg font-bold text-gray-800 mb-6 border-b pb-2">Profil Institusi (Pusat)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 flex items-center gap-6 mb-2">
                <div className="w-20 h-20 bg-blue-50 border-2 border-blue-100 text-satu-primary rounded-xl flex items-center justify-center font-display font-bold text-2xl overflow-hidden">
                   {clinic.formData?.logo ? <img src={clinic.formData.logo} alt="Logo" className="w-full h-full object-cover" /> : clinic.name.substring(0, 3).toUpperCase()}
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Logo Institusi</label>
                  <input type="file" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-satu-primary hover:file:bg-blue-100 cursor-pointer" />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Nama Lengkap Institusi</label>
                <input type="text" defaultValue={clinic.name} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-satu-primary/20 outline-none font-bold text-gray-800" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Tingkatan Faskes</label>
                <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-satu-primary/20 outline-none bg-white" defaultValue={clinic.type}>
                  <option value="Klinik Pratama">FKTP (Klinik Pratama)</option>
                  <option value="Klinik Utama">FKRTL (Klinik Utama / RS)</option>
                  <option value="Rumah Sakit">Rumah Sakit</option>
                  <option value="Optik">Optik</option>
                  <option value="Puskesmas">Puskesmas</option>
                  <option value="Klinik Spesialis">Klinik Spesialis</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Kode Registrasi Kemenkes</label>
                <input type="text" defaultValue={clinic.code} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-satu-primary/20 outline-none font-mono" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">No. Induk Berusaha (NIB)</label>
                <input type="text" defaultValue={clinic.formData?.nib || "9120391203192"} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-satu-primary/20 outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Alamat Lengkap</label>
                <textarea rows={3} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-satu-primary/20 outline-none" defaultValue={clinic.location}></textarea>
              </div>
            </div>
          </div>
        );
      case 'cabang':
        return (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <div>
                <h2 className="font-display text-lg font-bold text-gray-800">Manajemen Fasilitas Cabang</h2>
                <p className="text-xs text-gray-500 mt-1">EMR Pasien tergabung dengan pusat, namun antrean dan farmasi dikelola terpisah.</p>
              </div>
              <button className="px-4 py-2 bg-satu-primary text-white text-xs font-bold rounded-lg hover:bg-satu-dark transition-colors shadow-sm flex items-center gap-2">
                <PlusCircle className="w-4 h-4" /> Tambah Cabang
              </button>
            </div>
            <div className="overflow-x-auto border border-gray-100 rounded-xl">
              <table className="w-full text-sm text-left text-gray-600">
                <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                  <tr>
                    <th className="px-4 py-3">Nama Cabang</th>
                    <th className="px-4 py-3">Lokasi / Kota</th>
                    <th className="px-4 py-3 text-center">Status</th>
                    <th className="px-4 py-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-bold text-gray-800">Cabang Depok <span className="block text-[10px] text-gray-400 font-normal font-mono mt-0.5">ID: K-00342</span></td>
                    <td className="px-4 py-3 text-xs">Kota Depok, Jawa Barat</td>
                    <td className="px-4 py-3 text-center"><span className="bg-green-100 text-green-700 px-2 py-1 rounded text-[10px] font-bold uppercase">Aktif</span></td>
                    <td className="px-4 py-3 text-center"><button className="text-satu-primary hover:underline text-xs font-bold">Kelola</button></td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-bold text-gray-800">Cabang Bekasi <span className="block text-[10px] text-gray-400 font-normal font-mono mt-0.5">ID: K-00345</span></td>
                    <td className="px-4 py-3 text-xs">Kota Bekasi, Jawa Barat</td>
                    <td className="px-4 py-3 text-center"><span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-[10px] font-bold uppercase">Verifikasi</span></td>
                    <td className="px-4 py-3 text-center"><button className="text-satu-primary hover:underline text-xs font-bold">Kelola</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'akun':
        return (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="font-display text-lg font-bold text-gray-800 mb-6 border-b pb-2">Manajemen Akun Induk & PIC</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Nama Penanggung Jawab Medis</label>
                <input type="text" defaultValue="Dr. Hendra Utama, Sp.M" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-satu-primary/20 outline-none font-bold" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Jabatan</label>
                <input type="text" defaultValue="Direktur Utama" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-satu-primary/20 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Email Login Utama</label>
                <input type="email" defaultValue="admin@rscemerlang.id" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-satu-primary/20 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Telepon / WA</label>
                <input type="tel" defaultValue="081122334455" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-satu-primary/20 outline-none" />
              </div>
              <div className="md:col-span-2 pt-4 pb-2 border-t border-gray-100 mt-2">
                <h3 className="font-bold text-gray-700 text-sm mb-4">Kontak Keuangan & Penagihan (Opsional)</h3>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Nama Finance/Billing</label>
                <input type="text" defaultValue="Ibu Susi Susanti" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-satu-primary/20 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Email Invoice</label>
                <input type="email" defaultValue="finance@rscemerlang.id" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-satu-primary/20 outline-none" />
              </div>
              <div className="md:col-span-2 pt-4 flex gap-2">
                <button className="px-5 py-2 bg-orange-50 text-orange-600 border border-orange-200 font-bold text-xs rounded-lg hover:bg-orange-100 transition-colors">Kirim Link Reset Password Admin</button>
              </div>
            </div>
          </div>
        );
      case 'paket':
        return (
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="font-display text-lg font-bold text-gray-800 mb-6 border-b pb-2">Status & Paket Berlangganan</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Paket Aktif</label>
                  <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-satu-primary/20 outline-none font-bold text-satu-primary bg-white">
                    <option>Starter</option>
                    <option selected>Pro</option>
                    <option>Enterprise</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Siklus Penagihan</label>
                  <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-satu-primary/20 outline-none bg-white">
                    <option>Bulanan (Monthly)</option>
                    <option selected>Tahunan (Annually)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Mulai Berlangganan</label>
                  <input type="date" defaultValue="2025-06-01" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-satu-primary/20 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Jatuh Tempo (Expired)</label>
                  <input type="date" defaultValue="2026-06-01" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-satu-primary/20 outline-none text-red-600 font-bold" />
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="font-display text-lg font-bold text-gray-800 mb-6 border-b pb-2">Pemakaian Kuota Sistem</h2>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <p className="text-sm font-bold text-gray-700"><Users className="w-4 h-4 inline mr-1 text-gray-400" /> Akun Pegawai / User Aktif</p>
                    <p className="text-xs font-bold"><span className="text-satu-primary">12</span> / 15 Maksimal</p>
                  </div>
                  <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-satu-primary h-2.5 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <p className="text-sm font-bold text-gray-700"><Server className="w-4 h-4 inline mr-1 text-gray-400" /> Hit API SatuSehat (Bulan Ini)</p>
                    <p className="text-xs font-bold"><span className="text-orange-500">8.500</span> / 10.000 Request</p>
                  </div>
                  <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-2">API V-Claim BPJS tidak dibatasi (Unlimited).</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'tagihan':
        return (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h2 className="font-display text-lg font-bold text-gray-800">Histori Tagihan (Invoices)</h2>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-1">
                <Plus className="w-3 h-3" /> Buat Invoice
              </button>
            </div>
            <div className="overflow-x-auto border border-gray-100 rounded-xl">
              <table className="w-full text-sm text-left text-gray-600">
                <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                  <tr>
                    <th className="px-4 py-3">No. Invoice</th>
                    <th className="px-4 py-3">Tanggal</th>
                    <th className="px-4 py-3">Rincian Paket & Add-ons</th>
                    <th className="px-4 py-3">Nominal</th>
                    <th className="px-4 py-3 text-center">Status</th>
                    <th className="px-4 py-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-satu-primary text-xs">INV-25-06-001</td>
                    <td className="px-4 py-3 text-xs">01 Jun 2025</td>
                    <td className="px-4 py-3 text-xs text-gray-500">Base Pro + 2 Cabang Ext.</td>
                    <td className="px-4 py-3 font-bold">Rp 2.500.000</td>
                    <td className="px-4 py-3 text-center"><span className="bg-green-100 text-green-700 px-2 py-1 rounded text-[10px] font-bold uppercase">Lunas</span></td>
                    <td className="px-4 py-3 text-center"><button className="text-blue-500 hover:underline text-xs font-bold">Unduh PDF</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'modul':
        return (
          <div className="space-y-4">
            <h2 className="font-display text-lg font-bold text-gray-800 mb-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-b pb-4">Konfigurasi Akses Modul</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {/* Modul 1 */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow relative group">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-satu-primary flex items-center justify-center"><Users className="w-5 h-5" /></div>
                    <div><h4 className="font-bold text-gray-800 text-sm">EMR & Pendaftaran</h4></div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-satu-primary"></div>
                  </label>
                </div>
                <p className="text-xs text-gray-500 mb-4 flex-1">Modul inti SOAP, rekam medis, dan manajemen antrean pasien.</p>
                <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                  <span className="text-[10px] text-gray-400 font-bold bg-gray-100 px-2 py-0.5 rounded">6 Kapabilitas</span>
                  <button onClick={() => openConfigModul('EMR & Pendaftaran')} className="text-xs font-bold text-satu-primary hover:text-satu-dark flex items-center gap-1"><Settings2 className="w-3 h-3" /> Konfigurasi</button>
                </div>
              </div>

              {/* Modul 2 */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow relative group">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-50 text-satu-success flex items-center justify-center"><Receipt className="w-5 h-5" /></div>
                    <div><h4 className="font-bold text-gray-800 text-sm">Billing & Farmasi</h4></div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-satu-primary"></div>
                  </label>
                </div>
                <p className="text-xs text-gray-500 mb-4 flex-1">Manajemen inventori obat, resep elektronik, dan kasir.</p>
                <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                  <span className="text-[10px] text-gray-400 font-bold bg-gray-100 px-2 py-0.5 rounded">4 Kapabilitas</span>
                  <button onClick={() => openConfigModul('Billing & Farmasi')} className="text-xs font-bold text-satu-primary hover:text-satu-dark flex items-center gap-1"><Settings2 className="w-3 h-3" /> Konfigurasi</button>
                </div>
              </div>

              {/* Modul 3 */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow relative group">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center"><Network className="w-5 h-5" /></div>
                    <div><h4 className="font-bold text-gray-800 text-sm">Bridging Kemenkes</h4></div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-satu-primary"></div>
                  </label>
                </div>
                <p className="text-xs text-gray-500 mb-4 flex-1">Koneksi API langsung dengan BPJS V-Claim dan SatuSehat.</p>
                <div className="border-t border-gray-100 pt-3 flex justify-between items-center opacity-50">
                  <span className="text-[10px] text-gray-400 font-bold bg-gray-100 px-2 py-0.5 rounded">2 Kapabilitas</span>
                  <button disabled className="text-xs font-bold text-gray-400 flex items-center gap-1 cursor-not-allowed"><Settings2 className="w-3 h-3" /> Konfigurasi</button>
                </div>
              </div>

              {/* Modul 4 */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow relative group">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center"><Video className="w-5 h-5" /></div>
                    <div><h4 className="font-bold text-gray-800 text-sm">Telekonsultasi</h4></div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-satu-primary"></div>
                  </label>
                </div>
                <p className="text-xs text-gray-500 mb-4 flex-1">Fitur konsultasi jarak jauh (video call) terintegrasi EMR.</p>
                <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                  <span className="text-[10px] text-gray-400 font-bold bg-gray-100 px-2 py-0.5 rounded">3 Kapabilitas</span>
                  <button onClick={() => openConfigModul('Telekonsultasi')} className="text-xs font-bold text-satu-primary hover:text-satu-dark flex items-center gap-1"><Settings2 className="w-3 h-3" /> Konfigurasi</button>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50/50 overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-5 flex justify-between items-center shadow-sm z-10 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 px-2 py-0.5 rounded text-gray-500">Detail Klien</span>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                clinic.contractStatus === 'Active' ? 'bg-green-100 text-green-700 border-green-200' :
                clinic.contractStatus === 'Expiring' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                'bg-red-100 text-red-700 border-red-200'
              }`}>Status: {clinic.contractStatus}</span>
            </div>
            <h1 className="font-display font-bold text-2xl text-satu-dark">{clinic.name}</h1>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-50 shadow-sm flex items-center gap-2">
            <Printer className="w-4 h-4" /> Cetak Profil
          </button>
          <button className="px-5 py-2 bg-satu-primary text-white rounded-xl text-xs font-bold hover:bg-satu-dark shadow-md flex items-center gap-2">
            <Save className="w-4 h-4" /> Simpan
          </button>
        </div>
      </div>

      {/* Detail Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 shrink-0 p-4 overflow-y-auto custom-scroll">
          <nav className="space-y-1">
            <button onClick={() => setActiveTab('profil')} className={`w-full flex items-center justify-between px-4 py-3 text-sm rounded-lg transition-all ${activeTab === 'profil' ? 'bg-blue-50 text-satu-primary font-bold border-l-4 border-satu-primary rounded-l-none' : 'text-gray-600 hover:bg-gray-50'}`}>
              <span className="flex items-center gap-3"><Building2 className="w-4 h-4" /> Profil Institusi</span>
            </button>
            <button onClick={() => setActiveTab('cabang')} className={`w-full flex items-center justify-between px-4 py-3 text-sm rounded-lg transition-all ${activeTab === 'cabang' ? 'bg-blue-50 text-satu-primary font-bold border-l-4 border-satu-primary rounded-l-none' : 'text-gray-600 hover:bg-gray-50'}`}>
              <span className="flex items-center gap-3"><Network className="w-4 h-4" /> Daftar Cabang</span>
              <span className="text-[10px] bg-satu-primary/10 text-satu-primary font-bold px-2 py-0.5 rounded">2</span>
            </button>
            <button onClick={() => setActiveTab('akun')} className={`w-full flex items-center justify-between px-4 py-3 text-sm rounded-lg transition-all ${activeTab === 'akun' ? 'bg-blue-50 text-satu-primary font-bold border-l-4 border-satu-primary rounded-l-none' : 'text-gray-600 hover:bg-gray-50'}`}>
              <span className="flex items-center gap-3"><UserCircle className="w-4 h-4" /> Akun & PIC</span>
            </button>
            <button onClick={() => setActiveTab('paket')} className={`w-full flex items-center justify-between px-4 py-3 text-sm rounded-lg transition-all ${activeTab === 'paket' ? 'bg-blue-50 text-satu-primary font-bold border-l-4 border-satu-primary rounded-l-none' : 'text-gray-600 hover:bg-gray-50'}`}>
              <span className="flex items-center gap-3"><PackageCheck className="w-4 h-4" /> Paket & Kuota</span>
            </button>
            <button onClick={() => setActiveTab('tagihan')} className={`w-full flex items-center justify-between px-4 py-3 text-sm rounded-lg transition-all ${activeTab === 'tagihan' ? 'bg-blue-50 text-satu-primary font-bold border-l-4 border-satu-primary rounded-l-none' : 'text-gray-600 hover:bg-gray-50'}`}>
              <span className="flex items-center gap-3"><Receipt className="w-4 h-4" /> Histori Tagihan</span>
            </button>
            <button onClick={() => setActiveTab('modul')} className={`w-full flex items-center justify-between px-4 py-3 text-sm rounded-lg transition-all ${activeTab === 'modul' ? 'bg-blue-50 text-satu-primary font-bold border-l-4 border-satu-primary rounded-l-none' : 'text-gray-600 hover:bg-gray-50'}`}>
              <span className="flex items-center gap-3"><Layers className="w-4 h-4" /> Aktivasi Modul</span>
            </button>
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 overflow-y-auto custom-scroll p-8 bg-gray-50/50">
          {renderTabContent()}
        </main>
      </div>

      {/* Config Modal */}
      <AnimatePresence>
        {isConfigModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="px-6 py-5 border-b bg-gray-50 flex justify-between items-center shrink-0">
                <div>
                  <h3 className="text-lg font-display font-bold text-satu-dark">Konfigurasi Modul</h3>
                  <p className="text-xs text-gray-500 mt-1">Mengatur kapabilitas spesifik untuk <span className="font-bold text-gray-800">{configModulName}</span></p>
                </div>
                <button onClick={() => setIsConfigModalOpen(false)} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scroll p-6 bg-white space-y-4">
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-4">
                  <p className="text-xs text-blue-800 flex items-center gap-1">
                    <Info className="w-4 h-4" /> Centang kapabilitas di bawah ini untuk mengaktifkan fitur terkait bagi faskes ini.
                  </p>
                </div>
                
                <div className="space-y-3">
                  {['Akses Pendaftaran & Antrean', 'Akses Rekam Medis (EMR)', 'Integrasi Tanda Tangan Digital', 'Resep Elektronik Mandiri'].map((cap, idx) => (
                    <label key={idx} className="flex items-center justify-between p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked={idx < 3} className="w-4 h-4 text-satu-primary rounded focus:ring-satu-primary border-gray-300" />
                        <div>
                          <h4 className="text-sm font-bold text-gray-800">{cap}</h4>
                          <p className="text-xs text-gray-500">Deskripsi singkat fitur {cap.toLowerCase()}.</p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3 shrink-0">
                <button onClick={() => setIsConfigModalOpen(false)} className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-100 transition-colors">Batal</button>
                <button onClick={() => setIsConfigModalOpen(false)} className="px-6 py-2.5 bg-satu-primary text-white rounded-xl text-sm font-bold shadow-md hover:bg-satu-dark transition-colors flex items-center gap-2">
                  <Save className="w-4 h-4" /> Simpan Konfigurasi
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
