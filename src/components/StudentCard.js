import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import ArrowIcon from '../assets/icons/ArrowIcon.svg';
import {colors, textStyles} from '../styles/globalStyle';

const StudentCard = ({ name, goStudentDetail, imagePath, initialStatus, onAttendanceButtonPress }) => {

  const attendanceButtonColor = (status) => {
    if (status === 'UNCONFIRMED') {
      return colors.BG_Green;
    } 
    if (status === 'PRESENT') {
      return colors.Main_Green;
    }
    if (status === 'ABSENT') {
      return colors.Red;
    }
    if (status === 'PREABSENT') {
      return colors.Gray04;
    }
  }

  const attendanceButtonTextColor = (status) => {
    if (status === 'UNCONFIRMED') {
      return colors.Main_Green;
    } 
    if (status === 'PRESENT') {
      return colors.White;
    }
    if (status === 'ABSENT') {
      return colors.White;
    }
    if (status === 'PREABSENT') {
      return colors.White;
    }
  }

  const attendanceButtonText = (status) => {
    if (status === 'UNCONFIRMED') {
      return '미인증';
    } 
    if (status === 'PRESENT') {
      return '출석완료';
    }
    if (status === 'ABSENT') {
      return '결석';
    }
    if (status === 'PREABSENT') {
      return '결석해요';
    }
  }

  return (
    <View style={{flexDirection:'row', alignItems:'center', paddingHorizontal: 16}}>
      <View style={{width: 16}} />
      <View style={{flex:1}}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            backgroundColor: colors.Gray02,
            alignItems: 'center',
            paddingHorizontal: 24,
            paddingVertical: 16,
            borderRadius: 14,
          }}>
            <View
              style={{
                width:50,
                height:50,
                borderRadius: 25,
                backgroundColor: colors.Gray03,
                overflow: 'hidden',
              }}>
              <Image
                src={imagePath}
                style={{flex:1}}
              />
            </View>
            <View style={{width: 24}} />
            <TouchableOpacity
              onPress={goStudentDetail}
            >
              <Text style={[textStyles.SB3, {color: colors.Black}]}>
                {name}
              </Text>
              <View style={{flexDirection:'row', alignItems:'center'}}>
                <Text style={[textStyles.R3, {color: colors.Gray06, marginBottom:1}]}>
                  정보 보기
                </Text>
                <View style={{width: 4}} />
                <ArrowIcon width={13} height={13} color={colors.Gray06}/>
              </View>
            </TouchableOpacity>
            <View style={{flex:1}} />
            <TouchableOpacity
              onPress={onAttendanceButtonPress}
              style={{
                width: 81,
                paddingVertical: 8,
                borderRadius: 7,
                backgroundColor: attendanceButtonColor(initialStatus),
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: initialStatus === 'UNCONFIRMED' ? colors.Main_Green : 'transparent',
              }}>
              <Text style={[textStyles.SB4, {color: attendanceButtonTextColor(initialStatus)}]}>
                {attendanceButtonText(initialStatus)}
              </Text>
            </TouchableOpacity>
        </View>
      </View>
      <View style={{width: 16}} />
    </View>
  );
};

export default StudentCard;
