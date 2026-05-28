/**
 * Analytics and insights utilities
 * Provides functions for data analysis, trend calculation, and visualization
 */

export interface ChartData {
  date: string
  value: number
  label?: string
}

export interface Metric {
  label: string
  value: number
  unit: string
  change: number
  changePercent: number
  trend: 'up' | 'down' | 'stable'
}

export interface TimeSeriesData {
  timestamp: Date
  value: number
  label?: string
}

/**
 * Format metric with proper units and styling
 */
export function formatMetric(value: number, unit: string): string {
  if (unit === '%') {
    return `${Math.round(value * 100) / 100}%`
  }

  if (unit === 'ms') {
    return `${Math.round(value)}ms`
  }

  // Add thousand separators for large numbers
  return value.toLocaleString('en-US', {
    maximumFractionDigits: unit === 'users' ? 0 : 2,
  })
}

/**
 * Calculate moving average
 */
export function calculateMovingAverage(
  data: number[],
  windowSize: number = 7
): number[] {
  const result: number[] = []

  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - Math.floor(windowSize / 2))
    const end = Math.min(data.length, i + Math.ceil(windowSize / 2))
    const window = data.slice(start, end)
    const avg = window.reduce((a, b) => a + b, 0) / window.length
    result.push(avg)
  }

  return result
}

/**
 * Calculate trend from time series data
 */
export function calculateTrend(
  current: number,
  previous: number
): { trend: 'up' | 'down' | 'stable'; percent: number } {
  if (previous === 0) {
    return { trend: current > 0 ? 'up' : 'stable', percent: current > 0 ? 100 : 0 }
  }

  const percent = Math.round(((current - previous) / previous) * 100)
  const trend = percent > 5 ? 'up' : percent < -5 ? 'down' : 'stable'

  return { trend, percent }
}

/**
 * Group data by time period
 */
export function groupByPeriod(
  data: TimeSeriesData[],
  period: 'day' | 'week' | 'month'
): Record<string, number> {
  const grouped: Record<string, number> = {}

  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })

  data.forEach(item => {
    const date = new Date(item.timestamp)

    let key: string
    if (period === 'day') {
      key = dateFormatter.format(date)
    } else if (period === 'week') {
      const weekStart = getWeekStart(date)
      key = dateFormatter.format(weekStart)
    } else {
      // month
      key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    }

    grouped[key] = (grouped[key] || 0) + item.value
  })

  return grouped
}

/**
 * Get the start of the week for a given date
 */
function getWeekStart(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day
  return new Date(d.setDate(diff))
}

/**
 * Calculate percentile
 */
export function calculatePercentile(data: number[], percentile: number): number {
  if (data.length === 0) return 0

  const sorted = [...data].sort((a, b) => a - b)
  const index = Math.ceil((percentile / 100) * sorted.length) - 1

  return sorted[Math.max(0, index)]
}

/**
 * Calculate standard deviation
 */
export function calculateStdDev(data: number[]): number {
  if (data.length < 2) return 0

  const mean = data.reduce((a, b) => a + b) / data.length
  const squareDiffs = data.map(value => Math.pow(value - mean, 2))
  const avgSquareDiff = squareDiffs.reduce((a, b) => a + b) / data.length

  return Math.sqrt(avgSquareDiff)
}

/**
 * Detect anomalies using statistical methods
 */
export function detectAnomalies(
  data: number[],
  threshold: number = 2 // standard deviations
): number[] {
  const mean = data.reduce((a, b) => a + b) / data.length
  const stdDev = calculateStdDev(data)

  return data
    .map((value, index) => ({
      index,
      value,
      zscore: Math.abs((value - mean) / (stdDev || 1)),
    }))
    .filter(item => item.zscore > threshold)
    .map(item => item.index)
}

/**
 * Format percentage change
 */
export function formatPercentChange(change: number): string {
  const sign = change > 0 ? '+' : ''
  return `${sign}${Math.round(change)}%`
}

/**
 * Get color for metric based on status
 */
export function getMetricColor(
  value: number,
  thresholds: { good: number; warning: number; critical: number }
): 'green' | 'yellow' | 'red' {
  if (value >= thresholds.good) return 'green'
  if (value >= thresholds.warning) return 'yellow'
  return 'red'
}

/**
 * Calculate metrics summary
 */
export function calculateSummary(metrics: Metric[]): {
  averageChange: number
  improvingMetrics: number
  decliningMetrics: number
  stableMetrics: number
} {
  const changes = metrics.map(m => m.changePercent)
  const averageChange = changes.reduce((a, b) => a + b) / metrics.length

  const improvingMetrics = metrics.filter(m => m.trend === 'up').length
  const decliningMetrics = metrics.filter(m => m.trend === 'down').length
  const stableMetrics = metrics.filter(m => m.trend === 'stable').length

  return {
    averageChange: Math.round(averageChange * 100) / 100,
    improvingMetrics,
    decliningMetrics,
    stableMetrics,
  }
}

/**
 * Generate color palette for charts
 */
export function getChartColors(count: number): string[] {
  const colors = [
    '#3b82f6', // blue
    '#ef4444', // red
    '#10b981', // green
    '#f59e0b', // amber
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#06b6d4', // cyan
    '#f97316', // orange
  ]

  // Cycle through colors if count exceeds available colors
  return Array.from({ length: count }, (_, i) => colors[i % colors.length])
}

/**
 * Format large numbers with abbreviations
 */
export function formatNumber(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`
  }

  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`
  }

  return value.toString()
}

/**
 * Calculate confidence interval
 */
export function calculateConfidenceInterval(
  data: number[],
  confidenceLevel: number = 0.95
): { lower: number; upper: number; margin: number } {
  if (data.length < 2) return { lower: 0, upper: 0, margin: 0 }

  const mean = data.reduce((a, b) => a + b) / data.length
  const stdDev = calculateStdDev(data)
  const margin = 1.96 * (stdDev / Math.sqrt(data.length))

  return {
    lower: mean - margin,
    upper: mean + margin,
    margin,
  }
}
