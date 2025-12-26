import { Document } from 'mongoose';

export interface IStore extends Document {
  _id: string;
  image: string;
  name: string;
  description: string;
  city: string;
  country: string;
  division: string;
  zip_code: string;
  map_location: string;
  phone: string;
  email: string;
  working_hours: string;
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
