import React from 'react';
import { Controller } from 'react-hook-form';
import { TextInput, View, Text } from 'react-native';

const InputField = ({ name, control, placeholder, keyboardType = 'default' }) => (
  <Controller
    control={control}
    name={name}
    render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
      <View>
        <TextInput
          placeholder={placeholder}
          value={String(value)}
          onChangeText={onChange}
          onBlur={onBlur}
          keyboardType={keyboardType}
        />
        {error && <Text>{error.message}</Text>}
      </View>
    )}
  />
);

export default InputField;