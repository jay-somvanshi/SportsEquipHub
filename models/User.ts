import mongoose, { Schema, type Document } from "mongoose"

export interface IUser extends Document {
  email: string
  password: string
  name: string
  role: "admin" | "user"
  isActive: boolean
  createdAt: Date
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    required: [true, "Role is required"],
  },
  isActive: {
    type: Boolean,
    default: true,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// UserSchema.index({ email: 1 })

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema)
