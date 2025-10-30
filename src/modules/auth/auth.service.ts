import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import secret from '../../app/secret';
import { IJwtPayload } from '../../app/types';
import {
  deleteCache,
  generateCacheKey,
  getCache,
  setCache,
} from '../../utils/cache';
import { generateRandomPin } from '../../utils/generate-random-pin';
import generateToken from '../../utils/generate-token';
import { comparePassword, hashPassword } from '../../utils/password';
import UserModel from '../user/user.model';
import { RegisterInput } from './auth.validation';

export class AuthService {
  static async register(payload: RegisterInput) {
    const exists = await UserModel.findOne({ email: payload.email }).lean();
    if (exists) throw createError.Conflict('Email already exists');
    const user = await UserModel.create({ ...payload });
    return { _id: user._id };
  }

  static async login(email: string, password: string) {
    const cacheKey = generateCacheKey({ resource: `auth:login:${email}` });
    // do not return cached on login for security, but demonstrate setting on success for throttling if needed

    const user = await UserModel.findOne({ email })
      .select('+password +refresh_token role email')
      .lean();
    if (!user) throw createError.Unauthorized('Invalid credentials');
    const match = await comparePassword(password, user.password || '');
    if (!match) throw createError.Unauthorized('Invalid credentials');

    const loginCode = generateRandomPin(6);
    const accessPayload: IJwtPayload = {
      _id: user._id.toString(),
      role: user.role,
      loginCode,
    };
    const refreshPayload: IJwtPayload = {
      _id: user._id.toString(),
      role: user.role,
      loginCode,
    };

    const access_token = generateToken(accessPayload, {
      secret: secret.jwt.accessTokenSecret,
      expiresIn: secret.jwt.accessTokenExpiresIn,
    });
    const refresh_token = generateToken(refreshPayload, {
      secret: secret.jwt.refreshTokenSecret,
      expiresIn: secret.jwt.refreshTokenExpiresIn,
    });

    await UserModel.findByIdAndUpdate(user._id, {
      refresh_token,
      last_login: new Date(),
    });
    await setCache(cacheKey, { last_login: Date.now() }, 60); // small ttl cache for rate limiting support

    return {
      access_token,
      refresh_token,
      user: { _id: user._id, email: user.email, role: user.role },
    };
  }

  static async refresh(token: string) {
    try {
      const decoded = jwt.verify(
        token,
        secret.jwt.refreshTokenSecret,
      ) as IJwtPayload;
      const user = await UserModel.findById(decoded._id)
        .select('role email refresh_token')
        .lean();
      const tokenStored = (user as { refresh_token?: string } | null)
        ?.refresh_token;
      if (!user || !tokenStored)
        throw createError.Unauthorized('Invalid refresh token');

      const stored = jwt.verify(
        tokenStored,
        secret.jwt.refreshTokenSecret,
      ) as IJwtPayload;
      if (stored.loginCode !== decoded.loginCode)
        throw createError.Unauthorized('Session invalidated');

      const access_token = generateToken(
        {
          _id: decoded._id,
          role: user.role,
          loginCode: decoded.loginCode,
        } as IJwtPayload,
        {
          secret: secret.jwt.accessTokenSecret,
          expiresIn: secret.jwt.accessTokenExpiresIn,
        },
      );
      return { access_token };
    } catch {
      throw createError.Unauthorized('Invalid refresh token');
    }
  }

  static async logout(userId: string) {
    // Invalidate possible auth caches
    await deleteCache(generateCacheKey({ resource: 'me', query: { userId } }));
    return { success: true };
  }

  static async me(userId: string, fields?: string) {
    const cacheKey = generateCacheKey({
      resource: 'me',
      query: { userId, fields },
    });
    const cached = await getCache<Record<string, unknown>>(cacheKey);
    if (cached) return cached;

    // Build selection string
    let selectFields = '-password -refresh_token';
    if (fields) {
      // Parse comma-separated fields and add them to selection
      const requestedFields = fields
        .split(',')
        .map((f) => f.trim())
        .filter((f) => f);
      // Filter out sensitive fields that should never be returned
      const allowedFields = requestedFields.filter(
        (f) => f !== 'password' && f !== 'refresh_token',
      );

      if (allowedFields.length > 0) {
        selectFields = allowedFields.join(' ');
      }
    }

    const user = await UserModel.findById(userId).select(selectFields).lean();
    if (!user) throw createError.NotFound('User not found');
    await setCache(cacheKey, user);
    return user;
  }

  static async updateMe(userId: string, data: Record<string, unknown>) {
    const user = await UserModel.findByIdAndUpdate(userId, data, { new: true })
      .select('-password -refresh_token')
      .lean();
    if (!user) throw createError.NotFound('User not found');
    await deleteCache(generateCacheKey({ resource: 'me', query: { userId } }));
    return user;
  }

  static async changeMyPassword(
    userId: string,
    old_password: string,
    new_password: string,
  ) {
    const user = await UserModel.findById(userId).select('+password');
    if (!user || !user.password) throw createError.NotFound('User not found');
    const match = await comparePassword(old_password, user.password);
    if (!match) throw createError.Unauthorized('Old password incorrect');
    user.password = await hashPassword(new_password);
    await user.save();
    await deleteCache(generateCacheKey({ resource: 'me', query: { userId } }));
    return { _id: user._id };
  }
}
