import { Branch, Station, Event } from '../types';

export const MOCK_BRANCHES: Branch[] = [
  {
    id: 'b1',
    name: 'Matriz - São Paulo',
    city: 'São Paulo',
    state: 'SP',
    timezone: 'America/Sao_Paulo',
    operating_hours: {
      monday: '08:00-18:00',
      friday: '08:00-18:00'
    },
    is_open: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'b2',
    name: 'Filial - Rio de Janeiro',
    city: 'Rio de Janeiro',
    state: 'RJ',
    timezone: 'America/Sao_Paulo',
    operating_hours: {
      monday: '09:00-19:00',
      friday: '09:00-19:00'
    },
    is_open: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'b3',
    name: 'Filial - Curitiba',
    city: 'Curitiba',
    state: 'PR',
    timezone: 'America/Sao_Paulo',
    operating_hours: {
      monday: '08:30-18:30',
      friday: '08:30-18:30'
    },
    is_open: false,
    closure_reason: 'Manutenção Elétrica',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const MOCK_STATIONS: Station[] = [
  {
    id: 's1',
    branch_id: 'b1',
    hostname: 'SP-WS-001',
    ip_address: '192.168.1.101',
    type: 'workstation',
    health_status: 'healthy',
    last_seen: new Date().toISOString(),
    operating_system: 'Windows 11',
    tags: ['financeiro', 'vip'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 's2',
    branch_id: 'b1',
    hostname: 'SP-SRV-001',
    ip_address: '192.168.1.5',
    type: 'server',
    health_status: 'healthy',
    last_seen: new Date().toISOString(),
    operating_system: 'Ubuntu 22.04',
    tags: ['infra', 'core'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 's3',
    branch_id: 'b2',
    hostname: 'RJ-WS-005',
    ip_address: '192.168.2.105',
    type: 'kiosk',
    health_status: 'critical',
    last_seen: new Date(Date.now() - 3600000).toISOString(),
    operating_system: 'Windows 10 IoT',
    tags: ['atendimento'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 's4',
    branch_id: 'b2',
    hostname: 'RJ-WS-006',
    ip_address: '192.168.2.106',
    type: 'workstation',
    health_status: 'warning',
    last_seen: new Date(Date.now() - 300000).toISOString(),
    operating_system: 'Windows 11',
    tags: ['vendas'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 's5',
    branch_id: 'b3',
    hostname: 'PR-POS-001',
    ip_address: '192.168.3.50',
    type: 'pos',
    health_status: 'offline',
    last_seen: new Date(Date.now() - 86400000).toISOString(),
    operating_system: 'Linux Custom',
    tags: ['caixa'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const MOCK_EVENTS: Event[] = [
  {
    id: 'e1',
    station_id: 's3',
    source: 'system_monitor',
    type: 'Falha de Hardware',
    severity: 'critical',
    status: 'open',
    payload: {
      message: 'Disco rígido com setores defeituosos detectado',
      component: 'disk',
      details: 'S.M.A.R.T error code 5'
    },
    created_at: new Date(Date.now() - 1800000).toISOString(),
    tickets: [{
      itsm_id: 'INC-2025-001'
    }]
  },
  {
    id: 'e2',
    station_id: 's4',
    source: 'performance_monitor',
    type: 'Alta Utilização de CPU',
    severity: 'warning',
    status: 'open',
    payload: {
      message: 'Uso de CPU acima de 90% por 15 minutos',
      threshold: 90,
      current: 95
    },
    created_at: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'e3',
    station_id: 's5',
    source: 'network_monitor',
    type: 'Conectividade Perdida',
    severity: 'critical',
    status: 'open',
    payload: {
      message: 'Estação não responde ao ping',
      last_ping: '24h ago'
    },
    created_at: new Date(Date.now() - 86400000).toISOString()
  }
];
