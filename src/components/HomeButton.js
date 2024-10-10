import React from 'react';
import {
  Text,
  Pressable,
  View,
} from 'react-native';
import { colors, textStyles } from '../styles/globalStyle';
import AlarmIcon from '../assets/icons/AlarmIcon.svg';
const HomeButton = ({title, onPress, disabled = false, style, textStyle}) => {
  return (
    <Pressable
      style={({pressed}) => [
        {
          paddingHorizontal: 16,
          paddingVertical: 10,
          backgroundColor: disabled
            ? colors.Gray02
            : pressed
            ? colors.Pressed_Green
            : colors.Button_Green,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 60,
          flexDirection: 'row',
        },
        style,
      ]}
      disabled={disabled}
      onPress={onPress}>
      <AlarmIcon/>
      <View style={{width: 8}}/>
      <Text
        style={[
          textStyles.M4,
          {color: disabled ? colors.Gray06 : colors.White},
          textStyle,
        ]}>
        {title}
      </Text>
    </Pressable>
  );
};

export default HomeButton;
