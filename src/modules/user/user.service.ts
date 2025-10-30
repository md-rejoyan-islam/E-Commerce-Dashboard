import createError from 'http-errors';
import { IPagination } from '../../app/types';
import {
  deleteCache,
  generateCacheKey,
  getCache,
  setCache,
} from '../../utils/cache';
import { isValidMongoId } from '../../utils/is-valid-mongo-id';
import { hashPassword } from '../../utils/password';
import UserModel from './user.model';
import { GetUsersQuery } from './user.validation';

export const USER_RESOURCE = 'users';

export class UserService {
  static async list(query: GetUsersQuery) {
    const {
      search,
      role,
      fields,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query || {};

    const filter: {
      role?: string;
      $or?: { [key: string]: { $regex: string; $options: string } }[];
    } = {};
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { first_name: { $regex: search, $options: 'i' } },
        { last_name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const sort: Record<string, 1 | -1> = {
      [sortBy!]: sortOrder === 'asc' ? 1 : -1,
    };

    const cacheKey = generateCacheKey({
      resource: USER_RESOURCE,
      query: { ...filter, page, limit, sort, fields },
    });
    const cached = await getCache<{
      data: unknown[];
      meta: { total: number; page: number; limit: number };
    }>(cacheKey);
    if (cached) return cached;

    // Build selection string
    let selectFields = '-password -refresh_token';
    if (fields) {
      const requestedFields = fields
        .split(',')
        .map((f: string) => f.trim())
        .filter((f: string) => f);
      const allowedFields = requestedFields.filter(
        (f: string) => f !== 'password' && f !== 'refresh_token',
      );

      if (allowedFields.length > 0) {
        selectFields = allowedFields.join(' ');
      }
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [data, total] = await Promise.all([
      UserModel.find(filter)
        .skip(skip)
        .limit(Number(limit))
        .sort(sort)
        .select(selectFields)
        .lean(),
      UserModel.countDocuments(filter),
    ]);

    const pagination: IPagination = {
      items: total,
      limit: Number(limit),
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    };

    const payload = {
      data,
      pagination,
    };
    await setCache(cacheKey, payload);
    return payload;
  }

  static async getById(id: string, fields?: string) {
    if (!isValidMongoId(id)) throw createError.BadRequest('Invalid user id');
    const cacheKey = generateCacheKey({
      resource: `${USER_RESOURCE}:${id}`,
      query: { fields },
    });
    const cached = await getCache<Record<string, unknown>>(cacheKey);
    if (cached) return cached;

    // Build selection string
    let selectFields = '-password -refresh_token';
    if (fields) {
      const requestedFields = fields
        .split(',')
        .map((f: string) => f.trim())
        .filter((f: string) => f);
      const allowedFields = requestedFields.filter(
        (f: string) => f !== 'password' && f !== 'refresh_token',
      );

      if (allowedFields.length > 0) {
        selectFields = allowedFields.join(' ');
      }
    }

    const user = await UserModel.findById(id).select(selectFields).lean();
    if (!user) throw createError.NotFound('User not found');
    await setCache(cacheKey, user);
    return user;
  }

  static async create(data: Record<string, unknown>) {
    const exists = await UserModel.findOne({ email: data.email }).lean();
    if (exists) throw createError.Conflict('Email already in use');
    const user = await UserModel.create(data);
    await deleteCache(generateCacheKey({ resource: USER_RESOURCE }));
    return { _id: user._id };
  }

  static async update(id: string, data: Record<string, unknown>) {
    if (!isValidMongoId(id)) throw createError.BadRequest('Invalid user id');
    const user = await UserModel.findByIdAndUpdate(id, data, { new: true })
      .select('-password')
      .lean();
    if (!user) throw createError.NotFound('User not found');

    await deleteCache(generateCacheKey({ resource: `${USER_RESOURCE}:${id}` }));
    await deleteCache(generateCacheKey({ resource: USER_RESOURCE }));
    return user;
  }

  static async changeStatus(id: string, is_active: boolean) {
    return this.update(id, { is_active });
  }

  static async changePassword(id: string, password: string) {
    if (!isValidMongoId(id)) throw createError.BadRequest('Invalid user id');
    const hashed = await hashPassword(password);
    const user = await UserModel.findByIdAndUpdate(
      id,
      { password: hashed },
      { new: true },
    )
      .select('_id')
      .lean();
    if (!user) throw createError.NotFound('User not found');
    await deleteCache(generateCacheKey({ resource: `${USER_RESOURCE}:${id}` }));
    await deleteCache(generateCacheKey({ resource: USER_RESOURCE }));
    return { _id: user._id };
  }

  static async remove(id: string) {
    if (!isValidMongoId(id)) throw createError.BadRequest('Invalid user id');
    const user = await UserModel.findByIdAndDelete(id).select('_id').lean();
    if (!user) throw createError.NotFound('User not found');
    await deleteCache(generateCacheKey({ resource: `${USER_RESOURCE}:${id}` }));
    await deleteCache(generateCacheKey({ resource: USER_RESOURCE }));
    return { _id: user._id };
  }
}
