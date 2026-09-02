// src/utils/auth.js
// Browser-storage authentication adapter for the prototype account and current-user contracts.
// Modify storage keys and schema here when auth changes; production code should replace this module with an API client.

const USERS_KEY = 'pastq_users';
const CURRENT_USER_KEY = 'pastq_current_user';

// Get all registered users from local storage
export const getUsers = () => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

// Register a new user
export const registerUser = (userData) => {
  const users = getUsers();

  // Check if email already exists
  const existingUser = users.find(
    (u) => u.email.toLowerCase() === userData.email.toLowerCase()
  );

  if (existingUser) {
    return { success: false, message: 'An account with this email already exists.' };
  }

  const newUser = {
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    ...userData,
  };

  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  
  // Automatically log in the user after registration
  setCurrentUser(newUser);

  return { success: true, user: newUser };
};

// Log in an existing user
export const loginUser = (email, password) => {
  const users = getUsers();
  const user = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!user) {
    return { success: false, message: 'Invalid email or password.' };
  }

  setCurrentUser(user);
  return { success: true, user };
};

// Set active user session
export const setCurrentUser = (user) => {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
};

// Get active user session
export const getCurrentUser = () => {
  const user = localStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
};

// Log out user
export const logoutUser = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};