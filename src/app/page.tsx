"use client";

import { useRouter } from "next/navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLanguage } from "@/context/LanguageContext";

export default function Home() {
  const router = useRouter();
  const { isArabic } = useLanguage();

  const content = {
    en: {
      title: "Welcome to ChartInsight AI",
      description: "Your intelligent chart analysis and conversion assistant",
      features: [
        "Flowchart and table detection",
        "Flowchart to Python code conversion",
        "Detailed structural analysis",
        "Data relationship insights",
        "Exportable analysis reports"
      ],
      cta: "Start Analyzing",
      featuresSectionTitle: "Our Features",
      faqTitle: "Frequently Asked Questions",
      faqQuestions: [
        {
          question: "What types of charts can I analyze?",
          answer: "ChartInsight AI specializes in flowcharts, tables, bar charts, line charts, and other data visualizations."
        },
        {
          question: "Can I convert flowcharts to Python code?",
          answer: "Yes! Our Flowchart to Python Code feature automatically converts flowcharts into clean, well-structured Python code."
        },
        {
          question: "How accurate is the analysis?",
          answer: "Our AI provides highly accurate analysis, but results may vary depending on image quality and chart complexity."
        },
        {
          question: "Can I export the analysis results?",
          answer: "Yes, you can copy the analysis to clipboard or download it as a text file."
        }
      ]
    },
    ar: {
      title: "مرحبًا بكم في ChartInsight AI",
      description: "مساعدك الذكي لتحليل المخططات والتحويل",
      features: [
        "كشف المخططات الانسيابية والجداول",
        "تحويل المخططات الانسيابية إلى كود بايثون",
        "تحليل تفصيلي للهيكل",
        "رؤى حول علاقات البيانات",
        "تقارير تحليل قابلة للتصدير"
      ],
      cta: "ابدأ التحليل",
      featuresSectionTitle: "ميزاتنا",
      faqTitle: "الأسئلة الشائعة",
      faqQuestions: [
        {
          question: "ما هي أنواع المخططات التي يمكنني تحليلها؟",
          answer: "يتخصص ChartInsight AI في المخططات الانسيابية والجداول والمخططات البيانية والرسوم البيانية الخطية وغيرها من التصورات البيانية."
        },
        {
          question: "هل يمكنني تحويل المخططات الانسيابية إلى كود بايثون؟",
          answer: "نعم! تتيح لك ميزة تحويل المخططات الانسيابية إلى كود بايثون التحويل التلقائي إلى كود بايثون نظيف ومنظم."
        },
        {
          question: "ما مدى دقة التحليل؟",
          answer: "يوفر الذكاء الاصطناعي الخاص بنا تحليلاً دقيقًا للغاية، ولكن قد تختلف النتائج اعتمادًا على جودة الصورة وتعقيد المخطط."
        },
        {
          question: "هل يمكنني تصدير نتائج التحليل؟",
          answer: "نعم، يمكنك نسخ التحليل إلى الحافظة أو تنزيله كملف نصي."
        }
      ]
    }
  };

  const currentContent = content[isArabic ? "ar" : "en"];

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />
      
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-4xl font-bold mb-4 text-center">
          {currentContent.title}
        </h1>
        <p className="text-xl text-gray-600 mb-8 text-center">
          {currentContent.description}
        </p>

        {/* Features Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">
            {currentContent.featuresSectionTitle}
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {currentContent.features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-semibold mb-2">
                  {isArabic ? `الميزة ${index + 1}` : `Feature ${index + 1}`}
                </h3>
                <p>{feature}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => router.push("/analyze-chart")}
            className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600"
          >
            {isArabic ? "تحليل المخططات" : "Chart Analysis"}
          </button>
          <button
            onClick={() => router.push("/flowchart-to-code")}
            className="bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600"
          >
            {isArabic ? "تحويل المخططات" : "Flowchart to Code"}
          </button>
        </div>

        {/* FAQ Section */}
        <div>
          <h2 className="text-3xl font-bold mb-8 text-center">
            {currentContent.faqTitle}
          </h2>
          <div className="space-y-4">
            {currentContent.faqQuestions.map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-semibold mb-2">{faq.question}</h3>
                <p>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

