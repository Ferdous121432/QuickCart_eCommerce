import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import User from "@/models/user";
import Product from "@/models/product";
import { inngest } from "@/config/inngest";
import dbConnect from "@/config/db";

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

    // Connect to the database
    await dbConnect();

    //Calculate total amount
    const totalAmount = await items.reduce(async (totalPromise, item) => {
      const total = await totalPromise;
      const product = await Product.findById(item._id);
      console.log("First", product);
      if (!product) {
        throw new Error("Product not found");
      }
      return total + product.offerPrice * item.quantity;
    }, Promise.resolve(0));

    // Send event to Inngest
    await inngest.send({
      name: "order/created",
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
