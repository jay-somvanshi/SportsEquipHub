import mongoose, { Schema, type Document } from "mongoose"

export interface IRequest extends Document {
  userId: string
  userName: string
  userEmail: string
  itemId: string
  itemName: string
  itemCode: string
  status: "pending" | "approved" | "declined" | "issued" | "submitted"
  requestDate: Date
  updatedAt: Date
}

const RequestSchema = new Schema<IRequest>({
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
  itemId: {
    type: String,
    required: true,
  },
  itemName: {
    type: String,
    required: true,
  },
  itemCode: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "declined", "issued", "submitted"],
    default: "pending",
  },
  requestDate: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.models.Request || mongoose.model<IRequest>("Request", RequestSchema)
