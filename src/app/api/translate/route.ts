import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.GEMINI_API_KEY as string;

const translationPrompt = {
  ar: `قم بترجمة النص التالي إلى اللغة العربية بشكل احترافي.
       قواعد مهمة:
       1. الحفاظ على التنسيق والهيكل
       2. الحفاظ على المصطلحات التقنية واضحة ودقيقة
       3. استخدام اللغة العربية الفصحى
       4. الحفاظ على القوائم والأرقام والرموز الخاصة
       5. عدم تغيير أي نصوص برمجية أو محتوى تقني

       النص المراد ترجمته:
       `
};

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: 'لم يتم توفير نص للترجمة' },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const result = await model.generateContent([
      {
        text: `${translationPrompt.ar}${text}`
      },
    ]);

    if (!result.response) {
      throw new Error('فشلت عملية الترجمة');
    }

    const translatedText = result.response.text();

    return NextResponse.json({ 
      translatedText,
      success: true 
    });

  } catch (error) {
    console.error('خطأ في الترجمة:', error);
    return NextResponse.json(
      { 
        error: 'فشلت عملية الترجمة',
        details: error instanceof Error ? error.message : 'خطأ غير معروف'
      },
      { status: 500 }
    );
  }
} 