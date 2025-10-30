import mongoose from 'mongoose';
import {
  deleteCache,
  generateCacheKey,
  getCache,
  setCache,
} from '../../utils/cache';
import WishlistModel from './wishlist.model';
import { IWishlist } from './wishlist.types';
import {
  GetAllWishlistItemsQuery,
  GetUserWishlistQuery,
  GetWishlistQuery,
} from './wishlist.validation';

const WISHLIST_RESOURCE = 'wishlist';
const CACHE_TTL = 30 * 24 * 60 * 60; // 30 days

export class WishlistService {
  static async getWishlist(userId: string, query: GetWishlistQuery) {
    const { includeUser, includeProduct, fields } = query;

    // Generate cache key
    const cacheKey = generateCacheKey({
      resource: `${WISHLIST_RESOURCE}:${userId}`,
      query: { includeUser, includeProduct, fields },
    });

    // Check cache
    const cachedWishlist = await getCache<IWishlist>(cacheKey);
    if (cachedWishlist) {
      return cachedWishlist;
    }

    // Build select fields
    let selectFields = '';
    if (fields) {
      selectFields = fields
        .split(',')
        .map((f) => f.trim())
        .join(' ');
    }

    // Find or create wishlist
    let wishlist = await WishlistModel.findOne({ user: userId });

    if (!wishlist) {
      // Auto-create empty wishlist
      wishlist = await WishlistModel.create({
        user: userId,
        items: [],
      });
    }

    // Build query with population
    const wishlistQuery = WishlistModel.findById(wishlist._id);

    if (selectFields) {
      wishlistQuery.select(selectFields);
    }

    if (includeUser) {
      wishlistQuery.populate({
        path: 'user',
        select: '-password -refresh_token',
      });
    }

    if (includeProduct) {
      wishlistQuery.populate({
        path: 'items.product',
      });
    }

    const result = await wishlistQuery.lean();

    // Cache result
    await setCache(cacheKey, result, CACHE_TTL);

    return result;
  }

  static async addItem(userId: string, productId: string) {
    // Find or create wishlist
    let wishlist = await WishlistModel.findOne({ user: userId });

    if (!wishlist) {
      wishlist = await WishlistModel.create({
        user: userId,
        items: [],
      });
    }

    // Check if product already exists in wishlist
    const existingItem = wishlist.items.find(
      (item) => item.product.toString() === productId,
    );

    if (existingItem) {
      throw new Error('Product already exists in wishlist');
    }

    // Add new item
    wishlist.items.push({
      product: new mongoose.Types.ObjectId(productId),
      timestamp: new Date(),
    });

    await wishlist.save();

    // Invalidate all wishlist caches for this user
    await deleteCache(`${WISHLIST_RESOURCE}:${userId}:*`);

    return await WishlistModel.findById(wishlist._id)
      .populate({
        path: 'items.product',
      })
      .lean();
  }

  static async getItem(
    userId: string,
    itemId: string,
    query: GetWishlistQuery,
  ) {
    const { includeUser, includeProduct, fields } = query;

    const wishlist = await WishlistModel.findOne({ user: userId });

    if (!wishlist) {
      throw new Error('Wishlist not found');
    }

    const item = wishlist.items.find((item) => item._id?.toString() === itemId);

    if (!item) {
      throw new Error('Item not found in wishlist');
    }

    // Build query with population
    const wishlistQuery = WishlistModel.findOne({ user: userId });

    let selectFields = '';
    if (fields) {
      selectFields = fields
        .split(',')
        .map((f) => f.trim())
        .join(' ');
    }

    if (selectFields) {
      wishlistQuery.select(selectFields);
    }

    if (includeUser) {
      wishlistQuery.populate({
        path: 'user',
        select: '-password -refresh_token',
      });
    }

    if (includeProduct) {
      wishlistQuery.populate({
        path: 'items.product',
      });
    }

    const result = await wishlistQuery.lean();

    // Filter to return only the specific item
    if (result) {
      return {
        ...result,
        items: result.items.filter((i) => i._id?.toString() === itemId),
      };
    }

    return null;
  }

  static async removeItem(userId: string, itemId: string) {
    const wishlist = await WishlistModel.findOne({ user: userId });

    if (!wishlist) {
      throw new Error('Wishlist not found');
    }

    const itemIndex = wishlist.items.findIndex(
      (item) => item._id?.toString() === itemId,
    );

    if (itemIndex === -1) {
      throw new Error('Item not found in wishlist');
    }

    wishlist.items.splice(itemIndex, 1);
    await wishlist.save();

    // Invalidate all wishlist caches for this user
    await deleteCache(`${WISHLIST_RESOURCE}:${userId}:*`);

    return await WishlistModel.findById(wishlist._id)
      .populate({
        path: 'items.product',
      })
      .lean();
  }

  static async clearWishlist(userId: string) {
    const wishlist = await WishlistModel.findOne({ user: userId });

    if (!wishlist) {
      throw new Error('Wishlist not found');
    }

    wishlist.items = [];
    await wishlist.save();

    // Invalidate all wishlist caches for this user
    await deleteCache(`${WISHLIST_RESOURCE}:${userId}:*`);

    return await WishlistModel.findById(wishlist._id).lean();
  }

  static async getAllWishlists(query: GetAllWishlistItemsQuery) {
    const { includeUser, includeProduct, fields, page = 1, limit = 10 } = query;

    // Generate cache key
    const cacheKey = generateCacheKey({
      resource: `${WISHLIST_RESOURCE}:all`,
      query: { includeUser, includeProduct, fields, page, limit },
    });

    // Check cache
    const cachedResult = await getCache<{
      wishlists: IWishlist[];
      pagination: {
        items: number;
        page: number;
        limit: number;
        totalPages: number;
      };
    }>(cacheKey);

    if (cachedResult) {
      return cachedResult;
    }

    // Build select fields
    let selectFields = '';
    if (fields) {
      selectFields = fields
        .split(',')
        .map((f) => f.trim())
        .join(' ');
    }

    // Calculate skip
    const skip = (page - 1) * limit;

    // Build query
    const wishlistQuery = WishlistModel.find().skip(skip).limit(limit);

    if (selectFields) {
      wishlistQuery.select(selectFields);
    }

    if (includeUser) {
      wishlistQuery.populate({
        path: 'user',
        select: '-password -refresh_token',
      });
    }

    if (includeProduct) {
      wishlistQuery.populate({
        path: 'items.product',
      });
    }

    const [wishlists, items] = await Promise.all([
      wishlistQuery.lean(),
      WishlistModel.countDocuments(),
    ]);

    const result = {
      wishlists,
      pagination: {
        items,
        page,
        limit,
        totalPages: Math.ceil(items / limit),
      },
    };

    // Cache result
    await setCache(cacheKey, result, CACHE_TTL);

    return result;
  }

  static async getWishlistByUserId(
    userId: string,
    query: GetUserWishlistQuery['query'],
  ) {
    const { includeUser, includeProduct, fields } = query;

    // Generate cache key
    const cacheKey = generateCacheKey({
      resource: `${WISHLIST_RESOURCE}:admin:user:${userId}`,
      query: { includeUser, includeProduct, fields },
    });

    // Check cache
    const cachedWishlist = await getCache<IWishlist>(cacheKey);
    if (cachedWishlist) {
      return cachedWishlist;
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
    const wishlistQuery = WishlistModel.findOne({ user: userId });

    if (selectFields) {
      wishlistQuery.select(selectFields);
    }

    if (includeUser) {
      wishlistQuery.populate({
        path: 'user',
        select: '-password -refresh_token',
      });
    }

    if (includeProduct) {
      wishlistQuery.populate({
        path: 'items.product',
      });
    }

    const result = await wishlistQuery.lean();

    if (!result) {
      throw new Error('Wishlist not found');
    }

    // Cache result
    await setCache(cacheKey, result, CACHE_TTL);

    return result;
  }

  static async clearWishlistByUserId(userId: string) {
    const wishlist = await WishlistModel.findOne({ user: userId });

    if (!wishlist) {
      throw new Error('Wishlist not found');
    }

    wishlist.items = [];
    await wishlist.save();

    // Invalidate all caches for this user
    await deleteCache(`${WISHLIST_RESOURCE}:*${userId}*`);

    return await WishlistModel.findById(wishlist._id).lean();
  }
}
