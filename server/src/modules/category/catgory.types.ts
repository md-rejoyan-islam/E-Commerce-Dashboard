import mongoose from 'mongoose';

export interface ICategory {
  name: string;
  description?: string;
  image?: string;
  parent_id?: mongoose.Types.ObjectId;
  featured?: boolean;
  slug: string;
  order?: number;
  is_active?: boolean;
}
