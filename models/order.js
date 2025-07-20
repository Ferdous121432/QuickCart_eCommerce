import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userID: {
    type: String,
    required: true,
    ref: "User",
  },
  items: [
    {
      product: {
        type: String,
        required: true,
        ref: "Product",
      },
      quantity: {
        type: Number,
        required: true,
      },
      //   amount: {
      //     type: Number,
      //     required: true,
      //   },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
    required: true,
  },
  date: {
    type: Number,
    required: true,
  },
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
