import { Project } from '../entities/Project';
import Specialty from '../enums/specialty';

export class ProjectDTORequest {
  title: string;
  description: string;
  specialty: Specialty;
}


export class WishListEntryDTO {
  project: number;
  priority: number; // 1 = top choice, 2 = second, etc.
}