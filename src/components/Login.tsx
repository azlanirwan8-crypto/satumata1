import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';

interface LoginProps {
  onLogin: (userName: string, role: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate loading
    setTimeout(() => {
      const validUsers = [
        { email: 'superadmin@gmail.com', password: '123', name: 'Super Admin', role: 'superadmin' },
        { email: 'dokter@gmail.com', password: '123', name: 'Dr. Handoko, Sp.M(K)', role: 'dokter' },
        { email: 'admin@gmail.com', password: '123', name: 'Admin Sentosa', role: 'admin' },
        { email: 'dokter1@gmail.com', password: '123', name: 'Dr. Ahmad, Sp.M', role: 'dokter' },
        { email: 'dokter2@gmail.com', password: '123', name: 'Dr. Siti, Sp.M', role: 'dokter' },
        { email: 'admin1@gmail.com', password: '123', name: 'Admin Klinik A', role: 'admin' },
        { email: 'admin2@gmail.com', password: '123', name: 'Admin Klinik B', role: 'admin' },
      ];

      const user = validUsers.find(u => u.email === email && u.password === password);

      if (user) {
        onLogin(user.name, user.role);
      } else {
        setError('Email atau kata sandi salah.');
        setIsLoading(false);
      }
    }, 1000);
  };

  const fastLogin = (emailAddr: string, role: string, name: string) => {
    setEmail(emailAddr);
    setPassword('123');
    setIsLoading(true);
    setTimeout(() => {
      onLogin(name, role);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-satu-surface">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center">
          <div className="mb-8 relative">
            <img 
              src="https://noviandri.com/wp-content/uploads/2025/11/SATUMATA-e1763948072282.png" 
              alt="SATUMATA Logo" 
              className="h-20 w-auto object-contain animate-pulse"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="w-64 h-1.5 bg-gray-100 rounded-full overflow-hidden mb-4">
            <div className="h-full bg-gradient-to-r from-satu-primary to-satu-gold rounded-full w-full animate-[loader_1.5s_ease-in-out_infinite]"></div>
          </div>
          <h3 className="text-satu-dark font-bold text-sm tracking-wide">Memproses...</h3>
          <p className="text-xs text-gray-400 mt-1">SATUMATA Identity Provider</p>
        </div>
      )}

      <div className="relative bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* LEFT COLUMN (Branding) */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-satu-dark to-satu-primary p-12 text-white flex flex-col justify-between relative overflow-hidden hidden md:flex">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-satu-gold rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-white rounded-lg p-2 shadow-md">
                <img 
                  src="https://noviandri.com/wp-content/uploads/2025/11/SATUMATA-e1763948072282.png" 
                  alt="SATUMATA Logo" 
                  className="w-10 h-auto object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="font-display font-bold text-2xl tracking-widest">SATUMATA</span>
            </div>
            
            <h2 className="text-4xl font-display font-bold mb-6 leading-tight">
              Terhubung Lebih Cepat, <span className="text-satu-gold">Melayani Lebih Baik.</span>
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                  <CheckCircle className="w-5 h-5 text-satu-gold" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Ekosistem Terintegrasi</h4>
                  <p className="text-blue-100/80 text-sm">
                    Akses Dashboard, E-Resep, dan Modul Klinis dengan satu identitas SSO Terpusat.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative z-10 flex justify-between items-center text-xs font-medium text-blue-200 border-t border-white/10 pt-6 mt-8">
            <span>&copy; 2026 PT Satu Mata</span>
          </div>
        </div>

        {/* RIGHT COLUMN (Forms) */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white relative">
          <div className="w-full max-w-md mx-auto">
            <div className="mb-8">
              <span className="text-[10px] font-bold text-satu-primary bg-blue-50 px-2 py-1 rounded uppercase tracking-wider">SSO Access</span>
              <h3 className="text-3xl font-display font-bold text-satu-dark mt-2 mb-2">Masuk Akun</h3>
              <p className="text-gray-500 text-sm">Gerbang akses tunggal untuk seluruh layanan Satumata.</p>
            </div>

            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">Email</label>
                <div className="relative">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-satu-primary focus:border-satu-primary text-sm outline-none transition-all bg-gray-50 focus:bg-white pl-11" 
                    placeholder="nama@rumahsakit.com" 
                    required 
                  />
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">Kata Sandi</label>
                </div>
                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-satu-primary focus:border-satu-primary text-sm outline-none transition-all bg-gray-50 focus:bg-white pl-11 pr-11" 
                    placeholder="••••••••" 
                    required 
                  />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-satu-primary transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-satu-primary hover:bg-satu-dark text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/20 transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                Masuk Dashboard
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="relative flex py-4 items-center">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink-0 mx-4 text-gray-400 text-[10px] uppercase font-bold tracking-wider">Atau Simulasi Cepat</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button type="button" onClick={() => fastLogin('superadmin@gmail.com', 'superadmin', 'Super Admin')} className="group flex items-center p-2.5 border border-blue-100 bg-blue-50/50 rounded-xl hover:border-satu-primary hover:bg-blue-50 transition-all text-left">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-satu-primary flex items-center justify-center font-bold text-xs mr-3 group-hover:bg-satu-primary group-hover:text-white transition-colors">SA</div>
                <div>
                  <p className="font-bold text-gray-800 text-[10px]">Super Admin</p>
                </div>
              </button>

              <button type="button" onClick={() => fastLogin('admin@gmail.com', 'admin', 'Admin Sentosa')} className="group flex items-center p-2.5 border border-green-100 bg-green-50/50 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all text-left">
                <div className="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center font-bold text-xs mr-3 group-hover:bg-green-600 group-hover:text-white transition-colors">AD</div>
                <div>
                  <p className="font-bold text-gray-800 text-[10px]">Admin Faskes</p>
                </div>
              </button>
              
              <button type="button" onClick={() => fastLogin('dokter@gmail.com', 'dokter', 'Dr. Handoko, Sp.M(K)')} className="group flex items-center p-2.5 border border-blue-100 bg-blue-50/50 rounded-xl hover:border-satu-primary hover:bg-blue-50 transition-all text-left">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-satu-primary flex items-center justify-center font-bold text-xs mr-3 group-hover:bg-satu-primary group-hover:text-white transition-colors">DR</div>
                <div>
                  <p className="font-bold text-gray-800 text-[10px]">Dokter</p>
                </div>
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button type="button" onClick={() => fastLogin('admin1@gmail.com', 'admin', 'Admin Klinik A')} className="text-[9px] p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 font-medium">
                Admin Klinik A (admin1@)
              </button>
              <button type="button" onClick={() => fastLogin('dokter1@gmail.com', 'dokter', 'Dr. Ahmad, Sp.M')} className="text-[9px] p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 font-medium">
                Dr. Ahmad (dokter1@)
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes loader {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
