import {useEffect, useLayoutEffect, useState} from 'react';
import {Alert, Text, TouchableOpacity, View} from 'react-native';
import {colors, textStyles} from '../../../styles/globalStyle';
import BackIcon from '../../../assets/icons/BackIcon.svg';
import MapIcon from '../../../assets/icons/MapIcon.svg';
import {formatDate} from '../../../utils/formatDate';
import {authApi} from '../../../api/api';
import {FlatList, ScrollView} from 'react-native-gesture-handler';
import WaypointCard from '../../../components/WaypointCard';
import useShuttleStore from '../../../store/useShuttleStore';
import SchoolTimeComponent from '../../../components/SchoolTimeComponent';
import CustomButton from '../../../components/CustomButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ShuttleDetail = ({navigation}) => {
  const {waypoints, setWaypoints} = useShuttleStore();
  const [isBeforeSchool, setIsBeforeSchool] = useState(true);
  const [groupInfo, setGroupInfo] = useState(null);
  const [listHeight, setListHeight] = useState([]);
  // today 날짜
  const formattedDate = formatDate();
  const insets = useSafeAreaInsets();
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
    console.log(insets, '아이폰 인셋')
  }, []);

  // 상단 헤더 적용
  useLayoutEffect(() => {
    if (groupInfo) {
      navigation.setOptions({
        headerTitleAlign: 'center',
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
    <View 
    style={{backgroundColor: colors.White_Green, flex:1, paddingBottom: insets.bottom}}>
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
        <TouchableOpacity onPress={() => setIsBeforeSchool(true)}>
            <SchoolTimeComponent type={'before'} isSelected={isBeforeSchool} title={'등교'}/>
        </TouchableOpacity>
        {/* 하교 버튼 */}
        <TouchableOpacity onPress={() => setIsBeforeSchool(false)}>
          <SchoolTimeComponent type={'after'} isSelected={!isBeforeSchool} title={'하교'}/>
        </TouchableOpacity>
      </View>
      <FlatList
        ListHeaderComponent={<View style={{height: 24}} />}
        data={waypoints}
        keyExtractor={(item) => item.waypointId}
        renderItem={({item}) => (
          <WaypointCard
            number={item.waypointOrder}
            title={item.waypointName}
            subtitle={`출결 ${2}/${item.studentCount}`}
            onPress={() =>
              navigation.navigate('ShuttleStudentsList', {
                waypointId: item.waypointId,
              })
            }
            isFirstItem={item.waypointOrder === 1}
            isLastItem={item.waypointOrder === waypoints.length}

          />
        )}
      />
      <View style={{padding:16}}>
      <CustomButton title={'출근 하기'} onPress={() => navigation.navigate('ShuttleAttendance')}/>
      </View>
    </View>
  );
};

export default ShuttleDetail;
