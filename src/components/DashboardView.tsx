import React from 'react';
import { Files, FilePlus, Activity, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ViewType, RegistryEntry } from '../types';

interface DashboardViewProps {
  onViewChange: (view: ViewType) => void;
  registryData: RegistryEntry[];
}

export default function DashboardView({ onViewChange, registryData }: DashboardViewProps) {
  const chartData = [
    { name: 'Jan', value: registryData.filter(d => d.date.includes('-01-')).length },
    { name: 'Feb', value: registryData.filter(d => d.date.includes('-02-')).length },
    { name: 'Mar', value: registryData.filter(d => d.date.includes('-03-')).length },
    { name: 'Apr', value: registryData.filter(d => d.date.includes('-04-')).length },
    { name: 'Mei', value: registryData.filter(d => d.date.includes('-05-')).length },
    { name: 'Jun', value: registryData.filter(d => d.date.includes('-06-')).length },
  ];

  const recentPatients = registryData.slice(0, 5);

  return (
    <div className="fade-in">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 font-display">Selamat Pagi, Dr. Andi 👋</h1>
          <p className="text-slate-500 mt-1">Ringkasan aktivitas penelitian Anda hari ini.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-500 shadow-sm flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Online
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="stat-card">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Laporan</div>
              <div className="text-3xl font-bold text-slate-800 mt-1">{registryData.length}</div>
            </div>
            <div className="p-2 bg-brand-50 text-brand-600 rounded-lg"><Files className="w-5 h-5" /></div>
          </div>
          <div className="text-xs text-slate-500"><span className="text-emerald-500 font-bold">0%</span> dari bulan lalu</div>
        </div>
        <div className="stat-card">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">Entri Bulan Ini</div>
              <div className="text-3xl font-bold text-slate-800 mt-1">
                {registryData.filter(d => d.date.startsWith(new Date().toISOString().slice(0, 7))).length}
              </div>
            </div>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><FilePlus className="w-5 h-5" /></div>
          </div>
          <div className="text-xs text-slate-500"><span className="text-emerald-500 font-bold">+0</span> hari ini</div>
        </div>
        <div className="stat-card">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">Top Diagnosis</div>
              <div className="text-xl font-bold text-slate-800 mt-1">
                {registryData.length > 0 ? registryData[0].diag : '-'}
              </div>
              <div className="text-xs text-slate-400">
                {registryData.length > 0 ? registryData[0].type : '-'}
              </div>
            </div>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Activity className="w-5 h-5" /></div>
          </div>
        </div>
        <div 
          className="stat-card bg-brand-600 text-white border-none flex flex-col justify-center items-center text-center cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all"
          onClick={() => onViewChange('registry')}
        >
          <div className="bg-white/20 p-3 rounded-full mb-3 backdrop-blur-sm"><ArrowRight className="w-6 h-6 text-white" /></div>
          <div className="font-bold text-lg">Buka Registry</div>
          <div className="text-xs text-brand-100 mt-1">Lihat semua modul</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-card border border-slate-200 p-6">
          <h3 className="font-bold text-slate-700 mb-6">Tren Diagnosa</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="value" fill="#0d9488" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-card border border-slate-200 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100"><h3 className="font-bold text-slate-700">Pasien Terakhir</h3></div>
          <div className="flex-grow overflow-y-auto no-scrollbar">
            <table className="w-full text-left text-sm">
              <tbody className="divide-y divide-slate-100">
                {recentPatients.length === 0 ? (
                  <tr><td className="p-8 text-center text-slate-400 italic">Belum ada data.</td></tr>
                ) : (
                  recentPatients.map(patient => (
                    <tr key={patient.id} className="hover:bg-slate-50">
                      <td className="p-4 font-mono font-bold text-slate-600 text-xs">{patient.id}</td>
                      <td className="p-4 text-right text-xs text-slate-500">{patient.type}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
