import { Request, Response } from 'express';
import secret from '../../app/secret';
import { asyncHandler } from '../../utils/async-handler';
import { generateImagePath } from '../../utils/image-utils';
import { successResponse } from '../../utils/response-handler';
import { ProductService } from './product.service';
import { GetProductsQuery } from './product.validation';

export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const query = req.query as GetProductsQuery;
  const result = await ProductService.list(query);

  return successResponse(res, {
    statusCode: 200,
    message: 'Products fetched successfully',
    payload: result,
  });
});

export const getAllReviews = asyncHandler(
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await ProductService.getAllReviews({ page, limit });

    return successResponse(res, {
      statusCode: 200,
      message: 'Reviews fetched successfully',
      payload: { data: result },
    });
  },
);

export const getProductById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const fields = req.query.fields as string | undefined;
    const includeCampaigns = req.query.includeCampaigns as string | undefined;
    const includeOffers = req.query.includeOffers as string | undefined;
    const product = await ProductService.getById(
      id,
      fields,
      includeCampaigns,
      includeOffers,
    );

    return successResponse(res, {
      statusCode: 200,
      message: 'Product fetched successfully',
      payload: { data: product },
    });
  },
);

export const createProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[] | undefined;

    // Process uploaded files
    const productData = { ...req.body };

    // Parse variants if it's a JSON string (from FormData)
    if (typeof productData.variants === 'string') {
      try {
        productData.variants = JSON.parse(productData.variants);
      } catch {
        throw new Error('Invalid variants data');
      }
    }

    if (files && files.length > 0) {
      // Process variant images
      const variantImagesMap: { [key: string]: string[] } = {};

      files.forEach((file) => {
        const imagePath = generateImagePath(
          file.filename,
          secret.product_image_path,
        );

        // Check if this is a variant image (fieldname like 'variant_0_images')
        const variantMatch = file.fieldname.match(/variant_(\d+)_images/);
        if (variantMatch) {
          const variantIndex = variantMatch[1];
          if (!variantImagesMap[variantIndex]) {
            variantImagesMap[variantIndex] = [];
          }
          variantImagesMap[variantIndex].push(imagePath);
        }
      });

      // Set variant images
      if (productData.variants && Array.isArray(productData.variants)) {
        productData.variants = productData.variants.map(
          (variant: Record<string, unknown>, index: number) => ({
            ...variant,
            images: variantImagesMap[index.toString()] || [],
          }),
        );
      }
    }

    const product = await ProductService.create(productData);

    return successResponse(res, {
      statusCode: 201,
      message: 'Product created successfully',
      payload: { data: product },
    });
  },
);

export const updateProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const files = req.files as Express.Multer.File[] | undefined;

    // Process uploaded files
    const productData = { ...req.body };

    if (files && files.length > 0) {
      // Separate product images from variant images
      const productImages: string[] = [];
      const variantImagesMap: { [key: string]: string[] } = {};

      files.forEach((file) => {
        const imagePath = generateImagePath(
          file.filename,
          secret.product_image_path,
        );

        // Check if this is a variant image (fieldname like 'variants[0][images]')
        const variantMatch = file.fieldname.match(
          /variants\[(\d+)\]\[images\]/,
        );
        if (variantMatch) {
          const variantIndex = variantMatch[1];
          if (!variantImagesMap[variantIndex]) {
            variantImagesMap[variantIndex] = [];
          }
          variantImagesMap[variantIndex].push(imagePath);
        } else if (file.fieldname === 'images') {
          // This is a product image
          productImages.push(imagePath);
        }
      });

      // Set product images (only if new images are uploaded)
      if (productImages.length > 0) {
        productData.image = productImages[0]; // First image is main
        productData.images = productImages.slice(1); // Rest are gallery
      }

      // Set variant images
      if (productData.variants && Array.isArray(productData.variants)) {
        productData.variants = productData.variants.map(
          (variant: Record<string, unknown>, index: number) => ({
            ...variant,
            ...(variantImagesMap[index.toString()] && {
              images: variantImagesMap[index.toString()],
            }),
          }),
        );
      }
    }

    const product = await ProductService.update(id, productData);

    return successResponse(res, {
      statusCode: 200,
      message: 'Product updated successfully',
      payload: { data: product },
    });
  },
);

export const changeProductStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { is_active } = req.body;
    const product = await ProductService.changeStatus(id, is_active);

    return successResponse(res, {
      statusCode: 200,
      message: 'Product status updated successfully',
      payload: { data: product },
    });
  },
);

export const deleteProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    await ProductService.remove(id);

    return successResponse(res, {
      statusCode: 200,
      message: 'Product deleted successfully',
    });
  },
);

export const addVariant = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const file = req.file as Express.Multer.File | undefined;

  const variantData = {
    ...req.body,
    ...(file && {
      image: generateImagePath(file.filename, secret.product_image_path),
    }),
  };

  const product = await ProductService.addVariant(id, variantData);

  return successResponse(res, {
    statusCode: 201,
    message: 'Variant added successfully',
    payload: { data: product },
  });
});

export const updateVariant = asyncHandler(
  async (req: Request, res: Response) => {
    const { id, variantId } = req.params;
    const file = req.file as Express.Multer.File | undefined;

    const variantData = {
      ...req.body,
      ...(file && {
        image: generateImagePath(file.filename, secret.product_image_path),
      }),
    };

    const product = await ProductService.updateVariant(
      id,
      variantId,
      variantData,
    );

    return successResponse(res, {
      statusCode: 200,
      message: 'Variant updated successfully',
      payload: { data: product },
    });
  },
);

export const deleteVariant = asyncHandler(
  async (req: Request, res: Response) => {
    const { id, variantId } = req.params;
    const product = await ProductService.deleteVariant(id, variantId);

    return successResponse(res, {
      statusCode: 200,
      message: 'Variant deleted successfully',
      payload: { data: product },
    });
  },
);

export const addReview = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user!._id.toString();
  const product = await ProductService.addReview(id, req.body, userId);

  return successResponse(res, {
    statusCode: 201,
    message: 'Review added successfully',
    payload: { data: product },
  });
});

export const updateReview = asyncHandler(
  async (req: Request, res: Response) => {
    const { id, reviewId } = req.params;
    const userId = req.user!._id.toString();
    const product = await ProductService.updateReview(
      id,
      reviewId,
      req.body,
      userId,
    );

    return successResponse(res, {
      statusCode: 200,
      message: 'Review updated successfully',
      payload: { data: product },
    });
  },
);

export const deleteReview = asyncHandler(
  async (req: Request, res: Response) => {
    const { id, reviewId } = req.params;
    const userId = req.user!._id.toString();
    const product = await ProductService.deleteReview(id, reviewId, userId);

    return successResponse(res, {
      statusCode: 200,
      message: 'Review deleted successfully',
      payload: { data: product },
    });
  },
);

export const adminDeleteReview = asyncHandler(
  async (req: Request, res: Response) => {
    const { id, reviewId } = req.params;
    const product = await ProductService.adminDeleteReview(id, reviewId);

    return successResponse(res, {
      statusCode: 200,
      message: 'Review deleted successfully',
      payload: { data: product },
    });
  },
);

export const addFAQ = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await ProductService.addFAQ(id, req.body);

  return successResponse(res, {
    statusCode: 201,
    message: 'FAQ added successfully',
    payload: { data: product },
  });
});

export const updateFAQ = asyncHandler(async (req: Request, res: Response) => {
  const { id, faqId } = req.params;
  const product = await ProductService.updateFAQ(id, faqId, req.body);

  return successResponse(res, {
    statusCode: 200,
    message: 'FAQ updated successfully',
    payload: { data: product },
  });
});

export const deleteFAQ = asyncHandler(async (req: Request, res: Response) => {
  const { id, faqId } = req.params;
  const product = await ProductService.deleteFAQ(id, faqId);

  return successResponse(res, {
    statusCode: 200,
    message: 'FAQ deleted successfully',
    payload: { data: product },
  });
});

export const updateInventory = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { variantId, inventory } = req.body;
    const product = await ProductService.updateInventory(
      id,
      variantId,
      inventory,
    );

    return successResponse(res, {
      statusCode: 200,
      message: 'Inventory updated successfully',
      payload: { data: product },
    });
  },
);

/**
 * Link campaigns to a product
 * @route POST /api/v1/products/:id/campaigns
 * @access Admin only
 */
export const linkCampaigns = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { campaigns } = req.body;
    const product = await ProductService.linkCampaigns(id, campaigns);

    return successResponse(res, {
      statusCode: 200,
      message: 'Campaigns linked successfully',
      payload: { data: product },
    });
  },
);

/**
 * Unlink a campaign from a product
 * @route DELETE /api/v1/products/:id/campaigns/:campaignId
 * @access Admin only
 */
export const unlinkCampaign = asyncHandler(
  async (req: Request, res: Response) => {
    const { id, campaignId } = req.params;
    const product = await ProductService.unlinkCampaign(id, campaignId);

    return successResponse(res, {
      statusCode: 200,
      message: 'Campaign unlinked successfully',
      payload: { data: product },
    });
  },
);

/**
 * Link offers to a product
 * @route POST /api/v1/products/:id/offers
 * @access Admin only
 */
export const linkOffers = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { offers } = req.body;
  const product = await ProductService.linkOffers(id, offers);

  return successResponse(res, {
    statusCode: 200,
    message: 'Offers linked successfully',
    payload: { data: product },
  });
});

/**
 * Unlink an offer from a product
 * @route DELETE /api/v1/products/:id/offers/:offerId
 * @access Admin only
 */
export const unlinkOffer = asyncHandler(async (req: Request, res: Response) => {
  const { id, offerId } = req.params;
  const product = await ProductService.unlinkOffer(id, offerId);

  return successResponse(res, {
    statusCode: 200,
    message: 'Offer unlinked successfully',
    payload: { data: product },
  });
});
