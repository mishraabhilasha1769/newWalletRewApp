import { userService } from './userService.js';

export const authService = {
  // Login user by checking Firestore directly with email or username
  login: async (identifier, password) => {
    try {
      console.log('🔐 Attempting local login for:', identifier);
      
      // Check if identifier is an email or username
      const isEmail = identifier.includes('@');
      let userResult;

      if (isEmail) {
        // Try to find user by email
        userResult = await userService.getUserByEmail(identifier);
      } else {
        // Try to find user by username
        userResult = await userService.getUserByUsername(identifier);
      }
      
      if (!userResult.success) {
        console.log('❌ User not found');
        return { success: false, error: 'Invalid credentials' };
      }

      const user = userResult.data;
      
      // Check password (in production, use proper password hashing!)
      if (user.password !== password) {
        console.log('❌ Invalid credentials');
        return { success: false, error: 'Invalid creds' };
      }

      console.log('✅ Login successful for user:', user.username);
      return { success: true, user: { uid: user.uid, email: user.email, username: user.username, userData: user } };
      
    } catch (error) {
      console.log('❌ Login error:', error);
      return { success: false, error: 'An error occurred during login' };
    }
  },

  // Simple current user simulation
  getCurrentUser: () => {
    return null; // In production, implement proper session management
  },

  // Logout
  logout: async () => {
    return { success: true };
  },

  // Check authentication status
  isAuthenticated: () => {
    return false; // In production, implement proper session checking
  }
};
