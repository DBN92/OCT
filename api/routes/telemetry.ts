import { Router } from 'express';
import { TelemetryController } from '../controllers/telemetry.controller';

const router = Router();
const controller = new TelemetryController();

router.post('/:station_id', controller.receiveTelemetry);
router.get('/:station_id/latest', controller.getLatestTelemetry);
router.get('/:station_id/history', controller.getTelemetryHistory);

export default router;
