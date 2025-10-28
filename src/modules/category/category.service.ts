import createError from 'http-errors';
import {
  deleteCache,
  generateCacheKey,
  getCache,
  setCache,
} from '../../utils/cache';
import generateSlug from '../../utils/generate-slug';
import { isValidMongoId } from '../../utils/is-valid-mongo-id';
import CategoryModel from './category.model';
import { GetCategoriesQuery } from './category.validation';

export const CATEGORY_RESOURCE = 'categories';

export class CategoryService {
  static async list(query: GetCategoriesQuery) {
    const {
      search,
      includeParent,
      featured,
      is_active,
      parent_id,
      page = 1,
      limit = 10,
      sortBy = 'order',
      sortOrder = 'asc',
    } = query || {};

    const filter: {
      featured?: boolean;
      is_active?: boolean;
      parent_id?: string;
      $or?: { [key: string]: { $regex: string; $options: string } }[];
    } = {};
    if (typeof featured === 'boolean') filter.featured = featured;
    if (typeof is_active === 'boolean') filter.is_active = is_active;
    if (parent_id) {
      if (!isValidMongoId(parent_id)) {
        throw createError.BadRequest('Invalid parent category id');
      }
      filter.parent_id = parent_id;
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } },
      ];
    }

    const sort: Record<string, 1 | -1> = {
      [sortBy!]: sortOrder === 'asc' ? 1 : -1,
    };

    const cacheKey = generateCacheKey({
      resource: CATEGORY_RESOURCE,
      query: { ...filter, page, limit, sort, includeParent },
    });
    const cached = await getCache<{
      data: unknown[];
      meta: { total: number; page: number; limit: number };
    }>(cacheKey);
    if (cached) return cached;

    const skip = (Number(page) - 1) * Number(limit);

    let queryBuilder = CategoryModel.find(filter)
      .skip(skip)
      .limit(Number(limit))
      .sort(sort);

    // Conditionally populate parent_id based on includeParent
    if (includeParent === 'true') {
      queryBuilder = queryBuilder.populate('parent_id', 'name slug');
    }

    const [data, total] = await Promise.all([
      queryBuilder.lean(),
      CategoryModel.countDocuments(filter),
    ]);

    const payload = {
      data,
      meta: { total, page: Number(page), limit: Number(limit) },
    };
    await setCache(cacheKey, payload);
    return payload;
  }

  static async getById(id: string, includeParent?: boolean) {
    if (!isValidMongoId(id)) {
      throw createError.BadRequest('Invalid category id');
    }
    const cacheKey = generateCacheKey({
      resource: `${CATEGORY_RESOURCE}:${id}`,
      query: { includeParent },
    });
    const cached = await getCache<Record<string, unknown>>(cacheKey);
    if (cached) return cached;

    let queryBuilder = CategoryModel.findById(id);

    // Conditionally populate parent_id based on includeParent
    if (includeParent === true) {
      queryBuilder = queryBuilder.populate('parent_id', 'name slug');
    }

    const category = await queryBuilder.lean();
    if (!category) throw createError.NotFound('Category not found');
    await setCache(cacheKey, category);
    return category;
  }

  static async create(data: Record<string, unknown>) {
    // Generate slug from name if not provided
    if (!data.slug && data.name) {
      data.slug = generateSlug(data.name as string);
    }

    // Check if slug already exists
    const exists = await CategoryModel.findOne({ slug: data.slug }).lean();
    if (exists) throw createError.Conflict('Category slug already exists');

    // Validate parent_id if provided
    if (data.parent_id) {
      if (!isValidMongoId(data.parent_id as string)) {
        throw createError.BadRequest('Invalid parent category id');
      }
      const parent = await CategoryModel.findById(data.parent_id).lean();
      if (!parent) throw createError.NotFound('Parent category not found');
    }

    const category = await CategoryModel.create(data);
    await deleteCache(generateCacheKey({ resource: CATEGORY_RESOURCE }));
    return { _id: category._id };
  }

  static async update(id: string, data: Record<string, unknown>) {
    if (!isValidMongoId(id)) {
      throw createError.BadRequest('Invalid category id');
    }

    // Generate slug from name if name is being updated and slug is not provided
    if (data.name && !data.slug) {
      data.slug = generateSlug(data.name as string);
    }

    // Check if slug already exists for another category
    if (data.slug) {
      const exists = await CategoryModel.findOne({
        slug: data.slug,
        _id: { $ne: id },
      }).lean();
      if (exists) throw createError.Conflict('Category slug already exists');
    }

    // Validate parent_id if provided
    if (data.parent_id) {
      if (!isValidMongoId(data.parent_id as string)) {
        throw createError.BadRequest('Invalid parent category id');
      }
      // Prevent self-referencing
      if (data.parent_id === id) {
        throw createError.BadRequest('Category cannot be its own parent');
      }
      const parent = await CategoryModel.findById(data.parent_id).lean();
      if (!parent) throw createError.NotFound('Parent category not found');
    }

    const category = await CategoryModel.findByIdAndUpdate(id, data, {
      new: true,
    })
      .populate('parent_id', 'name slug')
      .lean();
    if (!category) throw createError.NotFound('Category not found');

    await deleteCache(
      generateCacheKey({ resource: `${CATEGORY_RESOURCE}:${id}` }),
    );
    await deleteCache(generateCacheKey({ resource: CATEGORY_RESOURCE }));
    return category;
  }

  static async changeStatus(id: string, is_active: boolean) {
    return this.update(id, { is_active });
  }

  static async remove(id: string) {
    if (!isValidMongoId(id)) {
      throw createError.BadRequest('Invalid category id');
    }

    // Check if category has children
    const hasChildren = await CategoryModel.findOne({ parent_id: id }).lean();
    if (hasChildren) {
      throw createError.BadRequest('Cannot delete category with subcategories');
    }

    const category = await CategoryModel.findByIdAndDelete(id)
      .select('_id')
      .lean();
    if (!category) throw createError.NotFound('Category not found');

    await deleteCache(
      generateCacheKey({ resource: `${CATEGORY_RESOURCE}:${id}` }),
    );
    await deleteCache(generateCacheKey({ resource: CATEGORY_RESOURCE }));
    return { _id: category._id };
  }
}
