import { Request } from 'express';
import fs from 'fs';
import multer, { diskStorage } from 'multer';
import path from 'path';
import secret from '../app/secret';
import { IMulterConfig } from '../app/types';

const multerUploader = (config: IMulterConfig) => {
  const {
    uploadPath = 'public/uploads/images',
    maxSize = 0.5,
    allowedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
    ],
    single = true,
    fieldName,
  } = config;

  // Ensure upload directory exists
  const fullPath = path.join(process.cwd(), uploadPath);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }

  const storage = diskStorage({
    destination: (_req: Request, _file, cb) => {
      cb(null, fullPath);
    },
    filename: (_req: Request, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const ext = path.extname(file.originalname);
      const name = path.basename(file.originalname, ext);
      cb(null, `${name}-${uniqueSuffix}${ext}`);
    },
  });

  const upload = multer({
    storage,
    limits: {
      fileSize: maxSize * 1024 * 1024, // Convert MB to bytes
    },
    fileFilter: (_req: Request, file, cb) => {
      if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error(`Only ${allowedMimeTypes.join(', ')} files are allowed!`));
      }
    },
  });

  return single ? upload.single(fieldName) : upload.array(fieldName, 10);
};

export const avatarUpload = multerUploader({
  uploadPath: secret.users_image_path,
  maxSize: 0.3, // 300KB
  allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  single: true,
  fieldName: 'avatar',
});
export const bannerUploader = multerUploader({
  uploadPath: secret.banner_image_path,
  maxSize: 0.3, // 300KB
  allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  single: true,
  fieldName: 'image',
});
export const brandLogoUploader = multerUploader({
  uploadPath: secret.brand_image_path,
  maxSize: 0.3, // 300KB
  allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  single: true,
  fieldName: 'logo',
});
export const campaignImageUploader = multerUploader({
  uploadPath: secret.campaign_image_path,
  maxSize: 0.3, // 300KB
  allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  single: true,
  fieldName: 'image',
});

export const categoryImageUploader = multerUploader({
  uploadPath: secret.category_image_path,
  maxSize: 0.2, // 200KB
  allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  single: true,
  fieldName: 'image',
});

export const offerImageUploader = multerUploader({
  uploadPath: secret.offer_image_path,
  maxSize: 0.2, // 200KB
  allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  single: true,
  fieldName: 'image',
});
export const storeImageUploader = multerUploader({
  uploadPath: secret.store_image_path,
  maxSize: 0.2, // 200KB
  allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  single: true,
  fieldName: 'image',
});

export const productImageUploader = multerUploader({
  uploadPath: secret.product_image_path,
  maxSize: 0.3, // 300KB
  allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  single: false,
  fieldName: 'images',
});

export const productVariantImageUploader = multerUploader({
  uploadPath: secret.product_image_path,
  maxSize: 0.3, // 300KB
  allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  single: true,
  fieldName: 'image',
});

// Product with variants image uploader - handles product images and variant images
export const productWithVariantsUploader = (() => {
  const fullPath = path.join(process.cwd(), secret.product_image_path);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }

  const storage = diskStorage({
    destination: (_req: Request, _file, cb) => {
      cb(null, fullPath);
    },
    filename: (_req: Request, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const ext = path.extname(file.originalname);
      const name = path.basename(file.originalname, ext);
      cb(null, `${name}-${uniqueSuffix}${ext}`);
    },
  });

  const upload = multer({
    storage,
    limits: {
      fileSize: 0.3 * 1024 * 1024, // 300KB
    },
    fileFilter: (_req: Request, file, cb) => {
      const allowedMimeTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
      ];
      if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error(`Only ${allowedMimeTypes.join(', ')} files are allowed!`));
      }
    },
  });

  // Allow any field that matches pattern
  return upload.any();
})();

export default multerUploader;
