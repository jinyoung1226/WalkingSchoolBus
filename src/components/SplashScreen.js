import React from 'react';
import {View} from 'react-native';
import MainLogo from '../assets/icons/MainLogo';
import MainText from '../assets/icons/MainText';
import { colors, textStyles } from '../styles/globalStyle';

const SplashScreen = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.white,
      }}>
      <View style={{flex: 1}}/>
      <MainLogo />
      <View style={{flex: 1}}>
        <View style={{flex:1}}/>
        <MainText />
        <View style={{flex:5}}/>
      </View>
    </View>
  );
};

export default SplashScreen;
