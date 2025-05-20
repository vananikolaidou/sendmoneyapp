// screens/LoginScreen.tsx
import React from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import InputField from '../../components/InputField';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email' }),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const LoginScreen = ({ navigation }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    if (data.email === 'test@example.com' && data.password === 'password') {
      navigation.replace('Home');
    } else {
      Alert.alert('Login Failed', 'Incorrect email or password');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <InputField name="email" control={control} placeholder="Email" keyboardType="email-address" />
      <InputField name="password" control={control} placeholder="Password" secureTextEntry />

      {errors.email && <Text style={{ color: 'red' }}>{errors.email.message}</Text>}
      {errors.password && <Text style={{ color: 'red' }}>{errors.password.message}</Text>}

      <Button title="Login" onPress={handleSubmit(onSubmit)} />
    </View>
  );
};

export default LoginScreen;