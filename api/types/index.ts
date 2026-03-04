export interface Branch {
  id: string;
  name: string;
  state: string;
  city: string;
  address?: string;
  timezone: string;
  operating_hours: Record<string, string>;
  is_open: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Station {
  id: string;
  branch_id: string;
  hostname: string;
  serial_number?: string;
  asset_tag?: string;
  type: string;
  tags: string[];
  health_status: 'healthy' | 'warning' | 'critical' | 'offline';
  last_seen?: string;
  ip_address?: string;
  operating_system?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Telemetry {
  id: string;
  station_id: string;
  recorded_at: string;
  cpu_usage: number;
  ram_usage: number;
  disk_usage: Record<string, any>;
  smart_data: Record<string, any>;
  network_latency: number;
  packet_loss: number;
  connected_devices: string[];
  app_versions: Record<string, string>;
}

export interface ApiMonitor {
  id: string;
  name: string;
  url: string;
  criticality: 'low' | 'medium' | 'high' | 'critical';
  timeout_seconds: number;
  scope: 'internal' | 'external';
  is_active: boolean;
  created_at?: string;
}

export interface ApiCheck {
  id: string;
  api_id: string;
  checked_at: string;
  is_ok: boolean;
  status_code?: number;
  latency_ms?: number;
  error_message?: string;
}

export interface Event {
  id: string;
  station_id?: string;
  branch_id?: string;
  source: string;
  type: string;
  severity: 'info' | 'warning' | 'critical';
  status: 'open' | 'acknowledged' | 'resolved';
  payload: Record<string, any>;
  correlation_id?: string;
  created_at?: string;
}

export interface Ticket {
  id: string;
  event_id: string;
  itsm_id?: string;
  status: string;
  priority: string;
  responsible_team?: string;
  created_at?: string;
  updated_at?: string;
}
