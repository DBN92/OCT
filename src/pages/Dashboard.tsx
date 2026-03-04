import React, { useEffect, useState } from 'react';
import { getBranches, getStations, getEvents } from '../services/api';
import { Branch, Station, Event } from '../types';
import { Building2, Monitor, AlertTriangle, CheckCircle, Keyboard, Ticket, ShieldAlert, Map } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const Dashboard = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock coordinates for demo (in real app, this would come from DB)
  const branchCoordinates: Record<string, [number, number]> = {
    'Matriz - São Paulo': [-23.5505, -46.6333],
    'Filial - Rio de Janeiro': [-22.9068, -43.1729],
    'Filial - Curitiba': [-25.4284, -49.2733]
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [branchesData, stationsData, eventsData] = await Promise.all([
          getBranches(),
          getStations(),
          getEvents({ limit: 5 })
        ]);
        setBranches(branchesData);
        setStations(stationsData as Station[]);
        setEvents(eventsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  const onlineStations = (Array.isArray(stations) ? stations : []).filter(s => s.health_status === 'healthy').length;
  const criticalStations = (Array.isArray(stations) ? stations : []).filter(s => s.health_status === 'critical');
  const warningStations = (Array.isArray(stations) ? stations : []).filter(s => s.health_status === 'warning');
  const offlineStations = (Array.isArray(stations) ? stations : []).filter(s => s.health_status === 'offline').length;
  
  // Estimate faulty components based on critical/warning stations (Simulation logic)
  const faultyComponentsCount = criticalStations.length + warningStations.length; 

  const getBranchName = (id?: string) => branches.find(b => b.id === id)?.name || 'Unknown Branch';
  const getStationName = (id?: string) => stations.find(s => s.id === id)?.hostname || 'Unknown Station';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Visão Geral</h1>
          <p className="text-sm text-slate-500 mt-1">Monitoramento em tempo real da infraestrutura</p>
        </div>
        <div className="text-sm text-slate-500 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
          Última atualização: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-5 flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Filiais</p>
            <p className="text-2xl font-bold text-slate-900">{branches.length}</p>
          </div>
        </div>
        
        <div className="card p-5 flex items-center gap-4">
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
            <Monitor className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Estações Online</p>
            <p className="text-2xl font-bold text-slate-900">{onlineStations} <span className="text-slate-400 text-lg font-normal">/ {stations.length}</span></p>
          </div>
        </div>

        <div className="card p-5 flex items-center gap-4">
          <div className="p-3 bg-rose-50 rounded-xl text-rose-600">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Críticas</p>
            <p className="text-2xl font-bold text-slate-900">{criticalStations.length}</p>
          </div>
        </div>

        <div className="card p-5 flex items-center gap-4">
          <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
            <Keyboard className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Comp. com Falha</p>
            <p className="text-2xl font-bold text-slate-900">{faultyComponentsCount}</p>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="card overflow-hidden h-[400px]">
        <div className="card-header bg-slate-50/50">
          <h2 className="card-title flex items-center gap-2">
            <Map className="h-5 w-5 text-blue-600" />
            Mapa de Filiais
          </h2>
        </div>
        <MapContainer center={[-23.5505, -46.6333]} zoom={5} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          {branches.map(branch => {
            const coords = branchCoordinates[branch.name] || [-23.5505, -46.6333];
            return (
              <Marker key={branch.id} position={coords}>
                <Popup>
                  <div className="p-1 min-w-[200px]">
                    <h3 className="font-bold text-slate-900">{branch.name}</h3>
                    <p className="text-xs text-slate-500 mb-2">{branch.city}, {branch.state}</p>
                    <div className="flex items-center gap-2 mb-2">
                      {branch.is_open ? (
                        <span className="badge badge-success">Aberta</span>
                      ) : (
                        <span className="badge badge-danger">Fechada</span>
                      )}
                    </div>
                    {!branch.is_open && branch.closure_reason && (
                      <p className="text-xs text-rose-600 bg-rose-50 p-1.5 rounded mb-2 border border-rose-100">
                        {branch.closure_reason}
                      </p>
                    )}
                    <Link to={`/branches/${branch.id}`} className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline">
                      Ver Detalhes →
                    </Link>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Branches List */}
        <div className="card flex flex-col h-full">
          <div className="card-header">
            <h2 className="card-title">Status das Filiais</h2>
            <Link to="/branches" className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline">Ver todas</Link>
          </div>
          <div className="flex-1 overflow-auto max-h-[350px]">
             <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 sticky top-0 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-3 font-semibold tracking-wide text-xs uppercase">Filial</th>
                    <th className="px-6 py-3 font-semibold tracking-wide text-xs uppercase">Local</th>
                    <th className="px-6 py-3 font-semibold tracking-wide text-xs uppercase">Status</th>
                    <th className="px-6 py-3 font-semibold tracking-wide text-xs uppercase text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {branches.slice(0, 5).map(branch => (
                    <tr key={branch.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">{branch.name}</td>
                      <td className="px-6 py-4 text-slate-600">{branch.city}, {branch.state}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1 items-start">
                          <span className={`badge ${branch.is_open ? 'badge-success' : 'badge-neutral'}`}>
                            {branch.is_open ? 'Aberta' : 'Fechada'}
                          </span>
                          {!branch.is_open && branch.closure_reason && (
                            <span className="text-[10px] text-rose-600 font-medium bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100">
                              {branch.closure_reason}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link to={`/branches/${branch.id}`} className="text-sm font-medium text-blue-600 hover:text-blue-800">
                          Detalhes
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {branches.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                        Nenhuma filial encontrada
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
          </div>
        </div>

        {/* Critical Stations List */}
        <div className="card flex flex-col h-full">
          <div className="card-header bg-rose-50/30">
            <h2 className="card-title text-rose-900 flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-rose-600" />
              Estações com Problemas
            </h2>
            <Link to="/stations" className="text-sm font-medium text-rose-700 hover:text-rose-800 hover:underline">Ver todas</Link>
          </div>
          <div className="flex-1 overflow-auto max-h-[350px]">
            {criticalStations.length > 0 || warningStations.length > 0 ? (
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 sticky top-0 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-3 font-semibold tracking-wide text-xs uppercase">Hostname</th>
                    <th className="px-6 py-3 font-semibold tracking-wide text-xs uppercase">Problema</th>
                    <th className="px-6 py-3 font-semibold tracking-wide text-xs uppercase">Chamado</th>
                    <th className="px-6 py-3 font-semibold tracking-wide text-xs uppercase text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[...criticalStations, ...warningStations].map(station => {
                    // Find latest event for this station to get context
                    const stationEvent = events.find(e => e.station_id === station.id);
                    const ticketId = stationEvent?.tickets?.[0]?.itsm_id;
                    const issue = stationEvent?.type || 'Falha de Saúde';

                    return (
                      <tr key={station.id} className="hover:bg-rose-50/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-900">{station.hostname}</div>
                          <div className="text-xs text-slate-500">{getBranchName(station.branch_id)}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`badge ${
                            station.health_status === 'critical' ? 'badge-danger' : 'badge-warning'
                          }`}>
                            {issue}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {ticketId ? (
                            <a 
                              href={`https://itsm-provider.com/tickets/${ticketId}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-xs font-medium text-blue-700 bg-blue-50 px-2 py-1 rounded-md border border-blue-100 hover:bg-blue-100 hover:border-blue-200 transition-all w-fit"
                              title="Abrir chamado no sistema externo"
                            >
                              <Ticket className="h-3 w-3" />
                              #{ticketId}
                            </a>
                          ) : (
                            <span className="text-xs text-slate-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link to={`/stations/${station.id}`} className="text-sm font-medium text-blue-600 hover:text-blue-800">Ver</Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="p-12 text-center text-slate-400 flex flex-col items-center">
                <CheckCircle className="h-12 w-12 text-emerald-100 mb-3" />
                <p>Nenhuma estação com problemas críticos no momento.</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Events with Tickets */}
        <div className="card flex flex-col col-span-1 lg:col-span-2">
          <div className="card-header">
            <h2 className="card-title flex items-center gap-2">
              <Ticket className="h-5 w-5 text-blue-600" />
              Últimos Eventos e Chamados
            </h2>
            <Link to="/events" className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline">Ver todos</Link>
          </div>
          <div className="flex-1 overflow-auto max-h-[300px]">
            <div className="divide-y divide-slate-100">
              {events.map(event => (
                <div key={event.id} className="p-4 hover:bg-slate-50 transition-colors flex items-start gap-4">
                  <div className={`mt-1 p-2 rounded-lg flex-shrink-0 ${
                    event.severity === 'critical' ? 'bg-rose-100 text-rose-600' : 
                    event.severity === 'warning' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {event.severity === 'critical' ? <ShieldAlert className="h-4 w-4" /> : 
                     event.severity === 'warning' ? <AlertTriangle className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-medium text-slate-900 text-sm">{event.type}</p>
                      <span className="text-xs text-slate-400 whitespace-nowrap ml-4">{new Date(event.created_at || '').toLocaleString()}</span>
                    </div>
                    
                    <p className="text-sm text-slate-600 mb-2">
                      Estação: <span className="font-medium">{getStationName(event.station_id)}</span>
                    </p>
                    
                    {event.tickets && event.tickets.length > 0 ? (
                      <a 
                        href={`https://itsm-provider.com/tickets/${event.tickets[0].itsm_id}`}
                        target="_blank"
                        rel="noopener noreferrer" 
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200 hover:bg-white hover:border-slate-300 hover:shadow-sm transition-all"
                      >
                        <Ticket className="h-3 w-3 text-slate-500" />
                        Chamado ITSM: <span className="text-slate-900">#{event.tickets[0].itsm_id}</span>
                      </a>
                    ) : (
                      <div className="text-xs text-slate-400 italic">Sem chamado aberto</div>
                    )}
                  </div>
                </div>
              ))}
              {events.length === 0 && (
                <div className="p-12 text-center text-slate-400">
                  Nenhum evento recente.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
