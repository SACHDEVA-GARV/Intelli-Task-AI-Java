import { useEffect, useState } from "react";
import AppName from "./components/AppName";
import AddTodo from "./components/AddTodo";
import TodoItems from "./components/TodoItems";
import WelcomeMessage from "./components/WelcomeMessage";
import DailySummary from "./components/DailySummary";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { AuthProvider, useAuth } from "./context/AuthContext";
import {
  addItemToServer,
  deleteItemFromServer,
  getItemsFromServer,
  markItemCompletedOnServer,
} from "./services/itemsService";
import { updateTaskPriorities } from "./services/aiService";
import "./App.css";

function AuthFlow() {
  const [showSignup, setShowSignup] = useState(false);

  if (showSignup) {
    return <Signup onLoginClick={() => setShowSignup(false)} />;
  }
  return <Login onSignupClick={() => setShowSignup(true)} />;
}

function TodoApp() {
  const [todoItems, setTodoItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [priorityLoading, setPriorityLoading] = useState(false);
  const [priorityMessage, setPriorityMessage] = useState("");
  const { user, token, logout } = useAuth();

  const fetchItems = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('Fetching items with token:', token ? 'Token exists' : 'No token');
      
      const initialItems = await getItemsFromServer(token);
      console.log('Fetched items:', initialItems);
      
      setTodoItems(initialItems || []);
    } catch (err) {
      console.error("Error loading items:", err);
      
      // If it's an auth error, logout the user
      if (err.message.includes('401') || err.message.includes('Unauthorized')) {
        console.log('Authentication error, logging out...');
        logout();
      } else {
        setError("Failed to load tasks. Please try refreshing the page.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [token, logout]);

  const handleNewItem = async (itemName, itemDueDate) => {
    if (!token) {
      setError("Please log in to add tasks.");
      return;
    }

    try {
      setError(null);
      console.log("Adding new item:", { itemName, itemDueDate });
      
      const newItem = await addItemToServer(itemName, itemDueDate, token);
      console.log("New item created:", newItem);
      
      setTodoItems((prevItems) => [...prevItems, newItem]);
    } catch (err) {
      console.error("Error adding new item:", err);
      
      if (err.message.includes('401') || err.message.includes('Unauthorized')) {
        logout();
      } else {
        setError("Failed to add task. Please try again.");
      }
    }
  };

  const handleDeleteItem = async (id) => {
    if (!token) {
      setError("Please log in to delete tasks.");
      return;
    }

    if (!id) {
      setError("Invalid task ID.");
      return;
    }

    try {
      setError(null);
      console.log("Deleting item with ID:", id);
      
      await deleteItemFromServer(id, token);
      setTodoItems(todoItems.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Error deleting item:", err);
      
      if (err.message.includes('401') || err.message.includes('Unauthorized')) {
        logout();
      } else {
        setError("Failed to delete task. Please try again.");
      }
    }
  };

  const handleToggleComplete = async (id) => {
    if (!token) {
      setError("Please log in to update tasks.");
      return;
    }

    if (!id) {
      setError("Invalid task ID.");
      return;
    }

    try {
      setError(null);
      const item = todoItems.find((item) => item.id === id);
      if (!item) {
        setError("Task not found.");
        return;
      }

      console.log("Toggling completion for item:", id, "Current state:", item.completed);
      
      const updatedItem = await markItemCompletedOnServer(id, token, !item.completed);
      console.log("Updated item:", updatedItem);
      
      setTodoItems(
        todoItems.map((item) => (item.id === id ? updatedItem : item))
      );
    } catch (err) {
      console.error("Error updating item:", err);
      
      if (err.message.includes('401') || err.message.includes('Unauthorized')) {
        logout();
      } else {
        setError("Failed to update task. Please try again.");
      }
    }
  };

  const handleUpdatePriorities = async () => {
    if (!token) {
      setError("Please log in to update priorities.");
      return;
    }

    try {
      setPriorityLoading(true);
      setError(null);
      setPriorityMessage("");
      
      const result = await updateTaskPriorities(token);
      
      // Show success message
      setPriorityMessage(result || "Priorities updated successfully!");
      
      // Refresh the tasks to get updated priorities
      await fetchItems();
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setPriorityMessage("");
      }, 3000);
      
    } catch (err) {
      console.error("Error updating priorities:", err);
      
      if (err.message.includes('401') || err.message.includes('Unauthorized')) {
        logout();
      } else {
        setError("Failed to update task priorities. Please try again.");
      }
    } finally {
      setPriorityLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  const sortedItems = [...todoItems].sort((a, b) => {
    // Sort by completion status first, then by AI priority, then by creation date
    if (a.completed !== b.completed) {
      return a.completed - b.completed;
    }
    if ((a.aiPriority || 0) !== (b.aiPriority || 0)) {
      return (b.aiPriority || 0) - (a.aiPriority || 0);
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <AppName />
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  Welcome, {user?.firstName || 'User'}!
                </span>
                <button
                  onClick={handleUpdatePriorities}
                  disabled={priorityLoading}
                  className="bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center gap-2"
                >
                  {priorityLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      🤖 Update Priorities
                    </>
                  )}
                </button>
                <button
                  onClick={logout}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                >
                  Logout
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
                <button
                  onClick={() => setError(null)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            )}

            {priorityMessage && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                {priorityMessage}
              </div>
            )}

            <AddTodo onNewItem={handleNewItem} />
            
            {/* Daily Summary - Pass todoItems as props */}
            <DailySummary todoItems={todoItems} />
            
            {todoItems.length === 0 ? (
              <WelcomeMessage />
            ) : (
              <TodoItems
                todoItems={sortedItems}
                onDeleteClick={handleDeleteItem}
                onToggleComplete={handleToggleComplete}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const { token } = useAuth();
  return token ? <TodoApp /> : <AuthFlow />;
}

export default function AppWrapper() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}