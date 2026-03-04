import axios from 'axios';
import { Branch, Station, Telemetry, Event, ApiMonitor, ApiCheck, Ticket } from '../types';
import { MOCK_BRANCHES, MOCK_STATIONS, MOCK_EVENTS } from './mockData';

const api = axios.create({
  baseURL: '/api',
});

// Flag to force using mocks (useful for production demo without backend)
const USE_MOCKS = true; // Set to true to always use mocks

// Panic Mode State
let isPanicMode = localStorage.getItem('OCT_PANIC_MODE') === 'true';

export const setPanicMode = (enabled: boolean) => {
  isPanicMode = enabled;
  localStorage.setItem('OCT_PANIC_MODE', enabled.toString());
  // Dispatch a custom event that we can listen to
  setTimeout(() => {
    window.dispatchEvent(new CustomEvent('panic-mode-change', { detail: { enabled } }));
  }, 0);
};

export const getPanicMode = () => isPanicMode;

export const getBranches = async () => {
  if (USE_MOCKS) return MOCK_BRANCHES;
  try {
    const response = await api.get<Branch[]>('/branches');
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.warn('API failed, falling back to mocks', error);
    return MOCK_BRANCHES;
  }
};

export const getBranchById = async (id: string) => {
  if (USE_MOCKS) return MOCK_BRANCHES.find(b => b.id === id) || null;
  try {
    const response = await api.get<Branch>(`/branches/${id}`);
    return response.data;
  } catch (error) {
    return MOCK_BRANCHES.find(b => b.id === id) || null;
  }
};

export const getStations = async (filters?: { branch_id?: string; status?: string }) => {
  let data: Station[] = [];
  
  if (USE_MOCKS) {
    data = [...MOCK_STATIONS];
    if (filters?.branch_id) data = data.filter(s => s.branch_id === filters.branch_id);
    if (filters?.status) data = data.filter(s => s.health_status === filters.status);
  } else {
    try {
      const response = await api.get<Station[]>('/stations', { params: filters });
      data = Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.warn('API failed, falling back to mocks', error);
      data = [...MOCK_STATIONS];
      if (filters?.branch_id) data = data.filter(s => s.branch_id === filters.branch_id);
      if (filters?.status) data = data.filter(s => s.health_status === filters.status);
    }
  }
  
  if (isPanicMode) {
    return data.map(station => ({
      ...station,
      health_status: 'offline',
      last_seen: new Date(Date.now() - 3600000).toISOString() // Simulate offline for 1 hour
    }));
  }
  
  return data;
};

export const getStationById = async (id: string) => {
  let data: Station | null = null;

  if (USE_MOCKS) {
    data = MOCK_STATIONS.find(s => s.id === id) || null;
  } else {
    try {
      const response = await api.get<Station>(`/stations/${id}`);
      data = response.data;
    } catch (error) {
      data = MOCK_STATIONS.find(s => s.id === id) || null;
    }
  }

  if (!data) return null;
  
  if (isPanicMode) {
    return {
      ...data,
      health_status: 'offline',
      last_seen: new Date(Date.now() - 3600000).toISOString()
    } as Station;
  }
  
  return data;
};

export const getLatestTelemetry = async (stationId: string) => {
  if (isPanicMode) {
    return null; // Simulate no telemetry
  }
  // Mock telemetry for demo
  return {
    id: 't1',
    station_id: stationId,
    cpu_usage: Math.random() * 100,
    memory_usage: Math.random() * 100,
    disk_usage: Math.random() * 100,
    network_latency: Math.random() * 50,
    timestamp: new Date().toISOString()
  };
};

export const getTelemetryHistory = async (stationId: string) => {
  if (isPanicMode) {
    return []; // Simulate no history
  }
  // Mock history
  return Array.from({ length: 20 }).map((_, i) => ({
    id: `th${i}`,
    station_id: stationId,
    cpu_usage: 20 + Math.random() * 60,
    memory_usage: 40 + Math.random() * 40,
    disk_usage: 50 + Math.random() * 10,
    network_latency: 10 + Math.random() * 30,
    timestamp: new Date(Date.now() - i * 60000).toISOString()
  }));
};

export const getEvents = async (filters?: any) => {
  if (isPanicMode) {
    return []; // Simulate no events
  }
  if (USE_MOCKS) return MOCK_EVENTS;
  try {
    const response = await api.get<Event[]>('/events', { params: filters });
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    return MOCK_EVENTS;
  }
};

export const getTickets = async () => {
  const response = await api.get<Ticket[]>('/events/tickets');
  return response.data;
};

export const getApiMonitors = async () => {
  const response = await api.get<ApiMonitor[]>('/api-monitors');
  return response.data;
};

export const getApiCheckHistory = async (id: string) => {
  const response = await api.get<ApiCheck[]>(`/api-monitors/${id}/history`);
  return response.data;
};

export default api;
