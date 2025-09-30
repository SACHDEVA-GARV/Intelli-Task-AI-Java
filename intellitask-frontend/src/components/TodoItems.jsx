import TodoItem from "./TodoItem";

const TodoItems = ({ todoItems, onDeleteClick, onToggleComplete }) => {
  // Ensure todoItems is always an array
  const items = Array.isArray(todoItems) ? todoItems : [];
  
  // Group items by completion status
  const pendingItems = items.filter((item) => item && !item.completed);
  const completedItems = items.filter((item) => item && item.completed);

  // Sort pending items by AI priority (highest first), then by creation date
  const sortedPendingItems = pendingItems.sort((a, b) => {
    // First sort by AI priority (descending - highest priority first)
    if ((a.aiPriority || 0) !== (b.aiPriority || 0)) {
      return (b.aiPriority || 0) - (a.aiPriority || 0);
    }
    // Then by creation date (newest first)
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  // Sort completed items by completion date (most recently completed first)
  const sortedCompletedItems = completedItems.sort((a, b) => {
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });

  return (
    <div>
      {sortedPendingItems.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
            📋 Tasks to Do ({sortedPendingItems.length})
          </h2>
          <div className="space-y-3">
            {sortedPendingItems.map((item) => (
              <TodoItem
                key={item.id || item._id}
                id={item.id || item._id}
                todoDate={item.dueDate}
                todoName={item.name}
                completed={item.completed}
                aiPriority={item.aiPriority}
                onDeleteClick={onDeleteClick}
                onToggleComplete={onToggleComplete}
              />
            ))}
          </div>
        </div>
      )}

      {sortedCompletedItems.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h2 className="text-lg font-semibold text-gray-500 mb-3 flex items-center gap-2">
            ✅ Completed Tasks ({sortedCompletedItems.length})
          </h2>
          <div className="space-y-3">
            {sortedCompletedItems.map((item) => (
              <TodoItem
                key={item.id || item._id}
                id={item.id || item._id}
                todoDate={item.dueDate}
                todoName={item.name}
                completed={item.completed}
                aiPriority={item.aiPriority}
                onDeleteClick={onDeleteClick}
                onToggleComplete={onToggleComplete}
              />
            ))}
          </div>
        </div>
      )}

      {items.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No tasks yet. Add your first task above!</p>
        </div>
      )}
    </div>
  );
};

export default TodoItems;