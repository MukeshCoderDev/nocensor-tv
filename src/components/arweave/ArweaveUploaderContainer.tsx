import React from 'react';

interface ArweaveUploaderContainerProps {
  onUploadComplete?: (transactionId: string) => void;
  onError?: (error: any) => void;
  className?: string;
}

const ArweaveUploaderContainer: React.FC<ArweaveUploaderContainerProps> = ({
  onUploadComplete,
  onError,
  className = ''
}) => {
  return (
    <div className={`arweave-uploader-container ${className}`}>
      {/* Container implementation will be added in later tasks */}
      <div className="text-center p-8">
        <h2 className="text-2xl font-semibold mb-4 text-[#f5f5f5]">Arweave Uploader</h2>
        <p className="text-gray-400">Implementation in progress...</p>
      </div>
    </div>
  );
};

export default ArweaveUploaderContainer;