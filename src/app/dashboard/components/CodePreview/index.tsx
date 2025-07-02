import { useState, useEffect } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

interface CodePreviewProps {
  selectedRepository: string;
  selectedFile: string;
}

const CodePreview: React.FC<CodePreviewProps> = ({ selectedRepository, selectedFile }) => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');

  useEffect(() => {
    const fetchCode = async () => {
      try {
        const response = await fetch(
          `https://raw.githubusercontent.com/${selectedRepository}/main/${selectedFile}`
        );
        const rawCode = await response.text();
        setCode(rawCode);

        const extension = selectedFile.split('.').pop()?.toLowerCase();
        switch (extension) {
          case 'ts':
          case 'tsx':
            setLanguage('typescript');
            break;
          case 'js':
          case 'jsx':
            setLanguage('javascript');
            break;
          case 'py':
            setLanguage('python');
            break;
          case 'json':
            setLanguage('json');
            break;
          default:
            setLanguage('text');
        }
      } catch (err) {
        console.error('Error fetching code:', err);
        setCode('// Unable to fetch code preview');
        setLanguage('text');
      }
    };

    if (selectedRepository && selectedFile) {
      fetchCode();
    }
  }, [selectedRepository, selectedFile]);

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden">
      <SyntaxHighlighter language={language} style={atomOneDark} customStyle={{ padding: '1rem', fontSize: '0.85rem' }}>
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodePreview;
