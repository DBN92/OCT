import { supabase } from '../config/supabase';
import { Event } from '../types';

export class EventRepository {
  async findAll(filters?: { 
    severity?: string; 
    status?: string; 
    station_id?: string;
    branch_id?: string;
    start_date?: string;
    end_date?: string;
  }): Promise<Event[]> {
    let query = supabase.from('events').select('*, tickets(itsm_id)');

    if (filters?.severity) {
      query = query.eq('severity', filters.severity);
    }
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.station_id) {
      query = query.eq('station_id', filters.station_id);
    }
    if (filters?.branch_id) {
      query = query.eq('branch_id', filters.branch_id);
    }
    if (filters?.start_date) {
      query = query.gte('created_at', filters.start_date);
    }
    if (filters?.end_date) {
      query = query.lte('created_at', filters.end_date);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Flatten tickets data for easier consumption if needed, or let frontend handle it
    return data || [];
  }

  async findById(id: string): Promise<Event | null> {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return null;
    return data;
  }

  async create(event: Omit<Event, 'id' | 'created_at'>): Promise<Event> {
    const { data, error } = await supabase
      .from('events')
      .insert(event)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async update(id: string, event: Partial<Event>): Promise<Event> {
    const { data, error } = await supabase
      .from('events')
      .update(event)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
}
