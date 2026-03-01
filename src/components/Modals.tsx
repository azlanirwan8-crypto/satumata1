import React from 'react';
import { X, AlertTriangle, CheckCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { SERVICE_PRICING } from '../constants';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="bg-white rounded-2xl shadow-2xl relative z-10 max-w-md w-full mx-4 overflow-hidden fade-in">
        {children}
      </div>
    </div>
  );
};

export function PaymentModal({ isOpen, onClose, data, onConfirm }: { isOpen: boolean; onClose: () => void; data: any; onConfirm: () => void }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-slate-50 p-6 border-b border-slate-100">
        <h3 className="text-lg font-bold text-slate-800">Konfirmasi Pembayaran</h3>
        <p className="text-xs text-slate-500">Invoice Generated</p>
      </div>
      <div className="p-6">
        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Item</span>
            <span className="font-medium text-slate-700">{data?.source || '-'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Detail</span>
            <span className="font-medium text-slate-700">{data?.detail || '-'}</span>
          </div>
          <div className="border-t border-dashed border-slate-200 my-2"></div>
          <div className="flex justify-between text-lg font-bold">
            <span className="text-brand-700">Total Tagihan</span>
            <span className="text-brand-700">Rp {data?.total?.toLocaleString('id-ID') || 0}</span>
          </div>
        </div>
        <button onClick={onConfirm} className="w-full bg-brand-600 hover:bg-brand-700 text-white py-3 rounded-xl font-bold shadow-md transition-all">Bayar Sekarang</button>
      </div>
    </Modal>
  );
}

export function AddServiceModal({ isOpen, onClose, onConfirm }: { isOpen: boolean; onClose: () => void; onConfirm: (data: any) => void }) {
  const [service, setService] = React.useState('Glaukoma');
  const [duration, setDuration] = React.useState('yearly');

  const cost = duration === 'monthly' ? SERVICE_PRICING[service].monthly : SERVICE_PRICING[service].yearly;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-800">Tambah Layanan Registry</h3>
        <button onClick={onClose}><X className="w-5 h-5 text-slate-400" /></button>
      </div>
      <div className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Pilih Layanan</label>
          <select value={service} onChange={(e) => setService(e.target.value)} className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:border-brand-500 outline-none">
            {Object.keys(SERVICE_PRICING).map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Pilih Durasi</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" checked={duration === 'monthly'} onChange={() => setDuration('monthly')} className="w-4 h-4 text-brand-600" />
              <span className="text-sm text-slate-700">Bulanan</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" checked={duration === 'yearly'} onChange={() => setDuration('yearly')} className="w-4 h-4 text-brand-600" />
              <span className="text-sm text-slate-700">Tahunan (Hemat 17%)</span>
            </label>
          </div>
        </div>
        <div className="bg-brand-50 p-4 rounded-lg flex justify-between items-center border border-brand-100 mt-4">
          <span className="text-sm text-brand-700 font-medium">Estimasi Biaya</span>
          <span className="text-xl font-bold text-brand-800">Rp {cost.toLocaleString('id-ID')}</span>
        </div>
        <button onClick={() => onConfirm({ service, duration, cost })} className="w-full bg-brand-600 hover:bg-brand-700 text-white py-3 rounded-xl font-bold shadow-md transition-all mt-4">Lanjut Pembayaran</button>
      </div>
    </Modal>
  );
}

export function DeleteModal({ isOpen, onClose, targetId, onConfirm }: { isOpen: boolean; onClose: () => void; targetId: string; onConfirm: () => void }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 text-center">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600"><AlertTriangle className="w-6 h-6" /></div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">Hapus Laporan?</h3>
        <p className="text-sm text-slate-500 mb-6">Data ID <span className="font-bold text-slate-700">{targetId}</span> akan dihapus permanen.</p>
        <div className="flex gap-3 justify-center">
          <button onClick={onClose} className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 font-bold text-sm hover:bg-slate-50">Batal</button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold text-sm hover:bg-red-700 shadow-lg shadow-red-200">Ya, Hapus</button>
        </div>
      </div>
    </Modal>
  );
}

export function ActionModal({ isOpen, onClose, type, patientId }: { isOpen: boolean; onClose: () => void; type: string; patientId: string }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 text-center">
        <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-600"><CheckCircle className="w-6 h-6" /></div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">Aksi Berhasil</h3>
        <p className="text-sm text-slate-500 mb-6">Anda <span className="font-bold">{type}</span> data ID: <span className="font-mono font-bold text-slate-700">{patientId}</span></p>
        <button onClick={onClose} className="w-full px-4 py-2 bg-brand-600 text-white rounded-lg font-bold text-sm hover:bg-brand-700">Tutup</button>
      </div>
    </Modal>
  );
}
