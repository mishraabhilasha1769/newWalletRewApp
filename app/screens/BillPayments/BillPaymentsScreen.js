
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';



export default function BillPaymentsScreen({ navigation }) {

  const services = [

    {

      id: 'mobile',

      title: 'Mobile Recharge',

      icon: '📱',

      description: 'Recharge prepaid mobile',

      color: 'bg-blue-100',

      iconColor: 'text-blue-600'

    },

    {

      id: 'electricity',

      title: 'Electricity Bill',

      icon: '⚡',

      description: 'Pay electricity bills',

      color: 'bg-yellow-100',

      iconColor: 'text-yellow-600'

    },

    {

      id: 'pay',

      title: 'Send Money',

      icon: '💸',

      description: 'Transfer to anyone',

      color: 'bg-green-100',

      iconColor: 'text-green-600'

    },

    {

      id: 'rewards',

      title: 'Rewards Points',

      icon: '🏆',

      description: 'View and redeem rewards',

      color: 'bg-purple-100',

      iconColor: 'text-purple-600'

    },

    {

      id: 'wallet',

      title: 'Add Money',

      icon: '💰',

      description: 'Load wallet balance',

      color: 'bg-purple-100',

      iconColor: 'text-purple-600'

    },

    {

      id: 'rewards',

      title: 'Rewards',

      icon: '🎁',

      description: 'Redeem points',

      color: 'bg-pink-100',

      iconColor: 'text-pink-600'

    },

    {

      id: 'dth',

      title: 'DTH Recharge',

      icon: '📺',

      description: 'TV recharge',

      color: 'bg-orange-100',

      iconColor: 'text-orange-600'

    }

  ];



  return (

    <View className="flex-1 bg-gray-50">

      {/* Header */}

      <View className="bg-white px-5 pt-12 pb-6 shadow-sm">

        <Text className="text-gray-900 text-2xl font-bold">Bill Payments</Text>

        <Text className="text-gray-600 text-sm mt-1">Pay bills and manage your finances</Text>

      </View>



      

      {/* Services Grid */}

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>

        <Text className="text-gray-900 text-lg font-semibold mb-4">All Services</Text>

        

        {/* Row 1 */}

        <View className="flex-row gap-4 mb-4">

          <TouchableOpacity 

            className="flex-1 bg-white rounded-xl p-4 shadow-sm border border-gray-100"

            onPress={() => navigation.navigate('MobileRecharge')}

          >

            <View className="bg-blue-100 w-12 h-12 rounded-full items-center justify-center mb-3">

              <Text className="text-blue-600">📱</Text>

            </View>

            <Text className="text-gray-900 font-semibold text-sm mb-1">Mobile Recharge</Text>

            <Text className="text-gray-500 text-xs">Recharge prepaid mobile</Text>

          </TouchableOpacity>

          

          <TouchableOpacity className="flex-1 bg-white rounded-xl p-4 shadow-sm border border-gray-100">

            <View className="bg-yellow-100 w-12 h-12 rounded-full items-center justify-center mb-3">

              <Text className="text-yellow-600">⚡</Text>

            </View>

            <Text className="text-gray-900 font-semibold text-sm mb-1">Electricity Bill</Text>

            <Text className="text-gray-500 text-xs">Pay electricity bills</Text>

          </TouchableOpacity>

        </View>



        {/* Row 2 */}

        <View className="flex-row gap-4 mb-4">

          <TouchableOpacity className="flex-1 bg-white rounded-xl p-4 shadow-sm border border-gray-100">

            <View className="bg-green-100 w-12 h-12 rounded-full items-center justify-center mb-3">

              <Text className="text-green-600">💸</Text>

            </View>

            <Text className="text-gray-900 font-semibold text-sm mb-1">Send Money</Text>

            <Text className="text-gray-500 text-xs">Transfer to anyone</Text>

          </TouchableOpacity>

          

          <TouchableOpacity className="flex-1 bg-white rounded-xl p-4 shadow-sm border border-gray-100">

            <View className="bg-purple-100 w-12 h-12 rounded-full items-center justify-center mb-3">

              <Text className="text-purple-600">💰</Text>

            </View>

            <Text className="text-gray-900 font-semibold text-sm mb-1">Add Money</Text>

            <Text className="text-gray-500 text-xs">Load wallet balance</Text>

          </TouchableOpacity>

        </View>



        {/* Row 3 */}

        <View className="flex-row gap-4 mb-8">

          <TouchableOpacity 

            className="flex-1 bg-white rounded-xl p-4 shadow-sm border border-gray-100"

            onPress={() => navigation.navigate('RewardsPoints')}

          >

            <View className="bg-purple-100 w-12 h-12 rounded-full items-center justify-center mb-3">

              <Text className="text-purple-600">�</Text>

            </View>

            <Text className="text-gray-900 font-semibold text-sm mb-1">Rewards Points</Text>

            <Text className="text-gray-500 text-xs">Redeem points</Text>

          </TouchableOpacity>

          

          <TouchableOpacity className="flex-1 bg-white rounded-xl p-4 shadow-sm border border-gray-100">

            <View className="bg-orange-100 w-12 h-12 rounded-full items-center justify-center mb-3">

              <Text className="text-orange-600">📺</Text>

            </View>

            <Text className="text-gray-900 font-semibold text-sm mb-1">DTH Recharge</Text>

            <Text className="text-gray-500 text-xs">TV recharge</Text>

          </TouchableOpacity>

        </View>

      </ScrollView>

    </View>

  );

}

