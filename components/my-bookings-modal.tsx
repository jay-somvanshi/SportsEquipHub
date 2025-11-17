"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"

interface Request {
  _id: string
  itemName: string
  itemCode: string
  status: string
  requestDate: string
}

interface MyBookingsModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
}

export function MyBookingsModal({ isOpen, onClose, userId }: MyBookingsModalProps) {
  const [requests, setRequests] = useState<Request[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      fetchRequests()
    }
  }, [isOpen])

  const fetchRequests = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/requests?userId=${userId}`)
      const data = await response.json()
      setRequests(data.requests || [])
    } catch (error) {
      console.error("Error fetching requests:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500"
      case "approved":
        return "bg-blue-500"
      case "declined":
        return "bg-red-500"
      case "issued":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>My Bookings</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No requests found</div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div key={request._id} className="border border-border rounded-lg p-4 bg-card">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg">{request.itemName}</h3>
                  <Badge className={getStatusColor(request.status)}>{request.status.toUpperCase()}</Badge>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>Code: {request.itemCode}</div>
                  <div>Requested: {new Date(request.requestDate).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
