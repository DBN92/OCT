import { TelemetryRepository } from '../repositories/telemetry.repository';
import { StationRepository } from '../repositories/station.repository';
import { EventRepository } from '../repositories/event.repository';
import { Telemetry, Station } from '../types';

export class TelemetryService {
  private telemetryRepository: TelemetryRepository;
  private stationRepository: StationRepository;
  private eventRepository: EventRepository;

  constructor() {
    this.telemetryRepository = new TelemetryRepository();
    this.stationRepository = new StationRepository();
    this.eventRepository = new EventRepository();
  }

  async processTelemetry(stationId: string, data: Omit<Telemetry, 'id' | 'station_id' | 'recorded_at'>): Promise<Telemetry> {
    // 1. Save telemetry
    const telemetry = await this.telemetryRepository.create({
      ...data,
      station_id: stationId
    });

    // 2. Evaluate health
    const healthStatus = this.evaluateHealth(data);

    // 3. Update station status and last_seen
    await this.stationRepository.updateStatus(stationId, healthStatus);

    // 4. Generate event if not healthy
    if (healthStatus !== 'healthy') {
      await this.eventRepository.create({
        station_id: stationId,
        source: 'telemetry_agent',
        type: 'health_check_failed',
        severity: healthStatus === 'critical' ? 'critical' : 'warning',
        status: 'open',
        payload: {
          cpu: data.cpu_usage,
          ram: data.ram_usage,
          disk: data.disk_usage,
          smart: data.smart_data,
          reason: this.getHealthReason(data)
        }
      });
    }

    return telemetry;
  }

  async getLatestTelemetry(stationId: string): Promise<Telemetry | null> {
    return this.telemetryRepository.findLatestByStation(stationId);
  }

  async getTelemetryHistory(stationId: string): Promise<Telemetry[]> {
    return this.telemetryRepository.findHistoryByStation(stationId);
  }

  private evaluateHealth(data: Omit<Telemetry, 'id' | 'station_id' | 'recorded_at'>): Station['health_status'] {
    // Critical conditions
    if (data.cpu_usage > 95 || data.ram_usage > 95) return 'critical';
    // Check SMART data (simplified assumption: if any smart value is failing)
    // In a real scenario, we would parse smart_data structure
    
    // Warning conditions
    if (data.cpu_usage > 80 || data.ram_usage > 80) return 'warning';
    
    return 'healthy';
  }

  private getHealthReason(data: Omit<Telemetry, 'id' | 'station_id' | 'recorded_at'>): string {
    const reasons = [];
    if (data.cpu_usage > 95) reasons.push('CPU critical');
    else if (data.cpu_usage > 80) reasons.push('CPU high');
    
    if (data.ram_usage > 95) reasons.push('RAM critical');
    else if (data.ram_usage > 80) reasons.push('RAM high');
    
    return reasons.join(', ');
  }
}
