import {
  doc,
  updateDoc,
} from 'firebase/firestore';
import {
  Alert,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../../../store/authSlice';

import { db } from '../../../services/firebase';

export default function RedeemRewards({
  navigation,
}) {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const rewardPoints =
    user?.userData?.rewards?.points ||
    user?.userData?.rewardPoints ||
    0;

  const handleRedeem = async() => {
  if (rewardPoints <= 0) {
    Alert.alert(
      'No Rewards',
      'You do not have enough reward points'
    );

    return;
  }

  const redeemAmount = rewardPoints > 600 ?Math.floor(
    rewardPoints * 0.1) : 0;

    
  const remainingPoints =
  rewardPoints >= 600
    ? 0
    : 600 - rewardPoints;

  if (rewardPoints < 600) {
    Alert.alert(
      'Redeem Locked',
      `Add ${remainingPoints} more reward points to unlock redeem rewards`
    );

    return;
  }

  const updatedUser = {
  ...user,

  userData: {
    ...user.userData,

    rewards: {
      ...user.userData?.rewards,
      points: 0,
    },

    wallet: {
      ...user.userData?.wallet,

      balance:
        (user.userData?.wallet?.balance || 0) +
        redeemAmount,
    },
  },
};
await updateDoc(
  doc(db, 'users', user.uid),
  {
    'userData.rewards.points': 0,

    'userData.wallet.balance':
      (user.userData?.wallet?.balance || 0) +
      redeemAmount,
  }
);
 dispatch(updateUser(updatedUser));;

Alert.alert(
  'Rewards Redeemed 🎉',
  `₹${redeemAmount} cashback has been added to your wallet successfully.`
);
};

 return (
  <View className="flex-1 bg-slate-100">

    {/* Header */}
    <View className="bg-gradient-to-r bg-indigo-600 px-5 pt-14 pb-8 rounded-b-[36px]">

      <View className="flex-row items-center">

        <TouchableOpacity
          onPress={() => navigation.goBack()}
        >
          <Text className="text-white text-3xl mr-4">
            ‹
          </Text>
        </TouchableOpacity>

        <View>
          <Text className="text-white text-3xl font-bold">
            Rewards 🎁
          </Text>

          <Text className="text-indigo-100 mt-1">
            Unlock cashback & exclusive benefits
          </Text>
        </View>

      </View>

    </View>

    <View className="flex-1 px-5 mt-6">

      {/* Main Reward Card */}
      <View className="bg-violet-600 rounded-[36px] p-8 shadow-xl">

       

        <Text className="text-violet-100 mt-6 text-base">
          Available Reward Points
        </Text>

        <Text className="text-white text-7xl font-bold mt-2">
          {rewardPoints}
        </Text>

        <View className="bg-white/15 rounded-3xl p-5 mt-6">

          <Text className="text-violet-100">
            Cashback Value
          </Text>

          <Text className="text-white text-3xl font-bold mt-2">
            ₹{Math.floor(rewardPoints * 0.1)}
          </Text>

        </View>

      </View>

      {/* Milestone Card */}
      <View className="bg-amber-100 rounded-3xl p-5 mt-5 shadow">

        <Text className="text-amber-900 text-lg font-bold">
          🎯 Redemption Goal
        </Text>

        <Text className="text-amber-700 mt-2">
          Reach 600 reward points to unlock cashback redemption.
        </Text>

        <View className="bg-amber-200 h-3 rounded-full mt-4 overflow-hidden">

          <View
            className="bg-orange-500 h-3 rounded-full"
            style={{
              width: `${Math.min(
                (rewardPoints / 600) * 100,
                100
              )}%`,
            }}
          />

        </View>

      </View>

      {/* Status Card */}
      <View className="bg-white rounded-3xl p-6 mt-5 shadow">

        {rewardPoints >= 600 ? (

          <>
            <Text className="text-green-700 text-xl font-bold">
              🎉 Redemption Unlocked
            </Text>

            <Text className="text-green-600 mt-2">
              You can redeem cashback right now.
            </Text>
          </>

        ) : (

          <>
            <Text className="text-orange-700 text-xl font-bold">
              🔒 Redemption Locked
            </Text>

            <Text className="text-orange-600 mt-2">
              Earn {600 - rewardPoints} more points
              to unlock cashback redemption.
            </Text>
          </>

        )}

      </View>

      {/* Redeem Button */}
      <TouchableOpacity
        className={`rounded-3xl py-5 items-center mt-6 ${
          rewardPoints >= 600
            ? 'bg-emerald-500'
            : 'bg-gray-300'
        }`}
        disabled={rewardPoints < 600}
        onPress={handleRedeem}
      >

        <Text className="text-white text-lg font-bold">

          {rewardPoints >= 600
            ? `Redeem ₹${Math.floor(
                rewardPoints * 0.1
              )}`
            : `Need ${
                600 - rewardPoints
              } More Points`}

        </Text>

      </TouchableOpacity>

    </View>

  </View>
);
}