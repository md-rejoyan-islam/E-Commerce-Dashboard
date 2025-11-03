import { Response } from 'express';
import { IRequestWithUser } from '../../app/types';
import { asyncHandler } from '../../utils/async-handler';
import { successResponse } from '../../utils/response-handler';
import { CouponService } from './coupon.service';
import {
  CreateCouponBody,
  GetCouponByIdQuery,
  GetCouponsQuery,
  UpdateCouponBody,
  UpdateCouponStatusBody,
} from './coupon.validation';

/**
 * Get all coupons with filters and pagination
 * @route GET /api/v1/coupons
 * @access Public
 * @query {string} search - Search in name, description, and code
 * @query {boolean} is_active - Filter by active status
 * @query {string} fields - Comma-separated fields to return
 * @query {string} sortBy - Sort by field (default: createdAt)
 * @query {string} sortOrder - Sort order: asc or desc (default: desc)
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 10, max: 100)
 * @returns {object} List of coupons with pagination info
 */
export const listCoupons = asyncHandler(
  async (req: IRequestWithUser, res: Response) => {
    const query = req.query as unknown as GetCouponsQuery;
    const result = await CouponService.list(query);

    return successResponse(res, {
      statusCode: 200,
      message: 'Coupons fetched successfully',
      payload: { data: result.coupons, pagination: result.pagination },
    });
  },
);

/**
 * Get a specific coupon by ID
 * @route GET /api/v1/coupons/:id
 * @access Public
 * @param {string} id - Coupon ID
 * @query {string} fields - Comma-separated fields to return
 * @returns {object} Coupon details
 */
export const getCouponById = asyncHandler(
  async (req: IRequestWithUser, res: Response) => {
    const { id } = req.params;
    const query = req.query as GetCouponByIdQuery;
    const coupon = await CouponService.getById(id, query);

    return successResponse(res, {
      statusCode: 200,
      message: 'Coupon fetched successfully',
      payload: { data: coupon },
    });
  },
);

/**
 * Create a new coupon
 * @route POST /api/v1/coupons
 * @access Admin only
 * @body {object} Coupon data
 * @returns {object} Created coupon ID
 */
export const createCoupon = asyncHandler(
  async (req: IRequestWithUser, res: Response) => {
    const body = req.body as CreateCouponBody;
    const coupon = await CouponService.create(body);

    return successResponse(res, {
      statusCode: 201,
      message: 'Coupon created successfully',
      payload: { data: coupon },
    });
  },
);

/**
 * Update a specific coupon
 * @route PUT /api/v1/coupons/:id
 * @access Admin only
 * @param {string} id - Coupon ID
 * @body {object} Coupon data to update
 * @returns {object} Updated coupon
 */
export const updateCoupon = asyncHandler(
  async (req: IRequestWithUser, res: Response) => {
    const { id } = req.params;
    const body = req.body as UpdateCouponBody;
    const coupon = await CouponService.update(id, body);

    return successResponse(res, {
      statusCode: 200,
      message: 'Coupon updated successfully',
      payload: { data: coupon },
    });
  },
);

/**
 * Update coupon active status
 * @route PATCH /api/v1/coupons/:id/status
 * @access Admin only
 * @param {string} id - Coupon ID
 * @body {boolean} is_active - Active status
 * @returns {object} Updated coupon
 */
export const updateCouponStatus = asyncHandler(
  async (req: IRequestWithUser, res: Response) => {
    const { id } = req.params;
    const { is_active } = req.body as UpdateCouponStatusBody;
    const coupon = await CouponService.updateStatus(id, is_active);

    return successResponse(res, {
      statusCode: 200,
      message: 'Coupon status updated successfully',
      payload: { data: coupon },
    });
  },
);

/**
 * Delete a specific coupon
 * @route DELETE /api/v1/coupons/:id
 * @access Admin only
 * @param {string} id - Coupon ID
 * @returns {object} Deleted coupon ID
 */
export const deleteCoupon = asyncHandler(
  async (req: IRequestWithUser, res: Response) => {
    const { id } = req.params;
    const coupon = await CouponService.delete(id);

    return successResponse(res, {
      statusCode: 200,
      message: 'Coupon deleted successfully',
      payload: { data: coupon },
    });
  },
);
