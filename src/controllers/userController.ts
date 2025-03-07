import { Request, Response } from 'express';
import { AppDataSource } from '../datasource';
import { UserLoginInputType, UserRegistrationInputType } from '../dtos/userDTOs';
import { ResponseDTO } from '../dtos/genericDTOs';
import bcrypt from 'bcryptjs';
import { EntityNotFoundError, Repository } from 'typeorm';
import jwt from 'jsonwebtoken';
import { signJwt } from '../middleware/authJwt';
import { User } from '../entities/User';
import morgan from 'morgan';


interface jwtHeader {
  alg: string;
  typ: string;
}

interface jwtPayload {}

export const getUser = (req: Request, res: Response) => {
  const userRepository = AppDataSource.getRepository('User');


};

export const createUser = async (req: Request<{}, {}, UserRegistrationInputType>, res: Response<ResponseDTO<string>>) => {
  // Your implementation here
  const userRepository = AppDataSource.getRepository('User');
  if (await userRepository.existsBy({ email: req.body.email })) {
    res.status(400).send({ data: 'email already exists' });
  }

  try {

    const hashedPassword = await hashPassword(req.body.password);
    const user = userRepository.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      passwordHash: hashedPassword,
    });
    await userRepository.save(user);
    res.status(201).send({ data: 'user has been created' });

  } catch (error) {
    res.status(400).send({ data: 'error while creating user' });
  }


};
export const deleteUser = (req: Request, res: Response) => {
  res.send('Delete User');
};


const hashPassword = async (password: string) => {

  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);

};





export const login = async (req: Request<{}, {}, UserLoginInputType>, res: Response<ResponseDTO<string>>) => {
  const userRepository = AppDataSource.getRepository<User>('User');
  try {
    const user = await userRepository.findOneByOrFail({ email: req.body.email });
    if (await bcrypt.compare(req.body.password, user.passwordHash)) {

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
