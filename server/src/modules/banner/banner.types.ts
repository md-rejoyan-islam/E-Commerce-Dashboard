import { Document } from 'mongoose';

export type BannerType = 'popup' | 'slider' | 'static';

export interface IBanner extends Document {
  _id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  is_active: boolean;
  type: BannerType;
  start_date?: Date;
  end_date?: Date;
  createdAt: Date;
  updatedAt: Date;
}
