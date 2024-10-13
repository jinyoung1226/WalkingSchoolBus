import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {colors, textStyles} from '../styles/globalStyle';
import BackIcon from '../assets/icons/BackIcon.svg';
import MapIcon from '../assets/icons/MapIcon.svg';
import { useNavigation } from '@react-navigation/native';

const CustomHeader = ({
  title, 
  subtitle, 
  onPressRightButton,
  headerRight
}) => {

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
      <View style={{alignItems: 'center', paddingVertical:8, gap:4, flex:1}}>
        <Text style={[textStyles.B1, {color: colors.Black, textAlign:'center'}]}>
          {title}
        </Text>
        {subtitle &&
          <Text style={[textStyles.B2, {color: colors.Black}]}>
            {subtitle}
          </Text>
        }
      </View>
      <TouchableOpacity
        onPress={onPressRightButton}
        style={{padding:16}}>
        {headerRight}
      </TouchableOpacity>
    </View>
  );
};

export default CustomHeader;