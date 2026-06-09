import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

const documentTemplates: Record<string, string> = {
  permit: `Generate a barangay permit document with proper formatting. Include:
- Header with barangay details
- Permit number and date
- Recipient information
- Permit details and conditions
- Validity period
- Official signatures area`,
  
  certification: `Generate a barangay certification document. Include:
- Official letterhead
- Certification number
- Statement of certification
- Details about what is being certified
- Date and signature blocks
- Barangay seal placeholder`,
  
  letter: `Generate an official barangay letter. Include:
- Date
- Recipient address
- Salutation
- Body with clear message
- Closing
- Signature block`,
  
  resolution: `Generate a barangay resolution. Include:
- Title (e.g., Barangay Resolution No. XXX)
- WHEREAS clauses
- RESOLVED clauses
- Effective date
- Signature blocks for officials`,
  
  ordinance: `Generate a barangay ordinance. Include:
- Title and ordinance number
- Statement of purpose
- Sections with definitions and provisions
- Implementing guidelines
- Penalties for violations
- Effective date
- Signature blocks`,
};

export async function POST(request: NextRequest) {
  try {
    const { documentType, topic, format = 'markdown' } = await request.json();

    if (!documentType || !topic) {
      return NextResponse.json(
        { error: 'Document type and topic are required' },
        { status: 400 }
      );
    }

    const template = documentTemplates[documentType];
    if (!template) {
      return NextResponse.json(
        { error: 'Invalid document type' },
        { status: 400 }
      );
    }

    const prompt = `${template}

Topic/Subject: ${topic}

Generate a professional ${documentType} document about this topic. Format it as valid ${format.toUpperCase()} that can be properly parsed and displayed.`;

    const { text } = await generateText({
      model: openai('gpt-4-turbo'),
      prompt,
      maxTokens: 1500,
    });

    // Parse title and content
    const lines = text.split('\n').filter((l) => l.trim());
    const title = lines[0]?.replace(/^#+\s*/, '').replace(/^\*\*/, '').replace(/\*\*$/, '') || topic;
    const content = lines.join('\n');

    return NextResponse.json({
      success: true,
      document: {
        title,
        content,
        documentType,
        topic,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error('[Document Generation Error]', error);
    return NextResponse.json(
      { error: 'Failed to generate document' },
      { status: 500 }
    );
  }
}
