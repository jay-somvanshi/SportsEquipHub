import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import Chatbot from "@/components/chatbot"
import "./globals.css"

export const metadata: Metadata = {
  title: "SportsEquipHub - Sports Instrument Management System",
  description:
    "Manage your sports equipment inventory with ease. Track, manage, and optimize your sports instruments like a champion.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>{children}</Suspense>
        <Chatbot />
        <Analytics />
      </body>
    </html>
  )
}
