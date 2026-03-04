import { Request, Response } from 'express';
import { EventService } from '../services/event.service';

export class EventController {
  private eventService: EventService;

  constructor() {
    this.eventService = new EventService();
  }

  getAllEvents = async (req: Request, res: Response) => {
    try {
      const filters = req.query;
      const events = await this.eventService.getAllEvents(filters);
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch events' });
    }
  };

  getEventById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const event = await this.eventService.getEventById(id);
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }
      res.json(event);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch event' });
    }
  };

  getAllTickets = async (req: Request, res: Response) => {
    try {
      const tickets = await this.eventService.getAllTickets();
      res.json(tickets);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch tickets' });
    }
  };
}
