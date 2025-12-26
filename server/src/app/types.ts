import { JwtPayload } from 'jsonwebtoken';

export interface ISuccessResponse {
  statusCode?: number;
  message?: string;
  payload?: object;
}

export interface IErrorResponse {
  success: boolean;
  message: string;
  errors: { path: string | number; message: string }[];
  stack?: string;
}

export interface IJwtPayload extends JwtPayload {
  _id: string;
  role: 'superadmin' | 'admin' | 'user';
  email: string;
}

export interface IUser {
  _id: string;
  email: string;
  role: 'superadmin' | 'admin' | 'user';
  password?: string;
}

export interface IPagination {
  items: number;
  limit: number;
  page: number;
  totalPages: number;
}

export interface IResultsWithPagination<T> {
  data: T[];
  pagination: IPagination;
}

export interface IMulterConfig {
  uploadPath: string; // (e.g., 'public/uploads/brands')
  maxSize: number; // Maximum file size in MB
  allowedMimeTypes?: string[]; // (e.g., ['image/jpeg', 'image/png'])
  single: boolean; // True for single file upload, false for multiple
  fieldName: string; // Field name for the file input (default: 'file' or 'files')
}

export type ROLE = 'superadmin' | 'admin' | 'user';
