import { NextResponse } from "next/server";
import dbConnect from "@/config/db";
import { getAuth } from "@clerk/nextjs/server";
import User from "@/models/user";
import Product from "@/models/product";
import Order from "@/models/order";
import { inngest } from "@/config/inngest";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const { address, items } = await request.json();

    // Check if address and items are valid
    if (!address || !items || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Invalid order data" },
        { status: 400 }
      );
    }

    //Calculate total amount
    const totalAmount = await items.reduce(async (total, item) => {
      const product = await Product.findById(item.product);
      if (!product) {
        throw new Error("Product not found");
      }
      const itemTotal = total + product.offerPrice * item.quantity;
      return itemTotal;
    }, 0);

    // Connect to the database
    await inngest.send({
      event: "order/created",
      data: {
        userID: userId,
        items,
        address,
        totalAmount: totalAmount + Math.floor(totalAmount * 0.02), // Adding 2% tax
        date: Date.now(),
      },
    });

    //clear cart after order creation
    const user = await User.findOne({ userID: userId });
    if (user) {
      user.cartitem = {};
      await user.save();

      return NextResponse.json(
        { success: true, message: "Order created successfully" },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
