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
  <View className="flex-1 bg-slate-100">

    {/* Header */}
    <View className="bg-emerald-600 px-5 pt-10 pb-5 rounded-b-[24px]">

      <Text className="text-white text-2xl font-bold text-center">
        Payment Successful 🎉
      </Text>

      <Text className="text-emerald-100 text-center mt-1">
        Transaction completed successfully
      </Text>

    </View>

    <ScrollView
      className="flex-1 px-4"
      contentContainerStyle={{
        paddingBottom: 20,
      }}
      showsVerticalScrollIndicator={false}
    >

      {/* Success Summary */}
      <View className="bg-white rounded-3xl p-5 shadow -mt-3">

        <View className="items-center">

          <View className="w-16 h-16 bg-green-100 rounded-full items-center justify-center">

            <Text className="text-3xl">
              ✅
            </Text>

          </View>

          <Text className="text-xl font-bold text-gray-900 mt-3">
            Payment Successful
          </Text>

          <Text className="text-gray-500 text-center mt-1">
            Your payment has been processed.
          </Text>

          <Text className="text-3xl font-bold text-emerald-600 mt-4">
            ₹{Math.abs(transaction.amount)}
          </Text>

        </View>

      </View>

      {/* Transaction Details */}
      <View className="bg-white rounded-3xl p-4 mt-4 shadow">

        <Text className="text-lg font-bold text-gray-900 mb-3">
          Transaction Details
        </Text>

        <View className="flex-row justify-between py-2">

          <Text className="text-gray-500">
            Transaction ID
          </Text>

          <Text
            className="font-semibold text-gray-900"
            numberOfLines={1}
          >
            {transaction.id}
          </Text>

        </View>

        <View className="flex-row justify-between py-2">

          <Text className="text-gray-500">
            Type
          </Text>

          <Text className="font-semibold text-gray-900">
            {transaction.type}
          </Text>

        </View>

        <View className="flex-row justify-between py-2">

          <Text className="text-gray-500">
            Source
          </Text>

          <Text className="font-semibold text-gray-900">
            {transaction.source}
          </Text>

        </View>

        {transaction.cardNumber && (

          <View className="flex-row justify-between py-2">

            <Text className="text-gray-500">
              Card
            </Text>

            <Text className="font-semibold text-gray-900">
              **** {transaction.cardNumber}
            </Text>

          </View>

        )}

        <View className="flex-row justify-between py-2">

          <Text className="text-gray-500">
            Date
          </Text>

          <Text className="font-semibold text-gray-900">
            {transaction.date}
          </Text>

        </View>

        <View className="flex-row justify-between py-2 items-center">

          <Text className="text-gray-500">
            Status
          </Text>

          <View className="bg-green-100 px-3 py-1 rounded-full">

            <Text className="text-green-700 text-xs font-bold">
              SUCCESS
            </Text>

          </View>

        </View>

      </View>

      {/* Reward Card */}
      {transaction.reward && (

        <View className="bg-amber-100 rounded-3xl p-4 mt-4">

          <Text className="text-amber-900 font-bold text-lg">
            🎁 Reward Earned
          </Text>

          <Text className="text-amber-700 mt-1">
            +{transaction.reward.pointsEarned} reward points added.
          </Text>

        </View>

      )}

      {/* Buttons */}
      <View className="mt-5 mb-6">

        <TouchableOpacity
          className="bg-indigo-600 rounded-2xl py-4 items-center"
          onPress={handleViewTransactions}
        >

          <Text className="text-white font-bold">
            View Transactions
          </Text>

        </TouchableOpacity>

        <TouchableOpacity
          className="bg-white border border-gray-200 rounded-2xl py-4 items-center mt-3"
          onPress={handleBackToHome}
        >

          <Text className="text-gray-700 font-bold">
            Back To Home
          </Text>

        </TouchableOpacity>

      </View>

    </ScrollView>

    <RewardPopup
      visible={showRewardPopup}
      rewardData={rewardData}
      onClose={handleCloseRewardPopup}
    />

  </View>
);
  
}
