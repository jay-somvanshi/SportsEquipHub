import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongoose"
import User from "@/models/User"

export async function POST(request: NextRequest) {
  try {
    const { userId, role } = await request.json()

    if (!userId || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    await connectDB()

    // Check if user exists in database
    const user = await User.findById(userId)

    if (!user) {
      return NextResponse.json({ error: "User not found in database" }, { status: 404 })
    }

    // Verify role matches
    if (user.role !== role) {
      return NextResponse.json({ error: "Role mismatch" }, { status: 403 })
    }

    return NextResponse.json(
      {
        valid: true,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[v0] Session verification error:", error)
    return NextResponse.json({ error: "Service temporarily unavailable" }, { status: 503 })
  }
}
