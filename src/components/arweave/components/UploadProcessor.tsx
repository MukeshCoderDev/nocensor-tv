import React from 'react';

interface UploadProcessorProps {
  videoFile: File | null;
  walletKey: any;
  onUploadComplete: (transactionId: string) => void;
  onError: (error: any) => void;
  isDisabled?: boolean;
}

const UploadProcessor: React.FC<UploadProcessorProps> = ({
  videoFile,
  walletKey,
  onUploadComplete,
  onError,
  isDisabled = false
}) => {
  return (
    <div className="upload-processor">
      {/* Upload processor implementation will be added in later tasks */}
      <div className="text-center p-4 border border-gray-600 rounded-lg">
        <p className="text-gray-400">Upload Processor Component</p>
      </div>
    </div>
  );
};

export default UploadProcessor;