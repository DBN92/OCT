import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getBranchById, getStations } from '../services/api';
import { Branch, Station } from '../types';
import { 
  Monitor, 
  AlertTriangle, 
  Clock, 
  MapPin, 
  ArrowLeft, 
  Server, 
  Activity,
  CalendarOff,
  AlertOctagon
} from 'lucide-react';
import { cn } from '@/lib/utils';

const BranchDashboard = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [branch, setBranch] = useState<Branch | null>(null);
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const branchData = await getBranchById(id);
        const stationsData = await getStations({ branch_id: id });
        setBranch(branchData);
        // Ensure stationsData is treated as Station[]
        setStations(stationsData as Station[]);
      } catch (error) {
        console.error('Error fetching branch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
  
  if (!branch) return (
    <div className="p-6 text-center">
      <h2 className="text-xl font-bold text-slate-800">Filial não encontrada</h2>
      <button onClick={() => navigate('/branches')} className="mt-4 btn-primary">
        Voltar para Lista
      </button>
    </div>
  );

  const onlineStations = (Array.isArray(stations) ? stations : []).filter(s => s.health_status === 'healthy').length;
  const warningStations = (Array.isArray(stations) ? stations : []).filter(s => s.health_status === 'warning').length;
  const criticalStations = (Array.isArray(stations) ? stations : []).filter(s => s.health_status === 'critical').length;
  const offlineStations = (Array.isArray(stations) ? stations : []).filter(s => s.health_status === 'offline').length;

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
      {/* Header with Navigation */}
      <div className="flex items-center gap-4 mb-2">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Detalhes da Filial</h1>
          <p className="text-sm text-slate-500">Visão geral e status dos equipamentos</p>
        </div>
      </div>

      {/* Main Branch Card */}
      <div className="card overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl shadow-sm">
              {branch.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                {branch.name}
                {branch.is_open ? (
                  <span className="badge badge-success flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Aberta
                  </span>
                ) : (
                  <span className="badge badge-danger flex items-center gap-1">
                    <CalendarOff className="h-3 w-3" />
                    Fechada
                  </span>
                )}
              </h2>
              <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  {branch.city} - {branch.state}
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {branch.timezone}
                </div>
              </div>
            </div>
          </div>
          
          {!branch.is_open && branch.closure_reason && (
            <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-3 flex items-start gap-3 max-w-md">
              <AlertOctagon className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-red-900">Filial Indisponível</h4>
                <p className="text-sm text-red-700 mt-0.5">{branch.closure_reason}</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <Server className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Estações</p>
              <p className="text-2xl font-bold text-slate-900">{stations.length}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-emerald-50 border border-emerald-100">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-emerald-600">Online</p>
              <p className="text-2xl font-bold text-emerald-700">{onlineStations}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-amber-50 border border-amber-100">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-amber-600">Atenção</p>
              <p className="text-2xl font-bold text-amber-700">{warningStations}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-rose-50 border border-rose-100">
            <div className="p-3 bg-rose-100 text-rose-600 rounded-lg">
              <AlertOctagon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-rose-600">Crítico/Offline</p>
              <p className="text-2xl font-bold text-rose-700">{criticalStations + offlineStations}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stations List */}
      <div className="card">
        <div className="card-header flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800">Estações de Trabalho</h3>
          <div className="flex gap-2">
            <span className="text-xs font-medium px-2 py-1 bg-slate-100 rounded text-slate-500">
              {stations.length} dispositivos
            </span>
          </div>
        </div>
        
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
                <tr key={station.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        station.health_status === 'healthy' ? 'bg-emerald-500' : 
                        station.health_status === 'offline' ? 'bg-slate-400' : 'bg-rose-500'
                      }`}></div>
                      <span className="font-medium text-slate-700">{station.hostname}</span>
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
                      Ver Detalhes
                    </Link>
                  </td>
                </tr>
              ))}
              {stations.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    <Server className="h-12 w-12 text-slate-200 mx-auto mb-3" />
                    <p>Nenhuma estação registrada nesta filial.</p>
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

export default BranchDashboard;
