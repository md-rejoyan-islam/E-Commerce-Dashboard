import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/async-handler';
import { successResponse } from '../../utils/response-handler';
import { UserService } from './user.service';
import { GetUsersQuery } from './user.validation';

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const data = await UserService.list(req.query as GetUsersQuery);
  successResponse(res, {
    statusCode: 200,
    message: 'Users fetched',
    payload: { ...data },
  });
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const data = await UserService.getById(req.params.id);
  successResponse(res, {
    statusCode: 200,
    message: 'User fetched',
    payload: { data },
  });
});

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const data = await UserService.create(req.body);
  successResponse(res, {
    statusCode: 201,
    message: 'User created',
    payload: { data },
  });
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const data = await UserService.update(req.params.id, req.body);
  successResponse(res, {
    statusCode: 200,
    message: 'User updated',
    payload: { data },
  });
});

export const changeUserStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await UserService.changeStatus(
      req.params.id,
      req.body.is_active,
    );
    successResponse(res, {
      statusCode: 200,
      message: 'User status updated',
      payload: { data },
    });
  },
);

export const changeUserPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await UserService.changePassword(
      req.params.id,
      req.body.password,
    );
    successResponse(res, {
      statusCode: 200,
      message: 'User password updated',
      payload: { data },
    });
  },
);

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const data = await UserService.remove(req.params.id);
  successResponse(res, {
    statusCode: 200,
    message: 'User deleted',
    payload: { data },
  });
});
