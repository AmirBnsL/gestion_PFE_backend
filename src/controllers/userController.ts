import { Request, Response } from 'express';
import { AppDataSource } from '../datasource';
import { UserType } from '../dtos/userDTOs';
import { ResponseDTO } from '../dtos/genericDTOs';
import bcrypt from "bcryptjs";




export const getUser = (req: Request, res: Response)  => {
  const userRepository= AppDataSource.getRepository('User');



};

export const createUser = async (req: Request<{},{},UserType>, res: Response<ResponseDTO<string>>) => {
  // Your implementation here
  const userRepository= AppDataSource.getRepository('User');
  if(await userRepository.existsBy({email:req.body.email})){
    res.status(400).send({data:"email already exists"});
  }

  try {

    const hashedPassword = await hashPassword(req.body.password);
    const user = userRepository.create({firstname:req.body.firstname,lastname:req.body.lastname,email:req.body.email,passwordHash : hashedPassword});
    await userRepository.save(user);
    res.status(201).send({ data:"user has been created"});
    
  }
  catch (error) {
    res.status(400).send({data:"error while creating user"});
  }


};
export const deleteUser = (req: Request, res: Response) => {
  res.send('Delete User');
}


const hashPassword = async (password: string) => {

  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);

}