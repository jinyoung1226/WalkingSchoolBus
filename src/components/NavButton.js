import React, { cloneElement } from 'react';
import { Text, Pressable, Image, StyleSheet } from 'react-native';
import { colors, textStyles } from '../styles/globalStyle';

const NavButton = ({ title, onPress, textStyle, image }) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: pressed ? '#F2FEF9' : colors.Gray02,
          borderWidth: pressed ? 2 : undefined,
          borderColor: pressed ? colors.Main_Green : undefined,

        },
      ]}
    >
      {image}
      <Text style={[textStyles.M1, {paddingTop: 16}]}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    flexDirection: 'column',
    width: 149,
    height: 173,
  },
  image: {
    width: 85,
    height: 85,
  },
});

export default NavButton;
