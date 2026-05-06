import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

// Mock transaction storage - make it globally accessible
let transactions = [];

// Initialize global transaction storage if not already exists
if (!global.transactionStorage) {
  global.transactionStorage = [];
}

export default function TransactionHistoryScreen({ navigation }) {
  const [transactionList, setTransactionList] = useState([]);

  useEffect(() => {
    // Load transactions from global storage
    setTransactionList(global.transactionStorage);
  }, []);

  const addTransaction = (transaction) => {
    // Check if transaction with same ID already exists
    const existingIndex = global.transactionStorage.findIndex(t => t.id === transaction.id);
    
    if (existingIndex !== -1) {
      console.log('Transaction with ID already exists, skipping:', transaction.id);
      return;
    }
    
    global.transactionStorage.unshift(transaction);
    setTransactionList([...global.transactionStorage]);
    console.log('Transaction added successfully:', transaction.id);
  };

  // Make addTransaction available globally
  global.addTransaction = addTransaction;

  const formatAmount = (amount, type) => {
    if (type === 'Mobile Recharge') {
      return `-₹${amount}`;
    }
    return `+₹${amount}`;
  };

  const getAmountColor = (type) => {
    if (type === 'Mobile Recharge') {
      return 'text-red-600';
    }
    return 'text-green-600';
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-5 pt-12 pb-6 shadow-sm">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text className="text-blue-600 text-lg mr-4">‹</Text>
          </TouchableOpacity>
          <Text className="text-gray-900 text-xl font-bold">Transaction History</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {transactionList.length === 0 ? (
          <View className="items-center justify-center mt-20">
            <Text className="text-gray-400 text-lg">No transactions yet</Text>
            <Text className="text-gray-400 text-sm mt-2">Your transaction history will appear here</Text>
          </View>
        ) : (
          <View className="mt-6 mb-8">
            {transactionList.map((transaction, index) => (
              <View key={`${transaction.id}_${index}`} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-3">
                <View className="flex-row justify-between items-start">
                  <View className="flex-1">
                    <Text className="text-gray-900 font-semibold text-base mb-1">
                      {transaction.type}
                    </Text>
                    {transaction.data && (
                      <Text className="text-gray-600 text-sm mb-1">
                        {transaction.data}
                      </Text>
                    )}
                    <View className="flex-row items-center">
                      <Text className="text-gray-500 text-xs mr-2">
                        {transaction.source}
                      </Text>
                      {transaction.cardNumber && (
                        <Text className="text-gray-500 text-xs">
                          •••• {transaction.cardNumber}
                        </Text>
                      )}
                    </View>
                    <Text className="text-gray-500 text-xs mt-1">
                      {transaction.date}
                    </Text>
                  </View>
                  
                  <View className="items-end">
                    <Text className={`font-bold text-lg ${getAmountColor(transaction.type)}`}>
                      {formatAmount(transaction.amount, transaction.type)}
                    </Text>
                    <View className={`px-2 py-1 rounded-full mt-1 ${
                      transaction.status === 'Success' 
                        ? 'bg-green-100' 
                        : 'bg-yellow-100'
                    }`}>
                      <Text className={`text-xs font-medium ${
                        transaction.status === 'Success' 
                          ? 'text-green-700' 
                          : 'text-yellow-700'
                      }`}>
                        {transaction.status}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
