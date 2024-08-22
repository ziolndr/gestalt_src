import { useState, useEffect } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs'

const CodePreview = ({ selectedRepository, selectedFile }) => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');

  useEffect(() => {
    if (selectedFile) {
      // Fetch file content
      fetchFileContent(selectedRepository, selectedFile)
        .then(content => setCode(content))
        .catch(error => console.error('Error fetching file content:', error));

      // Determine language based on file extension
      const extension = selectedFile.split('.').pop();
      setLanguage(getLanguageFromExtension(extension));
    }
  }, [selectedRepository, selectedFile]);

  return (
    <div className="bg-black p-6 rounded-sm border border-[#2a2a2a]">
      <h2 className="text-xl font-mono text-green-400 mb-6">Code Preview</h2>
      {selectedFile ? (
        <SyntaxHighlighter language={language} style={atomOneDark}>
          {code}
        </SyntaxHighlighter>
      ) : (
        <p className="text-gray-400">Select a file to preview code</p>
      )}
    </div>
  );
};

export default CodePreview;