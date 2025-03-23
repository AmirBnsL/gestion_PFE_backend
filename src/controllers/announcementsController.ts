import { Request, Response } from 'express';
import { Announcement, Audience, Priority } from '../entities/Announcement';
import { PageQuery, ResponseDTO } from '../dtos/genericDTOs';
import { AppDataSource } from '../configs/datasource';

const publishAnnouncement = async (req: Request<{}, {}, {
  title: string,
  body: string,
  audience: Audience,
  priority: Priority
}>, res: Response<ResponseDTO<string>>) => {
  const announcementRepository = AppDataSource.getRepository(Announcement);
  const announcement = new Announcement();
  announcement.title = req.body.title;
  announcement.body = req.body.body;
  announcement.audience = req.body.audience;
  announcement.priority = req.body.priority;

  await announcementRepository.save(announcement);
  res.status(200).send({ data: 'Announcement has been published' });
};


const getAnnouncments = async (req: Request<{},{},{},PageQuery>, res: Response) => {
  const announcementRepository = AppDataSource.getRepository(Announcement);
  const announcements = await announcementRepository.find({
    take: parseInt(req.query.size),
    skip: parseInt(req.query.page)
    }
  );
  res.status(200).send({ data: announcements });
}

export {publishAnnouncement,getAnnouncments};