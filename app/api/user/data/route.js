import dbConnect from "@/config/db";
import User from "@/models/user";
import { getAuth } from "@clerk/nextjs/server";

import { NextResponse } from "next/server";

export async function GET(request) {
  let userID;
  try {
    const { userId } = getAuth(request);
    userID = userId;
    console.log("userID", userID);

    await dbConnect();
    const user = await User.findOne({ userID });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, user }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal Server Error-------" },
      { status: 500 }
    );
  }
}
