import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongoose"
import Item from "@/models/Item"

export async function GET(request: NextRequest) {
  try {
    const items = await Item.find({}).sort({ createdAt: -1 })

    return NextResponse.json({ items }, { status: 200 })
  } catch (error) {
    console.error("[v0] Fetch items error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
