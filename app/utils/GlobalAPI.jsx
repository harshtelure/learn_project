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

// New function to fetch user data from Strapi
export const fetchUserData = async (username) => {
  try {
    const response = await fetch(`${BASE_URL}/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }

    const data = await response.json();
    
    // Find user by username
    const user = data.find(user => user.username === username);
    
    if (!user) {
      throw new Error('User not found');
    }

    return {
      success: true,
      userData: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role_type,
        college: 'Vishwakarma Institute of Technology', // You can make this dynamic if needed
        department: user.department || null,
        contactNumber: user.contact_number,
        panOrEmpId: user.pan_or_emp_id,
        isConfirmed: user.confirmed,
        isBlocked: user.blocked,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Function to fetch HODs for a specific college
export const fetchHODsByCollege = async (collegeName) => {
  try {
    const response = await fetch(`${BASE_URL}/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch HODs');
    }

    const responseData = await response.json();
    console.log('HODs API Response:', responseData);
    
    // Extract the data array from the response
    const data = Array.isArray(responseData) ? responseData : responseData.data || [];
    
    // Filter HODs by role_type (enumeration) and college name (relation)
    const hods = data.filter(user => 
      user.role_type === 'hod' && // lowercase as it's an enumeration
      user.college?.name === collegeName // access college name from relation
    );

    console.log('Filtered HODs:', hods);

    return {
      success: true,
      hods: hods.map(hod => ({
        id: hod.id,
        username: hod.username,
        email: hod.email,
        department: hod.department?.name || 'Not Assigned', // access department name from relation
        status: hod.confirmed ? 'Active' : 'Inactive',
        contactNumber: hod.contact_number,
        panOrEmpId: hod.pan_or_emp_id
      }))
    };
  } catch (error) {
    console.error('Error in fetchHODsByCollege:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Function to fetch departments for a specific college
export const fetchDepartmentsByCollege = async (collegeName) => {
  try {
    const response = await fetch(`${BASE_URL}/departments`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch departments');
    }

    const responseData = await response.json();
    console.log('Departments API Response:', responseData);
    
    // Extract the data array from the response
    const data = Array.isArray(responseData) ? responseData : responseData.data || [];
    
    // Filter departments by college name (relation)
    const departments = data.filter(dept => 
      dept.college?.name === collegeName // access college name from relation
    );

    console.log('Filtered Departments:', departments);

    return {
      success: true,
      departments: departments.map(dept => ({
        id: dept.id,
        name: dept.name,
        code: dept.code,
        hod: dept.hod?.username || 'Not Assigned', // access hod username from relation
        totalFaculty: dept.total_faculty || 0,
        totalStudents: dept.total_students || 0,
        status: dept.status || 'active'
      }))
    };
  } catch (error) {
    console.error('Error in fetchDepartmentsByCollege:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Function to fetch college details for a user
export const fetchCollegeDetails = async (username) => {
  try {
    const response = await fetch(`${BASE_URL}/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch college details');
    }

    const data = await response.json();
    console.log('College API Response:', data);
    
    // Find user by username
    const user = data.find(user => user.username === username);
    
    if (!user) {
      return {
        success: false,
        error: 'User not found'
      };
    }

    // Get college name from relation
    const collegeName = user.college?.name || 'Vishwakarma Institute of Technology';

    return {
      success: true,
      college: {
        name: collegeName
      }
    };
  } catch (error) {
    console.error('Error in fetchCollegeDetails:', error);
    return {
      success: false,
      error: error.message || 'An error occurred while fetching college details'
    };
  }
}; 