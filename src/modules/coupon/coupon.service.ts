import createError from 'http-errors';
import {
  deleteCache,
  generateCacheKey,
  getCache,
  setCache,
} from '../../utils/cache';
import { isValidMongoId } from '../../utils/is-valid-mongo-id';
import CouponModel from './coupon.model';
import { ICoupon } from './coupon.types';
import {
  CreateCouponBody,
  GetCouponByIdQuery,
  GetCouponsQuery,
  UpdateCouponBody,
} from './coupon.validation';

const COUPON_RESOURCE = 'coupons';
const CACHE_TTL = 30 * 24 * 60 * 60; // 30 days

export class CouponService {
  static async list(query: GetCouponsQuery) {
    const {
      search,
      is_active,
      fields,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
    } = query;

    // Generate cache key
    const cacheKey = generateCacheKey({
      resource: `${COUPON_RESOURCE}:list`,
      query: {
        search,
        is_active,
        fields,
        sortBy,
        sortOrder,
        page,
        limit,
      },
    });

    // Check cache
    const cached = await getCache<{
      coupons: ICoupon[];
      pagination: {
        items: number;
        page: number;
        limit: number;
        totalPages: number;
      };
    }>(cacheKey);

    if (cached) {
      return cached;
    }

    // Build filter
    const filter: {
      is_active?: boolean;
      $or?: { [key: string]: { $regex: string; $options: string } }[];
    } = {};

    if (typeof is_active === 'string') {
      filter.is_active = is_active === 'true';
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
      ];
    }

    // Build sort
    const sort: Record<string, 1 | -1> = {
      [sortBy!]: sortOrder === 'asc' ? 1 : -1,
    };

    // Build select fields
    let selectFields = '';
    if (fields) {
      selectFields = fields
        .split(',')
        .map((f) => f.trim())
        .join(' ');
    }

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Build query
    const couponQuery = CouponModel.find(filter)
      .skip(skip)
      .limit(Number(limit))
      .sort(sort);

    if (selectFields) {
      couponQuery.select(selectFields);
    }

    // Execute query
    const [coupons, total] = await Promise.all([
      couponQuery.lean(),
      CouponModel.countDocuments(filter),
    ]);

    const result = {
      coupons,
      pagination: {
        items: total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    };

    // Cache result
    await setCache(cacheKey, result, CACHE_TTL);

    return result;
  }

  static async getById(id: string, query?: GetCouponByIdQuery) {
    if (!isValidMongoId(id)) {
      throw createError.BadRequest('Invalid coupon ID');
    }

    const { fields } = query || {};

    // Generate cache key
    const cacheKey = generateCacheKey({
      resource: `${COUPON_RESOURCE}:${id}`,
      query: { fields },
    });

    // Check cache
    const cached = await getCache<ICoupon>(cacheKey);
    if (cached) {
      return cached;
    }

    // Build select fields
    let selectFields = '';
    if (fields) {
      selectFields = fields
        .split(',')
        .map((f) => f.trim())
        .join(' ');
    }

    // Build query
    const couponQuery = CouponModel.findById(id);

    if (selectFields) {
      couponQuery.select(selectFields);
    }

    // Execute query
    const coupon = await couponQuery.lean();

    if (!coupon) {
      throw createError.NotFound('Coupon not found');
    }

    // Cache result
    await setCache(cacheKey, coupon, CACHE_TTL);

    return coupon;
  }

  static async create(data: CreateCouponBody) {
    // Check if coupon code already exists
    const existingCoupon = await CouponModel.findOne({ code: data.code });
    if (existingCoupon) {
      throw createError.Conflict('Coupon code already exists');
    }

    const coupon = await CouponModel.create(data);

    // Invalidate cache
    await deleteCache(generateCacheKey({ resource: COUPON_RESOURCE }));

    return { _id: coupon._id };
  }

  static async update(id: string, data: UpdateCouponBody) {
    if (!isValidMongoId(id)) {
      throw createError.BadRequest('Invalid coupon ID');
    }

    // Check if coupon code already exists (if code is being updated)
    if (data.code) {
      const existingCoupon = await CouponModel.findOne({
        code: data.code,
        _id: { $ne: id },
      });
      if (existingCoupon) {
        throw createError.Conflict('Coupon code already exists');
      }
    }

    const coupon = await CouponModel.findByIdAndUpdate(id, data, {
      new: true,
    }).lean();

    if (!coupon) {
      throw createError.NotFound('Coupon not found');
    }

    // Invalidate cache
    await deleteCache(
      generateCacheKey({ resource: `${COUPON_RESOURCE}:${id}` }),
    );
    await deleteCache(generateCacheKey({ resource: COUPON_RESOURCE }));

    return coupon;
  }

  static async updateStatus(id: string, is_active: boolean) {
    return this.update(id, { is_active });
  }

  static async delete(id: string) {
    if (!isValidMongoId(id)) {
      throw createError.BadRequest('Invalid coupon ID');
    }

    const coupon = await CouponModel.findByIdAndDelete(id).select('_id').lean();

    if (!coupon) {
      throw createError.NotFound('Coupon not found');
    }

    // Invalidate cache
    await deleteCache(
      generateCacheKey({ resource: `${COUPON_RESOURCE}:${id}` }),
    );
    await deleteCache(generateCacheKey({ resource: COUPON_RESOURCE }));

    return { _id: coupon._id };
  }
}
