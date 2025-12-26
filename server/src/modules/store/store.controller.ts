import { Request, Response } from 'express';
import secret from '../../app/secret';
import { asyncHandler } from '../../utils/async-handler';
import { generateImagePath } from '../../utils/image-utils';
import { successResponse } from '../../utils/response-handler';
import { StoreService } from './store.service';
import {
  CreateStoreBody,
  GetStoreByIdQuery,
  GetStoresQuery,
  UpdateStoreBody,
  UpdateStoreStatusBody,
} from './store.validation';

export const listStores = asyncHandler(async (req: Request, res: Response) => {
  const query = req.query as GetStoresQuery;
  const result = await StoreService.list(query);

  return successResponse(res, {
    statusCode: 200,
    message: 'Stores fetched successfully',
    payload: { stores: result.stores, pagination: result.pagination },
  });
});

export const getStoreById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const query = req.query as GetStoreByIdQuery;
    const store = await StoreService.getById(id, query);

    return successResponse(res, {
      statusCode: 200,
      message: 'Store fetched successfully',
      payload: { data: store },
    });
  },
);

export const createStore = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body as CreateStoreBody;
  const file = req.file as Express.Multer.File;
  const store = await StoreService.create({
    ...body,
    image: generateImagePath(file.filename, secret.store_image_path),
  });

  return successResponse(res, {
    statusCode: 201,
    message: 'Store created successfully',
    payload: { data: store },
  });
});

export const updateStore = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const file = req.file as Express.Multer.File | undefined;
  const body = {
    ...req.body,
    ...(file && {
      image: generateImagePath(file.filename, secret.store_image_path),
    }),
  } as UpdateStoreBody;
  const store = await StoreService.update(id, body);

  return successResponse(res, {
    statusCode: 200,
    message: 'Store updated successfully',
    payload: { data: store },
  });
});

export const updateStoreStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { is_active } = req.body as UpdateStoreStatusBody;
    const store = await StoreService.updateStatus(id, is_active);

    return successResponse(res, {
      statusCode: 200,
      message: 'Store status updated successfully',
      payload: { data: store },
    });
  },
);

export const deleteStore = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const store = await StoreService.delete(id);

  return successResponse(res, {
    statusCode: 200,
    message: 'Store deleted successfully',
    payload: { data: store },
  });
});
