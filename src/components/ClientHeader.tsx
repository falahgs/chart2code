'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import LanguageToggle from './LanguageToggle';
import { 
  FaHome, FaVideo, FaCode, FaImage, FaYoutube, 
  FaQuestionCircle, FaUser, FaBars, FaTimes 
} from 'react-icons/fa';
import { usePathname } from 'next/navigation';
import { FaChartLine } from 'react-icons/fa6';

const ClientHeader = () => {
  const { isArabic } = useLanguage();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = {
    en: [
      { href: '/', label: 'Home', icon: FaHome },
    //  { href: '/video-ai', label: 'Video Analysis', icon: FaVideo },
    //  { href: '/video-json', label: 'JSON Analysis', icon: FaCode },
   //   { href: '/image-detection', label: 'Object Detection', icon: FaImage },
   //   { href: '/youtube-analysis', label: 'YouTube Analysis', icon: FaYoutube },
   //   { href: '/help', label: 'Help & Guide', icon: FaQuestionCircle },
      { href: '/profile', label: 'Profile', icon: FaUser },
      { href: '/analyze-chart', label: 'Chart Analysis', icon: FaChartLine },
      { href: '/flowchart-to-code', label: 'Flowchart to Code', icon: FaChartLine }
    ],



    ar: [
      { href: '/', label: 'الرئيسية', icon: FaHome },
     // { href: '/video-ai', label: 'تحليل الفيديو', icon: FaVideo },
     // { href: '/video-json', label: 'تحليل JSON', icon: FaCode },

      //{ href: '/image-detection', label: 'اكتشاف الكائنات', icon: FaImage },
      //{ href: '/youtube-analysis', label: 'تحليل يوتيوب', icon: FaYoutube },
      //{ href: '/help', label: 'المساعدة والدليل', icon: FaQuestionCircle },

      { href: '/profile', label: 'الملف الشخصي', icon: FaUser },
      { href: '/analyze-chart', label: 'تحليل الرسوم البيانية', icon: FaChartLine },
      { href: '/flowchart-to-code', label: 'تحليل الرسوم البيانية الانسيابية', icon: FaChartLine }


    ]
  };


  const links = isArabic ? navLinks.ar : navLinks.en;

  return (
    <header className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 shadow-lg relative">
      <nav className={`container mx-auto flex items-center justify-between ${isArabic ? 'flex-row-reverse' : ''}`}>
        <Link href="/" className="text-2xl font-bold text-white hover:text-gray-200 z-10">
        ChartInsight AI
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white p-2 z-10"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        {/* Desktop Navigation */}
        <div className={`hidden md:flex items-center gap-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center text-white hover:text-gray-200 transition-colors group ${
                pathname === link.href ? 'text-yellow-300' : ''
              }`}
              title={link.label}
            >
              <link.icon className="w-5 h-5 mb-1" />
              <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-4">
                {link.label}
              </span>
            </Link>
          ))}
          <div className="ml-4">
            <LanguageToggle />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`
          fixed inset-0 bg-purple-600 bg-opacity-95 z-0
          md:hidden
          transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
          ${isArabic ? 'right-0' : 'left-0'}
        `}>
          <div className="flex flex-col items-center justify-center h-full gap-8 pt-16">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 text-white hover:text-yellow-300 transition-colors ${
                  pathname === link.href ? 'text-yellow-300' : ''
                }`}
              >
                <link.icon className="w-6 h-6" />
                <span className="text-lg">{link.label}</span>
              </Link>
            ))}
            <div className="mt-4">
              <LanguageToggle />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default ClientHeader; 