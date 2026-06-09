import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { NextRequest, NextResponse } from 'next/server';

const systemPrompt = `You are a helpful and friendly AI assistant for Barangay Santiago Portal. You help residents and officials with:
- Document requests and status
- General barangay information
- Community services
- Announcements and updates
- Complaint tracking
- Appointment scheduling
- Emergency information

Be professional, courteous, and provide accurate information. If you don't know something, direct them to the appropriate office or official.`;

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      );
    }

    const response = await generateText({
      model: openai('gpt-4-turbo'),
      system: systemPrompt,
      messages: messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
      maxTokens: 500,
      temperature: 0.7,
    });

    return NextResponse.json({
      message: response.text,
    });
  } catch (error: any) {
    console.error('[Chat API Error]', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}
