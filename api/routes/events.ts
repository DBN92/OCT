import { Router } from 'express';
import { EventController } from '../controllers/event.controller';

const router = Router();
const controller = new EventController();

router.get('/', controller.getAllEvents);
router.get('/tickets', controller.getAllTickets);
router.get('/:id', controller.getEventById);

export default router;
