import { Router } from 'express';
import validate from '../../middlewares/validate';
import { isLoggedIn, isLoggedOut } from '../../middlewares/verify';
import {
  changeMyPassword,
  login,
  logout,
  me,
  refresh,
  register,
  updateMe,
} from './auth.controller';
import {
  changeMyPasswordSchema,
  getMeSchema,
  loginSchema,
  refreshTokenSchema,
  registerSchema,
  updateMeSchema,
} from './auth.validation';

const router = Router();

router.post('/register', isLoggedOut, validate(registerSchema), register);
router.post('/login', isLoggedOut, validate(loginSchema), login);
router.post('/refresh', validate(refreshTokenSchema), refresh);
router.post('/logout', isLoggedIn, logout);
router.get('/me', isLoggedIn, validate(getMeSchema), me);
router.put('/me', isLoggedIn, validate(updateMeSchema), updateMe);
router.patch(
  '/me/password',
  isLoggedIn,
  validate(changeMyPasswordSchema),
  changeMyPassword,
);

export default router;
