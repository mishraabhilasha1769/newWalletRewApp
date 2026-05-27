// App Constants
export const APP_CONFIG = {
  APP_NAME: 'Wallet Rewards',
  DEFAULT_WALLET_BALANCE: 100,
  DEFAULT_REWARDS_POINTS: 10,
  MIN_CARD_NUMBER_LENGTH: 16,
  MIN_CVV_LENGTH: 3,
  MAX_PHONE_LENGTH: 10,
};

export const ROUTES = {
  LOGIN: 'Login',
  SIGNUP: 'Signup',
  HOME: 'Home',
  BILL_PAYMENTS: 'BillPayments',
  MOBILE_RECHARGE: 'MobileRecharge',
  CREDIT_CARD_PAYMENT: 'CreditCardPayment',
  PAYMENT_SUCCESS: 'PaymentSuccess',
  TRANSACTION_HISTORY: 'TransactionHistory',
};

export const TRANSACTION_TYPES = {
  MOBILE_RECHARGE: 'Mobile Recharge',
  ELECTRICITY_BILL: 'Electricity Bill',
  WALLET_RECHARGE: 'Wallet Recharge',
  PAYMENT_SUCCESS: 'Success',
  PAYMENT_FAILED: 'Failed',
};

export const PAYMENT_METHODS = {
  CREDIT_CARD: 'Credit Card',
  WALLET: 'Wallet',
};

export const RECHARGE_PLANS = [
  { id: 1, price: 99, data: '1 GB', validity: '28 days', popular: false },
  { id: 2, price: 199, data: '2 GB', validity: '28 days', popular: false },
  { id: 3, price: 299, data: '3.5 GB', validity: '28 days', popular: true },
  { id: 4, price: 399, data: '5 GB', validity: '28 days', popular: false },
  { id: 5, price: 499, data: '8 GB', validity: '28 days', popular: false },
];

export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid credentials',
  EMAIL_EXISTS: 'Email already exists. Please login with your existing account.',
  PHONE_EXISTS: 'Phone number already exists. Please use a different phone number.',
  FILL_ALL_FIELDS: 'Please fill all required fields',
  INVALID_CARD_NUMBER: 'Please enter a valid 16-digit card number',
  INVALID_CVV: 'Please enter a valid 3-digit CVV',
  SELECT_PLAN: 'Please select a recharge plan',
  PAYMENT_FAILED: 'Payment failed. Please try again.',
  USER_NOT_FOUND: 'User not found',
};

export const SUCCESS_MESSAGES = {
  PAYMENT_SUCCESS: 'Payment completed successfully!',
  TRANSACTION_SAVED: 'Transaction saved successfully',
  PROFILE_CREATED: 'Profile created successfully',
  REWARD_EARNED: 'Congratulations! You earned rewards!',
};

export const REWARDS_CONFIG = {
  MIN_TRANSACTION_AMOUNT: 100,
  REWARD_PERCENTAGE: 5,
  REWARD_TYPE: 'POINTS',
};
