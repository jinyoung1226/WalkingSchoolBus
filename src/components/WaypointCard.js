import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import ArrowIcon from '../assets/icons/ArrowIcon.svg';
import {colors, textStyles} from '../styles/globalStyle';
import SchoolIcon from '../assets/icons/SchoolIcon.svg';

const WaypointCard = ({ number, title, subtitle, onPress, isFirstItem, isLastItem, isAttendanceComplete, previousAttendanceComplete }) => {

  return (
    <View style={{flexDirection:'row', alignItems:'center', paddingHorizontal: 32}}>
      <View style={{alignItems:'center'}}>
        <View style={{width:2, backgroundColor: isFirstItem ? null : previousAttendanceComplete ? colors.Main_Green : colors.Gray04, flex:1}} />
        {/* 이전 경유지가 출석되었을 경우에 실선 처리  */}
        <View style={{height: 14, width: 14, borderRadius: 10, backgroundColor: isAttendanceComplete ? colors.Main_Green : colors.Gray04}} />
        {/* 현 경유지가 출석되었을 경우에 색깔 처리  */}
        <View style={{width:2, backgroundColor: isLastItem? null : isAttendanceComplete ? colors.Main_Green : colors.Gray04, flex:1}} />
        {/* 현 경유지가 출석되었을 경우에 실선 처리  */}
        <View style={{width:2, backgroundColor: isLastItem? null : isAttendanceComplete ? colors.Main_Green : colors.Gray04, height:32}} />
        {/* 현 경유지가 출석되었을 경우에 실선 처리  */}
      </View>
      <View style={{width: 16}} />
      <View style={{flex:1}}>
        <TouchableOpacity
          disabled={isLastItem}
          onPress={onPress}
          style={{
            flex: 1,
            flexDirection: 'row',
            backgroundColor: isAttendanceComplete ? colors.BG_Green: colors.Gray02,
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
                <Text style={[textStyles.B1, {color: colors.White}]}>{number}</Text>
              </View>
            ) : (
                <SchoolIcon />
            )}
            <View style={{width: 16}} />
            <View style={{flex:1}}>
              <Text style={[textStyles.SB3, {color: colors.Black}]}>{title}</Text>
              {isAttendanceComplete ? (
                <Text style={[textStyles.R3, {color: colors.Main_Green}]}>
                  출석 완료
                </Text>
              ) : (
                !isLastItem && 
                <Text style={[textStyles.R3, {color: colors.Gray06}]}>
                  {subtitle}
                </Text>
              )}
            </View>
            <View style={{width: 16}} />
          {!isLastItem && <ArrowIcon width={20} height={20} color={colors.Gray07}/>}
        </TouchableOpacity>
        <View style={{height: 32}} />
      </View>
      
    </View>
  );
};

export default WaypointCard;
