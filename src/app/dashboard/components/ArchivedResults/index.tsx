import React from 'react';

interface ArchivedResultsProps {
  results: any[];
}

const ArchivedResults: React.FC<ArchivedResultsProps> = ({ results }) => {
  return (
    <div className="bg-black p-6 rounded-sm border border-[#2a2a2a] h-full">
      <h2 className="text-xl font-mono text-white-400 mb-6">Archived Results</h2>
      {results.length === 0 ? (
        <p className="text-gray-400">No archived results yet.</p>
      ) : (
        <ul className="space-y-4">
          {results.map((result, index) => (
            <li key={index} className="border-b border-gray-700 pb-2">
              <h3 className="text-white font-semibold">{result.name}</h3>
              <p className="text-gray-400 text-sm">{result.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ArchivedResults;
