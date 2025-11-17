"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageCircle, X, Send } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

interface Message {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: Date
}

const FAQ_DATA = [
  {
    id: 1,
    question: "How do I request a sports instrument?",
    answer:
      'Go to your dashboard, click on "Request Item", select the instrument you need, and submit the request. The admin will review and approve your request.',
  },
  {
    id: 2,
    question: "How long does it take for a request to be approved?",
    answer:
      'Most requests are approved within 24 hours. You can check the status of your request in the "My Bookings" section of your dashboard.',
  },
  {
    id: 3,
    question: "What if the instrument I need is not available?",
    answer:
      "If an instrument is not available, you can check back later or contact the admin. Available inventory is shown in the request form with real-time quantity updates.",
  },
  {
    id: 4,
    question: "How do I return an instrument?",
    answer:
      'Once you\'re done using the instrument, go to "My Bookings" and click "Submit" on the booking. This will return the instrument to the inventory.',
  },
  {
    id: 5,
    question: "Can I request multiple instruments at once?",
    answer:
      "Yes, you can submit multiple individual requests for different instruments. Each request will be processed separately by the admin.",
  },
  {
    id: 6,
    question: "What happens if an instrument gets damaged?",
    answer:
      "If an instrument is damaged, inform the admin immediately. The admin can mark the item as inactive to prevent further requests until it's repaired.",
  },
  {
    id: 7,
    question: "How can I track the history of instrument requests?",
    answer:
      'Admin can view the complete history of each instrument by clicking the "History" button on the Items management page, showing all users who requested it.',
  },
  {
    id: 8,
    question: "What is the difference between Admin and User accounts?",
    answer:
      "Admins can manage inventory, approve requests, view analytics, and manage users. Users can only request instruments and view their own booking history.",
  },
  {
    id: 9,
    question: "How do I import multiple students or instruments?",
    answer:
      'Admins can use the "Import Students" or "Import Instruments" buttons on the dashboard. Upload a CSV file with the required columns.',
  },
  {
    id: 10,
    question: "What should I include in a CSV file for importing?",
    answer:
      "For students: name, email, password, role. For instruments: itemName, itemQuantity, sportsName, itemCode. Follow the format shown in the import modal.",
  },
  {
    id: 11,
    question: "Can I search for specific users or instruments?",
    answer:
      "Yes, the admin dashboard has search boxes to find users by email and equipment by sports name. Results show detailed information about availability and status.",
  },
  {
    id: 12,
    question: "How do I disable an inactive or damaged item?",
    answer:
      "On the Items management page, click the eye icon next to the item. This will toggle the item's active status. Disabled items won't appear to users.",
  },
  {
    id: 13,
    question: "What information is displayed in the analytics dashboard?",
    answer:
      "The dashboard shows statistics like total items, available items, active requests, completed bookings, and request status distribution.",
  },
  {
    id: 14,
    question: "How do I get help with technical issues?",
    answer:
      'Use this chatbot to ask questions about system functionality. For technical issues, you can also send a query through the "User Queries" section.',
  },
  {
    id: 15,
    question: "Is my data secure in this system?",
    answer:
      "Yes, the system uses role-based access control and secure authentication. Only authorized users can access specific data based on their role.",
  },
]

export default function Chatbot({ userId }: { userId?: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content:
        "Hello! I'm SportGear Pro Assistant. I can help answer questions about our inventory management system. Choose a question or ask me anything!",
      timestamp: new Date(),
    },
  ])
  const [userInput, setUserInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleFAQClick = (faq: (typeof FAQ_DATA)[0]) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: faq.question,
      timestamp: new Date(),
    }

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: "bot",
      content: faq.answer,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage, botMessage])
  }

  const handleSendMessage = async () => {
    if (!userInput.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: userInput,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setUserInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/user-queries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId || "guest",
          query: userInput,
        }),
      })

      if (!response.ok) throw new Error("Failed to send query")

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content:
          "Thank you for your query! An admin will review it and send a response to your dashboard soon. You can also check the FAQ above for common questions.",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error("Error sending query:", error)
      toast({
        title: "Error",
        description: "Failed to send your query",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center"
          aria-label="Open chatbot"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Chat Popup */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-24px)] bg-card border border-border rounded-2xl shadow-2xl flex flex-col max-h-[600px]">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-accent p-4 rounded-t-2xl text-primary-foreground flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <h3 className="font-semibold">SportGear Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Close chatbot"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* FAQ Buttons */}
          <div className="px-4 py-3 border-t border-border max-h-[300px] overflow-y-auto">
            <p className="text-xs font-semibold text-muted-foreground mb-2">Quick Questions:</p>
            <div className="grid grid-cols-1 gap-2">
              {FAQ_DATA.map((faq) => (
                <button
                  key={faq.id}
                  onClick={() => handleFAQClick(faq)}
                  className="text-xs p-2 rounded-lg bg-muted hover:bg-primary/20 text-foreground hover:text-primary transition-all text-left line-clamp-2"
                >
                  {faq.question}
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
        </div>
      )}
    </>
  )
}
