"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Upload, AlertCircle, CheckCircle } from "lucide-react"

interface ImportStudentsModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function ImportStudentsModal({ isOpen, onClose, onSuccess }: ImportStudentsModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [fileName, setFileName] = useState("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    const fileInput = e.currentTarget.querySelector('input[type="file"]') as HTMLInputElement
    const file = fileInput?.files?.[0]

    if (!file) {
      setError("Please select a CSV file")
      return
    }

    if (!file.name.endsWith(".csv")) {
      setError("Please upload a CSV file")
      return
    }

    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/import/students", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to import students")
      }

      setSuccess(`Successfully imported ${data.count} students!`)
      setFileName("")
      fileInput.value = ""

      setTimeout(() => {
        setSuccess("")
        onSuccess?.()
        onClose()
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setError("")
    setSuccess("")
    setFileName("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-card border-border sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-card-foreground">Import Students</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Upload a CSV file to import multiple students at once
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <h4 className="font-semibold text-blue-600 mb-2 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              CSV Format Required
            </h4>
            <p className="text-sm text-muted-foreground mb-3">Your CSV file must have these columns (in order):</p>
            <div className="bg-background rounded p-3 font-mono text-xs text-foreground overflow-x-auto">
              <div>name,email,password,role</div>
              <div className="text-muted-foreground mt-2">Example:</div>
              <div>John Doe,john@example.com,password123,user</div>
              <div>Jane Smith,jane@example.com,password456,user</div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Role should be either "user" or "admin". Password must be at least 6 characters.
            </p>
          </div>

          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              disabled={isLoading}
              className="hidden"
              id="csv-input"
            />
            <label htmlFor="csv-input" className="cursor-pointer block">
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">
                {fileName ? `Selected: ${fileName}` : "Click to select CSV file"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">or drag and drop</p>
            </label>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-2 rounded-md text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/10 border border-green-500 text-green-600 px-4 py-2 rounded-md text-sm flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              {success}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isLoading || !fileName}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white"
            >
              {isLoading ? "Importing..." : "Import Students"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 bg-transparent"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
