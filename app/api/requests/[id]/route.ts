import { NextResponse } from "next/server"
import connectDB from "@/lib/mongoose"
import Request from "@/models/Request"
import Item from "@/models/Item"

// PUT update request status
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {

    const { id } = params
    const body = await request.json()
    const { status } = body

    if (!status || !["pending", "approved", "declined", "issued", "submitted"].includes(status)) {
      return NextResponse.json({ success: false, error: "Invalid status" }, { status: 400 })
    }

    const currentRequest = await Request.findById(id)
    if (!currentRequest) {
      return NextResponse.json({ success: false, error: "Request not found" }, { status: 404 })
    }

    const previousStatus = currentRequest.status

    const updatedRequest = await Request.findByIdAndUpdate(id, { status, updatedAt: new Date() }, { new: true })

    if (status === "issued" && previousStatus !== "issued") {
      // Decrease quantity only when transitioning TO issued
      console.log("[v0] Decreasing quantity for item:", updatedRequest.itemId)
      await Item.findByIdAndUpdate(updatedRequest.itemId, { $inc: { itemQuantity: -1 } })
    } else if (status === "submitted" && previousStatus === "issued") {
      // Increase quantity when transitioning FROM issued TO submitted
      console.log("[v0] Increasing quantity for item:", updatedRequest.itemId)
      await Item.findByIdAndUpdate(updatedRequest.itemId, { $inc: { itemQuantity: 1 } })
    } else if (previousStatus === "issued" && status !== "issued" && status !== "submitted") {
      // If we're moving away from issued (except to submitted), increase quantity back
      console.log("[v0] Reverting quantity decrease for item:", updatedRequest.itemId)
      await Item.findByIdAndUpdate(updatedRequest.itemId, { $inc: { itemQuantity: 1 } })
    }

    return NextResponse.json({ success: true, request: updatedRequest })
  } catch (error: any) {
    console.error("[v0] Error updating request:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// DELETE request
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {

    const { id } = params
    const deletedRequest = await Request.findByIdAndDelete(id)

    if (!deletedRequest) {
      return NextResponse.json({ success: false, error: "Request not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Request deleted successfully" })
  } catch (error: any) {
    console.error("[v0] Error deleting request:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
