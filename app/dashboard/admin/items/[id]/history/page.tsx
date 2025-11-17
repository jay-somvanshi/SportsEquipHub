"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Loader2, Calendar, Mail } from "lucide-react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { getSession, clearSession } from "@/lib/auth"

interface RequestHistory {
  _id: string
  userName: string
  userEmail: string
  status: string
  createdAt: string
  updatedAt: string
}

export default function ItemHistoryPage() {
  const router = useRouter()
  const params = useParams()
  const itemId = params.id as string
  const [history, setHistory] = useState<RequestHistory[]>([])
  const [itemName, setItemName] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const session = getSession()
    if (!session || session.user.role !== "admin") {
      clearSession()
      router.replace("/login/admin")
      return
    }
    fetchHistory()
  }, [router, itemId])

  const fetchHistory = async () => {
    try {
      const response = await fetch(`/api/items/${itemId}/history`)
      const data = await response.json()
      setHistory(data.requests || [])
      setItemName(data.itemName || "")
      setIsLoading(false)
    } catch (error) {
      console.error("Error fetching history:", error)
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "approved":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "issued":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "submitted":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "declined":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard/admin/items">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Item History: {itemName}</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {history.length === 0 ? (
          <Card className="bg-card border-border p-8 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No request history for this item</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {history.map((record) => (
              <Card key={record._id} className="bg-card border-border hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-card-foreground mb-3">{record.userName}</h3>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          <span>{record.userEmail}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>Requested: {new Date(record.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>Updated: {new Date(record.updatedAt).toLocaleDateString()}</span>
                        </div>
                        <div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}
                          >
                            {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
