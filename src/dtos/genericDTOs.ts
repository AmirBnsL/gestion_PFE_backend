export interface ResponseDTO<T> {
  data: T
}


export interface ErrorDTO {
  error:string
  details : Array<string>
}