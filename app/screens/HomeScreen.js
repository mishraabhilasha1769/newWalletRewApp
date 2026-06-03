import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { UserHandler } from '../business/handlers';
import { logout } from '../store/authSlice';

const HomeScreen = ({ navigation }) => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const userHandler = new UserHandler(user);
  const wallet = userHandler.getWalletBalance();
  const points = userHandler.getRewardsPoints();
  const rewardPoints =
    user?.userData?.rewards?.points ??
    user?.rewards?.points ??
    0;

const isGamificationUnlocked =
  rewardPoints >= 600;

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

 <View className="flex-1 bg-slate-100">
  <ScrollView
    className="flex-1"
    showsVerticalScrollIndicator={false}
  >

    {/* Header */}
    <View className="bg-indigo-600 pt-14 pb-10 px-5 rounded-b-[32px]">

      <View className="flex-row justify-between items-center">

        <View>
          <Text className="text-white text-3xl font-bold">
            Welcome Back 👋
          </Text>

          <Text className="text-indigo-100 text-xl font-semibold mt-1">
            {user?.username}
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleLogout}
          className="bg-white/20 rounded-full px-4 py-2"
        >
          <Text className="text-white font-semibold">
            Logout
          </Text>
        </TouchableOpacity>

      </View>

    </View>

    {/* Balance Cards */}
    <View className="px-5 -mt-6">

      <View className="flex-row gap-4">

        {/* Wallet */}
        <View className="flex-1 bg-emerald-500 rounded-3xl p-5 shadow-lg">

          <Text className="text-emerald-100 font-medium">
            Wallet Balance
          </Text>

          <Text className="text-white text-3xl font-bold mt-3">
            ₹{wallet}
          </Text>

          <Text className="text-emerald-50 mt-2">
            Available Balance
          </Text>

        </View>

        {/* Rewards */}
        <View className="flex-1 bg-violet-600 rounded-3xl p-5 shadow-lg">

          <Text className="text-violet-100 font-medium">
            Reward Points
          </Text>

          <Text className="text-white text-3xl font-bold mt-3">
            {points}
          </Text>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate(
                'RedeemRewards'
              )
            }
            className="bg-white rounded-xl py-2 mt-4 items-center"
          >
            <Text className="text-violet-600 font-bold">
              Redeem
            </Text>
          </TouchableOpacity>

        </View>

      </View>

    </View>

    {/* Rewards Banner */}
    <View className="mx-5 mt-6 bg-amber-100 rounded-3xl p-5">

      <Text className="text-amber-900 text-lg font-bold">
        🎁 Reward Milestone
      </Text>

      <Text className="text-amber-700 mt-2">
        Earn 600 reward points to unlock cashback redemption.
      </Text>

    </View>

    {/* Quick Actions */}
    <View className="px-5 mt-6">

      <Text className="text-gray-900 text-xl font-bold mb-4">
        Quick Actions
      </Text>

      {/* Bill Payments */}
      <TouchableOpacity
        className="bg-white rounded-3xl p-5 shadow-md border border-gray-100 mb-4 flex-row items-center"
        onPress={() =>
          navigation.navigate(
            'BillPayments'
          )
        }
      >

        <View className="w-14 h-14 bg-blue-100 rounded-full items-center justify-center mr-4">
          <Text className="text-2xl">
            💳
          </Text>
        </View>

        <View className="flex-1">
          <Text className="text-gray-900 text-base font-bold">
            Bill Payments
          </Text>

          <Text className="text-gray-500">
            Pay bills instantly
          </Text>
        </View>

        <View className="bg-gray-100 rounded-full w-8 h-8 items-center justify-center">
          <Text className="text-gray-600">
            ›
          </Text>
        </View>

      </TouchableOpacity>

      {/* Gamification */}
     <TouchableOpacity
  disabled={!isGamificationUnlocked}
  className={`rounded-3xl p-5 shadow-md border border-gray-100 mb-4 flex-row items-center ${
    isGamificationUnlocked
      ? 'bg-white'
      : 'bg-gray-200'
  }`}
  onPress={() =>
    navigation.navigate(
      'GamificationScreen'
    )
  }
>

  <View
    className={`w-14 h-14 rounded-full items-center justify-center mr-4 ${
      isGamificationUnlocked
        ? 'bg-green-100'
        : 'bg-gray-300'
    }`}
  >
    <Text className="text-2xl">
      🎮
    </Text>
  </View>

  <View className="flex-1">

    <Text
      className={`text-base font-bold ${
        isGamificationUnlocked
          ? 'text-gray-900'
          : 'text-gray-500'
      }`}
    >
      Spin & Win
    </Text>

    <Text
      className={`mt-1 ${
        isGamificationUnlocked
          ? 'text-gray-500'
          : 'text-gray-400'
      }`}
    >
      {isGamificationUnlocked
        ? 'Earn exciting rewards'
        : `Unlock at 600 points (${rewardPoints}/600)`}
    </Text>

  </View>

  {!isGamificationUnlocked ? (

    <View className="bg-amber-100 px-3 py-1 rounded-full">

      <Text className="text-amber-700 text-xs font-bold">
        LOCKED
      </Text>

    </View>

  ) : (

    <View className="bg-gray-100 rounded-full w-8 h-8 items-center justify-center">

      <Text className="text-gray-600">
        ›
      </Text>

    </View>

  )}

</TouchableOpacity>
      {/* Transactions */}
      <TouchableOpacity
        className="bg-white rounded-3xl p-5 shadow-md border border-gray-100 mb-8 flex-row items-center"
        onPress={() =>
          navigation.navigate(
            'TransactionHistory'
          )
        }
      >

        <View className="w-14 h-14 bg-orange-100 rounded-full items-center justify-center mr-4">
          <Text className="text-2xl">
            📊
          </Text>
        </View>

        <View className="flex-1">
          <Text className="text-gray-900 text-base font-bold">
            Transaction History
          </Text>

          <Text className="text-gray-500">
            View all transactions
          </Text>
        </View>

        <View className="bg-gray-100 rounded-full w-8 h-8 items-center justify-center">
          <Text className="text-gray-600">
            ›
          </Text>
        </View>

      </TouchableOpacity>

    </View>

  </ScrollView>
</View>
  )
};


export default HomeScreen;
