import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

export default function PaymentSuccessScreen({ route, navigation }) {
  const { transaction } = route.params;

  useEffect(() => {
    // Add transaction to history when screen loads
    console.log('PaymentSuccess: Adding transaction to history:', transaction);
    
    // Initialize global storage if it doesn't exist
    if (!global.transactionStorage) {
      global.transactionStorage = [];
    }
    
    // Add transaction directly to global storage
    global.transactionStorage.unshift(transaction);
    
    // Also try to use the addTransaction function if available
    if (global.addTransaction) {
      global.addTransaction(transaction);
      
    }
    
    console.log('PaymentSuccess: Transaction added. Total transactions:', global.transactionStorage.length);
  }, [transaction]);

  const handleViewTransactions = () => {
    navigation.navigate('TransactionHistory');
  };

  const handleBackToHome = () => {
    navigation.navigate('Home');
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-5 pt-12 pb-6 shadow-sm">
        <Text className="text-gray-900 text-xl font-bold text-center">Payment Success</Text>
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {/* Success Icon */}
        <View className="items-center mt-8 mb-6">
          <View className="w-20 h-20 bg-green-100 rounded-full items-center justify-center">
            <Text className="text-green-600 text-3xl">✓</Text>
          </View>
          <Text className="text-gray-900 text-2xl font-bold mt-4">Payment Successful!</Text>
          <Text className="text-gray-600 text-sm mt-2">Your recharge has been completed</Text>
        </View>

        {/* Transaction Details */}
        <View className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <Text className="text-gray-900 text-lg font-semibold mb-4">Transaction Details</Text>
          
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-gray-600">Transaction ID</Text>
            <Text className="text-gray-900 font-medium">#{transaction.id}</Text>
          </View>
          
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-gray-600">Type</Text>
            <Text className="text-gray-900 font-medium">{transaction.type}</Text>
          </View>
          
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-gray-600">Amount</Text>
            <Text className="text-gray-900 font-semibold">₹{transaction.amount}</Text>
          </View>
          
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-gray-600">Data</Text>
            <Text className="text-gray-900 font-medium">{transaction.data}</Text>
          </View>
          
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-gray-600">Payment Source</Text>
            <Text className="text-gray-900 font-medium">{transaction.source}</Text>
          </View>
          
          {transaction.cardNumber && (
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-gray-600">Card Ending</Text>
              <Text className="text-gray-900 font-medium">**** **** **** {transaction.cardNumber}</Text>
            </View>
          )}
          
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-gray-600">Date</Text>
            <Text className="text-gray-900 font-medium">{transaction.date}</Text>
          </View>
          
          <View className="flex-row justify-between items-center">
            <Text className="text-gray-600">Status</Text>
            <View className="bg-green-100 px-3 py-1 rounded-full">
              <Text className="text-green-700 text-sm font-medium">{transaction.status}</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="mt-6 mb-8 space-y-3">
          <TouchableOpacity 
            className="bg-blue-600 rounded-lg py-4 items-center"
            onPress={handleViewTransactions}
          >
            <Text className="text-white font-semibold text-base">View Transaction History</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="bg-white border border-gray-300 rounded-lg py-4 items-center"
            onPress={handleBackToHome}
          >
            <Text className="text-gray-700 font-semibold text-base">Back to Home</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
