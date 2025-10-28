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
  loginSchema,
  registerSchema,
  updateMeSchema,
} from './auth.validation';

const router = Router();

router.post('/register', isLoggedOut, validate(registerSchema), register);
router.post('/login', isLoggedOut, validate(loginSchema), login);
router.post('/refresh', refresh);
router.post('/logout', isLoggedIn, logout);
router.get('/me', isLoggedIn, me);
router.put('/me', isLoggedIn, validate(updateMeSchema), updateMe);
router.patch(
  '/me/password',
  isLoggedIn,
  validate(changeMyPasswordSchema),
  changeMyPassword,
);

export default router;
