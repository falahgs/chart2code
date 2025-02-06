'use client';

import { useLanguage } from '@/context/LanguageContext';

const LanguageToggle = () => {
  const { isArabic, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="px-3 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white transition-colors"
    >
      {isArabic ? 'English' : 'عربي'}
    </button>
  );
};

export default LanguageToggle; 