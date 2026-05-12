import { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
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
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-5 pt-12 pb-6 shadow-sm">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text className="text-blue-600 text-lg mr-4">‹</Text>
          </TouchableOpacity>
          <Text className="text-gray-900 text-xl font-bold">Credit Card Payment</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {/* Order Summary */}
        <View className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mt-6">
          <Text className="text-gray-900 text-lg font-semibold mb-3">Order Summary</Text>
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-gray-600">Mobile Recharge</Text>
            <Text className="text-gray-900 font-semibold">₹{plan.price}</Text>
          </View>
          <View className="flex-row justify-between items-center">
            <Text className="text-gray-600">Data</Text>
            <Text className="text-gray-900">{plan.data}</Text>
          </View>
          <View className="flex-row justify-between items-center mt-3 pt-3 border-t border-gray-200">
            <Text className="text-gray-900 font-semibold">Total Amount</Text>
            <Text className="text-blue-600 font-bold text-lg">₹{plan.price}</Text>
          </View>
        </View>

        {/* Card Details */}
        <View className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mt-6">
          <Text className="text-gray-900 text-lg font-semibold mb-4">Card Details</Text>
          
          {/* Card Number */}
          <View className="mb-4">
            <Text className="text-gray-700 text-sm font-medium mb-2">Card Number</Text>
            <TextInput
              className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
              placeholder="1234 5678 9012 3456"
              placeholderTextColor="#9CA3AF"
              value={cardNumber}
              onChangeText={(text) => setCardNumber(formatCardNumber(text))}
              keyboardType="numeric"
              maxLength={19}
            />
          </View>

          {/* Card Holder Name */}
          <View className="mb-4">
            <Text className="text-gray-700 text-sm font-medium mb-2">Card Holder Name</Text>
            <TextInput
              className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
              placeholder="John Doe"
              placeholderTextColor="#9CA3AF"
              value={cardHolder}
              onChangeText={setCardHolder}
              autoCapitalize="words"
            />
          </View>

          {/* Expiry Date and CVV */}
          <View className="flex-row gap-4">
            <View className="flex-1 mb-4">
              <Text className="text-gray-700 text-sm font-medium mb-2">Expiry Date</Text>
              <TextInput
                className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
                placeholder="MM/YY"
                placeholderTextColor="#9CA3AF"
                value={expiryDate}
                onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
                keyboardType="numeric"
                maxLength={5}
              />
            </View>
            
            <View className="flex-1 mb-4">
              <Text className="text-gray-700 text-sm font-medium mb-2">CVV</Text>
              <TextInput
                className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
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
        <View className="mt-6 mb-8">
          <TouchableOpacity 
            className="bg-blue-600 rounded-lg py-4 items-center"
            onPress={handlePayment}
          >
            <Text className="text-white font-semibold text-base">Pay ₹{plan.price}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
