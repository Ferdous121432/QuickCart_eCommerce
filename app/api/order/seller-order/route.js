import authSeller from "@/lib/authSeller";

import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import Order from "@/models/order";
import dbConnect from "@/config/db";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User not authenticated" },
        { status: 401 }
      );
    }

    // check seller role
    const isSeller = await authSeller(userId);
    if (!isSeller) {
      return NextResponse.json(
        { success: false, message: "User is not a seller" },
        { status: 403 }
      );
    }
    // Connect to the database
    await dbConnect();
    // Fetch all orders
    // Populate address and items.product fields
    const orders = await Order.find({})
      .populate("address items.product")
      .sort({ date: -1 });
    // console.log("Fetched orders:", orders);

    return NextResponse.json({ success: true, orders }, { status: 200 });
  } catch (error) {
    // console.log("Error fetching orders:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
