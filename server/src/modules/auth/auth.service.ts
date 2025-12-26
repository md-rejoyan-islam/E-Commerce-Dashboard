import createError from 'http-errors';
import secret from '../../app/secret';
import { IJwtPayload } from '../../app/types';
import {
  deleteCache,
  generateCacheKey,
  getCache,
  setCache,
} from '../../utils/cache';
import { generateRandomPin } from '../../utils/generate-random-pin';
import generateToken, { verifyToken } from '../../utils/generate-token';
import { removeImage } from '../../utils/image-utils';
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
      .select('+password +refresh_token role email first_name last_name avatar')
      .lean();
    if (!user) throw createError.Unauthorized('User not found');
    const match = await comparePassword(password, user.password || '');
    if (!match) throw createError.Unauthorized('Invalid email or password');

    const loginCode = generateRandomPin(6);
    const accessPayload: IJwtPayload = {
      _id: user._id.toString(),
      role: user.role,
      email: user.email,
      loginCode,
    };
    const refreshPayload: IJwtPayload = {
      _id: user._id.toString(),
      role: user.role,
      email: user.email,
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
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        first_name: user.first_name,
        last_name: user.last_name,
        avatar: user.avatar,
      },
    };
  }

  static async refresh(token: string) {
    const decoded = verifyToken(token, secret.jwt.refreshTokenSecret);
    const user = await UserModel.findById(decoded._id)
      .select('role email refresh_token')
      .lean();

    if (!user)
      throw createError.Unauthorized('User associated with token not found');

    const access_token = generateToken(
      {
        _id: decoded._id,
        role: user.role,
        email: user.email,
        loginCode: decoded.loginCode,
      },
      {
        secret: secret.jwt.accessTokenSecret,
        expiresIn: secret.jwt.accessTokenExpiresIn,
      },
    );
    return { access_token };
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

  static async updateMe(
    userId: string,
    data: Record<string, string | number | boolean>,
  ) {
    const user = await UserModel.findById(userId).select('avatar').lean();
    if (!user) throw createError.NotFound('User not found');

    const updatedUser = await UserModel.findByIdAndUpdate(userId, data, {
      new: true,
    })
      .select('-password -refresh_token -createdAt -updatedAt')
      .lean();

    if (data.avatar && user.avatar) {
      removeImage(user.avatar);
    }

    await deleteCache(generateCacheKey({ resource: 'me', query: { userId } }));
    return updatedUser;
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
