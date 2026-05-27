import "./global.css";


import { NavigationContainer } from '@react-navigation/native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Provider } from 'react-redux';

import { store } from './app/store/store';

import LoginScreen from './app/screens/LoginScreen';

import SignupScreen from './app/screens/SignupScreen';

import HomeScreen from './app/screens/HomeScreen';

import BillPaymentsScreen from './app/screens/BillPayments/BillPaymentsScreen';

import MobileRechargeScreen from './app/screens/MobileRechargeScreen';

import CreditCardPaymentScreen from './app/screens/CreditCardPaymentScreen';

import PaymentSuccessScreen from './app/screens/PaymentSuccessScreen';

import TransactionHistoryScreen from './app/screens/TransactionHistoryScreen';

import RedeemRewards from './app/screens/BillPayments/tabs/RedeemRewards';

import Electricity from './app/screens/BillPayments/tabs/Electricity';
import ElectricityBillDetails from './app/screens/BillPayments/tabs/ElectricityBillDetails';
import WalletRecharge from './app/screens/BillPayments/tabs/WalletRecharge';
import GamificationScreen from './app/screens/GamificationScreen';

const Stack = createNativeStackNavigator();



const App = () => {

  return (

    <Provider store={store}>

      <NavigationContainer>

        <Stack.Navigator initialRouteName="Login">

          <Stack.Screen 

            name="Login" 

            component={LoginScreen}

            options={{ headerShown: false }}

          />

          <Stack.Screen 

            name="Signup" 

            component={SignupScreen}

            options={{ headerShown: false }}

          />

          <Stack.Screen 

            name="Home" 

            component={HomeScreen}

            options={{ title: 'Wallet Rewards', headerShown: true }}

          />

          <Stack.Screen 

            name="GamificationScreen" 

            component={GamificationScreen}

            options={{ title: 'Gamification', headerShown: true }}

          />

          <Stack.Screen 

            name="BillPayments" 

            component={BillPaymentsScreen}

            options={{ title: 'Bill Payments', headerShown: false }}

          />

          <Stack.Screen 

            name="MobileRecharge" 

            component={MobileRechargeScreen}

            options={{ title: 'Mobile Recharge', headerShown: false }}

          />

          <Stack.Screen 

            name="CreditCardPayment" 

            component={CreditCardPaymentScreen}

            options={{ title: 'Credit Card Payment', headerShown: false }}

          />

          <Stack.Screen 

            name="PaymentSuccess" 

            component={PaymentSuccessScreen}

            options={{ title: 'Payment Success', headerShown: false }}

          />

          <Stack.Screen 

            name="TransactionHistory" 

            component={TransactionHistoryScreen}

            options={{ title: 'Transaction History', headerShown: false }}

          />

          <Stack.Screen 

            name="RedeemRewards" 

            component={RedeemRewards}

            options={{ title: 'Rewards Points', headerShown: false }}

          />

          <Stack.Screen
  name="Electricity"
  component={Electricity}
  options={{
    title: 'Electricity',
    headerShown: true,
  }}
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
  name="WalletRecharge"
  component={WalletRecharge}
  options={{
    title: 'Wallet Recharge',
    headerShown: true,
  }}
/>
        </Stack.Navigator>

      </NavigationContainer>

    </Provider>

  );

};



export default App;

