import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import RewardPopup from '../components/RewardPopup';
import { RewardHandler } from '../business/handlers';

export default function PaymentSuccessScreen({ route, navigation }) {
  const { transaction } = route.params;
  const [showRewardPopup, setShowRewardPopup] = useState(false);
  const [rewardData, setRewardData] = useState(null);

  useEffect(() => {
    // Transaction is already saved to database in CreditCardPaymentScreen
    console.log('PaymentSuccess: Transaction data:', JSON.stringify(transaction, null, 2));
    console.log('PaymentSuccess: Transaction amount:', transaction.amount);
    console.log('PaymentSuccess: Transaction reward:', transaction.reward);
    
    // Check if transaction has rewards and show popup
    if (transaction.reward) {
      console.log('PaymentSuccess: Showing reward popup');
      const rewardHandler = new RewardHandler({ uid: transaction.userId });
      const rewardMessage = rewardHandler.getRewardMessage(transaction.reward);
      setRewardData(rewardMessage);
      
      // Show reward popup after a short delay
      setTimeout(() => {
        setShowRewardPopup(true);
      }, 1000);
    } else {
      console.log('PaymentSuccess: No reward found in transaction');
      // Let's check if this transaction should have rewards
      const rewardHandler = new RewardHandler({ uid: transaction.userId });
      const shouldHaveReward = rewardHandler.isEligibleForReward(transaction.amount);
      console.log('PaymentSuccess: Should have reward:', shouldHaveReward);
    }
  }, [transaction]);

  const handleViewTransactions = () => {
    navigation.navigate('TransactionHistory');
  };

  const handleBackToHome = () => {
    navigation.navigate('Home');
  };

  const handleCloseRewardPopup = () => {
    setShowRewardPopup(false);
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
      
      {/* Reward Popup */}
      <RewardPopup
        visible={showRewardPopup}
        rewardData={rewardData}
        onClose={handleCloseRewardPopup}
      />
    </View>
  );
}
