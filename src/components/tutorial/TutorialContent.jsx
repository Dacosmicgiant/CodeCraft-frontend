import { useState } from 'react';
import { Copy, CheckCircle, Play } from 'lucide-react';
import CodeExample from './CodeExample';

const TutorialContent = ({ content, lessons = [] }) => {
  const [copied, setCopied] = useState(false);
  
  if (!content && (!lessons || lessons.length === 0)) {
    return <div>Content not available</div>;
  }
  
  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Render individual content block based on type
  const renderContentBlock = (block, index) => {
    if (!block || !block.type) return null;

    switch (block.type) {
      case 'text':
        return (
          <div key={index} className="mb-6">
            <div 
              className="prose max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ 
                __html: block.data?.text?.replace(/\n/g, '<br/>') || ''
              }} 
            />
          </div>
        );

      case 'code':
        return (
          <div key={index} className="mb-6">
            <CodeExample 
              code={block.data?.code || ''} 
              language={block.data?.language || 'html'} 
              title={block.data?.caption || 'Code Example'} 
              showLineNumbers={true}
              onCopy={() => copyCode(block.data?.code || '')}
            />
          </div>
        );

      case 'image':
        return (
          <div key={index} className="mb-6">
            <div className="text-center">
              <img 
                src={block.data?.url || '/api/placeholder/600/400'} 
                alt={block.data?.alt || 'Tutorial image'} 
                className="mx-auto rounded-md max-w-full h-auto shadow-sm"
              />
              {block.data?.caption && (
                <p className="text-sm text-gray-500 mt-2 italic">{block.data.caption}</p>
              )}
            </div>
          </div>
        );

      case 'video':
        return (
          <div key={index} className="mb-6">
            <div className="relative w-full pt-[56.25%]">
              <iframe 
                src={block.data?.url} 
                title={block.data?.caption || 'Tutorial video'}
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                className="absolute inset-0 w-full h-full rounded-lg shadow-md"
              ></iframe>
            </div>
            {block.data?.caption && (
              <p className="text-center text-sm text-gray-500 mt-2">{block.data.caption}</p>
            )}
          </div>
        );

      case 'quiz':
        return (
          <div key={index} className="mb-6">
            <QuizBlock 
              question={block.data?.question}
              options={block.data?.options || []}
              correctAnswer={block.data?.correctAnswer}
            />
          </div>
        );

      default:
        return null;
    }
  };

  // If we have structured content (from backend)
  if (content && typeof content === 'object') {
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
  }

  // If we have lessons array (from backend lessons)
  if (lessons && lessons.length > 0) {
    return (
      <div className="space-y-8">
        {lessons.map((lesson, lessonIndex) => (
          <div key={lesson._id || lessonIndex} className="border-b border-gray-200 pb-8 last:border-b-0">
            <h2 className="text-xl md:text-2xl font-bold mb-4">
              {lessonIndex + 1}. {lesson.title}
            </h2>
            
            {/* Render lesson content blocks */}
            {lesson.content && lesson.content.map((block, blockIndex) => 
              renderContentBlock(block, `${lessonIndex}-${blockIndex}`)
            )}
          </div>
        ))}
      </div>
    );
  }

  // Fallback for legacy content format
  if (typeof content === 'string') {
    return (
      <div className="prose max-w-none">
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    );
  }

  return <div>No content available</div>;
};

// Quiz Block Component
const QuizBlock = ({ question, options = [], correctAnswer }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const handleAnswerSelect = (optionIndex) => {
    setSelectedAnswer(optionIndex);
    setShowResult(true);
  };

  const resetQuiz = () => {
    setSelectedAnswer(null);
    setShowResult(false);
  };

  return (
    <div className="bg-gray-50 border rounded-md p-4">
      <h4 className="font-bold text-gray-800 mb-3">Quiz: {question}</h4>
      
      <div className="space-y-2 mb-4">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerSelect(index)}
            disabled={showResult}
            className={`w-full text-left p-3 rounded border transition-colors ${
              showResult
                ? index === correctAnswer
                  ? 'bg-green-100 border-green-500 text-green-800'
                  : index === selectedAnswer
                  ? 'bg-red-100 border-red-500 text-red-800'
                  : 'bg-gray-100 border-gray-300 text-gray-600'
                : 'bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      
      {showResult && (
        <div className="flex items-center justify-between">
          <span className={`text-sm font-medium ${
            selectedAnswer === correctAnswer ? 'text-green-600' : 'text-red-600'
          }`}>
            {selectedAnswer === correctAnswer ? '✓ Correct!' : '✗ Incorrect'}
          </span>
          <button
            onClick={resetQuiz}
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default TutorialContent;