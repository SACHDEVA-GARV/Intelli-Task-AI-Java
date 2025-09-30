export const addItemToServer = async (task, date, token) => {
  try {
    if (!token) {
      throw new Error('No authentication token available');
    }

    const response = await fetch("http://localhost:3001/api/todo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ task, date }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(`HTTP ${response.status}: ${errorData.error || 'Failed to add item'}`);
    }

    const item = await response.json();
    return mapServerItemToLocalItem(item);
  } catch (error) {
    console.error('Error adding item to server:', error);
    throw error;
  }
};

export const getItemsFromServer = async (token) => {
  try {
    if (!token) {
      throw new Error('No authentication token available');
    }

    const response = await fetch("http://localhost:3001/api/todo", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(`HTTP ${response.status}: ${errorData.error || 'Failed to fetch items'}`);
    }

    const data = await response.json();
    
    // Check if data is an array, if not return empty array
    if (!Array.isArray(data)) {
      console.error('Expected array but got:', data);
      return [];
    }

    return data.map(mapServerItemToLocalItem);
  } catch (error) {
    console.error('Error fetching items from server:', error);
    return []; // Return empty array on error to prevent app crash
  }
};

export const markItemCompletedOnServer = async (id, token, completed) => {
  try {
    if (!token) {
      throw new Error('No authentication token available');
    }

    if (!id) {
      throw new Error('Item ID is required');
    }

    const response = await fetch(
      `http://localhost:3001/api/todo/${id}/completed`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ completed }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(`HTTP ${response.status}: ${errorData.error || 'Failed to update item'}`);
    }

    const item = await response.json();
    return mapServerItemToLocalItem(item);
  } catch (error) {
    console.error('Error updating item completion:', error);
    throw error;
  }
};

export const deleteItemFromServer = async (id, token) => {
  try {
    if (!token) {
      throw new Error('No authentication token available');
    }

    if (!id) {
      throw new Error('Item ID is required');
    }

    const response = await fetch(`http://localhost:3001/api/todo/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(`HTTP ${response.status}: ${errorData.error || 'Failed to delete item'}`);
    }

    return id;
  } catch (error) {
    console.error('Error deleting item from server:', error);
    throw error;
  }
};

const mapServerItemToLocalItem = (serverItem) => {
  if (!serverItem) {
    throw new Error('Server item is null or undefined');
  }

  return {
    id: serverItem._id,
    name: serverItem.task,
    dueDate: serverItem.date,
    completed: serverItem.completed || false,
    createdAt: serverItem.createdAt,
    updatedAt: serverItem.updatedAt,
    aiPriority: serverItem.aiPriority ?? 0,
  };
};