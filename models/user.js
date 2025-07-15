import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userID: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
      default:
        "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    cartItem: {
      type: Object,
      default: {},
    },

    isSeller: {
      type: Boolean,
      default: false,
    },
    address: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    minimize: false,
  }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
