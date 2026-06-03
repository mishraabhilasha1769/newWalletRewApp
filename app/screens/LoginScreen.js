import { useState } from 'react';

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

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
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
            Wallet Rewards
          </Text>

          <Text className="text-gray-500 mt-2">
            Secure Banking Platform
          </Text>

        </View>

        {/* Login Card */}
        <View className="mx-5 bg-white rounded-3xl p-6 shadow-lg mb-20">

         

          <View className="mb-5">

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
              returnKeyType="next"
            />

          </View>

          <View className="mb-6">

            <Text className="text-gray-700 font-medium mb-2">
              Password
            </Text>

            <TextInput
              className="bg-gray-100 rounded-2xl px-4 py-4 text-gray-900"
              placeholder="Enter your password"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              returnKeyType="done"
            />

          </View>

          <TouchableOpacity
            className="bg-indigo-600 rounded-2xl py-4 items-center"
            onPress={handleLogin}
          >

            <Text className="text-white text-lg font-bold">
              Sign In
            </Text>

          </TouchableOpacity>

          <View className="flex-row justify-center mt-6">

            <Text className="text-gray-500">
              Don&apos;t have an account?
            </Text>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate(
                  'Signup'
                )
              }
            >

              <Text className="text-indigo-600 font-bold ml-1">
                Sign Up
              </Text>

            </TouchableOpacity>

          </View>

        </View>

      </KeyboardAwareScrollView>

    </TouchableWithoutFeedback>

  </SafeAreaView>
);
};



export default LoginScreen;

