import React, {useState, useEffect, useMemo} from 'react';
import {View, Text} from 'react-native';
import {colors, textStyles} from '../../../styles/globalStyle';
import { FlatList } from 'react-native-gesture-handler';
import StudentCard from '../../../components/StudentCard';
import ConfirmModal from '../../../components/ConfirmModal';
import CustomHeader from '../../../components/CustomHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQueryClient } from '@tanstack/react-query';
import CustomButton from '../../../components/CustomButton';
import useWebsocketStore from '../../../store/websocketStore';
import MapIcon from '../../../assets/icons/MapIcon.svg';
import SingleActionModal from '../../../components/SingleActionModal';
import ThinkingFaceIcon from '../../../assets/icons/ThinkingFaceIcon.svg';
import HuggingFaceIcon from '../../../assets/icons/HuggingFaceIcon.svg';
import eventEmitter from '../../../utils/eventEmitter';
import useStudentList from '../../hooks/queries/useStudentList';
import useGroupInfo from '../../hooks/queries/useGroupInfo';
import useCompleteAttendance from '../../hooks/mutations/useCompleteAttendance';
import useWaypoints from '../../hooks/queries/useWaypoints';
import useGuideStatus from '../../hooks/queries/useGuideStatus';

const ShuttleStudentsList = ({navigation, route}) => {
  const { waypointId, waypointName } = route.params;
  const [attendanceModalVisible, setAttendanceModalVisible] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [completeModalVisible, setCompleteModalVisible] = useState(false);
  const [nonCompleteModalVisible, setNonCompleteModalVisible] = useState(false);
  const [completeMessage, setCompleteMessage] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const insets = useSafeAreaInsets();
  const { publish } = useWebsocketStore();
  const queryClient = useQueryClient();

  const { data: waypoints, isSuccess: waypointsIsSuccess } = useWaypoints();

  const { data: groupInfo } = useGroupInfo();

  const { data: guideStatus } = useGuideStatus();
  // 각 경유지에 배정된 학생 불러오기
  const { data: studentList, isPending: studentListIsPending, isSuccess: studentListIsSuccess } = useStudentList(waypointId);
  // 경유지별 출석 완료 API 호출
  const useMutateAttendanceComplete = useCompleteAttendance(waypointId);

  // 현 경유지 출석 완료 상태
  const isAttendanceComplete = waypointsIsSuccess && waypoints.find((item) => item.waypointId === waypointId).attendanceComplete;
  
  // 미인증 상태인 학생 목록
  const absentStudents = studentListIsSuccess && studentList.filter(student => student.attendanceStatus === 'UNCONFIRMED');

  useEffect(() => {
    // 같은 경유지 상세정보 페이지에서 출석 완료 이벤트가 발생할 경우, 출석 완료 상태 업데이트 (인솔자중 한명이 출석 확인 완료시 모달 팝업, 출석 완료 상태 업데이트, 쿼리 리페치)
    const attendanceCompleteHandler = (message) => {
      if (message.waypointId == waypointId) {
        setCompleteMessage(message);
        setCompleteModalVisible(true);
        queryClient.invalidateQueries({ queryKey: ['studentList', waypointId] });
      }
    };
    eventEmitter.on('attendanceComplete', attendanceCompleteHandler);
    return () => {
      eventEmitter.removeListener('attendanceComplete', attendanceCompleteHandler);
    }
  }, []);

  // 추후 스켈레톤 UI 추가
  if (studentListIsPending) {
    return <View />;
  }

  // 학생 개별 출석 상태 변경
  const onAttendanceButtonPress = async ({studentId, status}) => {
    if (status === 'PRESENT') {
      setSelectedStudentId(studentId);
      setCancelModalVisible(true);
    }
    if (status === 'UNCONFIRMED') {
      console.log(studentId, status);
      publish({
        destination: `/pub/group/${groupInfo.id}`,
        header: 'application/json',
        studentId: studentId,
        attendanceStatus: 'PRESENT',
      });
    }
  }

  

  return (
    <View style={{backgroundColor: 'white', flex: 1, paddingBottom: insets.bottom, paddingTop: insets.top}}>
      <SingleActionModal
        modalVisible={nonCompleteModalVisible}
        setModalVisible={setNonCompleteModalVisible}
        icon={<ThinkingFaceIcon />}
        title={'이전 경유지의 출석이\n완료되지 않았어요'}
        subtitle={'이전 경유지의 출석을 먼저 완료해주세요'}
        confirmTitle={'돌아가기'}
        onConfirm={() => {
          setNonCompleteModalVisible(false);
          navigation.goBack();
        }}
        isBackgroundclosable={false}
      />
      <SingleActionModal
        modalVisible={completeModalVisible}
        setModalVisible={setCompleteModalVisible}
        icon={<HuggingFaceIcon />}
        title={
        <Text>
          {`${completeMessage?.guardianName} 지도사님이 \n`}
          <Text style={{color: colors.Main_Green}}>
          {completeMessage?.waypointName}
          </Text> 
          {` 경유지의\n출석을 완료했어요!`}
        </Text>}
        // subtitle={'출석 확인이 완료되었습니다.'}
        confirmTitle={'확인'}
        onConfirm={() => {
          setCompleteModalVisible(false);
          navigation.goBack();
        }}
        isBackgroundclosable={false}
      />
      <ConfirmModal
        modalVisible={attendanceModalVisible}
        setModalVisible={setAttendanceModalVisible}
        title={'출결을 모두 확인하셨나요?'}
        subtitle={
          absentStudents.length > 0 ?
          <View>
            <Text
              style={[
                textStyles.R1,
                {color: colors.Gray06, textAlign: 'center'},
              ]}>
              {'현재 미인증 상태인 '}
              {absentStudents.map((student, index) => (
                <Text 
                  style={[textStyles.SB2, {color: colors.Main_Green}]}
                  key={index}
                >
                  {student.name}{index === absentStudents.length - 1 ? '' : ', '}
                </Text>
              ))}
              {' 학생은\n자동으로 결석 처리 됩니다.'}
            </Text>
            <View style={{height: 8}} />
            <Text
              style={[textStyles.R2, {color: colors.Red, textAlign: 'center'}]}
            >
              {'출결확인을 완료하면 출결을 다시 변경할 수 없습니다.'}
            </Text>
          </View> 
          :
          <Text
          style={[textStyles.R1, {color: colors.Red, textAlign: 'center'}]}
          >
            {'출결확인을 완료하면\n출결을 다시 변경할 수 없습니다.'}
          </Text>
        }
        cancelTitle={'아니오'}
        confirmTitle={'네'}
        onConfirm={() => {
          // 여기서 이전 경유지 출석 여부에 따라 출석 완료 이벤트 발생
          useMutateAttendanceComplete.mutate(undefined, {
            onError: (error) => {
              if (error.response?.status === 400) {
                setNonCompleteModalVisible(true);
              }
            },
          });
          setAttendanceModalVisible(false);
        }}
        onCancel={() => {
          setAttendanceModalVisible(false);
        }}
        />
      <ConfirmModal
        modalVisible={cancelModalVisible}
        setModalVisible={setCancelModalVisible}
        title={'출석을 취소하시겠어요?'}
        subtitle={
          <Text
          style={[
            textStyles.R1,
            {color: colors.Gray06, textAlign: 'center'},
          ]}>
            {'출석을 취소하면 미인증 상태로 변경됩니다'}
          </Text>
        }
        cancelTitle={'아니요'}
        confirmTitle={'네, 취소할래요'}
        onConfirm={() => {
          publish({
            destination: `/pub/group/${groupInfo.id}`,
            header: 'application/json',
            studentId: selectedStudentId,
            attendanceStatus: 'UNCONFIRMED',
          });
          setCancelModalVisible(false);
        }}
        onCancel={() => {
          setCancelModalVisible(false);
        }}
      />
      <CustomHeader 
        title={waypointName} 
        subtitle={groupInfo.groupName}
        subtitleVisible={true} 
        headerRight={<MapIcon/>} 
        onPressRightButton={() => navigation.navigate('ShuttleMap')} 
      />
      <View style={{height: 16}} />
      <View style={{paddingHorizontal:32}}>
        <Text style={[textStyles.M2, {color: colors.Black}]}>
          {`📌 현재 출석`}
          <Text style={[textStyles.SB2, {color: colors.Red}]}>
            {` ${studentList.filter((student) => student.attendanceStatus === 'PRESENT').length}/${studentList.length}`}
          </Text>
          {`명 완료`}
        </Text>
      </View>
      <FlatList
        ListHeaderComponent={() => <View style={{height: 16}} />}
        data={studentList}
        keyExtractor={(item) => item.studentId}
        renderItem={({item}) => (
          <StudentCard
            changeStatusDisabled={isAttendanceComplete || !guideStatus.isGuideActive}
            initialStatus={item.attendanceStatus}
            studentId={item.studentId}
            name={item.name}
            imagePath={item.imagePath}
            onAttendanceButtonPress={() => {
              onAttendanceButtonPress({studentId: item.studentId, status: item.attendanceStatus});
            }}
            goStudentDetail={() => {
              navigation.navigate('StudentDetail', {studentInfo: item});
            }}/>
        )}
        ItemSeparatorComponent={() => <View style={{height: 16}} />}
      />
      <View style={{padding:16}}>
        {guideStatus.isGuideActive &&
        <CustomButton 
          title={!isAttendanceComplete ? '출석 확인' : '출석 완료'}
          onPress={() => {
            setAttendanceModalVisible(true);
          }}
          disabled={isAttendanceComplete}
        />}
      </View>
    </View>
  );
};

export default ShuttleStudentsList;
