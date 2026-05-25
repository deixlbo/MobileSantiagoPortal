"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User,
  Loader2,
  Minimize2
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface SuggestedQuestion {
  text: string
  category: string
}

interface AIChatbotProps {
  portalType: "resident" | "official"
  suggestedQuestions: SuggestedQuestion[]
  getResponse: (question: string) => string
  welcomeMessage: string
  title: string
  subtitle: string
  accentColor: string
}

export function AIChatbot({
  portalType,
  suggestedQuestions,
  getResponse,
  welcomeMessage,
  title,
  subtitle,
  accentColor
}: AIChatbotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: welcomeMessage,
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSend = async (text?: string) => {
    const messageText = text || inputValue.trim()
    if (!messageText) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate AI response delay
    setTimeout(() => {
      const response = getResponse(messageText)
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1000 + Math.random() * 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSuggestedQuestion = (question: string) => {
    handleSend(question)
  }

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className={cn(
              "fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-colors",
              portalType === "resident" 
                ? "bg-emerald-500 hover:bg-emerald-600 text-white" 
                : "bg-emerald-700 hover:bg-emerald-800 text-white"
            )}
          >
            <MessageCircle className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? "auto" : "500px"
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={cn(
              "fixed bottom-4 right-4 z-50 flex w-[360px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl border",
              isMinimized && "h-auto"
            )}
          >
            {/* Header */}
            <div 
              className={cn(
                "flex items-center justify-between px-4 py-3",
                portalType === "resident"
                  ? "bg-gradient-to-r from-emerald-500 to-emerald-600"
                  : "bg-gradient-to-r from-emerald-700 to-emerald-800"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">{title}</h3>
                  <p className="text-xs text-white/80">{subtitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/20"
                  onClick={() => setIsMinimized(!isMinimized)}
                >
                  <Minimize2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/20"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Chat Content */}
            {!isMinimized && (
              <>
                {/* Messages Area */}
                <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                          "flex gap-2",
                          message.role === "user" ? "flex-row-reverse" : "flex-row"
                        )}
                      >
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          {message.role === "assistant" ? (
                            <>
                              <AvatarImage src="/images/santiagologo.jpg" />
                              <AvatarFallback className={cn(
                                portalType === "resident" ? "bg-emerald-100 text-emerald-700" : "bg-emerald-100 text-emerald-800"
                              )}>
                                <Bot className="h-4 w-4" />
                              </AvatarFallback>
                            </>
                          ) : (
                            <AvatarFallback className="bg-gray-100 text-gray-700">
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div
                          className={cn(
                            "max-w-[75%] rounded-2xl px-4 py-2 text-sm",
                            message.role === "user"
                              ? portalType === "resident"
                                ? "bg-emerald-500 text-white rounded-tr-sm"
                                : "bg-emerald-700 text-white rounded-tr-sm"
                              : "bg-gray-100 text-gray-800 rounded-tl-sm"
                          )}
                        >
                          {message.content}
                        </div>
                      </motion.div>
                    ))}

                    {/* Typing Indicator */}
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-2"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/images/santiagologo.jpg" />
                          <AvatarFallback className={cn(
                            portalType === "resident" ? "bg-emerald-100 text-emerald-700" : "bg-emerald-100 text-emerald-800"
                          )}>
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex items-center gap-1 rounded-2xl bg-gray-100 px-4 py-2 rounded-tl-sm">
                          <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: "0ms" }} />
                          <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: "150ms" }} />
                          <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: "300ms" }} />
                        </div>
                      </motion.div>
                    )}
                  </div>
                </ScrollArea>

                {/* Suggested Questions */}
                {messages.length <= 2 && (
                  <div className="border-t px-4 py-3">
                    <p className="mb-2 text-xs font-medium text-gray-500">Mga Madalas na Tanong:</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestedQuestions.slice(0, 3).map((q, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestedQuestion(q.text)}
                          className={cn(
                            "rounded-full px-3 py-1 text-xs transition-colors",
                            portalType === "resident"
                              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                              : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                          )}
                        >
                          {q.text}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input Area */}
                <div className="border-t p-3">
                  <div className="flex gap-2">
                    <Input
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Mag-type ng mensahe..."
                      className="flex-1 rounded-full border-gray-200 bg-gray-50 focus:bg-white"
                      disabled={isTyping}
                    />
                    <Button
                      onClick={() => handleSend()}
                      disabled={!inputValue.trim() || isTyping}
                      size="icon"
                      className={cn(
                        "rounded-full",
                        portalType === "resident"
                          ? "bg-emerald-500 hover:bg-emerald-600"
                          : "bg-emerald-700 hover:bg-emerald-800"
                      )}
                    >
                      {isTyping ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
