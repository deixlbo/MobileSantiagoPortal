import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function POST(request: NextRequest) {
  try {
    const { documentContent, documentType } = await request.json();

    if (!documentContent || !documentType) {
      return NextResponse.json(
        { error: 'Document content and type are required' },
        { status: 400 }
      );
    }

    // Use AI to validate document
    const validationPrompt = `Analyze the following ${documentType} document and validate it for correctness, completeness, and compliance. 
    Document: ${documentContent}
    
    Provide:
    1. Overall validation status (valid/invalid)
    2. Any missing required information
    3. Issues found (if any)
    4. Recommendations for improvement
    
    Format response as JSON with fields: status, missingInfo, issues, recommendations`;

    const { text } = await generateText({
      model: openai('gpt-4-turbo'),
      prompt: validationPrompt,
      maxTokens: 500,
    });

    let validationResult;
    try {
      // Try to parse JSON response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      validationResult = jsonMatch ? JSON.parse(jsonMatch[0]) : { raw: text };
    } catch {
      validationResult = { raw: text };
    }

    return NextResponse.json({
      success: true,
      validation: validationResult,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[Document Validation Error]', error);
    return NextResponse.json(
      { error: 'Failed to validate document' },
      { status: 500 }
    );
  }
}
