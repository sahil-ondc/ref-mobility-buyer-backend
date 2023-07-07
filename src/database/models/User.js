import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    phone: { type: String },
    avatar: { type: String },
    trips: [
      {
        tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'trip' },
      },
    ],
  },
  { timestamps: true },
);

const User = mongoose.model('user', UserSchema);
export default User;
