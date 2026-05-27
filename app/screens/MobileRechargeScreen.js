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
            Mobile Recharge
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
      >
        {/* Recharge Plans */}
        <View className="mt-6">
          <Text className="text-gray-900 text-lg font-semibold mb-4">
            Select Recharge Plan
          </Text>

          {plans.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              className={`bg-white rounded-xl p-4 shadow-sm border-2 mb-3 ${
                selectedPlan?.id === plan.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-100'
              }`}
              onPress={() =>
                setSelectedPlan(plan)
              }
            >
              <View className="flex-row justify-between items-center">
                <View className="flex-1">
                  <View className="flex-row items-center mb-2">
                    <Text className="text-gray-900 text-xl font-bold">
                      ₹{plan.price}
                    </Text>

                    {plan.popular && (
                      <View className="bg-blue-600 px-2 py-1 rounded ml-2">
                        <Text className="text-white text-xs font-medium">
                          Popular
                        </Text>
                      </View>
                    )}
                  </View>

                  <Text className="text-gray-700 font-medium mb-1">
                    {plan.data} Data
                  </Text>

                  <Text className="text-gray-500 text-sm">
                    Valid for {plan.validity}
                  </Text>
                </View>

                <View
                  className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                    selectedPlan?.id ===
                    plan.id
                      ? 'border-blue-600 bg-blue-600'
                      : 'border-gray-300'
                  }`}
                >
                  {selectedPlan?.id ===
                    plan.id && (
                    <Text className="text-white text-xs">
                      ✓
                    </Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recharge Button */}
        <View className="mt-6 mb-8">
          <Pressable
            className={`rounded-lg py-4 px-6 items-center justify-center shadow-md ${
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
            <Text className="text-white font-semibold text-base">
              Proceed to Recharge
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
            user?.userData?.wallet?.balance ||
            0
          }
          loading={paymentLoading}
          onContinue={handlePaymentMethod}
        />
      </ScrollView>
    </View>
  );
}