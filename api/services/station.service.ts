import { StationRepository } from '../repositories/station.repository';
import { Station } from '../types';

export class StationService {
  private stationRepository: StationRepository;

  constructor() {
    this.stationRepository = new StationRepository();
  }

  async getAllStations(filters?: { branch_id?: string; status?: string }): Promise<Station[]> {
    return this.stationRepository.findAll(filters);
  }

  async getStationById(id: string): Promise<Station | null> {
    return this.stationRepository.findById(id);
  }

  async createStation(stationData: Omit<Station, 'id' | 'created_at' | 'updated_at'>): Promise<Station> {
    // Here we could add validation logic, e.g. check if branch exists
    return this.stationRepository.create(stationData);
  }

  async updateStation(id: string, stationData: Partial<Station>): Promise<Station> {
    return this.stationRepository.update(id, stationData);
  }
}
