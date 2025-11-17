"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface AddItemModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AddItemModal({ isOpen, onClose }: AddItemModalProps) {
  const [formData, setFormData] = useState({
    itemName: "",
    itemQuantity: "",
    sportsName: "",
    itemCode: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/items/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemName: formData.itemName,
          itemQuantity: Number.parseInt(formData.itemQuantity),
          sportsName: formData.sportsName,
          itemCode: formData.itemCode,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to add item")
      }

      setSuccess("Item added successfully!")
      setFormData({
        itemName: "",
        itemQuantity: "",
        sportsName: "",
        itemCode: "",
      })

      setTimeout(() => {
        setSuccess("")
        onClose()
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({
      itemName: "",
      itemQuantity: "",
      sportsName: "",
      itemCode: "",
    })
    setError("")
    setSuccess("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-card border-border sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-card-foreground">Add New Item</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Add a new sports instrument to the inventory
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="itemName" className="text-card-foreground">
              Item Name
            </Label>
            <Input
              id="itemName"
              type="text"
              placeholder="e.g., Basketball"
              value={formData.itemName}
              onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
              required
              className="bg-background border-border text-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="itemQuantity" className="text-card-foreground">
              Item Quantity
            </Label>
            <Input
              id="itemQuantity"
              type="number"
              min="0"
              placeholder="e.g., 50"
              value={formData.itemQuantity}
              onChange={(e) => setFormData({ ...formData, itemQuantity: e.target.value })}
              required
              className="bg-background border-border text-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sportsName" className="text-card-foreground">
              Sports Name
            </Label>
            <Input
              id="sportsName"
              type="text"
              placeholder="e.g., Basketball"
              value={formData.sportsName}
              onChange={(e) => setFormData({ ...formData, sportsName: e.target.value })}
              required
              className="bg-background border-border text-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="itemCode" className="text-card-foreground">
              Item Unique Code
            </Label>
            <Input
              id="itemCode"
              type="text"
              placeholder="e.g., BB-001"
              value={formData.itemCode}
              onChange={(e) => setFormData({ ...formData, itemCode: e.target.value })}
              required
              className="bg-background border-border text-foreground"
            />
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-2 rounded-md text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-2 rounded-md text-sm">
              {success}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isLoading ? "Adding..." : "Add Item"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 bg-transparent"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
