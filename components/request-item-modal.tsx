"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Item {
  _id: string
  itemName: string
  itemQuantity: number
  sportsName: string
  itemCode: string
  isActive: boolean
}

interface RequestItemModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  userName: string
  userEmail: string
}

export function RequestItemModal({ isOpen, onClose, userId, userName, userEmail }: RequestItemModalProps) {
  const [items, setItems] = useState<Item[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [requestingItemId, setRequestingItemId] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (isOpen) {
      fetchItems()
    }
  }, [isOpen])

  const fetchItems = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/items")
      const data = await response.json()
      console.log("[v0] Fetched items:", data)
      const activeItems = (data.items || []).filter((item: Item) => item.isActive)
      console.log("[v0] Active items after filter:", activeItems)
      setItems(activeItems)
    } catch (error) {
      console.error("Error fetching items:", error)
      toast({
        title: "Error",
        description: "Failed to load items",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRequestItem = async (item: Item) => {
    setRequestingItemId(item._id)
    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          userName,
          userEmail,
          itemId: item._id,
          itemName: item.itemName,
          itemCode: item.itemCode,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Request raised successfully!",
        })
        onClose()
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to submit request",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error requesting item:", error)
      toast({
        title: "Error",
        description: "Failed to submit request",
        variant: "destructive",
      })
    } finally {
      setRequestingItemId(null)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Request Item</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No items available</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {items.map((item) => (
              <Card key={item._id} className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    {item.itemName}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Sport:</span> {item.sportsName}
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Code:</span> {item.itemCode}
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Available:</span> {item.itemQuantity}
                  </div>
                  <Button
                    onClick={() => handleRequestItem(item)}
                    disabled={requestingItemId === item._id || item.itemQuantity === 0}
                    className="w-full mt-2"
                  >
                    {requestingItemId === item._id ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Requesting...
                      </>
                    ) : (
                      "Request Item"
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
