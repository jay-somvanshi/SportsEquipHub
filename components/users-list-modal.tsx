"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Pencil, Trash2 } from "lucide-react"
import { EditUserModal } from "./edit-user-modal"

interface User {
  _id: string
  email: string
  name: string
  role: string
  isActive: boolean
  createdAt: string
}

interface UsersListModalProps {
  isOpen: boolean
  onClose: () => void
  roleFilter?: "user" | "admin"
}

export function UsersListModal({ isOpen, onClose, roleFilter }: UsersListModalProps) {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  useEffect(() => {
    if (isOpen) {
      fetchUsers()
    }
  }, [isOpen])

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/users")
      const data = await response.json()
      const filteredUsers = roleFilter ? data.users.filter((u: User) => u.role === roleFilter) : data.users
      setUsers(filteredUsers)
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return

    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchUsers()
      }
    } catch (error) {
      console.error("Error deleting user:", error)
    }
  }

  const handleToggleActive = async (userId: string, currentStatus: boolean) => {
    const newStatus = !currentStatus
    console.log("[v0] Toggling user:", { userId, from: currentStatus, to: newStatus })

    try {
      const response = await fetch("/api/users/toggle-active", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, isActive: newStatus }),
      })

      if (response.ok) {
        const data = await response.json()
        console.log("[v0] Toggle successful:", data)
        // Refresh the list to get the updated state from database
        await fetchUsers()
      } else {
        const error = await response.text()
        console.error("[v0] Toggle failed:", error)
        alert("Failed to update user status")
      }
    } catch (error) {
      console.error("[v0] Error toggling user status:", error)
      alert("Error updating user status")
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{roleFilter === "admin" ? "All Admins" : "All Users"}</DialogTitle>
          </DialogHeader>

          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user._id} className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-semibold text-foreground">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                      <div className="text-sm text-muted-foreground">
                        Role: <span className="capitalize">{user.role}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Created: {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Switch
                          id={`active-${user._id}`}
                          checked={user.isActive}
                          onCheckedChange={() => handleToggleActive(user._id, user.isActive)}
                        />
                        <Label htmlFor={`active-${user._id}`} className="text-sm font-medium">
                          {user.isActive ? "Active" : "Inactive"}
                        </Label>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setEditingUser(user)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(user._id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {editingUser && (
        <EditUserModal
          isOpen={!!editingUser}
          onClose={() => {
            setEditingUser(null)
            fetchUsers()
          }}
          user={editingUser}
        />
      )}
    </>
  )
}
