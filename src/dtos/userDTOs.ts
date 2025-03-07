
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
}

export interface UserLoginInputType {
  email:string
  password:string
}