import { supabase } from '../config/supabase';
import { ApiMonitor } from '../types';

export class ApiMonitorRepository {
  async findAll(): Promise<ApiMonitor[]> {
    const { data, error } = await supabase
      .from('api_monitors')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  }

  async findActive(): Promise<ApiMonitor[]> {
    const { data, error } = await supabase
      .from('api_monitors')
      .select('*')
      .eq('is_active', true)
      .order('name');
    
    if (error) throw error;
    return data || [];
  }

  async findById(id: string): Promise<ApiMonitor | null> {
    const { data, error } = await supabase
      .from('api_monitors')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return null;
    return data;
  }

  async create(monitor: Omit<ApiMonitor, 'id' | 'created_at'>): Promise<ApiMonitor> {
    const { data, error } = await supabase
      .from('api_monitors')
      .insert(monitor)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async update(id: string, monitor: Partial<ApiMonitor>): Promise<ApiMonitor> {
    const { data, error } = await supabase
      .from('api_monitors')
      .update(monitor)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('api_monitors')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
}
