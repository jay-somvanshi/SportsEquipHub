"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ArrowLeft, Pencil, Trash2, Eye, EyeOff, History } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { getSession, clearSession } from "@/lib/auth"
import { EditItemModal } from "@/components/edit-item-modal"
import { useToast } from "@/hooks/use-toast"

interface Item {
  _id: string
  itemName: string
  itemQuantity: number
  sportsName: string
  itemCode: string
  isActive: boolean
}

export default function ItemsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [items, setItems] = useState<Item[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingItem, setEditingItem] = useState<Item | null>(null)

  useEffect(() => {
    const session = getSession()
    if (!session || session.user.role !== "admin") {
      clearSession()
      router.replace("/login/admin")
      return
    }
    fetchItems()
  }, [router])

  const fetchItems = async () => {
    try {
      const response = await fetch("/api/items")
      const data = await response.json()
      setItems(data.items || [])
      setIsLoading(false)
    } catch (error) {
      console.error("Error fetching items:", error)
      setIsLoading(false)
    }
  }

  const handleDelete = async (itemId: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return

    try {
      const response = await fetch(`/api/items/${itemId}`, { method: "DELETE" })
      if (response.ok) {
        fetchItems()
        toast({
          title: "Success",
          description: "Item deleted successfully",
        })
      }
    } catch (error) {
      console.error("Error deleting item:", error)
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      })
    }
  }

  const handleToggleActive = async (itemId: string, currentStatus: boolean) => {
    try {
      const response = await fetch("/api/items/toggle-active", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, isActive: !currentStatus }),
      })

      if (response.ok) {
        fetchItems()
        toast({
          title: "Success",
          description: `Item ${!currentStatus ? "enabled" : "disabled"} successfully`,
        })
      }
    } catch (error) {
      console.error("Error toggling item status:", error)
      toast({
        title: "Error",
        description: "Failed to update item status",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/admin">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Package className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">All Items</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {items.length === 0 ? (
          <Card className="bg-card border-border p-8 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No items found</p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <Card key={item._id} className="bg-card border-border hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Package className="h-5 w-5 text-primary" />
                    {item.itemName}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground font-medium">Sport:</span>
                      <p className="text-card-foreground mt-1">{item.sportsName}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground font-medium">Code:</span>
                      <p className="text-card-foreground mt-1">{item.itemCode}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground font-medium">Quantity:</span>
                      <p className="text-card-foreground mt-1">{item.itemQuantity} units</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground font-medium">Status:</span>
                      <p className="mt-1">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.isActive
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          }`}
                        >
                          {item.isActive ? "Active" : "Deactive"}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-4">
                    <Link href={`/dashboard/admin/items/${item._id}/history`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        <History className="h-4 w-4 mr-1" />
                        History
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" onClick={() => setEditingItem(item)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleToggleActive(item._id, item.isActive)}>
                      {item.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(item._id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

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
    </div>
  )
}
