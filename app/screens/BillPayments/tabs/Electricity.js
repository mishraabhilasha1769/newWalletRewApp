import { useMemo, useState } from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const electricityBills = [
    {
      id: 1,
      title: 'Divyashree Electricity Bill',
      consumerNumber: 'ELEC102938',
      amount:
        Math.floor(Math.random() * (5000 - 1500 + 1)) +
        1500,
      icon: '⚡',
      color: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
    },
    {
      id: 2,
      title: 'Bellandur Electricity Bill',
      consumerNumber: 'ELEC847362',
      amount:
        Math.floor(Math.random() * (5000 - 1500 + 1)) +
        1500,
      icon: '💡',
      color: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
  ];

export default function Electricity({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBills = useMemo(() => {
    return electricityBills.filter((bill) =>
      bill.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

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

          <View>
            <Text className="text-gray-900 text-2xl font-bold">
              Electricity Bills
            </Text>

            <Text className="text-gray-500 text-sm mt-1">
              Manage and pay your bills
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
      >
        {/* Search Box */}
        <View className="mt-6">
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search electricity bill..."
            placeholderTextColor="#9CA3AF"
            className="bg-white border border-gray-200 rounded-2xl px-4 py-4 text-gray-900"
          />
        </View>

        {/* Bills */}
        <View className="mt-6 mb-8">
          {filteredBills.length > 0 ? (
            filteredBills.map((bill) => (
              <TouchableOpacity
                key={bill.id}
                activeOpacity={0.8}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4"
                onPress={() =>
                  navigation.navigate(
                    'ElectricityBillDetails',
                    { bill }
                  )
                }
              >
                <View className="flex-row items-center">
                  {/* Icon */}
                  <View
                    className={`${bill.color} w-14 h-14 rounded-full items-center justify-center mr-4`}
                  >
                    <Text
                      className={`${bill.iconColor} text-2xl`}
                    >
                      {bill.icon}
                    </Text>
                  </View>

                  {/* Details */}
                  <View className="flex-1">
                    <Text className="text-gray-900 font-bold text-base">
                      {bill.title}
                    </Text>

                    <Text className="text-gray-500 text-sm mt-1">
                      Consumer No: {bill.consumerNumber}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View className="items-center mt-10">
              <Text className="text-gray-500 text-base">
                No electricity bills found
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}