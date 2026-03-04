import { supabase } from '../config/supabase';
import { Telemetry } from '../types';

export class TelemetryRepository {
  async create(telemetry: Omit<Telemetry, 'id' | 'recorded_at'>): Promise<Telemetry> {
    const { data, error } = await supabase
      .from('telemetry')
      .insert(telemetry)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async findLatestByStation(stationId: string): Promise<Telemetry | null> {
    const { data, error } = await supabase
      .from('telemetry')
      .select('*')
      .eq('station_id', stationId)
      .order('recorded_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error) return null;
    return data;
  }

  async findHistoryByStation(stationId: string, limit: number = 100): Promise<Telemetry[]> {
    const { data, error } = await supabase
      .from('telemetry')
      .select('*')
      .eq('station_id', stationId)
      .order('recorded_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data || [];
  }
}
