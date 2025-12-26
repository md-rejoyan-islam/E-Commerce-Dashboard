import { Schema, model } from 'mongoose';
import { ICampaign } from './campaign.types';

const CampaignSchema = new Schema<ICampaign>(
  {
    name: {
      type: String,
      required: [true, 'Campaign name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Campaign description is required'],
    },
    image: {
      type: String,
      required: [true, 'Campaign image is required'],
    },
    start_date: {
      type: Date,
      required: [true, 'Campaign start date is required'],
    },
    end_date: {
      type: Date,
      required: [true, 'Campaign end date is required'],
    },
    discount_type: {
      type: String,
      enum: {
        values: ['percentage', 'fixed_amount'],
        message: '{VALUE} is not a valid discount type',
      },
      required: [true, 'Discount type is required'],
    },
    discount_value: {
      type: Number,
      required: [true, 'Discount value is required'],
      min: [0, 'Discount value must be greater than or equal to 0'],
    },
    applies_to: {
      all_products: {
        type: Boolean,
        default: false,
      },
      productsIds: {
        type: [String],
        default: [],
      },
      categoryIds: {
        type: [String],
        default: [],
      },
      brandIds: {
        type: [String],
        default: [],
      },
    },
    minimum_purchase_amount: {
      type: Number,
      default: 0,
      min: [0, 'Minimum purchase amount must be greater than or equal to 0'],
    },
    free_shipping: {
      type: Boolean,
      default: false,
    },
    usage_limit: {
      type: Number,
      default: 0,
      min: [0, 'Usage limit must be greater than or equal to 0'],
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes for better query performance
CampaignSchema.index({ is_active: 1 });
CampaignSchema.index({ start_date: 1, end_date: 1 });
CampaignSchema.index({ discount_type: 1 });
CampaignSchema.index({ 'applies_to.all_products': 1 });

const CampaignModel = model<ICampaign>('Campaign', CampaignSchema);

export default CampaignModel;
