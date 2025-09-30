import { useState } from 'react';
import { getDailySummary } from '../services/aiService';
import { useAuth } from '../context/AuthContext';

function DailySummary({ todoItems = [] }) {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasGenerated, setHasGenerated] = useState(false);
  const { token } = useAuth();

  // Calculate pending tasks
  const pendingTasks = todoItems.filter(task => !task.completed);
  const completedTasks = todoItems.filter(task => task.completed);
  const hasPendingTasks = pendingTasks.length > 0;

  const handleGenerateSummary = async () => {
    if (!token) {
      setError('Please log in to generate summary');
      return;
    }

    // If no pending tasks, don't call AI API
    if (!hasPendingTasks) {
      setSummary("All your tasks are completed! Great job staying productive.");
      setHasGenerated(true);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const summaryText = await getDailySummary(token);
      setSummary(summaryText);
      setHasGenerated(true);
    } catch (err) {
      console.error('Error fetching daily summary:', err);
      setError('Failed to generate daily summary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshSummary = () => {
    setSummary('');
    setHasGenerated(false);
    setError(null);
    handleGenerateSummary();
  };

  // If no tasks at all, don't show the summary component
  if (todoItems.length === 0) {
    return null;
  }

  // If all tasks are completed and no summary generated yet
  if (!hasPendingTasks && completedTasks.length > 0 && !hasGenerated) {
    return (
      <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
        <div className="flex items-center justify-between">
          <div className="flex items-start">
            <div className="flex-shrink-0 mr-3">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                🎉 All Tasks Completed!
              </h3>
              <p className="text-green-700 leading-relaxed">
                Congratulations! You've completed all your tasks for today. 
                {completedTasks.length === 1 
                  ? " You finished 1 task." 
                  : ` You finished ${completedTasks.length} tasks.`}
              </p>
            </div>
          </div>
          <button
            onClick={handleGenerateSummary}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-2 px-4 rounded-lg transition duration-300 flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Generating...
              </>
            ) : (
              <>
                🌟 Generate Summary
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // If summary has been generated, show it
  if (hasGenerated && summary) {
    return (
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <div className="flex items-start justify-between">
          <div className="flex items-start flex-1">
            <div className="flex-shrink-0 mr-3">
              <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-indigo-800 mb-2">
                🌟 Your AI Daily Summary
              </h3>
              <p className="text-indigo-700 leading-relaxed">
                {summary}
              </p>
            </div>
          </div>
          <button
            onClick={handleRefreshSummary}
            disabled={loading}
            className="ml-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium py-2 px-4 rounded-lg transition duration-300 flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Refreshing...
              </>
            ) : (
              <>
                🔄 Refresh
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-red-700">{error}</span>
          </div>
          <button
            onClick={handleGenerateSummary}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600 mr-3"></div>
          <span className="text-indigo-600 font-medium">Generating your daily summary...</span>
        </div>
      </div>
    );
  }

  // Default state - show generate button
  return (
    <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex-shrink-0 mr-3">
            <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              Daily Summary
            </h3>
            <p className="text-gray-600 text-sm">
              Get an AI-powered summary of your tasks and priorities
            </p>
          </div>
        </div>
        <button
          onClick={handleGenerateSummary}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium py-2 px-4 rounded-lg transition duration-300 flex items-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Generating...
            </>
          ) : (
            <>
              🌟 Generate Summary
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default DailySummary;