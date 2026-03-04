import React, { useEffect, useState } from 'react';
import { getEvents } from '../services/api';
import { Event } from '../types';
import { AlertTriangle, Info, CheckCircle, Clock, Search, Filter, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const filters = filter !== 'all' ? { severity: filter } : {};
        const data = await getEvents(filters);
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filter]);

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical': return 'badge-danger';
      case 'warning': return 'badge-warning';
      default: return 'badge-primary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved': return <CheckCircle className="h-4 w-4 text-emerald-600" />;
      case 'acknowledged': return <Clock className="h-4 w-4 text-amber-600" />;
      default: return <AlertTriangle className="h-4 w-4 text-rose-600" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Eventos e Chamados</h1>
          <p className="text-sm text-slate-500">Histórico de incidentes e alertas do sistema</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
          <Filter className="h-4 w-4 text-slate-400 ml-2" />
          <select 
            className="border-none bg-transparent text-sm focus:ring-0 text-slate-600 font-medium py-1.5"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">Todos os Eventos</option>
            <option value="critical">Críticos</option>
            <option value="warning">Alertas</option>
            <option value="info">Informativos</option>
          </select>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Data/Hora</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Severidade</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Origem</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Detalhes</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Estação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {new Date(event.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`badge ${getSeverityBadge(event.severity)}`}>
                      {event.severity.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 capitalize font-medium">
                    {event.source}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                    {event.type}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 max-w-xs truncate" title={JSON.stringify(event.payload)}>
                    <div className="flex items-center gap-1">
                      <FileText className="h-3 w-3 text-slate-400" />
                      {JSON.stringify(event.payload).substring(0, 50)}...
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      {getStatusIcon(event.status)}
                      <span className="capitalize">{event.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {event.station_id && (
                      <Link to={`/stations/${event.station_id}`} className="text-blue-600 hover:text-blue-800 hover:underline">
                        Ver Estação
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
              {events.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    {loading ? (
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      </div>
                    ) : (
                      'Nenhum evento encontrado.'
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

export default Events;
