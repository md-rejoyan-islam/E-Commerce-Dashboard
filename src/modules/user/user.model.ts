import mongoose, { Schema } from 'mongoose';
import { IUser } from '../../app/types';
import { comparePassword, hashPassword } from '../../utils/password';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ShippingAddressSchema = new Schema<any>({
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
    // name: {
    //   type: String,
    //   required: true,
    // },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        // eslint-disable-next-line no-useless-escape
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please fill a valid email address',
      ],
    },
    // phone: {
    //   type: String,
    //   required: true,
    //   unique: true,
    // },
    // password: {
    //   type: String,
    //   required: true,
    // },
    // avatar: {
    //   type: String,
    // },
    // isAdmin: {
    //   type: Boolean,
    //   default: false,
    // },
    // shippingAddress: { type: ShippingAddressSchema },
  },
  {
    timestamps: true,
  },
);

UserSchema.pre('save', async function (next) {
  const user = this as IUser &
    mongoose.Document & {
      password: string;
    };

  if (!user.isModified('password')) return next();

  user.password = await hashPassword(user.password);

  next();
});

UserSchema.methods.comparePassword = function (entirePassword: string) {
  const user = this as IUser &
    mongoose.Document & {
      password: string;
    };
  return comparePassword(entirePassword, user.password);
};

UserSchema.index({ isAdmin: 1 });

const UserModel = mongoose.model<IUser>('Users', UserSchema);

export default UserModel;
