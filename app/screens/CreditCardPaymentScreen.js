import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';

export default function CreditCardPaymentScreen({ route, navigation }) {
  const { plan } = route.params;
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  const handlePayment = () => {
    if (!cardNumber || !cardHolder || !expiryDate || !cvv) {
      Alert.alert('Error', 'Please fill all card details');
      return;
    }
    
    // Remove spaces from card number for validation
    const cleanedCardNumber = cardNumber.replace(/\s/g, '');
    if (cleanedCardNumber.length !== 16) {
      Alert.alert('Error', 'Please enter a valid 16-digit card number');
      return;
    }
    
    if (cvv.length !== 3) {
      Alert.alert('Error', 'Please enter a valid 3-digit CVV');
      return;
    }

    // Store transaction data
    const transaction = {
      id: Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      type: 'Mobile Recharge',
      amount: plan.price,
      data: plan.data,
      source: 'Credit Card',
      cardNumber: cleanedCardNumber.slice(-4), // Store last 4 digits
      date: new Date().toLocaleDateString(),
      status: 'Success'
    };

    navigation.navigate('PaymentSuccess', { transaction });
  };

  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g);
    return chunks ? chunks.join(' ') : cleaned;
  };

  const formatExpiryDate = (text) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
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
