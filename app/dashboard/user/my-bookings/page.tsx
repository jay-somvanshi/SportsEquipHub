"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Package, ArrowLeft, Calendar, Tag } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { getSession, clearSession } from "@/lib/auth"

interface Request {
  _id: string
  itemName: string
  itemCode: string
  status: string
  requestDate: string
}

export default function MyBookingsPage() {
  const router = useRouter()
  const [requests, setRequests] = useState<Request[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const session = getSession()
    if (!session || session.user.role !== "user") {
      clearSession()
      router.replace("/login/user")
      return
    }
    fetchRequests(session.user.id)
  }, [router])

  const fetchRequests = async (userId: string) => {
    try {
      const response = await fetch(`/api/requests?userId=${userId}`)
      const data = await response.json()
      setRequests(data.requests || [])
      setIsLoading(false)
    } catch (error) {
      console.error("Error fetching requests:", error)
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      approved: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      declined: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      issued: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      submitted: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    }
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
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
              <h1 className="text-2xl font-bold text-foreground">My Bookings</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {requests.length === 0 ? (
          <Card className="bg-card border-border p-8 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No bookings yet. Start by requesting an item!</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {requests.map((request) => (
              <Card key={request._id} className="bg-card border-border p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-card-foreground mb-3">{request.itemName}</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Tag className="h-4 w-4" />
                        <span>Code: {request.itemCode}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(request.requestDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusBadge(request.status)}`}
                  >
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
