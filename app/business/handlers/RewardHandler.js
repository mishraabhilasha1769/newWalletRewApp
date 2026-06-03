import { REWARDS_CONFIG, SUCCESS_MESSAGES } from '../../constants';
import { userService } from '../../services/userService';
import { CurrencyFormatter } from '../../utils';

export class RewardHandler {
  constructor(user, dispatch = null) {
    this.user = user;
    this.dispatch = dispatch;
  }

  calculateRewardPoints(transactionAmount) {
    if (Math.abs(transactionAmount) < REWARDS_CONFIG.MIN_TRANSACTION_AMOUNT) {
      return { eligible: false, points: 0 };
    }

    const rewardPoints = Math.floor((Math.abs(transactionAmount) * REWARDS_CONFIG.REWARD_PERCENTAGE) / 100);
    return { eligible: true, points: rewardPoints };
  }

  async updateUserRewards(additionalPoints) {
    try {
      if (!this.user?.uid) {
        throw new Error('User not authenticated');
      }

      // Get current user profile to get existing rewards
      const profileResult = await userService.getUserProfile(this.user.uid);
      if (!profileResult.success) {
        throw new Error('Failed to fetch user profile');
      }

      const currentPoints = profileResult.data?.rewards?.points || 0;
      const newTotalPoints = currentPoints + additionalPoints;

      // Update user rewards in database
      const updateResult = await userService.updateUserProfile(this.user.uid, {
        'rewards.points': newTotalPoints
      });

      if (!updateResult.success) {
        throw new Error('Failed to update rewards');
      }

      // Update Redux state if dispatch is available
      if (this.dispatch) {
        this.dispatch({
          type: 'auth/updateUser',
          payload: {
            userData: {
              ...this.user.userData,
              rewards: {
                ...this.user.userData.rewards,
                points: newTotalPoints
              }
            }
          }
        });
      }

      return {
        success: true,
        previousPoints: currentPoints,
        addedPoints: additionalPoints,
        newTotalPoints: newTotalPoints
      };
    } catch (error) {
      console.error('Update rewards error:', error);
      return { success: false, error: error.message };
    }
  }

  async processTransactionReward(transaction) {
    try {
      console.log('RewardHandler: Processing transaction reward for amount:', transaction.amount);
      
      const rewardCalculation = this.calculateRewardPoints(transaction.amount);
      console.log('RewardHandler: Reward calculation:', JSON.stringify(rewardCalculation, null, 2));
      
      if (!rewardCalculation.eligible) {
        console.log('RewardHandler: Transaction not eligible for rewards');
        return { 
          eligible: false, 
          reason: `Transaction amount must be at least ₹${REWARDS_CONFIG.MIN_TRANSACTION_AMOUNT} to earn rewards` 
        };
      }

      const updateResult = await this.updateUserRewards(rewardCalculation.points);
      
      if (!updateResult.success) {
        throw new Error(updateResult.error);
      }

      const finalReward = {
        eligible: true,
        reward: {
          transactionAmount: transaction.amount,
          pointsEarned: rewardCalculation.points,
          previousPoints: updateResult.previousPoints,
          newTotalPoints: updateResult.newTotalPoints,
          rewardPercentage: REWARDS_CONFIG.REWARD_PERCENTAGE
        }
      };
      
      console.log('RewardHandler: Final reward result:', JSON.stringify(finalReward, null, 2));
      return finalReward;
    } catch (error) {
      console.error('Process transaction reward error:', error);
      return { success: false, error: error.message };
    }
  }

  getRewardMessage(rewardData) {
    const { transactionAmount, pointsEarned, newTotalPoints } = rewardData;
    
    return {
      title: SUCCESS_MESSAGES.REWARD_EARNED,
      message: `You earned ${pointsEarned} points.`,
      subMessage: `Your total rewards points: ${newTotalPoints}`,
      formattedAmount: CurrencyFormatter.formatToINRWithoutSymbol(transactionAmount),
      pointsEarned: pointsEarned
    };
  }

  getCurrentRewardsPoints() {
    if (!this.user?.userData?.rewards) {
      return 0;
    }
    return this.user.userData.rewards.points || 0;
  }

  getRewardProgress() {
    const currentPoints = this.getCurrentRewardsPoints();
    
    // Define reward tiers (can be expanded later)
    const tiers = [
      { name: 'Bronze', minPoints: 0, maxPoints: 99 },
      { name: 'Silver', minPoints: 100, maxPoints: 499 },
      { name: 'Gold', minPoints: 500, maxPoints: 999 },
      { name: 'Platinum', minPoints: 1000, maxPoints: Infinity }
    ];

    const currentTier = tiers.find(tier => 
      currentPoints >= tier.minPoints && currentPoints <= tier.maxPoints
    ) || tiers[0];

    const nextTier = tiers.find(tier => tier.minPoints > currentPoints);
    const pointsToNextTier = nextTier ? nextTier.minPoints - currentPoints : 0;

    return {
      currentPoints,
      currentTier: currentTier.name,
      nextTier: nextTier?.name || null,
      pointsToNextTier,
      progress: nextTier ? (currentPoints - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints) : 1
    };
  }

  formatRewardAmount(points) {
    return `${points} ${REWARDS_CONFIG.REWARD_TYPE}`;
  }

  isEligibleForReward(transactionAmount) {
    return transactionAmount >= REWARDS_CONFIG.MIN_TRANSACTION_AMOUNT;
  }

  getMinimumTransactionMessage() {
    return `Earn ${REWARDS_CONFIG.REWARD_PERCENTAGE}% rewards on transactions above ₹${REWARDS_CONFIG.MIN_TRANSACTION_AMOUNT}`;
  }
}
