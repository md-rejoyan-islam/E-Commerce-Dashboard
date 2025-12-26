import { Request, Response } from 'express';
import secret from '../../app/secret';
import { asyncHandler } from '../../utils/async-handler';
import { generateImagePath } from '../../utils/image-utils';
import { successResponse } from '../../utils/response-handler';
import { BannerService } from './banner.service';
import {
  CreateBannerBody,
  GetBannerByIdQuery,
  GetBannersQuery,
  UpdateBannerBody,
  UpdateBannerStatusBody,
} from './banner.validation';

export const listBanners = asyncHandler(async (req: Request, res: Response) => {
  const query = req.query as GetBannersQuery;
  const result = await BannerService.list(query);

  return successResponse(res, {
    statusCode: 200,
    message: 'Banners fetched successfully',
    payload: { data: result.banners, pagination: result.pagination },
  });
});

export const getBannerById = asyncHandler(
  async (req: Request, res: Response) => {
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
  async (req: Request, res: Response) => {
    const body = req.body as CreateBannerBody;

    const file = req.file as Express.Multer.File;

    const banner = await BannerService.create({
      ...body,
      image: generateImagePath(file.filename, secret.banner_image_path),
    });

    return successResponse(res, {
      statusCode: 201,
      message: 'Banner created successfully',
      payload: { data: banner },
    });
  },
);

export const updateBanner = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const body = req.body as UpdateBannerBody;
    const file = req.file as Express.Multer.File | undefined;
    const banner = await BannerService.update(id, {
      ...body,
      ...(file && {
        image: generateImagePath(file.filename, secret.banner_image_path),
      }),
    });

    return successResponse(res, {
      statusCode: 200,
      message: 'Banner updated successfully',
      payload: { data: banner },
    });
  },
);

export const updateBannerStatus = asyncHandler(
  async (req: Request, res: Response) => {
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
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const banner = await BannerService.delete(id);

    return successResponse(res, {
      statusCode: 200,
      message: 'Banner deleted successfully',
      payload: { data: banner },
    });
  },
);
