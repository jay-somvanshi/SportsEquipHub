"use client"

import type React from "react"
import { MessageSquare } from "lucide-react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Package,
  Users,
  Shield,
  FileText,
  CheckCircle,
  XCircle,
  PackageCheck,
  CheckCheck,
  Activity,
  BarChart3,
  Search,
  Mail,
  Zap,
  Upload,
} from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { getSession, clearSession, type Session } from "@/lib/auth"
import { AddItemModal } from "@/components/add-item-modal"
import { ImportStudentsModal } from "@/components/import-students-modal"
import { ImportInstrumentsModal } from "@/components/import-instruments-modal"

export default function AdminDashboard() {
  const router = useRouter()
  const [session, setSessionState] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false)
  const [isImportStudentsModalOpen, setIsImportStudentsModalOpen] = useState(false)
  const [isImportInstrumentsModalOpen, setIsImportInstrumentsModalOpen] = useState(false)
  const [totalUsers, setTotalUsers] = useState(0)
  const [totalAdmins, setTotalAdmins] = useState(0)
  const [totalItems, setTotalItems] = useState(0)
  const [totalRequests, setTotalRequests] = useState(0)
  const [approvedRequests, setApprovedRequests] = useState(0)
  const [declinedRequests, setDeclinedRequests] = useState(0)
  const [issuedRequests, setIssuedRequests] = useState(0)
  const [submittedRequests, setSubmittedRequests] = useState(0)
  const [userSearchQuery, setUserSearchQuery] = useState("")
  const [itemSearchQuery, setItemSearchQuery] = useState("")
  const [userSearchResults, setUserSearchResults] = useState<any[]>([])
  const [itemSearchResults, setItemSearchResults] = useState<any[]>([])
  const [userSearchLoading, setUserSearchLoading] = useState(false)
  const [itemSearchLoading, setItemSearchLoading] = useState(false)

  useEffect(() => {
    const verifySession = async () => {
      const currentSession = getSession()

      if (!currentSession || currentSession.user.role !== "admin") {
        clearSession()
        router.replace("/login/admin")
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

        if (response.status === 401) {
          console.log("[v0] Session invalid (401), clearing session")
          clearSession()
          router.replace("/login/admin")
          return
        }

        // For 503 or other errors, keep user logged in
        if (!response.ok) {
          console.log("[v0] Session verification failed with status:", response.status, "keeping user logged in")
          setSessionState(currentSession)
          await fetchCounts()
          setIsLoading(false)
          return
        }

        setSessionState(currentSession)
        await fetchCounts()
        setIsLoading(false)
      } catch (error) {
        console.error("[v0] Session verification error:", error)
        setSessionState(currentSession)
        await fetchCounts()
        setIsLoading(false)
      }
    }

    verifySession()
  }, [router])

  const fetchCounts = async () => {
    try {
      console.log("[v0] Starting to fetch counts...")
      const [usersRes, itemsRes, requestsRes] = await Promise.all([
        fetch("/api/users"),
        fetch("/api/items"),
        fetch("/api/requests"),
      ])

      console.log("[v0] Responses received - Users:", usersRes.ok, "Items:", itemsRes.ok, "Requests:", requestsRes.ok)

      const usersData = await usersRes.json()
      const itemsData = await itemsRes.json()
      const requestsData = await requestsRes.json()

      console.log(
        "[v0] Data parsed - Users:",
        usersData.users?.length,
        "Items:",
        itemsData.items?.length,
        "Requests:",
        requestsData.requests?.length,
      )

      const users = usersData.users || []
      const userCount = users.filter((u: any) => u.role === "user").length
      const adminCount = users.filter((u: any) => u.role === "admin").length

      setTotalUsers(userCount)
      setTotalAdmins(adminCount)

      const itemCount = itemsData.items?.length || 0
      setTotalItems(itemCount)

      const requests = requestsData.requests || []
      const totalReq = requests.length
      const approvedReq = requests.filter((r: any) => r.status === "approved").length
      const declinedReq = requests.filter((r: any) => r.status === "declined").length
      const issuedReq = requests.filter((r: any) => r.status === "issued").length
      const submittedReq = requests.filter((r: any) => r.status === "submitted").length

      setTotalRequests(totalReq)
      setApprovedRequests(approvedReq)
      setDeclinedRequests(declinedReq)
      setIssuedRequests(issuedReq)
      setSubmittedRequests(submittedReq)

      console.log("[v0] All counts set successfully")
    } catch (error) {
      console.error("[v0] Error fetching counts:", error)
    }
  }

  const handleSearchUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userSearchQuery.trim()) return

    setUserSearchLoading(true)
    try {
      const response = await fetch("/api/users")
      const data = await response.json()
      const users = data.users || []
      const filtered = users.filter((u: any) => u.email.toLowerCase().includes(userSearchQuery.toLowerCase()))
      setUserSearchResults(filtered)
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setUserSearchLoading(false)
    }
  }

  const handleSearchItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!itemSearchQuery.trim()) return

    setItemSearchLoading(true)
    try {
      const response = await fetch("/api/items")
      const data = await response.json()
      const items = data.items || []
      const filtered = items.filter((i: any) => i.sportsName.toLowerCase().includes(itemSearchQuery.toLowerCase()))
      setItemSearchResults(filtered)
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setItemSearchLoading(false)
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
              <p className="text-xs text-muted-foreground">Admin Control Center</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-medium text-foreground">{session.user.name}</span>
              <span className="text-xs text-muted-foreground">Administrator</span>
            </div>
            <Button onClick={handleLogout} variant="outline" size="sm">
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-12 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 border border-primary/20">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Welcome back, <span className="text-lg">{session.user.name}</span>! 👋
          </h2>
          <p className="text-lg text-muted-foreground">Here's your sports equipment management overview</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/dashboard/admin/users">
            <Card className="bg-gradient-to-br from-card to-card/80 border-border cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 group">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
                <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                  <Users className="h-5 w-5 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-card-foreground">{totalUsers}</div>
                <p className="text-xs text-muted-foreground mt-2">Active users in system</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/admin/admins">
            <Card className="bg-gradient-to-br from-card to-card/80 border-border cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 group">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Admins</CardTitle>
                <div className="h-10 w-10 rounded-lg bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                  <Shield className="h-5 w-5 text-purple-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-card-foreground">{totalAdmins}</div>
                <p className="text-xs text-muted-foreground mt-2">System administrators</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/admin/items">
            <Card className="bg-gradient-to-br from-card to-card/80 border-border cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 group">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Items</CardTitle>
                <div className="h-10 w-10 rounded-lg bg-green-500/20 flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                  <Package className="h-5 w-5 text-green-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-card-foreground">{totalItems}</div>
                <p className="text-xs text-muted-foreground mt-2">Equipment in inventory</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/admin/requests">
            <Card className="bg-gradient-to-br from-card to-card/80 border-border cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 group">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Requests</CardTitle>
                <div className="h-10 w-10 rounded-lg bg-orange-500/20 flex items-center justify-center group-hover:bg-orange-500/30 transition-colors">
                  <FileText className="h-5 w-5 text-orange-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-card-foreground">{totalRequests}</div>
                <p className="text-xs text-muted-foreground mt-2">All equipment requests</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-bold text-foreground">Request Status Overview</h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/dashboard/admin/requests?status=approved">
              <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20 cursor-pointer hover:shadow-lg transition-all group">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
                  <CheckCircle className="h-5 w-5 text-blue-500 group-hover:scale-110 transition-transform" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{approvedRequests}</div>
                  <div className="w-full bg-blue-500/20 rounded-full h-1 mt-2">
                    <div
                      className="bg-blue-500 h-1 rounded-full"
                      style={{ width: `${totalRequests > 0 ? (approvedRequests / totalRequests) * 100 : 0}%` }}
                    ></div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/admin/requests?status=declined">
              <Card className="bg-gradient-to-br from-red-500/10 to-red-500/5 border-red-500/20 cursor-pointer hover:shadow-lg transition-all group">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Declined</CardTitle>
                  <XCircle className="h-5 w-5 text-red-500 group-hover:scale-110 transition-transform" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{declinedRequests}</div>
                  <div className="w-full bg-red-500/20 rounded-full h-1 mt-2">
                    <div
                      className="bg-red-500 h-1 rounded-full"
                      style={{ width: `${totalRequests > 0 ? (declinedRequests / totalRequests) * 100 : 0}%` }}
                    ></div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/admin/requests?status=issued">
              <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20 cursor-pointer hover:shadow-lg transition-all group">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Issued</CardTitle>
                  <PackageCheck className="h-5 w-5 text-green-500 group-hover:scale-110 transition-transform" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{issuedRequests}</div>
                  <div className="w-full bg-green-500/20 rounded-full h-1 mt-2">
                    <div
                      className="bg-green-500 h-1 rounded-full"
                      style={{ width: `${totalRequests > 0 ? (issuedRequests / totalRequests) * 100 : 0}%` }}
                    ></div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/admin/requests?status=submitted">
              <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20 cursor-pointer hover:shadow-lg transition-all group">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Submitted</CardTitle>
                  <CheckCheck className="h-5 w-5 text-purple-500 group-hover:scale-110 transition-transform" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">{submittedRequests}</div>
                  <div className="w-full bg-purple-500/20 rounded-full h-1 mt-2">
                    <div
                      className="bg-purple-500 h-1 rounded-full"
                      style={{ width: `${totalRequests > 0 ? (submittedRequests / totalRequests) * 100 : 0}%` }}
                    ></div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Search className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-bold text-foreground">Quick Search</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Search Users Card */}
            <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-blue-500" />
                  <CardTitle className="text-card-foreground">Search Users by Email</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleSearchUser} className="space-y-3">
                  <Input
                    type="email"
                    placeholder="Enter user email..."
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    className="bg-background border-border/50 text-foreground focus:border-blue-500 transition-colors"
                  />
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold shadow-lg"
                    disabled={userSearchLoading}
                  >
                    {userSearchLoading ? "Searching..." : "Search Users"}
                  </Button>
                </form>

                {userSearchResults.length > 0 && (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {userSearchResults.map((user: any) => (
                      <div
                        key={user._id}
                        className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 hover:shadow-md transition-all"
                      >
                        <h4 className="font-semibold text-foreground text-sm">{user.name}</h4>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-600 font-medium">
                            {user.role}
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${
                              user.isActive ? "bg-green-500/20 text-green-600" : "bg-red-500/20 text-red-600"
                            }`}
                          >
                            {user.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {userSearchResults.length === 0 && userSearchQuery && !userSearchLoading && (
                  <div className="p-3 rounded-lg bg-muted/50 text-center text-muted-foreground text-sm">
                    No users found matching "{userSearchQuery}"
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Search Items Card */}
            <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-green-500" />
                  <CardTitle className="text-card-foreground">Search Equipment by Sports</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleSearchItem} className="space-y-3">
                  <Input
                    type="text"
                    placeholder="e.g., Basketball, Football..."
                    value={itemSearchQuery}
                    onChange={(e) => setItemSearchQuery(e.target.value)}
                    className="bg-background border-border/50 text-foreground focus:border-green-500 transition-colors"
                  />
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-semibold shadow-lg"
                    disabled={itemSearchLoading}
                  >
                    {itemSearchLoading ? "Searching..." : "Search Equipment"}
                  </Button>
                </form>

                {itemSearchResults.length > 0 && (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {itemSearchResults.map((item: any) => (
                      <div
                        key={item._id}
                        className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 hover:shadow-md transition-all"
                      >
                        <h4 className="font-semibold text-foreground text-sm">{item.itemName}</h4>
                        <p className="text-xs text-muted-foreground">{item.sportsName}</p>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-600 font-medium">
                            Code: {item.itemCode}
                          </span>
                          <span className="text-xs px-2 py-1 rounded-full bg-accent/20 text-accent font-medium">
                            Qty: {item.itemQuantity}
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${
                              item.isActive ? "bg-green-500/20 text-green-600" : "bg-red-500/20 text-red-600"
                            }`}
                          >
                            {item.isActive ? "Available" : "Disabled"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {itemSearchResults.length === 0 && itemSearchQuery && !itemSearchLoading && (
                  <div className="p-3 rounded-lg bg-muted/50 text-center text-muted-foreground text-sm">
                    No equipment found for "{itemSearchQuery}"
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              <CardTitle className="text-card-foreground">Quick Actions</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button
              onClick={() => setIsAddItemModalOpen(true)}
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground shadow-lg"
            >
              <Package className="h-4 w-4 mr-2" />
              Add New Item
            </Button>
            <Button
              onClick={() => setIsImportStudentsModalOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg"
            >
              <Upload className="h-4 w-4 mr-2" />
              Import Students
            </Button>
            <Button
              onClick={() => setIsImportInstrumentsModalOpen(true)}
              className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white shadow-lg"
            >
              <Upload className="h-4 w-4 mr-2" />
              Import Instruments
            </Button>
            <Button
              onClick={() => router.push("/register/admin")}
              className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white shadow-lg"
            >
              <Shield className="h-4 w-4 mr-2" />
              Create Admin
            </Button>
            <Button
              onClick={() => router.push("/register/user")}
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg"
            >
              <Users className="h-4 w-4 mr-2" />
              Create User
            </Button>
           
          </CardContent>
        </Card>
      </main>

      <AddItemModal
        isOpen={isAddItemModalOpen}
        onClose={() => {
          setIsAddItemModalOpen(false)
          fetchCounts()
        }}
      />
      <ImportStudentsModal
        isOpen={isImportStudentsModalOpen}
        onClose={() => {
          setIsImportStudentsModalOpen(false)
          fetchCounts()
        }}
        onSuccess={() => fetchCounts()}
      />
      <ImportInstrumentsModal
        isOpen={isImportInstrumentsModalOpen}
        onClose={() => {
          setIsImportInstrumentsModalOpen(false)
          fetchCounts()
        }}
        onSuccess={() => fetchCounts()}
      />
    </div>
  )
}
