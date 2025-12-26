import { NextFunction, Request, Response } from 'express';
import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import secret from '../app/secret';
import { IJwtPayload } from '../app/types';

import UserModel from '../modules/user/user.model';
import { asyncHandler } from '../utils/async-handler';

export const isLoggedIn = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const token =
      req.headers?.authorization?.split('Bearer ')[1] ||
      req.cookies?.access_token;

    if (!token || token === 'null') {
      throw createError.Unauthorized('Please login to access this resource.');
    }

    const decoded = jwt.verify(
      token,
      secret.jwt.accessTokenSecret,
    ) as IJwtPayload;
    const user = await UserModel.findById(decoded._id)
      .select('role email')
      .lean();

    if (!user) {
      throw createError.Unauthorized(
        'Login User not found or no longer exists!',
      );
    }

    req.user = {
      _id: user._id.toString(),
      email: user.email,
      role: user.role,
    };
    next();
  },
);

export const isLoggedOut = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const token =
      req.headers?.authorization?.split('Bearer ')[1] ||
      req.cookies?.access_token;

    // check token
    const isValid = jwt.decode(token as string);

    if (isValid) {
      throw createError.Unauthorized('You are already logged in');
    }

    next();
  },
);
