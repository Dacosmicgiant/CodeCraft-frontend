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
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">{content.title}</h1>
      
      {content.introduction && (
        <div className="mb-4 md:mb-6">
          <p className="text-lg md:text-xl text-gray-600">{content.introduction}</p>
        </div>
      )}
      
      {/* YouTube Video Embed with responsive aspect ratio */}
      {content.videoUrl && (
        <div className="mb-6 md:mb-8">
          <div className="relative w-full pt-[56.25%]">
            <iframe 
              src={content.videoUrl} 
              title={content.title}
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
              className="absolute inset-0 w-full h-full rounded-lg shadow-md"
            ></iframe>
          </div>
        </div>
      )}
      
      {/* Table of Contents - horizontal scrolling on mobile */}
      {content.sections && content.sections.length > 0 && (
        <div className="mb-6 md:mb-8 p-4 bg-gray-50 rounded-md">
          <h2 className="text-base md:text-lg font-medium mb-2">In this tutorial:</h2>
          <div className="overflow-x-auto pb-1">
            <ul className="flex md:flex-wrap space-x-3 md:space-x-0 md:space-y-1">
              {content.sections.map((section, index) => (
                <li key={index} className="flex-shrink-0 md:flex-shrink">
                  <a 
                    href={`#section-${index}`}
                    className="text-emerald-600 hover:text-emerald-700 hover:underline whitespace-nowrap md:whitespace-normal"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      
      {/* Sections */}
      {content.sections && content.sections.map((section, index) => (
        <section key={index} id={`section-${index}`} className="mb-8 md:mb-10 scroll-mt-20">
          <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">{section.title}</h2>
          
          {section.text && (
            <div className="mb-4">
              {section.text.split('\n\n').map((paragraph, i) => (
                <p key={i} className="mb-4 text-base">{paragraph}</p>
              ))}
            </div>
          )}
          
          {/* Section Video Embed */}
          {section.videoUrl && (
            <div className="mb-6">
              <div className="relative w-full pt-[56.25%]">
                <iframe 
                  src={section.videoUrl} 
                  title={section.title}
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                  className="absolute inset-0 w-full h-full rounded-lg shadow-md"
                ></iframe>
              </div>
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
              <div className="border p-4 rounded-md bg-gray-50 overflow-x-auto">
                <div dangerouslySetInnerHTML={{ __html: section.output }} />
              </div>
            </div>
          )}
          
          {section.note && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-3 md:p-4 rounded-r-md mb-4">
              <h4 className="font-bold text-blue-800 mb-1 text-sm md:text-base">Note</h4>
              <p className="text-blue-700 text-sm md:text-base">{section.note}</p>
            </div>
          )}
        </section>
      ))}
    </div>
  );
};

export default TutorialContent;;