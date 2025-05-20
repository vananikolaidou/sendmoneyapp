import React from 'react';
import Slider from '@react-native-community/slider';
import { View, Text } from 'react-native';

const AmountSlider = ({ value, onChange, max = 1000 }) => {
  return (
    <View>
      <Text style={{ marginBottom: 10 }}>Amount: ${value}</Text>
      <Slider
        minimumValue={0}
        maximumValue={max}
        value={value}
        step={1}
        onValueChange={onChange}
        minimumTrackTintColor="#1FB28A"
        maximumTrackTintColor="#d3d3d3"
        thumbTintColor="#1FB28A"
      />
    </View>
  );
};

export default AmountSlider;