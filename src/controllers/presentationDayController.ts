import { Request, Response } from 'express';

import { PresentationDay } from '../entities/PresentationDay';
import { PresentationSlot } from '../entities/PresentationSlot';
import { AppDataSource } from '../configs/datasource';
import { AcademicYear } from '../enums/AcademicYear';
import { In } from 'typeorm';
import { Teacher } from '../entities/Teacher';
import { Team } from '../entities/Team';
import { JwtRequest } from '../middleware/authJwt';
import { Student } from '../entities/Student';

export async function createPresentationDay(
  req: Request<
    {},
    any,
    { date: Date; status: any; academicYear: AcademicYear }
  >,
  res: Response,
) {
  try {
    const { date, status, academicYear } = req.body;
    const repo = AppDataSource.getRepository(PresentationDay);
    // find if a day already exists for the same date and academic year
    const existingDay = await repo.findOne({
      where: { date, academicYear },
    });

    const day = existingDay || new PresentationDay();
    day.date = date;
    day.status = status;
    day.academicYear = academicYear;
    day.slots = [];
    await repo.save(day);
    res.status(201).json({ data: day });
  } catch (err) {
    res
      .status(500)
      .json({ error: 'Failed to create presentation day', details: err });
  }
}

export async function getPresentationDays(req: Request, res: Response) {
  try {
    const repo = AppDataSource.getRepository(PresentationDay);
    const days = await repo.find({
      relations: {
        slots: {
          team: true,
          judges: true,
        },
      },
    });
    res.json({ data: days });
  } catch (err) {
    res
      .status(500)
      .json({ error: 'Failed to fetch presentation days', details: err });
  }
}

export async function getPresentationDayById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const repo = AppDataSource.getRepository(PresentationDay);
    const day = await repo.findOne({
      where: {
        id: Number(id),
      },
    });
    if (!day) {
      res.status(404).json({ error: 'Presentation day not found' });
      return;
    }
    res.json({ data: day });
  } catch (err) {
    res
      .status(500)
      .json({ error: 'Failed to fetch presentation day', details: err });
  }
}

export async function updatePresentationDay(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { date, status } = req.body;
    const repo = AppDataSource.getRepository(PresentationDay);
    const day = await repo.findOne({ where: { id: Number(id) } });
    if (!day) {
      res.status(404).json({ error: 'Presentation day not found' });
      return;
    }
    if (date !== undefined) day.date = date;
    if (status !== undefined) day.status = status;
    await repo.save(day);
    res.json({ data: day });
  } catch (err) {
    res
      .status(500)
      .json({ error: 'Failed to update presentation day', details: err });
  }
}

export async function addSlotToDay(
  req: Request<
    { id: string },
    any,
    {
      startTime: string;
      endTime: string;
      room: string;
      judges: number[];
      teamId: number;
    }
  >,
  res: Response,
) {
  try {
    const { id } = req.params;
    const { startTime, endTime, room, judges, teamId } = req.body;
    const dayRepo = AppDataSource.getRepository(PresentationDay);
    const slotRepo = AppDataSource.getRepository(PresentationSlot);
    const teacherRepo = AppDataSource.getRepository(Teacher);
    const teamRepo = AppDataSource.getRepository(Team);

    const judgesEntities = await teacherRepo.find({
      where: { id: In(judges) },
    });
    const day = await dayRepo.findOne({
      where: { id: parseInt(id) },
      relations: ['slots'],
    });

    const team = await teamRepo.findOne({
      where: { id: teamId },
    });

    if (!judgesEntities || judgesEntities.length === 0) {
      res.status(400).json({ error: 'No valid judges provided' });
      return;
    }

    if (!startTime || !endTime || !room) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    if (!team) {
      res.status(400).json({ error: 'Team not found' });
      return;
    }

    if (!day) {
      res.status(404).json({ error: 'Presentation day not found' });
      return;
    }
    const slot = new PresentationSlot();
    slot.startTime = startTime;
    slot.endTime = endTime;
    slot.room = room;
    slot.presentationDay = day;
    slot.judges = judgesEntities;
    slot.team = team;
    await slotRepo.save(slot);
    res.status(201).json(slot);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add slot', details: err });
  }
}

export async function getSlotsForDay(
  req: Request<{ id: string }>,
  res: Response,
) {
  try {
    const { id } = req.params;
    const dayRepo = AppDataSource.getRepository(PresentationDay);
    const day = await dayRepo.findOne({
      where: { id: Number(id) },
      relations: ['slots', 'slots.team', 'slots.judges'],
    });
    if (!day) {
      res.status(404).json({ error: 'Presentation day not found' });
      return;
    }
    res.json({ data: day });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch slots', details: err });
  }
}

export async function getPresentationsForJudge(req: JwtRequest, res: Response) {
  try {
    const judgeId = req.user.teacher.id;
    const slotRepo = AppDataSource.getRepository(PresentationSlot);
    const slots = await slotRepo.find({
      where: {
        judges: {
          id: Number(judgeId),
        },
      },
      relations: ['presentationDay', 'team'],
    });
    if (!slots || slots.length === 0) {
      res.status(404).json({ error: 'No presentations found for this judge' });
      return;
    }
    res.json({ data: slots });
  } catch (err) {
    res
      .status(500)
      .json({ error: 'Failed to fetch presentations', details: err });
  }
}

export async function getPresentationForStudent(
  req: JwtRequest,
  res: Response,
) {
  try {
    const studentId = req.user.student.id;
    const studentRepo = AppDataSource.getRepository(Student);

    const student = await studentRepo.findOne({
      where: { id: Number(studentId) },
      relations: {
        teamMembership: {
          team: { presentationDay: { presentationDay: true } },
        },
      },
    });
    const team = student?.teamMembership.team;

    if (!team || !team.presentationDay) {
      res
        .status(404)
        .json({ error: 'No presentations found for this student' });
      return;
    }

    res.json({ data: team });
  } catch (err) {
    res
      .status(500)
      .json({ error: 'Failed to fetch presentations', details: err });
  }
}
