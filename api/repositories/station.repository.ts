import { supabase } from '../config/supabase';
import { Station } from '../types';

export class StationRepository {
  async findAll(filters?: { branch_id?: string; status?: string }): Promise<Station[]> {
    let query = supabase.from('stations').select('*');

    if (filters?.branch_id) {
      query = query.eq('branch_id', filters.branch_id);
    }
    if (filters?.status) {
      query = query.eq('health_status', filters.status);
    }

    const { data, error } = await query.order('hostname');
    
    if (error) throw error;
    return data || [];
  }

  async findById(id: string): Promise<Station | null> {
    const { data, error } = await supabase
      .from('stations')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return null;
    return data;
  }

  async create(station: Omit<Station, 'id' | 'created_at' | 'updated_at'>): Promise<Station> {
    const { data, error } = await supabase
      .from('stations')
      .insert(station)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async update(id: string, station: Partial<Station>): Promise<Station> {
    const { data, error } = await supabase
      .from('stations')
      .update({ ...station, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateStatus(id: string, status: Station['health_status']): Promise<void> {
    const { error } = await supabase
      .from('stations')
      .update({ 
        health_status: status, 
        last_seen: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    
    if (error) throw error;
  }
}
