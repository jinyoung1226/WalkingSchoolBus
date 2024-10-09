import React from 'react';
import {
  Text,
  Pressable,
} from 'react-native';
import { colors, textStyles } from '../styles/globalStyle';

const CustomButton = ({title, onPress, disabled = false, style, textStyle}) => {
  return (
    <Pressable
      style={({pressed}) => [
        {
          height: 50,
          backgroundColor: disabled
            ? colors.Gray02
            : pressed
            ? colors.Pressed_Green
            : colors.Button_Green,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 10,
        },
        style,
      ]}
      disabled={disabled}
      onPress={onPress}>
      {({pressed}) => (
        <Text
          style={[
            textStyles.SB1,
            {color: disabled ? colors.Gray06 : colors.white},
            textStyle,
          ]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
};

export default CustomButton;
