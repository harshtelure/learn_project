const BASE_URL = 'http://localhost:1337/api';

export const loginUser = async (username, email, password) => {
  try {
    const response = await fetch(`${BASE_URL}/logins`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch login data');
    }

    const data = await response.json();
    
    // Find matching user
    const user = data.data.find(
      (user) => 
        user.Username === username && 
        user.UserEmail === email && 
        user.Password === password
    );

    if (!user) {
      throw new Error('Invalid credentials');
    }

    return {
      success: true,
      role: user.Role,
      userData: user
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}; 