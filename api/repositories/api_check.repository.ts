import { supabase } from '../config/supabase';
import { ApiCheck } from '../types';

export class ApiCheckRepository {
  async create(check: Omit<ApiCheck, 'id' | 'checked_at'>): Promise<ApiCheck> {
    const { data, error } = await supabase
      .from('api_checks')
      .insert(check)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async findHistoryByApiId(apiId: string, limit: number = 50): Promise<ApiCheck[]> {
    const { data, error } = await supabase
      .from('api_checks')
      .select('*')
      .eq('api_id', apiId)
      .order('checked_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data || [];
  }
}
