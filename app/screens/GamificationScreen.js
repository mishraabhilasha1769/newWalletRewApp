import { useEffect, useState } from 'react';

import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { WebView } from 'react-native-webview';

import { readAsStringAsync } from 'expo-file-system/legacy';

import { Asset } from 'expo-asset';

import { useDispatch, useSelector } from 'react-redux';

import { updateUser } from '../store/authSlice';

import {
  doc,
  updateDoc,
} from 'firebase/firestore';

import { db } from '../services/firebase';

export default function GamificationScreen({navigation}) {

  const [html, setHtml] =
    useState('');

  const dispatch =
    useDispatch();

  const user =
    useSelector(
      (state) => state.auth.user
    );

  useEffect(() => {
    loadHtml();
  }, []);

  const loadHtml = async () => {

    const asset = Asset.fromModule(
      require('../../assets/images/spin-wheel.html')
    );

    await asset.downloadAsync();

    const htmlContent =
      await readAsStringAsync(
        asset.localUri
      );

    setHtml(htmlContent);
  };

  const handleReward = async (points) => {

  try {

    console.log(
      'Reward points received:',
      points
    );

    const currentPoints =
      user?.userData?.rewards
        ?.points || 0;

    const updatedPoints =
      currentPoints + points;

    /* COMPLETE UPDATED USER */

    const updatedUser = {
      ...user,

      userData: {
        ...user.userData,

        rewards: {
          ...user.userData?.rewards,

          points: updatedPoints,
        },
      },
    };

    console.log(
      'Updated user:',
      updatedUser
    );

    /* FIREBASE UPDATE */

    await updateDoc(
      doc(
        db,
        'users',
        user.uid
      ),
      {
        'userData.rewards.points':
          updatedPoints,
      }
    );

    console.log(
      'Firebase updated'
    );

    /* REDUX UPDATE */

    dispatch(
      updateUser(updatedUser)
    );

    console.log(
      'Redux updated'
    );

  } catch (error) {

    console.log(
      'Reward update error:',
      error
    );
  }
};

 return (
  <SafeAreaView className="flex-1 bg-[#FFF5FB]">

    {/* Header */}
    <View className="px-5 pt-4 pb-3">

      <View className="flex-row items-center justify-between">

        <View>
          <Text className="text-3xl font-bold text-pink-700">
            Spin & Win 🎉
          </Text>

          <Text className="text-pink-500 mt-1">
            Try your luck and earn rewards
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="bg-white rounded-full px-4 py-2 shadow"
        >
          <Text className="text-pink-600 font-semibold">
            Back
          </Text>
        </TouchableOpacity>

      </View>

      {/* Reward Points Card */}
      <View className="bg-white rounded-3xl p-4 mt-4 shadow">

        <Text className="text-gray-500">
          Available Reward Points
        </Text>

        <Text className="text-4xl font-bold text-violet-600 mt-2">
          {user?.userData?.rewards?.points || 0}
        </Text>

      </View>

    </View>

    {/* Wheel */}
    <View className="flex-1 mx-3 mb-3 overflow-hidden rounded-3xl">

      {html ? (
        <WebView
          originWhitelist={['*']}
          source={{ html }}
          javaScriptEnabled
          domStorageEnabled
          scrollEnabled={false}
          style={{
            backgroundColor: 'transparent',
          }}
          onMessage={async (event) => {

            try {

              const data = JSON.parse(
                event.nativeEvent.data
              );

              if (data.type === 'reward') {

                await handleReward(
                  data.points
                );

              }

              if (data.type === 'goHome') {

                navigation.navigate(
                  'Home'
                );

              }

            } catch (error) {

              console.log(error);

            }

          }}
        />
      ) : null}

    </View>

  </SafeAreaView>
);
}