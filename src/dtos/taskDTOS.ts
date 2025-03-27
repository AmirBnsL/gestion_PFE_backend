import { Task, TaskStatus } from '../entities/Task';
import { Priority } from '../entities/Announcement';

export class TaskRequestDTO {
  status: TaskStatus;
  title: string;
  description: string;
  assignedTo: number[]; // IDs of the assigned students
  priority: Priority;
  dueDate: Date;
  projectId: number; // ID of the project
}

export class TaskDTO {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  assignedTo: number[]; // IDs of the assigned students
  priority: Priority;
  dueDate: Date;
  projectId: number; // ID of the project

  static toDTO(task: Task): TaskDTO {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      assignedTo: task.assignedTo.map(student => student.id),
      priority: task.priority,
      dueDate: task.dueDate,
      projectId: task.project.id,
    };
  }
}
