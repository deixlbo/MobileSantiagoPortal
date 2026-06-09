/**
 * Client-side rate limiting utility using localStorage
 * Helps prevent excessive API calls and respects server-side rate limits
 */

const RATE_LIMIT_PREFIX = 'ratelimit_'
const DEFAULT_COOLDOWN = 60 // seconds

interface RateLimitStore {
  lastAttempt: number
  cooldown: number
}

export function getRateLimitKey(action: string, identifier: string): string {
  return `${RATE_LIMIT_PREFIX}${action}:${identifier}`
}

export function checkRateLimit(
  action: string,
  identifier: string,
  cooldownSeconds: number = DEFAULT_COOLDOWN
): { allowed: boolean; secondsRemaining: number } {
  try {
    const key = getRateLimitKey(action, identifier)
    const stored = localStorage.getItem(key)
    
    if (!stored) {
      return { allowed: true, secondsRemaining: 0 }
    }

    const data: RateLimitStore = JSON.parse(stored)
    const now = Date.now()
    const timePassed = (now - data.lastAttempt) / 1000
    const secondsRemaining = Math.ceil(cooldownSeconds - timePassed)

    if (secondsRemaining <= 0) {
      localStorage.removeItem(key)
      return { allowed: true, secondsRemaining: 0 }
    }

    return { allowed: false, secondsRemaining }
  } catch (error) {
    console.error('[v0] Rate limit check error:', error)
    return { allowed: true, secondsRemaining: 0 }
  }
}

export function setRateLimit(
  action: string,
  identifier: string,
  cooldownSeconds: number = DEFAULT_COOLDOWN
): void {
  try {
    const key = getRateLimitKey(action, identifier)
    const data: RateLimitStore = {
      lastAttempt: Date.now(),
      cooldown: cooldownSeconds,
    }
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error('[v0] Rate limit set error:', error)
  }
}

export function clearRateLimit(action: string, identifier: string): void {
  try {
    const key = getRateLimitKey(action, identifier)
    localStorage.removeItem(key)
  } catch (error) {
    console.error('[v0] Rate limit clear error:', error)
  }
}

export function getRemainingCooldown(
  action: string,
  identifier: string,
  expectedCooldown: number = DEFAULT_COOLDOWN
): number {
  const { secondsRemaining } = checkRateLimit(action, identifier, expectedCooldown)
  return secondsRemaining
}
