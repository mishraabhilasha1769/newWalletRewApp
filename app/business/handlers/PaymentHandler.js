import {
  doc,
  updateDoc,
} from 'firebase/firestore';
import { ERROR_MESSAGES, PAYMENT_METHODS } from '../../constants';
import { transactionService } from '../../services/transactionService';
import { AuthValidator, CardValidator } from '../../utils/validators';
import { RewardHandler } from './RewardHandler';

import { db } from '../../services/firebase';

import { updateUser } from '../../store/authSlice';

export class PaymentHandler {
  constructor(navigation, user, dispatch = null) {
    this.navigation = navigation;
    this.user = user;
    this.dispatch = dispatch;
  }

  async processCreditCardPayment(plan, cardDetails) {
    try {
      // Validate user is available
      if (!this.user || !this.user.uid) {
        throw new Error('User not authenticated. Please login again.');
      }

      // Validate card details
      const cardNumberValidation = CardValidator.validateCardNumber(cardDetails.cardNumber);
      if (!cardNumberValidation.isValid) {
        throw new Error(cardNumberValidation.error);
      }

      const cvvValidation = CardValidator.validateCVV(cardDetails.cvv);
      if (!cvvValidation.isValid) {
        throw new Error(cvvValidation.error);
      }

      // Validate required fields
      const requiredFieldsValidation = AuthValidator.validateRequiredFields(cardDetails, [
        'cardNumber', 'cardHolder', 'expiryDate', 'cvv'
      ]);
      if (!requiredFieldsValidation.isValid) {
        throw new Error(requiredFieldsValidation.error);
      }

      // Clean card number
      const cleanedCardNumber = cardDetails.cardNumber.replace(/\s/g, '');

      // Create transaction data
   const transactionData = {
  userId: this.user.uid,
  type: plan.type || 'Mobile Recharge',
  amount: -Math.abs(plan.price),
  data: plan.data,
  source: PAYMENT_METHODS.CREDIT_CARD,
  cardNumber: cleanedCardNumber.slice(-4),
  date: new Date().toLocaleDateString(),
  status: 'Success'
};

      // Save transaction to database
      const result = await transactionService.saveTransaction(this.user.uid, transactionData);
      
      if (!result.success) {
        throw new Error(ERROR_MESSAGES.PAYMENT_FAILED);
      }

      // Process rewards for the transaction
      console.log('PaymentHandler: Processing rewards for transaction:', result.transaction.id);
      console.log('PaymentHandler: Transaction amount:', result.transaction.amount);
      
      const rewardHandler = new RewardHandler(this.user, this.dispatch);
      const rewardResult = await rewardHandler.processTransactionReward(result.transaction);

      console.log('PaymentHandler: Reward result:', JSON.stringify(rewardResult, null, 2));

      return { 
        success: true, 
        transaction: result.transaction,
        reward: rewardResult.eligible ? rewardResult.reward : null
      };
    } catch (error) {
      console.error('Payment processing error:', error);
      return { success: false, error: error.message };
    }
  }

async processWalletPayment(plan) {
  try {
    const currentBalance =
      this.user?.userData?.wallet?.balance || 0;

    if (currentBalance < plan.price) {
      return {
        success: false,
        error: 'Insufficient wallet balance',
      };
    }

    const updatedBalance =
      currentBalance - plan.price;

    // Save transaction
    const transactionData = {
      userId: this.user.uid,
      type: plan.type || 'Mobile Recharge',
      amount: -Math.abs(plan.price),
      data: plan.data,
      source: PAYMENT_METHODS.WALLET,
      date: new Date().toLocaleDateString(),
      status: 'Success',
    };

    await transactionService.saveTransaction(
      this.user.uid,
      transactionData
    );

    // Update Firestore wallet balance
    await updateDoc(
      doc(db, 'users', this.user.uid),
      {
        'wallet.balance': updatedBalance,
      }
    );

    // Update Redux user
  const updatedUser = {
  ...this.user,

  userData: {
    ...this.user.userData,

    wallet: {
      ...this.user.userData?.wallet,
      balance: updatedBalance,
    },
  },
};

this.user = updatedUser;
this.dispatch(
  updateUser({
    userData: {
      ...this.user.userData,

      wallet: {
        ...this.user.userData?.wallet,
        balance: updatedBalance,
      },
    },
  })
);

    // Rewards
    const rewardHandler = new RewardHandler(
      this.user,
      this.dispatch
    );

    const rewardResult =
      await rewardHandler.processTransactionReward(
        transactionData
      );

    return {
      success: true,
      transaction: {
        ...transactionData,
        reward:
          rewardResult.reward || null,
      },
    };
  } catch (error) {
    console.log(
      'Wallet Payment Error:',
      error
    );

    return {
      success: false,
      error: error.message,
    };
  }
}

  async handlePaymentSelection(plan, paymentMethod, cardDetails = null) {
    switch (paymentMethod) {
      case PAYMENT_METHODS.CREDIT_CARD:
        if (!cardDetails) {
          throw new Error('Card details required for credit card payment');
        }
        return await this.processCreditCardPayment(plan, cardDetails);
      
      case PAYMENT_METHODS.WALLET:
        return await this.processWalletPayment(plan);
      
      default:
        throw new Error('Invalid payment method selected');
    }
  }

  navigateToPaymentSuccess(transaction) {
    console.log('PaymentHandler: navigateToPaymentSuccess called with:', JSON.stringify(transaction, null, 2));
    this.navigation.navigate('PaymentSuccess', { transaction });
  }

  navigateToPaymentMethod(plan) {
    // This would navigate to payment method selection
    // For now, we'll show the alert directly in the screen
  }
}
