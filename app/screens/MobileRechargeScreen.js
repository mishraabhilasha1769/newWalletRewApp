import { useState } from 'react';

import {
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useDispatch, useSelector } from 'react-redux';

import PaymentMethodModal from './../components/PaymentMethodModal';

import { PaymentHandler } from '../business/handlers';

export default function MobileRechargeScreen({
  navigation,
}) {
  const [selectedPlan, setSelectedPlan] =
    useState(null);

  const [showPaymentModal, setShowPaymentModal] =
    useState(false);

  const [paymentLoading, setPaymentLoading] =
    useState(false);

  const user = useSelector(
    (state) => state.auth.user
  );

  const dispatch = useDispatch();

  const paymentHandler = new PaymentHandler(
    navigation,
    user,
    dispatch
  );

  const plans = [
    {
      id: 1,
      price: 99,
      data: '1 GB',
      validity: '28 days',
      popular: false,
    },
    {
      id: 2,
      price: 199,
      data: '2 GB',
      validity: '28 days',
      popular: false,
    },
    {
      id: 3,
      price: 299,
      data: '3.5 GB',
      validity: '28 days',
      popular: true,
    },
    {
      id: 4,
      price: 399,
      data: '5 GB',
      validity: '28 days',
      popular: false,
    },
    {
      id: 5,
      price: 499,
      data: '8 GB',
      validity: '28 days',
      popular: false,
    },
  ];

  const handlePaymentMethod = async (
    method
  ) => {
    if (!selectedPlan) {
      return;
    }

    setShowPaymentModal(false);

    // CREDIT CARD
    if (method === 'card') {
      navigation.navigate(
        'CreditCardPayment',
        {
          plan: selectedPlan,
        }
      );

      return;
    }

    // WALLET
    if (method === 'wallet') {
      try {
        setPaymentLoading(true);

        const result =
          await paymentHandler.processWalletPayment(
            {
              type: 'Mobile Recharge',
              price: selectedPlan.price,
              data: selectedPlan.data,
            }
          );

        if (result.success) {
          paymentHandler.navigateToPaymentSuccess(
            result.transaction
          );
        }
      } catch (error) {
        console.log(error);
      } finally {
        setPaymentLoading(false);
      }

      return;
    }
  };

  return (
  <View className="flex-1 bg-slate-100">

    {/* Header */}
    <View className="bg-blue-600 px-5 pt-14 pb-8 rounded-b-[32px]">

      <View className="flex-row items-center">

        <TouchableOpacity
          onPress={() => navigation.goBack()}
        >
          <Text className="text-white text-3xl mr-4">
            ‹
          </Text>
        </TouchableOpacity>

        <View>
          <Text className="text-white text-3xl font-bold">
            Mobile Recharge 📱
          </Text>

          <Text className="text-blue-100 mt-1">
            Choose a plan and recharge instantly
          </Text>
        </View>

      </View>

    </View>

    <ScrollView
      className="flex-1 px-5"
      showsVerticalScrollIndicator={false}
    >

      {/* Banner */}
      <View className="bg-cyan-100 rounded-3xl p-5 mt-5 shadow">

        <Text className="text-cyan-900 text-lg font-bold">
          🚀 Fast Recharge
        </Text>

        <Text className="text-cyan-700 mt-2">
          Complete your recharge in seconds and earn reward points.
        </Text>

      </View>

      {/* Plans */}
      <View className="mt-6">

        <Text className="text-gray-900 text-xl font-bold mb-4">
          Select Recharge Plan
        </Text>

        {plans.map((plan) => (

          <TouchableOpacity
            key={plan.id}
            className={`rounded-3xl p-5 mb-4 border-2 shadow-sm ${
              selectedPlan?.id === plan.id
                ? 'bg-blue-50 border-blue-500'
                : 'bg-white border-gray-100'
            }`}
            onPress={() =>
              setSelectedPlan(plan)
            }
          >

            <View className="flex-row justify-between items-center">

              <View className="flex-1">

                <View className="flex-row items-center">

                  <Text className="text-3xl font-bold text-blue-600">
                    ₹{plan.price}
                  </Text>

                  {plan.popular && (
                    <View className="bg-orange-500 px-3 py-1 rounded-full ml-3">

                      <Text className="text-white text-xs font-bold">
                        🔥 Popular
                      </Text>

                    </View>
                  )}

                </View>

                <Text className="text-gray-900 font-semibold text-lg mt-3">
                  {plan.data} Data
                </Text>

                <Text className="text-gray-500 mt-1">
                  Validity: {plan.validity}
                </Text>

              </View>

              <View
                className={`w-8 h-8 rounded-full items-center justify-center ${
                  selectedPlan?.id === plan.id
                    ? 'bg-blue-600'
                    : 'border-2 border-gray-300'
                }`}
              >

                {selectedPlan?.id === plan.id && (
                  <Text className="text-white font-bold">
                    ✓
                  </Text>
                )}

              </View>

            </View>

          </TouchableOpacity>

        ))}

      </View>

      {/* Selected Plan Summary */}
      {selectedPlan && (

        <View className="bg-emerald-100 rounded-3xl p-5 mt-2">

          <Text className="text-emerald-900 font-bold text-lg">
            ✅ Selected Plan
          </Text>

          <Text className="text-emerald-700 mt-2">
            ₹{selectedPlan.price} • {selectedPlan.data} • {selectedPlan.validity}
          </Text>

        </View>

      )}

      {/* Recharge Button */}
      <View className="mt-6 mb-10">

        <Pressable
          className={`rounded-3xl py-5 items-center shadow-lg ${
            selectedPlan
              ? 'bg-blue-600'
              : 'bg-gray-300'
          }`}
          onPress={() => {

            if (!selectedPlan) {
              return;
            }

            setShowPaymentModal(true);

          }}
        >

          <Text className="text-white text-lg font-bold">

            {selectedPlan
              ? `Recharge ₹${selectedPlan.price}`
              : 'Select a Plan'}

          </Text>

        </Pressable>

      </View>

      {/* Payment Modal */}
      <PaymentMethodModal
        visible={showPaymentModal}
        onClose={() =>
          setShowPaymentModal(false)
        }
        amount={
          selectedPlan
            ? selectedPlan.price
            : 0
        }
        walletBalance={
          user?.userData?.wallet?.balance || 0
        }
        loading={paymentLoading}
        onContinue={handlePaymentMethod}
      />

    </ScrollView>

  </View>
);
}