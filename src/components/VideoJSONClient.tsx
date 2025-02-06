'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import LoadingSpinner from './LoadingSpinner';
import VideoPreview from './VideoPreview';
import { FaDownload, FaCopy, FaCode } from 'react-icons/fa';

interface AnalysisResult {
  videoMetadata: {
    mainTopic: string;
    duration: string;
    quality: string;
    format: string;
  };
  contentAnalysis: {
    keyThemes: string[];
    mainPoints: string[];
    visualElements: string[];
    timestamps: string[];
  };
  technicalDetails: {
    visualQuality: string;
    audioQuality: string;
    productionElements: string[];
    technicalIssues: string[];
  };
  detectedEntities: {
    people: string[];
    objects: string[];
    text: string[];
    actions: string[];
  };
  dataExtraction: {
    statistics: string[];
    metrics: string[];
    keyFindings: string[];
  };
}

const VideoJSONClient = () => {
  const { isArabic } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<string>('');
  const [progress, setProgress] = useState(0);

  const translations = {
    en: {
      title: 'Video Analysis as JSON',
      upload: 'Upload Video',
      dragDrop: 'or drag and drop',
      maxSize: 'MP4, WebM, or Ogg up to 10MB',
      analyze: 'Analyze Video',
      processing: 'Processing...',
      results: 'Analysis Results',
      copy: 'Copy JSON',
      copied: 'Copied!',
      download: 'Download JSON',
      analyzing: 'Analyzing video...'
    },
    ar: {
      title: 'تحليل الفيديو بتنسيق JSON',
      upload: 'رفع فيديو',
      dragDrop: 'أو اسحب وأفلت',
      maxSize: 'MP4, WebM, أو Ogg حتى 10MB',
      analyze: 'تحليل الفيديو',
      processing: 'جاري المعالجة...',
      results: 'نتائج التحليل',
      copy: 'نسخ JSON',
      copied: 'تم النسخ!',
      download: 'تحميل JSON',
      analyzing: 'جاري تحليل الفيديو...'
    }
  };

  const t = (key: keyof typeof translations.en) => {
    return translations[isArabic ? 'ar' : 'en'][key];
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError(isArabic ? 'يجب أن يكون حجم الملف أقل من 10 ميجابايت' : 'File size must be less than 10MB');
        return;
      }
      setFile(selectedFile);
      setError('');
      setResult(null);
    }
  };

  const handleRemoveVideo = () => {
    setFile(null);
    setError('');
    setResult(null);
    setProgress(0);
    setStatus('');
  };

  const analyzeVideo = async () => {
    if (!file) {
      setError(isArabic ? 'الرجاء اختيار ملف فيديو' : 'Please select a video file');
      return;
    }

    setLoading(true);
    setProgress(0);
    setStatus(t('processing'));

    try {
      const formData = new FormData();
      formData.append('video', file);
      formData.append('language', isArabic ? 'ar' : 'en');

      setProgress(20);
      const response = await fetch('/api/analyze-video-json', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(isArabic ? 'فشل في تحليل الفيديو' : 'Failed to analyze video');
      }

      setProgress(50);
      setStatus(t('analyzing'));

      const data = await response.json();
      setProgress(100);
      setResult(data.analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
      setStatus('');
    }
  };

  const handleCopyJSON = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(result, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownloadJSON = () => {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file?.name || 'video'}_analysis.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
                <FaCode className="mx-auto h-12 w-12 text-gray-300" />
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
          {loading ? status : t('analyze')}
        </button>

        {loading && (
          <div className="mt-6">
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <LoadingSpinner message={status} />
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
              <h2 className="text-xl font-semibold">
                {t('results')}
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={handleCopyJSON}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <FaCopy className="mr-2" />
                  {copied ? t('copied') : t('copy')}
                </button>
                <button
                  onClick={handleDownloadJSON}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <FaDownload className="mr-2" />
                  {t('download')}
                </button>
              </div>
            </div>
            <pre className="bg-gray-50 p-4 rounded-lg overflow-auto max-h-96">
              <code className="text-sm">
                {JSON.stringify(result, null, 2)}
              </code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoJSONClient; 