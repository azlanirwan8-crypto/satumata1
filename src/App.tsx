import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import SuperAdminDashboard from './components/SuperAdminDashboard';
import DoctorDashboard from './components/DoctorDashboard';
import FacilityAdminDashboard from './components/FacilityAdminDashboard';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [role, setRole] = useState('');
  
  // Check for existing session
  useEffect(() => {
    const auth = localStorage.getItem('isAuthenticated');
    const storedName = localStorage.getItem('userName');
    const storedRole = localStorage.getItem('userRole');
    if (auth === 'true') {
      setIsAuthenticated(true);
      if (storedName) setUserName(storedName);
      if (storedRole) setRole(storedRole);
    }
  }, []);

  const handleLogin = (name: string, userRole: string) => {
    setIsAuthenticated(true);
    setUserName(name);
    setRole(userRole);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userName', name);
    localStorage.setItem('userRole', userRole);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserName('');
    setRole('');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  if (role === 'superadmin') {
    return <SuperAdminDashboard onLogout={handleLogout} userName={userName || 'Administrator'} />;
  }

  if (role === 'dokter') {
    return <DoctorDashboard onLogout={handleLogout} userName={userName || 'Dokter'} />;
  }

  if (role === 'admin') {
    return <FacilityAdminDashboard onLogout={handleLogout} userName={userName || 'Admin Faskes'} />;
  }

  return (
    <div className="min-h-screen bg-satu-surface flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <img 
            src="https://noviandri.com/wp-content/uploads/2025/11/SATUMATA-e1763948072282.png" 
            alt="Logo" 
            className="h-16 mx-auto mb-4"
          />
          <h2 className="text-2xl font-bold text-satu-dark">Role Tidak Dikenali</h2>
          <p className="text-gray-500 text-sm mt-2">Sesi Anda bermasalah atau role tidak valid.</p>
        </div>
        <button 
          onClick={handleLogout}
          className="w-full bg-satu-primary text-white font-bold py-3 rounded-xl hover:bg-satu-dark transition-colors"
        >
          Kembali ke Login
        </button>
      </div>
    </div>
  );
}
