import Address from "@/models/address";
import { NextResponse } from "next/server";
import dbConnect from "@/config/db";
import { getAuth } from "@clerk/nextjs/server";
import User from "@/models/user";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const { address } = await request.json();
    await dbConnect();
    const user = await User.findOne({ userID: userId });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
    const newAddress = await Address.create({
      userID: userId,
      ...address,
    });

    NextResponse.json(
      {
        success: true,
        message: "Address added successfully",
        address: newAddress,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
