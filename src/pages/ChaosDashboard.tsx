import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Zap, AlertTriangle, CheckCircle, Power, Server, ShieldAlert, Radio, Skull } from 'lucide-react';
import { getPanicMode, setPanicMode } from '../services/api';

const ChaosDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [panicMode, setPanicModeState] = useState(getPanicMode());

  const togglePanicMode = () => {
    const newState = !panicMode;
    setPanicMode(newState);
    setPanicModeState(newState);
    if (newState) {
      toast.error('PANIC MODE ATIVADO: Todos os agentes foram desconectados!', { 
        duration: 5000,
        icon: '💀',
        style: {
          background: '#ef4444',
          color: '#fff',
        }
      });
    } else {
      toast.success('Panic Mode Desativado: Agentes reconectando...', { duration: 3000 });
    }
  };

  const triggerNotification = (type: 'success' | 'error' | 'warning') => {
    console.log('Triggering notification:', type);
    switch (type) {
      case 'success':
        toast.success('Sistema operacional normalizado.');
        break;
      case 'error':
        toast.error('ALERTA CRÍTICO: Falha na API de Pagamentos!');
        break;
      case 'warning':
        toast('Aviso: Latência alta detectada na Filial SP.', {
          icon: '⚠️',
        });
        break;
    }
  };

  const simulateCriticalFailure = () => {
    console.log('Simulating critical failure...');
    setLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      console.log('Dispatching critical failure toast');
      toast.error(
        <div>
          <b>Falha Crítica Detectada!</b>
          <p className="text-sm">Estação SP-DESK-001 perdeu conexão com impressora fiscal.</p>
        </div>,
        { duration: 6000 }
      );
      setLoading(false);
    }, 1000);
  };

  const simulateBranchClosure = () => {
    console.log('Simulating branch closure...');
    setLoading(true);
    setTimeout(() => {
      console.log('Dispatching branch closure toast');
      toast(
        <div>
          <b>Filial Fechada</b>
          <p className="text-sm">Filial Curitiba entrou em modo offline por falha de rede.</p>
        </div>,
        { icon: '🔒', duration: 5000 }
      );
      setLoading(false);
    }, 800);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-2">
        <div className="p-3 bg-purple-100 rounded-xl text-purple-600 shadow-sm">
          <Zap className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Painel de Simulação (Chaos Mode)</h1>
          <p className="text-sm text-slate-500">Injete falhas controladas para testar a resiliência e alertas do sistema.</p>
        </div>
      </div>

      {/* Global Panic Control - Moved to Top */}
      <div className="card bg-slate-900 text-white border-slate-800 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 p-32 bg-rose-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        
        <div className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-rose-500/20 rounded-lg text-rose-400">
                <Skull className="h-8 w-8" />
              </div>
              <div>
                <h3 className="font-bold text-white text-2xl tracking-tight">PANIC MODE</h3>
                <p className="text-sm text-rose-400 font-medium">Simulação de Desastre Total</p>
              </div>
            </div>

            <p className="text-slate-300 max-w-2xl leading-relaxed">
              Esta ação desligará forçadamente todos os agentes de monitoramento simulando uma falha sistêmica global. 
              Todas as estações ficarão <span className="text-rose-400 font-bold">OFFLINE</span> imediatamente e os alertas de indisponibilidade serão disparados.
            </p>
            
            {panicMode && (
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-rose-500/20 border border-rose-500/30 rounded-lg text-sm text-rose-200 animate-pulse font-medium">
                <AlertTriangle className="h-4 w-4" />
                SISTEMA EM ESTADO CRÍTICO - AGENTES DESCONECTADOS
              </div>
            )}
          </div>
          
          <div className="w-full md:w-auto flex flex-col gap-3">
            <button 
              onClick={togglePanicMode}
              className={`px-8 py-5 rounded-xl font-bold text-lg tracking-wide transition-all duration-300 flex items-center justify-center gap-3 shadow-lg transform active:scale-95 ${
                panicMode 
                  ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-900/50 animate-pulse ring-4 ring-rose-500/30' 
                  : 'bg-slate-700 hover:bg-slate-600 text-white border border-slate-600 hover:border-slate-500'
              }`}
            >
              <Power className="h-6 w-6" />
              {panicMode ? 'DESATIVAR PÂNICO' : 'ATIVAR PÂNICO'}
            </button>
            <p className="text-xs text-slate-500 font-mono text-center">
              Safety Check: v2.4.0-chaos
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Teste de Notificações */}
        <div className="card h-full">
          <div className="card-header border-b border-slate-100 p-4 flex items-center gap-2">
            <Radio className="h-5 w-5 text-blue-500" />
            <h3 className="font-bold text-slate-800">Teste de Notificações</h3>
          </div>
          <div className="p-6 space-y-4">
            <p className="text-sm text-slate-500 mb-4">
              Dispara notificações locais para verificar a integração com o sistema de alertas do operador.
            </p>
            <div className="space-y-3">
              <button 
                onClick={() => triggerNotification('success')}
                className="w-full px-4 py-3 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100 hover:bg-emerald-100 hover:shadow-sm transition-all text-left flex items-center gap-3 group"
              >
                <div className="p-1.5 bg-emerald-200 rounded-md group-hover:bg-emerald-300 transition-colors">
                  <CheckCircle className="h-4 w-4 text-emerald-800" />
                </div>
                <span className="font-medium">Testar Sucesso</span>
              </button>
              
              <button 
                onClick={() => triggerNotification('warning')}
                className="w-full px-4 py-3 bg-amber-50 text-amber-700 rounded-lg border border-amber-100 hover:bg-amber-100 hover:shadow-sm transition-all text-left flex items-center gap-3 group"
              >
                <div className="p-1.5 bg-amber-200 rounded-md group-hover:bg-amber-300 transition-colors">
                  <AlertTriangle className="h-4 w-4 text-amber-800" />
                </div>
                <span className="font-medium">Testar Aviso</span>
              </button>
              
              <button 
                onClick={() => triggerNotification('error')}
                className="w-full px-4 py-3 bg-rose-50 text-rose-700 rounded-lg border border-rose-100 hover:bg-rose-100 hover:shadow-sm transition-all text-left flex items-center gap-3 group"
              >
                <div className="p-1.5 bg-rose-200 rounded-md group-hover:bg-rose-300 transition-colors">
                  <ShieldAlert className="h-4 w-4 text-rose-800" />
                </div>
                <span className="font-medium">Testar Erro Crítico</span>
              </button>
            </div>
          </div>
        </div>

        {/* Cenários de Falha */}
        <div className="card h-full border-rose-100 shadow-sm">
          <div className="card-header border-b border-rose-100 bg-rose-50/30 p-4 flex items-center gap-2">
            <Zap className="h-5 w-5 text-rose-600" />
            <h3 className="font-bold text-rose-900">Cenários de Infraestrutura</h3>
          </div>
          <div className="p-6 space-y-6">
            <p className="text-sm text-slate-500">
              Simula eventos complexos de infraestrutura que afetam múltiplas entidades ou causam paradas operacionais.
            </p>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase">Periféricos</label>
                <button 
                  onClick={simulateCriticalFailure}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-white text-rose-700 border border-rose-200 rounded-lg hover:bg-rose-50 hover:border-rose-300 transition-all flex items-center justify-between group disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  <span className="font-medium flex items-center gap-2">
                    <Server className="h-4 w-4 text-rose-500" />
                    Simular Falha de Hardware
                  </span>
                  {loading && <div className="animate-spin h-4 w-4 border-2 border-rose-600 border-t-transparent rounded-full"></div>}
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase">Conectividade</label>
                <button 
                  onClick={simulateBranchClosure}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-900 hover:shadow-lg hover:shadow-slate-900/20 transition-all flex items-center justify-between group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="font-medium flex items-center gap-2">
                    <Power className="h-4 w-4 text-slate-400 group-hover:text-white transition-colors" />
                    Simular Queda de Filial
                  </span>
                  {loading && <div className="animate-spin h-4 w-4 border-2 border-slate-400 border-t-transparent rounded-full"></div>}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChaosDashboard;
