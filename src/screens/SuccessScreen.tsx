import React from 'react';
import { View, Text, Button } from 'react-native';

const SuccessScreen = ({ route, navigation }) => {
  const { success, message } = route.params;

  return (
    <View>
      <Text>{success ? '✅ Success' : '❌ Failed'}</Text>
      <Text>{message}</Text>
      <Button title="Back to Home" onPress={() => navigation.popToTop()} />
    </View>
  );
};

export default SuccessScreen;