'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import LoadingSpinner from './LoadingSpinner';
import { FaYoutube, FaDownload, FaCopy, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import ReactPlayer from 'react-player';
import MarkdownRenderer from './MarkdownRenderer';

interface YouTubeVideoInfo {
  videoId: string;
  thumbnail: string;
}

const YouTubeAnalysisClient = () => {
  const { isArabic } = useLanguage();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [videoInfo, setVideoInfo] = useState<YouTubeVideoInfo | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [isResultsPanelOpen, setIsResultsPanelOpen] = useState(true);

  const translations = {
    en: {
      title: 'YouTube Video Analysis',
      enterUrl: 'Enter YouTube URL',
      analyze: 'Analyze Video',
      processing: 'Processing...',
      results: 'Analysis Results',
      copy: 'Copy',
      copied: 'Copied!',
      download: 'Download',
      invalidUrl: 'Please enter a valid YouTube URL',
      preview: 'Video Preview',
      toggleResults: 'Toggle Results'
    },
    ar: {
      title: 'تحليل فيديو يوتيوب',
      enterUrl: 'أدخل رابط اليوتيوب',
      analyze: 'تحليل الفيديو',
      processing: 'جاري المعالجة...',
      results: 'نتائج التحليل',
      copy: 'نسخ',
      copied: 'تم النسخ!',
      download: 'تحميل',
      invalidUrl: 'يرجى إدخال رابط يوتيوب صحيح',
      preview: 'معاينة الفيديو',
      toggleResults: 'تبديل النتائج'
    }
  };

  const t = (key: keyof typeof translations.en) => {
    return translations[isArabic ? 'ar' : 'en'][key];
  };

  const getVideoId = (url: string): string => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
  };

  const handleAnalyze = async () => {
    const videoId = getVideoId(url);
    if (!videoId) {
      setError(t('invalidUrl'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/analyze-youtube', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, language: isArabic ? 'ar' : 'en' }),
      });

      if (!response.ok) throw new Error('Failed to analyze video');

      const data = await response.json();
      setResult(data.analysis);
      setVideoInfo({ videoId, thumbnail: data.videoInfo.thumbnail });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyJSON = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownloadDocument = () => {
    if (!result) return;
    const blob = new Blob([result], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'youtube_analysis.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`container mx-auto px-4 py-8 ${isArabic ? 'rtl' : 'ltr'}`}>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">{t('title')}</h1>

      <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
        {/* Input Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={t('enterUrl')}
            className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAnalyze}
            disabled={loading || !url.trim()}
            className={`px-6 py-3 bg-blue-600 text-white rounded-lg ${
              loading || !url.trim() ? 'opacity-50' : 'hover:bg-blue-700'
            } transition-colors whitespace-nowrap`}
          >
            {loading ? t('processing') : t('analyze')}
          </button>
        </div>

        {/* Video Preview */}
        {getVideoId(url) && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">{t('preview')}</h2>
            <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
              <ReactPlayer
                url={`https://www.youtube.com/watch?v=${getVideoId(url)}`}
                width="100%"
                height="100%"
                controls
                light={true}
                className="rounded-lg"
              />
            </div>
          </div>
        )}

        {loading && <LoadingSpinner message={t('processing')} />}

        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div className="mt-6 border rounded-lg overflow-hidden">
            <div 
              className="bg-gray-50 p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer hover:bg-gray-100"
              onClick={() => setIsResultsPanelOpen(!isResultsPanelOpen)}
            >
              <h2 className="text-xl font-semibold flex items-center">
                {t('results')}
                {isResultsPanelOpen ? (
                  <FaChevronUp className="ml-2 w-4 h-4" />
                ) : (
                  <FaChevronDown className="ml-2 w-4 h-4" />
                )}
              </h2>
              <div className="flex gap-2 w-full md:w-auto">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyJSON();
                  }}
                  className="flex-1 md:flex-none flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <FaCopy className="mr-2" />
                  {copied ? t('copied') : t('copy')}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownloadDocument();
                  }}
                  className="flex-1 md:flex-none flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <FaDownload className="mr-2" />
                  {t('download')}
                </button>
              </div>
            </div>
            
            {isResultsPanelOpen && (
              <div className="border-t">
                <div className="p-4 prose prose-blue max-w-none overflow-x-auto">
                  <MarkdownRenderer content={result} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default YouTubeAnalysisClient; 