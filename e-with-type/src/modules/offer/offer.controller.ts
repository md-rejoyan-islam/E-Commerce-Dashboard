import { Request, Response } from 'express';
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

export const listOffers = asyncHandler(async (req: Request, res: Response) => {
  const query = req.query as GetOffersQuery;
  const result = await OfferService.list(query);

  return successResponse(res, {
    statusCode: 200,
    message: 'Offers fetched successfully',
    payload: { data: result.offers, pagination: result.pagination },
  });
});

export const getOfferById = asyncHandler(
  async (req: Request, res: Response) => {
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

export const createOffer = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body as CreateOfferBody;

  const file = req.file as Express.Multer.File | undefined;
  const offer = await OfferService.create({
    ...body,
    ...(file ? { image: file.path } : {}),
  });

  return successResponse(res, {
    statusCode: 201,
    message: 'Offer created successfully',
    payload: { data: offer },
  });
});

export const updateOffer = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const file = req.file as Express.Multer.File | undefined;
  const body = {
    ...req.body,
    ...(file ? { image: file.path } : {}),
  } as UpdateOfferBody;

  const offer = await OfferService.update(id, body);

  return successResponse(res, {
    statusCode: 200,
    message: 'Offer updated successfully',
    payload: { data: offer },
  });
});

export const updateOfferStatus = asyncHandler(
  async (req: Request, res: Response) => {
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

export const deleteOffer = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const offer = await OfferService.delete(id);

  return successResponse(res, {
    statusCode: 200,
    message: 'Offer deleted successfully',
    payload: { data: offer },
  });
});
