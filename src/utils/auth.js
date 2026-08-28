// Registration stores prototype accounts locally; production authentication must move this boundary server-side.
export function registerUser(userData) {
  try {
    // Read the complete account collection because localStorage has no query/update primitive.
    const existingUsers = JSON.parse(localStorage.getItem('pastq_registered_users') || '[]');
    
    // Email is the unique login key, compared case-insensitively for predictable identity matching.
    const userExists = existingUsers.some(user => user.email.toLowerCase() === userData.email.toLowerCase());
    if (userExists) {
      return { success: false, message: 'An account with this email address already exists.' };
    }

    // Copy onboarding fields and attach the dashboard's initial resume card in one profile object.
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      lastStudied: {
        title: userData.selectedSubjects[0] || 'Mathematics',
        paper: '2021 – Paper 2',
        progress: 0,
        id: 'math-2021-p2'
      }
    };

    // Persist only after validation succeeds, then return the same profile to the caller for session state.
    existingUsers.push(newUser);
    localStorage.setItem('pastq_registered_users', JSON.stringify(existingUsers));
    
    return { success: true, user: newUser };
  } catch (err) {
    return { success: false, message: 'Failed to save registration data.' };
  }
}

// Login searches the locally stored accounts and returns a uniform success/failure result for the UI.
export function loginUser(email, password) {
  // The prototype compares the plaintext password directly; this is intentionally documented as non-production.
  const existingUsers = JSON.parse(localStorage.getItem('pastq_registered_users') || '[]');
  const user = existingUsers.find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!user) {
    return { success: false, message: 'Invalid email or password.' };
  }

  return { success: true, user };
}