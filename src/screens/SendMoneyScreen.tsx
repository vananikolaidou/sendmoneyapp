import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  useColorScheme,
  TextInput,
  Animated,
  Easing,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import AmountSlider from '../../components/AmountSlider';
import { useBalance } from '../../context/BalanceContext';
import { useTheme } from '../../context/ThemeContext';

const phoneRegex = /^(\+?\d{1,3})?\d{10,14}$/;
const ibanRegex = /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/;

const schema = z.object({
  recipient: z
    .string()
    .min(5, { message: 'Please enter an IBAN or phone number to continue.' })
    .refine(
      (val) =>
        phoneRegex.test(val) || ibanRegex.test(val),
      { message: 'Enter a valid phone number or IBAN' }
    ),
  amount: z
    .preprocess((val) => Number(val), z.number())
    .refine((val) => val > 0, { message: 'Amount must be greater than 0.' })
    .refine((val) => /^\d+(\.\d)?$/.test(val.toString())),
});

const SendMoneyScreen = ({ navigation }) => {
  const { balance } = useBalance();
  const colorScheme = useColorScheme();
  const { isDark } = useTheme();
  const styles = getStyles(isDark);
  const [bannerMessage, setBannerMessage] = useState('');
  const bannerOpacity = useRef(new Animated.Value(0)).current;
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      recipient: '',
      amount: 0,
    },
  });

  const formatRecipientInput = (input: string) => {
    let value = input.replace(/\s+/g, '').toUpperCase();
    if (/^69\d{8}$/.test(value)) {
      value = '+30' + value;
    }
    if (value.length === 27 && !value.startsWith('GR')) {
      value = 'GR' + value.slice(0, 25);
    }
    return value;
  };

  const showBanner = (msg: string) => {
    setBannerMessage(msg);
    Animated.sequence([
      Animated.timing(bannerOpacity, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.delay(5000),
      Animated.timing(bannerOpacity, {
        toValue: 0,
        duration: 300,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const onValidSubmit = (data) => {
    if (data.amount > balance) {
      showBanner('Insufficient balance');
      return;
    }
    navigation.navigate('Confirm', data);
  };

  const onInvalid = (formErrors) => {
    const firstError = formErrors.recipient?.message || formErrors.amount?.message;
    if (firstError) showBanner(firstError);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title} accessibilityRole="header"
        accessible={true}>Send Money</Text>
      <Controller
        name="recipient"
        control={control}
        render={({ field: { value, onChange } }) => (
          <TextInput
            value={value}
            onChangeText={(text) => {
              const formatted = formatRecipientInput(text);
              onChange(formatted);
            }}
            placeholder="IBAN or phone number"
            style={styles.input}
            placeholderTextColor={isDark ? '#ccc' : '#888'}
            autoCapitalize="characters"
            keyboardType="default"
            accessible={true}
            accessibilityLabel="Recipient"
            accessibilityHint="Enter an IBAN or phone number to send money to"
            accessibilityState={{ invalid: !!errors.recipient }}
          />
        )}
      />
      <Controller
        name="amount"
        control={control}
        render={({ field: { value, onChange } }) => (
          <AmountSlider
            value={value}
            onChange={(val: number) => {
              const rounded = Math.round(val * 10) / 10;
              onChange(rounded);
              setValue('amount', rounded, { shouldValidate: true });
            }}
            isDark={isDark}
            accessible={true}
            accessibilityLabel="Amount"
            accessibilityHint="Slide to select the amount of money to send"
            accessibilityState={{ invalid: !!errors.amount }}
          />
        )}
      />
      <View style={styles.buttonContainer}>
        <Button
          title="Next"
          onPress={handleSubmit(onValidSubmit, onInvalid)}
          color={isDark ? '#4f46e5' : '#4f46e5'}
          accessibilityLabel="Next"
        />
      </View>
      <Animated.View
        style={[
          styles.banner,
          {
            opacity: bannerOpacity,
            transform: [
              {
                translateY: bannerOpacity.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
            ],
          },
        ]}
        accessibilityLiveRegion="polite"
      >
        <View style={styles.bannerContent}>
          <Text style={styles.bannerIcon}>⚠️</Text>
          <Text style={styles.bannerText}>{bannerMessage}</Text>
        </View>
      </Animated.View>
    </View>
  );
};

export default SendMoneyScreen;

const getStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#1a1a1a' : '#f2f4f8',
      padding: 24,
      justifyContent: 'center',
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: isDark ? '#fff' : '#1a1a1a',
      marginBottom: 32,
      textAlign: 'center',
    },
    input: {
      height: 50,
      borderColor: isDark ? '#555' : '#ccc',
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 16,
      color: isDark ? '#fff' : '#000',
      marginBottom: 16,
      backgroundColor: isDark ? '#2c2c2e' : '#fff',
    },
    banner: {
      position: 'absolute',
      bottom: 30,
      left: 20,
      right: 20,
      backgroundColor: '#4f46e5',
      padding: 12,
      borderRadius: 8,
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
    },
    bannerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    bannerIcon: {
      fontSize: 18,
      marginRight: 8,
    },
    bannerText: {
      color: '#fff',
      textAlign: 'center',
      fontWeight: '600',
    },
    buttonContainer: {
      marginTop: 20,
      borderRadius: 8,
      overflow: 'hidden',
    },
  });