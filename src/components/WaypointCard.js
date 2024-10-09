import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import ArrowIcon from '../assets/icons/ArrowIcon.svg';
import {colors, textStyles} from '../styles/globalStyle';
import SchoolIcon from '../assets/icons/SchoolIcon.svg';

const WaypointCard = ({ number, title, subtitle, onPress, isFirstItem, isLastItem }) => {
  const [cardHeight, setCardHeight] = React.useState(0);
  return (
    <View style={{flexDirection:'row', alignItems:'center', paddingHorizontal: 16}}>
      <View style={{alignItems:'center'}}>
        <View style={{width:2, backgroundColor: isFirstItem ? null :colors.Main_Green, flex:1}} />
        {/* 이전 경유지가 출석되었을 경우에 실선 처리  */}
        <View style={{height: 14, width: 14, borderRadius: 10, backgroundColor:colors.Main_Green}} />
        {/* 현 경유지가 출석되었을 경우에 색깔 처리  */}
        <View style={{width:2, backgroundColor: isLastItem? null : colors.Main_Green, flex:1}} />
        {/* 현 경유지가 출석되었을 경우에 실선 처리  */}
        <View style={{width:2, backgroundColor: isLastItem? null : colors.Main_Green, height:32}} />
        {/* 현 경유지가 출석되었을 경우에 실선 처리  */}
      </View>
      <View style={{width: 16}} />
      <View style={{flex:1}}>
        <TouchableOpacity
          onLayout={(e) => {
            setCardHeight(e.nativeEvent.layout.height);
            console.log(e.nativeEvent.layout.height);
          }}
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
          }}>
            {!isLastItem ? (
              <View
                style={{
                  width: 33,
                  height: 33,
                  borderRadius: 8,
                  backgroundColor: colors.Dark_Green,
                  justifyContent: 'center',
                  alignItems: 'center',
                  margin: 3.5
                }}>
                <Text style={[textStyles.B1, {color: colors.white}]}>{number}</Text>
              </View>
            ) : (
                <SchoolIcon />
            )}
            <View style={{width: 16}} />
            <View style={{flex:1}}>
              <Text style={[textStyles.SB3, {color: colors.Black}]}>{title}</Text>
              {!isLastItem && (
                <Text style={[textStyles.R3, {color: colors.Gray06}]}>
                  {subtitle}
                </Text>
              )}
            </View>
            <View style={{width: 16}} />
          {!isLastItem && <ArrowIcon />}
        </TouchableOpacity>
        <View style={{height: 32}} />
      </View>
      <View style={{width: 16}} />
    </View>
  );
};

export default WaypointCard;
