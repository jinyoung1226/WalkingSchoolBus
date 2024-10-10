import React from 'react';
import {
  Text,
  Pressable,
} from 'react-native';
import { colors, textStyles } from '../styles/globalStyle';

const CustomButton = ({title, onPress, disabled = false, style, textStyle, type = 'confirm'}) => {
  
  const buttonContainerStyle = ({pressed, disabled}) => {
    switch (type) {
      case 'confirm':
        return {
          backgroundColor: disabled ? colors.Gray02 : pressed ? colors.Pressed_Green : colors.Button_Green,
        };
      case 'cancel':
        return {
          backgroundColor: pressed? colors.Gray03 : colors.Gray02,
        };
    }
  };

  const buttonTextStyle = ({disabled}) => {
    switch (type) {
      case 'confirm':
        return {
          color: disabled ? colors.Gray06 : colors.White,
        };
      case 'cancel':
        return {
          color: colors.Gray07,
        };
    }
  }
  return (
    <Pressable
      style={({pressed}) => [
        {
          height: 50,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 10,
        },
        buttonContainerStyle({pressed, disabled}),
        style
      ]}
      disabled={disabled}
      onPress={onPress}>
      {({pressed}) => (
        <Text
          style={[
            textStyles.SB1,
            buttonTextStyle({disabled}),
            textStyle,
          ]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
};

export default CustomButton;
