import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, SafeAreaView } from 'react-native';
import { useDispatch } from 'react-redux';
import { loginUser } from '../store/authSlice';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    // Password validation
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    const result = await dispatch(loginUser({ identifier: email, password }));

    if (result.meta.requestStatus === 'fulfilled') {
      Alert.alert('Success', `Welcome back, ${result.payload.username}!`);
      navigation.navigate('Home');
    } else {
      Alert.alert('Login Error', result.payload);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="bg-white px-5 pt-12 pb-8 shadow-sm">
          <View className="items-center">
            <View className="w-16 h-16 bg-blue-600 rounded-full items-center justify-center mb-4">
              <Text className="text-white text-2xl font-bold">WR</Text>
            </View>
            <Text className="text-gray-900 text-2xl font-bold">Wallet Rewards</Text>
            <Text className="text-gray-600 text-sm mt-1">Secure Banking Platform</Text>
          </View>
        </View>

        {/* Login Form */}
        <View className="px-5 mt-8">
          <Text className="text-gray-900 text-xl font-semibold mb-6">Sign In</Text>

          {/* Email Input */}
          <View className="mb-5">
            <Text className="text-gray-700 text-sm font-medium mb-2">Email</Text>
            <TextInput
              className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
              placeholder="Enter your email address"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Password Input */}
          <View className="mb-6">
            <Text className="text-gray-700 text-sm font-medium mb-2">Password</Text>
            <TextInput
              className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
              placeholder="Enter your password"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {/* Login Button */}
          <TouchableOpacity 
            className="bg-blue-600 rounded-lg py-3 items-center mb-6"
            onPress={handleLogin}
          >
            <Text className="text-white font-semibold text-base">Sign In</Text>
          </TouchableOpacity>

          {/* Signup Link */}
          <View className="flex-row justify-center">
            <Text className="text-gray-600 text-sm">Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text className="text-blue-600 text-sm font-semibold">Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;
