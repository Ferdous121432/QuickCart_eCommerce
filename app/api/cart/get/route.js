import dbConnect from "@/utils/dbConnect";
import User from "@/models/user";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    // Get the user ID from the request
    const { userId } = getAuth(request);

    // Connect to the database
    await dbConnect();
    // Find the user in the database
    const user = await User.findOne({ userID: userId });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
    // Return the user's cart items
    return NextResponse.json(
      { success: true, cartItems: user.cartItem || [] },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
