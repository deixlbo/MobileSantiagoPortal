'use client'

import { useState, useEffect, useCallback } from 'react'
import { Fingerprint, Smartphone, Shield, AlertCircle, Loader2, Check, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface BiometricAuthProps {
  onSuccess: (credential: PublicKeyCredential | { recoveryCodeUsed: boolean }) => void
  onError?: (error: Error) => void
  mode: 'register' | 'authenticate' | 'recovery'
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
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([])
  const [recoveryCode, setRecoveryCode] = useState('')
  const [showRecoveryCodes, setShowRecoveryCodes] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

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
          name: 'AI-Assisted Barangay Santiago Portal: Smart Document Processing and Resident Service Automation',
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
        // Store credential in database
        const credentialResponse = credential.response as AuthenticatorAttestationResponse
        const credentialId = credential.id
        const publicKeyData = new Uint8Array(credentialResponse.getPublicKey())

        const storageResponse = await fetch('/api/auth/biometric/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            credentialId,
            publicKey: Buffer.from(publicKeyData).toString('base64'),
            credentialRawId: credential.id,
            transports: (credentialResponse as any).getTransports?.() || [],
          }),
        })

        if (!storageResponse.ok) {
          const errorText = await storageResponse.text();
          throw new Error(errorText || `Biometric registration failed: ${storageResponse.status}`)
        }

        const storageData = await storageResponse.json()
        if (storageData.recoveryCodes) {
          setRecoveryCodes(storageData.recoveryCodes)
          setShowRecoveryCodes(true)
        }

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

  const handleRecoveryCode = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/biometric/recovery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          recoveryCode,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Recovery failed: ${response.status}`)
      }

      const data = await response.json()
      if (data.success) {
        setSuccess(true)
        onSuccess({ recoveryCodeUsed: true })
      } else {
        setError(data.error || 'Recovery code invalid')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Recovery failed'
      setError(errorMessage)
      onError?.(err instanceof Error ? err : new Error(errorMessage))
    } finally {
      setIsLoading(false)
    }
  }, [userId, recoveryCode, onSuccess, onError])

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

  const copyToClipboard = (code: string, index: number) => {
    navigator.clipboard.writeText(code)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  if (mode === 'recovery') {
    return (
      <Card className="w-full">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 mb-2">
            <Shield className="h-8 w-8 text-amber-600" />
          </div>
          <CardTitle className="text-lg">Account Recovery</CardTitle>
          <CardDescription>
            Gumamit ng recovery code para mag-access sa iyong account
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
                Recovery code accepted! Mag-setup ng bagong biometric credential.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Recovery Code</label>
                <input
                  type="text"
                  value={recoveryCode}
                  onChange={(e) => setRecoveryCode(e.target.value)}
                  placeholder="e.g., ab12-cd34-ef56-gh78"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <Button
                onClick={handleRecoveryCode}
                disabled={isLoading || !recoveryCode.trim()}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Verifying...
                  </>
                ) : (
                  'Verify Recovery Code'
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
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

        {success && showRecoveryCodes && recoveryCodes.length > 0 ? (
          <div className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                I-save ang mga recovery codes sa secure na lugar. Kailangan mo ito kung hindi mo ma-access ang biometric.
              </AlertDescription>
            </Alert>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Recovery Codes</h4>
              <div className="grid grid-cols-2 gap-2">
                {recoveryCodes.map((code, index) => (
                  <button
                    key={index}
                    onClick={() => copyToClipboard(code, index)}
                    className="text-left p-2 border rounded bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <code className="text-xs font-mono">{code}</code>
                    {copiedIndex === index && (
                      <span className="ml-2 text-xs text-green-600">Copied!</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : success ? (
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
