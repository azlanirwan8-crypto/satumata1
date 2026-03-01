import React, { useState } from 'react';
import { Search, Download, CheckCircle } from 'lucide-react';
import { Transaction } from '../types';

interface PaymentViewProps {
  transactions: Transaction[];
}

export default function PaymentView({ transactions }: PaymentViewProps) {
  const [search, setSearch] = useState('');

  const filtered = transactions.filter(t => 
    t.id.toLowerCase().includes(search.toLowerCase()) || 
    t.item.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fade-in">
      <div className="bg-white rounded-2xl shadow-card border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col lg:flex-row justify-between lg:items-center gap-4">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-slate-800">Riwayat Pembayaran</h3>
            <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100">Semua Lunas</div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative w-full sm:w-64">
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari ID Transaksi/Item..." 
                className="text-sm border border-slate-300 rounded-lg pl-9 pr-3 py-2 bg-white text-slate-700 outline-none focus:border-brand-500 w-full shadow-sm" 
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
            <button className="bg-white border border-slate-300 hover:border-brand-500 hover:text-brand-600 text-slate-600 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95 whitespace-nowrap">
              <Download className="w-4 h-4" /> Export
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table w-full">
            <thead>
              <tr>
                <th>ID Transaksi</th>
                <th>Tanggal</th>
                <th>Keterangan</th>
                <th>Metode</th>
                <th className="text-right">Nominal</th>
                <th className="text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-slate-400 italic">Tidak ada riwayat pembayaran.</td></tr>
              ) : (
                filtered.map(trx => (
                  <tr key={trx.id} className="hover:bg-slate-50 border-b border-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs font-bold text-slate-600">{trx.id}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{trx.date}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-800">{trx.item}</td>
                    <td className="px-6 py-4 text-sm text-slate-500"><span className="bg-white border border-slate-200 px-2 py-1 rounded text-xs">{trx.method}</span></td>
                    <td className="px-6 py-4 text-right text-sm font-bold text-brand-700">Rp {trx.amount.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase flex items-center justify-center gap-1 w-fit mx-auto">
                        <CheckCircle className="w-3 h-3" /> {trx.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
