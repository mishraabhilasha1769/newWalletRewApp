import { APP_CONFIG, ERROR_MESSAGES } from '../../constants';

export class CardValidator {
  static validateCardNumber(cardNumber) {
    const cleaned = cardNumber.replace(/\s/g, '');
    if (cleaned.length !== APP_CONFIG.MIN_CARD_NUMBER_LENGTH) {
      return { isValid: false, error: ERROR_MESSAGES.INVALID_CARD_NUMBER };
    }
    return { isValid: true };
  }

  static validateCVV(cvv) {
    if (cvv.length !== APP_CONFIG.MIN_CVV_LENGTH) {
      return { isValid: false, error: ERROR_MESSAGES.INVALID_CVV };
    }
    return { isValid: true };
  }

  static formatCardNumber(text) {
    const cleaned = text.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g);
    return chunks ? chunks.join(' ') : cleaned;
  }

  static formatExpiryDate(text) {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  }
}

export class AuthValidator {
  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, error: 'Please enter a valid email address' };
    }
    return { isValid: true };
  }

  static validatePassword(password) {
    if (password.length < 6) {
      return { isValid: false, error: 'Password must be at least 6 characters long' };
    }
    return { isValid: true };
  }

  static validatePhoneNumber(phoneNumber) {
    const cleaned = phoneNumber.replace(/\D/g, '');
    if (cleaned.length !== APP_CONFIG.MAX_PHONE_LENGTH) {
      return { isValid: false, error: 'Please enter a valid 10-digit phone number' };
    }
    return { isValid: true };
  }

  static validateRequiredFields(data, requiredFields) {
    const missingFields = requiredFields.filter(field => !data[field]);
    if (missingFields.length > 0) {
      return { 
        isValid: false, 
        error: ERROR_MESSAGES.FILL_ALL_FIELDS,
        missingFields 
      };
    }
    return { isValid: true };
  }
}

export class TransactionValidator {
  static validateRechargePlan(plan) {
    if (!plan) {
      return { isValid: false, error: ERROR_MESSAGES.SELECT_PLAN };
    }
    return { isValid: true };
  }

  static validatePaymentData(paymentData) {
    const requiredFields = ['amount', 'type', 'source'];
    return AuthValidator.validateRequiredFields(paymentData, requiredFields);
  }
}
