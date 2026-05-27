"use client"

import { useState, useRef, useEffect } from "react"
import { useChat } from "@ai-sdk/react"
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
  Minimize2,
  Mic,
  Volume2,
  VolumeX
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
  welcomeMessage: string
  title: string
  subtitle: string
  accentColor: string
  userContext?: {
    residentId?: string
    residentName?: string
    email?: string
  }
  getResponse?: (question: string) => string
}

export function AIChatbot({
  portalType,
  suggestedQuestions,
  welcomeMessage,
  title,
  subtitle,
  accentColor,
  userContext,
  getResponse
}: AIChatbotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [voiceOutputEnabled, setVoiceOutputEnabled] = useState(true)
  const [speechSupported, setSpeechSupported] = useState(false)
  const [formSuggestion, setFormSuggestion] = useState<Record<string, string> | null>(null)
  const [localMessages, setLocalMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: welcomeMessage,
      timestamp: new Date(),
    },
  ])
  const [localInput, setLocalInput] = useState("")
  const [localIsLoading, setLocalIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<any>(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/assistant',
    initialMessages: [
      {
        id: 'welcome',
        role: 'assistant',
        content: welcomeMessage
      }
    ],
    body: {
      portalType,
      residentId: userContext?.residentId
    },
    onFinish: (message) => {
      const { cleaned, suggestion } = parseFormSuggestion(message.content)
      if (suggestion && Object.keys(suggestion).length > 0) {
        setFormSuggestion(suggestion)
      }
      if (voiceOutputEnabled) {
        speakText(cleaned)
      }
    }
  })

  const hasLocalAssistant = Boolean(getResponse)
  const activeMessages = hasLocalAssistant ? localMessages : messages
  const activeInput = hasLocalAssistant ? localInput : input
  const activeIsLoading = hasLocalAssistant ? localIsLoading : isLoading

  const handleLocalInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalInput(event.target.value)
  }

  const handleLocalSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!localInput.trim()) return

    if (inputRef.current && isListening && recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    }

    const question = localInput.trim()
    setLocalMessages((current) => [
      ...current,
      {
        id: `user-${Date.now()}`,
        role: 'user',
        content: question,
        timestamp: new Date(),
      },
    ])
    setLocalInput("")
    setFormSuggestion(null)
    setLocalIsLoading(true)

    setTimeout(() => {
      const answerText = getResponse?.(question) ?? ""
      const { cleaned, suggestion } = parseFormSuggestion(answerText)
      if (suggestion && Object.keys(suggestion).length > 0) {
        setFormSuggestion(suggestion)
      }
      if (voiceOutputEnabled) {
        speakText(cleaned)
      }
      setLocalMessages((current) => [
        ...current,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: cleaned,
          timestamp: new Date(),
        },
      ])
      setLocalIsLoading(false)
    }, 250)
  }

  const activeHandleInputChange = hasLocalAssistant ? handleLocalInputChange : handleInputChange
  const activeHandleSubmit = hasLocalAssistant ? handleLocalSubmit : handleSubmit

  useEffect(() => {
    if (scrollRef.current) {
      const scrollElement = scrollRef.current
      setTimeout(() => {
        scrollElement.scrollTop = scrollElement.scrollHeight
      }, 0)
    }
  }, [activeMessages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      setSpeechSupported(Boolean(SpeechRecognition))
      if (SpeechRecognition && !recognitionRef.current) {
        const recognition = new SpeechRecognition()
        recognition.lang = 'tl-PH'
        recognition.interimResults = false
        recognition.maxAlternatives = 1

        recognition.onresult = (event: any) => {
          const transcript = event.results?.[0]?.[0]?.transcript
          if (transcript) {
            setInputValue(transcript)
            handleSend(transcript)
          }
        }

        recognition.onend = () => {
          setIsListening(false)
        }

        recognition.onerror = () => {
          setIsListening(false)
        }

        recognitionRef.current = recognition
      }
    }
  }, [isOpen])

  const parseFormSuggestion = (text: string) => {
    const marker = /<SUGGESTED_FORM>([\s\S]*?)<\/SUGGESTED_FORM>/i
    const match = text.match(marker)
    if (!match) return { cleaned: text, suggestion: null }

    try {
      const jsonText = match[1].trim()
      const parsed = JSON.parse(jsonText)
      const cleaned = text.replace(marker, '').trim()
      return { cleaned, suggestion: parsed }
    } catch (error) {
      return { cleaned: text.replace(marker, '').trim(), suggestion: null }
    }
  }

  const speakText = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis || !voiceOutputEnabled) return

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'tl-PH'
    utterance.rate = 0.95
    utterance.pitch = 1.05
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
  }

  const handleVoiceToggle = () => {
    if (!speechSupported) {
      alert('Voice commands are not supported in this browser.')
      return
    }
    const recognition = recognitionRef.current
    if (!recognition) return

    if (isListening) {
      recognition.stop()
      setIsListening(false)
    } else {
      setIsListening(true)
      recognition.start()
    }
  }

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (inputRef.current && isListening && recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
    if (hasLocalAssistant) {
      handleLocalSubmit(e)
    } else {
      activeHandleSubmit(e)
    }
    setFormSuggestion(null)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if ((e as any).key === "Enter" && !(e as any).shiftKey) {
      e.preventDefault()
      handleFormSubmit(e as any)
    }
  }

  const handleSuggestedQuestion = (question: string) => {
    activeHandleInputChange({ target: { value: question } } as any)
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
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4" ref={scrollRef}>
                    {activeMessages.map((message) => (
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

                    {/* Loading Indicator */}
                    {activeIsLoading && (
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
                {activeMessages.length <= 2 && (
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

                {formSuggestion && (
                  <div className="border-t px-4 py-3 bg-slate-50 text-slate-900">
                    <p className="mb-2 text-xs font-semibold text-slate-500">AI Suggested Form Data</p>
                    <div className="grid gap-2 text-xs sm:grid-cols-2">
                      {Object.entries(formSuggestion).map(([key, value]) => (
                        <div key={key} className="rounded-lg border border-slate-200 bg-white p-2">
                          <p className="font-medium text-slate-700">{key}</p>
                          <p className="text-slate-500 truncate">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input Area */}
                <form onSubmit={handleFormSubmit} className="border-t p-3">
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={handleVoiceToggle}
                      className={cn(
                        "rounded-full",
                        isListening ? 'bg-emerald-500 text-white' : 'bg-white text-slate-700'
                      )}
                    >
                      <Mic className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setVoiceOutputEnabled((prev) => !prev)}
                      className={cn(
                        "rounded-full",
                        voiceOutputEnabled ? 'bg-emerald-500 text-white' : 'bg-white text-slate-700'
                      )}
                    >
                      {voiceOutputEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                    </Button>
                    <Input
                      ref={inputRef}
                      value={activeInput}
                      onChange={activeHandleInputChange}
                      onKeyPress={handleKeyPress}
                      placeholder={isListening ? "Listening... magsalita na" : "Mag-type ng mensahe..."}
                      className="flex-1 rounded-full border-gray-200 bg-gray-50 focus:bg-white"
                      disabled={activeIsLoading}
                    />
                    <Button
                      type="submit"
                      disabled={!activeInput.trim() || activeIsLoading}
                      size="icon"
                      className={cn(
                        "rounded-full",
                        portalType === "resident"
                          ? "bg-emerald-500 hover:bg-emerald-600"
                          : "bg-emerald-700 hover:bg-emerald-800"
                      )}
                    >
                      {activeIsLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
