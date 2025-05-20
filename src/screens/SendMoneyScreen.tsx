import React from 'react';
import { View, Button, Text } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import InputField from '../../components/InputField';
import { useBalance } from '../../context/BalanceContext';

const schema = z.object({
  recipient: z.string().min(5),
  amount: z.number().positive(),
});

const SendMoneyScreen = ({ navigation }) => {
  const { balance } = useBalance();

  const {
    control,
    handleSubmit,
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
    <View>
      <InputField name="recipient" control={control} placeholder="IBAN or phone" />
      <InputField name="amount" control={control} placeholder="Amount" keyboardType="numeric" />
      {errors.amount && <Text>{errors.amount.message}</Text>}
      <Button title="Next" onPress={handleSubmit(onSubmit)} />
    </View>
  );
};

export default SendMoneyScreen;