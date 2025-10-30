import createError from 'http-errors';
import {
  deleteCache,
  generateCacheKey,
  getCache,
  setCache,
} from '../../utils/cache';
import { isValidMongoId } from '../../utils/is-valid-mongo-id';
import StoreModel from './store.model';
import { GetStoreByIdQuery, GetStoresQuery } from './store.validation';

export const STORE_RESOURCE = 'stores';

export class StoreService {
  static async list(query: GetStoresQuery) {
    const {
      search,
      is_active,
      fields,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'asc',
    } = query || {};

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
        { city: { $regex: search, $options: 'i' } },
        { country: { $regex: search, $options: 'i' } },
      ];
    }

    const sort: Record<string, 1 | -1> = {
      [sortBy!]: sortOrder === 'asc' ? 1 : -1,
    };

    const cacheKey = generateCacheKey({
      resource: STORE_RESOURCE,
      query: { ...filter, fields, page, limit, sort },
    });
    const cached = await getCache<{
      stores: unknown[];
      pagination: {
        items: number;
        page: number;
        limit: number;
        totalPages: number;
      };
    }>(cacheKey);
    if (cached) return cached;

    // Build select fields
    let selectFields = '';
    if (fields) {
      selectFields = fields
        .split(',')
        .map((f) => f.trim())
        .join(' ');
    }

    const skip = (Number(page) - 1) * Number(limit);
    const storeQuery = StoreModel.find(filter)
      .skip(skip)
      .limit(Number(limit))
      .sort(sort);

    if (selectFields) {
      storeQuery.select(selectFields);
    }

    const [stores, total] = await Promise.all([
      storeQuery.lean(),
      StoreModel.countDocuments(filter),
    ]);

    const payload = {
      stores,
      pagination: {
        items: total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
    await setCache(cacheKey, payload);
    return payload;
  }

  static async getById(id: string, query?: GetStoreByIdQuery) {
    if (!isValidMongoId(id)) throw createError.BadRequest('Invalid store id');

    const { fields } = query || {};

    const cacheKey = generateCacheKey({
      resource: `${STORE_RESOURCE}:${id}`,
      query: { fields },
    });
    const cached = await getCache<Record<string, unknown>>(cacheKey);
    if (cached) return cached;

    // Build select fields
    let selectFields = '';
    if (fields) {
      selectFields = fields
        .split(',')
        .map((f) => f.trim())
        .join(' ');
    }

    const storeQuery = StoreModel.findById(id);

    if (selectFields) {
      storeQuery.select(selectFields);
    }

    const store = await storeQuery.lean();
    if (!store) throw createError.NotFound('Store not found');
    await setCache(cacheKey, store);
    return store;
  }

  static async create(data: Record<string, unknown>) {
    const store = await StoreModel.create(data);
    await deleteCache(generateCacheKey({ resource: STORE_RESOURCE }));
    return { _id: store._id };
  }

  static async update(id: string, data: Record<string, unknown>) {
    if (!isValidMongoId(id)) throw createError.BadRequest('Invalid store id');

    const store = await StoreModel.findByIdAndUpdate(id, data, {
      new: true,
    }).lean();
    if (!store) throw createError.NotFound('Store not found');

    await deleteCache(
      generateCacheKey({ resource: `${STORE_RESOURCE}:${id}` }),
    );
    await deleteCache(generateCacheKey({ resource: STORE_RESOURCE }));
    return store;
  }

  static async updateStatus(id: string, is_active: boolean) {
    return this.update(id, { is_active });
  }

  static async delete(id: string) {
    if (!isValidMongoId(id)) throw createError.BadRequest('Invalid store id');
    const store = await StoreModel.findByIdAndDelete(id).select('_id').lean();
    if (!store) throw createError.NotFound('Store not found');
    await deleteCache(
      generateCacheKey({ resource: `${STORE_RESOURCE}:${id}` }),
    );
    await deleteCache(generateCacheKey({ resource: STORE_RESOURCE }));
    return { _id: store._id };
  }
}
