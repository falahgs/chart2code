'use client';

import { useLanguage } from '@/context/LanguageContext';
import Image from 'next/image';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

const ClientProfilePage = () => {
  const { isArabic } = useLanguage();

  const profile = {
    en: {
      name: 'Falah Gatea Salieh',
      title: 'AI & Machine Learning Developer',
      location: 'Iraq',
      background: 'Over 10 years of experience in AI and Machine Learning development.',
      expertise: [
        'Deep Learning & Neural Networks',
        'Natural Language Processing',
        'Machine Learning Algorithms',
        'AI System Architecture',
        'Predictive Modeling',
        'Data Analysis & Visualization'
      ],
      interests: 'Deep appreciation for classical music, relating its mathematical precision and emotional depth to AI development.',
      contact: 'Open to collaboration in AI and machine learning. Reach out via social media channels.'
    },
    ar: {
      name: 'فلاح كاطع الخفاجي ',
      title: 'مطور الذكاء الاصطناعي وتعلم الآلة',
      location: 'العراق',
      background: 'أكثر من 10 سنوات من الخبرة في تطوير الذكاء الاصطناعي وتعلم الآلة.',
      expertise: [
        'التعلم العميق والشبكات العصبية',
        'معالجة اللغات الطبيعية',
        'خوارزميات تعلم الآلة',
        'هندسة أنظمة الذكاء الاصطناعي',
        'النمذجة التنبؤية',
        'تحليل وتصور البيانات'
      ],
      interests: 'تقدير عميق للموسيقى الكلاسيكية، وربط دقتها الرياضية وعمقها العاطفي بتطوير الذكاء الاصطناعي.',
      contact: 'منفتح للتعاون في مجال الذكاء الاصطناعي وتعلم الآلة. تواصل عبر قنوات التواصل الاجتماعي.'
    }
  };

  const content = isArabic ? profile.ar : profile.en;

  return (
    <div className={`container mx-auto px-4 py-8 ${isArabic ? 'rtl' : 'ltr'}`}>
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative h-48 bg-gradient-to-r from-purple-600 to-blue-600">
          <div className="absolute -bottom-16 left-8">
            <Image
              src="/profile.jpg"
              alt={content.name}
              width={128}
              height={128}
              className="rounded-full border-4 border-white shadow-lg"
            />
          </div>
        </div>
        
        <div className="pt-20 px-8 pb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{content.name}</h1>
              <p className="text-xl text-gray-600">{content.title}</p>
              <p className="text-gray-500">{content.location}</p>
            </div>
            <div className="flex space-x-4">
              <a href="https://github.com/falahgs" target="_blank" rel="noopener noreferrer" 
                className="text-gray-600 hover:text-gray-900">
                <FaGithub size={24} />
              </a>
              <a href="https://www.linkedin.com/in/falah-gatea-060a211a7" target="_blank" rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900">
                <FaLinkedin size={24} />
              </a>
              <a href="https://twitter.com/FalahGatea" target="_blank" rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900">
                <FaTwitter size={24} />
              </a>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Professional Background</h2>
            <p className="text-gray-700 mb-4">{content.background}</p>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Expertise</h3>
            <ul className="list-disc list-inside mb-6 text-gray-700">
              {content.expertise.map((item, index) => (
                <li key={index} className="mb-1">{item}</li>
              ))}
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-2">Personal Interests</h3>
            <p className="text-gray-700 mb-6">{content.interests}</p>

            <h3 className="text-xl font-semibold text-gray-900 mb-2">Contact Information</h3>
            <p className="text-gray-700">{content.contact}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientProfilePage; 