import { Router } from 'express';
import { authorize } from '../../middlewares/authorized';
import validate from '../../middlewares/validate';
import { isLoggedIn } from '../../middlewares/verify';
import {
  changeUserPassword,
  changeUserStatus,
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from './user.controller';
import {
  changePasswordSchema,
  changeStatusSchema,
  createUserSchema,
  getUserByIdSchema,
  getUsersQuerySchema,
  updateUserSchema,
} from './user.validation';

const userRouter = Router();

// admin only
userRouter.use(isLoggedIn, authorize(['admin', 'superadmin']));

userRouter.get('/', validate(getUsersQuerySchema), getUsers);

userRouter.post('/', validate(createUserSchema), createUser);

userRouter.patch('/:id/status', validate(changeStatusSchema), changeUserStatus);

userRouter.patch(
  '/:id/change-password',
  validate(changePasswordSchema),
  changeUserPassword,
);

userRouter.get('/:id', validate(getUserByIdSchema), getUserById);

userRouter.put('/:id', validate(updateUserSchema), updateUser);

userRouter.delete('/:id', deleteUser);

export default userRouter;
