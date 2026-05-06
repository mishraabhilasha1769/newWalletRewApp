import { userService } from './userService.js';

export const signupService = {
  // Complete signup process: save directly to Firestore without Firebase Auth
  signup: async (email, password, userData) => {
    try {
      console.log('🚀 Starting local signup process for email:', email);
      
      // Step 1: Check if email already exists in database
      console.log('📧 Checking if email exists...');
      const emailCheck = await userService.checkEmailExists(email);
      if (emailCheck.exists) {
        console.log('❌ Email already exists');
        return { 
          success: false, 
          error: 'Email already exists. Please login with your existing account.',
          type: 'email_exists'
        };
      }

      // Step 2: Check if phone number already exists in database
      console.log('📱 Checking if phone exists...');
      const phoneCheck = await userService.checkPhoneExists(userData.phoneNumber);
      if (phoneCheck.exists) {
        console.log('❌ Phone number already exists');
        return { 
          success: false, 
          error: 'Phone number already exists. Please use a different phone number.',
          type: 'phone_exists'
        };
      }

      // Step 3: Generate unique ID
      const userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      console.log('🆔 Generated user ID:', userId);

      // Step 4: Create user profile in Firestore with password
      console.log('💾 Saving user profile to Firestore...');
      const profileResult = await userService.createUserProfile(userId, {
        ...userData,
        email: email, // Add email to userData
        password: password // Store password (in production, hash this!)
      });
      
      if (profileResult.success) {
        console.log('✅ User profile saved successfully:', profileResult.data);
        return { 
          success: true, 
          user: { uid: userId, email: email }, 
          profile: profileResult.data 
        };
      } else {
        console.log('❌ Failed to save user profile:', profileResult.error);
        return { 
          success: false, 
          error: 'Failed to save profile: ' + profileResult.error 
        };
      }
    } catch (error) {
      console.log('❌ Signup error:', error);
      return { success: false, error: 'An error occurred during signup' };
    }
  },

  // Validate signup data
  validateSignupData: (userData) => {
    const errors = [];

    // Username validation
    if (!userData.username || userData.username.length < 3) {
      errors.push('Username must be at least 3 characters');
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!userData.email || !emailRegex.test(userData.email)) {
      errors.push('Please enter a valid email address');
    }

    // Password validation
    if (!userData.password || userData.password.length < 6) {
      errors.push('Password must be at least 6 characters');
    }

    // Phone number validation
    const phoneRegex = /^\d{10}$/;
    if (!userData.phoneNumber || !phoneRegex.test(userData.phoneNumber.replace(/[^0-9]/g, ''))) {
      errors.push('Please enter a valid 10-digit phone number');
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }
};
