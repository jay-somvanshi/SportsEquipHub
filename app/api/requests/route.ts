import { NextResponse } from "next/server"
import connectDB from "@/lib/mongoose"
import Request from "@/models/Request"

// GET all requests or filter by status
export async function GET(request: Request) {
  try {

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const userId = searchParams.get("userId")

    const query: any = {}
    if (status) query.status = status
    if (userId) query.userId = userId

    const requests = await Request.find(query).sort({ requestDate: -1 })

    return NextResponse.json({ success: true, requests })
  } catch (error: any) {
    console.error("[v0] Error fetching requests:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// POST create new request
export async function POST(request: Request) {
  try {

    const body = await request.json()
    const { userId, userName, userEmail, itemId, itemName, itemCode } = body

    if (!userId || !userName || !userEmail || !itemId || !itemName || !itemCode) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const newRequest = await Request.create({
      userId,
      userName,
      userEmail,
      itemId,
      itemName,
      itemCode,
      status: "pending",
    })

    return NextResponse.json({ success: true, request: newRequest }, { status: 201 })
  } catch (error: any) {
    console.error("[v0] Error creating request:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
