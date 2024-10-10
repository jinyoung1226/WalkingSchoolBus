import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {colors, textStyles} from '../styles/globalStyle';
import BackIcon from '../assets/icons/BackIcon.svg';
import MapIcon from '../assets/icons/MapIcon.svg';
import { useNavigation } from '@react-navigation/native';

const ShuttleHeader = ({title, subTitle}) => {

  const navigation = useNavigation();

  return (
    <View style={{flexDirection:'row', alignItems:'center'}}>
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}
        style={{padding:16}}>
        <BackIcon />
      </TouchableOpacity>
      <View style={{alignItems: 'center', paddingVertical:8, flex:1}}>
        <Text style={[textStyles.B1, {color: colors.Black, textAlign:'center'}]}>
          {title}
        </Text>
        <View style={{height: 4}} />
        <Text style={[textStyles.B2, {color: colors.Black}]}>
          {subTitle}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('ShuttleMap');
        }}
        style={{padding:16}}>
        <MapIcon />
      </TouchableOpacity>
    </View>
  );
};

export default ShuttleHeader;