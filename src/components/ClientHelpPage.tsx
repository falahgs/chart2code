'use client';

import { useLanguage } from '@/context/LanguageContext';
import { 
  FaVideo, 
  FaYoutube, 
  FaImage, 
  FaCode, 
  FaRobot, 
  FaQuestion, 
  FaLightbulb 
} from 'react-icons/fa';

const ClientHelpPage = () => {
  const { isArabic } = useLanguage();

  const helpContent = {
    en: {
      title: 'Help & Guide',
      subtitle: 'Learn how to use AI Vision Hub features',
      features: [
        {
          title: 'Video Analysis',
          icon: FaVideo,
          description: 'Upload and analyze videos to get detailed insights',
          steps: [
            'Upload your video file (supported formats: MP4, WebM)',
            'Wait for AI processing',
            'Get comprehensive analysis in markdown format',
            'Download or copy results'
          ]
        },
        {
          title: 'YouTube Analysis',
          icon: FaYoutube,
          description: 'Analyze any YouTube video using its URL',
          steps: [
            'Paste a valid YouTube video URL',
            'Preview video content',
            'Click analyze to start AI processing',
            'View structured analysis results'
          ]
        },
        {
          title: 'Object Detection',
          icon: FaImage,
          description: 'Detect and analyze objects in images',
          steps: [
            'Upload an image (JPG, PNG)',
            'View automatic object detection',
            'Get detailed object analysis',
            'Export results with bounding boxes'
          ]
        },
        {
          title: 'JSON Analysis',
          icon: FaCode,
          description: 'Get structured data output in JSON format',
          steps: [
            'Choose JSON output mode',
            'Process your media',
            'Get structured JSON data',
            'Use for integration purposes'
          ]
        }
      ],
      tips: [
        'Use high-quality media for better results',
        'Check file size limits before uploading',
        'Allow processing time for accurate analysis',
        'Save your results for future reference'
      ],
      faq: [
        {
          q: 'What file formats are supported?',
          a: 'We support MP4 and WebM for videos, JPG and PNG for images. For YouTube analysis, any valid YouTube URL is supported.'
        },
        {
          q: 'Is there a file size limit?',
          a: 'Yes, videos should be under 100MB and images under 10MB. For YouTube videos, there is no size limit as we analyze them directly via URL.'
        },
        {
          q: 'How accurate is the analysis?',
          a: 'Our AI uses Google Gemini Pro for high accuracy. Video analysis includes content, technical, and educational assessments. Image detection provides precise object locations and attributes.'
        },
        {
          q: 'What information is included in video analysis?',
          a: 'Video analysis includes content summary, key themes, timestamps, visual elements, technical quality assessment, and educational insights with expert-level questions.'
        },
        {
          q: 'How does object detection work?',
          a: 'Our AI identifies objects in images with bounding boxes, providing location coordinates, confidence scores, and detailed attributes for each detected object.'
        },
        {
          q: 'What does YouTube analysis provide?',
          a: 'YouTube analysis offers comprehensive video content analysis, including themes, technical aspects, knowledge extraction, and educational assessment, all without downloading the video.'
        },
        {
          q: 'Can I download the results?',
          a: 'Yes, you can download results in both markdown and JSON formats. Analysis includes visual data, timestamps, and structured information.'
        },
        {
          q: 'Is real-time analysis supported?',
          a: 'Analysis typically takes a few seconds to complete. Processing time may vary based on media length and complexity.'
        },
        {
          q: 'What languages are supported?',
          a: 'The interface and analysis are available in both English and Arabic. Analysis results maintain high quality in both languages.'
        },
        {
          q: 'Can I integrate with other applications?',
          a: 'Yes, using our JSON output format, you can easily integrate analysis results with other applications and systems.'
        }
      ]
    },
    ar: {
      title: 'المساعدة والدليل',
      subtitle: 'تعلم كيفية استخدام ميزات AI Vision Hub',
      features: [
        {
          title: 'تحليل الفيديو',
          icon: FaVideo,
          description: 'قم بتحميل وتحليل مقاطع الفيديو للحصول على رؤى مفصلة',
          steps: [
            'قم بتحميل ملف الفيديو (الصيغ المدعومة: MP4, WebM)',
            'انتظر معالجة الذكاء الاصطناعي',
            'احصل على تحليل شامل بتنسيق markdown',
            'قم بتحميل أو نسخ النتائج'
          ]
        },
        {
          title: 'تحليل يوتيوب',
          icon: FaYoutube,
          description: 'حلل أي فيديو يوتيوب باستخدام الرابط',
          steps: [
            'الصق رابط فيديو يوتيوب صالح',
            'معاينة محتوى الفيديو',
            'انقر على تحليل لبدء المعالجة',
            'عرض نتائج التحليل المنظمة'
          ]
        },
        {
          title: 'كشف الكائنات',
          icon: FaImage,
          description: 'اكتشف وحلل الكائنات في الصور',
          steps: [
            'قم بتحميل صورة (JPG, PNG)',
            'عرض الكشف التلقائي عن الكائنات',
            'احصل على تحليل مفصل للكائنات',
            'تصدير النتائج مع مربعات الإحاطة'
          ]
        },
        {
          title: 'تحليل JSON',
          icon: FaCode,
          description: 'احصل على مخرجات بيانات منظمة بتنسيق JSON',
          steps: [
            'اختر وضع مخرجات JSON',
            'قم بمعالجة الوسائط',
            'احصل على بيانات JSON منظمة',
            'استخدم للأغراض التكاملية'
          ]
        }
      ],
      tips: [
        'استخدم وسائط عالية الجودة للحصول على نتائج أفضل',
        'تحقق من حدود حجم الملف قبل التحميل',
        'اسمح بوقت المعالجة للتحليل الدقيق',
        'احفظ نتائجك للرجوع إليها مستقبلاً'
      ],
      faq: [
        {
          q: 'ما هي صيغ الملفات المدعومة؟',
          a: 'ندعم MP4 و WebM للفيديو، JPG و PNG للصور. لتحليل يوتيوب، أي رابط يوتيوب صالح مدعوم.'
        },
        {
          q: 'هل هناك حد لحجم الملف؟',
          a: 'نعم، يجب أن تكون الفيديوهات أقل من 100 ميجابايت والصور أقل من 10 ميجابايت. لفيديوهات يوتيوب، لا يوجد حد للحجم حيث نحللها مباشرة عبر الرابط.'
        },
        {
          q: 'ما مدى دقة التحليل؟',
          a: 'يستخدم الذكاء الاصطناعي لدينا Google Gemini Pro للحصول على دقة عالية. يشمل تحليل الفيديو تقييمات المحتوى والتقنية والتعليم. يوفر كشف الصور مواقع دقيقة للكائنات وسماتها.'
        },
        {
          q: 'ما هي المعلومات المتضمنة في تحليل الفيديو؟',
          a: 'يتضمن تحليل الفيديو ملخص المحتوى، والمواضيع الرئيسية، والتوقيتات، والعناصر المرئية، وتقييم الجودة التقنية، والرؤى التعليمية مع أسئلة مستوى الخبراء.'
        },
        {
          q: 'كيف يعمل كشف الكائنات؟',
          a: 'يحدد الذكاء الاصطناعي لدينا الكائنات في الصور مع مربعات الإحاطة، ويوفر إحداثيات المواقع، ودرجات الثقة، والسمات التفصيلية لكل كائن تم اكتشافه.'
        },
        {
          q: 'ماذا يوفر تحليل يوتيوب؟',
          a: 'يقدم تحليل يوتيوب تحليلاً شاملاً لمحتوى الفيديو، بما في ذلك المواضيع، والجوانب التقنية، واستخراج المعرفة، والتقييم التعليمي، كل ذلك دون تحميل الفيديو.'
        },
        {
          q: 'هل يمكنني تحميل النتائج؟',
          a: 'نعم، يمكنك تحميل النتائج بتنسيق markdown و JSON. يتضمن التحليل البيانات المرئية والتوقيتات والمعلومات المنظمة.'
        },
        {
          q: 'هل التحليل الفوري مدعوم؟',
          a: 'يستغرق التحليل عادةً بضع ثوانٍ للاكتمال. قد يختلف وقت المعالجة حسب طول الوسائط وتعقيدها.'
        },
        {
          q: 'ما هي اللغات المدعومة؟',
          a: 'الواجهة والتحليل متوفران باللغتين الإنجليزية والعربية. تحافظ نتائج التحليل على جودة عالية في كلتا اللغتين.'
        },
        {
          q: 'هل يمكنني التكامل مع التطبيقات الأخرى؟',
          a: 'نعم، باستخدام تنسيق مخرجات JSON لدينا، يمكنك بسهولة دمج نتائج التحليل مع التطبيقات والأنظمة الأخرى.'
        }
      ]
    }
  };

  const content = isArabic ? helpContent.ar : helpContent.en;

  return (
    <div className={`container mx-auto px-4 py-8 ${isArabic ? 'rtl' : 'ltr'}`}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{content.title}</h1>
        <p className="text-xl text-gray-600 mb-8">{content.subtitle}</p>

        {/* Features */}
        <div className="space-y-8 mb-12">
          {content.features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <feature.icon className="w-8 h-8 text-blue-500 mr-4" />
                <h2 className="text-2xl font-semibold">{feature.title}</h2>
              </div>
              <p className="text-gray-600 mb-4">{feature.description}</p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">{isArabic ? 'الخطوات:' : 'Steps:'}</h3>
                <ol className="list-decimal list-inside space-y-2">
                  {feature.steps.map((step, stepIndex) => (
                    <li key={stepIndex} className="text-gray-700">{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          ))}
        </div>

        {/* Tips */}
        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <div className="flex items-center mb-4">
            <FaLightbulb className="w-6 h-6 text-blue-500 mr-2" />
            <h2 className="text-2xl font-semibold">{isArabic ? 'نصائح مفيدة' : 'Helpful Tips'}</h2>
          </div>
          <ul className="list-disc list-inside space-y-2">
            {content.tips.map((tip, index) => (
              <li key={index} className="text-gray-700">{tip}</li>
            ))}
          </ul>
        </div>

        {/* FAQ */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-6">
            <FaQuestion className="w-6 h-6 text-blue-500 mr-2" />
            <h2 className="text-2xl font-semibold">{isArabic ? 'الأسئلة الشائعة' : 'FAQ'}</h2>
          </div>
          <div className="space-y-4">
            {content.faq.map((item, index) => (
              <div key={index} className="border-b border-gray-200 pb-4">
                <h3 className="font-semibold text-lg mb-2">{item.q}</h3>
                <p className="text-gray-600">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientHelpPage;