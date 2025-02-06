import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleAIFileManager, FileState } from '@google/generative-ai/server';
import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

const API_KEY = process.env.GEMINI_API_KEY as string;

const prompts = {
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
   - التوقيتات والأحداث المهمة
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

يرجى تنسيق المخرجات بطريقة واضحة ومنظمة باستخدام markdown لسهولة القراءة.
الرجاء تقديم الإجابة باللغة العربية.`
};

const errorMessages = {
  en: {
    noFile: 'No video file provided',
    processingFailed: 'Video processing failed',
    generalError: 'Failed to process video'
  },
  ar: {
    noFile: 'لم يتم تحديد ملف فيديو',
    processingFailed: 'فشلت معالجة الفيديو',
    generalError: 'حدث خطأ أثناء معالجة الفيديو'
  }
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('video') as File;
    const language = (formData.get('language') as string) || 'en';
    const messages = errorMessages[language as keyof typeof errorMessages];

    if (!file) {
      return NextResponse.json(
        { error: messages.noFile },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const tempFilePath = join(tmpdir(), `upload-${Date.now()}-${file.name}`);
    await writeFile(tempFilePath, buffer);

    const fileManager = new GoogleAIFileManager(API_KEY);
    const uploadResponse = await fileManager.uploadFile(tempFilePath, {
      mimeType: file.type,
      displayName: file.name,
    });

    let processedFile = await fileManager.getFile(uploadResponse.file.name);
    let attempts = 0;
    const maxAttempts = 30;

    while (processedFile.state === FileState.PROCESSING && attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      processedFile = await fileManager.getFile(uploadResponse.file.name);
      attempts++;
    }

    if (processedFile.state === FileState.FAILED || attempts >= maxAttempts) {
      throw new Error(messages.processingFailed);
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const result = await model.generateContent([
      {
        fileData: {
          mimeType: processedFile.mimeType,
          fileUri: processedFile.uri,
        },
      },
      { text: prompts[language as keyof typeof prompts] },
    ]);

    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ analysis: text });

  } catch (error) {
    console.error('Error processing video:', error);
    const lang = (request.formData && await request.formData().then(form => form.get('language'))) || 'en';
    const messages = errorMessages[lang as keyof typeof errorMessages];
    
    return NextResponse.json(
      { error: messages.generalError },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}; 