import { useState } from 'react';
import {
  Alert,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import { PaymentHandler } from '../business/handlers';
import { CardValidator } from '../utils';

export default function CreditCardPaymentScreen({ route, navigation }) {
  const { plan } = route.params;
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  const paymentHandler = new PaymentHandler(navigation, user, dispatch);

  const handlePayment = async () => {
    console.log('CreditCardPaymentScreen: handlePayment called');
    console.log('CreditCardPaymentScreen: Plan:', JSON.stringify(plan, null, 2));
    
    const cardDetails = {
      cardNumber,
      cardHolder,
      expiryDate,
      cvv
    };

    console.log('CreditCardPaymentScreen: Calling paymentHandler.processCreditCardPayment');
    const result = await paymentHandler.processCreditCardPayment(plan, cardDetails);
    console.log('CreditCardPaymentScreen: Payment result:', JSON.stringify(result, null, 2));
    
    if (result.success) {
      console.log('CreditCardPaymentScreen: Payment successful, checking reward data');
      console.log('CreditCardPaymentScreen: Reward data:', result.reward);
      
      // Add reward data to transaction if available
      const transactionWithReward = {
        ...result.transaction,
        reward: result.reward
      };
      console.log('CreditCardPaymentScreen: Transaction with reward:', JSON.stringify(transactionWithReward, null, 2));
      paymentHandler.navigateToPaymentSuccess(transactionWithReward);
    } else {
      console.log('CreditCardPaymentScreen: Payment failed:', result.error);
      Alert.alert('Error', result.error);
    }
  };

  const formatCardNumber = (text) => {
    return CardValidator.formatCardNumber(text);
  };

  const formatExpiryDate = (text) => {
    return CardValidator.formatExpiryDate(text);
  };

 return (
  <View className="flex-1 bg-slate-100">

    <TouchableWithoutFeedback
      onPress={Keyboard.dismiss}
    >

      <KeyboardAwareScrollView
        className="flex-1"
        enableOnAndroid
        extraScrollHeight={50}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingBottom: 20,
        }}
        showsVerticalScrollIndicator={false}
      >

        {/* Header */}
        <View className="bg-blue-600 px-5 pt-10 pb-5 rounded-b-[24px]">

          <View className="flex-row items-center">

            <TouchableOpacity
              onPress={() =>
                navigation.goBack()
              }
            >
              <Text className="text-white text-2xl mr-4">
                ‹
              </Text>
            </TouchableOpacity>

            <View>

              <Text className="text-white text-2xl font-bold">
                Card Payment 💳
              </Text>

              <Text className="text-blue-100 mt-1">
                Secure checkout
              </Text>

            </View>

          </View>

        </View>

        {/* Order Summary */}
        <View className="mx-4 mt-4 bg-white rounded-3xl p-4 shadow">

          <Text className="text-gray-900 text-lg font-bold mb-3">
            Order Summary
          </Text>

          <View className="flex-row justify-between py-1">

            <Text className="text-gray-500">
              Service
            </Text>

            <Text className="font-semibold text-gray-900">
              {plan.type || 'Recharge'}
            </Text>

          </View>

          <View className="flex-row justify-between py-1">

            <Text className="text-gray-500">
              Data
            </Text>

            <Text className="font-semibold text-gray-900">
              {plan.data}
            </Text>

          </View>

          <View className="border-t border-gray-200 mt-3 pt-3 flex-row justify-between">

            <Text className="text-lg font-bold text-gray-900">
              Total
            </Text>

            <Text className="text-xl font-bold text-blue-600">
              ₹{plan.price}
            </Text>

          </View>

        </View>

        {/* Card Details */}
        <View className="mx-4 mt-4 bg-white rounded-3xl p-4 shadow">

          <Text className="text-gray-900 text-lg font-bold mb-4">
            Card Details
          </Text>

          {/* Card Number */}
          <View className="mb-3">

            <Text className="text-gray-700 font-medium mb-2">
              Card Number
            </Text>

            <TextInput
              className="bg-gray-100 rounded-2xl px-4 py-3 text-gray-900"
              placeholder="1234 5678 9012 3456"
              placeholderTextColor="#9CA3AF"
              value={cardNumber}
              onChangeText={(text) =>
                setCardNumber(
                  formatCardNumber(text)
                )
              }
              keyboardType="numeric"
              maxLength={19}
            />

          </View>

          {/* Card Holder */}
          <View className="mb-3">

            <Text className="text-gray-700 font-medium mb-2">
              Card Holder Name
            </Text>

            <TextInput
              className="bg-gray-100 rounded-2xl px-4 py-3 text-gray-900"
              placeholder="John Doe"
              placeholderTextColor="#9CA3AF"
              value={cardHolder}
              onChangeText={setCardHolder}
              autoCapitalize="words"
            />

          </View>

          {/* Expiry + CVV */}
          <View className="flex-row gap-3">

            <View className="flex-1">

              <Text className="text-gray-700 font-medium mb-2">
                Expiry
              </Text>

              <TextInput
                className="bg-gray-100 rounded-2xl px-4 py-3 text-gray-900"
                placeholder="MM/YY"
                placeholderTextColor="#9CA3AF"
                value={expiryDate}
                onChangeText={(text) =>
                  setExpiryDate(
                    formatExpiryDate(text)
                  )
                }
                keyboardType="numeric"
                maxLength={5}
              />

            </View>

            <View className="flex-1">

              <Text className="text-gray-700 font-medium mb-2">
                CVV
              </Text>

              <TextInput
                className="bg-gray-100 rounded-2xl px-4 py-3 text-gray-900"
                placeholder="123"
                placeholderTextColor="#9CA3AF"
                value={cvv}
                onChangeText={setCvv}
                keyboardType="numeric"
                maxLength={3}
                secureTextEntry
              />

            </View>

          </View>

        </View>

        {/* Pay Button */}
        <View className="mx-4 mt-5">

          <TouchableOpacity
            className="bg-blue-600 rounded-2xl py-4 items-center"
            onPress={handlePayment}
          >

            <Text className="text-white text-base font-bold">
              Pay ₹{plan.price}
            </Text>

          </TouchableOpacity>

        </View>

      </KeyboardAwareScrollView>

    </TouchableWithoutFeedback>

  </View>
);
}
