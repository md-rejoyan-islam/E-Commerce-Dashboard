import { IJwtPayload } from './types';

declare global {
  namespace Express {
    interface Request {
      user?: IJwtPayload;
    }
  }
}
