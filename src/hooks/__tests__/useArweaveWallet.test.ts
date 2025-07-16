import { renderHook, act } from '@testing-library/react';
import { useArweaveWallet, useArweaveWalletOperations } from '../useArweaveWallet';
import { ArweaveWalletService } from '../../services/ArweaveWalletService';
import { ArweaveWalletKey } from '../../types/ArweaveTypes';

// Mock the ArweaveWalletService
jest.mock('../../services/ArweaveWalletService');

// Mock FileReader
const mockFileReader = {
  readAsText: jest.fn(),
  onload: null as any,
  onerror: null as any,
  result: null as any
};

global.FileReader = jest.fn(() => mockFileReader) as any;

describe('useArweaveWallet', () => {
  const mockWallet: ArweaveWalletKey = {
    kty: 'RSA',
    n: 'test-n-value',
    e: 'AQAB',
    d: 'test-d-value',
    p: 'test-p-value',
    q: 'test-q-value',
    dp: 'test-dp-value',
    dq: 'test-dq-value',
    qi: 'test-qi-value'
  };

  const mockWalletInfo = {
    address: 'test-address-123',
    formattedAddress: 'test-a...e-123',
    balance: 5.0,
    formattedBalance: '5.00 AR'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockFileReader.onload = null;
    mockFileReader.onerror = null;
    mockFileReader.result = null;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('useArweaveWallet', () => {
    it('should initialize with correct default state', () => {
      const { result } = renderHook(() => useArweaveWallet());

      expect(result.current.walletKey).toBe(null);
      expect(result.current.walletInfo).toBe(null);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should successfully load a valid wallet', async () => {
      (ArweaveWalletService.validateWalletKey as jest.Mock).mockResolvedValue({
        isValid: true,
        walletAddress: 'test-address-123'
      });
      (ArweaveWalletService.getWalletInfo as jest.Mock).mockResolvedValue(mockWalletInfo);

      const { result } = renderHook(() => useArweaveWallet());
      const mockFile = new File([JSON.stringify(mockWallet)], 'wallet.json', {
        type: 'application/json'
      });

      await act(async () => {
        const loadPromise = result.current.loadWallet(mockFile);
        
        // Simulate FileReader success
        if (mockFileReader.onload) {
          mockFileReader.result = JSON.stringify(mockWallet);
          mockFileReader.onload({ target: { result: JSON.stringify(mockWallet) } } as any);
        }
        
        await loadPromise;
      });

      expect(result.current.walletKey).toEqual(mockWallet);
      expect(result.current.walletInfo).toEqual(mockWalletInfo);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should handle wallet validation errors', async () => {
      (ArweaveWalletService.validateWalletKey as jest.Mock).mockResolvedValue({
        isValid: false,
        error: 'Invalid wallet key format'
      });

      const { result } = renderHook(() => useArweaveWallet());
      const mockFile = new File(['invalid content'], 'invalid.json', {
        type: 'application/json'
      });

      await act(async () => {
        await result.current.loadWallet(mockFile);
      });

      expect(result.current.walletKey).toBe(null);
      expect(result.current.walletInfo).toBe(null);
      expect(result.current.error).toMatchObject({
        type: 'validation',
        message: 'Invalid wallet key format'
      });
    });

    it('should handle file reading errors', async () => {
      const { result } = renderHook(() => useArweaveWallet());
      const mockFile = new File(['content'], 'wallet.json', {
        type: 'application/json'
      });

      await act(async () => {
        const loadPromise = result.current.loadWallet(mockFile);
        
        // Simulate FileReader error
        if (mockFileReader.onerror) {
          mockFileReader.onerror();
        }
        
        await loadPromise;
      });

      expect(result.current.walletKey).toBe(null);
      expect(result.current.error).toMatchObject({
        type: 'validation',
        message: 'Failed to load wallet key'
      });
    });

    it('should clear wallet data', () => {
      const { result } = renderHook(() => useArweaveWallet());

      // Set some initial state
      act(() => {
        (result.current as any).setWalletKey = mockWallet;
        (result.current as any).setWalletInfo = mockWalletInfo;
      });

      act(() => {
        result.current.clearWallet();
      });

      expect(result.current.walletKey).toBe(null);
      expect(result.current.walletInfo).toBe(null);
      expect(result.current.error).toBe(null);
    });

    it('should validate wallet keys', async () => {
      (ArweaveWalletService.quickValidate as jest.Mock).mockResolvedValue({
        isValid: true,
        address: 'test-address-123'
      });

      const { result } = renderHook(() => useArweaveWallet());

      let validationResult: any;
      await act(async () => {
        validationResult = await result.current.validateWallet(mockWallet);
      });

      expect(validationResult.isValid).toBe(true);
      expect(validationResult.address).toBe('test-address-123');
    });

    it('should refresh wallet info', async () => {
      (ArweaveWalletService.validateWalletKey as jest.Mock).mockResolvedValue({
        isValid: true,
        walletAddress: 'test-address-123'
      });
      (ArweaveWalletService.getWalletInfo as jest.Mock)
        .mockResolvedValueOnce(mockWalletInfo)
        .mockResolvedValueOnce({
          ...mockWalletInfo,
          balance: 10.0,
          formattedBalance: '10.00 AR'
        });

      const { result } = renderHook(() => useArweaveWallet());
      const mockFile = new File([JSON.stringify(mockWallet)], 'wallet.json', {
        type: 'application/json'
      });

      // Load wallet first
      await act(async () => {
        const loadPromise = result.current.loadWallet(mockFile);
        
        if (mockFileReader.onload) {
          mockFileReader.result = JSON.stringify(mockWallet);
          mockFileReader.onload({ target: { result: JSON.stringify(mockWallet) } } as any);
        }
        
        await loadPromise;
      });

      // Refresh wallet info
      await act(async () => {
        await result.current.refreshWalletInfo();
      });

      expect(result.current.walletInfo?.balance).toBe(10.0);
    });

    it('should check sufficient balance', async () => {
      (ArweaveWalletService.validateSufficientBalance as jest.Mock).mockResolvedValue({
        sufficient: true,
        balance: 5.0,
        shortfall: undefined
      });

      const { result } = renderHook(() => useArweaveWallet());
      
      // Set wallet key manually for this test
      act(() => {
        (result.current as any).walletKey = mockWallet;
      });

      let balanceResult: any;
      await act(async () => {
        balanceResult = await result.current.checkSufficientBalance(2.0);
      });

      expect(balanceResult.sufficient).toBe(true);
      expect(balanceResult.balance).toBe(5.0);
    });

    it('should handle insufficient balance', async () => {
      (ArweaveWalletService.validateSufficientBalance as jest.Mock).mockResolvedValue({
        sufficient: false,
        balance: 1.0,
        shortfall: 1.0
      });

      const { result } = renderHook(() => useArweaveWallet());
      
      // Set wallet key manually for this test
      act(() => {
        (result.current as any).walletKey = mockWallet;
      });

      let balanceResult: any;
      await act(async () => {
        balanceResult = await result.current.checkSufficientBalance(2.0);
      });

      expect(balanceResult.sufficient).toBe(false);
      expect(balanceResult.shortfall).toBe(1.0);
    });

    it('should auto-refresh wallet info periodically', async () => {
      (ArweaveWalletService.validateWalletKey as jest.Mock).mockResolvedValue({
        isValid: true,
        walletAddress: 'test-address-123'
      });
      (ArweaveWalletService.getWalletInfo as jest.Mock).mockResolvedValue(mockWalletInfo);

      const { result } = renderHook(() => useArweaveWallet());
      const mockFile = new File([JSON.stringify(mockWallet)], 'wallet.json', {
        type: 'application/json'
      });

      // Load wallet
      await act(async () => {
        const loadPromise = result.current.loadWallet(mockFile);
        
        if (mockFileReader.onload) {
          mockFileReader.result = JSON.stringify(mockWallet);
          mockFileReader.onload({ target: { result: JSON.stringify(mockWallet) } } as any);
        }
        
        await loadPromise;
      });

      // Fast-forward time to trigger auto-refresh
      act(() => {
        jest.advanceTimersByTime(5 * 60 * 1000); // 5 minutes
      });

      // Should have called getWalletInfo twice (once for load, once for refresh)
      expect(ArweaveWalletService.getWalletInfo).toHaveBeenCalledTimes(2);
    });
  });

  describe('useArweaveWalletOperations', () => {
    it('should validate wallet files', async () => {
      (ArweaveWalletService.validateWalletKey as jest.Mock).mockResolvedValue({
        isValid: true,
        walletAddress: 'test-address-123'
      });

      const { result } = renderHook(() => useArweaveWalletOperations());
      const mockFile = new File([JSON.stringify(mockWallet)], 'wallet.json', {
        type: 'application/json'
      });

      let validationResult: any;
      await act(async () => {
        validationResult = await result.current.validateWalletFile(mockFile);
      });

      expect(validationResult.isValid).toBe(true);
      expect(validationResult.walletAddress).toBe('test-address-123');
    });

    it('should get wallet information', async () => {
      (ArweaveWalletService.getWalletInfo as jest.Mock).mockResolvedValue(mockWalletInfo);

      const { result } = renderHook(() => useArweaveWalletOperations());

      let walletInfo: any;
      await act(async () => {
        walletInfo = await result.current.getWalletInfo(mockWallet);
      });

      expect(walletInfo).toEqual(mockWalletInfo);
    });

    it('should check wallet balance', async () => {
      (ArweaveWalletService.checkBalance as jest.Mock).mockResolvedValue(5.0);

      const { result } = renderHook(() => useArweaveWalletOperations());

      let balance: any;
      await act(async () => {
        balance = await result.current.checkBalance(mockWallet);
      });

      expect(balance).toBe(5.0);
    });

    it('should handle service errors gracefully', async () => {
      (ArweaveWalletService.validateWalletKey as jest.Mock).mockRejectedValue(
        new Error('Network error')
      );

      const { result } = renderHook(() => useArweaveWalletOperations());
      const mockFile = new File(['content'], 'wallet.json', {
        type: 'application/json'
      });

      let validationResult: any;
      await act(async () => {
        validationResult = await result.current.validateWalletFile(mockFile);
      });

      expect(validationResult.isValid).toBe(false);
      expect(result.current.error).toMatchObject({
        type: 'validation',
        message: 'Wallet validation failed'
      });
    });

    it('should clear errors', () => {
      const { result } = renderHook(() => useArweaveWalletOperations());

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBe(null);
    });
  });
});