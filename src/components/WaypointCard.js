import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import ArrowIcon from '../assets/icons/ArrowIcon.svg';
import {colors, textStyles} from '../styles/globalStyle';
import SchoolIcon from '../assets/icons/SchoolIcon.svg';

const WaypointCard = ({number, title, subtitle, onPress, isLastItem}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flex: 1,
        flexDirection: 'row',
        backgroundColor: colors.Gray02,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderRadius: 14,
        marginBottom: 63,
      }}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {!isLastItem ? (
          <View
            style={{
              width: 33,
              height: 33,
              borderRadius: 11,
              backgroundColor: colors.Dark_Green,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 16,
            }}>
            <Text style={[textStyles.B1, {color: colors.white}]}>{number}</Text>
          </View>
        ) : (
          <View
            style={{
              width: 33,
              height: 33,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 16,
            }}>
            <SchoolIcon />
          </View>
        )}
        <View style={{gap: 4}}>
          <Text style={[textStyles.SB3, {color: colors.Black}]}>{title}</Text>
          {!isLastItem && (
            <Text style={[textStyles.R3, {color: colors.Gray06}]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      {!isLastItem ? <ArrowIcon /> : null}
    </TouchableOpacity>
  );
};

export default WaypointCard;
