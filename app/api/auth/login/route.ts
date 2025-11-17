import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongoose"
import User from "@/models/User"
import { verifyPassword } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password, role } = await request.json()

    if (!email || !password || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    await connectDB()

    console.log("[v0] Login attempt:", { email: email.toLowerCase().trim(), role })

    const user = await User.findOne({ email: email.toLowerCase().trim(), role })
    console.log("[v0] User found:", user ? "Yes" : "No", user ? `(ID: ${user._id}, active: ${user.isActive})` : "")

    if (!user) {
      console.log("[v0] User not found in database")
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    if (!user.isActive) {
      console.log("[v0] User account is deactivated")
      return NextResponse.json({ error: "Account is deactivated. Please contact administrator." }, { status: 403 })
    }

    // Verify password
    console.log("[v0] Password hash stored:", user.password ? `${user.password.substring(0, 20)}...` : "EMPTY")
    console.log("[v0] Password provided:", password.substring(0, 5) + "*".repeat(Math.max(0, password.length - 5)))

    const isValid = await verifyPassword(password, user.password)
    console.log("[v0] Password verification result:", isValid)

    if (!isValid) {
      console.log("[v0] Password mismatch")
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    console.log("[v0] Login successful for user:", user.email)

    // Return user data (excluding password)
    return NextResponse.json(
      {
        message: "Login successful",
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
    console.error("[v0] Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
