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
import { StatusBar } from 'react-native';

export type RootStackParamList = {
  Register: undefined;
  Login: undefined;
  Homepage: undefined;
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
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
        hidden={false}
      />
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Homepage" screenOptions={{
          headerStyle: {
            backgroundColor: '#4f46e5', 
          },
          headerTintColor: '#fff', 
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}>
          {/* <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Login" component={LoginScreen} /> */}
          <Stack.Screen name="Homepage" component={HomeScreen} />
          <Stack.Screen name="SendMoney" component={SendMoneyScreen} />
          <Stack.Screen name="Confirm" component={ConfirmScreen} />
          <Stack.Screen name="Success" component={SuccessScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </BalanceProvider>
  );
};

export default App;