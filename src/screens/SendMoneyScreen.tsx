import React from 'react';
import { View, Button, Text } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import InputField from '../../components/InputField';
import AmountSlider from '../../components/AmountSlider';
import { useBalance } from '../../context/BalanceContext';

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

  const watchedAmount = watch('amount');

  const onSubmit = (data) => {
    if (data.amount > balance) {
      alert('Insufficient balance');
      return;
    }
    navigation.navigate('Confirm', data);
  };

  return (
    <View style={{ padding: 16 }}>
      <InputField
        name="recipient"
        control={control}
        placeholder="IBAN or phone number"
      />
      <Controller
        name="amount"
        control={control}
        render={({ field: { value, onChange } }) => (
          <AmountSlider value={value} onChange={(val) => {
            onChange(val);
            setValue('amount', val, { shouldValidate: true });
          }} />
        )}
      />

      {errors.recipient && <Text style={{ color: 'red' }}>{errors.recipient.message}</Text>}
      {errors.amount && <Text style={{ color: 'red' }}>{errors.amount.message}</Text>}

      <Button title="Next" onPress={handleSubmit(onSubmit)} />
    </View>
  );
};

export default SendMoneyScreen;