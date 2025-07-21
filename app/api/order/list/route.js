import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import User from "@/models/user";
import Order from "@/models/order";
import dbConnect from "@/config/db";
import Address from "@/models/address";
import Product from "@/models/product";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User not authenticated" },
        { status: 401 }
      );
    }

    // Connect to the database
    await dbConnect();
    const user = await User.findOne({ userID: userId });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Address.length;
    // Product.length;

    const orders = await Order.find({ userID: userId }).populate(
      "address items.product"
    );

    return NextResponse.json({ success: true, orders }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
