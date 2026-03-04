import { Request, Response } from 'express';
import { ApiMonitorService } from '../services/api_monitor.service';

export class ApiMonitorController {
  private monitorService: ApiMonitorService;

  constructor() {
    this.monitorService = new ApiMonitorService();
  }

  getAllMonitors = async (req: Request, res: Response) => {
    try {
      const monitors = await this.monitorService.getAllMonitors();
      res.json(monitors);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch API monitors' });
    }
  };

  createMonitor = async (req: Request, res: Response) => {
    try {
      const monitor = await this.monitorService.createMonitor(req.body);
      res.status(201).json(monitor);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create API monitor' });
    }
  };

  updateMonitor = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const monitor = await this.monitorService.updateMonitor(id, req.body);
      res.json(monitor);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update API monitor' });
    }
  };

  deleteMonitor = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await this.monitorService.deleteMonitor(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete API monitor' });
    }
  };

  getCheckHistory = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const history = await this.monitorService.getCheckHistory(id);
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch check history' });
    }
  };

  triggerCheck = async (req: Request, res: Response) => {
    try {
      await this.monitorService.checkAll();
      res.json({ message: 'Checks triggered' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to trigger checks' });
    }
  };
}
