import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

export const loginUser = async (identifier, password) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Bypass backend entirely, always successfully "authenticate" on the frontend
  const mockUser = {
    id: `local_user_${Math.floor(Math.random() * 10000)}`,
    username: identifier,
    email: identifier.includes('@') ? identifier : `${identifier}@skillspring.com`,
    role: 'student'
  };
  
  const mockToken = 'mock_frontend_jwt_token_bypass_mode';

  localStorage.setItem('token', mockToken);
  localStorage.setItem('user', JSON.stringify(mockUser));
  
  return {
    message: 'Mock Login Successful',
    user: mockUser,
    token: mockToken
  };
};

export const signupUser = async (username, email, password) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const mockUser = {
    id: `local_user_${Math.floor(Math.random() * 10000)}`,
    username,
    email,
    role: 'student'
  };

  const mockToken = 'mock_frontend_jwt_token_bypass_mode';

  localStorage.setItem('token', mockToken);
  localStorage.setItem('user', JSON.stringify(mockUser));
  
  return {
    message: 'Mock Signup Successful',
    user: mockUser,
    token: mockToken
  };
};

export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getLocalUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};
