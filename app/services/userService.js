import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase.js';

export const userService = {
  // Create user profile in Firestore
  createUserProfile: async (uid, userData) => {
    try {
      console.log('📝 Creating user profile for UID:', uid);
      console.log('📊 User data to save:', userData);
      
      const defaultUserData = {
        uid: uid,
        username: userData.username,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        createdAt: new Date().toISOString(),

        // ✅ Wallet
        wallet: {
          balance: 100
        },

        // ✅ Rewards
        rewards: {
          points: 10
        },

        ...userData
      };

      console.log('📄 Complete user profile data:', defaultUserData);
      console.log('🔥 Attempting to save to Firestore collection: users, document:', uid);
      
      await setDoc(doc(db, 'users', uid), defaultUserData);
      
      console.log('✅ Successfully saved user profile to Firestore');
      return { success: true, data: defaultUserData };
    } catch (error) {
      console.log('❌ Error saving user profile to Firestore:', error);
      console.log('❌ Error details:', error.code, error.message);
      return { success: false, error: error.message };
    }
  },

  // Get user profile by UID
  getUserProfile: async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      
      if (userDoc.exists()) {
        return { success: true, data: userDoc.data() };
      } else {
        return { success: false, error: 'User profile not found' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Update user profile
  updateUserProfile: async (uid, updateData) => {
    try {
      await updateDoc(doc(db, 'users', uid), updateData);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Update user rewards
  updateRewards: async (uid, rewardsData) => {
    try {
      await updateDoc(doc(db, 'users', uid), {
        rewards: rewardsData
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Add points to user account
  addPoints: async (uid, points) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      
      if (userDoc.exists()) {
        const currentData = userDoc.data();
        const newPoints = currentData.rewards.points + points;
        
        await updateDoc(doc(db, 'users', uid), {
          'rewards.points': newPoints
        });
        
        return { success: true, newPoints };
      } else {
        return { success: false, error: 'User profile not found' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  
  // Check if email already exists
  checkEmailExists: async (email) => {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      return { 
        exists: !querySnapshot.empty,
        user: querySnapshot.empty ? null : querySnapshot.docs[0].data()
      };
    } catch (error) {
      return { exists: false, error: error.message };
    }
  },

  // Check if phone number already exists
  checkPhoneExists: async (phoneNumber) => {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('phoneNumber', '==', phoneNumber));
      const querySnapshot = await getDocs(q);
      
      return { 
        exists: !querySnapshot.empty,
        user: querySnapshot.empty ? null : querySnapshot.docs[0].data()
      };
    } catch (error) {
      return { exists: false, error: error.message };
    }
  },

  // Get user by email for local authentication
  getUserByEmail: async (email) => {
    try {
      console.log('🔍 Looking up user by email:', email);
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        console.log('✅ User found:', querySnapshot.docs[0].data().username);
        return { 
          success: true, 
          data: querySnapshot.docs[0].data()
        };
      } else {
        console.log('❌ User not found');
        return { success: false, error: 'User not found' };
      }
    } catch (error) {
      console.log('❌ Error finding user by email:', error);
      return { success: false, error: error.message };
    }
  },

  // Get user by username for local authentication
  getUserByUsername: async (username) => {
    try {
      console.log('🔍 Looking up user by username:', username);
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '==', username));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        console.log('✅ User found:', querySnapshot.docs[0].data().email);
        return { 
          success: true, 
          data: querySnapshot.docs[0].data()
        };
      } else {
        console.log('❌ User not found');
        return { success: false, error: 'User not found' };
      }
    } catch (error) {
      console.log('❌ Error finding user by username:', error);
      return { success: false, error: error.message };
    }
  }
};
