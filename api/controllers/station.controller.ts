import { Request, Response } from 'express';
import { StationService } from '../services/station.service';

export class StationController {
  private stationService: StationService;

  constructor() {
    this.stationService = new StationService();
  }

  getAllStations = async (req: Request, res: Response) => {
    try {
      const { branch_id, status } = req.query;
      const filters = {
        branch_id: branch_id as string,
        status: status as string
      };
      
      const stations = await this.stationService.getAllStations(filters);
      res.json(stations);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch stations' });
    }
  };

  getStationById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const station = await this.stationService.getStationById(id);
      if (!station) {
        return res.status(404).json({ error: 'Station not found' });
      }
      res.json(station);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch station' });
    }
  };

  createStation = async (req: Request, res: Response) => {
    try {
      const stationData = req.body;
      const station = await this.stationService.createStation(stationData);
      res.status(201).json(station);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create station' });
    }
  };

  updateStation = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const stationData = req.body;
      const station = await this.stationService.updateStation(id, stationData);
      res.json(station);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update station' });
    }
  };
}
