import mongoose, { Schema, type Document } from "mongoose"

export interface IUserQuery extends Document {
  userId: string
  userName: string
  userEmail: string
  query: string
  response?: string
  status: "pending" | "resolved"
  createdAt: Date
  resolvedAt?: Date
}

const UserQuerySchema = new Schema<IUserQuery>({
  userId: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  query: {
    type: String,
    required: true,
  },
  response: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    enum: ["pending", "resolved"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resolvedAt: {
    type: Date,
    default: null,
  },
})

export default mongoose.models.UserQuery || mongoose.model<IUserQuery>("UserQuery", UserQuerySchema)
