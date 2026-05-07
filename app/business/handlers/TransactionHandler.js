import { transactionService } from '../../services/transactionService';
import { TransactionFormatter, DateFormatter } from '../../utils/formatters';
import { TRANSACTION_TYPES } from '../../constants';

export class TransactionHandler {
  constructor(user) {
    this.user = user;
    this.unsubscribe = null;
  }

  async getUserTransactions() {
    try {
      if (!this.user?.uid) {
        throw new Error('User not authenticated');
      }

      const result = await transactionService.getUserTransactions(this.user.uid);
      
      if (!result.success) {
        throw new Error(result.error);
      }

      return {
        success: true,
        transactions: result.data.map(transaction => this.formatTransaction(transaction))
      };
    } catch (error) {
      console.error('Get transactions error:', error);
      return { success: false, error: error.message };
    }
  }

  subscribeToTransactions(callback) {
    if (!this.user?.uid) {
      callback({ success: false, error: 'User not authenticated' });
      return null;
    }

    this.unsubscribe = transactionService.subscribeToUserTransactions(
      this.user.uid,
      (result) => {
        if (result.success) {
          const formattedTransactions = result.data.map(transaction => 
            this.formatTransaction(transaction)
          );
          callback({ success: true, data: formattedTransactions });
        } else {
          callback(result);
        }
      }
    );

    return this.unsubscribe;
  }

  unsubscribeFromTransactions() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }

  formatTransaction(transaction) {
    return {
      ...transaction,
      formattedAmount: TransactionFormatter.formatAmount(transaction.amount, transaction.type),
      amountColor: TransactionFormatter.getAmountColor(transaction.type),
      formattedDate: TransactionFormatter.formatDate(transaction.date),
      maskedCardNumber: TransactionFormatter.maskCardNumber(transaction.cardNumber),
      relativeTime: DateFormatter.getRelativeTime(transaction.createdAt)
    };
  }

  getTransactionSummary(transactions) {
    const totalSpent = transactions
      .filter(t => t.type === TRANSACTION_TYPES.MOBILE_RECHARGE)
      .reduce((sum, t) => sum + t.amount, 0);

    const totalTransactions = transactions.length;
    const successfulTransactions = transactions.filter(t => t.status === 'Success').length;

    return {
      totalSpent,
      totalTransactions,
      successfulTransactions,
      successRate: totalTransactions > 0 ? (successfulTransactions / totalTransactions) * 100 : 0
    };
  }

  filterTransactionsByType(transactions, type) {
    return transactions.filter(transaction => transaction.type === type);
  }

  filterTransactionsByDateRange(transactions, startDate, endDate) {
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.createdAt);
      return transactionDate >= startDate && transactionDate <= endDate;
    });
  }

  searchTransactions(transactions, searchTerm) {
    const lowerSearchTerm = searchTerm.toLowerCase();
    return transactions.filter(transaction => 
      transaction.type.toLowerCase().includes(lowerSearchTerm) ||
      transaction.source.toLowerCase().includes(lowerSearchTerm) ||
      (transaction.data && transaction.data.toLowerCase().includes(lowerSearchTerm))
    );
  }
}
