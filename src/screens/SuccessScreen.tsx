import React from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const SuccessScreen = ({ route, navigation }) => {
  const { success, message } = route.params;
  const colorScheme = useColorScheme();
  const { isDark } = useTheme();
  const styles = getStyles(isDark);

  return (
    <View style={styles.container}>
      <Text style={styles.status}>{success ? '✅ Success' : '❌ Failed'}</Text>
      <Text style={styles.message}>{message}</Text>

      <View style={styles.buttonContainer}>
        <Button
          title="Back to Home"
          onPress={() => navigation.popToTop()}
          color={isDark ? '#4f46e5' : '#4f46e5'}
        />
      </View>
    </View>
  );
};

export default SuccessScreen;

const getStyles = (isDark) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#1a1a1a' : '#f2f4f8',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
    },
    status: {
      fontSize: 28,
      fontWeight: 'bold',
      color: isDark ? '#fff' : '#1a1a1a',
      marginBottom: 16,
    },
    message: {
      fontSize: 16,
      color: isDark ? '#cccccc' : '#555555',
      marginBottom: 32,
      textAlign: 'center',
    },
    buttonContainer: {
      width: '100%',
      borderRadius: 8,
      overflow: 'hidden',
    },
  });