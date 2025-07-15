import React from 'react';

interface ProgressIndicatorProps {
  currentStep: 1 | 2 | 3;
  steps: string[];
  className?: string;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStep,
  steps,
  className = ''
}) => {
  return (
    <div className={`progress-indicator ${className}`}>
      {/* Progress indicator implementation will be added in later tasks */}
      <div className="flex justify-center items-center space-x-4">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex items-center ${
              index + 1 <= currentStep ? 'text-[#8a2be2]' : 'text-gray-400'
            }`}
          >
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
              index + 1 <= currentStep ? 'border-[#8a2be2] bg-[#8a2be2] text-white' : 'border-gray-400'
            }`}>
              {index + 1}
            </div>
            <span className="ml-2 text-sm">{step}</span>
            {index < steps.length - 1 && (
              <div className={`w-8 h-0.5 ml-4 ${
                index + 1 < currentStep ? 'bg-[#8a2be2]' : 'bg-gray-400'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressIndicator;