import React, { lazy, Suspense } from 'react';
import { ArweaveUploaderProps } from '../../types/ArweaveTypes';
import { LoadingSpinner } from './ProgressIndicator';

// Lazy load the main uploader component
const ArweaveUploaderContainer = lazy(() => 
  import('./ArweaveUploaderContainer').then(module => ({
    default: module.ArweaveUploaderContainer
  }))
);

// Lazy load individual components for code splitting
const VideoSelector = lazy(() => 
  import('./VideoSelector').then(module => ({
    default: module.VideoSelector
  }))
);

const WalletKeyLoader = lazy(() => 
  import('./WalletKeyLoader').then(module => ({
    default: module.WalletKeyLoader
  }))
);

const UploadProcessor = lazy(() => 
  import('./UploadProcessor').then(module => ({
    default: module.UploadProcessor
  }))
);

/**
 * Lazy-loaded Arweave uploader with loading fallback
 */
export function LazyArweaveUploader(props: ArweaveUploaderProps) {
  return (
    <Suspense fallback={<ArweaveUploaderSkeleton />}>
      <ArweaveUploaderContainer {...props} />
    </Suspense>
  );
}

/**
 * Lazy-loaded individual components for granular loading
 */
export function LazyVideoSelector(props: any) {
  return (
    <Suspense fallback={<ComponentSkeleton />}>
      <VideoSelector {...props} />
    </Suspense>
  );
}

export function LazyWalletKeyLoader(props: any) {
  return (
    <Suspense fallback={<ComponentSkeleton />}>
      <WalletKeyLoader {...props} />
    </Suspense>
  );
}

export function LazyUploadProcessor(props: any) {
  return (
    <Suspense fallback={<ComponentSkeleton />}>
      <UploadProcessor {...props} />
    </Suspense>
  );
}

/**
 * Loading skeleton for the full uploader
 */
function ArweaveUploaderSkeleton() {
  return (
    <div className="w-full max-w-4xl mx-auto animate-pulse">
      {/* Header skeleton */}
      <div className="text-center mb-8">
        <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
      </div>

      {/* Progress indicator skeleton */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex flex-col items-center">
              <div className="w-10 h-10 bg-gray-200 rounded-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-16 mb-1"></div>
              <div className="h-2 bg-gray-200 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Main content skeleton */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="h-64 bg-gray-200 rounded mb-4"></div>
        <div className="flex space-x-4">
          <div className="h-10 bg-gray-200 rounded flex-1"></div>
          <div className="h-10 bg-gray-200 rounded w-24"></div>
        </div>
      </div>

      {/* Help section skeleton */}
      <div className="mt-8">
        <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );
}

/**
 * Loading skeleton for individual components
 */
function ComponentSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-48 bg-gray-200 rounded mb-4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    </div>
  );
}

/**
 * Preloader for critical components
 */
export function preloadArweaveComponents() {
  // Preload critical components
  import('./ArweaveUploaderContainer');
  import('./VideoSelector');
  import('./WalletKeyLoader');
  import('./UploadProcessor');
  import('./ProgressIndicator');
  import('./ErrorDisplay');
  import('./HelpTooltip');
}

/**
 * Hook for preloading components on user interaction
 */
export function useArweavePreloader() {
  const preloadOnHover = React.useCallback(() => {
    preloadArweaveComponents();
  }, []);

  const preloadOnFocus = React.useCallback(() => {
    preloadArweaveComponents();
  }, []);

  return {
    preloadOnHover,
    preloadOnFocus
  };
}