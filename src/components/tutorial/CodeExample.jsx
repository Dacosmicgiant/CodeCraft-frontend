import { useState } from 'react';
import { Copy, CheckCircle, Play } from 'lucide-react';

const CodeExample = ({ 
  code, 
  language = 'html', 
  title = 'Example', 
  showLineNumbers = true,
  showCopyButton = true,
  showRunButton = false,
  onCopy,
  onRun
}) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    if (onCopy) {
      onCopy();
    }
  };
  
  const handleRun = () => {
    if (onRun) {
      onRun(code);
    }
  };
  
  // Add line numbers
  const codeWithLineNumbers = showLineNumbers 
    ? code.split('\n').map((line, i) => `${i + 1}| ${line}`).join('\n')
    : code;
  
  return (
    <div className="rounded-md overflow-hidden border">
      <div className="flex justify-between items-center px-4 py-2 bg-gray-100 border-b">
        <div className="text-sm font-medium text-gray-700">{title}</div>
        <div className="flex items-center space-x-2">
          {showCopyButton && (
            <button 
              onClick={handleCopy}
              className="p-1.5 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-200"
              title={copied ? 'Copied!' : 'Copy code'}
            >
              {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
            </button>
          )}
          
          {showRunButton && (
            <button
              onClick={handleRun}
              className="p-1.5 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-200"
              title="Run code"
            >
              <Play size={16} />
            </button>
          )}
        </div>
      </div>
      
      <div className="bg-gray-800 text-white overflow-x-auto">
        <pre className={`p-4 font-mono text-sm whitespace-pre ${showLineNumbers ? 'pl-12' : ''}`}>
          <code className={`language-${language}`}>
            {showLineNumbers ? codeWithLineNumbers : code}
          </code>
        </pre>
      </div>
    </div>
  );
};

export default CodeExample;