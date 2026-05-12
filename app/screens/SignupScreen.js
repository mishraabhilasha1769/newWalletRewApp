import React, { useState } from 'react';

import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, SafeAreaView } from 'react-native';

import { useDispatch, useSelector } from 'react-redux';

import { signupUser } from '../store/authSlice';



const SignupScreen = ({ navigation }) => {

  const [username, setUsername] = useState('');

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const [phoneNumber, setPhoneNumber] = useState('');

  const dispatch = useDispatch();

  

  const { isLoading, error } = useSelector((state) => state.auth);



  const handleSignup = async () => {

    if (!username || !email || !password || !phoneNumber) {

      Alert.alert('Error', 'Please fill all fields');

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



    const result = await dispatch(signupUser({ username, email, password, phoneNumber }));



    if (result.meta.requestStatus === 'fulfilled') {

      Alert.alert('Success', 'Account created');

      navigation.navigate('Login');

    }

    // Error is handled automatically by Redux state

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

            <Text className="text-gray-900 text-2xl font-bold">Create Account</Text>

            <Text className="text-gray-600 text-sm mt-1">Join Wallet Rewards today</Text>

          </View>

        </View>



        {/* Signup Form */}

        <View className="px-5 mt-8">

          <Text className="text-gray-900 text-xl font-semibold mb-6">Personal Information</Text>



          {/* Username Input */}

          <View className="mb-4">

            <Text className="text-gray-700 text-sm font-medium mb-2">Username</Text>

            <TextInput

              className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900"

              placeholder="Choose a username"

              placeholderTextColor="#9CA3AF"

              value={username}

              onChangeText={setUsername}

            />

          </View>



          {/* Email Input */}

          <View className="mb-4">

            <Text className="text-gray-700 text-sm font-medium mb-2">Email Address</Text>

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



          {/* Phone Number Input */}

          <View className="mb-4">

            <Text className="text-gray-700 text-sm font-medium mb-2">Phone Number</Text>

            <TextInput

              className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900"

              placeholder="Enter your phone number"

              placeholderTextColor="#9CA3AF"

              value={phoneNumber}

              onChangeText={setPhoneNumber}

              keyboardType="phone-pad"

            />

          </View>



          {/* Password Input */}

          <View className="mb-6">

            <Text className="text-gray-700 text-sm font-medium mb-2">Password</Text>

            <TextInput

              className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900"

              placeholder="Create a password (min 6 characters)"

              placeholderTextColor="#9CA3AF"

              value={password}

              onChangeText={setPassword}

              secureTextEntry

            />

          </View>



          {/* Error Display */}

          {error && (

            <View className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">

              <Text className="text-red-700 text-sm">{error}</Text>

            </View>

          )}



          {/* Terms and Conditions */}

          <View className="mb-6">

            <Text className="text-gray-600 text-xs text-center">

              By creating an account, you agree to our{' '}

              <Text className="text-blue-600 font-semibold">Terms of Service</Text>

              {' '}and{' '}

              <Text className="text-blue-600 font-semibold">Privacy Policy</Text>

            </Text>

          </View>



          {/* Signup Button */}

          <TouchableOpacity 

            className="bg-blue-600 rounded-lg py-3 items-center mb-4"

            onPress={handleSignup}

            disabled={isLoading}

          >

            <Text className="text-white font-semibold text-base">

              {isLoading ? 'Creating Account...' : 'Create Account'}

            </Text>

          </TouchableOpacity>



          {/* Login Link */}

          <View className="flex-row justify-center">

            <Text className="text-gray-600 text-sm">Already have an account? </Text>

            <TouchableOpacity onPress={() => navigation.navigate('Login')}>

              <Text className="text-blue-600 text-sm font-semibold">Sign In</Text>

            </TouchableOpacity>

          </View>

        </View>

      </ScrollView>

    </SafeAreaView>

  );

};



export default SignupScreen;

