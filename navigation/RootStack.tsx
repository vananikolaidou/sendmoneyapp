import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../src/screens/HomeScreen';
import SendMoneyScreen from '../src/screens/SendMoneyScreen';
import ConfirmScreen from '../src/screens/ConfirmScreen';
import SuccessScreen from '../src/screens/SuccessScreen';
import { BalanceProvider } from '../context/BalanceContext';
import LoginScreen from '../src/screens/LoginScreen';
import RegisterScreen from '../src/screens/RegisterScreen';

export type RootStackParamList = {
  Register: undefined;
  Login: undefined;
  Home: undefined;
  SendMoney: undefined;
  Confirm: {
    recipient: string;
    amount: number;
  };
  Success: {
    success: boolean;
    message: string;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <BalanceProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          {/* <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Login" component={LoginScreen} /> */}
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="SendMoney" component={SendMoneyScreen} />
          <Stack.Screen name="Confirm" component={ConfirmScreen} />
          <Stack.Screen name="Success" component={SuccessScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </BalanceProvider>
  );
};

export default App;