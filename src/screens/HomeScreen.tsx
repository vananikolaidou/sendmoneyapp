import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Switch,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useBalance } from '../../context/BalanceContext';

const HomeScreen = ({ navigation }) => {
  const { isDark, toggleTheme } = useTheme();
  const { balance } = useBalance();
  const styles = getStyles(isDark);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Send money safely and easily</Text>

        <View style={styles.balanceCard}>
          <Text style={styles.cardLabel}>Your Balance</Text>
          <Text style={styles.cardAmount}>€{balance.toFixed(2)}</Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('SendMoney')}
        >
          <Text style={styles.buttonText}>Send Money</Text>
        </TouchableOpacity>
       <View style={styles.toggleContainer}>
          <Text style={styles.toggleLabel}>{isDark ? '🌙 Dark Mode' : '☀️ Light Mode'}</Text>
          <Switch
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isDark ? '#f5dd4b' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleTheme}
            value={isDark}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const getStyles = (isDark) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#1a1a1a' : '#f2f4f8',
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 24,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: isDark ? '#ffffff' : '#1a1a1a',
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: isDark ? '#cccccc' : '#555555',
      marginBottom: 32,
    },
    balanceCard: {
      backgroundColor: isDark ? '#2c2c2e' : '#ffffff',
      width: '100%',
      borderRadius: 16,
      padding: 20,
      marginBottom: 40,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    cardLabel: {
      fontSize: 14,
      color: isDark ? '#aaaaaa' : '#888888',
    },
    cardAmount: {
      fontSize: 24,
      fontWeight: '600',
      color: isDark ? '#ffffff' : '#1a1a1a',
      marginTop: 8,
    },
    button: {
      backgroundColor: '#4f46e5',
      paddingVertical: 16,
      paddingHorizontal: 32,
      borderRadius: 12,
    },
    buttonText: {
      color: '#ffffff',
      fontSize: 18,
      fontWeight: '600',
    },
    toggleContainer: {
      marginTop: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '50%',
    },
    toggleLabel: {
      fontSize: 16,
      color: isDark ? '#fff' : '#333',
    },
  });