import mongoose from "mongoose"

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your MongoDB URI to environment variables")
}

const MONGODB_URI = process.env.MONGODB_URI

async function connectDB() {
  // Disconnect any existing connections to ensure fresh connection
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect()
  }

  try {
    // Connect with strict options - no buffering, fail fast
    await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, // Fail fast if database doesn't exist
      connectTimeoutMS: 5000,
    })

    // Verify the connection is actually established
    if (mongoose.connection.readyState !== 1) {
      throw new Error("Database connection failed - database may not exist")
    }

    const databaseName = mongoose.connection.db?.databaseName || "unknown"
    console.log("[v0] Connected to database:", databaseName)
    return mongoose
  } catch (error) {
    console.error("[v0] Database connection error:", error)
    throw new Error("Failed to connect to database - ensure MongoDB is running and database exists")
  }
}

export { connectDB }
export default connectDB
