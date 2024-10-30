import {useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {colors, textStyles} from '../../../styles/globalStyle';
import {formatDate} from '../../../utils/formatDate';
import {FlatList} from 'react-native-gesture-handler';
import WaypointCard from '../../../components/WaypointCard';
import SchoolTimeComponent from '../../../components/SchoolTimeComponent';
import CustomButton from '../../../components/CustomButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CustomHeader from '../../../components/CustomHeader';
import MapIcon from '../../../assets/icons/MapIcon.svg';
import useShuttleStore from '../../guardianStore/useShuttleStore';
import useGroupInfo from '../../hooks/queries/useGroupInfo';
import useWaypoints from '../../hooks/queries/useWaypoints';
import useStartGuide from '../../hooks/mutations/useStartGuide';
import useStopGuide from '../../hooks/mutations/useStopGuide';
import useWebSocketSubscription from '../../hooks/websocket/useWebsocketSub';

const ShuttleDetail = ({navigation}) => {
  const [isBeforeSchool, setIsBeforeSchool] = useState(true);
  const { isGuideActive } = useShuttleStore();
  // today 날짜
  const formattedDate = formatDate();
  const insets = useSafeAreaInsets();

  // 인솔자가 배정된 그룹 정보 불러오기
  const { data: groupInfo, isPending: groupInfoIsPending } = useGroupInfo();

  // 각 경유지 정보 불러오기
  const { data: waypoints, isPending: waypointsIsPending, isSuccess: waypointsIsSuccess } = useWaypoints();

  const lastWaypointAttendanceComplete = waypointsIsSuccess && waypoints[waypoints.length - 2].attendanceComplete;

  // 인솔자 출근/퇴근 API 호출
  const useMutateGuideActive = useStartGuide(groupInfo?.id);

  const useMutateGuideDeactive = useStopGuide(groupInfo?.id);

  const onGuideButtonPress = () => {
    if (isGuideActive) {
      useMutateGuideDeactive.mutate();
      return;
    }

    if (!isGuideActive) {
      useMutateGuideActive.mutate();
      return;
    }
  }

  // WebSocket 구독
  useWebSocketSubscription(groupInfo);
  
  return (
    <View 
      style={{backgroundColor: colors.White_Green, flex:1, paddingBottom: insets.bottom, paddingTop: insets.top}}>
      {groupInfo && 
      <CustomHeader 
        title={groupInfo.schoolName} 
        subtitle={groupInfo.groupName}
        headerRight={<MapIcon/>} 
        onPressRightButton={() => navigation.navigate('ShuttleMap', {waypoints})}
      />}
      <View style={{height: 16}} />
      <View style={{flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal:32}}>
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
        {/* <TouchableOpacity onPress={() => setIsBeforeSchool(false)}>
          <SchoolTimeComponent type={'after'} isSelected={!isBeforeSchool} title={'하교'}/>
        </TouchableOpacity> */}
      </View>
      <FlatList
        ListHeaderComponent={<View style={{height: 24}} />}
        data={waypoints}
        keyExtractor={(item) => item.waypointId}
        renderItem={({item}) => {
          return (
            <WaypointCard
              previousAttendanceComplete={waypoints[item.waypointOrder - 2]?.attendanceComplete}
              isAttendanceComplete={item.attendanceComplete}
              number={item.waypointOrder}
              title={item.waypointName}
              subtitle={`출석 ${item.currentCount}/${item.studentCount}`}
              onPress={() =>
                navigation.navigate('ShuttleStudentsList', {waypointId: item.waypointId, waypointName: item.waypointName})
              }
              isFirstItem={item.waypointOrder === 1}
              isLastItem={item.waypointOrder === waypoints.length}
            />
          )
        }}
      />
      <View style={{padding:16}}>
        {/* 출근하기 이후 마지막 경유지 출석 완료시 퇴근하기 버튼 활성화, 완료 전까지는 운행중이라는 비활성화 버튼 제공 */}
        <CustomButton title={isGuideActive ? (lastWaypointAttendanceComplete ? '퇴근하기'  : '아직 운행중이에요') : '출근하기'} onPress={() => {onGuideButtonPress()}} disabled={isGuideActive && !lastWaypointAttendanceComplete}/>
      </View>
    </View>
  );
};

export default ShuttleDetail;