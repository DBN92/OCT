import { Request, Response } from 'express';
import { TelemetryService } from '../services/telemetry.service';

export class TelemetryController {
  private telemetryService: TelemetryService;

  constructor() {
    this.telemetryService = new TelemetryService();
  }

  receiveTelemetry = async (req: Request, res: Response) => {
    try {
      const { station_id } = req.params;
      const telemetryData = req.body;
      
      const telemetry = await this.telemetryService.processTelemetry(station_id, telemetryData);
      res.status(201).json(telemetry);
    } catch (error) {
      console.error('Error processing telemetry:', error);
      res.status(500).json({ error: 'Failed to process telemetry' });
    }
  };

  getLatestTelemetry = async (req: Request, res: Response) => {
    try {
      const { station_id } = req.params;
      const telemetry = await this.telemetryService.getLatestTelemetry(station_id);
      if (!telemetry) {
        return res.status(404).json({ error: 'Telemetry not found' });
      }
      res.json(telemetry);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch telemetry' });
    }
  };

  getTelemetryHistory = async (req: Request, res: Response) => {
    try {
      const { station_id } = req.params;
      const history = await this.telemetryService.getTelemetryHistory(station_id);
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch telemetry history' });
    }
  };
}
