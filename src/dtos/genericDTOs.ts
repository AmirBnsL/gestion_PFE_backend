import { ParsedQs } from 'qs';

export interface ResponseDTO<T> {
  data: T;
}

export interface ErrorDTO {
  error: string;
  details: Array<string>;
}

export interface PageQuery extends ParsedQs {
  page: string;
  size: string;
}
