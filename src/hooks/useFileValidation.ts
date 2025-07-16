import { useState, useCallback } from 'react';
import { 
  FileValidationResult, 
  FileValidationOptions, 
  UseFileValidationReturn 
} from '../types/ArweaveTypes';
import { validateVideoFile } from '../utils/typeValidation';

/**
 * Custom hook for validating video files with comprehensive checks
 */
export function useFileValidation(): UseFileValidationReturn {
  const [isValidating, setIsValidating] = useState(false);
  const [lastValidation, setLastValidation] = useState<FileValidationResult | null>(null);

  const validateFile = useCallback(async (
    file: File, 
    options: FileValidationOptions = {}
  ): Promise<FileValidationResult> => {
    setIsValidating(true);
    
    try {
      // Basic file validation
      const basicValidation = validateVideoFile(file, options);
      
      if (!basicValidation.isValid) {
        setLastValidation(basicValidation);
        return basicValidation;
      }

      // Enhanced validation with video metadata
      const enhancedValidation = await validateVideoMetadata(file, options);
      setLastValidation(enhancedValidation);
      
      return enhancedValidation;
      
    } catch (error) {
      console.error('File validation error:', error);
      
      const errorResult: FileValidationResult = {
        isValid: false,
        error: 'An unexpected error occurred during file validation'
      };
      
      setLastValidation(errorResult);
      return errorResult;
      
    } finally {
      setIsValidating(false);
    }
  }, []);

  return {
    validateFile,
    isValidating,
    lastValidation
  };
}

/**
 * Enhanced validation that includes video metadata analysis
 */
async function validateVideoMetadata(
  file: File, 
  options: FileValidationOptions
): Promise<FileValidationResult> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    const url = URL.createObjectURL(file);
    
    video.preload = 'metadata';
    video.src = url;
    
    const cleanup = () => {
      URL.revokeObjectURL(url);
      video.remove();
    };

    video.onloadedmetadata = () => {
      try {
        const duration = video.duration;
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;
        
        // Validate duration if specified
        if (options.maxDuration && duration > options.maxDuration) {
          cleanup();
          resolve({
            isValid: false,
            error: `Video duration (${formatDuration(duration)}) exceeds maximum allowed duration (${formatDuration(options.maxDuration)})`
          });
          return;
        }

        // Check for valid video dimensions
        if (videoWidth === 0 || videoHeight === 0) {
          cleanup();
          resolve({
            isValid: false,
            error: 'Video file appears to be corrupted or has invalid dimensions'
          });
          return;
        }

        // Check for reasonable aspect ratios
        const aspectRatio = videoWidth / videoHeight;
        if (aspectRatio < 0.1 || aspectRatio > 10) {
          cleanup();
          resolve({
            isValid: false,
            error: 'Video has an unusual aspect ratio that may not display properly'
          });
          return;
        }

        // Successful validation
        cleanup();
        resolve({
          isValid: true,
          fileInfo: {
            size: file.size,
            type: file.type,
            duration: duration,
            dimensions: {
              width: videoWidth,
              height: videoHeight
            }
          }
        });
        
      } catch (error) {
        cleanup();
        resolve({
          isValid: false,
          error: 'Failed to analyze video metadata'
        });
      }
    };

    video.onerror = () => {
      cleanup();
      resolve({
        isValid: false,
        error: 'Video file is corrupted or in an unsupported format'
      });
    };

    // Timeout after 10 seconds
    setTimeout(() => {
      cleanup();
      resolve({
        isValid: false,
        error: 'Video validation timed out - file may be corrupted'
      });
    }, 10000);
  });
}

/**
 * Formats duration in seconds to human readable format
 */
function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${Math.round(seconds)}s`;
  }
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);
  
  if (minutes < 60) {
    return `${minutes}m ${remainingSeconds}s`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  return `${hours}h ${remainingMinutes}m ${remainingSeconds}s`;
}

/**
 * Hook for quick file validation without metadata analysis
 */
export function useQuickFileValidation() {
  const [isValidating, setIsValidating] = useState(false);
  
  const quickValidate = useCallback(async (
    file: File, 
    options: FileValidationOptions = {}
  ): Promise<FileValidationResult> => {
    setIsValidating(true);
    
    try {
      const result = validateVideoFile(file, options);
      return result;
    } finally {
      setIsValidating(false);
    }
  }, []);

  return {
    quickValidate,
    isValidating
  };
}

/**
 * Hook for batch file validation
 */
export function useBatchFileValidation() {
  const [isValidating, setIsValidating] = useState(false);
  const [validationResults, setValidationResults] = useState<Map<string, FileValidationResult>>(new Map());
  
  const validateFiles = useCallback(async (
    files: File[], 
    options: FileValidationOptions = {}
  ): Promise<Map<string, FileValidationResult>> => {
    setIsValidating(true);
    const results = new Map<string, FileValidationResult>();
    
    try {
      // Validate files in parallel
      const validationPromises = files.map(async (file) => {
        const result = validateVideoFile(file, options);
        return { file: file.name, result };
      });
      
      const completedValidations = await Promise.all(validationPromises);
      
      completedValidations.forEach(({ file, result }) => {
        results.set(file, result);
      });
      
      setValidationResults(results);
      return results;
      
    } catch (error) {
      console.error('Batch validation error:', error);
      return results;
    } finally {
      setIsValidating(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setValidationResults(new Map());
  }, []);

  return {
    validateFiles,
    validationResults,
    isValidating,
    clearResults
  };
}