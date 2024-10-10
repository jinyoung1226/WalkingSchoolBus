import {useEffect, useState} from 'react';
import { Text, TouchableOpacity, View} from 'react-native';
import {colors, textStyles} from '../../../styles/globalStyle';
import {formatDate} from '../../../utils/formatDate';
import {FlatList} from 'react-native-gesture-handler';
import WaypointCard from '../../../components/WaypointCard';
import SchoolTimeComponent from '../../../components/SchoolTimeComponent';
import CustomButton from '../../../components/CustomButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getGroupForGuardian, getWaypoints } from '../../../api/shuttleApi';
import { useQuery } from '@tanstack/react-query';
import ShuttleHeader from '../../../components/ShuttleHeader';
import useWebsocketStore from '../../../store/websocketStore';

const ShuttleDetail = ({navigation}) => {
  const [isBeforeSchool, setIsBeforeSchool] = useState(true);

  const {subscribeToChannel, unsubscribeToChannel} = useWebsocketStore();
  // today 날짜
  const formattedDate = formatDate();
  const insets = useSafeAreaInsets();

  const { data: groupInfo, isPending: groupInfoIsPending, error: groupInfoError } = useQuery({
    queryKey: ['groupInfo'], 
    queryFn: getGroupForGuardian
  });
  // 인솔자가 배정된 그룹 정보 불러오기
  const { data: waypoints, isPending: waypointsIsPending, error: waypointsError } = useQuery({
    queryKey: ['waypoints'], 
    queryFn: getWaypoints
  });

  useEffect(() => {
    subscribeToChannel({
      channel:`sub/group/${2}`, 
      callback: message => {
        console.log(message, '@@@@@');
      }
    });
    return () => {
      unsubscribeToChannel()
    }
  }, []);
  return (
    <View 
      style={{backgroundColor: colors.White_Green, flex:1, paddingBottom: insets.bottom, paddingTop: insets.top}}>
      {groupInfo && <ShuttleHeader title={groupInfo.schoolName} subTitle={groupInfo.groupName} />}
      <View style={{height: 16}} />
      <View style={{flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal:16}}>
        <Text
          style={[
            textStyles.M2,
            {color: colors.Black},
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
                waypointId: item.waypointId, waypointName: item.waypointName, groupName: groupInfo.groupName
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
