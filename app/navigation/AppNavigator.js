import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Electricity from '../screens/BillPayments/tabs/Electricity';
import ElectricityBillDetails from '../screens/BillPayments/tabs/ElectricityBillDetails';
import RedeemRewards from '../screens/BillPayments/tabs/RedeemRewards';
import HomeScreen from '../screens/HomeScreen';
const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'Wallet Rewards' }}
      />
      {/* Add more screens here */}
    <Stack.Screen
  name="Electricity"
  component={Electricity}
  options={{ title: 'Electricity' }}
/>
<Stack.Screen
name ="ElectricityBillDetails"
component={ElectricityBillDetails}
options={{
  title: 'Electricity Bill Details',
  headerShown: true,
}}
/>
<Stack.Screen
  name="RedeemRewards"
  component={RedeemRewards}
  options={{ title: 'Redeem Rewards', headerShown: true }}
/>
  
    </Stack.Navigator>
  
  );

};


export default AppNavigator;
