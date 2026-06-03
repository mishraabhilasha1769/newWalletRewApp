import React, { useState } from 'react';

import {
  Alert,
  Keyboard,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { useDispatch, useSelector } from 'react-redux';

import { signupUser } from '../store/authSlice';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';



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
  <SafeAreaView className="flex-1 bg-indigo-50">

    <TouchableWithoutFeedback
      onPress={Keyboard.dismiss}
    >

      <KeyboardAwareScrollView
        className="flex-1"
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        extraScrollHeight={120}
        keyboardOpeningTime={0}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 120,
        }}
      >

        {/* Header */}
        <View className="items-center pt-16 pb-10">

          <View className="w-24 h-24 bg-indigo-600 rounded-full items-center justify-center">
            <Text className="text-white text-3xl font-bold">
              WR
            </Text>
          </View>

          <Text className="text-3xl font-bold text-gray-900 mt-6">
            Create Account
          </Text>

          <Text className="text-gray-500 mt-2">
            Join Wallet Rewards today
          </Text>

        </View>

        {/* Signup Card */}
        <View className="mx-5 bg-white rounded-3xl p-6 shadow-lg mb-20">

          <Text className="text-2xl font-bold text-gray-900 mb-6">
            Personal Information
          </Text>

          {/* Username */}
          <View className="mb-4">

            <Text className="text-gray-700 font-medium mb-2">
              Username
            </Text>

            <TextInput
              className="bg-gray-100 rounded-2xl px-4 py-4 text-gray-900"
              placeholder="Choose a username"
              placeholderTextColor="#9CA3AF"
              value={username}
              onChangeText={setUsername}
            />

          </View>

          {/* Email */}
          <View className="mb-4">

            <Text className="text-gray-700 font-medium mb-2">
              Email Address
            </Text>

            <TextInput
              className="bg-gray-100 rounded-2xl px-4 py-4 text-gray-900"
              placeholder="Enter your email"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

          </View>

          {/* Phone */}
          <View className="mb-4">

            <Text className="text-gray-700 font-medium mb-2">
              Phone Number
            </Text>

            <TextInput
              className="bg-gray-100 rounded-2xl px-4 py-4 text-gray-900"
              placeholder="Enter phone number"
              placeholderTextColor="#9CA3AF"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />

          </View>

          {/* Password */}
          <View className="mb-6">

            <Text className="text-gray-700 font-medium mb-2">
              Password
            </Text>

            <TextInput
              className="bg-gray-100 rounded-2xl px-4 py-4 text-gray-900"
              placeholder="Minimum 6 characters"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

          </View>

          {/* Error */}
          {error && (
            <View className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
              <Text className="text-red-600">
                {error}
              </Text>
            </View>
          )}

          {/* Terms */}
          <Text className="text-center text-gray-500 text-xs mb-6 leading-5">
            By creating an account, you agree to our{" "}
            <Text className="text-indigo-600 font-bold">
              Terms of Service
            </Text>
            {" "}and{" "}
            <Text className="text-indigo-600 font-bold">
              Privacy Policy
            </Text>
          </Text>

          {/* Create Account */}
          <TouchableOpacity
            className="bg-indigo-600 rounded-2xl py-4 items-center"
            onPress={handleSignup}
            disabled={isLoading}
          >

            <Text className="text-white text-lg font-bold">
              {isLoading
                ? 'Creating Account...'
                : 'Create Account'}
            </Text>

          </TouchableOpacity>

          {/* Login */}
          <View className="flex-row justify-center mt-6">

            <Text className="text-gray-500">
              Already have an account?
            </Text>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate(
                  'Login'
                )
              }
            >

              <Text className="text-indigo-600 font-bold ml-1">
                Sign In
              </Text>

            </TouchableOpacity>

          </View>

        </View>

      </KeyboardAwareScrollView>

    </TouchableWithoutFeedback>

  </SafeAreaView>
);

};



export default SignupScreen;

