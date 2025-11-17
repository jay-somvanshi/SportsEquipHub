import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongoose"
import Item from "@/models/Item"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const { itemName, itemQuantity, sportsName, itemCode } = await request.json()
    const item = await Item.findByIdAndUpdate(
      id,
      {
        itemName,
        itemQuantity,
        sportsName,
        itemCode,
        updatedAt: new Date(),
      },
      { new: true },
    )

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    return NextResponse.json({ item }, { status: 200 })
  } catch (error) {
    console.error("[v0] Update item error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const item = await Item.findByIdAndDelete(id)

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Item deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("[v0] Delete item error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
