// src/pages/Playground.jsx
import { useState, useEffect } from 'react';
import { Maximize2, Minimize2, Code, Save, Play, Download, Upload, Copy, CheckCircle } from 'lucide-react';

const PlaygroundPage = () => {
  const [htmlCode, setHtmlCode] = useState(
    '<!DOCTYPE html>\n<html>\n<head>\n  <title>My Playground</title>\n</head>\n<body>\n  <h1>Welcome to CodeLearn Playground</h1>\n  <p>Start coding here!</p>\n</body>\n</html>'
  );
  const [cssCode, setCssCode] = useState(
    'body {\n  font-family: Arial, sans-serif;\n  margin: 20px;\n  background-color: #f5f5f5;\n}\n\nh1 {\n  color: #333;\n}\n\np {\n  color: #666;\n}'
  );
  const [jsCode, setJsCode] = useState(
    'document.addEventListener("DOMContentLoaded", function() {\n  console.log("Playground loaded!");\n});'
  );
  
  const [output, setOutput] = useState('');
  const [fullscreen, setFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState('html');
  const [copied, setCopied] = useState(false);
  
  // Update output when code changes
  useEffect(() => {
    updateOutput();
  }, [htmlCode, cssCode, jsCode]);
  
  const updateOutput = () => {
    // Combine HTML, CSS, and JS
    const combinedCode = `
      ${htmlCode}
      <style>${cssCode}</style>
      <script>${jsCode}</script>
    `;
    
    setOutput(combinedCode);
  };
  
  const handleRun = () => {
    // This would ideally refresh the iframe
    const iframe = document.getElementById('output-frame');
    if (iframe) {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      iframeDoc.open();
      iframeDoc.write(output);
      iframeDoc.close();
    }
  };
  
  const copyCode = () => {
    const codeToCopy = activeTab === 'html' ? htmlCode : 
                      activeTab === 'css' ? cssCode : jsCode;
    
    navigator.clipboard.writeText(codeToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const downloadCode = () => {
    let filename, content, type;
    
    if (activeTab === 'html') {
      filename = 'index.html';
      content = htmlCode;
      type = 'text/html';
    } else if (activeTab === 'css') {
      filename = 'styles.css';
      content = cssCode;
      type = 'text/css';
    } else {
      filename = 'script.js';
      content = jsCode;
      type = 'text/javascript';
    }
    
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className={`p-4 ${fullscreen ? 'fixed inset-0 z-50 bg-white' : ''}`}>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Code Playground</h1>
        <p className="text-gray-600">
          Test and experiment with HTML, CSS, and JavaScript in real-time.
        </p>
      </div>
      
      <div className="relative h-[calc(100vh-220px)] border rounded-lg overflow-hidden shadow-sm">
        <div className="absolute top-2 right-2 z-10">
          <button
            onClick={() => setFullscreen(!fullscreen)}
            className="p-2 bg-white rounded-md shadow hover:bg-gray-100"
            title={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {fullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>
        
        <div className="h-full flex flex-col md:flex-row">
          {/* Editor Section */}
          <div className="w-full md:w-1/2 h-full flex flex-col">
            <div className="flex border-b">
              <button
                className={`px-4 py-2 flex items-center text-sm font-medium ${
                  activeTab === 'html' ? 'bg-gray-100 border-b-2 border-emerald-500' : 'hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('html')}
              >
                HTML
              </button>
              <button
                className={`px-4 py-2 flex items-center text-sm font-medium ${
                  activeTab === 'css' ? 'bg-gray-100 border-b-2 border-emerald-500' : 'hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('css')}
              >
                CSS
              </button>
              <button
                className={`px-4 py-2 flex items-center text-sm font-medium ${
                  activeTab === 'js' ? 'bg-gray-100 border-b-2 border-emerald-500' : 'hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('js')}
              >
                JavaScript
              </button>
              
              <div className="ml-auto flex items-center px-2">
                <button
                  onClick={copyCode}
                  className="p-1.5 text-gray-500 hover:text-gray-700"
                  title="Copy code"
                >
                  {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                </button>
                <button
                  onClick={downloadCode}
                  className="p-1.5 text-gray-500 hover:text-gray-700"
                  title="Download code"
                >
                  <Download size={16} />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-auto">
              {activeTab === 'html' && (
                <textarea
                  className="w-full h-full p-4 font-mono text-sm focus:outline-none resize-none"
                  value={htmlCode}
                  onChange={(e) => setHtmlCode(e.target.value)}
                  spellCheck="false"
                />
              )}
              
              {activeTab === 'css' && (
                <textarea
                  className="w-full h-full p-4 font-mono text-sm focus:outline-none resize-none"
                  value={cssCode}
                  onChange={(e) => setCssCode(e.target.value)}
                  spellCheck="false"
                />
              )}
              
              {activeTab === 'js' && (
                <textarea
                  className="w-full h-full p-4 font-mono text-sm focus:outline-none resize-none"
                  value={jsCode}
                  onChange={(e) => setJsCode(e.target.value)}
                  spellCheck="false"
                />
              )}
            </div>
          </div>
          
          {/* Output Section */}
          <div className="w-full md:w-1/2 h-full flex flex-col border-t md:border-t-0 md:border-l">
            <div className="flex items-center justify-between px-4 py-2 bg-gray-100 border-b">
              <h3 className="text-sm font-medium text-gray-700">Output</h3>
              <button
                onClick={handleRun}
                className="flex items-center gap-1 px-2 py-1 text-xs bg-emerald-600 text-white rounded hover:bg-emerald-700"
              >
                <Play size={12} />
                Run
              </button>
            </div>
            
            <div className="flex-1 bg-white">
              <iframe
                id="output-frame"
                srcDoc={output}
                title="Output"
                className="w-full h-full border-none"
                sandbox="allow-scripts"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
          <h3 className="font-medium text-blue-800 mb-1 flex items-center gap-1">
            <Code size={16} /> HTML
          </h3>
          <p className="text-blue-700 text-sm">
            Structure your content with HTML tags to create the skeleton of your page.
          </p>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-md border border-purple-100">
          <h3 className="font-medium text-purple-800 mb-1 flex items-center gap-1">
            <Code size={16} /> CSS
          </h3>
          <p className="text-purple-700 text-sm">
            Style your HTML elements with CSS to make your page visually appealing.
          </p>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-md border border-yellow-100">
          <h3 className="font-medium text-yellow-800 mb-1 flex items-center gap-1">
            <Code size={16} /> JavaScript
          </h3>
          <p className="text-yellow-700 text-sm">
            Add interactivity to your page with JavaScript to create a dynamic experience.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlaygroundPage;