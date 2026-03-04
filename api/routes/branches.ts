import { Router } from 'express';
import { BranchController } from '../controllers/branch.controller';

const router = Router();
const controller = new BranchController();

router.get('/', controller.getAllBranches);
router.get('/:id', controller.getBranchById);
router.post('/', controller.createBranch);
router.put('/:id', controller.updateBranch);

export default router;
