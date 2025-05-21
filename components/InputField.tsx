// InputField.js
import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { Controller } from 'react-hook-form';

const InputField = ({ name, control, placeholder, style, placeholderTextColor }) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value } }) => (
        <TextInput
          style={[styles.input, style]}
          onBlur={onBlur}
          onChangeText={onChange}
          value={value}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});

export default InputField;