import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_KEY = process.env.GEMINI_API_KEY as string;

const analyzePrompt = {
  en: `As an expert video analyst, please analyze this video comprehensively and provide a structured output following these guidelines:

1. Content Analysis:
   - Main topic and key themes
   - Key points and insights
   - Important timestamps and events
   - Visual elements and their significance

2. Technical Analysis:
   - Visual quality assessment
   - Audio clarity (if present)
   - Production elements used
   - Technical recommendations

3. Knowledge Extraction:
   - Core concepts explained
   - Technical terms used
   - Methodologies presented
   - Data points mentioned

4. Educational Assessment:
   - Create 5 expert-level questions
   - Provide detailed answers
   - Include explanation for each answer
   - Add difficulty level for each question

Please format the output in a clear, structured manner using markdown for better readability.`,

  ar: `كمحلل فيديو خبير، يرجى تحليل هذا الفيديو بشكل شامل وتقديم مخرجات منظمة وفقاً للإرشادات التالية:

1. تحليل المحتوى:
   - الموضوع الرئيسي والمحاور الأساسية
   - النقاط الرئيسية والرؤى
   - التوقيتات والأحداث الهمة
   - العناصر المرئية وأهميتها

2. التحليل التقني:
   - تقييم جودة الصورة
   - وضوح الصوت (إن وجد)
   - عناصر الإنتاج المستخدمة
   - التوصيات التقنية

3. استخراج المعرفة:
   - المفاهيم الأساسية الموضحة
   - المصطلحات التقنية المستخدمة
   - المنهجيات المقدمة
   - النقاط البيانية المذكورة

4. التقييم التعليمي:
   - إنشاء 5 أسئلة بمستوى متقدم
   - تقديم إجابات مفصلة
   - إضافة شرح لكل إجابة
   - تحديد مستوى الصعوبة لكل سؤال

يرجى تنسيق المخرجات بطريقة واضحة ومنظمة باستخدام markdown لسهولة القراءة.`
};

function getVideoId(url: string): string {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : '';
}

async function getVideoThumbnail(videoId: string): Promise<string> {
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  try {
    const response = await axios.get(thumbnailUrl, { responseType: 'arraybuffer' });
    return Buffer.from(response.data).toString('base64');
  } catch (error) {
    // Fallback to high quality thumbnail if maxres is not available
    const hqThumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    const hqResponse = await axios.get(hqThumbnailUrl, { responseType: 'arraybuffer' });
    return Buffer.from(hqResponse.data).toString('base64');
  }
}

export async function POST(request: NextRequest) {
  try {
    const { url, language = 'en' } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'No YouTube URL provided' },
        { status: 400 }
      );
    }

    const videoId = getVideoId(url);
    if (!videoId) {
      return NextResponse.json(
        { error: 'Invalid YouTube URL' },
        { status: 400 }
      );
    }

    // Get video thumbnail
    const thumbnailBase64 = await getVideoThumbnail(videoId);

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    // Analyze video
    const result = await model.generateContent([
      {
        inlineData: {
          data: thumbnailBase64,
          mimeType: 'image/jpeg',
        },
      },
      {
        text: `Please analyze this YouTube video (${url})\n\n${analyzePrompt[language as keyof typeof analyzePrompt]}`
      },
    ]);

    const response = await result.response;
    const text = response.text();

    return NextResponse.json({
      analysis: text,
      videoInfo: {
        videoId,
        thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      }
    });

  } catch (error) {
    console.error('Error analyzing YouTube video:', error);
    return NextResponse.json(
      { 
        error: 'Failed to analyze YouTube video',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 