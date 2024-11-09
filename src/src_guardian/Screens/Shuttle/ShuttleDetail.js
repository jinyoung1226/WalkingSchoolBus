import {useState} from 'react';
import {PermissionsAndroid, Platform, Text, TouchableOpacity, View} from 'react-native';
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
import Geolocation from 'react-native-geolocation-service';
import SingleActionModal from '../../../components/SingleActionModal';
import useGuideStatus from '../../hooks/queries/useGuideStatus';
import HeartFaceIcon from '../../../assets/icons/HeartFaceIcon.svg';
import SmileFaceIcon from '../../../assets/icons/SmileFaceIcon.svg';
import CompassIcon from '../../../assets/icons/CompassIcon.svg';
import WarningIcon from '../../../assets/icons/WarningIcon.svg';
import useAuthStore from '../../../store/authStore';

const ShuttleDetail = ({navigation}) => {
  const [isBeforeSchool, setIsBeforeSchool] = useState(true);
  const [guideModalVisible, setGuideModalVisible] = useState(false);
  const [warnModalVisible, setWarnModalVisible] = useState(false);
  const [startGuideModalVisible, setStartGuideModalVisible] = useState(false);
  const [stopGuideModalVisible, setStopGuideModalVisible] = useState(false);

  const {userId} = useAuthStore();
  // today 날짜
  const formattedDate = formatDate();
  const insets = useSafeAreaInsets();

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      await Geolocation.requestAuthorization('whenInUse');
    } else {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      console.log('granted:', granted);
      if (granted == PermissionsAndroid.RESULTS.GRANTED) {
        console.log(PermissionsAndroid.RESULTS.GRANTED);
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION
        );
        if (granted == PermissionsAndroid.RESULTS.GRANTED) {
          console.log(PermissionsAndroid.RESULTS.GRANTED);
          useMutateGuideActive.mutate(undefined, {
            onSuccess: () => {
              setStartGuideModalVisible(true);
            },
          });
        } else {
          setWarnModalVisible(true);
        }
      } else {
        console.log('Permission denied');
        // 정확한 위치 정보를 허용해야 한다는 모달 띄우기.
        setWarnModalVisible(true);
      }
    }
  };
  
  const checkLocationPermission = async () => {
    const check = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION);
    console.log('check:', check);
    return check;
  }
  // 인솔자가 배정된 그룹 정보 불러오기
  const { data: groupInfo, isPending: groupInfoIsPending, isSuccess: groupInfoIsSuccess } = useGroupInfo();

  // 각 경유지 정보 불러오기
  const { data: waypoints, isPending: waypointsIsPending, isSuccess: waypointsIsSuccess } = useWaypoints();

  // 출근 상태 불러오기
  const { data: guideStatus } = useGuideStatus();

  const lastWaypointAttendanceComplete = waypointsIsSuccess && waypoints[waypoints.length - 2].attendanceComplete;

  // 인솔자 출근/퇴근 API 호출
  const useMutateGuideActive = useStartGuide(groupInfo?.id);

  const useMutateGuideDeactive = useStopGuide(groupInfo?.id);

  const onGuideButtonPress = async() => {
    if (guideStatus.isGuideActive) {
      useMutateGuideDeactive.mutate(undefined, {
        onSuccess: () => {
          setStopGuideModalVisible(true);
        },
      });
      setStopGuideModalVisible(true);
      return;
    }

    if (!guideStatus.isGuideActive) {
      const hasLocationPermission = await checkLocationPermission();
      if (hasLocationPermission) {
        useMutateGuideActive.mutate(undefined, {
          onSuccess: () => {
            setStartGuideModalVisible(true);
          },
        });
      } else {
        setGuideModalVisible(true);
      }
      return;
    }
  }

  // WebSocket 구독
  useWebSocketSubscription(groupInfo);

  return (
    groupInfo && guideStatus &&
    <View 
      style={{backgroundColor: colors.White_Green, flex:1, paddingBottom: insets.bottom, paddingTop: insets.top}}>
      <SingleActionModal
        modalVisible={guideModalVisible}
        setModalVisible={setGuideModalVisible}
        icon={<CompassIcon />}
        title={
        <Text>
          {`정확한 위치 정보 접근 권한을\n`}
          <Text style={{color: colors.Red}}>
          {`"항상 허용"`}
          </Text> 
          {` 해주세요!`}
        </Text>}
        subtitle={'운행 중 학부모님들께 위치 정보를 \n제공하기 위해 권한 허용이 필요합니다'}
        confirmTitle={'확인'}
        onConfirm={() => {
          requestLocationPermission();
          setGuideModalVisible(false);
        }}
      />
      <SingleActionModal
        modalVisible={warnModalVisible}
        setModalVisible={setWarnModalVisible}
        icon={<WarningIcon />}
        title={
        <Text>
          {`정확한 위치 정보 접근 권한이\n`}
          <Text style={{color: colors.Red}}>
          {`"항상 허용"`}
          </Text> 
          {`으로 설정되어야\n출근할 수 있어요`}
        </Text>
        }
        confirmTitle={'확인'}
        onConfirm={() => {
          setWarnModalVisible(false);
        }}
      />
      <SingleActionModal
        modalVisible={startGuideModalVisible}
        setModalVisible={setStartGuideModalVisible}
        icon={<SmileFaceIcon />}
        title={'워킹스쿨버스 운행을 시작합니다!'}
        subtitle={'지금부터 퇴근 전까지 보호자에게 \n위치가 공유됩니다'}
        confirmTitle={'확인'}
        onConfirm={() => {
          setStartGuideModalVisible(false);
        }}
      />
      <SingleActionModal
        modalVisible={stopGuideModalVisible}
        setModalVisible={setStopGuideModalVisible}
        icon={<HeartFaceIcon />}
        title={'워킹스쿨버스 운행을 종료합니다!'}
        subtitle={'이제 위치 공유가 중단됩니다.\n오늘도 수고하셨습니다 :)'}
        confirmTitle={'확인'}
        onConfirm={() => {
          // useMutateGuideDeactive.mutate();
          setStopGuideModalVisible(false);
        }}
        isBackgroundclosable={false}
      />
      <CustomHeader 
        title={groupInfo.schoolName} 
        subtitle={groupInfo.groupName}
        headerRight={<MapIcon/>} 
        onPressRightButton={() => navigation.navigate('ShuttleMap', {waypoints})}
      />
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
        <CustomButton title={guideStatus.isGuideActive ? (guideStatus.dutyGuardianId == userId ? (lastWaypointAttendanceComplete ? '퇴근하기'  : '아직 운행중이에요'): '아직 운행중이에요') : '출근하기'} onPress={() => {onGuideButtonPress()}} disabled={guideStatus.isGuideActive && (!lastWaypointAttendanceComplete || guideStatus.dutyGuardianId !== userId)}/>
      </View>
    </View>
  );
};

export default ShuttleDetail;