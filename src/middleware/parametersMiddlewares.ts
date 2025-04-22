import { JwtRequest } from './authJwt';
import { Response, NextFunction } from 'express';
import { Parameter } from '../entities/Parameter';
import { AppDataSource } from '../configs/datasource';

export const ifAllowedTeamCreation = async (
  req: JwtRequest,
  res: Response,
  next: NextFunction,
) => {
  const user = req.user;
  const parameterRepository = AppDataSource.getRepository(Parameter);

  try {
    const parameter = await parameterRepository.findOne({
      where: {
        year: user.student.academicYear,
      },
    });

    if (!parameter) {
      return res.status(404).json({ message: 'Parameter not found' });
    }

    if (!parameter.allowTeamCreation) {
      return res.status(403).json({ message: 'Team creation is not allowed' });
    }

    next();
  } catch (error) {
    console.error('Error checking team creation permission:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const ifAllowedTeamJoining = async (
  req: JwtRequest,
  res: Response,
  next: NextFunction,
) => {
  const user = req.user;
  const parameterRepository = AppDataSource.getRepository(Parameter);

  try {
    const parameter = await parameterRepository.findOne({
      where: {
        year: user.student.academicYear,
      },
    });

    if (!parameter) {
      return res.status(404).json({ message: 'Parameter not found' });
    }

    if (!parameter.allowTeamJoining) {
      return res.status(403).json({ message: 'Team joining is not allowed' });
    }

    next();
  } catch (error) {
    console.error('Error checking team joining permission:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const ifAllowedWishListCreation = async (
  req: JwtRequest,
  res: Response,
  next: NextFunction,
) => {
  const user = req.user;
  const parameterRepository = AppDataSource.getRepository(Parameter);

  try {
    const parameter = await parameterRepository.findOne({
      where: {
        year: user.student.academicYear,
      },
    });

    if (!parameter) {
      return res.status(404).json({ message: 'Parameter not found' });
    }

    if (!parameter.allowWishListCreation) {
      return res
        .status(403)
        .json({ message: 'Wish list creation is not allowed' });
    }
    next();
  } catch (error) {
    console.error('Error checking wish list creation permission:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
