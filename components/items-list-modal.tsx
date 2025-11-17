"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import { EditItemModal } from "./edit-item-modal"

interface Item {
  _id: string
  itemName: string
  itemQuantity: number
  sportsName: string
  itemCode: string
  createdAt: string
}

interface ItemsListModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ItemsListModal({ isOpen, onClose }: ItemsListModalProps) {
  const [items, setItems] = useState<Item[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [editingItem, setEditingItem] = useState<Item | null>(null)

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
      setItems(data.items)
    } catch (error) {
      console.error("Error fetching items:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return

    try {
      const response = await fetch(`/api/items/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchItems()
      }
    } catch (error) {
      console.error("Error deleting item:", error)
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>All Items</DialogTitle>
          </DialogHeader>

          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item._id} className="border border-border rounded-lg p-4 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-semibold text-foreground">
                      {item.itemName} (Code: {item.itemCode})
                    </div>
                    <div className="text-sm text-muted-foreground">Sport: {item.sportsName}</div>
                    <div className="text-sm text-muted-foreground">Quantity: {item.itemQuantity}</div>
                    <div className="text-xs text-muted-foreground">
                      Created: {new Date(item.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setEditingItem(item)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(item._id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {editingItem && (
        <EditItemModal
          isOpen={!!editingItem}
          onClose={() => {
            setEditingItem(null)
            fetchItems()
          }}
          item={editingItem}
        />
      )}
    </>
  )
}
