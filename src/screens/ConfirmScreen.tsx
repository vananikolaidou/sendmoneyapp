import React from 'react';
import { View, Text, Button } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { sendMoney } from '../../api/mockApi';
import { useBalance } from '../../context/BalanceContext';

const ConfirmScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { recipient, amount } = route.params;
  const { deductBalance } = useBalance();

  const handleSend = async () => {
    const result = await sendMoney(recipient, amount);
    if (result.success) {
      deductBalance(amount);
    }
    navigation.navigate('Success', {
      success: result.success,
      message: result.message,
    });
  };

  return (
    <View>
      <Text>Send to: {recipient}</Text>
      <Text>Amount: ${amount}</Text>
      <Button title="Confirm & Send" onPress={handleSend} />
    </View>
  );
};

export default ConfirmScreen;