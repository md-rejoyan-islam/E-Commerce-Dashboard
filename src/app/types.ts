import { Request } from 'express';
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
  loginCode: number;
}

export interface IUser {
  _id: string;
  email: string;
  role: 'superadmin' | 'admin' | 'user';
  password?: string;
}

export interface IRequestWithUser extends Request {
  user?: Pick<IUser, '_id' | 'email' | 'role'>;
}
