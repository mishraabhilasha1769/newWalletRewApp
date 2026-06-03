import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function BillPaymentsScreen({
  navigation,
}) {

  return (
    <View className="flex-1 bg-slate-100">

      {/* Header */}
      <View className="bg-indigo-600 px-5 pt-14 pb-10 rounded-b-[32px]">

        <Text className="text-white text-3xl font-bold">
          Bill Payments
        </Text>

        <Text className="text-indigo-100 text-base mt-2">
          Pay bills and manage your finances
        </Text>

      </View>

      {/* Banner */}
      <View className="mx-5 -mt-5 bg-amber-100 rounded-3xl p-5 shadow">

        <Text className="text-amber-900 text-lg font-bold">
          ⚡ Pay Bills & Earn Rewards
        </Text>

        <Text className="text-amber-700 mt-2">
          Complete transactions and collect reward points.
        </Text>

      </View>

      <ScrollView
        className="flex-1 px-5 mt-6"
        showsVerticalScrollIndicator={false}
      >

        <Text className="text-gray-900 text-xl font-bold mb-5">
          All Services
        </Text>

        {/* Row 1 */}
        <View className="flex-row gap-4 mb-4">

          <TouchableOpacity
            className="flex-1 bg-blue-50 rounded-3xl p-5 shadow-md"
            onPress={() =>
              navigation.navigate(
                'MobileRecharge'
              )
            }
          >

            <View className="bg-blue-500 w-14 h-14 rounded-full items-center justify-center mb-4">
              <Text className="text-2xl">
                📱
              </Text>
            </View>

            <Text className="text-gray-900 font-bold">
              Mobile Recharge
            </Text>

            <Text className="text-gray-500 mt-1">
              Recharge prepaid mobile
            </Text>

          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 bg-yellow-50 rounded-3xl p-5 shadow-md"
            onPress={() =>
              navigation.navigate(
                'Electricity'
              )
            }
          >

            <View className="bg-yellow-400 w-14 h-14 rounded-full items-center justify-center mb-4">
              <Text className="text-2xl">
                ⚡
              </Text>
            </View>

            <Text className="text-gray-900 font-bold">
              Electricity Bill
            </Text>

            <Text className="text-gray-500 mt-1">
              Pay electricity bills
            </Text>

          </TouchableOpacity>

        </View>

        {/* Row 2 */}
        <View className="flex-row gap-4 mb-4">

          <TouchableOpacity
            className="flex-1 bg-green-50 rounded-3xl p-5 shadow-md"
          >

            <View className="bg-green-500 w-14 h-14 rounded-full items-center justify-center mb-4">
              <Text className="text-2xl">
                💸
              </Text>
            </View>

            <Text className="text-gray-900 font-bold">
              Send Money
            </Text>

            <Text className="text-gray-500 mt-1">
              Transfer to anyone
            </Text>

          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 bg-violet-50 rounded-3xl p-5 shadow-md"
            onPress={() =>
              navigation.navigate(
                'WalletRecharge'
              )
            }
          >

            <View className="bg-violet-500 w-14 h-14 rounded-full items-center justify-center mb-4">
              <Text className="text-2xl">
                💰
              </Text>
            </View>

            <Text className="text-gray-900 font-bold">
              Add Money
            </Text>

            <Text className="text-gray-500 mt-1">
              Load wallet balance
            </Text>

          </TouchableOpacity>

        </View>

        {/* Row 3 */}
        <View className="flex-row gap-4 mb-8">

          <TouchableOpacity
            className="flex-1 bg-pink-50 rounded-3xl p-5 shadow-md"
            onPress={() =>
              navigation.navigate(
                'RedeemRewards'
              )
            }
          >

            <View className="bg-pink-500 w-14 h-14 rounded-full items-center justify-center mb-4">
              <Text className="text-2xl">
                🎁
              </Text>
            </View>

            <Text className="text-gray-900 font-bold">
              Rewards Points
            </Text>

            <Text className="text-gray-500 mt-1">
              Redeem rewards
            </Text>

          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 bg-orange-50 rounded-3xl p-5 shadow-md"
          >

            <View className="bg-orange-500 w-14 h-14 rounded-full items-center justify-center mb-4">
              <Text className="text-2xl">
                📺
              </Text>
            </View>

            <Text className="text-gray-900 font-bold">
              DTH Recharge
            </Text>

            <Text className="text-gray-500 mt-1">
              TV recharge
            </Text>

          </TouchableOpacity>

        </View>

      </ScrollView>

    </View>
  );
}