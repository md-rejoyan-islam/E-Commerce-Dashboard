import createError from 'http-errors';
import {
  deleteCache,
  generateCacheKey,
  getCache,
  setCache,
} from '../../utils/cache';
import { removeImage } from '../../utils/image-utils';
import { isValidMongoId } from '../../utils/is-valid-mongo-id';
import StoreModel from './store.model';
import {
  GetStoreByIdQuery,
  GetStoresQuery,
  UpdateStoreBody,
} from './store.validation';

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

    const storeQuery = StoreModel.find(filter).sort(sort);

    // Apply pagination only if limit > 0
    if (Number(limit) > 0) {
      const skip = (Number(page) - 1) * Number(limit);
      storeQuery.skip(skip).limit(Number(limit));
    }

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
        page: Number(limit) > 0 ? Number(page) : 1,
        limit: Number(limit),
        totalPages: Number(limit) > 0 ? Math.ceil(total / Number(limit)) : 1,
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
    await deleteCache(`${STORE_RESOURCE}:*`);
    return { _id: store._id };
  }

  static async update(id: string, data: UpdateStoreBody & { image?: string }) {
    if (!isValidMongoId(id)) throw createError.BadRequest('Invalid store id');

    const existingStore = await StoreModel.findById(id)
      .select('_id image')
      .lean();
    if (!existingStore) throw createError.NotFound('Store not found');

    const store = await StoreModel.findByIdAndUpdate(id, data, {
      new: true,
    }).lean();

    // remove before image
    if (data.image && existingStore.image) {
      removeImage(existingStore.image);
    }

    // Invalidate all store caches
    await deleteCache(`${STORE_RESOURCE}:*`);
    return store;
  }

  static async updateStatus(id: string, is_active: boolean) {
    return this.update(id, { is_active });
  }

  static async delete(id: string) {
    if (!isValidMongoId(id)) throw createError.BadRequest('Invalid store id');
    const store = await StoreModel.findByIdAndDelete(id)
      .select('_id image')
      .lean();
    if (!store) throw createError.NotFound('Store not found');

    // remove before image
    if (store.image) {
      removeImage(store.image);
    }

    // Invalidate all store caches
    await deleteCache(`${STORE_RESOURCE}:*`);
    return { _id: store._id };
  }
}
