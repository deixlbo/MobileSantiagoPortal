'use client'

import { useState, useEffect, useCallback } from 'react'
import { Fingerprint, Smartphone, Shield, AlertCircle, Loader2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface BiometricAuthProps {
  onSuccess: (credential: PublicKeyCredential) => void
  onError?: (error: Error) => void
  mode: 'register' | 'authenticate'
  userId?: string
  userName?: string
}

export function BiometricAuth({ 
  onSuccess, 
  onError, 
  mode, 
  userId = 'user-id',
  userName = 'User'
}: BiometricAuthProps) {
  const [isSupported, setIsSupported] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    // Check WebAuthn support
    const checkSupport = async () => {
      if (window.PublicKeyCredential) {
        try {
          const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
          setIsSupported(available)
        } catch {
          setIsSupported(false)
        }
      }
    }
    checkSupport()
  }, [])

  const generateChallenge = () => {
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    return array
  }

  const handleRegister = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const challenge = generateChallenge()

      const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
        challenge,
        rp: {
          name: 'Barangay Santiago Portal',
          id: window.location.hostname,
        },
        user: {
          id: new TextEncoder().encode(userId),
          name: userName,
          displayName: userName,
        },
        pubKeyCredParams: [
          { alg: -7, type: 'public-key' },   // ES256
          { alg: -257, type: 'public-key' }, // RS256
        ],
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          userVerification: 'required',
          residentKey: 'preferred',
        },
        timeout: 60000,
        attestation: 'none',
      }

      const credential = await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions,
      }) as PublicKeyCredential

      if (credential) {
        setSuccess(true)
        onSuccess(credential)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Biometric registration failed'
      setError(errorMessage)
      onError?.(err instanceof Error ? err : new Error(errorMessage))
    } finally {
      setIsLoading(false)
    }
  }, [userId, userName, onSuccess, onError])

  const handleAuthenticate = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const challenge = generateChallenge()

      const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
        challenge,
        rpId: window.location.hostname,
        userVerification: 'required',
        timeout: 60000,
      }

      const credential = await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions,
      }) as PublicKeyCredential

      if (credential) {
        setSuccess(true)
        onSuccess(credential)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Biometric authentication failed'
      setError(errorMessage)
      onError?.(err instanceof Error ? err : new Error(errorMessage))
    } finally {
      setIsLoading(false)
    }
  }, [onSuccess, onError])

  if (!isSupported) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Hindi supported ang biometric authentication sa device na ito. Gumamit ng password login.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-2">
          {success ? (
            <Check className="h-8 w-8 text-primary" />
          ) : (
            <Fingerprint className="h-8 w-8 text-primary" />
          )}
        </div>
        <CardTitle className="text-lg">
          {mode === 'register' ? 'I-setup ang Biometric Login' : 'Biometric Login'}
        </CardTitle>
        <CardDescription>
          {mode === 'register' 
            ? 'Gamitin ang fingerprint o face recognition para sa mabilis na login'
            : 'I-scan ang iyong fingerprint o face para mag-login'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success ? (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">
              {mode === 'register' 
                ? 'Na-register na ang iyong biometric credential!'
                : 'Authenticated successfully!'
              }
            </p>
          </div>
        ) : (
          <>
            <Button
              onClick={mode === 'register' ? handleRegister : handleAuthenticate}
              disabled={isLoading}
              className="w-full gap-2"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  {mode === 'register' ? 'Nire-register...' : 'Ini-authenticate...'}
                </>
              ) : (
                <>
                  <Fingerprint className="h-5 w-5" />
                  {mode === 'register' ? 'I-register ang Biometric' : 'Login gamit ang Biometric'}
                </>
              )}
            </Button>

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Smartphone className="h-3 w-3" />
                <span>Face ID / Touch ID</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                <span>Secure & Private</span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
