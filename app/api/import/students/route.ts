import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongoose"
import User from "@/models/User"

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
    console.log("[v0] Starting student import")

    try {
      await connectDB()
      console.log("[v0] Database connected successfully")
    } catch (dbError) {
      console.error("[v0] Database connection failed:", dbError)
      return NextResponse.json({ error: "Database connection failed. Please try again." }, { status: 500 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    console.log("[v0] File received:", file.name, "Size:", file.size)

    const text = await file.text()
    console.log("[v0] File text length:", text.length)

    const lines = text
      .trim()
      .split("\n")
      .filter((line) => line.trim())

    if (lines.length < 2) {
      return NextResponse.json({ error: "CSV file is empty" }, { status: 400 })
    }

    const headers = parseCSVLine(lines[0]).map((h) => h.toLowerCase())
    console.log("[v0] Headers found:", headers)

    const expectedHeaders = ["name", "email", "password", "role"]

    if (!expectedHeaders.every((h) => headers.includes(h))) {
      return NextResponse.json({ error: `CSV must have columns: ${expectedHeaders.join(", ")}` }, { status: 400 })
    }

    const nameIndex = headers.indexOf("name")
    const emailIndex = headers.indexOf("email")
    const passwordIndex = headers.indexOf("password")
    const roleIndex = headers.indexOf("role")

    const studentsToImport = []
    const errors = []

    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i])

      if (values.length < 4) {
        errors.push(`Row ${i + 1}: Not enough columns`)
        continue
      }

      const name = values[nameIndex]?.trim()
      const email = values[emailIndex]?.trim()
      const password = values[passwordIndex]?.trim()
      const role = values[roleIndex]?.trim()

      if (!name || !email || !password || !role) {
        errors.push(`Row ${i + 1}: Missing required fields`)
        continue
      }

      if (password.length < 6) {
        errors.push(`Row ${i + 1}: Password must be at least 6 characters`)
        continue
      }

      if (!["user", "admin"].includes(role.toLowerCase())) {
        errors.push(`Row ${i + 1}: Role must be 'user' or 'admin'`)
        continue
      }

      studentsToImport.push({
        name,
        email: email.toLowerCase(),
        password,
        role: role.toLowerCase(),
        isActive: true,
      })
    }

    console.log("[v0] Students to import:", studentsToImport.length)

    if (studentsToImport.length === 0) {
      return NextResponse.json(
        { error: errors.length > 0 ? errors[0] : "No valid students to import" },
        { status: 400 },
      )
    }

    // Check for duplicate emails
    try {
      const existingEmails = await User.find({
        email: { $in: studentsToImport.map((s) => s.email) },
      })

      if (existingEmails.length > 0) {
        return NextResponse.json({ error: `Email already exists: ${existingEmails[0].email}` }, { status: 400 })
      }
    } catch (queryError) {
      console.error("[v0] Query error:", queryError)
      return NextResponse.json({ error: "Failed to check existing emails" }, { status: 500 })
    }

    // Import students
    try {
      const result = await User.insertMany(studentsToImport)
      console.log("[v0] Successfully imported students:", result.length)

      return NextResponse.json({
        success: true,
        count: result.length,
        message: `Successfully imported ${result.length} students`,
      })
    } catch (insertError) {
      console.error("[v0] Insert error:", insertError)
      return NextResponse.json({ error: "Failed to insert students into database" }, { status: 500 })
    }
  } catch (error) {
    console.error("[v0] Unexpected error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unexpected error occurred" },
      { status: 500 },
    )
  }
}
