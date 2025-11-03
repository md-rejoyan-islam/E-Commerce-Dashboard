import { Response } from 'express';
import { IRequestWithUser } from '../../app/types';
import { asyncHandler } from '../../utils/async-handler';
import { successResponse } from '../../utils/response-handler';
import { OfferService } from './offer.service';
import {
  CreateOfferBody,
  GetOfferByIdQuery,
  GetOffersQuery,
  UpdateOfferBody,
  UpdateOfferStatusBody,
} from './offer.validation';

/**
 * Get all offers with filters and pagination
 * @route GET /api/v1/offers
 * @access Public
 * @query {string} search - Search in name and description
 * @query {boolean} is_active - Filter by active status
 * @query {string} fields - Comma-separated fields to return
 * @query {boolean} includeProducts - Include product details
 * @query {string} sortBy - Sort by field (default: createdAt)
 * @query {string} sortOrder - Sort order: asc or desc (default: desc)
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 10, max: 100)
 * @returns {object} List of offers with pagination info
 */
export const listOffers = asyncHandler(
  async (req: IRequestWithUser, res: Response) => {
    const query = req.query as unknown as GetOffersQuery;
    const result = await OfferService.list(query);

    return successResponse(res, {
      statusCode: 200,
      message: 'Offers fetched successfully',
      payload: { data: result.offers, pagination: result.pagination },
    });
  },
);

/**
 * Get a specific offer by ID
 * @route GET /api/v1/offers/:id
 * @access Public
 * @param {string} id - Offer ID
 * @query {string} fields - Comma-separated fields to return
 * @query {boolean} includeProducts - Include product details
 * @returns {object} Offer details
 */
export const getOfferById = asyncHandler(
  async (req: IRequestWithUser, res: Response) => {
    const { id } = req.params;
    const query = req.query as GetOfferByIdQuery;
    const offer = await OfferService.getById(id, query);

    return successResponse(res, {
      statusCode: 200,
      message: 'Offer fetched successfully',
      payload: { data: offer },
    });
  },
);

/**
 * Create a new offer
 * @route POST /api/v1/offers
 * @access Admin only
 * @body {object} Offer data
 * @returns {object} Created offer ID
 */
export const createOffer = asyncHandler(
  async (req: IRequestWithUser, res: Response) => {
    const body = req.body as CreateOfferBody;
    const offer = await OfferService.create(body);

    return successResponse(res, {
      statusCode: 201,
      message: 'Offer created successfully',
      payload: { data: offer },
    });
  },
);

/**
 * Update a specific offer
 * @route PUT /api/v1/offers/:id
 * @access Admin only
 * @param {string} id - Offer ID
 * @body {object} Offer data to update
 * @returns {object} Updated offer
 */
export const updateOffer = asyncHandler(
  async (req: IRequestWithUser, res: Response) => {
    const { id } = req.params;
    const body = req.body as UpdateOfferBody;
    const offer = await OfferService.update(id, body);

    return successResponse(res, {
      statusCode: 200,
      message: 'Offer updated successfully',
      payload: { data: offer },
    });
  },
);

/**
 * Update offer active status
 * @route PATCH /api/v1/offers/:id/status
 * @access Admin only
 * @param {string} id - Offer ID
 * @body {boolean} is_active - Active status
 * @returns {object} Updated offer
 */
export const updateOfferStatus = asyncHandler(
  async (req: IRequestWithUser, res: Response) => {
    const { id } = req.params;
    const { is_active } = req.body as UpdateOfferStatusBody;
    const offer = await OfferService.updateStatus(id, is_active);

    return successResponse(res, {
      statusCode: 200,
      message: 'Offer status updated successfully',
      payload: { data: offer },
    });
  },
);

/**
 * Delete a specific offer
 * @route DELETE /api/v1/offers/:id
 * @access Admin only
 * @param {string} id - Offer ID
 * @returns {object} Deleted offer ID
 */
export const deleteOffer = asyncHandler(
  async (req: IRequestWithUser, res: Response) => {
    const { id } = req.params;
    const offer = await OfferService.delete(id);

    return successResponse(res, {
      statusCode: 200,
      message: 'Offer deleted successfully',
      payload: { data: offer },
    });
  },
);
