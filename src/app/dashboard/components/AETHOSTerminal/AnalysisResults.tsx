import React, { useState } from 'react';

interface AnalysisResultsProps {
  results: any[]; // Replace 'any' with a more specific type if possible
  analysisType: string;
  onSaveResult: (result: any) => void;
  setSelectedRepository: (repo: any) => void;
  setSelectedFile: (file: string) => void;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({
  results,
  analysisType,
  onSaveResult,
  setSelectedRepository,
  setSelectedFile
}) => {
  const [selectedTab, setSelectedTab] = useState('summary');

  const handleRepositorySelect = (repository: any) => {
    setSelectedRepository(repository);
    // Assuming the repository object has a 'files' property
    if (repository.files && repository.files.length > 0) {
      setSelectedFile(repository.files[0]);
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
      <div className="flex mb-4">
        <button 
          className={`mr-2 px-4 py-2 rounded-md ${selectedTab === 'summary' ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-300'}`}
          onClick={() => setSelectedTab('summary')}
        >
          Summary
        </button>
        <button 
          className={`px-4 py-2 rounded-md ${selectedTab === 'details' ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-300'}`}
          onClick={() => setSelectedTab('details')}
        >
          Details
        </button>
      </div>
      {selectedTab === 'summary' ? (
        <AnalysisSummary results={results} analysisType={analysisType} />
      ) : (
        <AnalysisDetails 
          results={results} 
          analysisType={analysisType} 
          onSaveResult={onSaveResult}
          onSelectRepository={handleRepositorySelect}
          setSelectedFile={setSelectedFile}
        />
      )}
    </div>
  );
};

const AnalysisSummary: React.FC<{ results: any[], analysisType: string }> = ({ results, analysisType }) => {
  // Implement summary view
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Analysis Summary</h3>
      {/* Add summary content here */}
    </div>
  );
};

const AnalysisDetails: React.FC<{
  results: any[],
  analysisType: string,
  onSaveResult: (result: any) => void,
  onSelectRepository: (repo: any) => void,
  setSelectedFile: (file: string) => void
}> = ({ results, analysisType, onSaveResult, onSelectRepository, setSelectedFile }) => {
  // Implement detailed view
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Detailed Results</h3>
      {results.map((result, index) => (
        <div key={index} className="mb-4 p-4 bg-gray-800 rounded-md">
          <h4 className="font-semibold">{result.name}</h4>
          <p>{result.description}</p>
          <button 
            onClick={() => onSelectRepository(result)}
            className="mt-2 mr-2 px-3 py-1 bg-blue-500 text-white rounded-md"
          >
            View Repository
          </button>
          <button 
            onClick={() => onSaveResult(result)}
            className="mt-2 px-3 py-1 bg-green-500 text-white rounded-md"
          >
            Save Result
          </button>
        </div>
      ))}
    </div>
  );
};

export default AnalysisResults;