import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStationById, getLatestTelemetry, getTelemetryHistory } from '../services/api';
import { Station, Telemetry } from '../types';
import { 
  Cpu, 
  HardDrive, 
  Activity, 
  Wifi, 
  Server, 
  Clock, 
  Tag, 
  AlertTriangle,
  Keyboard,
  Mouse,
  Printer,
  Scan,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Thermometer,
  Zap
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const StationDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [station, setStation] = useState<Station | null>(null);
  const [telemetry, setTelemetry] = useState<Telemetry | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const getRequiredComponents = (type: string) => {
    switch (type) {
      case 'desktop': return ['keyboard', 'mouse', 'printer'];
      case 'kiosk': return ['scanner', 'printer'];
      case 'laptop': return ['mouse'];
      default: return [];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const [stationData, telemetryData, historyData] = await Promise.all([
          getStationById(id),
          getLatestTelemetry(id),
          getTelemetryHistory(id)
        ]);
        setStation(stationData as Station);
        setTelemetry(telemetryData);
        
        const formattedHistory = (Array.isArray(historyData) ? historyData : []).reverse().map(item => ({
          time: new Date(item.recorded_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          cpu: item.cpu_usage,
          ram: item.ram_usage,
          disk: item.disk_usage?.c_drive?.used ? Math.round((item.disk_usage.c_drive.used / item.disk_usage.c_drive.total) * 100) : 0
        }));
        setHistory(formattedHistory);
      } catch (error) {
        console.error('Error fetching station details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  if (!station) return (
    <div className="p-6 text-center">
      <h2 className="text-xl font-bold text-slate-800">Estação não encontrada</h2>
      <button onClick={() => navigate('/stations')} className="mt-4 btn-primary">
        Voltar para Lista
      </button>
    </div>
  );

  const requiredComponents = getRequiredComponents(station.type);
  const connectedDevices = telemetry?.connected_devices || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy': return 'badge-success';
      case 'warning': return 'badge-warning';
      case 'critical': return 'badge-danger';
      case 'offline': return 'badge-neutral';
      default: return 'badge-neutral';
    }
  };

  const getComponentIcon = (name: string) => {
    switch (name) {
      case 'keyboard': return <Keyboard className="h-4 w-4" />;
      case 'mouse': return <Mouse className="h-4 w-4" />;
      case 'printer': return <Printer className="h-4 w-4" />;
      case 'scanner': return <Scan className="h-4 w-4" />;
      default: return <Server className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{station.hostname}</h1>
              <span className={`badge ${getStatusBadge(station.health_status)}`}>
                {station.health_status.toUpperCase()}
              </span>
            </div>
            <p className="text-sm text-slate-500 flex items-center gap-2 mt-1">
              <Server className="h-3.5 w-3.5" />
              {station.ip_address}
              <span className="text-slate-300">|</span>
              <span className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">{station.serial_number}</span>
            </p>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-sm text-slate-500">Última atualização</p>
            <p className="text-slate-900 font-medium font-mono">{new Date(station.last_seen).toLocaleTimeString()}</p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Stats & Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Telemetry Cards */}
          {telemetry ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="card p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-semibold text-slate-500 uppercase">CPU</span>
                  <Cpu className={`h-5 w-5 ${telemetry.cpu_usage > 80 ? 'text-rose-500' : 'text-blue-500'}`} />
                </div>
                <div>
                  <span className="text-2xl font-bold text-slate-900">{telemetry.cpu_usage}%</span>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
                    <div 
                      className={`h-1.5 rounded-full transition-all duration-500 ${telemetry.cpu_usage > 80 ? 'bg-rose-500' : 'bg-blue-500'}`} 
                      style={{ width: `${telemetry.cpu_usage}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="card p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-semibold text-slate-500 uppercase">Memória</span>
                  <Zap className={`h-5 w-5 ${telemetry.ram_usage > 80 ? 'text-rose-500' : 'text-purple-500'}`} />
                </div>
                <div>
                  <span className="text-2xl font-bold text-slate-900">{telemetry.ram_usage}%</span>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
                    <div 
                      className={`h-1.5 rounded-full transition-all duration-500 ${telemetry.ram_usage > 80 ? 'bg-rose-500' : 'bg-purple-500'}`} 
                      style={{ width: `${telemetry.ram_usage}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="card p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-semibold text-slate-500 uppercase">Disco (C:)</span>
                  <HardDrive className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <span className="text-2xl font-bold text-slate-900">
                    {telemetry.disk_usage?.c_drive ? 
                      Math.round((telemetry.disk_usage.c_drive.used / telemetry.disk_usage.c_drive.total) * 100) : 0}%
                  </span>
                  <p className="text-xs text-slate-400 mt-1">
                    Livre: {telemetry.disk_usage?.c_drive?.free}GB
                  </p>
                </div>
              </div>

              <div className="card p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-semibold text-slate-500 uppercase">Latência</span>
                  <Wifi className={`h-5 w-5 ${telemetry.network_latency > 100 ? 'text-amber-500' : 'text-cyan-500'}`} />
                </div>
                <div>
                  <span className="text-2xl font-bold text-slate-900">{telemetry.network_latency}ms</span>
                  <p className="text-xs text-slate-400 mt-1">Loss: {telemetry.packet_loss}%</p>
                </div>
              </div>
            </div>
          ) : (
            station?.health_status === 'offline' ? (
              <div className="bg-rose-50 border border-rose-100 rounded-xl p-6 flex items-center gap-3 text-rose-800">
                <AlertTriangle className="h-6 w-6 text-rose-600" />
                <div>
                  <h3 className="font-bold">Estação Offline</h3>
                  <p className="text-sm text-rose-700">Sem eventos registrados, verifique se o agente está online</p>
                </div>
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-6 flex items-center gap-3 text-amber-800">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
                <div>
                  <h3 className="font-bold">Sem dados de telemetria</h3>
                  <p className="text-sm text-amber-700">Aguardando conexão do agente ou dados recentes.</p>
                </div>
              </div>
            )
          )}

          {/* Main Chart */}
          <div className="card h-96 p-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-500" />
                Performance em Tempo Real
              </h3>
              <div className="flex gap-4 text-xs font-medium">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> CPU
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> RAM
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height="85%">
              <AreaChart data={history}>
                <defs>
                  <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRam" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="time" 
                  stroke="#94a3b8" 
                  fontSize={12} 
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={12} 
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 100]}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 600 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="cpu" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorCpu)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="ram" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorRam)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column - Info & Peripherals */}
        <div className="space-y-6">
          
          {/* Peripherals Status */}
          <div className="card">
            <div className="card-header border-b border-slate-100 p-4">
              <h3 className="font-bold text-slate-800">Periféricos & Hardware</h3>
            </div>
            <div className="p-4 space-y-3">
              {requiredComponents.map(component => {
                const isConnected = connectedDevices.includes(component);
                return (
                  <div 
                    key={component} 
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                      isConnected 
                        ? 'border-emerald-100 bg-emerald-50/50' 
                        : 'border-rose-100 bg-rose-50/50 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isConnected ? 'bg-white text-emerald-600' : 'bg-white text-rose-600'}`}>
                        {getComponentIcon(component)}
                      </div>
                      <span className={`text-sm font-semibold capitalize ${isConnected ? 'text-emerald-900' : 'text-rose-900'}`}>
                        {component}
                      </span>
                    </div>
                    {isConnected ? (
                      <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full">
                        <CheckCircle className="h-3 w-3" /> OK
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700 bg-rose-100 px-2 py-1 rounded-full animate-pulse">
                        <XCircle className="h-3 w-3" /> Ausente
                      </div>
                    )}
                  </div>
                );
              })}
              
              {requiredComponents.length === 0 && (
                <p className="text-sm text-slate-400 italic text-center py-4">Nenhum componente obrigatório configurado.</p>
              )}

              <div className="pt-4 mt-2 border-t border-slate-100">
                <p className="text-xs font-semibold text-slate-500 uppercase mb-3">Outros Dispositivos</p>
                <div className="flex flex-wrap gap-2">
                  {connectedDevices
                    .filter(d => !requiredComponents.includes(d))
                    .map(device => (
                      <span key={device} className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-medium border border-slate-200 capitalize">
                        {device}
                      </span>
                    ))}
                  {connectedDevices.filter(d => !requiredComponents.includes(d)).length === 0 && (
                    <span className="text-xs text-slate-400">Nenhum outro dispositivo detectado.</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* System Info */}
          <div className="card">
            <div className="card-header border-b border-slate-100 p-4">
              <h3 className="font-bold text-slate-800">Informações do Sistema</h3>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-sm text-slate-500">Sistema Operacional</span>
                <span className="text-sm font-medium text-slate-900">{station.operating_system}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-sm text-slate-500">Tipo de Estação</span>
                <span className="text-sm font-medium text-slate-900 capitalize">{station.type}</span>
              </div>
              
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Apps Monitorados</p>
                <div className="space-y-2">
                  {telemetry?.app_versions && Object.entries(telemetry.app_versions).map(([app, version]) => (
                    <div key={app} className="flex justify-between items-center text-sm bg-slate-50 p-2 rounded border border-slate-100">
                      <span className="capitalize font-medium text-slate-700">{app}</span>
                      <span className="text-slate-500 font-mono text-xs">{version as string}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {station.tags?.map((tag: string) => (
                    <span key={tag} className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs flex items-center gap-1 border border-blue-100">
                      <Tag className="h-3 w-3" /> {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StationDetails;
