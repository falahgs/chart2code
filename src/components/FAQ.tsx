'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const FAQ = () => {
  const { isArabic } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = {
    en: [
      {
        question: 'What types of analysis does AI Vision Hub offer?',
        answer: 'We offer four main types of analysis: Video Analysis for detailed content insights, YouTube Video Analysis for direct URL processing, Object Detection in images, and structured JSON output for all analyses.'
      },
      {
        question: 'How accurate is the AI analysis?',
        answer: 'Our platform uses Google\'s Gemini Pro AI model, providing high-accuracy analysis for videos and images. Results include confidence scores for object detection and detailed content analysis.'
      },
      {
        question: 'What file formats and sizes are supported?',
        answer: 'We support MP4 and WebM video formats (up to 100MB), JPG and PNG images (up to 10MB), and any valid YouTube URL for video analysis.'
      },
      {
        question: 'Can I get the analysis results in different formats?',
        answer: 'Yes, all analysis results are available in both human-readable markdown format and structured JSON format for technical integration.'
      },
      {
        question: 'Is the platform available in multiple languages?',
        answer: 'Yes, the entire platform including analysis results is available in both English and Arabic, with high-quality translations.'
      }
    ],
    ar: [
      {
        question: 'ما هي أنواع التحليل التي يقدمها AI Vision Hub؟',
        answer: 'نقدم أربعة أنواع رئيسية من التحليل: تحليل الفيديو للحصول على رؤى مفصلة للمحتوى، وتحليل فيديو يوتيوب لمعالجة الروابط المباشرة، وكشف الكائنات في الصور، ومخرجات JSON منظمة لجميع التحليلات.'
      },
      {
        question: 'ما مدى دقة تحليل الذكاء الاصطناعي؟',
        answer: 'تستخدم منصتنا نموذج Google Gemini Pro للذكاء الاصطناعي، مما يوفر تحليلاً عالي الدقة للفيديو والصور. تتضمن النتائج درجات الثقة لكشف الكائنات وتحليل مفصل للمحتوى.'
      },
      {
        question: 'ما هي صيغ وأحجام الملفات المدعومة؟',
        answer: 'ندعم صيغ الفيديو MP4 و WebM (حتى 100 ميجابايت)، وصور JPG و PNG (حتى 10 ميجابايت)، وأي رابط يوتيوب صالح لتحليل الفيديو.'
      },
      {
        question: 'هل يمكنني الحصول على نتائج التحليل بتنسيقات مختلفة؟',
        answer: 'نعم، جميع نتائج التحليل متاحة بتنسيق markdown سهل القراءة وتنسيق JSON منظم للتكامل التقني.'
      },
      {
        question: 'هل المنصة متوفرة بلغات متعددة؟',
        answer: 'نعم، المنصة بأكملها بما في ذلك نتائج التحليل متوفرة باللغتين الإنجليزية والعربية، مع ترجمات عالية الجودة.'
      }
    ]
  };

  const currentFaqs = isArabic ? faqs.ar : faqs.en;

  return (
    <div className="mt-16">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
        {isArabic ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
      </h2>
      <div className="max-w-3xl mx-auto">
        {currentFaqs.map((faq, index) => (
          <div
            key={index}
            className="mb-4 border-b border-gray-200 last:border-0"
          >
            <button
              className="w-full text-left py-4 flex justify-between items-center focus:outline-none"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <span className="font-semibold text-lg text-gray-800">
                {faq.question}
              </span>
              {openIndex === index ? (
                <FaChevronUp className="text-blue-500" />
              ) : (
                <FaChevronDown className="text-gray-400" />
              )}
            </button>
            {openIndex === index && (
              <div className="pb-4 text-gray-600 animate-fadeIn">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ; 