import { Router } from 'express';
import { ApiMonitorController } from '../controllers/api_monitor.controller';

const router = Router();
const controller = new ApiMonitorController();

router.get('/', controller.getAllMonitors);
router.post('/', controller.createMonitor);
router.post('/check', controller.triggerCheck);
router.get('/:id/history', controller.getCheckHistory);
router.put('/:id', controller.updateMonitor);
router.delete('/:id', controller.deleteMonitor);

export default router;
