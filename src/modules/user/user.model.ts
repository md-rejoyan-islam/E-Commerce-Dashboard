import mongoose, { Schema } from 'mongoose';
import { comparePassword, hashPassword } from '../../utils/password';
import { IShippingAddress, IUser } from './user.type';

export const ShippingAddressSchema = new Schema<IShippingAddress>({
  name: { type: String },
  phone: { type: String },
  address: { type: String },
  country: { type: String },
  email: { type: String },
  town: { type: String },
  zip: { type: String },
});

const UserSchema = new mongoose.Schema<IUser>(
  {
    first_name: {
      type: String,
      require: [1, 'First name is required'],
      minlength: [1, 'First name cannot be empty'],
      trim: true,
    },
    last_name: {
      type: String,
      trim: true,
      require: [1, 'Last name cannot be empty'],
      minlength: [1, 'Last name cannot be empty'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: [true, 'Email must be unique'],
      lowercase: true,
      trim: true,
      match: [
        // eslint-disable-next-line no-useless-escape
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please fill a valid email address',
      ],
    },
    phone: { type: String },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
    },
    avatar: { type: String },
    is_active: { type: Boolean, default: true },
    role: {
      type: String,
      enum: ['superadmin', 'admin', 'user'],
      default: 'user',
    },
    last_login: { type: Date },
    shippingAddress: { type: ShippingAddressSchema },
  },
  {
    timestamps: true,
  },
);

UserSchema.pre('save', async function (next) {
  const user = this as unknown as IUser & mongoose.Document;

  if (!user.isModified('password')) return next();

  user.password = await hashPassword(user.password);

  next();
});

UserSchema.methods.comparePassword = function (entirePassword: string) {
  const user = this as unknown as IUser & mongoose.Document;
  return comparePassword(entirePassword, user.password);
};

UserSchema.index({ role: 1 });

const UserModel = mongoose.model<IUser>('Users', UserSchema);

export default UserModel;
