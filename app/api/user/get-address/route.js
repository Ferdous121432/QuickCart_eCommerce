import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import Address from "@/models/address";
import User from "@/models/user";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    await dbConnect();
    const user = await User.findOne({ userID: userId });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
    const addresses = await Address.find({ userID: userId });
    return NextResponse.json({ success: true, addresses }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
