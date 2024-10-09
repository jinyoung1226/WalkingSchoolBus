import {useEffect, useLayoutEffect, useState} from 'react';
import {Alert, Text, TouchableOpacity, View} from 'react-native';
import {colors, textStyles} from '../../../styles/globalStyle';
import BackIcon from '../../../assets/icons/BackIcon.svg';
import MapIcon from '../../../assets/icons/MapIcon.svg';
import {formatDate} from '../../../utils/formatDate';
import NotSelectedBeforeSchool from '../../../assets/icons/NotSelectedBeforeSchool.svg';
import SelectedAfterSchool from '../../../assets/icons/SelectedAfterSchool.svg';
import SelectedBeforeSchool from '../../../assets/icons/SelectedBeforeSchool.svg';
import NotSelectedAfterSchool from '../../../assets/icons/NotSelectedAfterSchool.svg';
import {authApi} from '../../../api/api';
import {ScrollView} from 'react-native-gesture-handler';
import WaypointCard from '../../../components/WaypointCard';
import useShuttleStore from '../../../store/useShuttleStore';
import WaypointIndicatorIcon from '../../../assets/icons/WaypointIndicatorIcon.svg';

const ShuttleDetail = ({navigation}) => {
  const {waypoints, setWaypoints} = useShuttleStore();
  const [beforeSchoolStatus, setBeforeSchoolStatus] = useState(true);
  const [afterSchoolStatus, setAfterSchoolStatus] = useState(false);
  const [groupInfo, setGroupInfo] = useState(null);

  // today 날짜
  const formattedDate = formatDate();

  // 등하교 버튼 상태 관리
  const handleBeforeSchoolPress = () => {
    setBeforeSchoolStatus(true);
    setAfterSchoolStatus(false); // 등교 비활성화
  };

  const handleAfterSchoolPress = () => {
    setBeforeSchoolStatus(false);
    setAfterSchoolStatus(true); // 하교 비활성화
  };

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

  //경유지 불러오기
  useEffect(() => {
    const getWaypoints = async () => {
      try {
        const response = await authApi.get('/waypoints');
        if (response.status === 200) {
          console.log(response.data, '경유지 불러오기');
          setWaypoints(response.data);
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 400) {
            Alert.alert('경유지 정보를 불러올 수 없습니다');
          }
        } else {
          console.log(error);
          Alert.alert('서버와의 통신 실패');
        }
      }
    };
    getWaypoints();
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

  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <View style={{height: 16}} />
      <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
        <Text
          style={[
            textStyles.M2,
            {color: colors.Black, paddingLeft: 32, paddingRight: 8},
          ]}>
          {formattedDate}
        </Text>
        {/* 등교 버튼 */}
        <TouchableOpacity onPress={handleBeforeSchoolPress}>
          {beforeSchoolStatus ? (
            <SelectedBeforeSchool />
          ) : (
            <NotSelectedBeforeSchool />
          )}
        </TouchableOpacity>
        {/* 하교 버튼 */}
        <TouchableOpacity onPress={handleAfterSchoolPress}>
          {afterSchoolStatus ? (
            <SelectedAfterSchool />
          ) : (
            <NotSelectedAfterSchool />
          )}
        </TouchableOpacity>
      </View>
      <View style={{height: 24}} />
      <ScrollView contentContainerStyle={{paddingLeft: 32, paddingRight: 37}}>
        {waypoints.map((waypoint, index) => {
          const isLastItem = index === waypoints.length - 1;
          return (
            <View style={{flexDirection: 'row', gap: 16}}>
              <View style={{backgroundColor: 'red'}}>
                {!isLastItem && <WaypointIndicatorIcon />}
              </View>
              <WaypointCard
                key={waypoint.waypointId}
                number={waypoint.waypointOrder}
                title={waypoint.waypointName}
                subtitle={`출결 ${2}/${waypoint.studentCount}`}
                onPress={() =>
                  navigation.navigate('ShuttleStudentsList', {
                    waypointId: waypoint.waypointId,
                  })
                }
                isLastItem={isLastItem}
              />
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default ShuttleDetail;
