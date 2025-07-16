import { renderHook, act } from '@testing-library/react';
import { useFileValidation, useQuickFileValidation, useBatchFileValidation } from '../useFileValidation';

// Mock the validation utility
jest.mock('../../utils/typeValidation', () => ({
  validateVideoFile: jest.fn()
}));

// Mock URL.createObjectURL and revokeObjectURL
global.URL.createObjectURL = jest.fn(() => 'mock-url');
global.URL.revokeObjectURL = jest.fn();

// Mock HTMLVideoElement
const mockVideoElement = {
  preload: '',
  src: '',
  duration: 0,
  videoWidth: 0,
  videoHeight: 0,
  onloadedmetadata: null as any,
  onerror: null as any,
  remove: jest.fn()
};

global.document.createElement = jest.fn((tagName) => {
  if (tagName === 'video') {
    return mockVideoElement as any;
  }
  return {} as any;
});

describe('useFileValidation', () => {
  const mockValidateVideoFile = require('../../utils/typeValidation').validateVideoFile;

  beforeEach(() => {
    jest.clearAllMocks();
    mockVideoElement.duration = 0;
    mockVideoElement.videoWidth = 0;
    mockVideoElement.videoHeight = 0;
    mockVideoElement.onloadedmetadata = null;
    mockVideoElement.onerror = null;
  });

  describe('useFileValidation', () => {
    it('should initialize with correct default state', () => {
      const { result } = renderHook(() => useFileValidation());

      expect(result.current.isValidating).toBe(false);
      expect(result.current.lastValidation).toBe(null);
      expect(typeof result.current.validateFile).toBe('function');
    });

    it('should validate a valid video file with metadata', async () => {
      mockValidateVideoFile.mockReturnValue({
        isValid: true,
        fileInfo: { size: 1024, type: 'video/mp4' }
      });

      const { result } = renderHook(() => useFileValidation());
      const mockFile = new File(['video content'], 'test.mp4', { type: 'video/mp4' });

      let validationPromise: Promise<any>;
      
      act(() => {
        validationPromise = result.current.validateFile(mockFile);
      });

      expect(result.current.isValidating).toBe(true);

      // Simulate video metadata loading
      act(() => {
        mockVideoElement.duration = 120; // 2 minutes
        mockVideoElement.videoWidth = 1920;
        mockVideoElement.videoHeight = 1080;
        if (mockVideoElement.onloadedmetadata) {
          mockVideoElement.onloadedmetadata();
        }
      });

      const validationResult = await validationPromise!;

      expect(validationResult.isValid).toBe(true);
      expect(validationResult.fileInfo?.duration).toBe(120);
      expect(validationResult.fileInfo?.dimensions).toEqual({
        width: 1920,
        height: 1080
      });
      expect(result.current.isValidating).toBe(false);
    });

    it('should reject files that fail basic validation', async () => {
      mockValidateVideoFile.mockReturnValue({
        isValid: false,
        error: 'File too large'
      });

      const { result } = renderHook(() => useFileValidation());
      const mockFile = new File(['large content'], 'large.mp4', { type: 'video/mp4' });

      let validationResult: any;
      
      await act(async () => {
        validationResult = await result.current.validateFile(mockFile);
      });

      expect(validationResult.isValid).toBe(false);
      expect(validationResult.error).toBe('File too large');
      expect(result.current.lastValidation).toEqual(validationResult);
    });

    it('should reject videos that exceed maximum duration', async () => {
      mockValidateVideoFile.mockReturnValue({
        isValid: true,
        fileInfo: { size: 1024, type: 'video/mp4' }
      });

      const { result } = renderHook(() => useFileValidation());
      const mockFile = new File(['video content'], 'long.mp4', { type: 'video/mp4' });

      let validationPromise: Promise<any>;
      
      act(() => {
        validationPromise = result.current.validateFile(mockFile, { maxDuration: 60 }); // 1 minute max
      });

      // Simulate long video
      act(() => {
        mockVideoElement.duration = 300; // 5 minutes
        mockVideoElement.videoWidth = 1920;
        mockVideoElement.videoHeight = 1080;
        if (mockVideoElement.onloadedmetadata) {
          mockVideoElement.onloadedmetadata();
        }
      });

      const validationResult = await validationPromise!;

      expect(validationResult.isValid).toBe(false);
      expect(validationResult.error).toContain('duration');
      expect(validationResult.error).toContain('exceeds maximum');
    });

    it('should reject videos with invalid dimensions', async () => {
      mockValidateVideoFile.mockReturnValue({
        isValid: true,
        fileInfo: { size: 1024, type: 'video/mp4' }
      });

      const { result } = renderHook(() => useFileValidation());
      const mockFile = new File(['video content'], 'invalid.mp4', { type: 'video/mp4' });

      let validationPromise: Promise<any>;
      
      act(() => {
        validationPromise = result.current.validateFile(mockFile);
      });

      // Simulate video with invalid dimensions
      act(() => {
        mockVideoElement.duration = 120;
        mockVideoElement.videoWidth = 0; // Invalid width
        mockVideoElement.videoHeight = 1080;
        if (mockVideoElement.onloadedmetadata) {
          mockVideoElement.onloadedmetadata();
        }
      });

      const validationResult = await validationPromise!;

      expect(validationResult.isValid).toBe(false);
      expect(validationResult.error).toContain('corrupted');
    });

    it('should handle video loading errors', async () => {
      mockValidateVideoFile.mockReturnValue({
        isValid: true,
        fileInfo: { size: 1024, type: 'video/mp4' }
      });

      const { result } = renderHook(() => useFileValidation());
      const mockFile = new File(['corrupted content'], 'corrupted.mp4', { type: 'video/mp4' });

      let validationPromise: Promise<any>;
      
      act(() => {
        validationPromise = result.current.validateFile(mockFile);
      });

      // Simulate video loading error
      act(() => {
        if (mockVideoElement.onerror) {
          mockVideoElement.onerror();
        }
      });

      const validationResult = await validationPromise!;

      expect(validationResult.isValid).toBe(false);
      expect(validationResult.error).toContain('corrupted');
    });
  });

  describe('useQuickFileValidation', () => {
    it('should perform quick validation without metadata', async () => {
      mockValidateVideoFile.mockReturnValue({
        isValid: true,
        fileInfo: { size: 1024, type: 'video/mp4' }
      });

      const { result } = renderHook(() => useQuickFileValidation());
      const mockFile = new File(['video content'], 'test.mp4', { type: 'video/mp4' });

      let validationResult: any;
      
      await act(async () => {
        validationResult = await result.current.quickValidate(mockFile);
      });

      expect(validationResult.isValid).toBe(true);
      expect(mockValidateVideoFile).toHaveBeenCalledWith(mockFile, {});
    });

    it('should handle validation errors gracefully', async () => {
      mockValidateVideoFile.mockReturnValue({
        isValid: false,
        error: 'Invalid file type'
      });

      const { result } = renderHook(() => useQuickFileValidation());
      const mockFile = new File(['content'], 'test.txt', { type: 'text/plain' });

      let validationResult: any;
      
      await act(async () => {
        validationResult = await result.current.quickValidate(mockFile);
      });

      expect(validationResult.isValid).toBe(false);
      expect(validationResult.error).toBe('Invalid file type');
    });
  });

  describe('useBatchFileValidation', () => {
    it('should validate multiple files', async () => {
      mockValidateVideoFile
        .mockReturnValueOnce({
          isValid: true,
          fileInfo: { size: 1024, type: 'video/mp4' }
        })
        .mockReturnValueOnce({
          isValid: false,
          error: 'File too large'
        });

      const { result } = renderHook(() => useBatchFileValidation());
      
      const files = [
        new File(['content1'], 'video1.mp4', { type: 'video/mp4' }),
        new File(['content2'], 'video2.mp4', { type: 'video/mp4' })
      ];

      let validationResults: Map<string, any>;
      
      await act(async () => {
        validationResults = await result.current.validateFiles(files);
      });

      expect(validationResults!.size).toBe(2);
      expect(validationResults!.get('video1.mp4')?.isValid).toBe(true);
      expect(validationResults!.get('video2.mp4')?.isValid).toBe(false);
      expect(result.current.validationResults).toEqual(validationResults!);
    });

    it('should clear validation results', () => {
      const { result } = renderHook(() => useBatchFileValidation());

      act(() => {
        result.current.clearResults();
      });

      expect(result.current.validationResults.size).toBe(0);
    });

    it('should handle batch validation errors', async () => {
      mockValidateVideoFile.mockImplementation(() => {
        throw new Error('Validation error');
      });

      const { result } = renderHook(() => useBatchFileValidation());
      
      const files = [
        new File(['content1'], 'video1.mp4', { type: 'video/mp4' })
      ];

      let validationResults: Map<string, any>;
      
      await act(async () => {
        validationResults = await result.current.validateFiles(files);
      });

      expect(validationResults!.size).toBe(0);
      expect(result.current.isValidating).toBe(false);
    });
  });
});