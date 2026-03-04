import { supabase } from '../config/supabase';
import { Branch } from '../types';

export class BranchRepository {
  async findAll(): Promise<Branch[]> {
    const { data, error } = await supabase
      .from('branches')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  }

  async findById(id: string): Promise<Branch | null> {
    const { data, error } = await supabase
      .from('branches')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return null;
    return data;
  }

  async create(branch: Omit<Branch, 'id' | 'created_at' | 'updated_at'>): Promise<Branch> {
    const { data, error } = await supabase
      .from('branches')
      .insert(branch)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async update(id: string, branch: Partial<Branch>): Promise<Branch> {
    const { data, error } = await supabase
      .from('branches')
      .update({ ...branch, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
}
