import { useState, useEffect } from 'react';
import { Maximize2, Minimize2, Copy, CheckCircle, Play, Save } from 'lucide-react';

const CodeEditor = ({ initialCode = '', language = 'html', onCodeChange, showPreview = true }) => {
  const [code, setCode] = useState(initialCode);
  const [copied, setCopied] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  
  useEffect(() => {
    if (initialCode !== code) {
      setCode(initialCode);
    }
  }, [initialCode]);
  
  const handleCodeChange = (e) => {
    const newCode = e.target.value;
    setCode(newCode);
    if (onCodeChange) {
      onCodeChange(newCode);
    }
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const getLanguageClass = () => {
    switch (language) {
      case 'html': return 'language-html';
      case 'css': return 'language-css';
      case 'javascript': return 'language-javascript';
      default: return 'language-plaintext';
    }
  };
  
  return (
    <div className={`border rounded-md overflow-hidden ${fullscreen ? 'fixed inset-0 z-50 bg-white' : ''}`}>
      <div className="flex justify-between items-center px-4 py-2 bg-gray-100 border-b">
        <div className="text-sm font-medium text-gray-700 capitalize">{language}</div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={copyToClipboard}
            className="p-1.5 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-200"
            title={copied ? 'Copied!' : 'Copy code'}
          >
            {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
          </button>
          <button
            onClick={() => setFullscreen(!fullscreen)}
            className="p-1.5 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-200"
            title={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {fullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>
      
      <div className={`flex ${showPreview ? 'flex-col md:flex-row' : 'flex-col'}`}>
        <div className={`${showPreview ? 'md:w-1/2' : 'w-full'}`}>
          <textarea
            value={code}
            onChange={handleCodeChange}
            className="w-full h-64 p-4 font-mono text-sm bg-gray-50 focus:outline-none resize-none"
            spellCheck="false"
          />
        </div>
        
        {showPreview && (
          <div className={`border-t md:border-t-0 md:border-l md:w-1/2`}>
            <div className="flex justify-between items-center px-4 py-2 bg-gray-100 border-b">
              <div className="text-sm font-medium text-gray-700">Preview</div>
              <button 
                className="p-1.5 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-200"
                title="Run"
              >
                <Play size={16} />
              </button>
            </div>
            <div className="h-64 p-4 overflow-auto bg-white">
              <iframe
                title="Code Preview"
                srcDoc={code}
                sandbox="allow-scripts"
                className="w-full h-full border-none"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeEditor;