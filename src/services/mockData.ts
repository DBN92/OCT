import { Branch, Station, Event } from '../types';

export const MOCK_BRANCHES: Branch[] = [
  {
    id: 'b1',
    name: 'Matriz - São Paulo',
    city: 'São Paulo',
    state: 'SP',
    is_open: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'b2',
    name: 'Filial - Rio de Janeiro',
    city: 'Rio de Janeiro',
    state: 'RJ',
    is_open: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'b3',
    name: 'Filial - Curitiba',
    city: 'Curitiba',
    state: 'PR',
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
    type: 'Falha de Hardware',
    message: 'Disco rígido com setores defeituosos detectado',
    severity: 'critical',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    resolved: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    tickets: [{
      id: 't1',
      event_id: 'e1',
      itsm_id: 'INC-2025-001',
      status: 'open',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }]
  },
  {
    id: 'e2',
    station_id: 's4',
    type: 'Alta Utilização de CPU',
    message: 'Uso de CPU acima de 90% por 15 minutos',
    severity: 'warning',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    resolved: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'e3',
    station_id: 's5',
    type: 'Conectividade Perdida',
    message: 'Estação não responde ao ping',
    severity: 'critical',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    resolved: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];
