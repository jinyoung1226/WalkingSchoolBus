import {useCallback, useEffect, useState} from 'react';
import {Alert, PermissionsAndroid, Platform, Text, TouchableOpacity, View} from 'react-native';
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
import useAuthStore from '../../../store/authStore';
import { check, openSettings, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import { useFocusEffect } from '@react-navigation/native';

const ShuttleDetail = ({navigation}) => {
  const [isBeforeSchool, setIsBeforeSchool] = useState(true);
  const [guideModalVisible, setGuideModalVisible] = useState(false);
  const [warnModalVisible, setWarnModalVisible] = useState(false);
  const [stopGuideModalVisible, setStopGuideModalVisible] = useState(false);

  const {userId} = useAuthStore();
  // today 날짜
  const formattedDate = formatDate();
  const insets = useSafeAreaInsets();

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const permissionStatus = await request(PERMISSIONS.IOS.LOCATION_ALWAYS);
      if (permissionStatus === RESULTS.GRANTED) {
        console.log(PermissionsAndroid.RESULTS.GRANTED);
        useMutateGuideActive.mutate();
      } else {
        setWarnModalVisible(true); 
      }
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
          useMutateGuideActive.mutate();
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
    if (Platform.OS === 'ios') {
      // iOS에서 위치 권한 확인 및 요청
      let permissionStatus = await check(PERMISSIONS.IOS.LOCATION_ALWAYS);

      switch (permissionStatus) {
          case RESULTS.UNAVAILABLE:
              console.log("Location permission is unavailable on this device.");
              Alert.alert("권한 없음", "이 장치에서는 위치 권한을 사용할 수 없습니다.");
              return false;

        case RESULTS.DENIED:
          console.log("Location permission is denied, requesting permission.");
          return false;

          case RESULTS.GRANTED:
              console.log("Location permission is granted.");
              return true;

          case RESULTS.BLOCKED:
              console.log("Location permission is blocked. Opening settings.");
              return false;

          default:
              return false;
      }
  } else {
      const check = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION);
    console.log('check:', check);
    return check;
    }
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
      useMutateGuideDeactive.mutate();
      setStopGuideModalVisible(true);
      return;
    }

    if (!guideStatus.isGuideActive) {
      const hasLocationPermission = await checkLocationPermission();
      if (hasLocationPermission) {
        useMutateGuideActive.mutate();
      } else {
        setGuideModalVisible(true);
      }
      return;
    }
  }

  // useFocusEffect(
  //   useCallbackr(() => {
  //     const verifyPermissionAndStartGuide = async () => {
  //       const hasPermission = await checkLocationPermission();
  //       if (hasPermission && guideStatus && !guideStatus.isGuideActive) {
  //         useMutateGuideActive.mutate();
  //       }
  //     };
  //     verifyPermissionAndStartGuide();
  //   }, [guideStatus])
  // );
  

  // WebSocket 구독
  useWebSocketSubscription(groupInfo);

  return (
    groupInfo && guideStatus &&
    <View 
      style={{backgroundColor: colors.White_Green, flex:1, paddingBottom: insets.bottom, paddingTop: insets.top}}>
      <SingleActionModal
        modalVisible={guideModalVisible}
        setModalVisible={setGuideModalVisible}
        title={'위치정보를 "항상 허용" 해주세요!'}
        subtitle={'학부모님들께 정확한 아이들의 위치를 제공하기 위해 권한 허용이 필요합니다.'}
        confirmTitle={'확인'}
        onConfirm={() => {
          requestLocationPermission();
          setGuideModalVisible(false);
        }}
      />
      <SingleActionModal
        modalVisible={warnModalVisible}
        setModalVisible={setWarnModalVisible}
        title={'정확한 위치정보 권한을 "항상 허용" 하지 않으면 출근할 수 없어요!'}
        subtitle={'학부모님들께 정확한 아이들의 위치를 제공하기 위해 권한 허용이 필요합니다.'}
        confirmTitle={'확인'}
        onConfirm={() => {
          setWarnModalVisible(false);
          Alert.alert(
            "위치 권한 필요",
            '정확환 아이들의 위치를 제공하기 위해 설정 화면에서 "항상"으로 변경해 주세요.',
            [
                { text: "취소", style: "cancel" },
                { text: "설정으로 이동", onPress: () => openSettings() },
            ]
          );

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