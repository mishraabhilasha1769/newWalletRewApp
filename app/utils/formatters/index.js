import { TRANSACTION_TYPES } from '../../constants';

export class TransactionFormatter {
static formatAmount(amount, type) {
  if (
    type === TRANSACTION_TYPES.MOBILE_RECHARGE ||
    type === TRANSACTION_TYPES.ELECTRICITY_BILL || type === TRANSACTION_TYPES.WALLET_RECHARGE
  ) {
    return `-₹${Math.abs(amount)}`;
  }

  return `+₹${amount}`;
}

static getAmountColor(type) {
  if (
    type === TRANSACTION_TYPES.MOBILE_RECHARGE ||
    type === TRANSACTION_TYPES.ELECTRICITY_BILL
  ) {
    return 'text-red-600';
  }

  return 'text-green-600';
}

  static formatDate(date) {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  static formatDateTime(date) {
    return new Date(date).toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  static maskCardNumber(cardNumber) {
    if (!cardNumber || cardNumber.length < 4) {
      return '••••';
    }
    return `•••• ${cardNumber.slice(-4)}`;
  }
}

export class DateFormatter {
  static getRelativeTime(date) {
    const now = new Date();
    const transactionDate = new Date(date);
    const diffInHours = Math.floor((now - transactionDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return TransactionFormatter.formatDate(date);
    }
  }
}

export class CurrencyFormatter {
  static formatToINR(amount) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  }

  static formatToINRWithoutSymbol(amount) {
    return `₹${amount.toLocaleString('en-IN')}`;
  }
}
