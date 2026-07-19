const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: [true, 'Please add a property title'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
      min: 0,
    },
    propertyType: {
      type: String,
      enum: ['house', 'apartment', 'condo', 'townhouse', 'land', 'commercial'],
      default: 'house',
    },
    status: {
      type: String,
      enum: ['for-sale', 'for-rent', 'sold', 'pending'],
      default: 'for-sale',
    },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      zipCode: { type: String, default: '' },
      country: { type: String, default: '' },
    },
    bedrooms: {
      type: Number,
      default: 0,
      min: 0,
    },
    bathrooms: {
      type: Number,
      default: 0,
      min: 0,
    },
    area: {
      type: Number,
      default: 0,
      min: 0,
    },
    yearBuilt: {
      type: Number,
      default: 0,
    },
    images: [
      {
        url: { type: String, default: '' },
        caption: { type: String, default: '' },
      },
    ],
    amenities: [
      {
        type: String,
        trim: true,
      },
    ],
    contactName: {
      type: String,
      default: '',
    },
    contactPhone: {
      type: String,
      default: '',
    },
    contactEmail: {
      type: String,
      default: '',
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

propertySchema.index({ title: 'text', description: 'text', 'address.city': 'text', 'address.state': 'text' });

module.exports = mongoose.model('Property', propertySchema);
