import mongoose, { Schema, type Document } from "mongoose"

export interface IItem extends Document {
  itemName: string
  itemQuantity: number
  sportsName: string
  itemCode: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const ItemSchema = new Schema<IItem>({
  itemName: {
    type: String,
    required: true,
  },
  itemQuantity: {
    type: Number,
    required: true,
    min: 0,
  },
  sportsName: {
    type: String,
    required: true,
  },
  itemCode: {
    type: String,
    required: true,
    unique: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.models.Item || mongoose.model<IItem>("Item", ItemSchema)
