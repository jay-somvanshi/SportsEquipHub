"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ArrowLeft, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { getSession, clearSession } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"

interface Item {
  _id: string
  itemName: string
  itemQuantity: number
  sportsName: string
  itemCode: string
  isActive: boolean
}

export default function RequestItemPage() {
  const router = useRouter()
  const [items, setItems] = useState<Item[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [requestingItemId, setRequestingItemId] = useState<string | null>(null)
  const [session, setSession] = useState<any>(null)
  const { toast } = useToast()

  useEffect(() => {
    const currentSession = getSession()
    if (!currentSession || currentSession.user.role !== "user") {
      clearSession()
      router.replace("/login/user")
      return
    }
    setSession(currentSession)
    fetchItems()
  }, [router])

  const fetchItems = async () => {
    try {
      const response = await fetch("/api/items")
      const data = await response.json()
      const activeItems = (data.items || []).filter((item: Item) => item.isActive)
      setItems(activeItems)
      setIsLoading(false)
    } catch (error) {
      console.error("Error fetching items:", error)
      setIsLoading(false)
    }
  }

  const handleRequest = async (item: Item) => {
    if (!session) return

    setRequestingItemId(item._id)
    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.user.id,
          userName: session.user.name,
          userEmail: session.user.email,
          itemId: item._id,
          itemName: item.itemName,
          itemCode: item.itemCode,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Request submitted successfully!",
        })
        router.push("/dashboard/user/my-bookings")
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to submit request",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error submitting request:", error)
      toast({
        title: "Error",
        description: "Failed to submit request",
        variant: "destructive",
      })
    } finally {
      setRequestingItemId(null)
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
            <Link href="/dashboard/user">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Package className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Request Item</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {items.length === 0 ? (
          <Card className="bg-card border-border p-8 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No items available at the moment</p>
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
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="text-muted-foreground font-medium">Sport:</span>
                      <p className="text-card-foreground mt-1">{item.sportsName}</p>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground font-medium">Code:</span>
                      <p className="text-card-foreground mt-1">{item.itemCode}</p>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground font-medium">Available:</span>
                      <p className="text-card-foreground mt-1">{item.itemQuantity} units</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleRequest(item)}
                    disabled={requestingItemId === item._id || item.itemQuantity === 0}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {requestingItemId === item._id ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Requesting...
                      </>
                    ) : item.itemQuantity === 0 ? (
                      "Out of Stock"
                    ) : (
                      "Request Item"
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
