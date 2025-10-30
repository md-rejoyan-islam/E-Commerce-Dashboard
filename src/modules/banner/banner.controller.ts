import { Response } from 'express';
import { IRequestWithUser } from '../../app/types';
import { asyncHandler } from '../../utils/async-handler';
import { successResponse } from '../../utils/response-handler';
import { BannerService } from './banner.service';
import {
  CreateBannerBody,
  GetBannerByIdQuery,
  GetBannersQuery,
  UpdateBannerBody,
  UpdateBannerStatusBody,
} from './banner.validation';

export const listBanners = asyncHandler(
  async (req: IRequestWithUser, res: Response) => {
    const query = req.query as unknown as GetBannersQuery;
    const result = await BannerService.list(query);

    return successResponse(res, {
      statusCode: 200,
      message: 'Banners fetched successfully',
      payload: { data: result.banners, pagination: result.pagination },
    });
  },
);

export const getBannerById = asyncHandler(
  async (req: IRequestWithUser, res: Response) => {
    const { id } = req.params;
    const query = req.query as GetBannerByIdQuery;
    const banner = await BannerService.getById(id, query);

    return successResponse(res, {
      statusCode: 200,
      message: 'Banner fetched successfully',
      payload: { data: banner },
    });
  },
);

export const createBanner = asyncHandler(
  async (req: IRequestWithUser, res: Response) => {
    const body = req.body as CreateBannerBody;
    const banner = await BannerService.create(body);

    return successResponse(res, {
      statusCode: 201,
      message: 'Banner created successfully',
      payload: { data: banner },
    });
  },
);

export const updateBanner = asyncHandler(
  async (req: IRequestWithUser, res: Response) => {
    const { id } = req.params;
    const body = req.body as UpdateBannerBody;
    const banner = await BannerService.update(id, body);

    return successResponse(res, {
      statusCode: 200,
      message: 'Banner updated successfully',
      payload: { data: banner },
    });
  },
);

export const updateBannerStatus = asyncHandler(
  async (req: IRequestWithUser, res: Response) => {
    const { id } = req.params;
    const body = req.body as UpdateBannerStatusBody;
    const banner = await BannerService.updateStatus(id, body);

    return successResponse(res, {
      statusCode: 200,
      message: 'Banner status updated successfully',
      payload: { data: banner },
    });
  },
);

export const deleteBanner = asyncHandler(
  async (req: IRequestWithUser, res: Response) => {
    const { id } = req.params;
    const banner = await BannerService.delete(id);

    return successResponse(res, {
      statusCode: 200,
      message: 'Banner deleted successfully',
      payload: { data: banner },
    });
  },
);
