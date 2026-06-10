import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function GET(request: NextRequest) {
  try {
    // Fetch recent complaints
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: complaints } = await supabase
      .from('complaints')
      .select('*')
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: false });

    if (!complaints || complaints.length === 0) {
      return NextResponse.json({
        success: true,
        insights: {
          trend: 'No complaints data available for the selected period.',
          commonIssues: [],
          recommendations: [
            'Continue monitoring complaint patterns',
            'Maintain quality service delivery',
            'Collect feedback regularly',
          ],
          resolutionRate: 0,
          averageResolutionTime: 'N/A',
        },
      });
    }

    // Calculate metrics
    const resolved = complaints.filter((c: any) => c.status === 'resolved').length;
    const resolutionRate = Math.round((resolved / complaints.length) * 100);

    // Extract categories for analysis
    const categories = complaints
      .map((c: any) => c.category || 'uncategorized')
      .reduce((acc: Record<string, number>, cat: string) => {
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
      }, {});

    const sortedCategories = Object.entries(categories)
      .sort(([, a], [, b]) => b - a)
      .map(([cat]) => cat)
      .slice(0, 5);

    // Generate AI insights
    const analysisPrompt = `Analyze the following complaints data from a barangay for the last 30 days:
Total complaints: ${complaints.length}
Resolved: ${resolved}
Most common categories: ${sortedCategories.join(', ')}

Provide:
1. A brief trend analysis (1-2 sentences)
2. Top 3 common issues or problems (as a numbered list)
3. Top 3 actionable recommendations (as a numbered list)

Format as JSON with fields: trend, commonIssues (array), recommendations (array)`;

    const { text } = await generateText({
      model: openai('gpt-4-turbo'),
      prompt: analysisPrompt,
      maxTokens: 600,
    });

    let aiAnalysis;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      aiAnalysis = jsonMatch ? JSON.parse(jsonMatch[0]) : { trend: text, commonIssues: [], recommendations: [] };
    } catch {
      aiAnalysis = {
        trend: text,
        commonIssues: sortedCategories,
        recommendations: [
          'Implement proactive complaint tracking system',
          'Schedule regular community feedback sessions',
          'Train staff on complaint resolution procedures',
        ],
      };
    }

    // Calculate average resolution time
    const resolutionTimes = complaints
      .filter((c: any) => c.status === 'resolved' && c.updated_at && c.created_at)
      .map((c: any) => {
        const created = new Date(c.created_at);
        const updated = new Date(c.updated_at);
        return Math.round((updated.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
      });

    const avgTime = resolutionTimes.length > 0
      ? Math.round(resolutionTimes.reduce((a, b) => a + b, 0) / resolutionTimes.length)
      : 5;

    return NextResponse.json({
      success: true,
      insights: {
        trend: aiAnalysis.trend || `Out of ${complaints.length} complaints, ${resolved} have been resolved.`,
        commonIssues: aiAnalysis.commonIssues || sortedCategories,
        recommendations: aiAnalysis.recommendations || [
          'Improve response time for new complaints',
          'Follow up on pending complaints more regularly',
          'Document lessons learned for improvement',
        ],
        resolutionRate,
        averageResolutionTime: `${avgTime} days`,
      },
    });
  } catch (error: any) {
    console.error('[Complaints Insights Error]', error);
    return NextResponse.json(
      { error: 'Failed to generate insights' },
      { status: 500 }
    );
  }
}
