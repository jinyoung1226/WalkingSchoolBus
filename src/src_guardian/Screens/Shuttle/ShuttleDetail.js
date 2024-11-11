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
import SmileFaceIcon from '../../../assets/icons/SmileFaceIcon.svg';
import CompassIcon from '../../../assets/icons/CompassIcon.svg';
import WarningIcon from '../../../assets/icons/WarningIcon.svg';
import useAuthStore from '../../../store/authStore';
import { check, openSettings, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import { useFocusEffect } from '@react-navigation/native';
import ConfirmModal from '../../../components/ConfirmModal';
import { useQueryClient } from '@tanstack/react-query';

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
  const queryClient = useQueryClient();

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
      setStopGuideModalVisible(true);
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
      <ConfirmModal
        modalVisible={stopGuideModalVisible}
        setModalVisible={setStopGuideModalVisible}
        icon={<HeartFaceIcon />}
        title={'워킹스쿨버스 운행을 종료합니다!'}
        subtitle={
          <Text 
          style={[
            textStyles.R1,
            {color: colors.Gray05, textAlign: 'center'},
          ]}>
            {'확인 버튼을 누르면 운행이\n종료되고 위치 공유가 중단됩니다'}
          </Text>
          }
        confirmTitle={'확인'}
        onConfirm={() => {
          useMutateGuideDeactive.mutate(undefined, {
            onSuccess: () => {
              setStopGuideModalVisible(false);
              queryClient.invalidateQueries('waypoints');
            },
          });
        }}
        cancelTitle={'취소'}
        onCancel={() => {
          setStopGuideModalVisible(false);
        }}
      />
      <CustomHeader 
        title={groupInfo.schoolName} 
        subtitle={groupInfo.groupName}
        headerRight={<MapIcon/>} 
        onPressRightButton={() => {
          if (guideStatus.isGuideActive) {
            navigation.navigate('ShuttleMap', {waypoints})
          }
          if (!guideStatus.isGuideActive) {
            Alert.alert('운행시작 전에는 위치정보를 확인할 수 없습니다.')
          }
        }}
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
        <CustomButton title={guideStatus.isGuideActive ? (guideStatus.dutyGuardianId == userId ? (lastWaypointAttendanceComplete ? '운행 종료하기'  : '아직 운행중이에요'): '아직 운행중이에요') : guideStatus.shuttleStatus ? '오늘 운행이 종료되었어요' : '운행 시작하기'} onPress={() => {onGuideButtonPress()}} />
      </View>
    </View>
  );
};

export default ShuttleDetail;