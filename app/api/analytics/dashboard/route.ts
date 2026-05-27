import { NextRequest, NextResponse } from 'next/server'

// Initialize Supabase client only if credentials are available
const getSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    return null
  }

  const { createClient } = require('@supabase/supabase-js')
  return createClient(supabaseUrl, supabaseServiceKey)
}

/**
 * Get analytics dashboard data
 * Provides overview metrics, trends, and insights
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30' // days
    const userId = searchParams.get('userId')

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - parseInt(period))

    // Fetch various metrics in parallel
    const [
      activeUsersData,
      documentsProcessedData,
      certificatesIssuedData,
      notificationsData,
      verificationSuccessData,
      userEngagementData,
    ] = await Promise.all([
      getActiveUsers(startDate),
      getDocumentsProcessed(startDate),
      getCertificatesIssued(startDate),
      getNotificationsStats(startDate),
      getVerificationSuccess(startDate),
      getUserEngagement(startDate),
    ])

    // Calculate trends
    const previousStartDate = new Date(startDate)
    previousStartDate.setDate(previousStartDate.getDate() - parseInt(period))

    const [
      previousActiveUsers,
      previousDocuments,
      previousCertificates,
    ] = await Promise.all([
      getActiveUsers(previousStartDate, startDate),
      getDocumentsProcessed(previousStartDate, startDate),
      getCertificatesIssued(previousStartDate, startDate),
    ])

    const trends = {
      activeUsers: calculateTrend(previousActiveUsers, activeUsersData.total),
      documentsProcessed: calculateTrend(previousDocuments, documentsProcessedData.total),
      certificatesIssued: calculateTrend(previousCertificates, certificatesIssuedData.total),
    }

    return NextResponse.json({
      success: true,
      period,
      metrics: {
        activeUsers: activeUsersData,
        documentsProcessed: documentsProcessedData,
        certificatesIssued: certificatesIssuedData,
        notificationsStats: notificationsData,
        verificationSuccess: verificationSuccessData,
        userEngagement: userEngagementData,
      },
      trends,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Dashboard analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}

/**
 * Get active users count
 */
async function getActiveUsers(
  fromDate: Date,
  toDate?: Date
) {
  const endDate = toDate || new Date()

  const { data, error } = await supabase
    .from('user_activity')
    .select('user_id, activity_type, created_at')
    .gte('created_at', fromDate.toISOString())
    .lte('created_at', endDate.toISOString())

  if (error) {
    console.error('Error fetching active users:', error)
    return { total: 0, breakdown: {} }
  }

  const uniqueUsers = new Set(data?.map(d => d.user_id) || [])
  const breakdown = data?.reduce((acc: Record<string, number>, item) => {
    acc[item.activity_type] = (acc[item.activity_type] || 0) + 1
    return acc
  }, {}) || {}

  return {
    total: uniqueUsers.size,
    breakdown,
  }
}

/**
 * Get documents processed count
 */
async function getDocumentsProcessed(
  fromDate: Date,
  toDate?: Date
) {
  const endDate = toDate || new Date()

  const { data, error } = await supabase
    .from('ocr_extractions')
    .select('document_type, status')
    .gte('processed_at', fromDate.toISOString())
    .lte('processed_at', endDate.toISOString())

  if (error) {
    console.error('Error fetching documents:', error)
    return { total: 0, byType: {}, byStatus: {} }
  }

  const byType = data?.reduce((acc: Record<string, number>, item) => {
    acc[item.document_type] = (acc[item.document_type] || 0) + 1
    return acc
  }, {}) || {}

  const byStatus = data?.reduce((acc: Record<string, number>, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1
    return acc
  }, {}) || {}

  return {
    total: data?.length || 0,
    byType,
    byStatus,
  }
}

/**
 * Get certificates issued count
 */
async function getCertificatesIssued(
  fromDate: Date,
  toDate?: Date
) {
  const endDate = toDate || new Date()

  const { data, error } = await supabase
    .from('certificates')
    .select('certificate_type, status')
    .gte('issued_at', fromDate.toISOString())
    .lte('issued_at', endDate.toISOString())

  if (error) {
    console.error('Error fetching certificates:', error)
    return { total: 0, byType: {}, byStatus: {} }
  }

  const byType = data?.reduce((acc: Record<string, number>, item) => {
    acc[item.certificate_type] = (acc[item.certificate_type] || 0) + 1
    return acc
  }, {}) || {}

  const byStatus = data?.reduce((acc: Record<string, number>, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1
    return acc
  }, {}) || {}

  return {
    total: data?.length || 0,
    byType,
    byStatus,
  }
}

/**
 * Get notifications statistics
 */
async function getNotificationsStats(fromDate: Date) {
  const { data, error } = await supabase
    .from('notifications_sent')
    .select('category, recipient_count')
    .gte('sent_at', fromDate.toISOString())

  if (error) {
    console.error('Error fetching notifications:', error)
    return { total: 0, byCategory: {}, totalRecipients: 0 }
  }

  const byCategory = data?.reduce((acc: Record<string, number>, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1
    return acc
  }, {}) || {}

  const totalRecipients = data?.reduce((sum, item) => sum + (item.recipient_count || 0), 0) || 0

  return {
    total: data?.length || 0,
    byCategory,
    totalRecipients,
  }
}

/**
 * Get verification success rate
 */
async function getVerificationSuccess(fromDate: Date) {
  const { data, error } = await supabase
    .from('qr_verifications')
    .select('status, verification_method')
    .gte('verified_at', fromDate.toISOString())

  if (error) {
    console.error('Error fetching verifications:', error)
    return { successRate: 0, total: 0, successful: 0, failed: 0, methods: {} }
  }

  const total = data?.length || 0
  const successful = data?.filter(d => d.status === 'verified').length || 0
  const failed = total - successful
  const successRate = total > 0 ? (successful / total) * 100 : 0

  const methods = data?.reduce((acc: Record<string, number>, item) => {
    acc[item.verification_method] = (acc[item.verification_method] || 0) + 1
    return acc
  }, {}) || {}

  return {
    total,
    successful,
    failed,
    successRate: Math.round(successRate * 100) / 100,
    methods,
  }
}

/**
 * Get user engagement metrics
 */
async function getUserEngagement(fromDate: Date) {
  const { data, error } = await supabase
    .from('user_activity')
    .select('user_id, activity_type, created_at')
    .gte('created_at', fromDate.toISOString())

  if (error) {
    console.error('Error fetching engagement:', error)
    return { uniqueUsers: 0, activities: 0, avgActivitiesPerUser: 0, topActivities: {} }
  }

  const uniqueUsers = new Set(data?.map(d => d.user_id) || []).size
  const activities = data?.length || 0
  const avgActivitiesPerUser = uniqueUsers > 0 ? activities / uniqueUsers : 0

  const topActivities = data?.reduce((acc: Record<string, number>, item) => {
    acc[item.activity_type] = (acc[item.activity_type] || 0) + 1
    return acc
  }, {}) || {}

  return {
    uniqueUsers,
    activities,
    avgActivitiesPerUser: Math.round(avgActivitiesPerUser * 100) / 100,
    topActivities,
  }
}

/**
 * Calculate trend percentage
 */
function calculateTrend(previous: number, current: number): number {
  if (previous === 0) return current > 0 ? 100 : 0
  return Math.round(((current - previous) / previous) * 100)
}
