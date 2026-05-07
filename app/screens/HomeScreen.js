import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { UserHandler } from '../business/handlers';

const HomeScreen = ({ navigation }) => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const userHandler = new UserHandler(user);
  const wallet = userHandler.getWalletBalance();
  const points = userHandler.getRewardsPoints();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          onPress: () => {
            dispatch(logout());
            navigation.navigate('Login');
          }
        }
      ]
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="bg-white pt-12 pb-6 px-5 shadow-sm">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-gray-900 text-2xl font-bold">Welcome back,</Text>
              <Text className="text-blue-600 text-xl font-semibold">{user?.username}</Text>
            </View>
            <TouchableOpacity 
                onPress={handleLogout}
                className="bg-red-100 rounded-lg px-3 py-1 items-center justify-center"
              >
                <Text className="text-red-600 text-sm font-medium">logout</Text>
              </TouchableOpacity>
          </View>
        </View>

        {/* Balance Cards */}
        <View className="px-5 mt-6">
          <View className="flex-row gap-4">
            {/* Wallet Balance Card */}
            <View className="flex-1 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <View className="flex-row items-center mb-3">
                <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center mr-3">
                  <Text className="text-green-600 text-lg">₹</Text>
                </View>
                <Text className="text-gray-600 text-sm font-medium">Wallet Balance</Text>
              </View>
              <Text className="text-gray-900 text-2xl font-bold">₹{wallet}</Text>
              <Text className="text-green-600 text-xs mt-1">Available</Text>
            </View>

            {/* Rewards Points Card */}
            <TouchableOpacity 
              className="flex-1 bg-white rounded-xl p-5 shadow-sm border border-gray-100"
              onPress={() => navigation.navigate('RewardsPoints')}
            >
              <View className="flex-row items-center mb-3">
                <View className="w-10 h-10 bg-purple-100 rounded-full items-center justify-center mr-3">
                  <Text className="text-purple-600 text-lg">⭐</Text>
                </View>
                <Text className="text-gray-600 text-sm font-medium">Rewards Points</Text>
              </View>
              <Text className="text-gray-900 text-2xl font-bold">{points}</Text>
              <Text className="text-purple-600 text-xs mt-1">Points earned</Text>
              
              {/* Redeem Button */}
              <TouchableOpacity 
                className="bg-purple-600 rounded-lg py-2 px-3 items-center mt-3"
                onPress={() => navigation.navigate('RewardsPoints')}
              >
                <Text className="text-white text-xs font-semibold">Redeem</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="px-5 mt-6">
          <Text className="text-gray-900 text-lg font-semibold mb-4">Quick Actions</Text>
          
          <TouchableOpacity 
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-3 flex-row items-center"
            onPress={() => navigation.navigate('BillPayments')}
          >
            <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mr-4">
              <Text className="text-blue-600 text-xl">💳</Text>
            </View>
            <View className="flex-1">
              <Text className="text-gray-900 font-semibold text-base">Bill Payments</Text>
              <Text className="text-gray-500 text-sm">Pay bills instantly</Text>
            </View>
            <Text className="text-gray-400 text-lg">›</Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-3 flex-row items-center">
            <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center mr-4">
              <Text className="text-green-600 text-xl">🎮</Text>
            </View>
            <View className="flex-1">
              <Text className="text-gray-900 font-semibold text-base">Gamification</Text>
              <Text className="text-gray-500 text-sm">Earn rewards</Text>
            </View>
            <Text className="text-gray-400 text-lg">›</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex-row items-center"
            onPress={() => navigation.navigate('TransactionHistory')}
          >
            <View className="w-12 h-12 bg-orange-100 rounded-full items-center justify-center mr-4">
              <Text className="text-orange-600 text-xl">📊</Text>
            </View>
            <View className="flex-1">
              <Text className="text-gray-900 font-semibold text-base">Transaction History</Text>
              <Text className="text-gray-500 text-sm">View all transactions</Text>
            </View>
            <Text className="text-gray-400 text-lg">›</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
