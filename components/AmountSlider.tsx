import React from 'react';
import Slider from '@react-native-community/slider';
import { View, Text, StyleSheet } from 'react-native';

const AmountSlider = ({ value, onChange, isDark = false }) => {
  const styles = getStyles(isDark);

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: isDark ? '#fff' : '#333' }]}>
        Amount: €{value.toFixed(1)}
      </Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={1000}
        step={0.1}
        minimumTrackTintColor="#4f46e5"
        maximumTrackTintColor={isDark ? '#444' : '#ccc'}
        thumbTintColor="#4f46e5"
        value={value}
        onValueChange={onChange}
      />
    </View>
  );
};

const getStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      marginVertical: 24,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 8,
    },
    slider: {
      width: '100%',
      height: 40,
    },
  });

export default AmountSlider;