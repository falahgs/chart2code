'use client';

import { useState } from 'react';
import { FaCopy, FaCheck } from 'react-icons/fa';
import { useLanguage } from '@/context/LanguageContext';

interface CopyButtonProps {
  textToCopy: string;
  className?: string;
}

const CopyButton = ({ textToCopy, className = '' }: CopyButtonProps) => {
  const [copied, setCopied] = useState(false);
  const { isArabic } = useLanguage();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`ml-2 p-1 rounded-md hover:bg-gray-100 transition-colors ${className}`}
      title={isArabic ? 'نسخ الرابط' : 'Copy link'}
    >
      {copied ? (
        <FaCheck className="text-green-500 w-4 h-4" />
      ) : (
        <FaCopy className="text-gray-500 w-4 h-4" />
      )}
    </button>
  );
};

export default CopyButton; 