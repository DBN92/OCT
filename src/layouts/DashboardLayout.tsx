import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Monitor, Activity, Bell, Settings, MapPin, Zap, AlertTriangle, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getPanicMode } from '../services/api';

const DashboardLayout = () => {
  const location = useLocation();
  const [panicMode, setPanicMode] = useState(getPanicMode());
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const handlePanicChange = () => {
      setPanicMode(getPanicMode());
    };

    window.addEventListener('panic-mode-change', handlePanicChange as EventListener);
    return () => window.removeEventListener('panic-mode-change', handlePanicChange as EventListener);
  }, []);

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: MapPin, label: 'Filiais', path: '/branches' },
    { icon: Monitor, label: 'Estações', path: '/stations' },
    { icon: Activity, label: 'Monitoramento APIs', path: '/api-monitoring' },
    { icon: Bell, label: 'Eventos', path: '/events' },
    { icon: FileText, label: 'Relatórios', path: '/reports' },
    { icon: Settings, label: 'Configurações', path: '/settings' },
    { icon: Zap, label: 'Simulador (Chaos)', path: '/chaos' },
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className={cn(
        "w-64 text-slate-300 flex flex-col border-r border-slate-800 shadow-xl z-10 transition-colors duration-500",
        panicMode ? "bg-slate-900 border-r-rose-900/50" : "bg-slate-900"
      )}>
        <div className="p-6 border-b border-slate-800 flex flex-col items-center gap-3">
          <div className="w-full flex justify-center">
            {!imageError ? (
              <img 
                src="/logo.png" 
                alt="OCT - OpsControl Tower" 
                className="h-12 w-auto object-contain drop-shadow-lg"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="flex items-center gap-2">
                <div className="bg-gradient-to-br from-blue-600 to-cyan-500 p-2 rounded-xl shadow-lg shadow-blue-900/50">
                  <Monitor className="h-8 w-8 text-white" />
                </div>
                <span className="font-extrabold text-3xl text-white tracking-tighter italic bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                  OCT
                </span>
              </div>
            )}
          </div>
        </div>
        
        {panicMode && (
          <div className="mx-4 mt-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-center gap-3 animate-pulse">
            <AlertTriangle className="h-5 w-5 text-rose-500" />
            <div>
              <p className="text-xs font-bold text-rose-400">PANIC MODE ATIVO</p>
              <p className="text-[10px] text-rose-300/70">Agentes Offline</p>
            </div>
          </div>
        )}
        
        <nav className="flex-1 px-3 py-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                  isActive 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50" 
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                )}
              >
                <Icon className={cn("h-5 w-5 transition-colors", isActive ? "text-white" : "text-slate-500 group-hover:text-white")} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-2">
            <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white">
              JD
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white">John Doe</span>
              <span className="text-xs text-slate-500">Admin</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-slate-50 p-6 md:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
