
import React, { useState } from 'react';
import { Save, Bell, Shield, Server, Clock } from 'lucide-react';

const Settings = () => {
  const [settings, setSettings] = useState({
    cpuThreshold: 90,
    ramThreshold: 85,
    diskThreshold: 90,
    heartbeatTimeout: 5,
    enableNotifications: true,
    itsmIntegration: true,
    itsmEndpoint: 'https://api.itsm-provider.com/v1/tickets',
    autoCloseTickets: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save to the backend
    alert('Configurações salvas com sucesso! (Simulação)');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Configurações do Sistema</h1>
        <button 
          onClick={handleSubmit}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Save className="h-4 w-4" />
          Salvar Alterações
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Health Rules */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-red-100 rounded-lg text-red-600">
              <Shield className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Limiares de Alerta (Thresholds)</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CPU Crítico (%)
              </label>
              <input 
                type="number" 
                name="cpuThreshold"
                value={settings.cpuThreshold}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                min="0" max="100"
              />
              <p className="text-xs text-gray-500 mt-1">Acima deste valor gera alerta crítico.</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                RAM Crítico (%)
              </label>
              <input 
                type="number" 
                name="ramThreshold"
                value={settings.ramThreshold}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                min="0" max="100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Disco Cheio (%)
              </label>
              <input 
                type="number" 
                name="diskThreshold"
                value={settings.diskThreshold}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                min="0" max="100"
              />
            </div>
          </div>
        </div>

        {/* Timeouts */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
              <Clock className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Timeouts e Heartbeat</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Offline Timeout (minutos)
              </label>
              <input 
                type="number" 
                name="heartbeatTimeout"
                value={settings.heartbeatTimeout}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                min="1"
              />
              <p className="text-xs text-gray-500 mt-1">Tempo sem heartbeat para considerar estação Offline.</p>
            </div>
          </div>
        </div>

        {/* Integrations */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 md:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <Server className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Integração ITSM</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                id="itsmIntegration"
                name="itsmIntegration"
                checked={settings.itsmIntegration}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 rounded border-gray-300"
              />
              <label htmlFor="itsmIntegration" className="text-sm font-medium text-gray-700">
                Habilitar abertura automática de chamados
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ITSM API Endpoint
                </label>
                <input 
                  type="text" 
                  name="itsmEndpoint"
                  value={settings.itsmEndpoint}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  disabled={!settings.itsmIntegration}
                />
              </div>
              
              <div className="flex items-center h-full pt-6">
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    id="autoCloseTickets"
                    name="autoCloseTickets"
                    checked={settings.autoCloseTickets}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300"
                    disabled={!settings.itsmIntegration}
                  />
                  <label htmlFor="autoCloseTickets" className="text-sm font-medium text-gray-700">
                    Fechar chamados automaticamente quando resolvido
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
