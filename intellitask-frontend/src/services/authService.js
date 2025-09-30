// authService.js
export const loginUser = async (email, password) => {
  try {
    const response = await fetch("http://localhost:3001/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: true, message: data.error || data.message || "Login failed" };
    }

    // Store token in localStorage for persistence
    if (data.token) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }

    return data;
  } catch (error) {
    console.error("Login error:", error);
    return { error: true, message: "Network error. Please try again." };
  }
};

export const signupUser = async (firstName, email, password) => {
  try {
    const response = await fetch("http://localhost:3001/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ firstName, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: true, message: data.error || data.message || "Signup failed" };
    }

    // Store token in localStorage for persistence
    if (data.token) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }

    return data;
  } catch (error) {
    console.error("Signup error:", error);
    return { error: true, message: "Network error. Please try again." };
  }
};

export const logoutUser = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  const token = localStorage.getItem('authToken');
  const user = localStorage.getItem('user');
  
  if (token && user) {
    try {
      return {
        token,
        user: JSON.parse(user)
      };
    } catch (error) {
      console.error('Error parsing stored user:', error);
      logoutUser();
    }
  }
  
  return null;
};