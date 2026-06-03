import { addDoc, collection, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { db } from './firebase.js';

export const transactionService = {
  // Save transaction to database
  saveTransaction: async (userId, transactionData) => {
    try {
      console.log('💾 Saving transaction to database:', transactionData);
      
      const transaction = {
        userId: userId,
        ...transactionData,
        createdAt: new Date().toISOString(),
        timestamp: Date.now()
      };

      const docRef = await addDoc(collection(db, 'transactions'), transaction);
      console.log('✅ Transaction saved successfully with ID:', docRef.id);
      
      return { 
        success: true, 
        transactionId: docRef.id,
        transaction: { ...transaction, id: docRef.id }
      };
    } catch (error) {
      console.error('❌ Error saving transaction:', error);
      return { success: false, error: error.message };
    }
  },

  // Get all transactions for a user
  getUserTransactions: async (userId) => {
    try {
      console.log('📋 Fetching transactions for user:', userId);
      
      const q = query(
        collection(db, 'transactions'),
        where('userId', '==', userId)
      );
      
      const querySnapshot = await getDocs(q);
      const transactions = [];
      
      querySnapshot.forEach((doc) => {
        transactions.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      // Sort by createdAt in JavaScript (newest first)
      transactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      console.log('✅ Retrieved transactions:', transactions.length);
      return { success: true, data: transactions };
    } catch (error) {
      console.error('❌ Error fetching transactions:', error);
      return { success: false, error: error.message };
    }
  },

  // Real-time listener for user transactions
  subscribeToUserTransactions: (userId, callback) => {
    try {
      console.log('🔄 Setting up real-time transaction listener for user:', userId);
      
      const q = query(
        collection(db, 'transactions'),
        where('userId', '==', userId)
      );
      
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const transactions = [];
        
        querySnapshot.forEach((doc) => {
          transactions.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        // Sort by createdAt in JavaScript (newest first)
        transactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        console.log('📡 Real-time update received:', transactions.length, 'transactions');
        callback({ success: true, data: transactions });
      }, (error) => {
        console.error('❌ Real-time listener error:', error);
        callback({ success: false, error: error.message });
      });
      
      return unsubscribe;
    } catch (error) {
      console.error('❌ Error setting up listener:', error);
      return null;
    }
  }
};
