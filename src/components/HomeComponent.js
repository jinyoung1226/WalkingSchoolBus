import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { colors, textStyles } from '../styles/globalStyle';
import ArrowIcon from '../assets/icons/ArrowIcon';

const HomeComponent = ({title, children, onPress}) => {
  return (
    <View style={{paddingHorizontal:16, paddingVertical:24, backgroundColor: colors.White_Green, borderRadius: 10, elevation:5}}>
      <View style={{flexDirection:'row', alignItems:'center'}}>
        <Text style={[textStyles.SB2, {color: colors.Black}]}>
          {title}
        </Text>
        <View style={{flex:1}}/>
        <TouchableOpacity 
          style={{flexDirection:'row', alignItems:'center'}}
          onPress={onPress}>
          <Text style={[textStyles.M5, {color: colors.Gray06}]}>
            {'전체보기'}
          </Text>
          <View style={{width: 8}}/>
          <ArrowIcon/>
        </TouchableOpacity>
      </View>
      {children}
    </View>
  );
}

export default HomeComponent;