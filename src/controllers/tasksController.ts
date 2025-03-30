import { AppDataSource } from '../configs/datasource';
import { Task } from '../entities/Task';
import { Project } from '../entities/Project';
import { EntityNotFoundError } from 'typeorm';
import { Request, Response } from 'express';
import { TaskDTO, TaskRequestDTO } from '../dtos/taskDTOS';
import { Student } from '../entities/Student';

export const getTasksByProjectId = async (
  req: Request<{ projectId: string }>,
  res: Response,
) => {
  try {
    const taskRepository = AppDataSource.getRepository(Task);

    const projectRepository = AppDataSource.getRepository(Project);
    const project = await projectRepository.findOneOrFail({
      where: { id: parseInt(req.params.projectId) },
    });

    const tasks = await taskRepository.find({
      where: { project: { id: project.id } },
      loadRelationIds: {
        relations: ['assignedTo'], // Load only the IDs for assignedTo
      },
    });
    res.status(200).send({ data: tasks });
  } catch (e) {
    console.log(e);
    if (e instanceof EntityNotFoundError) {
      res.status(404).send({ message: 'Tasks not found' });
    } else {
      res.status(500).send({ message: 'Internal server error' });
    }
  }
};

//make sure them students on the same team
// make sure the project is not completed
export const createTask = async (
  req: Request<{}, {}, TaskRequestDTO>,
  res: Response,
) => {
  try {
    const taskRepository = AppDataSource.getRepository(Task);
    const projectRepository = AppDataSource.getRepository(Project);
    const studentRepository = AppDataSource.getRepository(Student);

    const project = await projectRepository.findOneOrFail({
      where: { id: req.body.projectId },
      relations: ['team'],
    });

    if (project.status === 'COMPLETED') {
      res.status(400).send({ message: 'Project is already completed' });
      return;
    }

    const students: Student[] = [];
    const teamId = project.team.filter(team => team.id === req.body.teamId)[0]
      .id;

    for (const studentId of req.body.assignedTo) {
      const student = await studentRepository.findOneOrFail({
        where: { id: studentId, team: { id: teamId } },
      });
      students.push(student);
    }

    if (students.length !== req.body.assignedTo.length) {
      res
        .status(400)
        .send({ message: 'All students must be on the same team' });
      return;
    }

    const task = new Task();
    task.title = req.body.title;
    task.description = req.body.description;
    task.project = project;
    task.assignedTo = students;
    task.dueDate = req.body.dueDate;
    task.priority = req.body.priority;
    task.status = req.body.status;
    await taskRepository.save(task);
    res.status(201).send({ data: 'task created successfully' });
  } catch (e) {
    if (e instanceof EntityNotFoundError) {
      res.status(404).send({ message: 'Project not found' });
      return;
    }

    console.log(e);
    res.status(500).send({ message: 'Internal server error' });
  }
};

export const assignTask = async (req: Request, res: Response) => {
  // Assign a task to a student
};
