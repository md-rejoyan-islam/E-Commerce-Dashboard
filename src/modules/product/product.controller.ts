import { Response } from 'express';
import { ProductService } from './product.service';
import { asyncHandler } from '../../utils/async-handler';
import { successResponse } from '../../utils/response-handler';
import { GetProductsQuery } from './product.validation';
import { IRequestWithUser } from '../../app/types';

export class ProductController {
  // Get all products with filters and pagination
  static getProducts = asyncHandler(async (req: IRequestWithUser, res: Response) => {
    const query = req.query as unknown as GetProductsQuery;
    const result = await ProductService.list(query);
    
    return successResponse(res, {
      statusCode: 200,
      message: 'Products fetched successfully',
      payload: result,
    });
  });

  // Get product by ID
  static getProductById = asyncHandler(async (req: IRequestWithUser, res: Response) => {
    const { id } = req.params;
    const product = await ProductService.getById(id);
    
    return successResponse(res, {
      statusCode: 200,
      message: 'Product fetched successfully',
      payload: { product },
    });
  });

  // Create new product
  static createProduct = asyncHandler(async (req: IRequestWithUser, res: Response) => {
    const product = await ProductService.create(req.body);
    
    return successResponse(res, {
      statusCode: 201,
      message: 'Product created successfully',
      payload: { product },
    });
  });

  // Update product
  static updateProduct = asyncHandler(async (req: IRequestWithUser, res: Response) => {
    const { id } = req.params;
    const product = await ProductService.update(id, req.body);
    
    return successResponse(res, {
      statusCode: 200,
      message: 'Product updated successfully',
      payload: { product },
    });
  });

  // Change product status
  static changeProductStatus = asyncHandler(async (req: IRequestWithUser, res: Response) => {
    const { id } = req.params;
    const { is_active } = req.body;
    const product = await ProductService.changeStatus(id, is_active);
    
    return successResponse(res, {
      statusCode: 200,
      message: 'Product status updated successfully',
      payload: { product },
    });
  });

  // Delete product
  static deleteProduct = asyncHandler(async (req: IRequestWithUser, res: Response) => {
    const { id } = req.params;
    await ProductService.remove(id);
    
    return successResponse(res, {
      statusCode: 200,
      message: 'Product deleted successfully',
    });
  });

  // Add variant to product
  static addVariant = asyncHandler(async (req: IRequestWithUser, res: Response) => {
    const { id } = req.params;
    const product = await ProductService.addVariant(id, req.body);
    
    return successResponse(res, {
      statusCode: 201,
      message: 'Variant added successfully',
      payload: { product },
    });
  });

  // Update variant
  static updateVariant = asyncHandler(async (req: IRequestWithUser, res: Response) => {
    const { id, variantId } = req.params;
    const product = await ProductService.updateVariant(id, variantId, req.body);
    
    return successResponse(res, {
      statusCode: 200,
      message: 'Variant updated successfully',
      payload: { product },
    });
  });

  // Delete variant
  static deleteVariant = asyncHandler(async (req: IRequestWithUser, res: Response) => {
    const { id, variantId } = req.params;
    const product = await ProductService.deleteVariant(id, variantId);
    
    return successResponse(res, {
      statusCode: 200,
      message: 'Variant deleted successfully',
      payload: { product },
    });
  });

  // Add review to product
  static addReview = asyncHandler(async (req: IRequestWithUser, res: Response) => {
    const { id } = req.params;
    const userId = req.user!._id.toString();
    const product = await ProductService.addReview(id, req.body, userId);
    
    return successResponse(res, {
      statusCode: 201,
      message: 'Review added successfully',
      payload: { product },
    });
  });

  // Update review
  static updateReview = asyncHandler(async (req: IRequestWithUser, res: Response) => {
    const { id, reviewId } = req.params;
    const userId = req.user!._id.toString();
    const product = await ProductService.updateReview(id, reviewId, req.body, userId);
    
    return successResponse(res, {
      statusCode: 200,
      message: 'Review updated successfully',
      payload: { product },
    });
  });

  // Delete review
  static deleteReview = asyncHandler(async (req: IRequestWithUser, res: Response) => {
    const { id, reviewId } = req.params;
    const userId = req.user!._id.toString();
    const product = await ProductService.deleteReview(id, reviewId, userId);
    
    return successResponse(res, {
      statusCode: 200,
      message: 'Review deleted successfully',
      payload: { product },
    });
  });

  // Add FAQ to product
  static addFAQ = asyncHandler(async (req: IRequestWithUser, res: Response) => {
    const { id } = req.params;
    const product = await ProductService.addFAQ(id, req.body);
    
    return successResponse(res, {
      statusCode: 201,
      message: 'FAQ added successfully',
      payload: { product },
    });
  });

  // Update FAQ
  static updateFAQ = asyncHandler(async (req: IRequestWithUser, res: Response) => {
    const { id, faqId } = req.params;
    const product = await ProductService.updateFAQ(id, faqId, req.body);
    
    return successResponse(res, {
      statusCode: 200,
      message: 'FAQ updated successfully',
      payload: { product },
    });
  });

  // Delete FAQ
  static deleteFAQ = asyncHandler(async (req: IRequestWithUser, res: Response) => {
    const { id, faqId } = req.params;
    const product = await ProductService.deleteFAQ(id, faqId);
    
    return successResponse(res, {
      statusCode: 200,
      message: 'FAQ deleted successfully',
      payload: { product },
    });
  });

  // Update inventory
  static updateInventory = asyncHandler(async (req: IRequestWithUser, res: Response) => {
    const { id } = req.params;
    const { variantId, inventory } = req.body;
    const product = await ProductService.updateInventory(id, variantId, inventory);
    
    return successResponse(res, {
      statusCode: 200,
      message: 'Inventory updated successfully',
      payload: { product },
    });
  });
}