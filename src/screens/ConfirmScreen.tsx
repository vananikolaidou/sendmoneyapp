import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { sendMoney, SendMoneyResult } from '../../api/mockApi';
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
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    setLoading(true);
    try {
      const result: SendMoneyResult = await sendMoney(recipient, amount);
      if (result.success) {
        deductBalance(amount);
      }
      navigation.navigate('Success', {
        success: result.success,
        message: result.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container} accessible={true}
      accessibilityLabel="Confirm Transfer Screen"
      accessibilityHint="Review the transfer details and confirm to send money">
      <Text style={styles.title} accessibilityRole="header"
        accessibilityLabel="Confirm Transfer">Confirm Transfer</Text>
      <View style={styles.card} accessibilityRole="summary"
        accessibilityLabel="Transfer details">
        <Text style={styles.label}>Recipient:</Text>
        <Text style={styles.value} accessibilityLabel={`Recipient account or phone number: ${recipient}`}>{recipient}</Text>
        <Text style={styles.label}>Amount:</Text>
        <Text style={styles.value} accessibilityLabel={`Amount to send: €${amount}`}>€{amount}</Text>
      </View>
      <TouchableOpacity
        onPress={handleSend}
        disabled={loading}
        accessibilityLabel="Confirm and send money"
        accessibilityState={{ busy: loading }}
        style={[styles.button, loading ? styles.buttonDisabled : null]}
      >
        {loading ? (
          <>
            <ActivityIndicator size="small" color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.buttonText}>Sending...</Text>
          </>
        ) : (
          <Text style={styles.buttonText}>Confirm & Send</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default ConfirmScreen;

const getStyles = (isDark: boolean) =>
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
    button: {
      flexDirection: 'row',
      backgroundColor: '#4f46e5',
      borderRadius: 12,
      paddingVertical: 14,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonDisabled: {
      opacity: 0.7,
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: '600',
    },
  });