import {useEffect, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {colors, textStyles} from '../../../styles/globalStyle';
import {formatDate} from '../../../utils/formatDate';
import {FlatList} from 'react-native-gesture-handler';
import WaypointCard from '../../../components/WaypointCard';
import SchoolTimeComponent from '../../../components/SchoolTimeComponent';
import CustomButton from '../../../components/CustomButton';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  getGroupForGuardian,
  getWaypoints,
  startGuide,
  stopGuide,
} from '../../../api/shuttleApi';
import {useQuery, useQueryClient, useMutation} from '@tanstack/react-query';
import CustomHeader from '../../../components/CustomHeader';
import useWebsocketStore from '../../../store/websocketStore';
import MapIcon from '../../../assets/icons/MapIcon.svg';
import eventEmitter from '../../../utils/eventEmitter';

const ShuttleDetail = ({navigation}) => {
  const [isBeforeSchool, setIsBeforeSchool] = useState(true);
  const [isGuideActive, setIsGuideActive] = useState(false);
  const {subscribeToChannel, unsubscribeToChannel} = useWebsocketStore();
  // today 날짜
  const formattedDate = formatDate();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();

  // 인솔자가 배정된 그룹 정보 불러오기
  const {
    data: groupInfo,
    isPending: groupInfoIsPending,
    error: groupInfoError,
  } = useQuery({
    queryKey: ['groupInfo'],
    queryFn: getGroupForGuardian,
  });

  // 각 경유지 정보 불러오기
  const {
    data: waypoints,
    isPending: waypointsIsPending,
    error: waypointsError,
  } = useQuery({
    queryKey: ['waypoints'],
    queryFn: getWaypoints,
  });

  // 인솔자 출근/퇴근 API 호출
  const onGuideButtonPress = () => {
    const useMutateGuideActive = useMutation({
      mutationFn: () => startGuide(groupInfo.id),
      onSuccess: response => {
        console.log(response);
        setIsGuideActive(response.isGuideActive);
      },
      onError: error => {
        console.log(error);
      },
    });

    const useMutateGuideDeactive = useMutation({
      mutationFn: () => stopGuide(groupInfo.id),
      onSuccess: response => {
        console.log(response);
        setIsGuideActive(response.isGuideActive);
      },
      onError: error => {
        console.log(error);
      },
    });

    if (isGuideActive) {
      useMutateGuideDeactive.mutate();
      return;
    }

    if (!isGuideActive) {
      useMutateGuideActive.mutate();
      return;
    }
  };

  // WebSocket 구독
  useEffect(() => {
    if (groupInfo) {
      subscribeToChannel({
        channel: `/sub/group/${groupInfo.id}`,
        callback: message => {
          const newMessage = JSON.parse(message.body);
          console.log(newMessage);
          // 학생 개별 출석 상태 변경시 캐시 업데이트
          if (newMessage.messageType === 'ATTENDANCE_CHANGE') {
            const {studentId, attendanceStatus, waypointId} = newMessage;
            // 경유지 정보에 출석 수 업데이트
            queryClient.setQueryData(['waypoints'], oldData => {
              if (!oldData) return;
              return oldData.map(waypoint => {
                if (waypoint.waypointId === waypointId) {
                  console.log('Updating waypoint:', waypoint.waypointName);
                  return {
                    ...waypoint,
                    currentCount:
                      attendanceStatus === 'PRESENT'
                        ? waypoint.currentCount + 1
                        : waypoint.currentCount - 1,
                  };
                }
                return waypoint;
              });
            });
            // 학생 정보에 출석 상태 업데이트
            queryClient.setQueryData(['studentsInfo', waypointId], oldData => {
              if (!oldData) return;
              return oldData.map(student => {
                if (student.studentId === studentId) {
                  console.log('Updating student:', student.name);
                  return {...student, attendanceStatus};
                }
                return student;
              });
            });
          }
          // 경유지 출석 확인 완료시 이벤트 발생 (shuttleStudentsList.js에서 이벤트 처리)
          if (newMessage.messageType === 'ATTENDANCE_COMPLETE') {
            eventEmitter.emit('attendanceComplete', newMessage);
          }
        },
      });
    }
    return () => {
      unsubscribeToChannel();
    };
  }, [groupInfo]);

  return (
    <View
      style={{
        backgroundColor: colors.White_Green,
        flex: 1,
        paddingBottom: insets.bottom,
        paddingTop: insets.top,
      }}>
      {groupInfo && (
        <CustomHeader
          title={groupInfo.schoolName}
          subtitle={groupInfo.groupName}
          headerRight={<MapIcon />}
          onPressRightButton={() =>
            navigation.navigate('ShuttleMap', {waypoints})
          }
        />
      )}
      <View style={{height: 16}} />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          paddingHorizontal: 32,
        }}>
        <Text style={[textStyles.M2, {color: colors.Black}]}>
          {formattedDate}
        </Text>
        {/* 등교 버튼 */}
        <TouchableOpacity onPress={() => setIsBeforeSchool(true)}>
          <SchoolTimeComponent
            type={'before'}
            isSelected={isBeforeSchool}
            title={'등교'}
          />
        </TouchableOpacity>
        {/* 하교 버튼 */}
        <TouchableOpacity onPress={() => setIsBeforeSchool(false)}>
          <SchoolTimeComponent
            type={'after'}
            isSelected={!isBeforeSchool}
            title={'하교'}
          />
        </TouchableOpacity>
      </View>
      <FlatList
        ListHeaderComponent={<View style={{height: 24}} />}
        data={waypoints}
        keyExtractor={item => item.waypointId}
        renderItem={({item}) => {
          return (
            <WaypointCard
              previousAttendanceComplete={
                waypoints[item.waypointOrder - 2]?.attendanceComplete
              }
              isAttendanceComplete={item.attendanceComplete}
              number={item.waypointOrder}
              title={item.waypointName}
              subtitle={`출석 ${item.currentCount}/${item.studentCount}`}
              onPress={() =>
                navigation.navigate('ShuttleStudentsList', {
                  waypoint: item,
                  groupInfo: groupInfo,
                  previousAttendanceComplete: waypoints[item.waypointOrder - 2]
                    ? waypoints[item.waypointOrder - 2].attendanceComplete
                    : true,
                })
              }
              isFirstItem={item.waypointOrder === 1}
              isLastItem={item.waypointOrder === waypoints.length}
            />
          );
        }}
      />
      <View style={{padding: 16}}>
        <CustomButton
          title={isGuideActive ? '퇴근하기' : '출근하기'}
          onPress={() => {
            onGuideButtonPress();
          }}
        />
      </View>
    </View>
  );
};

export default ShuttleDetail;
