import { UserRole } from '../entities/User';

export interface UserType {
  id:number
  password:string
  firstname:string
  lastname:string
  email:string

}


export interface UserRegistrationInputType {
  password:string
  firstname:string
  lastname:string
  email:string
  role:UserRole
}

export interface UserLoginInputType {
  email:string
  password:string
}