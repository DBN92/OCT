import { Request, Response } from 'express';
import { BranchService } from '../services/branch.service';

export class BranchController {
  private branchService: BranchService;

  constructor() {
    this.branchService = new BranchService();
  }

  getAllBranches = async (req: Request, res: Response) => {
    try {
      const branches = await this.branchService.getAllBranches();
      res.json(branches);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch branches' });
    }
  };

  getBranchById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const branch = await this.branchService.getBranchById(id);
      if (!branch) {
        return res.status(404).json({ error: 'Branch not found' });
      }
      res.json(branch);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch branch' });
    }
  };

  createBranch = async (req: Request, res: Response) => {
    try {
      const branchData = req.body;
      const branch = await this.branchService.createBranch(branchData);
      res.status(201).json(branch);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create branch' });
    }
  };

  updateBranch = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const branchData = req.body;
      const branch = await this.branchService.updateBranch(id, branchData);
      res.json(branch);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update branch' });
    }
  };
}
