import React, {useState} from 'react';
import {View, Text} from 'react-native';
import {colors, textStyles} from '../../../styles/globalStyle';
import {authApi} from '../../../api/api';
import { FlatList } from 'react-native-gesture-handler';
import StudentCard from '../../../components/StudentCard';
import ConfirmModal from '../../../components/ConfirmModal';
import CustomHeader from '../../../components/CustomHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getStudentsByWaypoint } from '../../../api/shuttleApi';
import { useQuery } from '@tanstack/react-query';
import CustomButton from '../../../components/CustomButton';
import useWebsocketStore from '../../../store/websocketStore';
import MapIcon from '../../../assets/icons/MapIcon.svg';

const ShuttleStudentsList = ({navigation, route}) => {
  const {waypointId, waypointName, groupName} = route.params;
  // const [studentsInfo, setStudentInfo] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const insets = useSafeAreaInsets();
  const { publish } = useWebsocketStore();

  // 각 경유지에 배정된 학생 불러오기
  const { data: studentsInfo, isPending: studentsInfoIsPending, error: studentsInfoError } = useQuery({
    queryKey: ['studentsInfo', waypointId], 
    queryFn: () => getStudentsByWaypoint(waypointId)
  });

  if (studentsInfoIsPending) {
    return <View />;
  }

  const onAttendanceButtonPress = async ({studentId, status}) => {
    if (status === 'PRESENT') {
      setSelectedStudentId(studentId);
      setModalVisible(true);
    }
    if (status === 'UNCONFIRMED') {
      console.log(studentId, status);
      publish({
        destination: `/pub/group/2`,
        header: 'application/json',
        studentId: studentId,
        attendanceStatus: 'PRESENT',
      });
    }
  }

  return (
    <View style={{backgroundColor: 'white', flex: 1, paddingBottom: insets.bottom, paddingTop: insets.top}}>
      <ConfirmModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        title={'출석을 취소하시겠어요?'}
        subtitle={'출석을 취소하면 미인증 상태로 변경됩니다'}
        cancelTitle={'아니요'}
        confirmTitle={'네, 취소할래요'}
        onConfirm={() => {
          publish({
            destination: `/pub/group/2`,
            header: 'application/json',
            studentId: selectedStudentId,
            attendanceStatus: 'UNCONFIRMED',
          });
          setModalVisible(false);
        }}
        onCancel={() => {
          setModalVisible(false);
        }}
      />
      <CustomHeader 
        title={waypointName} 
        subtitle={groupName}
        subtitleVisible={true} 
        headerRight={<MapIcon/>} 
        onPressRightButton={() => navigation.navigate('ShuttleMap')} 
      />
      <View style={{height: 16}} />
      <View style={{paddingHorizontal:32}}>
        <Text style={[textStyles.M2, {color: colors.Black}]}>
          {`📌 현재 출결`}
          <Text style={[textStyles.SB2, {color: colors.Red}]}>
            {` ${studentsInfo.filter((student) => student.attendanceStatus === 'PRESENT').length}/${studentsInfo.length}`}
          </Text>
          {`명 완료`}
        </Text>
      </View>
      <FlatList
        ListHeaderComponent={() => <View style={{height: 16}} />}
        data={studentsInfo}
        keyExtractor={(item) => item.studentId}
        renderItem={({item}) => (
          <StudentCard
            initialStatus={item.attendanceStatus}
            studentId={item.studentId}
            name={item.name}
            imagePath={item.imagePath}
            onAttendanceButtonPress={() => {
              onAttendanceButtonPress({studentId: item.studentId, status: item.attendanceStatus});
            }}
            goStudentDetail={() => {
              navigation.navigate('StudentDetail', {studentId: item.studentId});
            }}/>
        )}
        ItemSeparatorComponent={() => <View style={{height: 16}} />}
      />
      <View style={{padding:16}}>
        <CustomButton title={'출석완료'} onPress={() => {}}/>
      </View>
    </View>
  );
};

export default ShuttleStudentsList;
