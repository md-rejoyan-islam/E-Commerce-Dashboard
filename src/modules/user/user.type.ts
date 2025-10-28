export interface IShippingAddress {
  name?: string;
  phone?: string;
  address?: string;
  country?: string;
  email?: string;
  town?: string;
  zip?: string;
}

export interface IUser {
  first_name?: string;
  last_name?: string;
  email: string;
  phone?: string;
  password: string;
  avatar?: string;
  is_active?: boolean;
  role: 'superadmin' | 'admin' | 'user';
  last_login?: Date;
  shippingAddress?: IShippingAddress;
}
