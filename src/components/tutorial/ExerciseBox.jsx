import { useState } from 'react';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import CodeEditor from '../common/CodeEditor';

const ExerciseBox = ({ 
  title, 
  description, 
  initialCode = '', 
  expectedOutput = '',
  hints = [],
  language = 'html'
}) => {
  const [code, setCode] = useState(initialCode);
  const [showHints, setShowHints] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [feedback, setFeedback] = useState('');
  
  const handleCodeChange = (newCode) => {
    setCode(newCode);
    if (submitted) {
      setSubmitted(false);
    }
  };
  
  const checkSolution = () => {
    // This is a simple implementation. In a real application,
    // you would send the code to a backend for validation.
    setSubmitted(true);
    
    const cleanCode = code.trim().replace(/\s+/g, ' ');
    const cleanExpected = expectedOutput.trim().replace(/\s+/g, ' ');
    
    if (cleanCode.includes(cleanExpected)) {
      setIsCorrect(true);
      setFeedback('Great job! Your solution is correct.');
    } else {
      setIsCorrect(false);
      setFeedback('Your solution is not correct yet. Keep trying!');
    }
  };
  
  const resetExercise = () => {
    setCode(initialCode);
    setSubmitted(false);
    setIsCorrect(false);
    setFeedback('');
  };
  
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b">
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
      
      <div className="p-6">
        <CodeEditor
          initialCode={code}
          language={language}
          onCodeChange={handleCodeChange}
          showPreview={true}
        />
        
        <div className="mt-6 flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
          <button
            onClick={() => setShowHints(!showHints)}
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
          >
            {showHints ? 'Hide Hints' : 'Show Hints'}
          </button>
          
          <div className="flex space-x-3">
            <button
              onClick={resetExercise}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm bg-white text-gray-700 hover:bg-gray-50"
            >
              <RefreshCw size={16} className="inline mr-1" />
              Reset
            </button>
            
            <button
              onClick={checkSolution}
              className="px-4 py-2 bg-emerald-600 text-white rounded-md text-sm hover:bg-emerald-700"
            >
              Check Solution
            </button>
          </div>
        </div>
        
        {showHints && hints.length > 0 && (
          <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-md">
            <h4 className="font-bold text-blue-800 mb-2">Hints:</h4>
            <ul className="list-disc pl-5 space-y-1 text-blue-700">
              {hints.map((hint, index) => (
                <li key={index}>{hint}</li>
              ))}
            </ul>
          </div>
        )}
        
        {submitted && (
          <div className={`mt-6 p-4 rounded-md ${
            isCorrect ? 'bg-green-50 border-l-4 border-green-500' : 'bg-red-50 border-l-4 border-red-500'
          }`}>
            <div className="flex items-start">
              {isCorrect ? (
                <CheckCircle className="text-green-500 mr-3 mt-0.5" size={20} />
              ) : (
                <XCircle className="text-red-500 mr-3 mt-0.5" size={20} />
              )}
              <div>
                <h4 className={`font-bold ${isCorrect ? 'text-green-800' : 'text-red-800'} mb-1`}>
                  {isCorrect ? 'Correct!' : 'Not quite right'}
                </h4>
                <p className={isCorrect ? 'text-green-700' : 'text-red-700'}>
                  {feedback}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseBox;