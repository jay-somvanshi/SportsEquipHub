"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Pencil, Trash2, Mail, Shield } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { getSession, clearSession } from "@/lib/auth"
import { Switch } from "@/components/ui/switch"
import { EditUserModal } from "@/components/edit-user-modal"

interface User {
  _id: string
  name: string
  email: string
  role: string
  isActive: boolean
}

export default function AdminsPage() {
  const router = useRouter()
  const [admins, setAdmins] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingAdmin, setEditingAdmin] = useState<User | null>(null)

  useEffect(() => {
    const session = getSession()
    if (!session || session.user.role !== "admin") {
      clearSession()
      router.replace("/login/admin")
      return
    }
    fetchAdmins()
  }, [router])

  const fetchAdmins = async () => {
    try {
      const response = await fetch("/api/users")
      const data = await response.json()
      setAdmins(data.users.filter((u: User) => u.role === "admin"))
      setIsLoading(false)
    } catch (error) {
      console.error("Error fetching admins:", error)
      setIsLoading(false)
    }
  }

  const handleToggleActive = async (userId: string, currentStatus: boolean) => {
    try {
      const response = await fetch("/api/users/toggle-active", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, isActive: !currentStatus }),
      })

      if (response.ok) {
        fetchAdmins()
      }
    } catch (error) {
      console.error("Error toggling admin status:", error)
    }
  }

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this admin?")) return

    try {
      const response = await fetch(`/api/users/${userId}`, { method: "DELETE" })
      if (response.ok) {
        fetchAdmins()
      }
    } catch (error) {
      console.error("Error deleting admin:", error)
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
              <Shield className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">All Admins</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {admins.length === 0 ? (
          <Card className="bg-card border-border p-8 text-center">
            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No admins found</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {admins.map((admin) => (
              <Card key={admin._id} className="bg-card border-border hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-card-foreground mb-2">{admin.name}</h3>
                      <div className="flex items-center gap-2 text-muted-foreground mb-3">
                        <Mail className="h-4 w-4" />
                        <span className="text-sm">{admin.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Status:</span>
                        <Switch
                          checked={admin.isActive}
                          onCheckedChange={() => handleToggleActive(admin._id, admin.isActive)}
                        />
                        <span className="text-sm text-muted-foreground">{admin.isActive ? "Active" : "Inactive"}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setEditingAdmin(admin)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(admin._id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {editingAdmin && (
        <EditUserModal
          isOpen={!!editingAdmin}
          onClose={() => {
            setEditingAdmin(null)
            fetchAdmins()
          }}
          user={editingAdmin}
        />
      )}
    </div>
  )
}
