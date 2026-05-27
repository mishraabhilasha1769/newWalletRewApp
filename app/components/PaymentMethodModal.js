import { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function PaymentMethodModal({
  visible,
  onClose,
  amount,
  walletBalance = 0,
  onContinue,
  loading = false,
  showWalletOption = true,
}) {
  const [selectedMethod, setSelectedMethod] = useState(null);
 
   const paymentMethods = [
  ...(showWalletOption
    ? [
        {
          id: 'wallet',
          title: 'Wallet Balance',
          subtitle: `Available Balance: ₹${walletBalance}`,
          icon: '💰',
          disabled: walletBalance < amount,
        },
      ]
    : []),

  {
    id: 'card',
    title: 'Credit / Debit Card',
    subtitle: 'Visa, Mastercard, RuPay',
    icon: '💳',
    disabled: false,
  },
];

  const handleContinue = () => {
    if (!selectedMethod) return;

    onContinue(selectedMethod);

    setSelectedMethod(null);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 bg-black/40 justify-end"
        onPress={onClose}
      >
        <Pressable
          className="bg-white rounded-t-3xl px-5 pt-5 pb-8"
          onPress={() => {}}
        >
          {/* Header */}
          <View className="items-center mb-5">
            <View className="w-14 h-1.5 bg-gray-300 rounded-full mb-4" />

            <Text className="text-xl font-bold text-gray-900">
              Select Payment Method
            </Text>

            <Text className="text-gray-500 mt-1">
              Amount to Pay: ₹{amount}
            </Text>
          </View>

          {/* Payment Options */}
          <View className="gap-4">
            {paymentMethods.map((method) => {
              const isSelected = selectedMethod === method.id;

              return (
                <TouchableOpacity
                  key={method.id}
                  disabled={method.disabled}
                  activeOpacity={0.8}
                  onPress={() => setSelectedMethod(method.id)}
                  className={`border rounded-2xl p-4 flex-row items-center justify-between ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 bg-white'
                  } ${method.disabled ? 'opacity-50' : ''}`}
                >
                  <View className="flex-row items-center flex-1">
                    <View className="w-14 h-14 rounded-full bg-gray-100 items-center justify-center mr-4">
                      <Text className="text-2xl">{method.icon}</Text>
                    </View>

                    <View className="flex-1">
                      <Text className="text-gray-900 font-semibold text-base">
                        {method.title}
                      </Text>

                      <Text className="text-gray-500 text-sm mt-1">
                        {method.subtitle}
                      </Text>

                      {method.disabled && (
                        <Text className="text-red-500 text-xs mt-1">
                          Insufficient balance
                        </Text>
                      )}
                    </View>
                  </View>

                  {/* Radio */}
                  <View
                    className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                      isSelected
                        ? 'border-blue-600'
                        : 'border-gray-300'
                    }`}
                  >
                    {isSelected && (
                      <View className="w-3 h-3 rounded-full bg-blue-600" />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            disabled={!selectedMethod || loading}
            onPress={handleContinue}
            className={`mt-6 rounded-2xl py-4 items-center ${
              selectedMethod
                ? 'bg-blue-600'
                : 'bg-gray-300'
            }`}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-semibold text-base">
                Continue
              </Text>
            )}
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}