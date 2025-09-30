
export const getDailySummary = async (token) => {
  try {
    if (!token) {
      throw new Error('No authentication token available');
    }

    const response = await fetch("http://localhost:3001/api/todo/ai/daily-summary", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(`HTTP ${response.status}: ${errorData.error || 'Failed to fetch daily summary'}`);
    }

    const data = await response.json();
    return data.summary;
  } catch (error) {
    console.error('Error fetching daily summary:', error);
    throw error;
  }
};

export const updateTaskPriorities = async (token) => {
  try {
    if (!token) {
      throw new Error('No authentication token available');
    }

    const response = await fetch("http://localhost:3001/api/todo/ai/update-priorities", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(`HTTP ${response.status}: ${errorData.error || 'Failed to update priorities'}`);
    }

    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error('Error updating task priorities:', error);
    throw error;
  }
};