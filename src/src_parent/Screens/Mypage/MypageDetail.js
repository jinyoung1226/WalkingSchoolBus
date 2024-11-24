import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {textStyles, colors} from '../../../styles/globalStyle';
import CustomHeader from '../../../components/CustomHeader';
import {getParentsInfo, getStudentInfo} from '../../../api/mypageApi';
import Parents from '../../../assets/icons/Parents.svg';

const MypageDetail = ({navigation, route}) => {
  const insets = useSafeAreaInsets();
  const {parentsInfo} = route.params;
  
  return (
    <View
      style={{
        flex: 1,
        paddingTop: 16,
        backgroundColor: colors.White_Green,
        paddingBottom: insets.bottom,
        paddingTop: insets.top,
      }}>
      <CustomHeader
        title="프로필 설정"
        onBackPress={() => navigation.goBack()}
      />
      <View
        style={{
          alignItems: 'center',
          marginTop: 24,
          position: 'relative',
        }}>
        <View
          style={{
            position: 'relative',
          }}>
          <Parents width={100} height={100} />
        </View>

        <Text style={[textStyles.SB2, {color: colors.Black, marginTop: 16}]}>
          {parentsInfo.name}
        </Text>
      </View>

      <View>
        <Text
          style={[
            textStyles.R3,
            {color: colors.Gray06, marginVertical: 32, paddingHorizontal: 16},
          ]}>
          인솔자에게만 공개되는 정보입니다.
        </Text>
        <View style={{paddingHorizontal: 16}}></View>
        <View style={{marginBottom: 32, paddingHorizontal: 16}}>
          <Text
            style={[textStyles.SB3, {color: colors.Black, marginBottom: 4}]}>
            휴대폰 번호
          </Text>
          <Text style={[textStyles.M3, {color: colors.Gray06}]}>
            {parentsInfo.phone}
          </Text>
        </View>
        <View
          style={{
            width: '100%',
            height: 8,
            backgroundColor: colors.Gray01,
          }}
        />
        <Text
          style={[
            textStyles.R3,
            {
              color: colors.Gray06,
              marginTop: 32,
              marginBottom: 16,
              paddingHorizontal: 16,
            },
          ]}>
          공개되지 않는 정보입니다
        </Text>
        {/* 이메일 */}
        <View style={{paddingHorizontal: 16}}>
          <Text
            style={[textStyles.SB3, {color: colors.Black, marginBottom: 4}]}>
            이메일
          </Text>
          <Text style={[textStyles.M3, {color: colors.Gray06}]}>
            {parentsInfo.email}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default MypageDetail;
