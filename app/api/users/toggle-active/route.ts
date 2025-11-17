import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongoose"
import User from "@/models/User"

export async function POST(request: NextRequest) {
  try {
    const { userId, isActive } = await request.json()

    console.log("[v0] Toggle active request:", { userId, isActive })

    if (!userId || typeof isActive !== "boolean") {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
    const existingUser = await User.findById(userId)

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // If isActive field doesn't exist, initialize it
    if (existingUser.isActive === undefined) {
      existingUser.isActive = true
      await existingUser.save()
    }

    // Now update the isActive status
    existingUser.isActive = isActive
    await existingUser.save()

    console.log("[v0] User status updated:", {
      userId: existingUser._id,
      newStatus: existingUser.isActive,
    })

    return NextResponse.json(
      {
        message: "User status updated successfully",
        user: {
          id: existingUser._id,
          email: existingUser.email,
          name: existingUser.name,
          role: existingUser.role,
          isActive: existingUser.isActive,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[v0] Error toggling user status:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
