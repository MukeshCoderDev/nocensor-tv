import React, { useCallback, useState, useRef } from 'react';
import { VideoSelectorProps } from '../../types/ArweaveTypes';
import { useFileValidation } from '../../hooks/useFileValidation';
import { FileFormatHelpTooltip, HelpIcon } from './HelpTooltip';
import { CompactErrorDisplay } from './ErrorDisplay';

/**
 * Video selector component for step 1 of upload process with drag-and-drop functionality
 */
export function VideoSelector({ 
  onVideoSelected, 
  onError, 
  selectedVideo, 
  isDisabled = false 
}: VideoSelectorProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { validateFile } = useFileValidation();

  const handleFileSelect = useCallback(async (file: File) => {
    if (isDisabled) return;

    setIsValidating(true);
    
    try {
      const validationResult = await validateFile(file, {
        maxSize: 500 * 1024 * 1024, // 500MB
        allowedTypes: ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov'],
        maxDuration: 3600 // 1 hour max
      });

      if (validationResult.isValid) {
        onVideoSelected(file);
      } else {
        onError({
          type: 'validation',
          message: validationResult.error || 'Invalid video file',
          suggestedAction: 'Please select a valid video file in MP4, WebM, OGG, AVI, or MOV format',
          recoverable: true
        });
      }
    } catch (error) {
      console.error('File validation error:', error);
      onError({
        type: 'validation',
        message: 'Failed to validate video file',
        suggestedAction: 'Please try selecting the file again',
        recoverable: true
      });
    } finally {
      setIsValidating(false);
    }
  }, [validateFile, onVideoSelected, onError, isDisabled]);

  const handleFileInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    if (!isDisabled) {
      setIsDragOver(true);
    }
  }, [isDisabled]);

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    
    if (isDisabled) return;

    const files = Array.from(event.dataTransfer.files);
    const videoFile = files.find(file => file.type.startsWith('video/'));
    
    if (videoFile) {
      handleFileSelect(videoFile);
    } else if (files.length > 0) {
      onError({
        type: 'validation',
        message: 'Please select a video file',
        suggestedAction: 'Only video files are supported for upload',
        recoverable: true
      });
    }
  }, [handleFileSelect, onError, isDisabled]);

  const handleBrowseClick = useCallback(() => {
    if (!isDisabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [isDisabled]);

  const handleRemoveFile = useCallback(() => {
    if (!isDisabled) {
      onVideoSelected(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [onVideoSelected, isDisabled]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (selectedVideo) {
    return <SelectedVideoDisplay 
      video={selectedVideo} 
      onRemove={handleRemoveFile}
      isDisabled={isDisabled}
      formatFileSize={formatFileSize}
      formatDuration={formatDuration}
    />;
  }

  return (
    <div className="w-full">
      {/* File input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={isDisabled}
      />

      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
          ${isDragOver && !isDisabled ? 'border-purple-400 bg-purple-50' : 'border-gray-300'}
          ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-purple-400 hover:bg-gray-50 cursor-pointer'}
          ${isValidating ? 'pointer-events-none' : ''}
        `}
        onClick={handleBrowseClick}
      >
        {isValidating ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4" />
            <p className="text-gray-600">Validating video file...</p>
          </div>
        ) : (
          <>
            <div className="flex justify-center mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                />
              </svg>
            </div>
            
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Choose your video file
            </h3>
            
            <p className="text-gray-600 mb-4">
              Drag and drop your video here, or click to browse
            </p>
            
            <button
              type="button"
              className={`
                inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white
                ${isDisabled ? 'bg-gray-400' : 'bg-purple-600 hover:bg-purple-700'}
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors
              `}
              disabled={isDisabled}
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              Browse Files
            </button>
          </>
        )}
      </div>

      {/* Help section */}
      <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <span>Supported: MP4, WebM, OGG, AVI, MOV</span>
          <span>Max size: 500MB</span>
          <span>Max duration: 1 hour</span>
        </div>
        
        <FileFormatHelpTooltip>
          <HelpIcon />
        </FileFormatHelpTooltip>
      </div>
    </div>
  );
}

/**
 * Component to display selected video with preview and details
 */
function SelectedVideoDisplay({ 
  video, 
  onRemove, 
  isDisabled,
  formatFileSize,
  formatDuration
}: {
  video: File;
  onRemove: () => void;
  isDisabled: boolean;
  formatFileSize: (bytes: number) => string;
  formatDuration: (seconds: number) => string;
}) {
  const [videoMetadata, setVideoMetadata] = useState<{
    duration?: number;
    dimensions?: { width: number; height: number };
  }>({});
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');

  // Generate thumbnail and get metadata
  React.useEffect(() => {
    const video = document.createElement('video');
    const url = URL.createObjectURL(video);
    
    video.preload = 'metadata';
    video.src = url;
    
    video.onloadedmetadata = () => {
      setVideoMetadata({
        duration: video.duration,
        dimensions: {
          width: video.videoWidth,
          height: video.videoHeight
        }
      });

      // Generate thumbnail
      video.currentTime = Math.min(5, video.duration / 2); // 5 seconds or middle of video
    };

    video.onseeked = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        canvas.width = 160;
        canvas.height = 90;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        setThumbnailUrl(canvas.toDataURL());
      }
      
      URL.revokeObjectURL(url);
    };

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [video]);

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white">
      <div className="flex items-start space-x-4">
        {/* Thumbnail */}
        <div className="flex-shrink-0">
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt="Video thumbnail"
              className="w-20 h-12 object-cover rounded border"
            />
          ) : (
            <div className="w-20 h-12 bg-gray-200 rounded border flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>

        {/* Video details */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 truncate">
            {video.name}
          </h4>
          
          <div className="mt-1 text-sm text-gray-500 space-y-1">
            <div className="flex items-center space-x-4">
              <span>Size: {formatFileSize(video.size)}</span>
              <span>Type: {video.type}</span>
            </div>
            
            {videoMetadata.duration && (
              <div className="flex items-center space-x-4">
                <span>Duration: {formatDuration(videoMetadata.duration)}</span>
                {videoMetadata.dimensions && (
                  <span>
                    Resolution: {videoMetadata.dimensions.width}×{videoMetadata.dimensions.height}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Remove button */}
        <button
          onClick={onRemove}
          disabled={isDisabled}
          className={`
            flex-shrink-0 p-1 rounded-full
            ${isDisabled ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'}
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors
          `}
          title="Remove video"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Success indicator */}
      <div className="mt-3 flex items-center text-sm text-green-600">
        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        Video file validated successfully
      </div>
    </div>
  );
}

/**
 * Compact video selector for smaller spaces
 */
export function CompactVideoSelector({ 
  onVideoSelected, 
  onError, 
  selectedVideo, 
  isDisabled = false 
}: VideoSelectorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { validateFile } = useFileValidation();

  const handleFileSelect = useCallback(async (file: File) => {
    if (isDisabled) return;

    const validationResult = await validateFile(file);
    
    if (validationResult.isValid) {
      onVideoSelected(file);
    } else {
      onError({
        type: 'validation',
        message: validationResult.error || 'Invalid video file',
        suggestedAction: 'Please select a valid video file',
        recoverable: true
      });
    }
  }, [validateFile, onVideoSelected, onError, isDisabled]);

  const handleFileInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleBrowseClick = useCallback(() => {
    if (!isDisabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [isDisabled]);

  return (
    <div className="flex items-center space-x-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={isDisabled}
      />
      
      <button
        onClick={handleBrowseClick}
        disabled={isDisabled}
        className={`
          inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md
          ${isDisabled ? 'text-gray-400 bg-gray-100 cursor-not-allowed' : 'text-gray-700 bg-white hover:bg-gray-50'}
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors
        `}
      >
        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
        Choose Video
      </button>
      
      {selectedVideo && (
        <span className="text-sm text-gray-600 truncate max-w-xs">
          {selectedVideo.name}
        </span>
      )}
    </div>
  );
}