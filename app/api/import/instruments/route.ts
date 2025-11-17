import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongoose"
import Item from "@/models/Item"

function parseCSVLine(line: string): string[] {
  const result = []
  let current = ""
  let insideQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    const nextChar = line[i + 1]

    if (char === '"') {
      insideQuotes = !insideQuotes
    } else if (char === "," && !insideQuotes) {
      result.push(current.trim())
      current = ""
    } else {
      current += char
    }
  }

  result.push(current.trim())
  return result
}

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Starting instrument import")
    await connectDB()
    console.log("[v0] Database connected")

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const text = await file.text()
    const lines = text
      .trim()
      .split("\n")
      .filter((line) => line.trim())

    if (lines.length < 2) {
      return NextResponse.json({ error: "CSV file is empty" }, { status: 400 })
    }

    const headers = parseCSVLine(lines[0]).map((h) => h.toLowerCase())
    console.log("[v0] Headers found:", headers)

    const expectedHeaders = ["itemname", "itemquantity", "sportsname", "itemcode"]

    if (!expectedHeaders.every((h) => headers.includes(h))) {
      return NextResponse.json(
        { error: `CSV must have columns: itemName, itemQuantity, sportsName, itemCode` },
        { status: 400 },
      )
    }

    const itemNameIndex = headers.indexOf("itemname")
    const itemQuantityIndex = headers.indexOf("itemquantity")
    const sportsNameIndex = headers.indexOf("sportsname")
    const itemCodeIndex = headers.indexOf("itemcode")

    const itemsToImport = []
    const errors = []

    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i])

      if (values.length < 4) {
        errors.push(`Row ${i + 1}: Not enough columns`)
        continue
      }

      const itemName = values[itemNameIndex]?.trim()
      const itemQuantity = values[itemQuantityIndex]?.trim()
      const sportsName = values[sportsNameIndex]?.trim()
      const itemCode = values[itemCodeIndex]?.trim()

      if (!itemName || !itemQuantity || !sportsName || !itemCode) {
        errors.push(`Row ${i + 1}: Missing required fields`)
        continue
      }

      const quantity = Number.parseInt(itemQuantity)
      if (isNaN(quantity) || quantity <= 0) {
        errors.push(`Row ${i + 1}: Quantity must be a positive number`)
        continue
      }

      itemsToImport.push({
        itemName,
        itemQuantity: quantity,
        sportsName,
        itemCode,
        isActive: true,
      })
    }

    console.log("[v0] Items to import:", itemsToImport.length)

    if (itemsToImport.length === 0) {
      return NextResponse.json(
        { error: errors.length > 0 ? errors[0] : "No valid instruments to import" },
        { status: 400 },
      )
    }

    // Check for duplicate item codes
    const existingCodes = await Item.find({
      itemCode: { $in: itemsToImport.map((i) => i.itemCode) },
    })

    if (existingCodes.length > 0) {
      return NextResponse.json({ error: `Item code already exists: ${existingCodes[0].itemCode}` }, { status: 400 })
    }

    // Import items
    const result = await Item.insertMany(itemsToImport)
    console.log("[v0] Successfully imported instruments:", result.length)

    return NextResponse.json({
      success: true,
      count: result.length,
      message: `Successfully imported ${result.length} instruments`,
    })
  } catch (error) {
    console.error("[v0] Import error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to import instruments" },
      { status: 500 },
    )
  }
}
