import { userService } from '../../services/userService';
import { AuthValidator } from '../../utils/validators';
import { APP_CONFIG } from '../../constants';

export class UserHandler {
  constructor(user = null) {
    this.user = user;
  }

  async createUserProfile(uid, userData) {
    try {
      // Validate required fields
      const requiredFields = ['username', 'email', 'phoneNumber'];
      const validation = AuthValidator.validateRequiredFields(userData, requiredFields);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      // Validate individual fields
      const emailValidation = AuthValidator.validateEmail(userData.email);
      if (!emailValidation.isValid) {
        throw new Error(emailValidation.error);
      }

      const phoneValidation = AuthValidator.validatePhoneNumber(userData.phoneNumber);
      if (!phoneValidation.isValid) {
        throw new Error(phoneValidation.error);
      }

      // Create user profile with default values
      const profileData = {
        uid: uid,
        username: userData.username,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        password: userData.password, // In production, this should be hashed
        createdAt: new Date().toISOString(),
        wallet: {
          balance: APP_CONFIG.DEFAULT_WALLET_BALANCE
        },
        rewards: {
          points: APP_CONFIG.DEFAULT_REWARDS_POINTS
        },
        ...userData
      };

      const result = await userService.createUserProfile(uid, profileData);
      
      if (!result.success) {
        throw new Error(result.error);
      }

      return { success: true, profile: result.data };
    } catch (error) {
      console.error('Create user profile error:', error);
      return { success: false, error: error.message };
    }
  }

  async getUserProfile(uid) {
    try {
      const result = await userService.getUserProfile(uid);
      
      if (!result.success) {
        throw new Error(result.error);
      }

      return { success: true, profile: result.data };
    } catch (error) {
      console.error('Get user profile error:', error);
      return { success: false, error: error.message };
    }
  }

  async updateUserProfile(uid, updateData) {
    try {
      const result = await userService.updateUserProfile(uid, updateData);
      
      if (!result.success) {
        throw new Error(result.error);
      }

      return { success: true };
    } catch (error) {
      console.error('Update user profile error:', error);
      return { success: false, error: error.message };
    }
  }

  getWalletBalance() {
    if (!this.user?.userData?.wallet) {
      return 0;
    }
    return this.user.userData.wallet.balance || 0;
  }

  getRewardsPoints() {
    if (!this.user?.userData?.rewards) {
      return 0;
    }
    return this.user.userData.rewards.points || 0;
  }

  getDisplayName() {
    return this.user?.username || 'User';
  }

  getUserEmail() {
    return this.user?.email || '';
  }

  getUserPhone() {
    return this.user?.userData?.phoneNumber || '';
  }

  canAffordTransaction(amount) {
    const balance = this.getWalletBalance();
    return balance >= amount;
  }

  updateUser(newUser) {
    this.user = newUser;
  }

  isAuthenticated() {
    return !!this.user;
  }

  getUserSummary() {
    return {
      username: this.getDisplayName(),
      email: this.getUserEmail(),
      phone: this.getUserPhone(),
      walletBalance: this.getWalletBalance(),
      rewardsPoints: this.getRewardsPoints(),
      isAuthenticated: this.isAuthenticated()
    };
  }
}
