import axios from 'axios';
import { ApiMonitorRepository } from '../repositories/api_monitor.repository';
import { ApiCheckRepository } from '../repositories/api_check.repository';
import { ApiMonitor, ApiCheck } from '../types';

export class ApiMonitorService {
  private monitorRepository: ApiMonitorRepository;
  private checkRepository: ApiCheckRepository;

  constructor() {
    this.monitorRepository = new ApiMonitorRepository();
    this.checkRepository = new ApiCheckRepository();
  }

  async getAllMonitors(): Promise<ApiMonitor[]> {
    return this.monitorRepository.findAll();
  }

  async createMonitor(monitor: Omit<ApiMonitor, 'id' | 'created_at'>): Promise<ApiMonitor> {
    return this.monitorRepository.create(monitor);
  }

  async updateMonitor(id: string, monitor: Partial<ApiMonitor>): Promise<ApiMonitor> {
    return this.monitorRepository.update(id, monitor);
  }

  async deleteMonitor(id: string): Promise<void> {
    return this.monitorRepository.delete(id);
  }

  async getCheckHistory(apiId: string): Promise<ApiCheck[]> {
    return this.checkRepository.findHistoryByApiId(apiId);
  }

  async checkAll(): Promise<void> {
    const monitors = await this.monitorRepository.findActive();
    await Promise.all(monitors.map(monitor => this.performCheck(monitor)));
  }

  private async performCheck(monitor: ApiMonitor): Promise<void> {
    const start = Date.now();
    let isOk = false;
    let statusCode = 0;
    let errorMessage = '';

    try {
      const response = await axios.get(monitor.url, {
        timeout: monitor.timeout_seconds * 1000,
        validateStatus: () => true // Don't throw on non-2xx
      });
      statusCode = response.status;
      isOk = statusCode >= 200 && statusCode < 300;
    } catch (error: any) {
      isOk = false;
      errorMessage = error.message;
      if (error.response) {
        statusCode = error.response.status;
      }
    }

    const latency = Date.now() - start;

    await this.checkRepository.create({
      api_id: monitor.id,
      is_ok: isOk,
      status_code: statusCode,
      latency_ms: latency,
      error_message: errorMessage
    });
  }
}
