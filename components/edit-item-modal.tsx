"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Item {
  _id: string
  itemName: string
  itemQuantity: number
  sportsName: string
  itemCode: string
}

interface EditItemModalProps {
  isOpen: boolean
  onClose: () => void
  item: Item
}

export function EditItemModal({ isOpen, onClose, item }: EditItemModalProps) {
  const [formData, setFormData] = useState({
    itemName: item.itemName,
    itemQuantity: item.itemQuantity,
    sportsName: item.sportsName,
    itemCode: item.itemCode,
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`/api/items/${item._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        onClose()
      }
    } catch (error) {
      console.error("Error updating item:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Item</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="itemName">Item Name</Label>
            <Input
              id="itemName"
              value={formData.itemName}
              onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="sportsName">Sports Name</Label>
            <Input
              id="sportsName"
              value={formData.sportsName}
              onChange={(e) => setFormData({ ...formData, sportsName: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="itemQuantity">Quantity</Label>
            <Input
              id="itemQuantity"
              type="number"
              value={formData.itemQuantity}
              onChange={(e) => setFormData({ ...formData, itemQuantity: Number.parseInt(e.target.value) })}
              required
            />
          </div>

          <div>
            <Label htmlFor="itemCode">Item Code</Label>
            <Input
              id="itemCode"
              value={formData.itemCode}
              onChange={(e) => setFormData({ ...formData, itemCode: e.target.value })}
              required
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
