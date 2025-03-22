import { Request, Response } from 'express';
import { AppDataSource } from '../datasource';
import { UserLoginInputType, UserRegistrationInputType } from '../dtos/userDTOs';
import { ResponseDTO } from '../dtos/genericDTOs';
import bcrypt from 'bcryptjs';
import { EntityNotFoundError } from 'typeorm';

import { signJwt } from '../middleware/authJwt';
import { User } from '../entities/User';



export const getProfile = async (req: Request, res: Response<ResponseDTO<User>>) => {
  
}



export const createUser = async (req: Request<{}, {}, UserRegistrationInputType>, res: Response<ResponseDTO<string>>) => {
  // Your implementation here
  const userRepository = AppDataSource.getRepository('User');
  if (await userRepository.existsBy({ email: req.body.email })) {
    res.status(400).send({ data: 'email already exists' });
  }

  try {

    const user = userRepository.create({
      email: req.body.email,
      passwordHash: req.body.password,
      role: req.body.role
    });
    await userRepository.save(user);
    res.status(201).send({ data: 'user has been created' });

  } catch (error) {
    res.status(400).send({ data: 'error while creating user' });
  }


};


export const login = async (req: Request<{}, {}, UserLoginInputType>, res: Response<ResponseDTO<string>>) => {
  const userRepository = AppDataSource.getRepository<User>('User');
  debugger
  try {
    const user = await userRepository.findOneByOrFail({ email: req.body.email });
    if (await bcrypt.compare(req.body.password, user.passwordHash)) {
      debugger
      const token = signJwt(user);
      res.status(200).send({ data: token });
      return;
    } else {
      res.status(401).send({ data: 'Invalid password' });
      return

    }
  } catch (error) {
    if (error instanceof EntityNotFoundError) {
      res.status(409).send({ data: 'user not found' });

    }
  }

};
