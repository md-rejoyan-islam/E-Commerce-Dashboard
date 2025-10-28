import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/async-handler';
import { successResponse } from '../../utils/response-handler';
import { AuthService } from './auth.service';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const data = await AuthService.register(req.body);
  successResponse(res, {
    statusCode: 201,
    message: 'Registered successfully',
    payload: { data },
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };
  const data = await AuthService.login(email, password);
  successResponse(res, {
    statusCode: 200,
    message: 'Logged in',
    payload: { data },
  });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const { refresh_token } = req.body as { refresh_token: string };
  const data = await AuthService.refresh(refresh_token);
  successResponse(res, {
    statusCode: 200,
    message: 'Token refreshed',
    payload: { data },
  });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  // @ts-expect-error added by isLoggedIn
  const userId = req.user?._id as string;
  const data = await AuthService.logout(userId);
  successResponse(res, {
    statusCode: 200,
    message: 'Logged out',
    payload: { data },
  });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  // @ts-expect-error added by isLoggedIn
  const userId = req.user?._id as string;
  const data = await AuthService.me(userId);
  successResponse(res, {
    statusCode: 200,
    message: 'Profile fetched',
    payload: { data },
  });
});

export const updateMe = asyncHandler(async (req: Request, res: Response) => {
  // @ts-expect-error added by isLoggedIn
  const userId = req.user?._id as string;
  const data = await AuthService.updateMe(userId, req.body);
  successResponse(res, {
    statusCode: 200,
    message: 'Profile updated',
    payload: { data },
  });
});

export const changeMyPassword = asyncHandler(
  async (req: Request, res: Response) => {
    // @ts-expect-error added by isLoggedIn
    const userId = req.user?._id as string;
    const { old_password, new_password } = req.body as {
      old_password: string;
      new_password: string;
    };
    const data = await AuthService.changeMyPassword(
      userId,
      old_password,
      new_password,
    );
    successResponse(res, {
      statusCode: 200,
      message: 'Password changed',
      payload: { data },
    });
  },
);
