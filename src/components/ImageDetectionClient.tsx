'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import LoadingSpinner from './LoadingSpinner';
import { FaDownload, FaCopy, FaImage, FaObjectGroup, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import Image from 'next/image';

interface DetectedObject {
  object: string;
  confidence: string;
  location: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  attributes: string[];
}

interface ObjectCount {
  [key: string]: {
    count: number;
    confidence: string;
  };
}

const ImageDetectionClient = () => {
  const { isArabic } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [objectCounts, setObjectCounts] = useState<ObjectCount>({});
  const [isResultsPanelOpen, setIsResultsPanelOpen] = useState(true);

  const translations = {
    en: {
      title: 'Image Object Detection',
      upload: 'Upload Image',
      dragDrop: 'or drag and drop',
      maxSize: 'JPG, PNG up to 10MB',
      analyze: 'Analyze Image',
      processing: 'Processing...',
      results: 'Detection Results',
      copy: 'Copy JSON',
      copied: 'Copied!',
      download: 'Download JSON',
      detectedObjects: 'Detected Objects',
      confidence: 'Confidence',
      count: 'Count',
      noObjects: 'No objects detected yet',
      toggleResults: 'Toggle Results Panel',
    },
    ar: {
      title: 'اكتشاف الكائنات في الصور',
      upload: 'رفع صورة',
      dragDrop: 'أو اسحب وأفلت',
      maxSize: 'JPG, PNG حتى 10MB',
      analyze: 'تحليل الصورة',
      processing: 'جاري المعالجة...',
      results: 'نتائج التحليل',
      copy: 'نسخ JSON',
      copied: 'تم النسخ!',
      download: 'تحميل JSON',
      detectedObjects: 'الكائنات المكتشفة',
      confidence: 'الثقة',
      count: 'العدد',
      noObjects: 'لم يتم اكتشاف كائنات بعد',
      toggleResults: 'تبديل لوحة النتائج',
    }
  };

  const t = (key: keyof typeof translations.en) => {
    return translations[isArabic ? 'ar' : 'en'][key];
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError(isArabic ? 'يجب أن يكون حجم الملف أقل من 10 ميجابايت' : 'File size must be less than 10MB');
        return;
      }
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setError('');
      setResult(null);
    }
  };

  const handleRemoveImage = () => {
    setFile(null);
    setPreview('');
    setError('');
    setResult(null);
  };

  const analyzeImage = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('language', isArabic ? 'ar' : 'en');

      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to analyze image');

      const data = await response.json();
      setResult(data.analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
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
    a.download = `image_analysis.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const drawBoundingBoxes = (objects: DetectedObject[]) => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match image
    canvas.width = image.width;
    canvas.height = image.height;

    // Clear previous drawings
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw each bounding box
    objects.forEach((obj, index) => {
      const { x, y, width, height } = obj.location;
      const colors = [
        '#FF0000', '#00FF00', '#0000FF', '#FFFF00', 
        '#FF00FF', '#00FFFF', '#FFA500', '#800080'
      ];
      const color = colors[index % colors.length];

      // Draw box
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);

      // Draw label
      ctx.fillStyle = color;
      ctx.font = '14px Arial';
      const label = `${obj.object} (${obj.confidence})`;
      const padding = 2;
      const textWidth = ctx.measureText(label).width;
      
      ctx.fillRect(x, y - 20, textWidth + (padding * 2), 20);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(label, x + padding, y - 5);
    });
  };

  useEffect(() => {
    if (result?.detectedObjects) {
      const counts: ObjectCount = {};
      result.detectedObjects.forEach((obj: DetectedObject) => {
        if (!counts[obj.object]) {
          counts[obj.object] = {
            count: 1,
            confidence: obj.confidence
          };
        } else {
          counts[obj.object].count += 1;
        }
      });
      setObjectCounts(counts);
      drawBoundingBoxes(result.detectedObjects);
    }
  }, [result]);

  const ObjectCountCards = () => {
    if (!Object.keys(objectCounts).length) return null;

    return (
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <div className="flex items-center mb-4">
          <FaObjectGroup className="w-5 h-5 text-blue-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">
            {t('detectedObjects')}
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Object.entries(objectCounts).map(([object, data]) => (
            <div 
              key={object}
              className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-800 capitalize">
                    {object}
                  </span>
                  <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-2.5 py-0.5 rounded">
                    {data.count}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  {t('confidence')}: {data.confidence}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={`container mx-auto px-4 py-8 ${isArabic ? 'rtl' : 'ltr'}`}>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {t('title')}
      </h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-6">
          {!preview ? (
            <div className="relative w-full max-w-2xl mx-auto aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <FaImage className="w-16 h-16 text-gray-300 mb-4" />
                <label className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500">
                  <span>{t('upload')}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="sr-only"
                    disabled={loading}
                  />
                </label>
                <p className="mt-2 text-sm text-gray-500">{t('dragDrop')}</p>
                <p className="mt-1 text-xs text-gray-400">{t('maxSize')}</p>
              </div>
            </div>
          ) : (
            <div className="relative w-full max-w-2xl mx-auto">
              <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                <Image
                  ref={imageRef}
                  src={preview}
                  alt="Preview"
                  fill
                  className="object-contain"
                  onLoad={() => {
                    if (result?.detectedObjects) {
                      drawBoundingBoxes(result.detectedObjects);
                    }
                  }}
                />
                <canvas
                  ref={canvasRef}
                  className="absolute top-0 left-0 w-full h-full pointer-events-none"
                />
                <button
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                >
                  ×
                </button>
              </div>
              
              {/* Image Info Card */}
              {file && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {file.type.split('/')[1].toUpperCase()}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {result && <ObjectCountCards />}

        <button
          onClick={analyzeImage}
          disabled={loading || !file}
          className={`w-full bg-blue-600 text-white py-2 px-4 rounded-lg ${
            loading || !file ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
          } transition-colors mt-6`}
        >
          {loading ? t('processing') : t('analyze')}
        </button>

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
              className="bg-gray-50 p-4 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => setIsResultsPanelOpen(!isResultsPanelOpen)}
              title={t('toggleResults')}
            >
              <h2 className="text-xl font-semibold flex items-center">
                {t('results')}
                {isResultsPanelOpen ? (
                  <FaChevronUp className="ml-2 text-gray-500 w-4 h-4" />
                ) : (
                  <FaChevronDown className="ml-2 text-gray-500 w-4 h-4" />
                )}
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyJSON();
                  }}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FaCopy className="mr-2" />
                  {copied ? t('copied') : t('copy')}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownloadJSON();
                  }}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <FaDownload className="mr-2" />
                  {t('download')}
                </button>
              </div>
            </div>
            
            {isResultsPanelOpen && (
              <div className="border-t">
                <pre className="bg-white p-4 overflow-auto max-h-96">
                  <code className="text-sm">
                    {JSON.stringify(result, null, 2)}
                  </code>
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageDetectionClient; 