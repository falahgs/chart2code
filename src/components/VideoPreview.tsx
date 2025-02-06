import { useEffect, useRef, useState } from 'react';

interface VideoPreviewProps {
  file: File;
  onRemove: () => void;
}

const VideoPreview = ({ file, onRemove }: VideoPreviewProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [duration, setDuration] = useState<number>(0);
  const [thumbnail, setThumbnail] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!file) return;

    // Create URL for video playback
    const url = URL.createObjectURL(file);

    // Set video source
    if (videoRef.current) {
      videoRef.current.src = url;
    }

    // Generate thumbnail
    const video = document.createElement('video');
    video.src = url;
    video.addEventListener('loadeddata', () => {
      video.currentTime = 1; // Set to 1 second to avoid black frame
    });

    video.addEventListener('seeked', () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
      setThumbnail(canvas.toDataURL());
    });

    // Cleanup function
    return () => {
      URL.revokeObjectURL(url);
      if (videoRef.current) {
        videoRef.current.src = '';
      }
    };
  }, [file]);

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const togglePlay = async () => {
    if (videoRef.current) {
      try {
        if (isPlaying) {
          await videoRef.current.pause();
        } else {
          await videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
      } catch (error) {
        console.error('Error playing video:', error);
      }
    }
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-2xl mx-auto bg-gray-50 rounded-lg p-4 mb-6">
      <div className="relative">
        <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
          <video
            ref={videoRef}
            className="w-full h-full"
            onLoadedMetadata={handleLoadedMetadata}
            controls
            controlsList="nodownload"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
            playsInline
          >
            <source type={file.type} />
            Your browser does not support the video tag.
          </video>
          
          {!isPlaying && thumbnail && (
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
              <button
                onClick={togglePlay}
                className="bg-white rounded-full p-4 hover:bg-gray-100 transform hover:scale-110 transition-all duration-200"
              >
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex justify-between items-start">
        <div>
          <h3 className="font-medium text-gray-900 truncate max-w-xs">{file.name}</h3>
          <div className="mt-1 text-sm text-gray-500 space-y-1">
            <p className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Duration: {formatDuration(duration)}
            </p>
            <p className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
              </svg>
              Size: {formatFileSize(file.size)}
            </p>
          </div>
        </div>
        <button
          onClick={onRemove}
          className="text-red-600 hover:text-red-800 p-2 hover:bg-red-100 rounded-full transition-colors duration-200"
          title="Remove video"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default VideoPreview; 