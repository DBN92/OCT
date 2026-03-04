import { supabase } from '../config/supabase';
import { Ticket } from '../types';

export class TicketRepository {
  async findByEventId(eventId: string): Promise<Ticket | null> {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .eq('event_id', eventId)
      .single();
    
    if (error) return null;
    return data;
  }

  async findAll(): Promise<Ticket[]> {
    const { data, error } = await supabase
      .from('tickets')
      .select('*, events(*)')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async create(ticket: Omit<Ticket, 'id' | 'created_at' | 'updated_at'>): Promise<Ticket> {
    const { data, error } = await supabase
      .from('tickets')
      .insert(ticket)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async update(id: string, ticket: Partial<Ticket>): Promise<Ticket> {
    const { data, error } = await supabase
      .from('tickets')
      .update({ ...ticket, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
}
