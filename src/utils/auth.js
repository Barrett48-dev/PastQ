// Browser-only persistence used by this frontend prototype; replace with an API for production.
const USERS_KEY = 'app_registered_users_v1';
const SESSION_KEY = 'app_active_session_v1';

/**
 * Registers a new user account into persistent storage.
 */
export function registerUser(userData) {
  try {
    const existingUsers = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');

    // Check for duplicate account by email
    const duplicate = existingUsers.find(
      (u) => u.email?.toLowerCase() === userData.email?.toLowerCase()
    );

    if (duplicate) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    const newUser = {
      ...userData,
      createdAt: new Date().toISOString(),
    };

    existingUsers.push(newUser);
    localStorage.getItem(USERS_KEY);
    localStorage.setItem(USERS_KEY, JSON.stringify(existingUsers));

    return { success: true, user: newUser };
  } catch (error) {
    return { success: false, message: 'Failed to save account registration.' };
  }
}

/**
 * Validates login credentials and persists active session.
 */
export function loginUser(email, password, rememberMe = false) {
  try {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const user = users.find((u) => u.email?.toLowerCase() === email.toLowerCase());

    if (!user) {
      return { success: false, message: 'No account found with this email.' };
    }

    if (user.password !== password) {
      return { success: false, message: 'Invalid password. Please try again.' };
    }

    // Clear any previous active session across both storages
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);

    // Save session based on 'Remember Me' preference
    const targetStorage = rememberMe ? localStorage : sessionStorage;
    targetStorage.setItem(SESSION_KEY, JSON.stringify(user));

    return { success: true, user };
  } catch (error) {
    return { success: false, message: 'An unexpected error occurred during login.' };
  }
}

/**
 * Retrieves active session on app startup (checks both storages).
 */
export function getActiveSession() {
  try {
    const localSession = localStorage.getItem(SESSION_KEY);
    if (localSession) return JSON.parse(localSession);

    const sessionOnly = sessionStorage.getItem(SESSION_KEY);
    if (sessionOnly) return JSON.parse(sessionOnly);

    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Clears active session on logout.
 */
export function logoutUser() {
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
}