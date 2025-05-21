import React from 'react';
import Slider from '@react-native-community/slider';
import { View, Text, StyleSheet } from 'react-native';

const AmountSlider = ({ value, onChange, max = 1000, isDark = false }) => {
  const styles = getStyles(isDark);

  return (
    <View>
      <Text style={styles.label}>Amount: €{value}</Text>
      <Slider
        minimumValue={0}
        maximumValue={max}
        value={value}
        step={1}
        onValueChange={onChange}
        minimumTrackTintColor={isDark ? '#81b0ff' : '#1FB28A'}
        maximumTrackTintColor={isDark ? '#555' : '#d3d3d3'}
        thumbTintColor={isDark ? '#f5dd4b' : '#1FB28A'}
      />
    </View>
  );
};

const getStyles = (isDark) =>
  StyleSheet.create({
    label: {
      marginBottom: 10,
      color: isDark ? '#fff' : '#000',
      fontWeight: '600',
      fontSize: 16,
    },
  });

export default AmountSlider;