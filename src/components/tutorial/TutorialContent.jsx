import { useState } from 'react';
import { Copy, CheckCircle } from 'lucide-react';
import CodeExample from './CodeExample';

const TutorialContent = ({ content }) => {
  const [copied, setCopied] = useState(false);
  
  if (!content) {
    return <div>Content not available</div>;
  }
  
  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="prose max-w-none">
      <h1 className="text-3xl font-bold mb-6">{content.title}</h1>
      
      {content.introduction && (
        <div className="mb-6">
          <p className="text-xl text-gray-600">{content.introduction}</p>
        </div>
      )}
      
      {/* Table of Contents */}
      {content.sections && content.sections.length > 0 && (
        <div className="mb-8 p-4 bg-gray-50 rounded-md">
          <h2 className="text-lg font-medium mb-2">In this tutorial:</h2>
          <ul className="space-y-1">
            {content.sections.map((section, index) => (
              <li key={index}>
                <a 
                  href={`#section-${index}`}
                  className="text-emerald-600 hover:text-emerald-700 hover:underline"
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Sections */}
      {content.sections && content.sections.map((section, index) => (
        <section key={index} id={`section-${index}`} className="mb-10">
          <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
          
          {section.text && (
            <div className="mb-4">
              {section.text.split('\n\n').map((paragraph, i) => (
                <p key={i} className="mb-4">{paragraph}</p>
              ))}
            </div>
          )}
          
          {section.code && (
            <div className="mb-6">
              <CodeExample 
                code={section.code} 
                language={section.language || 'html'} 
                title={section.codeTitle || 'Example'} 
                showLineNumbers={true}
                onCopy={() => copyCode(section.code)}
              />
            </div>
          )}
          
          {section.output && (
            <div className="mb-6">
              <h4 className="text-sm font-medium mb-2 text-gray-500">Output:</h4>
              <div className="border p-4 rounded-md bg-gray-50">
                <div dangerouslySetInnerHTML={{ __html: section.output }} />
              </div>
            </div>
          )}
          
          {section.note && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-md mb-4">
              <h4 className="font-bold text-blue-800 mb-1">Note</h4>
              <p className="text-blue-700">{section.note}</p>
            </div>
          )}
        </section>
      ))}
    </div>
  );
};

export default TutorialContent;