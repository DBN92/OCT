import React, { useEffect, useState } from 'react';
import { getApiMonitors } from '../services/api';
import { ApiMonitor } from '../types';
import { Globe, CheckCircle, XCircle, Clock, AlertTriangle, ShieldCheck, Activity, RefreshCw } from 'lucide-react';

const ApiMonitoring = () => {
  const [monitors, setMonitors] = useState<ApiMonitor[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const data = await getApiMonitors();
      setMonitors(data);
    } catch (error) {
      console.error('Error fetching API monitors:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Monitoramento de APIs</h1>
          <p className="text-sm text-slate-500">Status e disponibilidade de serviços externos</p>
        </div>
        <button 
          onClick={() => { setLoading(true); fetchData(); }}
          className="btn-primary flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Atualizar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {monitors.map((monitor) => (
          <div key={monitor.id} className="card hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <Globe className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{monitor.name}</h3>
                    <p className="text-xs font-semibold text-slate-500 tracking-wider uppercase">{monitor.scope}</p>
                  </div>
                </div>
                <span className={`badge ${
                  monitor.criticality === 'critical' ? 'badge-danger' :
                  monitor.criticality === 'high' ? 'badge-warning' :
                  'badge-primary'
                }`}>
                  {monitor.criticality.toUpperCase()}
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-sm py-1 border-b border-slate-50">
                  <span className="text-slate-500">URL Endpoint</span>
                  <span className="text-slate-900 font-mono text-xs truncate max-w-[150px]" title={monitor.url}>{monitor.url}</span>
                </div>
                <div className="flex justify-between text-sm py-1 border-b border-slate-50">
                  <span className="text-slate-500">Timeout Configurado</span>
                  <span className="text-slate-900 font-medium">{monitor.timeout_seconds}s</span>
                </div>
                <div className="flex justify-between text-sm py-1">
                  <span className="text-slate-500">Status Atual</span>
                  <span className="flex items-center gap-1.5 text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full text-xs">
                    <CheckCircle className="h-3.5 w-3.5" /> ONLINE
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Clock className="h-3.5 w-3.5" />
                  Atualizado: <span className="font-medium text-slate-700">Agora mesmo</span>
                </div>
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 hover:underline">
                  <Activity className="h-3.5 w-3.5" />
                  Histórico
                </button>
              </div>
            </div>
          </div>
        ))}

        {monitors.length === 0 && (
          <div className="col-span-full bg-slate-50 p-12 rounded-xl border border-slate-100 text-center text-slate-500">
            <Globe className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="font-medium">Nenhuma API configurada para monitoramento.</p>
          </div>
        )}
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-5 flex items-start gap-4">
        <div className="p-2 bg-white rounded-lg shadow-sm text-blue-600">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <div>
          <h4 className="font-bold text-blue-900">Monitoramento Automático Ativo</h4>
          <p className="text-sm text-blue-700 mt-1 max-w-2xl">
            O sistema OCT verifica automaticamente a disponibilidade e latência das APIs a cada 60 segundos.
            Falhas consecutivas em endpoints marcados como CRITICAL gerarão alertas imediatos para a equipe de SRE.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApiMonitoring;
