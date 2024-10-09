import React, {useEffect, useLayoutEffect, useState} from 'react';
import {View, Text, Image, TouchableOpacity, ScrollView} from 'react-native';
import {colors, textStyles} from '../../../styles/globalStyle';
import BackIcon from '../../../assets/icons/BackIcon.svg';
import MapIcon from '../../../assets/icons/MapIcon.svg';
import {authApi} from '../../../api/api';

const ShuttleStudentsList = ({navigation, route}) => {
  const {waypointId} = route.params;
  const [groupInfo, setGroupInfo] = useState(null);
  const [studentsInfo, setStudentInfo] = useState([]);

  // 각 경유지에 배정된 학생 불러오기
  useEffect(() => {
    const getStudentsByWaypoint = async () => {
      try {
        const response = await authApi.get(`waypoints/${waypointId}/students`);
        if (response.status === 200) {
          console.log(response.data, '경유지에 배정된 학생 불러오기');
          setStudentInfo(response.data);
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 400) {
            Alert.alert('경유지에 있는 학생 정보를 불러올 수 없습니다');
          }
        } else {
          console.log(error);
          Alert.alert('서버와의 통신 실패');
        }
      }
    };
    getStudentsByWaypoint();
  }, []);

  // 인솔자가 배정된 그룹 정보 불러오기
  useEffect(() => {
    const getGroupForGuardian = async () => {
      try {
        const response = await authApi.get('guardian/group');
        if (response.status === 200) {
          console.log(response.data, '그룹 정보 불러오기');
          setGroupInfo(response.data);
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 400) {
            Alert.alert('그룹 정보를 불러올 수 없습니다');
          }
        } else {
          console.log(error);
          Alert.alert('서버와의 통신 실패');
        }
      }
    };
    getGroupForGuardian();
  }, []);

  // 상단 헤더 적용
  useLayoutEffect(() => {
    if (groupInfo) {
      navigation.setOptions({
        headerTitle: () => (
          <View style={{alignItems: 'center', gap: 4}}>
            <Text style={[textStyles.B1, {color: colors.Black}]}>
              {' '}
              {groupInfo.schoolName}{' '}
            </Text>
            <Text style={[textStyles.B2, {color: colors.Black}]}>
              {' '}
              {groupInfo.groupName}{' '}
            </Text>
          </View>
        ),
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            style={{paddingLeft: 16}}>
            <BackIcon />
          </TouchableOpacity>
        ),
        headerRight: () => (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('ShuttleMap');
            }}
            style={{paddingRight: 16}}>
            <MapIcon />
          </TouchableOpacity>
        ),
        headerStyle: {
          elevation: 0, // Android에서의 그림자 제거
          shadowOpacity: 0, // iOS에서의 그림자 제거
          height: 80,
        },
      });
    }
  }, [navigation, groupInfo]);

  return <View style={{backgroundColor: 'white', flex: 1}}></View>;
};

export default ShuttleStudentsList;
