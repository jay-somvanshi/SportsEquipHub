import connectDB from "@/lib/mongoose"
import Request from "@/models/Request"
import Item from "@/models/Item"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {

    const itemId = params.id
    const item = await Item.findById(itemId)
    const requests = await Request.find({ itemId }).sort({ updatedAt: -1 })

    return Response.json({
      requests: requests || [],
      itemName: item?.itemName || "Unknown Item",
    })
  } catch (error) {
    console.error("Error fetching item history:", error)
    return Response.json({ error: "Failed to fetch history", requests: [], itemName: "" }, { status: 500 })
  }
}
