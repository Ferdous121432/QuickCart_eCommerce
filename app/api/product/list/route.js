import { NextResponse } from "next/server";
import dbConnect from "@/config/db";
import Product from "@/models/product";

export async function GET(request) {
  try {
    await dbConnect();
    const products = await Product.find({}).sort({ date: -1 });
    return NextResponse.json({ success: true, products }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
