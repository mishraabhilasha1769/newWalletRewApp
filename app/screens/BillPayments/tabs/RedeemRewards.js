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

  const redeemAmount = rewardPoints > 500 ?Math.floor(
    rewardPoints * 0.1) : 0;

    
  const remainingPoints =
  rewardPoints > 500
    ? 0
    : 501 - rewardPoints;

  if (rewardPoints <= 500) {
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
        points: rewardPoints - redeemAmount,
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
    'rewards.points':
      rewardPoints - redeemAmount,

    'wallet.balance':
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
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-5 pt-12 pb-6 shadow-sm">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
          >
            <Text className="text-indigo-600 text-2xl mr-4">
              ‹
            </Text>
          </TouchableOpacity>

          <View>
            <Text className="text-gray-900 text-2xl font-bold">
              Rewards
            </Text>

            <Text className="text-gray-500 text-sm mt-1">
              Redeem your reward points
            </Text>
          </View>
        </View>
      </View>

      {/* Main Content */}
      <View className="flex-1 px-5 pt-10">
        {/* Reward Card */}
        <View className="bg-indigo-600 rounded-[32px] p-8 shadow-xl border border-indigo-500">
          {/* Premium Badge */}
          <View className="bg-white/20 self-start px-4 py-2 rounded-full">
            <Text className="text-white text-xs font-semibold tracking-wide">
              PREMIUM REWARDS
            </Text>
          </View>

          {/* Reward Points */}
          <Text className="text-indigo-100 text-base mt-6">
            Available Reward Points
          </Text>

          <Text className="text-white text-6xl font-bold mt-4">
            {rewardPoints}
          </Text>

          {/* Info Box */}
          <View className="bg-white/15 rounded-2xl px-5 py-4 mt-8 border border-white/10">
            <Text className="text-indigo-50 text-sm leading-6">
              Use your reward points to unlock cashback,
              premium offers and exclusive benefits.
            </Text>
          </View>
        </View>

        {/* Redeem Section */}
        <View className="bg-white rounded-3xl p-6 mt-8 shadow-sm border border-gray-100">
          <Text className="text-gray-900 text-xl font-bold">
            Redeem Rewards
          </Text>

          <Text className="text-gray-500 mt-2 leading-6">
            Convert your reward points into cashback
            and exciting benefits.
          </Text>

          <TouchableOpacity
            className={`rounded-2xl py-4 items-center mt-6 ${
              rewardPoints > 0
                ? 'bg-indigo-600'
                : 'bg-gray-300'
            }`}
            disabled={rewardPoints <= 0}
            onPress={handleRedeem}
          >
            <Text className="text-white font-semibold text-base">
              Redeem Now
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}