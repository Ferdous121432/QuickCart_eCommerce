import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  userId: {
    type: String,
    ref: "User",
    required: true,
  },
  fullName: {
    type: String,
    required: true,
    default: "",
  },
  phoneNumber: {
    type: String,
    required: true,
    default: "",
  },
  area: {
    type: String,
    required: true,
    default: "",
  },
  city: {
    type: String,
    required: true,
    default: "",
  },
  state: {
    type: String,
    required: false,
    default: "",
  },
  postalCode: {
    type: String,
    required: false,
  },
});

const Address =
  mongoose.model("Address", addressSchema) || mongoose.models.Address;

export default Address;
