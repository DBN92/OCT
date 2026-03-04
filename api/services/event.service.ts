import { EventRepository } from '../repositories/event.repository';
import { TicketRepository } from '../repositories/ticket.repository';
import { BranchRepository } from '../repositories/branch.repository';
import { Event, Ticket } from '../types';

export class EventService {
  private eventRepository: EventRepository;
  private ticketRepository: TicketRepository;
  private branchRepository: BranchRepository;

  constructor() {
    this.eventRepository = new EventRepository();
    this.ticketRepository = new TicketRepository();
    this.branchRepository = new BranchRepository();
  }

  async getAllEvents(filters?: any): Promise<Event[]> {
    return this.eventRepository.findAll(filters);
  }

  async getEventById(id: string): Promise<Event | null> {
    return this.eventRepository.findById(id);
  }

  async createEvent(eventData: Omit<Event, 'id' | 'created_at'>): Promise<Event> {
    // Check branch status for silencing
    if (eventData.branch_id) {
      const branch = await this.branchRepository.findById(eventData.branch_id);
      if (branch && !branch.is_open && eventData.type !== 'unauthorized_activity') {
        // Silence event or mark as info
        eventData.severity = 'info';
        eventData.status = 'resolved';
        eventData.payload = { ...eventData.payload, note: 'Silenced due to branch closed' };
      }
    }

    const event = await this.eventRepository.create(eventData);

    // Auto-create ticket if critical
    if (event.severity === 'critical') {
      await this.createTicketForEvent(event);
    }

    return event;
  }

  private async createTicketForEvent(event: Event): Promise<void> {
    // Deduplication: Check if ticket already exists for this event
    const existingTicket = await this.ticketRepository.findByEventId(event.id);
    if (existingTicket) return;

    // Mock ITSM integration
    const itsmId = `INC-${Date.now()}`;
    
    await this.ticketRepository.create({
      event_id: event.id,
      itsm_id: itsmId,
      status: 'open',
      priority: 'high',
      responsible_team: 'IT Support'
    });
  }

  async getAllTickets(): Promise<Ticket[]> {
    return this.ticketRepository.findAll();
  }
}
