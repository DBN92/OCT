import { BranchRepository } from '../repositories/branch.repository';
import { Branch } from '../types';

export class BranchService {
  private branchRepository: BranchRepository;

  constructor() {
    this.branchRepository = new BranchRepository();
  }

  async getAllBranches(): Promise<Branch[]> {
    const branches = await this.branchRepository.findAll();
    
    // MOCK Logic for POC: Simulate closed branches with reasons
    return branches.map(b => {
      // Simulate Rio de Janeiro closed due to Holiday
      if (b.city === 'Rio de Janeiro') {
        return { 
          ...b, 
          is_open: false, 
          closure_reason: 'Feriado Local (Aniversário da Cidade)' 
        };
      }
      
      // Simulate Curitiba closed due to Technical Issues (if needed, or keep open to show issues on stations)
      // Let's make Curitiba closed due to critical infrastructure failure for demo
      if (b.city === 'Curitiba') {
        return { 
          ...b, 
          is_open: false, 
          closure_reason: 'Indisponibilidade Crítica de Infraestrutura' 
        };
      }

      return b;
    });
  }

  async getBranchById(id: string): Promise<Branch | null> {
    return this.branchRepository.findById(id);
  }

  async createBranch(branchData: Omit<Branch, 'id' | 'created_at' | 'updated_at'>): Promise<Branch> {
    return this.branchRepository.create(branchData);
  }

  async updateBranch(id: string, branchData: Partial<Branch>): Promise<Branch> {
    return this.branchRepository.update(id, branchData);
  }
}
