// components/InputField.tsx
import React from 'react';
import { Controller } from 'react-hook-form';
import { TextInput, View, Text } from 'react-native';

const InputField = ({
  name,
  control,
  placeholder,
  keyboardType = 'default',
  inputMode,
  parseValue = (val) => val,
}) => (
  <Controller
    control={control}
    name={name}
    render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
      <View style={{ marginBottom: 12 }}>
        <TextInput
          placeholder={placeholder}
          value={String(value)}
          onChangeText={(text) => onChange(parseValue(text))}
          onBlur={onBlur}
          keyboardType={keyboardType}
          inputMode={inputMode}
          style={{
            borderColor: '#ccc',
            borderWidth: 1,
            padding: 10,
            borderRadius: 6,
          }}
        />
        {error && <Text style={{ color: 'red' }}>{error.message}</Text>}
      </View>
    )}
  />
);

export default InputField;