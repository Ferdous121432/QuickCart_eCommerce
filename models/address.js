import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  userID: {
    type: String,
    ref: "User",
    required: true,
  },
  fullName: {
    type: String,
    // required: true,
    default: "",
  },
  phoneNumber: {
    type: String,
    // required: true,
    default: "",
  },
  area: {
    type: String,
    // required: true,
    default: "",
  },
  city: {
    type: String,
    // required: true,
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
  mongoose.models.Address || mongoose.model("Address", addressSchema);
export default Address;
