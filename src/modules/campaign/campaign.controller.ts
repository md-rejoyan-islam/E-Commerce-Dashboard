import { Response } from 'express';
import { IRequestWithUser } from '../../app/types';
import { asyncHandler } from '../../utils/async-handler';
import { successResponse } from '../../utils/response-handler';
import { CampaignService } from './campaign.service';
import {
  CreateCampaignBody,
  GetCampaignByIdQuery,
  GetCampaignsQuery,
  UpdateCampaignBody,
  UpdateCampaignStatusBody,
} from './campaign.validation';

/**
 * Get all campaigns with filters and pagination
 * @route GET /api/v1/campaigns
 * @access Public
 * @query {string} search - Search in name and description
 * @query {boolean} is_active - Filter by active status
 * @query {string} fields - Comma-separated fields to return
 * @query {boolean} includeProducts - Include product details
 * @query {string} sortBy - Sort by field (default: createdAt)
 * @query {string} sortOrder - Sort order: asc or desc (default: desc)
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 10, max: 100)
 * @returns {object} List of campaigns with pagination info
 */
export const listCampaigns = asyncHandler(
  async (req: IRequestWithUser, res: Response) => {
    const query = req.query as unknown as GetCampaignsQuery;
    const result = await CampaignService.list(query);

    return successResponse(res, {
      statusCode: 200,
      message: 'Campaigns fetched successfully',
      payload: { data: result.campaigns, pagination: result.pagination },
    });
  },
);

/**
 * Get a specific campaign by ID
 * @route GET /api/v1/campaigns/:id
 * @access Public
 * @param {string} id - Campaign ID
 * @query {string} fields - Comma-separated fields to return
 * @query {boolean} includeProducts - Include product details
 * @returns {object} Campaign details
 */
export const getCampaignById = asyncHandler(
  async (req: IRequestWithUser, res: Response) => {
    const { id } = req.params;
    const query = req.query as GetCampaignByIdQuery;
    const campaign = await CampaignService.getById(id, query);

    return successResponse(res, {
      statusCode: 200,
      message: 'Campaign fetched successfully',
      payload: { data: campaign },
    });
  },
);

/**
 * Create a new campaign
 * @route POST /api/v1/campaigns
 * @access Admin only
 * @body {object} Campaign data
 * @returns {object} Created campaign ID
 */
export const createCampaign = asyncHandler(
  async (req: IRequestWithUser, res: Response) => {
    const body = req.body as CreateCampaignBody;
    const campaign = await CampaignService.create(body);

    return successResponse(res, {
      statusCode: 201,
      message: 'Campaign created successfully',
      payload: { data: campaign },
    });
  },
);

/**
 * Update a specific campaign
 * @route PUT /api/v1/campaigns/:id
 * @access Admin only
 * @param {string} id - Campaign ID
 * @body {object} Campaign data to update
 * @returns {object} Updated campaign
 */
export const updateCampaign = asyncHandler(
  async (req: IRequestWithUser, res: Response) => {
    const { id } = req.params;
    const body = req.body as UpdateCampaignBody;
    const campaign = await CampaignService.update(id, body);

    return successResponse(res, {
      statusCode: 200,
      message: 'Campaign updated successfully',
      payload: { data: campaign },
    });
  },
);

/**
 * Update campaign active status
 * @route PATCH /api/v1/campaigns/:id/status
 * @access Admin only
 * @param {string} id - Campaign ID
 * @body {boolean} is_active - Active status
 * @returns {object} Updated campaign
 */
export const updateCampaignStatus = asyncHandler(
  async (req: IRequestWithUser, res: Response) => {
    const { id } = req.params;
    const { is_active } = req.body as UpdateCampaignStatusBody;
    const campaign = await CampaignService.updateStatus(id, is_active);

    return successResponse(res, {
      statusCode: 200,
      message: 'Campaign status updated successfully',
      payload: { data: campaign },
    });
  },
);

/**
 * Delete a specific campaign
 * @route DELETE /api/v1/campaigns/:id
 * @access Admin only
 * @param {string} id - Campaign ID
 * @returns {object} Deleted campaign ID
 */
export const deleteCampaign = asyncHandler(
  async (req: IRequestWithUser, res: Response) => {
    const { id } = req.params;
    const campaign = await CampaignService.delete(id);

    return successResponse(res, {
      statusCode: 200,
      message: 'Campaign deleted successfully',
      payload: { data: campaign },
    });
  },
);
