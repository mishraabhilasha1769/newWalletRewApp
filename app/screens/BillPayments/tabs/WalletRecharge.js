import { useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  PaymentHandler,
  RewardHandler,
} from '../../../business/handlers';

import PaymentMethodModal from '../../../components/PaymentMethodModal';

export default function WalletRecharge({
  navigation,
}) {
  const [amount, setAmount] = useState('');

  const [showPaymentModal, setShowPaymentModal] =
    useState(false);

  const user = useSelector((state) => state.auth.user);

const dispatch = useDispatch();

const paymentHandler = new PaymentHandler(
  navigation,
  user,
  dispatch
);

  const handlePaymentMethod = async (method) => {
  try {
    setShowPaymentModal(false);
if (method === 'card') {
  navigation.navigate('CreditCardPayment', {
    plan: {
      type: 'Wallet Topup',
      price: Number(amount),
      data: 'Wallet Recharge',
    },
  });

  return;
}
    const transaction = {
      id: Date.now(),
      userId: user.uid,
      type: 'Wallet Topup',
      amount: Number(amount),
      data: 'Wallet Recharge',
      source:
        method === 'card'
          ? 'Credit Card'
          : 'Wallet',
      date: new Date().toLocaleDateString(),
      status: 'Success',
    };

    const rewardHandler = new RewardHandler(
      user,
      dispatch
    );

    const rewardResult =
      await rewardHandler.processTransactionReward(
        transaction
      );

    paymentHandler.navigateToPaymentSuccess({
      ...transaction,
      reward: rewardResult.reward || null,
    });
  } catch (error) {
    console.log(error);
  }
};

  return (
    <View className="flex-1 bg-gray-50 px-5 pt-10">
      <Text className="text-gray-900 text-2xl font-bold mb-6">
        Wallet Recharge
      </Text>

      {/* Amount Input */}
      <View className="mt-6">
        <Text className="text-gray-900 font-semibold mb-2">
          Enter Amount
        </Text>

        <TextInput
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          placeholder="Enter wallet amount"
          placeholderTextColor="#9CA3AF"
          className="bg-white border border-gray-200 rounded-2xl px-4 py-4 text-gray-900"
        />

        {/* Button */}
        <TouchableOpacity
          className="bg-blue-600 rounded-2xl py-4 items-center mt-6"
          onPress={() => {
            if (!amount) return;

            setShowPaymentModal(true);
          }}
        >
          <Text className="text-white font-semibold text-base">
            Add Money To Wallet
          </Text>
        </TouchableOpacity>

        {/* Payment Modal */}
        <PaymentMethodModal
          visible={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          amount={Number(amount)}
          walletBalance={0}
          loading={false}
          showWalletOption={false}
          onContinue={handlePaymentMethod}
        />
      </View>
    </View>
  );
}