import React from 'react';

interface AnalysisTypeSelectorProps {
  analysisType: string;
  setAnalysisType: (type: string) => void;
}

const AnalysisTypeSelector: React.FC<AnalysisTypeSelectorProps> = ({ analysisType, setAnalysisType }) => {
  return (
    <div className="flex space-x-4 mb-4">
      <button
        className={`px-4 py-2 rounded-md ${
          analysisType === 'repository' 
            ? 'bg-green-500 text-white' 
            : 'bg-gray-700 text-gray-300'
        }`}
        onClick={() => setAnalysisType('repository')}
      >
        Repository Analysis
      </button>
      <button
        className={`px-4 py-2 rounded-md ${
          analysisType === 'code' 
            ? 'bg-green-500 text-white' 
            : 'bg-gray-700 text-gray-300'
        }`}
        onClick={() => setAnalysisType('code')}
      >
        Code Analysis
      </button>
    </div>
  );
};

export default AnalysisTypeSelector;