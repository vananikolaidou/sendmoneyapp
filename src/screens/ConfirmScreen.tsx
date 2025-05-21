import React from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { sendMoney } from '../../api/mockApi';
import { useBalance } from '../../context/BalanceContext';
import { useTheme } from '../../context/ThemeContext';

const ConfirmScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { recipient, amount } = route.params;
  const { deductBalance } = useBalance();
  const colorScheme = useColorScheme();
  const { isDark } = useTheme();
  const styles = getStyles(isDark);

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
    <View style={styles.container}>
      <Text style={styles.title}>Confirm Transfer</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Recipient:</Text>
        <Text style={styles.value}>{recipient}</Text>

        <Text style={styles.label}>Amount:</Text>
        <Text style={styles.value}>${amount}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Confirm & Send"
          onPress={handleSend}
          color={isDark ? '#4f46e5' : '#4f46e5'}
        />
      </View>
    </View>
  );
};

export default ConfirmScreen;

const getStyles = (isDark) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#1a1a1a' : '#f2f4f8',
      justifyContent: 'center',
      padding: 24,
    },
    title: {
      fontSize: 26,
      fontWeight: 'bold',
      color: isDark ? '#fff' : '#1a1a1a',
      marginBottom: 32,
      textAlign: 'center',
    },
    card: {
      backgroundColor: isDark ? '#2c2c2e' : '#fff',
      borderRadius: 16,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
      marginBottom: 32,
    },
    label: {
      fontSize: 16,
      color: isDark ? '#aaa' : '#666',
      marginBottom: 4,
    },
    value: {
      fontSize: 20,
      fontWeight: '600',
      color: isDark ? '#fff' : '#000',
      marginBottom: 16,
    },
    buttonContainer: {
      borderRadius: 8,
      overflow: 'hidden',
    },
  });