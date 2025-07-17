import { NextResponse } from "next/server";
import dbConnect from "@/config/db";
import User from "@/models/user";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);

    const { cartData } = await request.json();

    await dbConnect();
    const user = await User.findOne({ userID: userId });

    user.cartItem = cartData;
    await user.save();
    return NextResponse.json(
      { success: true, message: "Cart updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
