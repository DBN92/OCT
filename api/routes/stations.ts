import { Router } from 'express';
import { StationController } from '../controllers/station.controller';

const router = Router();
const controller = new StationController();

router.get('/', controller.getAllStations);
router.get('/:id', controller.getStationById);
router.post('/', controller.createStation);
router.put('/:id', controller.updateStation);

export default router;
