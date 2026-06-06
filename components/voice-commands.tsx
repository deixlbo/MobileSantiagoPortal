'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Mic, MicOff, Loader2, Volume2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface VoiceCommandsProps {
  onCommand: (command: string, action: string) => void
  commands?: Record<string, string>
  language?: string
  enableFeedback?: boolean
  onCommandExecuted?: (command: string, success: boolean) => void
}

const DEFAULT_COMMANDS: Record<string, string> = {
  // Navigation commands (Tagalog & English)
  'home': 'navigate-home',
  'uwi': 'navigate-home',
  'bahay': 'navigate-home',
  'documents': 'navigate-documents',
  'dokumento': 'navigate-documents',
  'mga dokumento': 'navigate-documents',
  'request': 'navigate-request',
  'mag request': 'navigate-request',
  'humiling': 'navigate-request',
  'profile': 'navigate-profile',
  'account': 'navigate-profile',
  'settings': 'navigate-settings',
  'mga setting': 'navigate-settings',
  'dashboard': 'navigate-dashboard',
  'analytics': 'navigate-analytics',
  'blotter': 'navigate-blotter',
  
  // Actions
  'submit': 'action-submit',
  'i-submit': 'action-submit',
  'isumite': 'action-submit',
  'cancel': 'action-cancel',
  'kanselahin': 'action-cancel',
  'back': 'action-back',
  'bumalik': 'action-back',
  'help': 'action-help',
  'tulong': 'action-help',
  'search': 'action-search',
  'hanapin': 'action-search',
  'open': 'action-open',
  'close': 'action-close',
  'print': 'action-print',
  'i-print': 'action-print',
  'download': 'action-download',
  'i-download': 'action-download',
  'delete': 'action-delete',
  'i-delete': 'action-delete',
  'refresh': 'action-refresh',
  'i-refresh': 'action-refresh',
  
  // Document types
  'barangay clearance': 'request-clearance',
  'clearance': 'request-clearance',
  'indigency': 'request-indigency',
  'certificate of indigency': 'request-indigency',
  'residency': 'request-residency',
  'certificate of residency': 'request-residency',
  'business permit': 'request-business-permit',
  'permit': 'request-business-permit',
  'solo parent': 'request-solo-parent',
  'solo parent certificate': 'request-solo-parent',
  'medical assistance': 'request-medical-assistance',
  'blotter report': 'request-blotter',
  
  // Document operations
  'approve': 'document-approve',
  'i-approve': 'document-approve',
  'reject': 'document-decline',
  'i-reject': 'document-decline',
  'claim': 'document-claim',
  'kunin': 'document-claim',
  'verify': 'document-verify',
  'i-verify': 'document-verify',
  'track': 'document-track',
  'subaybayan': 'document-track',
}

export function VoiceCommands({ 
  onCommand, 
  commands = DEFAULT_COMMANDS,
  language = 'fil-PH',
  enableFeedback = true,
  onCommandExecuted
}: VoiceCommandsProps) {
  const [isSupported, setIsSupported] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  useEffect(() => {
    // Check SpeechRecognition support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      setIsSupported(true)
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = language

      recognitionRef.current.onresult = (event) => {
        const current = event.resultIndex
        const result = event.results[current]
        const text = result[0].transcript.toLowerCase().trim()
        
        setTranscript(text)

        if (result.isFinal) {
          processCommand(text)
        }
      }

      recognitionRef.current.onerror = (event) => {
        console.error('[Voice] Recognition error:', event.error)
        setError(getErrorMessage(event.error))
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
    }
  }, [language])

  const getErrorMessage = (error: string): string => {
    switch (error) {
      case 'not-allowed':
        return 'Microphone access denied. Please enable microphone in browser settings.'
      case 'no-speech':
        return 'Walang narinig na salita. Subukang muli.'
      case 'network':
        return 'Network error. Check your internet connection.'
      default:
        return 'Voice recognition error. Please try again.'
    }
  }

  const processCommand = useCallback((text: string) => {
    // Check for exact matches first
    if (commands[text]) {
      const action = commands[text]
      onCommand(text, action)
      addToHistory(text)
      
      if (enableFeedback) {
        const feedback = getCommandFeedback(action)
        speak(feedback)
      }
      
      onCommandExecuted?.(text, true)
      return
    }

    // Check for partial matches
    for (const [phrase, action] of Object.entries(commands)) {
      if (text.includes(phrase)) {
        onCommand(phrase, action)
        addToHistory(phrase)
        
        if (enableFeedback) {
          const feedback = getCommandFeedback(action)
          speak(feedback)
        }
        
        onCommandExecuted?.(phrase, true)
        return
      }
    }

    // No command found
    if (enableFeedback) {
      speak('Hindi maintindihan ang command. Subukang muli.')
    }
    onCommandExecuted?.(text, false)
  }, [commands, onCommand, enableFeedback, onCommandExecuted])

  const addToHistory = (command: string) => {
    setCommandHistory(prev => [command, ...prev.slice(0, 4)])
  }

  const getCommandFeedback = (action: string): string => {
    const feedbackMap: Record<string, string> = {
      'navigate-home': 'Pumupunta sa home page',
      'navigate-documents': 'Nagbubukas ng mga dokumento',
      'navigate-request': 'Pumupunta sa pag-request ng dokumento',
      'navigate-profile': 'Nagbubukas ng profile',
      'navigate-settings': 'Nagbubukas ng settings',
      'navigate-dashboard': 'Nagbubukas ng dashboard',
      'navigate-analytics': 'Nagbubukas ng analytics',
      'navigate-blotter': 'Nagbubukas ng blotter',
      'action-submit': 'Sinusubmit ang form',
      'action-cancel': 'Kinakansela ang operasyon',
      'action-back': 'Bumabalik sa nakaraang pahina',
      'action-help': 'Nagbubukas ng tulong',
      'action-search': 'Naghahanap ng dokumento',
      'action-open': 'Nag-open ng dokumento',
      'action-close': 'Nagse-close',
      'action-print': 'Nag-print ng dokumento',
      'action-download': 'Nag-download ng dokumento',
      'action-delete': 'Nag-delete ng dokumento',
      'action-refresh': 'Nag-refresh ng pahina',
      'request-clearance': 'Nag-request ng barangay clearance',
      'request-indigency': 'Nag-request ng certificate of indigency',
      'request-residency': 'Nag-request ng certificate of residency',
      'request-business-permit': 'Nag-request ng business permit',
      'request-solo-parent': 'Nag-request ng solo parent certificate',
      'request-medical-assistance': 'Nag-request ng medical assistance',
      'request-blotter': 'Nag-file ng blotter report',
      'document-approve': 'Nag-approve ng dokumento',
      'document-decline': 'Nag-decline ng dokumento',
      'document-claim': 'Kumukuha ng dokumento',
      'document-verify': 'Nag-verify ng dokumento',
      'document-track': 'Sinusubaybayan ang dokumento',
    }
    
    return feedbackMap[action] || 'Executing command'
  }

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = language
      utterance.rate = 0.9
      utterance.pitch = 1.0
      speechSynthesis.cancel()
      speechSynthesis.speak(utterance)
    }
  }

  const startListening = () => {
    if (!recognitionRef.current) return

    setError(null)
    setTranscript('')
    setIsListening(true)

    try {
      recognitionRef.current.start()
    } catch (err) {
      console.error('[Voice] Start error:', err)
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setIsListening(false)
  }

  if (!isSupported) {
    return null
  }

  return (
    <div className="fixed bottom-20 right-4 z-50 md:bottom-6">
      {error && (
        <Alert variant="destructive" className="mb-2 max-w-xs">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs">{error}</AlertDescription>
        </Alert>
      )}

      {transcript && isListening && (
        <Card className="mb-2 max-w-xs">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm">{transcript}</span>
            </div>
          </CardContent>
        </Card>
      )}

      <Button
        onClick={isListening ? stopListening : startListening}
        size="lg"
        className={`rounded-full h-14 w-14 shadow-lg ${
          isListening ? 'bg-destructive hover:bg-destructive/90 animate-pulse' : ''
        }`}
        aria-label={isListening ? 'Stop voice command' : 'Start voice command'}
      >
        {isListening ? (
          <MicOff className="h-6 w-6" />
        ) : (
          <Mic className="h-6 w-6" />
        )}
      </Button>

      {isListening && (
        <div className="absolute -top-2 -right-2">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}
    </div>
  )
}

// Extend Window interface for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition
    webkitSpeechRecognition: typeof SpeechRecognition
  }
}
