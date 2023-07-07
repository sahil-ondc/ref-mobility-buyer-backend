import mongoose from 'mongoose';

const TripSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    driver: { type: String, required: true },
    qoute: { type: Object },
    location: { type: Object, required: true },
    vehicle: { type: String },
    transaction_id: { type: String, required: true, unique: true },
    bpp_uri: { type: String },
    fulfillment_id: { type: String },
    provider_id: { type: String },
    order_id: { type: String },
  },
  { timestamps: true },
);

const Trip = mongoose.model('trip', TripSchema);

export default Trip;
