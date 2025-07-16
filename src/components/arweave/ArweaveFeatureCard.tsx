import React, { useState } from 'react';
import { ArweaveUploaderModal } from './ArweaveUploaderContainer';

/**
 * Premium Arweave feature card that matches NoCensor TV's design
 */
export function ArweaveFeatureCard() {
  const [showUploader, setShowUploader] = useState(false);
  const [uploadCount, setUploadCount] = useState(0);

  const handleUploadComplete = (transactionId: string) => {
    setUploadCount(prev => prev + 1);
    setShowUploader(false);
    
    // Show success notification
    console.log('Arweave upload completed:', transactionId);
  };

  return (
    <>
      {/* Premium Feature Card */}
      <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 rounded-xl p-6 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
            <defs>
              <pattern id="arweave-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="1" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#arweave-pattern)" />
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold">Permanent Storage</h3>
                <p className="text-purple-200 text-sm">Powered by Arweave</p>
              </div>
            </div>
            
            {/* Status Badge */}
            <div className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-xs font-medium border border-green-500/30">
              ✨ Demo Ready
            </div>
          </div>

          {/* Description */}
          <p className="text-purple-100 mb-6 leading-relaxed">
            Store your videos permanently on the decentralized Arweave network. 
            Censorship-resistant, forever accessible, truly owned by creators.
          </p>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm text-purple-100">Permanent Storage</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm text-purple-100">Censorship Resistant</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm text-purple-100">Creator Owned</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm text-purple-100">Global Access</span>
            </div>
          </div>

          {/* Stats */}
          {uploadCount > 0 && (
            <div className="bg-white/10 rounded-lg p-3 mb-4 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="text-purple-200 text-sm">Demo Uploads</span>
                <span className="text-white font-bold">{uploadCount}</span>
              </div>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={() => setShowUploader(true)}
            className="w-full bg-white text-purple-900 font-bold py-3 px-6 rounded-xl hover:bg-purple-50 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            <span>Try Arweave Upload</span>
          </button>
        </div>
      </div>

      {/* Upload Modal */}
      <ArweaveUploaderModal
        isOpen={showUploader}
        onClose={() => setShowUploader(false)}
        onUploadComplete={handleUploadComplete}
        onError={(error) => console.error('Upload error:', error)}
      />
    </>
  );
}

/**
 * Compact Arweave feature for smaller spaces
 */
export function CompactArweaveFeature() {
  const [showUploader, setShowUploader] = useState(false);

  return (
    <>
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div>
              <h4 className="font-semibold">Arweave Storage</h4>
              <p className="text-xs text-purple-200">Permanent & Decentralized</p>
            </div>
          </div>
          <button
            onClick={() => setShowUploader(true)}
            className="bg-white text-purple-600 px-3 py-1 rounded-md text-sm font-medium hover:bg-purple-50 transition-colors"
          >
            Upload
          </button>
        </div>
      </div>

      <ArweaveUploaderModal
        isOpen={showUploader}
        onClose={() => setShowUploader(false)}
        onUploadComplete={(txId) => console.log('Upload complete:', txId)}
      />
    </>
  );
}