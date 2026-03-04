import axios from 'axios';
import { Branch, Station, Telemetry, Event, ApiMonitor, ApiCheck, Ticket } from '../types';

const api = axios.create({
  baseURL: '/api',
});

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
  const response = await api.get<Branch[]>('/branches');
  return response.data;
};

export const getBranchById = async (id: string) => {
  const response = await api.get<Branch>(`/branches/${id}`);
  return response.data;
};

export const getStations = async (filters?: { branch_id?: string; status?: string }) => {
  const response = await api.get<Station[]>('/stations', { params: filters });
  
  if (isPanicMode) {
    return response.data.map(station => ({
      ...station,
      health_status: 'offline',
      last_seen: new Date(Date.now() - 3600000).toISOString() // Simulate offline for 1 hour
    }));
  }
  
  return response.data;
};

export const getStationById = async (id: string) => {
  const response = await api.get<Station>(`/stations/${id}`);
  
  if (isPanicMode) {
    return {
      ...response.data,
      health_status: 'offline',
      last_seen: new Date(Date.now() - 3600000).toISOString()
    };
  }
  
  return response.data;
};

export const getLatestTelemetry = async (stationId: string) => {
  if (isPanicMode) {
    return null; // Simulate no telemetry
  }
  const response = await api.get<Telemetry>(`/telemetry/${stationId}/latest`);
  return response.data;
};

export const getTelemetryHistory = async (stationId: string) => {
  if (isPanicMode) {
    return []; // Simulate no history
  }
  const response = await api.get<Telemetry[]>(`/telemetry/${stationId}/history`);
  return response.data;
};

export const getEvents = async (filters?: any) => {
  if (isPanicMode) {
    return []; // Simulate no events
  }
  const response = await api.get<Event[]>('/events', { params: filters });
  return response.data;
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
