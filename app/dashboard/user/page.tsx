"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Clock, ArrowRight, Zap, TrendingUp, Gift, MessageSquare } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { getSession, clearSession, type Session } from "@/lib/auth"
import { RequestItemModal } from "@/components/request-item-modal"

export default function UserDashboard() {
  const router = useRouter()
  const [session, setSessionState] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false)
  const [totalItems, setTotalItems] = useState(0)
  const [myBookingsCount, setMyBookingsCount] = useState(0)

  useEffect(() => {
    const verifySession = async () => {
      const currentSession = getSession()

      if (!currentSession || currentSession.user.role !== "user") {
        clearSession()
        router.replace("/login/user")
        return
      }

      try {
        const response = await fetch("/api/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: currentSession.user.id,
            role: currentSession.user.role,
          }),
        })

        if (response.status === 401 || response.status === 404 || response.status === 403) {
          console.log("[v0] Session verification failed, clearing session")
          clearSession()
          router.replace("/login/user")
          return
        }

        setSessionState(currentSession)
        fetchCounts(currentSession.user.id)
        setIsLoading(false)
      } catch (error) {
        console.error("[v0] Session verification error:", error)
        if (currentSession) {
          setSessionState(currentSession)
          fetchCounts(currentSession.user.id)
          setIsLoading(false)
        }
      }
    }

    verifySession()
  }, [router])

  const fetchCounts = async (userId: string) => {
    try {
      const [itemsRes, requestsRes] = await Promise.all([fetch("/api/items"), fetch(`/api/requests?userId=${userId}`)])

      const itemsData = await itemsRes.json()
      const requestsData = await requestsRes.json()

      setTotalItems(itemsData.items?.length || 0)
      setMyBookingsCount(requestsData.requests?.length || 0)
    } catch (error) {
      console.error("Error fetching counts:", error)
    }
  }

  const handleLogout = () => {
    clearSession()
    router.replace("/")
  }

  if (isLoading || !session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/40 backdrop-blur-md bg-gradient-to-r from-background to-background/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Package className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                SportGear Pro
              </h1>
              <p className="text-xs text-muted-foreground">Equipment Management</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-medium text-foreground">{session.user.name}</span>
              <span className="text-xs text-muted-foreground">User Account</span>
            </div>
            <Button onClick={handleLogout} variant="outline" size="sm">
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-12 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 border border-primary/20">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Welcome, {session.user.name}! 🎯</h2>
          <p className="text-lg text-muted-foreground">Request and manage your sports equipment with ease</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-card to-card/80 border-border cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Available Items</CardTitle>
              <div className="h-10 w-10 rounded-lg bg-green-500/20 flex items-center justify-center group-hover:bg-green-500/30 transition-colors flex-shrink-0">
                <Package className="h-5 w-5 text-green-500" />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-4xl font-bold text-card-foreground">{totalItems}</div>
              <p className="text-xs text-muted-foreground">Sports equipment available for request</p>
              <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                <TrendingUp className="h-4 w-4" />
                Ready to use
              </div>
            </CardContent>
          </Card>

          <Link href="/dashboard/user/my-bookings">
            <Card className="bg-gradient-to-br from-card to-card/80 border-border cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 group">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">My Bookings</CardTitle>
                <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors flex-shrink-0">
                  <Clock className="h-5 w-5 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-4xl font-bold text-card-foreground">{myBookingsCount}</div>
                <p className="text-xs text-muted-foreground">Active requests and bookings</p>
                <div className="flex items-center gap-2 text-sm text-blue-600 font-medium">
                  <ArrowRight className="h-4 w-4" />
                  View details
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-bold text-foreground">Quick Start</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20 hover:shadow-lg transition-all">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Gift className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-card-foreground">Request Equipment</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">
                      Browse available sports equipment and submit your request
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => setIsRequestModalOpen(true)}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground"
                >
                  Start Request
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Link href="/dashboard/user/my-bookings">
              <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20 hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-card-foreground">Track Bookings</CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">Monitor your active requests and status</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full border-blue-500/30 hover:bg-blue-500/10 bg-transparent">
                    View Bookings
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/user/my-queries">
              <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20 hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                      <MessageSquare className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-card-foreground">My Queries</CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">View admin responses and solutions</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full border-accent/30 hover:bg-accent/10 bg-transparent">
                    Check Queries
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        <Card className="bg-gradient-to-r from-muted/50 to-muted/30 border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/20">
                    <span className="text-primary font-bold">1</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Request Equipment</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Browse available sports equipment and submit your request
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/20">
                    <span className="text-primary font-bold">2</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Wait for Approval</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Admin reviews and approves your equipment request
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/20">
                    <span className="text-primary font-bold">3</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Collect & Use</h4>
                  <p className="text-sm text-muted-foreground mt-1">Collect your equipment and use it responsibly</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <RequestItemModal
        isOpen={isRequestModalOpen}
        onClose={() => {
          setIsRequestModalOpen(false)
          fetchCounts(session?.user.id || "")
        }}
        userId={session?.user.id || ""}
        userName={session?.user.name || ""}
        userEmail={session?.user.email || ""}
      />
    </div>
  )
}
