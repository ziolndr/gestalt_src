import React from 'react';

interface AnalysisInputProps {
  analysisType: string;
  query: string;
  setQuery: (query: string) => void;
  repositoryURL: string;
  setRepositoryURL: (url: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const AnalysisInput: React.FC<AnalysisInputProps> = ({
  analysisType,
  query,
  setQuery,
  repositoryURL,
  setRepositoryURL,
  onSubmit
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {analysisType === 'code' && (
        <input
          type="text"
          value={repositoryURL}
          onChange={(e) => setRepositoryURL(e.target.value)}
          className="w-full bg-[#1a1a1a] text-white px-4 py-2 rounded-md"
          placeholder="Enter repository URL"
        />
      )}
      <div className="flex">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-grow bg-[#1a1a1a] text-white px-4 py-2 rounded-md"
          placeholder={analysisType === 'repository' ? "Enter repository query" : "Enter code query"}
        />
        <button 
          type="submit" 
          className="ml-2 bg-green-500 text-white px-6 py-2 rounded-md"
          disabled={analysisType === 'code' && !repositoryURL}
        >
          Analyze
        </button>
      </div>
    </form>
  );
};

export default AnalysisInput;