import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongoose"
import User from "@/models/User"

export async function GET(request: NextRequest) {
  try {

    const users = await User.find({}).select("-password").sort({ createdAt: -1 })

    const usersWithActiveStatus = users.map((user) => ({
      ...user.toObject(),
      isActive: user.isActive ?? true, // Set to true if undefined
    }))

    return NextResponse.json({ users: usersWithActiveStatus }, { status: 200 })
  } catch (error) {
    console.error("[v0] Fetch users error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
