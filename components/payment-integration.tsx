'use client'

import { useState } from 'react'
import Image from 'next/image'
import { CreditCard, Smartphone, Loader2, Check, AlertCircle, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'

interface PaymentIntegrationProps {
  amount: number
  description: string
  referenceId: string
  onSuccess: (transactionId: string) => void
  onError?: (error: string) => void
}

type PaymentMethod = 'gcash' | 'maya' | 'bank'

interface PaymentDetails {
  gcash: { number: string; name: string }
  maya: { number: string; name: string }
  bank: { account: string; name: string; bank: string }
}

const PAYMENT_DETAILS: PaymentDetails = {
  gcash: { number: '09XX XXX XXXX', name: 'Barangay Santiago' },
  maya: { number: '09XX XXX XXXX', name: 'Barangay Santiago' },
  bank: { account: 'XXXX-XXXX-XXXX', name: 'Barangay Santiago', bank: 'BDO' },
}

export function PaymentIntegration({
  amount,
  description,
  referenceId,
  onSuccess,
  onError,
}: PaymentIntegrationProps) {
  const [method, setMethod] = useState<PaymentMethod>('gcash')
  const [referenceNumber, setReferenceNumber] = useState('')
  const [senderName, setSenderName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text.replace(/\s/g, ''))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSubmit = async () => {
    if (!referenceNumber.trim()) {
      setError('Pakienter ang reference number ng iyong payment')
      return
    }
    if (!senderName.trim()) {
      setError('Pakienter ang pangalan ng nagbayad')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method,
          referenceNumber,
          senderName,
          amount,
          documentReferenceId: referenceId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Payment verification failed')
      }

      setSuccess(true)
      onSuccess(data.transactionId)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment failed'
      setError(errorMessage)
      onError?.(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold">Payment Submitted</h3>
            <p className="text-sm text-muted-foreground">
              Ive-verify namin ang iyong payment. Makakatanggap ka ng notification kapag na-confirm na.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment
        </CardTitle>
        <CardDescription>
          Piliin ang payment method at i-submit ang payment details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Amount Display */}
        <div className="rounded-lg bg-muted p-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Amount</span>
            <span className="text-2xl font-bold">₱{amount.toFixed(2)}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
          <p className="text-xs text-muted-foreground">Ref: {referenceId}</p>
        </div>

        {/* Payment Method Selection */}
        <div className="space-y-3">
          <Label>Payment Method</Label>
          <RadioGroup
            value={method}
            onValueChange={(v) => setMethod(v as PaymentMethod)}
            className="grid grid-cols-3 gap-2"
          >
            <Label
              htmlFor="gcash"
              className={`flex flex-col items-center gap-2 rounded-lg border-2 p-3 cursor-pointer transition-colors ${
                method === 'gcash' ? 'border-primary bg-primary/5' : 'border-muted'
              }`}
            >
              <RadioGroupItem value="gcash" id="gcash" className="sr-only" />
              <div className="h-8 w-8 rounded bg-blue-500 flex items-center justify-center">
                <Smartphone className="h-5 w-5 text-white" />
              </div>
              <span className="text-xs font-medium">GCash</span>
            </Label>
            <Label
              htmlFor="maya"
              className={`flex flex-col items-center gap-2 rounded-lg border-2 p-3 cursor-pointer transition-colors ${
                method === 'maya' ? 'border-primary bg-primary/5' : 'border-muted'
              }`}
            >
              <RadioGroupItem value="maya" id="maya" className="sr-only" />
              <div className="h-8 w-8 rounded bg-green-500 flex items-center justify-center">
                <Smartphone className="h-5 w-5 text-white" />
              </div>
              <span className="text-xs font-medium">Maya</span>
            </Label>
            <Label
              htmlFor="bank"
              className={`flex flex-col items-center gap-2 rounded-lg border-2 p-3 cursor-pointer transition-colors ${
                method === 'bank' ? 'border-primary bg-primary/5' : 'border-muted'
              }`}
            >
              <RadioGroupItem value="bank" id="bank" className="sr-only" />
              <div className="h-8 w-8 rounded bg-orange-500 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-white" />
              </div>
              <span className="text-xs font-medium">Bank</span>
            </Label>
          </RadioGroup>
        </div>

        <Separator />

        {/* Payment Instructions */}
        <div className="space-y-3">
          <Label>Payment Instructions</Label>
          <div className="rounded-lg border p-4 space-y-2">
            {method === 'gcash' && (
              <>
                <p className="text-sm">Send payment to:</p>
                <div className="flex items-center justify-between bg-muted p-2 rounded">
                  <span className="font-mono text-lg">{PAYMENT_DETAILS.gcash.number}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(PAYMENT_DETAILS.gcash.number)}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">Name: {PAYMENT_DETAILS.gcash.name}</p>
              </>
            )}
            {method === 'maya' && (
              <>
                <p className="text-sm">Send payment to:</p>
                <div className="flex items-center justify-between bg-muted p-2 rounded">
                  <span className="font-mono text-lg">{PAYMENT_DETAILS.maya.number}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(PAYMENT_DETAILS.maya.number)}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">Name: {PAYMENT_DETAILS.maya.name}</p>
              </>
            )}
            {method === 'bank' && (
              <>
                <p className="text-sm">Bank: {PAYMENT_DETAILS.bank.bank}</p>
                <div className="flex items-center justify-between bg-muted p-2 rounded">
                  <span className="font-mono text-lg">{PAYMENT_DETAILS.bank.account}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(PAYMENT_DETAILS.bank.account)}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">Name: {PAYMENT_DETAILS.bank.name}</p>
              </>
            )}
          </div>
        </div>

        <Separator />

        {/* Payment Verification Form */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="refNumber">Reference Number</Label>
            <Input
              id="refNumber"
              placeholder="Enter reference/transaction number"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="senderName">Pangalan ng Nagbayad</Label>
            <Input
              id="senderName"
              placeholder="Enter name as it appears in payment"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full"
          size="lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Verifying...
            </>
          ) : (
            'Submit Payment Details'
          )}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          Ive-verify ng staff ang iyong payment sa loob ng 24 hours.
        </p>
      </CardContent>
    </Card>
  )
}
