import { useState, useEffect } from 'react';
import { PencilLine, Save, Trash2, Check } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const NotesComponent = ({ tutorialId, sectionId }) => {
  const { user, isAuthenticated } = useAuth();
  const [notes, setNotes] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // 'success', 'error', null
  
  // Generate a unique storage key based on tutorial and section
  const storageKey = `notes_${tutorialId}_${sectionId || 'main'}_${user?.id || 'guest'}`;
  
  // Load saved notes from localStorage
  useEffect(() => {
    const savedNotes = localStorage.getItem(storageKey);
    if (savedNotes) {
      setNotes(savedNotes);
    }
  }, [storageKey]);
  
  const handleSaveNotes = () => {
    setIsSaving(true);
    
    try {
      // In a real app, you would send this to your API
      localStorage.setItem(storageKey, notes);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving notes:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleClearNotes = () => {
    if (window.confirm('Are you sure you want to clear your notes?')) {
      setNotes('');
      localStorage.removeItem(storageKey);
    }
  };
  
  const renderSaveStatus = () => {
    if (saveStatus === 'success') {
      return (
        <div className="flex items-center text-green-600 text-sm">
          <Check size={16} className="mr-1" />
          Notes saved
        </div>
      );
    } else if (saveStatus === 'error') {
      return (
        <div className="text-red-600 text-sm">
          Error saving notes
        </div>
      );
    }
    return null;
  };
  
  // If the user is not logged in, show a simplified version
  if (!isAuthenticated) {
    return (
      <div className="bg-gray-50 border rounded-md p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-gray-800 flex items-center">
            <PencilLine size={18} className="mr-2 text-gray-500" />
            My Notes
          </h3>
        </div>
        <p className="text-gray-600 text-sm">
          <a href="/login" className="text-emerald-600 hover:underline">Sign in</a> to take notes while watching the tutorial
        </p>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 border rounded-md p-4 mb-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-gray-800 flex items-center">
          <PencilLine size={18} className="mr-2 text-gray-500" />
          My Notes
        </h3>
        <div className="flex items-center gap-2">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200"
            >
              Edit Notes
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveNotes}
                disabled={isSaving}
                className="text-xs px-2 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-700 flex items-center"
              >
                <Save size={12} className="mr-1" />
                {isSaving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={handleClearNotes}
                className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 flex items-center"
              >
                <Trash2 size={12} className="mr-1" />
                Clear
              </button>
            </div>
          )}
        </div>
      </div>
      
      {isEditing ? (
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Take notes while watching the tutorial..."
          className="w-full min-h-[100px] p-2 border rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
      ) : (
        <div className="min-h-[50px] text-gray-700">
          {notes ? (
            <div className="whitespace-pre-wrap">{notes}</div>
          ) : (
            <p className="text-gray-500 italic">No notes yet. Click 'Edit Notes' to add some.</p>
          )}
        </div>
      )}
      
      <div className="mt-2 h-5">
        {renderSaveStatus()}
      </div>
    </div>
  );
};

export default NotesComponent;