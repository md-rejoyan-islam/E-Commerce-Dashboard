import createError from 'http-errors';
import {
  deleteCache,
  generateCacheKey,
  getCache,
  setCache,
} from '../../utils/cache';
import { isValidMongoId } from '../../utils/is-valid-mongo-id';
import BannerModel from './banner.model';
import { IBanner } from './banner.types';
import {
  CreateBannerBody,
  GetBannerByIdQuery,
  GetBannersQuery,
  UpdateBannerBody,
  UpdateBannerStatusBody,
} from './banner.validation';

const BANNER_RESOURCE = 'banner';
const CACHE_TTL = 30 * 24 * 60 * 60; // 30 days

export class BannerService {
  static async list(query: GetBannersQuery) {
    const {
      type,
      is_active,
      search,
      fields,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
    } = query;

    // Generate cache key
    const cacheKey = generateCacheKey({
      resource: `${BANNER_RESOURCE}:list`,
      query: {
        type,
        is_active,
        search,
        fields,
        sortBy,
        sortOrder,
        page,
        limit,
      },
    });

    // Check cache
    const cached = await getCache<{
      banners: IBanner[];
      pagination: {
        total: number;
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
      type?: string;
      is_active?: boolean;
      $or?: { [key: string]: { $regex: string; $options: string } }[];
    } = {};

    if (type) {
      filter.type = type;
    }

    if (is_active !== undefined) {
      filter.is_active = !!is_active;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Build select fields
    let selectFields = '';
    if (fields) {
      selectFields = fields
        .split(',')
        .map((f) => f.trim())
        .join(' ');
    }

    // Build sort
    const sort: Record<string, 1 | -1> = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Calculate skip
    const skip = (page - 1) * limit;

    // Execute query
    const bannerQuery = BannerModel.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    if (selectFields) {
      bannerQuery.select(selectFields);
    }

    const [banners, total] = await Promise.all([
      bannerQuery.lean(),
      BannerModel.countDocuments(filter),
    ]);

    const result = {
      banners,
      pagination: {
        items: total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };

    // Cache result
    await setCache(cacheKey, result, CACHE_TTL);

    return result;
  }

  static async getById(id: string, query: GetBannerByIdQuery) {
    if (!isValidMongoId(id)) {
      throw createError.BadRequest('Invalid banner ID');
    }

    const { fields } = query;

    // Generate cache key
    const cacheKey = generateCacheKey({
      resource: `${BANNER_RESOURCE}:${id}`,
      query: { fields },
    });

    // Check cache
    const cached = await getCache<IBanner>(cacheKey);
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

    // Execute query
    const bannerQuery = BannerModel.findById(id);

    if (selectFields) {
      bannerQuery.select(selectFields);
    }

    const banner = await bannerQuery.lean();

    if (!banner) {
      throw createError.NotFound('Banner not found');
    }

    // Cache result
    await setCache(cacheKey, banner, CACHE_TTL);

    return banner;
  }

  static async create(data: CreateBannerBody) {
    const banner = await BannerModel.create(data);

    // Invalidate list cache
    await deleteCache(`${BANNER_RESOURCE}:list:*`);

    return banner.toObject();
  }

  static async update(id: string, data: UpdateBannerBody) {
    if (!isValidMongoId(id)) {
      throw createError.BadRequest('Invalid banner ID');
    }

    const banner = await BannerModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true },
    ).lean();

    if (!banner) {
      throw createError.NotFound('Banner not found');
    }

    // Invalidate cache
    await deleteCache(`${BANNER_RESOURCE}:${id}:*`);
    await deleteCache(`${BANNER_RESOURCE}:list:*`);

    return banner;
  }

  static async updateStatus(id: string, data: UpdateBannerStatusBody) {
    if (!isValidMongoId(id)) {
      throw createError.BadRequest('Invalid banner ID');
    }

    const banner = await BannerModel.findByIdAndUpdate(
      id,
      { $set: { is_active: data.is_active } },
      { new: true, runValidators: true },
    ).lean();

    if (!banner) {
      throw createError.NotFound('Banner not found');
    }

    // Invalidate cache
    await deleteCache(`${BANNER_RESOURCE}:${id}:*`);
    await deleteCache(`${BANNER_RESOURCE}:list:*`);

    return banner;
  }

  static async delete(id: string) {
    if (!isValidMongoId(id)) {
      throw createError.BadRequest('Invalid banner ID');
    }

    const banner = await BannerModel.findByIdAndDelete(id).lean();

    if (!banner) {
      throw createError.NotFound('Banner not found');
    }

    // Invalidate cache
    await deleteCache(`${BANNER_RESOURCE}:${id}:*`);
    await deleteCache(`${BANNER_RESOURCE}:list:*`);

    return banner;
  }
}
