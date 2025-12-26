import dotenv from 'dotenv';
dotenv.config({
  quiet: true,
  override: true,
  path: '.env',
  debug: process.env.NODE_ENV === 'development',
});

const node_env: string = process.env.NODE_ENV!;
const mongo_uri: string = process.env.MONGO_URI!;
const server_url: string = process.env.SERVER_URL!;
const port: number = +process.env.SERVER_PORT!;
const max_requests: number = +process.env.MAX_REQUESTS!;
const users_image_path: string =
  process.env.USERS_IMAGE_PATH || 'public/uploads/users';

const banner_image_path: string =
  process.env.BANNER_IMAGE_PATH || 'public/uploads/banners';

const brand_image_path: string =
  process.env.BRAND_IMAGE_PATH || 'public/uploads/brands';

const campaign_image_path: string =
  process.env.CAMPAIGN_IMAGE_PATH || 'public/uploads/campaigns';

const category_image_path: string =
  process.env.CATEGORY_IMAGE_PATH || 'public/uploads/categories';

const offer_image_path: string =
  process.env.OFFER_IMAGE_PATH || 'public/uploads/offers';

const store_image_path: string =
  process.env.STORE_IMAGE_PATH || 'public/uploads/stores';

const product_image_path: string =
  process.env.PRODUCT_IMAGE_PATH || 'public/uploads/products';

const max_requests_window: number = +process.env.MAX_REQUESTS_WINDOW!;
const clinetWhiteList: string[] =
  process.env.CLIENT_WHITELIST?.split(',') || [];
const accessTokenSecret: string = process.env.JWT_ACCESS_TOKEN_SECRET!;
const refreshTokenSecret: string = process.env.JWT_REFRESH_TOKEN_SECRET!;
const accessTokenExpiresIn: number = parseInt(
  process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || '3600',
  10,
);
const refreshTokenExpiresIn: number = parseInt(
  process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || '86400',
  10,
);
const passwordResetCodeExpiresIn: number =
  Date.now() + +process.env.PASSWORD_RESET_CODE_EXPIRES_IN! * 60 * 1000;

const emailHost: string = process.env.EMAIL_HOST!;
const emailPort: number = +process.env.EMAIL_PORT!;
const emailUsername: string = process.env.EMAIL_USERNAME!;
const emailPassword: string = process.env.EMAIL_PASSWORD!;

const client_url: string = process.env.CLIENT_URL!;

const redis_host: string = process.env.REDIS_HOST || '127.0.0.1';
const redis_port: number = +process.env.REDIS_PORT! || 6379;
const redis_password: string | undefined =
  process.env.REDIS_PASSWORD || undefined;
const redis_url: string =
  process.env.REDIS_URL ||
  `redis://${redis_password ? `:${redis_password}@` : ''}${redis_host}:${redis_port}`;

const secret = {
  product_image_path,
  store_image_path,
  offer_image_path,
  category_image_path,
  campaign_image_path,
  users_image_path,
  banner_image_path,
  brand_image_path,
  node_env,
  server_url,
  mongo_uri,
  client_url,
  port,
  max_requests,
  max_requests_window,
  clinetWhiteList,
  passwordResetCodeExpiresIn,
  jwt: {
    accessTokenSecret,
    refreshTokenSecret,
    accessTokenExpiresIn,
    refreshTokenExpiresIn,
  },
  nodeMailer: {
    emailHost,
    emailPort,
    emailUsername,
    emailPassword,
    emailFrom: process.env.EMAIL_FROM!,
  },
  redis: {
    redis_host,
    redis_port,
    redis_password,
    redis_url,
  },
};

export default secret;
