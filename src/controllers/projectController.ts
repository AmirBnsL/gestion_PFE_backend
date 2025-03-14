import { Request, Response } from 'express';
import { AppDataSource } from '../datasource';
import { Project, ProjectStatus } from '../entities/Project';
import { PageQuery, ResponseDTO } from '../dtos/genericDTOs';


const getProjectOverview = async (req: Request<{projectId:string}>, res: Response) => {
    const projectRepository = AppDataSource.getRepository(Project);
    const project = await projectRepository.findOneOrFail({where:{id:parseInt(req.params.projectId)}});
    res.status(200).send({data:project});

}

const getApprovedProjects = async (req: Request<{}, {}, {}, PageQuery>, res: Response<ResponseDTO<Project[]>>) => {
  const projectRepository = AppDataSource.getRepository(Project);
  const projects = await projectRepository.findAndCount({
    take: parseInt(req.query.size),
    skip: parseInt(req.query.size) * (parseInt(req.query.page) - 1),
    where:{ status: ProjectStatus.APPROVED}
  });
  res.status(200).send({ data: projects[0] });
}


export { getProjectOverview, getApprovedProjects }
