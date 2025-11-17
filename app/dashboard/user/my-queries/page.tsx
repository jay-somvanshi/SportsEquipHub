"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, CheckCircle2, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface UserQuery {
  _id: string
  userId: string
  query: string
  response?: string
  status: "pending" | "resolved"
  createdAt: string
  resolvedAt?: string
}

export default function MyQueriesPage() {
  const [queries, setQueries] = useState<UserQuery[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      const user = JSON.parse(storedUser)
      setUserId(user.id)
      fetchQueries(user.id)
    }
  }, [])

  const fetchQueries = async (id: string) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/user-queries?userId=${id}`)
      if (!response.ok) throw new Error("Failed to fetch queries")

      const data = await response.json()
      setQueries(data)
    } catch (error) {
      console.error("Error fetching queries:", error)
      toast({
        title: "Error",
        description: "Failed to fetch your queries",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const pendingCount = queries.filter((q) => q.status === "pending").length
  const resolvedCount = queries.filter((q) => q.status === "resolved").length

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <MessageSquare className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">My Queries</h1>
          </div>
          <p className="text-muted-foreground">Track your submitted questions and admin responses</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Card className="bg-card border-border/50 hover:border-primary/50 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Pending</p>
                  <p className="text-3xl font-bold text-primary mt-1">{pendingCount}</p>
                </div>
                <Clock className="h-10 w-10 text-primary/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50 hover:border-accent/50 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Resolved</p>
                  <p className="text-3xl font-bold text-accent mt-1">{resolvedCount}</p>
                </div>
                <CheckCircle2 className="h-10 w-10 text-accent/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Queries List */}
        <div className="space-y-4">
          {isLoading ? (
            <Card className="bg-card border-border/50">
              <CardContent className="p-8 text-center text-muted-foreground">Loading your queries...</CardContent>
            </Card>
          ) : queries.length === 0 ? (
            <Card className="bg-card border-border/50">
              <CardContent className="p-12 text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No queries yet</p>
                <p className="text-sm text-muted-foreground">
                  Use the chat assistant to ask questions and submit queries
                </p>
              </CardContent>
            </Card>
          ) : (
            queries.map((query) => (
              <Card
                key={query._id}
                className={`bg-card border-border/50 overflow-hidden transition-all hover:border-primary/50 ${
                  query.status === "pending" ? "border-l-4 border-l-primary" : "border-l-4 border-l-accent"
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-foreground">Your Query</h3>
                        <Badge variant={query.status === "pending" ? "outline" : "default"}>
                          {query.status === "pending" ? "Awaiting Response" : "Resolved"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(query.createdAt).toLocaleDateString()} at{" "}
                        {new Date(query.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* User Query */}
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Your Question:</p>
                    <p className="text-foreground">{query.query}</p>
                  </div>

                  {/* Admin Response */}
                  {query.response && (
                    <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
                      <p className="text-sm font-medium text-accent mb-1">Admin Response:</p>
                      <p className="text-foreground">{query.response}</p>
                      {query.resolvedAt && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Answered on {new Date(query.resolvedAt).toLocaleDateString()} at{" "}
                          {new Date(query.resolvedAt).toLocaleTimeString()}
                        </p>
                      )}
                    </div>
                  )}

                  {query.status === "pending" && (
                    <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                      <p className="text-sm text-primary font-medium">
                        Your query is being reviewed by an admin. Please check back soon for a response.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
