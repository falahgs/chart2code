'use client';

import { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import MarkdownRenderer from './MarkdownRenderer';
import VideoPreview from './VideoPreview';
import { generateWordDocument } from '@/utils/documentGenerator';
import { useLanguage } from '@/context/LanguageContext';
import { FaFileWord, FaLanguage, FaCopy, FaCheck } from 'react-icons/fa';

const VideoAIClient = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const { isArabic } = useLanguage();
  const [translating, setTranslating] = useState(false);
  const [copied, setCopied] = useState(false);

  const translations = {
    en: {
      title: 'Video Analysis with Gemini AI',
      upload: 'Upload Video',
      maxSize: 'MP4, WebM, or Ogg up to 10MB',
      dragDrop: 'or drag and drop',
      analyze: 'Analyze Video',
      processing: 'Processing...',
      uploading: 'Uploading video...',
      results: 'Analysis Results',
      download: 'Download as Word'
    },
    ar: {
      title: 'تحليل الفيديو باستخدام Gemini AI',
      upload: 'رفع فيديو',
      maxSize: 'MP4, WebM, أو Ogg حتى 10MB',
      dragDrop: 'أو اسحب وأفلت',
      analyze: 'تحليل الفيديو',
      processing: 'جاري المعالجة...',
      uploading: 'جاري رفع الفيديو...',
      results: 'نتائج التحليل',
      download: 'تحميل كملف Word'
    }
  };

  const t = (key: keyof typeof translations.en) => {
    return translations[isArabic ? 'ar' : 'en'][key];
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      setFile(selectedFile);
      setError('');
      setResult('');
    }
  };

  const handleRemoveVideo = () => {
    setFile(null);
    setError('');
    setResult('');
  };

  const analyzeVideo = async () => {
    if (!file) {
      setError('Please select a video file');
      return;
    }

    setLoading(true);
    setProgress(0);
    setStatus('Uploading video...');
    
    try {
      const formData = new FormData();
      formData.append('video', file);
      formData.append('language', isArabic ? 'ar' : 'en');

      setProgress(20);
      const response = await fetch('/api/analyze-video', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze video');
      }

      setProgress(50);
      setStatus('Processing video...');
      
      const data = await response.json();
      setProgress(100);
      setResult(data.analysis);
      setStatus('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during video analysis');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOriginalDownload = async () => {
    if (!file || !result) return;
    try {
      await generateWordDocument(file.name, result);
    } catch (error) {
      console.error('Error generating document:', error);
      setError('Failed to generate document');
    }
  };

  const handleArabicDownload = async () => {
    if (!file || !result) return;
    setTranslating(true);
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: result })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'فشلت عملية الترجمة');
      }

      await generateWordDocument(
        `${file.name}_arabic`, 
        data.translatedText,
        true // indicate this is Arabic content
      );

    } catch (error) {
      console.error('خطأ في إنشاء المستند العربي:', error);
      setError(isArabic ? 'فشل في إنشاء المستند العربي' : 'Failed to generate Arabic document');
    } finally {
      setTranslating(false);
    }
  };

  const handleCopyResult = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div className={`container mx-auto px-4 py-8 ${isArabic ? 'rtl' : 'ltr'}`}>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {t('title')}
      </h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        {!file ? (
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              {t('upload')}
            </label>
            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
              <div className="text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-300"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="mt-4 flex text-sm leading-6 text-gray-600">
                  <label className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500">
                    <span>{t('upload')}</span>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleFileUpload}
                      className="sr-only"
                      disabled={loading}
                    />
                  </label>
                  <p className="pl-1">{t('dragDrop')}</p>
                </div>
                <p className="text-xs leading-5 text-gray-600">
                  {t('maxSize')}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <VideoPreview file={file} onRemove={handleRemoveVideo} />
        )}

        <button
          onClick={analyzeVideo}
          disabled={loading || !file}
          className={`w-full bg-blue-600 text-white py-2 px-4 rounded-lg ${
            loading || !file ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
          }`}
        >
          {loading ? t('processing') || 'Processing...' : t('analyze')}
        </button>

        {loading && (
          <div className="mt-6">
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <LoadingSpinner message={t('processing')} />
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <h2 className="text-xl font-semibold">{t('results')}</h2>
                <button
                  onClick={handleCopyResult}
                  className="ml-3 p-2 rounded-md hover:bg-gray-100 transition-colors"
                  title={isArabic ? 'نسخ النتائج' : 'Copy results'}
                >
                  {copied ? (
                    <FaCheck className="w-5 h-5 text-green-500" />
                  ) : (
                    <FaCopy className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                  )}
                </button>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={handleOriginalDownload}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <FaFileWord className="w-5 h-5" />
                  <span>Download (English)</span>
                </button>

                <button
                  onClick={handleArabicDownload}
                  disabled={translating}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <FaLanguage className="w-5 h-5" />
                  <span>
                    {translating ? 'Translating...' : 'Download (Arabic)'}
                  </span>
                </button>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded prose prose-blue max-w-none">
              <MarkdownRenderer content={result} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoAIClient; 