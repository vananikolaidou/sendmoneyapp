import React from 'react';
import { View, Button } from 'react-native';

const HomeScreen = ({ navigation }) => (
  <View style={{ flex: 1, justifyContent: 'center' }}>
    <Button title="Send Money" onPress={() => navigation.navigate('SendMoney')} />
  </View>
);

export default HomeScreen;