import { NextRequest, NextResponse } from 'next/server'
import { OpenAI } from '@vercel/ai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

function getAppBaseUrl() {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
}

async function fetchResidentDocuments(residentId: string) {
  if (!residentId) return []
  try {
    const baseUrl = getAppBaseUrl()
    const res = await fetch(`${baseUrl}/api/documents?residentId=${residentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (!res.ok) return []
    const data = await res.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Error fetching resident documents for AI context:', error)
    return []
  }
}

function createSystemPrompt(portalType: string, documentContext: any[]) {
  const baseInstructions = `You are the Barangay Santiago AI assistant. Respond in fluent Filipino with a respectful, helpful tone. Keep answers concise and clear for residents and officials.`
  const residentInstructions = `If the user is a resident, help them with document requests, status tracking, appointment scheduling, QR verification, and community services. Use the resident's document history to mention their existing requests and statuses when relevant.`
  const officialInstructions = `If the user is an official, answer with administrative insights, status summaries, report generation guidance, and next steps for document processing and emergency notifications.`

  let contextText = ''
  if (documentContext.length > 0) {
    contextText = `\n\nResident document context:\n` + documentContext.map((doc) => `- ${doc.documentType || doc.type}: ${doc.status} (requested on ${doc.createdAt || doc.date || 'unknown'})`).join('\n')
  }

  const formPrompt = `If the user asks to request a document or wants help filling out a request form, include a suggested form payload in JSON format inside <SUGGESTED_FORM>...</SUGGESTED_FORM> with keys like documentType, purpose, notes, and requestedBy. Do not include the raw JSON in the visible answer outside the markers.`

  return [baseInstructions, portalType === 'official' ? officialInstructions : residentInstructions, contextText, formPrompt].filter(Boolean).join(' ')
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { question, portalType = 'resident', residentId } = body

    if (!question || typeof question !== 'string') {
      return NextResponse.json({ error: 'Missing question' }, { status: 400 })
    }

    const residentContext = residentId ? await fetchResidentDocuments(residentId) : []
    const prompt = createSystemPrompt(portalType, residentContext)

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: prompt },
        { role: 'user', content: question }
      ],
      temperature: 0.4,
      max_tokens: 512,
    })

    const content = response.output?.[0]?.content
    const text = Array.isArray(content)
      ? content.map((item: any) => item?.text || '').join('')
      : typeof content === 'string'
        ? content
        : ''

    return NextResponse.json({ answer: text || 'Pasensya na, hindi available ang sagot ngayon.' })
  } catch (error) {
    console.error('AI assistant error:', error)
    return NextResponse.json({ error: 'AI assistant failed to generate a response' }, { status: 500 })
  }
}
