import { RECHARGE_PLANS, TRANSACTION_TYPES, ERROR_MESSAGES } from '../../constants';
import { TransactionValidator } from '../../utils/validators';
import { PaymentHandler } from './PaymentHandler';

export class RechargeHandler {
  constructor(navigation, user) {
    this.navigation = navigation;
    this.user = user;
    this.paymentHandler = new PaymentHandler(navigation, user);
  }

  getAvailablePlans() {
    return RECHARGE_PLANS;
  }

  getPlanById(planId) {
    return RECHARGE_PLANS.find(plan => plan.id === planId);
  }

  getPopularPlans() {
    return RECHARGE_PLANS.filter(plan => plan.popular);
  }

  validatePlanSelection(plan) {
    const validation = TransactionValidator.validateRechargePlan(plan);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }
    return true;
  }

  async initiateRecharge(plan, paymentMethod, cardDetails = null) {
    try {
      // Validate plan selection
      this.validatePlanSelection(plan);

      // Process payment based on method
      const paymentResult = await this.paymentHandler.handlePaymentSelection(
        plan, 
        paymentMethod, 
        cardDetails
      );

      if (!paymentResult.success) {
        throw new Error(paymentResult.error);
      }

      // Navigate to success screen
      this.paymentHandler.navigateToPaymentSuccess(paymentResult.transaction);

      return { 
        success: true, 
        transaction: paymentResult.transaction,
        message: 'Recharge completed successfully'
      };
    } catch (error) {
      console.error('Recharge initiation error:', error);
      return { success: false, error: error.message };
    }
  }

  calculateSavings(plan) {
    // This could be used for future features like cashback or offers
    const savings = 0; // No savings currently implemented
    return {
      originalPrice: plan.price,
      savings: savings,
      finalPrice: plan.price - savings
    };
  }

  getPlanBenefits(plan) {
    return {
      data: plan.data,
      validity: plan.validity,
      price: plan.price,
      popular: plan.popular,
      pricePerGB: this.calculatePricePerGB(plan)
    };
  }

  calculatePricePerGB(plan) {
    const dataInGB = this.extractDataInGB(plan.data);
    if (dataInGB === 0) return 0;
    return (plan.price / dataInGB).toFixed(2);
  }

  extractDataInGB(dataString) {
    const match = dataString.match(/(\d+(?:\.\d+)?)\s*GB/i);
    return match ? parseFloat(match[1]) : 0;
  }

  comparePlans(plan1, plan2) {
    const benefits1 = this.getPlanBenefits(plan1);
    const benefits2 = this.getPlanBenefits(plan2);

    return {
      priceDifference: plan2.price - plan1.price,
      dataDifference: this.extractDataInGB(plan2.data) - this.extractDataInGB(plan1.data),
      betterValue: benefits1.pricePerGB < benefits2.pricePerGB ? plan1 : plan2
    };
  }

  getRecommendedPlan(usagePattern = 'medium') {
    const plans = this.getAvailablePlans();
    
    switch (usagePattern) {
      case 'light':
        return plans.find(plan => plan.data === '1 GB') || plans[0];
      case 'medium':
        return plans.find(plan => plan.data === '2 GB') || plans[1];
      case 'heavy':
        return plans.find(plan => plan.data === '5 GB') || plans[3];
      default:
        return this.getPopularPlans()[0] || plans[2];
    }
  }

  formatPlanDescription(plan) {
    return `${plan.data} for ₹${plan.price} (${plan.validity})`;
  }

  canAffordRecharge(plan, paymentMethod) {
    if (paymentMethod === 'Wallet') {
      // Future implementation for wallet payment
      return true; // Placeholder
    }
    return true; // Credit card doesn't require pre-check
  }
}
