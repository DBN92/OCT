import React, { useEffect, useState } from 'react';
import { getStations } from '../services/api';
import { Station } from '../types';
import { Link } from 'react-router-dom';
import { Search, Filter, Monitor, Server, AlertCircle } from 'lucide-react';

const StationsList = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const filters = filter !== 'all' ? { status: filter } : {};
        const data = await getStations(filters);
        setStations(data as Station[]);
      } catch (error) {
        console.error('Error fetching stations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filter]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy': return 'badge-success';
      case 'warning': return 'badge-warning';
      case 'critical': return 'badge-danger';
      case 'offline': return 'badge-neutral';
      default: return 'badge-neutral';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Todas as Estações</h1>
          <p className="text-sm text-slate-500">Gerenciamento e inventário de dispositivos</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
          <Filter className="h-4 w-4 text-slate-400 ml-2" />
          <select 
            className="border-none bg-transparent text-sm focus:ring-0 text-slate-600 font-medium py-1.5"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">Todos os Status</option>
            <option value="healthy">Saudáveis</option>
            <option value="warning">Alerta</option>
            <option value="critical">Críticos</option>
            <option value="offline">Offline</option>
          </select>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Hostname</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">IP Address</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Último Visto</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stations.map((station) => (
                <tr key={station.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 rounded-lg text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                        <Monitor className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="font-medium text-slate-700 block">{station.hostname}</span>
                        <span className="text-xs text-slate-400 font-mono">{station.serial_number}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`badge ${getStatusBadge(station.health_status)}`}>
                      {station.health_status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-mono">
                    {station.ip_address}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 capitalize">
                    {station.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {new Date(station.last_seen).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Link 
                      to={`/stations/${station.id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm hover:underline"
                    >
                      Detalhes
                    </Link>
                  </td>
                </tr>
              ))}
              {stations.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    {loading ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <p>Carregando estações...</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <AlertCircle className="h-8 w-8 text-slate-300" />
                        <p>Nenhuma estação encontrada com o filtro selecionado.</p>
                      </div>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StationsList;
