"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, CheckCircle2, Clock, Send } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface UserQuery {
  _id: string
  userId: string
  userName: string
  userEmail: string
  query: string
  response?: string
  status: "pending" | "resolved"
  createdAt: string
  resolvedAt?: string
}

export default function UserQueriesPage() {
  const [queries, setQueries] = useState<UserQuery[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "pending" | "resolved">("all")
  const [selectedQuery, setSelectedQuery] = useState<UserQuery | null>(null)
  const [responseText, setResponseText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchQueries()
  }, [filter])

  const fetchQueries = async () => {
    try {
      setIsLoading(true)
      const url = filter === "all" ? "/api/admin/user-queries" : `/api/admin/user-queries?status=${filter}`

      const response = await fetch(url)
      if (!response.ok) throw new Error("Failed to fetch queries")

      const data = await response.json()
      setQueries(data)
    } catch (error) {
      console.error("Error fetching queries:", error)
      toast({
        title: "Error",
        description: "Failed to fetch user queries",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitResponse = async () => {
    if (!selectedQuery || !responseText.trim()) {
      toast({
        title: "Error",
        description: "Please enter a response",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      const response = await fetch("/api/admin/user-queries", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          queryId: selectedQuery._id,
          response: responseText,
        }),
      })

      if (!response.ok) throw new Error("Failed to submit response")

      const updatedQuery = await response.json()

      setQueries(queries.map((q) => (q._id === updatedQuery._id ? updatedQuery : q)))
      setSelectedQuery(null)
      setResponseText("")

      toast({
        title: "Success",
        description: "Response sent to user",
      })
    } catch (error) {
      console.error("Error submitting response:", error)
      toast({
        title: "Error",
        description: "Failed to send response",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const pendingCount = queries.filter((q) => q.status === "pending").length
  const resolvedCount = queries.filter((q) => q.status === "resolved").length

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <MessageSquare className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">User Queries</h1>
          </div>
          <p className="text-muted-foreground">Manage and respond to user inquiries</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Card className="bg-card border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Pending Queries</p>
                  <p className="text-3xl font-bold text-primary mt-1">{pendingCount}</p>
                </div>
                <Clock className="h-10 w-10 text-primary/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Resolved Queries</p>
                  <p className="text-3xl font-bold text-accent mt-1">{resolvedCount}</p>
                </div>
                <CheckCircle2 className="h-10 w-10 text-accent/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6">
          {(["all", "pending", "resolved"] as const).map((status) => (
            <Button
              key={status}
              onClick={() => setFilter(status)}
              variant={filter === status ? "default" : "outline"}
              className="capitalize"
            >
              {status}
            </Button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Queries List */}
          <div className="lg:col-span-1">
            <Card className="bg-card border-border/50">
              <CardHeader>
                <CardTitle>Queries</CardTitle>
              </CardHeader>
              <CardContent className="max-h-[600px] overflow-y-auto space-y-2">
                {isLoading ? (
                  <p className="text-muted-foreground">Loading...</p>
                ) : queries.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No queries found</p>
                ) : (
                  queries.map((query) => (
                    <button
                      key={query._id}
                      onClick={() => setSelectedQuery(query)}
                      className={`w-full p-3 rounded-lg text-left transition-all border ${
                        selectedQuery?._id === query._id
                          ? "bg-primary/10 border-primary"
                          : "bg-muted/50 border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-sm text-foreground truncate">{query.userName}</p>
                        <Badge variant={query.status === "pending" ? "outline" : "default"}>{query.status}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{query.userEmail}</p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{query.query}</p>
                    </button>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Query Details and Response */}
          <div className="lg:col-span-2">
            {selectedQuery ? (
              <div className="space-y-6">
                {/* Query Details */}
                <Card className="bg-card border-border/50">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Query Details</CardTitle>
                      <Badge variant={selectedQuery.status === "pending" ? "outline" : "default"}>
                        {selectedQuery.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-muted-foreground">User Name</label>
                      <p className="text-foreground mt-1">{selectedQuery.userName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-muted-foreground">User Email</label>
                      <p className="text-foreground mt-1">{selectedQuery.userEmail}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-muted-foreground">Query</label>
                      <p className="text-foreground mt-1 p-3 bg-muted/50 rounded-lg">{selectedQuery.query}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-muted-foreground">Submitted</label>
                      <p className="text-foreground mt-1">{new Date(selectedQuery.createdAt).toLocaleString()}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Response Section */}
                {selectedQuery.status === "resolved" ? (
                  <Card className="bg-card border-border/50 border-accent/50">
                    <CardHeader>
                      <CardTitle className="text-accent">Response Sent</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-foreground p-3 bg-accent/10 rounded-lg">{selectedQuery.response}</p>
                      <p className="text-sm text-muted-foreground">
                        Resolved on {new Date(selectedQuery.resolvedAt || "").toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="bg-card border-border/50">
                    <CardHeader>
                      <CardTitle>Send Response</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Textarea
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                        placeholder="Type your response here..."
                        className="min-h-[120px]"
                      />
                      <Button
                        onClick={handleSubmitResponse}
                        disabled={isSubmitting}
                        className="w-full bg-primary hover:bg-primary/90"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Send Response
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <Card className="bg-card border-border/50">
                <CardContent className="p-12 text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground">Select a query to view details and respond</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
