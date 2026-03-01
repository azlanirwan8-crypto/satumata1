import React from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, CheckCircle, ChevronLeft } from 'lucide-react';
import { Employee } from './EmployeeDirectoryView';

interface CredentialingViewProps {
  employees: Employee[];
  onBack: () => void;
  hideHeader?: boolean;
}

export default function CredentialingView({ employees, onBack, hideHeader = false }: CredentialingViewProps) {
  const today = new Date();
  const warningLimit = new Date();
  warningLimit.setMonth(today.getMonth() + 3);

  const getDocStatus = (expDateStr?: string) => {
    if (!expDateStr) return null;
    const expDate = new Date(expDateStr);
    const isExpired = expDate < today;
    const isWarning = expDate < warningLimit && !isExpired;
    const daysLeft = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    return { isExpired, isWarning, daysLeft, expDateStr };
  };

  const warningDocs: { emp: Employee, type: string, status: any }[] = [];
  const validDocs: { emp: Employee, type: string, status: any }[] = [];

  employees.filter(e => e.category === 'medis').forEach(emp => {
    const strStatus = getDocStatus(emp.strExp);
    if (strStatus) {
      if (strStatus.isExpired || strStatus.isWarning) warningDocs.push({ emp, type: 'STR', status: strStatus });
      else validDocs.push({ emp, type: 'STR', status: strStatus });
    }

    const sipStatus = getDocStatus(emp.sipExp);
    if (sipStatus) {
      if (sipStatus.isExpired || sipStatus.isWarning) warningDocs.push({ emp, type: 'SIP', status: sipStatus });
      else validDocs.push({ emp, type: 'SIP', status: sipStatus });
    }
  });

  const renderDocCard = (item: { emp: Employee, type: string, status: any }) => {
    const { emp, type, status } = item;
    const { isExpired, isWarning, daysLeft, expDateStr } = status;
    
    return (
      <div key={`${emp.id}-${type}`} className={`flex items-start justify-between p-3 bg-white rounded-lg border ${isExpired ? 'border-red-200' : (isWarning ? 'border-orange-200' : 'border-green-100')} hover:shadow-sm transition-shadow`}>
        <div className="flex gap-3">
          <div className={`w-10 h-10 rounded-full ${isExpired ? 'bg-red-50 text-red-600' : (isWarning ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600')} flex items-center justify-center font-bold text-xs shrink-0`}>
            {emp.img}
          </div>
          <div>
            <div className="font-bold text-sm text-gray-800">{emp.name}</div>
            <div className="text-xs text-gray-500">{type}: {type === 'STR' ? emp.str : emp.sip || '-'}</div>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-xs font-bold ${isExpired ? 'text-red-600' : (isWarning ? 'text-orange-500' : 'text-green-600')}`}>
            {isExpired ? 'EXPIRED' : (isWarning ? 'SEGERA HABIS' : 'VALID')}
          </div>
          <div className="text-[10px] text-gray-400 mt-1">
            {expDateStr} ({daysLeft > 0 ? `${daysLeft} hari lagi` : `Lewat ${Math.abs(daysLeft)} hari`})
          </div>
        </div>
      </div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 flex flex-col h-full"
    >
      {!hideHeader && (
        <div className="bg-white border-b border-gray-200 px-8 py-5 flex justify-between items-center shadow-sm z-10 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="font-display font-bold text-2xl text-satu-dark">Monitoring Credentialing</h1>
              <p className="text-sm text-gray-500 mt-1">Pantau masa berlaku dokumen legalitas medis (STR/SIP).</p>
            </div>
          </div>
        </div>
      )}

      <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-auto custom-scroll flex-1 bg-gray-50/50">
        <div className="bg-red-50 border border-red-100 rounded-xl p-5 shadow-sm h-fit">
          <h3 className="font-bold text-red-800 text-lg mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" /> 
            Segera Kedaluwarsa / Expired
          </h3>
          <div className="space-y-3">
            {warningDocs.length > 0 ? (
              warningDocs.map(renderDocCard)
            ) : (
              <div className="text-center py-8 text-red-400 text-sm italic">
                Tidak ada dokumen yang kedaluwarsa atau segera habis.
              </div>
            )}
          </div>
        </div>

        <div className="bg-green-50 border border-green-100 rounded-xl p-5 shadow-sm h-fit">
          <h3 className="font-bold text-green-800 text-lg mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" /> 
            Dokumen Valid (&gt; 3 Bulan)
          </h3>
          <div className="space-y-3">
            {validDocs.length > 0 ? (
              validDocs.map(renderDocCard)
            ) : (
              <div className="text-center py-8 text-green-500 text-sm italic">
                Belum ada dokumen yang valid.
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
