import { Project } from '../entities/Project';
import Specialty from '../enums/specialty';

export class ProjectDTORequest {
  title: string;
  description: string;
  specialty: Specialty;
}
