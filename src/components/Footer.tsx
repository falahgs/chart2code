'use client';

import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import { 
  FaGithub, 
  FaLinkedin, 
  FaTwitter, 
  FaInstagram, 
  FaFacebook, 
  FaWordpress, 
  FaMedium, 
  FaAmazon, 
  FaYoutube
} from 'react-icons/fa';

export default function Footer() {
  const { isArabic } = useLanguage();

  const content = {
    en: {
      about: 'About',
      features: 'Features',
      contact: 'Contact',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      copyright: '© 2024 ChartInsight AI. All rights reserved.',
      social: 'Follow Us',
      applications: 'Applications'
    },
    ar: {
      about: 'من نحن',
      features: 'الميزات',
      contact: 'اتصل بنا',
      privacy: 'سياسة الخصوصية',
      terms: 'شروط الخدمة',
      copyright: '© 2024 ChartInsight AI. جميع الحقوق محفوظة.',
      social: 'تابعنا',
      applications: 'التطبيقات'
    }
  };

  const socialLinks = [
    { icon: FaGithub, href: 'https://github.com/falahgs', label: 'GitHub' },
    { icon: FaLinkedin, href: 'https://www.linkedin.com/in/falah-gatea-060a211a7', label: 'LinkedIn' },
    { icon: FaTwitter, href: 'https://x.com/FalahGatea', label: 'Twitter' },
    { icon: FaInstagram, href: 'https://www.instagram.com/falah.g.saleih', label: 'Instagram' },
    { icon: FaFacebook, href: 'https://www.facebook.com/falahgs', label: 'Facebook' },
    { icon: FaWordpress, href: 'https://iraqprogrammer.wordpress.com', label: 'WordPress' },
    { icon: FaMedium, href: 'https://medium.com/@falahgs', label: 'Medium' },
    { icon: FaAmazon, href: 'https://www.amazon.com/stores/Falah-Gatea-Salieh/author/B0BYHXLP7R', label: 'Amazon' },
    { icon: FaYoutube, href: 'https://www.youtube.com/@FalahgsGate', label: 'YouTube' }
  ];

  const applicationLinks = [
    { name: 'Chart Analysis', path: '/analyze-chart' },
    { name: 'Flowchart to Code', path: '/flowchart-to-code' },
  //  { name: 'Video Analysis', path: '/video-ai' },
  //  { name: 'YouTube Analysis', path: '/youtube-analysis' },
  //  { name: 'Object Detection', path: '/image-detection' }

  ];

  const currentContent = content[isArabic ? 'ar' : 'en'];

  return (
    <footer className={`bg-gray-800 text-white py-8 ${isArabic ? 'text-right' : 'text-left'}`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">{currentContent.about}</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="hover:text-gray-300">Our Story</Link></li>
              <li><Link href="/team" className="hover:text-gray-300">Our Team</Link></li>
              <li><Link href="/careers" className="hover:text-gray-300">Careers</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">{currentContent.features}</h3>
            <ul className="space-y-2">
              {applicationLinks.map((app, index) => (
                <li key={index}>
                  <Link href={app.path} className="hover:text-gray-300">
                    {app.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">{currentContent.contact}</h3>
            <ul className="space-y-2">
              <li><Link href="/contact" className="hover:text-gray-300">Contact Us</Link></li>
              <li><Link href="/support" className="hover:text-gray-300">Support</Link></li>
              <li><Link href="/faq" className="hover:text-gray-300">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">{currentContent.social}</h3>
            <div className="grid grid-cols-2 gap-4">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 hover:text-gray-300"
                >
                  <link.icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm mb-4 md:mb-0">{currentContent.copyright}</p>
          <div className="flex space-x-4">
            <Link href="https://github.com/falahgs" target="_blank" rel="noopener noreferrer">
              <FaGithub className="w-6 h-6 hover:text-gray-300" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}