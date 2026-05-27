import { useState } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useDispatch, useSelector } from 'react-redux';

import PaymentMethodModal from '../../../components/PaymentMethodModal';

import { PaymentHandler } from '../../../business/handlers';

export default function ElectricityBillDetails({
  route,
  navigation,
}) {
  const { bill } = route.params;

  const [showPaymentModal, setShowPaymentModal] =
    useState(false);

  const user = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();

  const paymentHandler = new PaymentHandler(
    navigation,
    user,
    dispatch
  );

  const randomAmount =
    Math.floor(Math.random() * (5000 - 1500 + 1)) + 1500;

  const handlePaymentMethod = async (method) => {
    try {
      setShowPaymentModal(false);

      const transactionData = {
        type: 'Electricity Bill',
        price: randomAmount,
        data: bill.title,
      };

      let result;

      if (method === 'card') {
  navigation.navigate('CreditCardPayment', {
    plan: transactionData,
  });

  return;
}else {
        result = {
          success: true,
          transaction: {
            id: Date.now(),
            userId: user.uid,
            type: 'Electricity Bill',
            amount: Math.abs(randomAmount),
            data: bill.title,
            source: 'Wallet',
            date: new Date().toLocaleDateString(),
            status: 'Success',
          },
        };
      }

      if (result.success) {
        paymentHandler.navigateToPaymentSuccess({
          ...result.transaction,
          reward: result.reward,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-5 pt-12 pb-6 shadow-sm">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
          >
            <Text className="text-blue-600 text-lg mr-4">
              ‹
            </Text>
          </TouchableOpacity>

          <Text className="text-gray-900 text-xl font-bold">
            Bill Details
          </Text>
        </View>
      </View>

      {/* Bill Card */}
      <View className="px-5 mt-6">
        <View className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <View className="items-center">
            <View
              className={`${bill.color} w-20 h-20 rounded-full items-center justify-center mb-4`}
            >
              <Text
                className={`${bill.iconColor} text-4xl`}
              >
                {bill.icon}
              </Text>
            </View>

            <Text className="text-gray-900 text-xl font-bold text-center">
              {bill.title}
            </Text>

            <Text className="text-gray-500 mt-2">
              Consumer No: {bill.consumerNumber}
            </Text>

            <Text className="text-gray-400 text-sm mt-4">
              Current Bill Amount
            </Text>

            <Text className="text-red-500 text-4xl font-bold mt-2">
              ₹{randomAmount}
            </Text>
          </View>
        </View>

        {/* Pay Button */}
        <TouchableOpacity
          className="bg-blue-600 rounded-2xl py-4 items-center mt-6"
          onPress={() => setShowPaymentModal(true)}
        >
          <Text className="text-white font-semibold text-base">
            Proceed To Pay
          </Text>
        </TouchableOpacity>
      </View>

      {/* Payment Modal */}
      <PaymentMethodModal
        visible={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        amount={randomAmount}
        walletBalance={
          user?.userData?.wallet?.balance || 0
        }
        onContinue={handlePaymentMethod}
      />
    </View>
  );
}