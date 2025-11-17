import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongoose"
import Item from "@/models/Item"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { itemName, itemQuantity, sportsName, itemCode } = body

    if (!itemName || !itemQuantity || !sportsName || !itemCode) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const existingItem = await Item.findOne({ itemCode })

    if (existingItem) {
      return NextResponse.json({ error: "Item code already exists" }, { status: 400 })
    }

    const item = await Item.create({
      itemName,
      itemQuantity: Number.parseInt(itemQuantity),
      sportsName,
      itemCode,
    })

    return NextResponse.json(
      {
        message: "Item added successfully",
        itemId: item._id,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error adding item:", error)
    return NextResponse.json({ error: "Failed to add item" }, { status: 500 })
  }
}
