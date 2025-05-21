import React from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import InputField from '../../components/InputField';
import AmountSlider from '../../components/AmountSlider';
import { useBalance } from '../../context/BalanceContext';
import { useTheme } from '../../context/ThemeContext';

const phoneRegex = /^(\+?\d{1,3})?\d{10,14}$/;
const ibanRegex = /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/;

const schema = z.object({
  recipient: z
    .string()
    .min(5)
    .refine((val) => phoneRegex.test(val) || ibanRegex.test(val), {
      message: 'Enter a valid phone number or IBAN',
    }),
  amount: z
    .number({ invalid_type_error: 'Amount must be a number' })
    .positive({ message: 'Amount must be greater than 0' }),
});

const SendMoneyScreen = ({ navigation }) => {
  const { balance } = useBalance();
  const colorScheme = useColorScheme();
  const { isDark } = useTheme();
  const styles = getStyles(isDark);

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

  const onSubmit = (data) => {
    if (data.amount > balance) {
      alert('Insufficient balance');
      return;
    }
    navigation.navigate('Confirm', data);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Send Money</Text>

      <InputField
        name="recipient"
        control={control}
        placeholder="IBAN or phone number"
        style={styles.input}
        placeholderTextColor={isDark ? '#ccc' : '#888'}
      />

      <Controller
        name="amount"
        control={control}
        render={({ field: { value, onChange } }) => (
          <AmountSlider
            value={value}
            onChange={(val) => {
              onChange(val);
              setValue('amount', val, { shouldValidate: true });
            }}
            isDark={isDark}
          />
        )}
      />

      {errors.recipient && <Text style={styles.errorText}>{errors.recipient.message}</Text>}
      {errors.amount && <Text style={styles.errorText}>{errors.amount.message}</Text>}

      <View style={styles.buttonContainer}>
        <Button
          title="Next"
          onPress={handleSubmit(onSubmit)}
          color={isDark ? '#4f46e5' : '#4f46e5'}
        />
      </View>
    </View>
  );
};

export default SendMoneyScreen;

const getStyles = (isDark) =>
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
    errorText: {
      color: '#ff4d4f',
      marginBottom: 12,
      fontWeight: '600',
    },
    buttonContainer: {
      marginTop: 20,
      borderRadius: 8,
      overflow: 'hidden', // to make button's borderRadius work on Android
    },
  });