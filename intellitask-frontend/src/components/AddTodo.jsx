import { useState } from "react";

function AddTodo({ onNewItem }) {
  const [todoName, setTodoName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");

  const handleNameChange = (event) => {
    setTodoName(event.target.value);
    if (error) setError(""); // Clear error when user starts typing
  };

  const handleDateChange = (event) => {
    setDueDate(event.target.value);
  };

  const handleAddButtonClicked = () => {
    // Validate required fields
    if (!todoName.trim()) {
      setError("Task name is required!");
      return;
    }

    // Call the parent function
    onNewItem(todoName.trim(), dueDate);
    
    // Clear form
    setDueDate("");
    setTodoName("");
    setError("");
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && todoName.trim()) {
      handleAddButtonClicked();
    }
  };

  return (
    <div className="mb-8">
      {error && (
        <div className="mb-3 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Enter Todo Here *"
            value={todoName}
            onChange={handleNameChange}
            onKeyPress={handleKeyPress}
            className={`w-full px-4 py-3 rounded-lg border ${
              error 
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
            } focus:outline-none focus:ring-2`}
            required
          />
        </div>
        <div className="sm:w-1/3">
          <input
            type="date"
            value={dueDate}
            onChange={handleDateChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div>
          <button
            type="button"
            className="w-full sm:w-auto px-5 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed"
            onClick={handleAddButtonClicked}
            disabled={!todoName.trim()}
          >
            Add Task
          </button>
        </div>
      </div>
      
      <p className="text-xs text-gray-500 mt-2">
        * Task name is required. Due date is optional.
      </p>
    </div>
  );
}

export default AddTodo;