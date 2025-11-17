import { NextResponse } from "next/server"
import connectDB from "@/lib/mongoose"
import Item from "@/models/Item"

export async function PUT(request: Request) {
  try {

    const { itemId, isActive } = await request.json()

    if (!itemId) {
      return NextResponse.json({ error: "Item ID is required" }, { status: 400 })
    }

    const updatedItem = await Item.findByIdAndUpdate(itemId, { isActive, updatedAt: new Date() }, { new: true })

    if (!updatedItem) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, item: updatedItem })
  } catch (error: any) {
    console.error("[v0] Error toggling item status:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
