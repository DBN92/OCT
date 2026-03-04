import React, { useEffect, useState } from 'react';
import { getBranches } from '../services/api';
import { Branch } from '../types';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Clock, 
  Search, 
  Building2, 
  CalendarOff, 
  ArrowRight,
  Filter
} from 'lucide-react';

const BranchList = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getBranches();
        setBranches(data);
      } catch (error) {
        console.error('Error fetching branches:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredBranches = branches.filter(branch => {
    const matchesFilter = filter === 'all' 
      ? true 
      : filter === 'open' ? branch.is_open 
      : !branch.is_open;
    
    const matchesSearch = branch.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          branch.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          branch.state.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Filiais</h1>
          <p className="text-sm text-slate-500">Gestão e monitoramento das unidades operacionais</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar filial..." 
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm">
            <Filter className="h-4 w-4 text-slate-400" />
            <select 
              className="border-none bg-transparent text-sm focus:ring-0 text-slate-600 font-medium p-0"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">Todas as Filiais</option>
              <option value="open">Abertas</option>
              <option value="closed">Fechadas</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBranches.map((branch) => (
          <div key={branch.id} className="card hover:shadow-lg transition-all duration-300 group flex flex-col h-full">
            <div className="p-5 flex-1">
              <div className="flex justify-between items-start mb-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-600 font-bold text-lg shadow-inner group-hover:from-blue-50 group-hover:to-blue-100 group-hover:text-blue-600 transition-colors">
                  {branch.state}
                </div>
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
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                {branch.name}
              </h3>
              
              <div className="space-y-2 mt-4">
                <div className="flex items-start gap-2 text-sm text-slate-500">
                  <MapPin className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                  <span className="line-clamp-2">{branch.address}, {branch.city} - {branch.state}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Clock className="h-4 w-4 text-slate-400 shrink-0" />
                  <span>{branch.timezone}</span>
                </div>
              </div>

              {!branch.is_open && branch.closure_reason && (
                <div className="mt-4 p-3 bg-rose-50 border border-rose-100 rounded-lg text-xs text-rose-800">
                  <span className="font-bold block mb-0.5">Motivo do Fechamento:</span>
                  {branch.closure_reason}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50/50 rounded-b-xl group-hover:bg-blue-50/30 transition-colors">
              <Link 
                to={`/branches/${branch.id}`}
                className="flex items-center justify-between text-sm font-medium text-slate-600 group-hover:text-blue-600 transition-colors"
              >
                Ver Dashboard
                <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredBranches.length === 0 && (
        <div className="text-center py-16 bg-slate-50 rounded-xl border border-slate-200 border-dashed">
          <Building2 className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900">Nenhuma filial encontrada</h3>
          <p className="text-slate-500 mt-1">Tente ajustar os filtros ou termo de busca.</p>
          <button 
            onClick={() => {setFilter('all'); setSearchTerm('');}}
            className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline"
          >
            Limpar filtros
          </button>
        </div>
      )}
    </div>
  );
};

export default BranchList;
