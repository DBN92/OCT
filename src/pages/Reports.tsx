import React, { useState } from 'react';
import { FileText, Download, Calendar, BarChart2, PieChart, Activity, Clock, CheckCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

const Reports = () => {
  const [reportType, setReportType] = useState('availability');
  const [dateRange, setDateRange] = useState('7d');

  // Mock data for charts
  const availabilityData = [
    { name: 'Seg', uptime: 99.8, downtime: 0.2 },
    { name: 'Ter', uptime: 99.9, downtime: 0.1 },
    { name: 'Qua', uptime: 99.5, downtime: 0.5 },
    { name: 'Qui', uptime: 100, downtime: 0 },
    { name: 'Sex', uptime: 98.2, downtime: 1.8 },
    { name: 'Sáb', uptime: 100, downtime: 0 },
    { name: 'Dom', uptime: 100, downtime: 0 },
  ];

  const incidentsData = [
    { name: 'Hardware', count: 12 },
    { name: 'Rede', count: 8 },
    { name: 'Software', count: 5 },
    { name: 'Sistema', count: 3 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Relatórios Gerenciais</h1>
          <p className="text-sm text-slate-500">Análise histórica e métricas de desempenho</p>
        </div>
        
        <div className="flex gap-2">
          <select 
            className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="24h">Últimas 24 horas</option>
            <option value="7d">Últimos 7 dias</option>
            <option value="30d">Últimos 30 dias</option>
            <option value="90d">Último Trimestre</option>
          </select>
          
          <button className="btn-primary flex items-center gap-2">
            <Download className="h-4 w-4" />
            Exportar PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Menu */}
        <div className="lg:col-span-1 space-y-2">
          <button 
            onClick={() => setReportType('availability')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              reportType === 'availability' 
                ? 'bg-blue-50 text-blue-700 border border-blue-100 shadow-sm' 
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-transparent'
            }`}
          >
            <Clock className="h-5 w-5" />
            Disponibilidade & Uptime
          </button>
          
          <button 
            onClick={() => setReportType('incidents')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              reportType === 'incidents' 
                ? 'bg-blue-50 text-blue-700 border border-blue-100 shadow-sm' 
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-transparent'
            }`}
          >
            <Activity className="h-5 w-5" />
            Incidentes e Alertas
          </button>
          
          <button 
            onClick={() => setReportType('performance')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              reportType === 'performance' 
                ? 'bg-blue-50 text-blue-700 border border-blue-100 shadow-sm' 
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-transparent'
            }`}
          >
            <BarChart2 className="h-5 w-5" />
            Performance de Hardware
          </button>
        </div>

        {/* Report Content */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card p-4">
              <p className="text-sm font-medium text-slate-500 mb-1">Uptime Médio</p>
              <h3 className="text-2xl font-bold text-emerald-600 flex items-center gap-2">
                99.8%
                <span className="text-xs font-normal text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+0.2%</span>
              </h3>
            </div>
            <div className="card p-4">
              <p className="text-sm font-medium text-slate-500 mb-1">Total de Incidentes</p>
              <h3 className="text-2xl font-bold text-slate-900">28</h3>
            </div>
            <div className="card p-4">
              <p className="text-sm font-medium text-slate-500 mb-1">MTTR (Tempo Resolução)</p>
              <h3 className="text-2xl font-bold text-blue-600">45m</h3>
            </div>
          </div>

          {/* Charts Area */}
          <div className="card p-6 min-h-[400px]">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              {reportType === 'availability' && <Clock className="h-5 w-5 text-blue-500" />}
              {reportType === 'incidents' && <Activity className="h-5 w-5 text-rose-500" />}
              {reportType === 'performance' && <BarChart2 className="h-5 w-5 text-purple-500" />}
              
              {reportType === 'availability' && 'Histórico de Disponibilidade'}
              {reportType === 'incidents' && 'Distribuição de Incidentes por Tipo'}
              {reportType === 'performance' && 'Métricas de Performance'}
            </h3>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                {reportType === 'availability' ? (
                  <LineChart data={availabilityData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={[90, 100]} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="uptime" name="Uptime (%)" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                ) : (
                  <BarChart data={incidentsData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                    <XAxis type="number" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} width={80} />
                    <Tooltip 
                      cursor={{ fill: '#f1f5f9' }}
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                    />
                    <Bar dataKey="count" name="Ocorrências" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={30} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Detailed Table Preview */}
          <div className="card">
            <div className="card-header border-b border-slate-100 p-4 flex justify-between items-center">
              <h4 className="font-bold text-slate-800">Detalhamento dos Dados</h4>
              <button className="text-sm text-blue-600 hover:underline">Ver tudo</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-medium">
                  <tr>
                    <th className="px-4 py-3">Data</th>
                    <th className="px-4 py-3">Evento</th>
                    <th className="px-4 py-3">Duração</th>
                    <th className="px-4 py-3">Impacto</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="px-4 py-3">03/03/2025 10:45</td>
                    <td className="px-4 py-3 font-medium">Latência Alta - Filial SP</td>
                    <td className="px-4 py-3 text-slate-500">15 min</td>
                    <td className="px-4 py-3"><span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded text-xs font-bold">MÉDIO</span></td>
                    <td className="px-4 py-3"><span className="flex items-center gap-1 text-emerald-600"><CheckCircle className="h-3 w-3" /> Resolvido</span></td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">02/03/2025 14:20</td>
                    <td className="px-4 py-3 font-medium">Falha Impressora - CX02</td>
                    <td className="px-4 py-3 text-slate-500">45 min</td>
                    <td className="px-4 py-3"><span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-xs font-bold">BAIXO</span></td>
                    <td className="px-4 py-3"><span className="flex items-center gap-1 text-emerald-600"><CheckCircle className="h-3 w-3" /> Resolvido</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
