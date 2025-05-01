import { Task, TaskStatus } from '../entities/Task';
import { Priority } from '../entities/Announcement';

export class TaskRequestDTO {
  status: TaskStatus;
  title: string;
  description: string;
  assignedTo: number[]; // IDs of the assigned students
  priority: Priority;
  dueDate: Date;
  sprintId: number; // ID of the project
  teamId: number; // ID of the team
}

export class TaskDTO {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  assignedTo: number[]; // IDs of the assigned students
  priority: Priority;
  dueDate: Date;
  sprintId: number; // ID of the project

  static toDTO(task: Task): TaskDTO {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      assignedTo: task.assignedTo.map(student => student.id),
      priority: task.priority,
      dueDate: task.dueDate,
      sprintId: task.sprint.id,
    };
  }
}
