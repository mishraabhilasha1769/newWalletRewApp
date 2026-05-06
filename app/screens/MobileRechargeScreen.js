import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Pressable } from 'react-native';

export default function MobileRechargeScreen({ navigation }) {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    { id: 1, price: 99, data: '1 GB', validity: '28 days', popular: false },
    { id: 2, price: 199, data: '2 GB', validity: '28 days', popular: false },
    { id: 3, price: 299, data: '3.5 GB', validity: '28 days', popular: true },
    { id: 4, price: 399, data: '5 GB', validity: '28 days', popular: false },
    { id: 5, price: 499, data: '8 GB', validity: '28 days', popular: false }
  ];

  const handleRecharge = () => {
    console.log('handleRecharge called, selectedPlan:', selectedPlan);
    if (!selectedPlan) {
      Alert.alert('Error', 'Please select a recharge plan');
      return;
    }
    
    Alert.alert(
      'Select Payment Method',
      `Recharge ₹${selectedPlan.price} for ${selectedPlan.data}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Credit Card', 
          onPress: () => {
            navigation.navigate('CreditCardPayment', { plan: selectedPlan });
          }
        },
        { 
          text: 'Wallet', 
          onPress: () => {
            Alert.alert('Info', 'Wallet payment coming soon!');
          }
        }
      ]
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-5 pt-12 pb-6 shadow-sm">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text className="text-blue-600 text-lg mr-4">‹</Text>
          </TouchableOpacity>
          <Text className="text-gray-900 text-xl font-bold">Mobile Recharge</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {/* Recharge Plans */}
        <View className="mt-6">
          <Text className="text-gray-900 text-lg font-semibold mb-4">Select Recharge Plan</Text>
          
          {plans.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              className={`bg-white rounded-xl p-4 shadow-sm border-2 mb-3 ${
                selectedPlan?.id === plan.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-100'
              }`}
              onPress={() => {
              console.log('Plan selected:', plan);
              setSelectedPlan(plan);
            }}
            >
              <View className="flex-row justify-between items-center">
                <View className="flex-1">
                  <View className="flex-row items-center mb-2">
                    <Text className="text-gray-900 text-xl font-bold">₹{plan.price}</Text>
                    {plan.popular && (
                      <View className="bg-blue-600 px-2 py-1 rounded ml-2">
                        <Text className="text-white text-xs font-medium">Popular</Text>
                      </View>
                    )}
                  </View>
                  <Text className="text-gray-700 font-medium mb-1">{plan.data} Data</Text>
                  <Text className="text-gray-500 text-sm">Valid for {plan.validity}</Text>
                </View>
                <View className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                  selectedPlan?.id === plan.id 
                    ? 'border-blue-600 bg-blue-600' 
                    : 'border-gray-300'
                }`}>
                  {selectedPlan?.id === plan.id && (
                    <Text className="text-white text-xs">✓</Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recharge Button */}
        <View className="mt-6 mb-8">
          <Pressable
            className="bg-blue-600 rounded-lg py-4 px-6 items-center justify-center shadow-md"
            onPress={handleRecharge}
            style={({ pressed }) => ({
              opacity: pressed ? 0.8 : 1,
              minHeight: 48,
              cursor: 'pointer'
            })}
          >
            <Text className="text-white font-semibold text-base">Proceed to Recharge</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
