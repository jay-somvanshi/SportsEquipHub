"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface HistoryRecord {
  _id: string
  userName: string
  userEmail: string
  status: string
  requestDate: string
  updatedAt: string
}

interface ItemHistoryModalProps {
  isOpen: boolean
  onClose: () => void
  itemId: string
  itemName: string
}

export function ItemHistoryModal({ isOpen, onClose, itemId, itemName }: ItemHistoryModalProps) {
  const [history, setHistory] = useState<HistoryRecord[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      fetchHistory()
    }
  }, [isOpen])

  const fetchHistory = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/items/${itemId}/history`)
      const data = await response.json()
      setHistory(data.history || [])
    } catch (error) {
      console.error("Error fetching history:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-blue-100 text-blue-800"
      case "declined":
        return "bg-red-100 text-red-800"
      case "issued":
        return "bg-purple-100 text-purple-800"
      case "submitted":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Item History - {itemName}</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">Loading history...</div>
          </div>
        ) : history.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">No history found for this item</div>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((record) => (
              <div key={record._id} className="border border-border rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">User Name</p>
                    <p className="text-sm font-medium text-foreground">{record.userName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">User Email</p>
                    <p className="text-sm font-medium text-foreground">{record.userEmail}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Status</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}
                    >
                      {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Request Date</p>
                    <p className="text-sm font-medium text-foreground">
                      {new Date(record.requestDate).toLocaleDateString()}{" "}
                      {new Date(record.requestDate).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Last Updated</p>
                    <p className="text-sm font-medium text-foreground">
                      {new Date(record.updatedAt).toLocaleDateString()}{" "}
                      {new Date(record.updatedAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
