import React, { useState, useEffect } from 'react';
import FaskesModal from './FaskesModal';
import ClinicManagementView, { Clinic } from './ClinicManagementView';
import EmployeeDirectoryView, { Employee } from './EmployeeDirectoryView';
import EmployeeFormModal from './EmployeeFormModal';
import UserManagementView, { SystemUser } from './UserManagementView';
import CredentialingView from './CredentialingView';
import MasterDataView from './MasterDataView';
import MarketplaceView from './MarketplaceView';

interface SuperAdminDashboardProps {
  onLogout: () => void;
  userName?: string;
}

interface Approval {
  id: number;
  type: string;
  typeColor: string;
  name: string;
  desc: string;
}

interface Notification {
  id: number;
  type: string;
  typeColor: string;
  title: string;
  desc: string;
  isCritical: boolean;
}

interface UserLog {
  id: number;
  user: string;
  action: string;
  time: string;
  color: string;
}

export default function SuperAdminDashboard({ onLogout, userName = 'Administrator' }: SuperAdminDashboardProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeView, setActiveView] = useState<'dashboard' | 'clinic-management' | 'add-faskes' | 'employee-directory' | 'credentialing' | 'user-management' | 'master-data' | 'marketplace'>('dashboard');
  const [activeAddOns, setActiveAddOns] = useState<string[]>(['Integrasi SATUSEHAT']);

  const toggleAddOn = (title: string) => {
    setActiveAddOns(prev => 
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    );
  };

  const [greeting, setGreeting] = useState('Selamat Pagi,');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ title: '', desc: '' });
  
  const [clinics, setClinics] = useState<Clinic[]>([
    {
      id: 'c1',
      name: 'Klinik Mata Sentosa A',
      code: 'K-001',
      location: 'Jakarta Selatan, DKI Jakarta',
      type: 'Klinik Utama',
      contractStatus: 'Active',
      accountStatus: 'Verified',
      lastActivity: '2 jam yang lalu'
    },
    {
      id: 'c2',
      name: 'Klinik Mata Sentosa B',
      code: 'K-002',
      location: 'Bandung, Jawa Barat',
      type: 'Klinik Utama',
      contractStatus: 'Active',
      accountStatus: 'Verified',
      lastActivity: '5 jam yang lalu'
    }
  ]);

  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: 'e1',
      name: 'Dr. Ahmad, Sp.M',
      nip: '198501012010011001',
      profession: 'Dokter Spesialis Mata',
      jobTitle: 'Dokter Spesialis',
      category: 'medis',
      status: 'Active',
      img: 'AH',
      email: 'dokter1@gmail.com',
      phone: '081234567890',
      str: 'STR-12345',
      strExp: '2028-12-31',
      sip: 'SIP-12345',
      sipExp: '2028-12-31',
      pob: 'Jakarta',
      dob: '1985-01-01',
      gender: 'Laki-laki',
      religion: 'Islam',
      marital: 'Kawin',
      ktpAddress: 'Jl. Melati No. 1, Jakarta',
      address: 'Jl. Melati No. 1, Jakarta',
      expertise: 'Katarak & Refraksi',
      empStatus: 'Tetap',
      expYears: '12',
      npwp: '12.345.678.9-012.000',
      emailPersonal: 'ahmad@personal.com'
    },
    {
      id: 'e2',
      name: 'Dr. Siti, Sp.M',
      nip: '198805052015012002',
      profession: 'Dokter Spesialis Mata',
      jobTitle: 'Dokter Spesialis',
      category: 'medis',
      status: 'Active',
      img: 'SI',
      email: 'dokter2@gmail.com',
      phone: '081298765432',
      str: 'STR-67890',
      strExp: '2027-06-30',
      sip: 'SIP-67890',
      sipExp: '2027-06-30',
      pob: 'Bandung',
      dob: '1988-05-05',
      gender: 'Perempuan',
      religion: 'Islam',
      marital: 'Kawin',
      ktpAddress: 'Jl. Mawar No. 5, Bandung',
      address: 'Jl. Mawar No. 5, Bandung',
      expertise: 'Glaukoma',
      empStatus: 'Tetap',
      expYears: '8',
      npwp: '98.765.432.1-098.000',
      emailPersonal: 'siti@personal.com'
    }
  ]);

  const [systemUsers, setSystemUsers] = useState<SystemUser[]>([
    {
      id: 'u1',
      name: 'Dr. Ahmad, Sp.M',
      email: 'dokter1@gmail.com',
      role: 'Dokter Spesialis',
      category: 'medis',
      status: 'Verified',
      clinic: 'Klinik Mata Sentosa A',
      avatar: 'AH'
    },
    {
      id: 'u2',
      name: 'Dr. Siti, Sp.M',
      email: 'dokter2@gmail.com',
      role: 'Dokter Spesialis',
      category: 'medis',
      status: 'Verified',
      clinic: 'Klinik Mata Sentosa B',
      avatar: 'SI'
    },
    {
      id: 'u3',
      name: 'Admin Klinik A',
      email: 'admin1@gmail.com',
      role: 'Admin Faskes',
      category: 'non-medis',
      status: 'Verified',
      clinic: 'Klinik Mata Sentosa A',
      avatar: 'AA'
    },
    {
      id: 'u4',
      name: 'Admin Klinik B',
      email: 'admin2@gmail.com',
      role: 'Admin Faskes',
      category: 'non-medis',
      status: 'Verified',
      clinic: 'Klinik Mata Sentosa B',
      avatar: 'AB'
    }
  ]);

  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [isViewOnly, setIsViewOnly] = useState(false);

  // Employee Modal State
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  // Mock data for dashboard stats to simulate "real" data
  const [activeUsers] = useState(0);
  const [criticalTickets] = useState(0);

  const [approvals] = useState<Approval[]>([]);

  const [notifications] = useState<Notification[]>([]);

  const [userLogs, setUserLogs] = useState<UserLog[]>([
    { id: 1, user: 'Admin Klinik A', action: 'Login ke sistem', time: '10 menit yang lalu', color: 'blue' },
    { id: 2, user: 'Dr. Ahmad, Sp.M', action: 'Mengakses rekam medis pasien', time: '25 menit yang lalu', color: 'green' },
    { id: 3, user: 'Super Admin', action: 'Menambahkan faskes baru', time: '1 jam yang lalu', color: 'purple' }
  ]);

  const handleAddLog = (user: string, action: string, color: string = 'blue') => {
    const newLog: UserLog = {
      id: Date.now(),
      user,
      action,
      time: 'Baru saja',
      color
    };
    setUserLogs(prev => [newLog, ...prev]);
  };

  const handleSaveEmployee = (data: Partial<Employee>) => {
    if (editingEmployee) {
      setEmployees(prev => prev.map(e => e.id === editingEmployee.id ? { ...e, ...data } as Employee : e));
      setToastMessage({ title: 'Berhasil Diperbarui', desc: 'Data pegawai telah diperbarui.' });
      handleAddLog(userName, `Memperbarui data pegawai: ${data.name || editingEmployee.name}`, 'orange');
    } else {
      const newEmployee: Employee = {
        id: Math.random().toString(36).substr(2, 9),
        name: data.name || '',
        nip: data.nip || '',
        profession: data.profession || '',
        jobTitle: data.jobTitle || '',
        category: data.category || 'medis',
        status: data.status || 'Active',
        img: (data.name || 'E').substring(0, 2).toUpperCase(),
        email: data.email || '',
        phone: data.phone || '',
        str: data.str,
        strExp: data.strExp,
        sip: data.sip,
        sipExp: data.sipExp,
        pob: 'Jakarta', // Default
        dob: '1990-01-01', // Default
        gender: 'Laki-laki', // Default
        religion: 'Islam', // Default
        marital: 'Belum Kawin', // Default
        ktpAddress: 'Alamat KTP', // Default
        address: 'Alamat Domisili', // Default
        expertise: 'Umum', // Default
        empStatus: 'Tetap', // Default
        expYears: '0', // Default
        npwp: '00.000.000.0-000.000', // Default
        emailPersonal: data.email || ''
      };
      setEmployees(prev => [newEmployee, ...prev]);
      setToastMessage({ title: 'Berhasil Ditambahkan', desc: 'Pegawai baru telah ditambahkan.' });
      handleAddLog(userName, `Menambahkan pegawai baru: ${newEmployee.name}`, 'green');
    }
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    setIsEmployeeModalOpen(false);
    setEditingEmployee(null);
  };

  const handleSaveFaskes = (data: any) => {
    console.log('Saving Faskes Data:', data);
    
    if (selectedClinic && !isViewOnly) {
      // Edit existing
      setClinics(prev => prev.map(c => c.id === selectedClinic.id ? {
        ...c,
        name: data.namaKlinik || c.name,
        code: data.kodeFaskes || c.code,
        location: `${data.kota || ''}, ${data.provinsi || ''}` || c.location,
        type: data.jenisKlinik || c.type,
        formData: data
      } : c));
      setToastMessage({ title: 'Berhasil Diperbarui!', desc: 'Data Fasilitas Kesehatan telah diperbarui.' });
      handleAddLog(userName, `Memperbarui data faskes: ${data.namaKlinik || selectedClinic.name}`, 'orange');
    } else if (!selectedClinic) {
      // Add new
      const newClinic: Clinic = {
        id: Math.random().toString(36).substr(2, 9),
        name: data.namaKlinik || 'Faskes Baru',
        code: data.kodeFaskes || `F-${Math.floor(Math.random() * 100000)}`,
        location: `${data.kota || 'Kota'}, ${data.provinsi || 'Provinsi'}`,
        type: data.jenisKlinik || 'Klinik',
        contractStatus: 'Active',
        accountStatus: 'Pending',
        lastActivity: 'Baru saja',
        formData: data
      };
      setClinics(prev => [newClinic, ...prev]);
      setToastMessage({ title: 'Berhasil Disimpan!', desc: 'Data Fasilitas Kesehatan telah didaftarkan ke sistem.' });
      handleAddLog(userName, `Mendaftarkan faskes baru: ${newClinic.name}`, 'green');
    }

    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    setSelectedClinic(null);
    setIsViewOnly(false);
  };

  const handleDeleteFaskes = (id: string) => {
    const clinic = clinics.find(c => c.id === id);
    setClinics(prev => prev.filter(c => c.id !== id));
    setToastMessage({ title: 'Berhasil Dihapus!', desc: 'Data Fasilitas Kesehatan telah dihapus.' });
    handleAddLog(userName, `Menghapus data faskes: ${clinic?.name || 'Unknown'}`, 'red');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleEditFaskes = (clinic: Clinic) => {
    setSelectedClinic(clinic);
    setIsViewOnly(false);
    setActiveView('add-faskes');
  };

  const handleViewFaskes = (clinic: Clinic) => {
    setSelectedClinic(clinic);
    setIsViewOnly(true);
    setActiveView('add-faskes');
  };

  const openAddFaskes = () => {
    setSelectedClinic(null);
    setIsViewOnly(false);
    setActiveView('add-faskes');
  };

  useEffect(() => {
    const hour = new Date().getHours();
    let g = "Selamat Pagi,";
    if (hour >= 11 && hour < 15) g = "Selamat Siang,";
    else if (hour >= 15 && hour < 18) g = "Selamat Sore,";
    else if (hour >= 18 || hour < 4) g = "Selamat Malam,";
    setGreeting(g);
  }, []);

  const isFullPage = ['clinic-management', 'user-management', 'employee-directory', 'credentialing', 'master-data', 'marketplace'].includes(activeView);

  return (
    <div className="bg-satu-surface h-screen font-body text-gray-700 flex flex-col animate-fade-in overflow-hidden">
      {/* 1. HEADER */}
      <header className="bg-satu-dark text-white sticky top-0 z-50 shadow-md shrink-0">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img 
              src="https://noviandri.com/wp-content/uploads/2025/11/SATUMATA-e1763948072282.png" 
              alt="SATUMATA Logo" 
              className="h-10 w-auto object-contain rounded-xl bg-white/10 p-1"
              referrerPolicy="no-referrer"
            />
            <div className="flex flex-col">
              <span className="font-display font-bold text-lg tracking-wider leading-none text-white">SATUMATA</span>
              <span className="font-light text-white/70 text-[10px] uppercase tracking-widest leading-none">Super Admin Console</span>
            </div>
          </div>

          {/* Profile & Global Settings */}
          <div className="flex items-center gap-6">
            {/* Notifications */}
            <button className="relative p-2 text-white/70 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-satu-error rounded-full border-2 border-satu-dark"></span>
            </button>

            {/* Profile */}
            <div className="relative pl-4 border-l border-white/10">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)} 
                className="flex items-center gap-3 hover:bg-white/10 p-2 rounded-xl transition-colors focus:outline-none"
              >
                <div className="text-right hidden sm:block">
                  <p className="font-display font-bold text-sm leading-tight">Administrator</p>
                  <p className="text-[10px] text-satu-gold font-bold tracking-wide">SYSTEM OWNER</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-satu-gold border-2 border-white flex items-center justify-center text-satu-dark font-bold font-display shadow-sm">
                  AD
                </div>
              </button>
              
              {/* Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-scale-in origin-top-right">
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Pengaturan Global</a>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button 
                    onClick={onLogout}
                    className="w-full text-left block px-4 py-2 text-sm text-satu-error hover:bg-red-50"
                  >
                    Keluar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className={`flex-1 w-full ${isFullPage ? 'overflow-hidden' : 'overflow-y-auto'}`}>
        <div className={`${isFullPage ? 'h-full' : 'max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8'}`}>
          {activeView === 'dashboard' ? (
          <React.Fragment>
            {/* 2. HERO: CONTROL TOWER */}
        <div className="relative bg-gradient-to-r from-slate-800 to-satu-dark rounded-3xl p-8 text-white shadow-2xl overflow-hidden">
          {/* Background Elements */}
          <div className="absolute right-0 top-0 w-96 h-96 bg-satu-primary/30 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-satu-gold/20 text-satu-gold border border-satu-gold/30 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">
                  Ecosystem Control Center
                </span>
                <span className="flex items-center gap-1.5 text-xs text-green-400 font-medium bg-green-900/30 px-2 py-0.5 rounded-full border border-green-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                  System Stable
                </span>
              </div>
              <h1 className="font-display font-bold text-3xl md:text-4xl leading-tight">
                <span className="text-white/70 font-light text-2xl">{greeting}</span> {userName}
              </h1>
              <p className="text-white/60 mt-2 text-sm max-w-3xl">
                Memantau <strong className="text-white">{clinics.length} Fasilitas Kesehatan</strong> dan <strong className="text-white">{activeUsers.toLocaleString()} User Aktif</strong>. Terdapat <strong className="text-satu-gold">{criticalTickets} Tiket Kritikal</strong> yang memerlukan perhatian segera.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-3">
            </div>
          </div>
        </div>

        {/* 3. MAIN LAYOUT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            
          {/* LEFT COLUMN (3/12): ALERTS & SYSTEM HEALTH */}
          <div className="lg:col-span-3 space-y-6">
              
            {/* A. PENDING APPROVALS */}
            <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-100 flex flex-col h-[320px]">
              <div className="flex justify-between items-center mb-4 shrink-0">
                <h3 className="font-display font-bold text-sm text-satu-dark flex items-center gap-2">
                  <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Persetujuan
                </h3>
                <span className="bg-orange-100 text-orange-600 text-[10px] font-bold px-2 py-0.5 rounded-full">{approvals.length}</span>
              </div>
              
              <div className="space-y-3 overflow-y-auto no-scrollbar flex-1 pr-1">
                {approvals.map((approval) => (
                  <div key={approval.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100 relative">
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-[9px] font-bold text-${approval.typeColor}-600 bg-${approval.typeColor}-100 px-2 py-0.5 rounded`}>{approval.type}</span>
                    </div>
                    <p className="text-xs font-bold text-gray-800">{approval.name}</p>
                    <p className="text-[10px] text-gray-500 mb-2">{approval.desc}</p>
                    <div className="flex gap-2">
                      <button className="flex-1 py-1.5 bg-satu-primary text-white text-[10px] font-bold rounded hover:bg-blue-700 transition-colors">Approve</button>
                      <button className="flex-1 py-1.5 border border-gray-300 text-gray-600 text-[10px] font-bold rounded hover:bg-gray-100 transition-colors">Detail</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* B. PRIORITY ALERTS */}
            <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-100 flex flex-col h-[320px]">
              <div className="flex justify-between items-center mb-4 shrink-0">
                <h3 className="font-display font-bold text-sm text-satu-dark">Notifikasi Prioritas</h3>
                <span className="bg-satu-error text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{notifications.length}</span>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 pr-1">
                {notifications.map((notif) => (
                  <div key={notif.id} className={`p-3 rounded-xl bg-${notif.typeColor}-50 border border-${notif.typeColor}-100 relative group cursor-pointer hover:bg-${notif.typeColor}-100 transition-colors`}>
                    {notif.isCritical && <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-satu-error animate-pulse"></div>}
                    <p className={`text-[10px] font-bold text-${notif.typeColor}-700 uppercase tracking-wider mb-1`}>{notif.type}</p>
                    <p className="text-xs font-bold text-gray-800">{notif.title}</p>
                    <p className="text-[10px] text-gray-600 mt-1">{notif.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* D. RECENT ACTIVITY */}
            <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-100 h-[320px] flex flex-col">
              <h3 className="font-display font-bold text-sm text-satu-dark mb-4 flex items-center gap-2 shrink-0">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Log Aktivitas User
              </h3>
              <div className="space-y-4 overflow-y-auto no-scrollbar flex-1 pr-1">
                {userLogs.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 text-xs italic">
                    Belum ada aktivitas tercatat.
                  </div>
                ) : (
                  userLogs.map((log) => (
                    <div key={log.id} className="flex gap-3 items-start animate-slide-in-right">
                      <div className={`w-2 h-2 rounded-full bg-${log.color}-500 mt-1.5 shrink-0`}></div>
                      <div>
                        <p className="text-xs font-bold text-gray-700">{log.user}</p>
                        <p className="text-[10px] text-gray-500 leading-tight">{log.action}</p>
                        <span className="text-[9px] text-gray-400">{log.time}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (9/12): STATS & MODULES */}
          <div className="lg:col-span-9 space-y-8">
              
            {/* 1. SNAPSHOT CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 font-medium">Total Faskes</p>
                  <p className="text-2xl font-display font-bold text-satu-dark">152</p>
                </div>
                <div className="w-10 h-10 bg-blue-50 text-satu-primary rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 font-medium">Total Dokter</p>
                  <p className="text-2xl font-display font-bold text-satu-dark">842</p>
                </div>
                <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                  </svg>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between relative overflow-hidden group">
                <div className="absolute inset-0 bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  <p className="text-xs text-gray-500 font-medium group-hover:text-red-700">Tiket Support</p>
                  <div className="flex items-end gap-1">
                    <p className="text-2xl font-display font-bold text-gray-800">24</p>
                    <p className="text-xs font-bold text-red-600 mb-1.5 animate-pulse">5 Critical</p>
                  </div>
                </div>
                <div className="relative z-10 w-10 h-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path>
                  </svg>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 font-medium">Pending Bayar</p>
                  <p className="text-2xl font-display font-bold text-satu-error">Rp 45jt</p>
                </div>
                <div className="w-10 h-10 bg-red-50 text-satu-error rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-2 h-2 bg-satu-gold rounded-full m-2"></div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">MRR Add-ons</p>
                  <p className="text-2xl font-display font-bold text-satu-gold">485<span className="text-sm text-gray-400">jt</span></p>
                </div>
                <div className="w-10 h-10 bg-yellow-50 text-satu-gold rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* 2. DETAILED CHART */}
            <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="font-display font-bold text-lg text-satu-dark flex items-center gap-2">
                    <svg className="w-5 h-5 text-satu-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z"></path>
                    </svg>
                    Tren Pertumbuhan Transaksi
                  </h2>
                  <p className="text-xs text-gray-500 mt-1 ml-7">Analisa pendapatan platform (Semester 1 2026).</p>
                </div>
                <div className="flex items-center gap-3">
                  <select className="bg-gray-50 border border-gray-200 text-xs font-bold text-gray-600 rounded-lg px-3 py-1.5 focus:outline-none focus:border-satu-primary cursor-pointer">
                    <option>Semester 1 2026</option>
                    <option>Semester 2 2025</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 relative h-48 flex items-end justify-between gap-3 px-2 border-b border-l border-gray-100">
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20 z-0">
                    <div className="w-full h-px bg-gray-300 border-t border-dashed"></div>
                    <div className="w-full h-px bg-gray-300 border-t border-dashed"></div>
                    <div className="w-full h-px bg-gray-300 border-t border-dashed"></div>
                    <div className="w-full h-px bg-transparent"></div>
                  </div>

                  <div className="w-full bg-blue-100 rounded-t-md relative group h-[40%] hover:bg-blue-200 transition-all cursor-pointer z-10 bar-animate">
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 opacity-0 group-hover:opacity-100 bg-white shadow-sm px-1 rounded-sm">Jan</div>
                  </div>
                  <div className="w-full bg-blue-200 rounded-t-md relative group h-[55%] hover:bg-blue-300 transition-all cursor-pointer z-10 bar-animate">
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 opacity-0 group-hover:opacity-100 bg-white shadow-sm px-1 rounded-sm">Feb</div>
                  </div>
                  <div className="w-full bg-blue-300 rounded-t-md relative group h-[45%] hover:bg-blue-400 transition-all cursor-pointer z-10 bar-animate">
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 opacity-0 group-hover:opacity-100 bg-white shadow-sm px-1 rounded-sm">Mar</div>
                  </div>
                  <div className="w-full bg-satu-primary rounded-t-md relative group h-[70%] hover:bg-blue-800 transition-all cursor-pointer z-10 bar-animate">
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 opacity-0 group-hover:opacity-100 bg-white shadow-sm px-1 rounded-sm">Apr</div>
                  </div>
                  <div className="w-full bg-blue-400 rounded-t-md relative group h-[60%] hover:bg-blue-500 transition-all cursor-pointer z-10 bar-animate">
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 opacity-0 group-hover:opacity-100 bg-white shadow-sm px-1 rounded-sm">Mei</div>
                  </div>
                  <div className="w-full bg-satu-gold rounded-t-md relative group h-[85%] hover:bg-yellow-500 transition-all cursor-pointer z-10 bar-animate">
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 opacity-0 group-hover:opacity-100 bg-white shadow-sm px-1 rounded-sm">Jun</div>
                  </div>
                </div>

                <div className="flex flex-col justify-center gap-6 border-l border-gray-100 pl-8">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1 font-bold">Total Transaksi</p>
                    <p className="text-3xl font-display font-bold text-satu-dark">Rp 4.2 M</p>
                    <span className="inline-flex items-center text-[10px] text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded mt-1">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                      </svg>
                      +18% vs Last Sem
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1 font-bold">Pengguna Baru</p>
                    <p className="text-3xl font-display font-bold text-satu-dark">1,240</p>
                    <span className="inline-flex items-center text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded mt-1">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                      </svg>
                      +8% vs Last Sem
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. STRATEGIC MODULE GRID */}
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-card border border-gray-100">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="font-display font-bold text-xl text-satu-dark">Manajemen & Kontrol</h2>
                  <p className="text-gray-500 text-sm">Akses modul strategis untuk pengelolaan ekosistem.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                <button 
                  onClick={() => setActiveView('clinic-management')}
                  className="bg-white rounded-xl border border-gray-200 p-5 hover:border-satu-primary hover:ring-1 hover:ring-satu-primary transition-all group shadow-sm hover:shadow-md text-left"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 bg-satu-surface rounded-xl text-satu-primary group-hover:bg-satu-primary group-hover:text-white transition-colors">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                      </svg>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded uppercase tracking-wide">{clinics.length} Unit</span>
                      {clinics.filter(c => c.contractStatus === 'Expired').length > 0 && (
                        <span className="text-[9px] text-red-500 mt-1 font-semibold">{clinics.filter(c => c.contractStatus === 'Expired').length} Expired</span>
                      )}
                    </div>
                  </div>
                  <h3 className="font-display font-bold text-gray-800 text-sm group-hover:text-satu-primary">Manajemen Faskes</h3>
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2">Registrasi, kontrak, dan status faskes.</p>
                </button>

                <button 
                  onClick={() => setActiveView('user-management')}
                  className="bg-white rounded-xl border border-gray-200 p-5 hover:border-satu-primary hover:ring-1 hover:ring-satu-primary transition-all group shadow-sm hover:shadow-md text-left"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 bg-satu-surface rounded-xl text-satu-primary group-hover:bg-satu-primary group-hover:text-white transition-colors">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                      </svg>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded uppercase tracking-wide">{systemUsers.length} User</span>
                  </div>
                  <h3 className="font-display font-bold text-gray-800 text-sm group-hover:text-satu-primary">Manajemen User</h3>
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2">Akun, Direktori Pegawai & SIP/STR.</p>
                </button>

                <a href="#" className="bg-white rounded-xl border border-gray-200 p-5 hover:border-red-500 hover:ring-1 hover:ring-red-500 transition-all group shadow-sm hover:shadow-md">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 bg-satu-surface rounded-xl text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path>
                      </svg>
                    </div>
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-[10px] font-bold rounded uppercase tracking-wide">24 Open</span>
                  </div>
                  <h3 className="font-display font-bold text-gray-800 text-sm group-hover:text-red-500">Ticket Support</h3>
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2">Kelola keluhan & bantuan teknis.</p>
                </a>

                <button 
                  onClick={() => setActiveView('marketplace')}
                  className="bg-white rounded-xl border border-gray-200 p-5 hover:border-purple-600 hover:ring-1 hover:ring-purple-600 transition-all group shadow-sm hover:shadow-md text-left"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 bg-satu-surface rounded-xl text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                      </svg>
                    </div>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-[10px] font-bold rounded uppercase tracking-wide">12 Modul</span>
                  </div>
                  <h3 className="font-display font-bold text-gray-800 text-sm group-hover:text-purple-600">Katalog Add-Ons</h3>
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2">Marketplace modul untuk Faskes.</p>
                </button>

                <a href="#" className="bg-white rounded-xl border border-gray-200 p-5 hover:border-satu-gold hover:ring-1 hover:ring-satu-gold transition-all group shadow-sm hover:shadow-md">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 bg-satu-surface rounded-xl text-satu-gold group-hover:bg-satu-gold group-hover:text-white transition-colors">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                  </div>
                  <h3 className="font-display font-bold text-gray-800 text-sm group-hover:text-satu-gold">Tagihan & Bayar</h3>
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2">Monitoring revenue & langganan.</p>
                </a>

                <a href="#" className="bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-500 hover:ring-1 hover:ring-blue-500 transition-all group shadow-sm hover:shadow-md">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 bg-satu-surface rounded-xl text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                  </div>
                  <h3 className="font-display font-bold text-gray-800 text-sm group-hover:text-blue-500">Integrasi Sistem</h3>
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2">SATUSEHAT & API eksternal.</p>
                </a>

                <button 
                  onClick={() => setActiveView('master-data')}
                  className="bg-white rounded-xl border border-gray-200 p-5 hover:border-pink-600 hover:ring-1 hover:ring-pink-600 transition-all group shadow-sm hover:shadow-md text-left"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 bg-satu-surface rounded-xl text-pink-600 group-hover:bg-pink-600 group-hover:text-white transition-colors">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path>
                      </svg>
                    </div>
                  </div>
                  <h3 className="font-display font-bold text-gray-800 text-sm group-hover:text-pink-600">Master Data</h3>
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2">Role, Jenis Faskes, & Spesialisasi.</p>
                </button>

                <a href="#" className="bg-white rounded-xl border border-gray-200 p-5 hover:border-teal-600 hover:ring-1 hover:ring-teal-600 transition-all group shadow-sm hover:shadow-md">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 bg-satu-surface rounded-xl text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                      </svg>
                    </div>
                  </div>
                  <h3 className="font-display font-bold text-gray-800 text-sm group-hover:text-teal-600">Log & Audit</h3>
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2">Jejak aktivitas & keamanan.</p>
                </a>
                
                <a href="#" className="bg-white rounded-xl border border-gray-200 p-5 hover:border-gray-600 hover:ring-1 hover:ring-gray-600 transition-all group shadow-sm hover:shadow-md">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 bg-satu-surface rounded-xl text-gray-600 group-hover:bg-gray-600 group-hover:text-white transition-colors">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                    </div>
                  </div>
                  <h3 className="font-display font-bold text-gray-800 text-sm group-hover:text-gray-900">Pengaturan Sistem</h3>
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2">Konfigurasi global platform.</p>
                </a>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
        ) : activeView === 'marketplace' ? (
          <MarketplaceView 
            onBack={() => setActiveView('dashboard')} 
            activeAddOns={activeAddOns}
            onToggleAddOn={toggleAddOn}
          />
        ) : activeView === 'clinic-management' ? (
          <ClinicManagementView 
            clinics={clinics}
            onBack={() => setActiveView('dashboard')} 
            onAddFaskes={openAddFaskes}
            onEditFaskes={handleEditFaskes}
            onViewFaskes={handleViewFaskes}
            onDeleteFaskes={handleDeleteFaskes}
            onSaveFaskes={handleSaveFaskes}
          />
        ) : activeView === 'employee-directory' ? (
          <EmployeeDirectoryView 
            employees={employees}
            onBack={() => setActiveView('dashboard')}
            onAddEmployee={() => {
              setEditingEmployee(null);
              setIsEmployeeModalOpen(true);
            }}
            onEditEmployee={(emp) => {
              setEditingEmployee(emp);
              setIsEmployeeModalOpen(true);
            }}
            onDeleteEmployee={(id) => {
              setEmployees(prev => prev.filter(e => e.id !== id));
              setToastMessage({ title: 'Berhasil Dihapus', desc: 'Data pegawai telah dihapus dari sistem.' });
              setShowToast(true);
              setTimeout(() => setShowToast(false), 3000);
            }}
            onViewEmployee={(emp) => {
              setEditingEmployee(emp);
              setIsEmployeeModalOpen(true);
            }}
          />
        ) : activeView === 'credentialing' ? (
          <CredentialingView employees={employees} onBack={() => setActiveView('dashboard')} />
        ) : activeView === 'user-management' ? (
          <UserManagementView 
            users={systemUsers}
            employees={employees}
            clinics={clinics}
            onBack={() => setActiveView('dashboard')}
            onAddUser={(user) => {
              const newUser: SystemUser = {
                id: Math.random().toString(36).substr(2, 9),
                name: user.name || '',
                email: user.email || '',
                role: user.role || 'Admin Faskes',
                status: 'Verified',
                clinic: user.clinic || 'Global Access',
                category: user.category,
                avatar: (user.name || 'U').substring(0, 2).toUpperCase()
              };
              setSystemUsers(prev => [newUser, ...prev]);
              setToastMessage({ title: 'Berhasil', desc: 'User baru berhasil ditambahkan.' });
              handleAddLog(userName, `Menambahkan user baru: ${newUser.name} (${newUser.role})`, 'green');
              setShowToast(true);
              setTimeout(() => setShowToast(false), 3000);
            }}
            onEditUser={(user) => {
              setSystemUsers(prev => prev.map(u => u.id === user.id ? user : u));
              setToastMessage({ title: 'Berhasil', desc: 'Data user berhasil diperbarui.' });
              handleAddLog(userName, `Memperbarui data user: ${user.name}`, 'orange');
              setShowToast(true);
              setTimeout(() => setShowToast(false), 3000);
            }}
            onDeleteUser={(id) => {
              const user = systemUsers.find(u => u.id === id);
              setSystemUsers(prev => prev.filter(u => u.id !== id));
              setToastMessage({ title: 'Berhasil Dihapus', desc: 'Akses user telah dicabut.' });
              handleAddLog(userName, `Menghapus user: ${user?.name || 'Unknown'}`, 'red');
              setShowToast(true);
              setTimeout(() => setShowToast(false), 3000);
            }}
            onResetPassword={(id) => {
              const user = systemUsers.find(u => u.id === id);
              setToastMessage({ title: 'Terkirim', desc: 'Link reset password telah dikirim ke email user.' });
              handleAddLog(userName, `Reset password untuk user: ${user?.name || 'Unknown'}`, 'blue');
              setShowToast(true);
              setTimeout(() => setShowToast(false), 3000);
            }}
            onAddEmployee={() => {
              setEditingEmployee(null);
              setIsEmployeeModalOpen(true);
            }}
            onEditEmployee={(emp) => {
              setEditingEmployee(emp);
              setIsEmployeeModalOpen(true);
            }}
            onDeleteEmployee={(id) => {
              const emp = employees.find(e => e.id === id);
              setEmployees(prev => prev.filter(e => e.id !== id));
              setToastMessage({ title: 'Berhasil Dihapus', desc: 'Data pegawai telah dihapus dari sistem.' });
              handleAddLog(userName, `Menghapus data pegawai: ${emp?.name || 'Unknown'}`, 'red');
              setShowToast(true);
              setTimeout(() => setShowToast(false), 3000);
            }}
            onViewEmployee={(emp) => {
              setEditingEmployee(emp);
              setIsEmployeeModalOpen(true);
            }}
          />
        ) : activeView === 'master-data' ? (
          <MasterDataView onBack={() => setActiveView('dashboard')} />
        ) : (
          <FaskesModal 
            isOpen={true}
            onClose={() => {
              setActiveView('clinic-management');
              setSelectedClinic(null);
              setIsViewOnly(false);
            }}
            onSave={(data) => {
              handleSaveFaskes(data);
              setActiveView('clinic-management');
            }}
            initialData={selectedClinic}
            isViewOnly={isViewOnly}
          />
        )}
        </div>
      </main>

      {/* Footer */}
      {!isFullPage && (
        <footer className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full border-t border-gray-200 mt-auto bg-white">
          <div className="flex flex-col md:flex-row items-center justify-between text-xs text-gray-500">
            <div className="mb-2 md:mb-0">
              &copy; 2026 <strong>SATUMATA Health System</strong>. v2.5.0-beta
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-satu-primary transition-colors">Dokumentasi</a>
              <a href="#" className="hover:text-satu-primary transition-colors">Pusat Bantuan</a>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span>System Operational</span>
              </div>
            </div>
          </div>
        </footer>
      )}

      {/* Employee Modal */}
      <EmployeeFormModal 
        isOpen={isEmployeeModalOpen}
        onClose={() => {
          setIsEmployeeModalOpen(false);
          setEditingEmployee(null);
        }}
        onSave={handleSaveEmployee}
        initialData={editingEmployee}
      />

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-8 right-8 z-[70] animate-slide-up">
          <div className="bg-satu-dark text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-white/10 backdrop-blur-md">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/20">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div>
              <p className="font-bold text-sm">{toastMessage.title}</p>
              <p className="text-white/60 text-xs">{toastMessage.desc}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
