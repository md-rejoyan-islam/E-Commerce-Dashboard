import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/async-handler';
import { successResponse } from '../../utils/response-handler';
import { CategoryService } from './category.service';
import { GetCategoriesQuery } from './category.validation';

export const getCategories = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await CategoryService.list(req.query as GetCategoriesQuery);
    successResponse(res, {
      statusCode: 200,
      message: 'Categories fetched',
      payload: data,
    });
  },
);

export const getCategoriesWithChildren = asyncHandler(
  async (req: Request, res: Response) => {
    const is_active =
      req.query.is_active === 'true'
        ? true
        : req.query.is_active === 'false'
          ? false
          : undefined;
    const data = await CategoryService.getCategoriesWithChildren({
      is_active,
    });
    successResponse(res, {
      statusCode: 200,
      message: 'Categories with children fetched',
      payload: { data },
    });
  },
);

export const getCategoryById = asyncHandler(
  async (req: Request, res: Response) => {
    const { includeParent, fields } = req.query;
    const data = await CategoryService.getById(req.params.id, {
      includeParent: includeParent === 'true',
      fields: fields as string | undefined,
    });
    successResponse(res, {
      statusCode: 200,
      message: 'Category fetched',
      payload: { data },
    });
  },
);

export const createCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await CategoryService.create(req.body);
    successResponse(res, {
      statusCode: 201,
      message: 'Category created',
      payload: { data },
    });
  },
);

export const updateCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await CategoryService.update(req.params.id, req.body);
    successResponse(res, {
      statusCode: 200,
      message: 'Category updated',
      payload: { data },
    });
  },
);

export const changeCategoryStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await CategoryService.changeStatus(
      req.params.id,
      req.body.is_active,
    );
    successResponse(res, {
      statusCode: 200,
      message: 'Category status updated',
      payload: { data },
    });
  },
);

export const deleteCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await CategoryService.remove(req.params.id);
    successResponse(res, {
      statusCode: 200,
      message: 'Category deleted',
      payload: { data },
    });
  },
);
