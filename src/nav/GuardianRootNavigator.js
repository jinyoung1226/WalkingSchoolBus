import React, {useEffect} from 'react';
import { Alert, Linking, PermissionsAndroid } from 'react-native';
import MainNavigator from '../src_guardian/nav/MainNavigator';
import AuthNavigator from '../src_guardian/nav/AuthNavigator';
import useAuthStore from '../store/authStore';
import useWebsocketStore from '../store/websocketStore';
import Geolocation from 'react-native-geolocation-service';
const GuardianRootNavigator = () => {
  const {isAuthenticated} = useAuthStore();
  const {connectWebSocket, disconnectWebSocket, isConnected} = useWebsocketStore();

  // WebSocket 연결/해제 useEffect hook
  useEffect(() => {
    // const requestLocationPermission = async () => {
    //   if (Platform.OS === 'ios') {
    //     await Geolocation.requestAuthorization('whenInUse');
    //   } else {
    //     const granted = await PermissionsAndroid.request(
    //       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    //     );
    //     console.log('granted:', granted);
    //     if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
    //       console.log(PermissionsAndroid.RESULTS.GRANTED);

    //       Alert.alert(
    //         '위치 정보 사용 권한 필요',
    //         '정확한 위치 정보가 필요합니다. 권한을 허용해주세요.',
    //         [
    //           { text: '취소', onPress: () => console.log('Permission denied') },
    //           { text: '설정으로 이동', onPress: reReuquest },
    //         ],
    //         { cancelable: false }
    //       );
    //     }
    //   }
    // };
  
    // // 설정 화면으로 이동하는 함수
    // const reReuquest = async() => {
    //   const granted = await PermissionsAndroid.request(
    //     PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    //   );
    //   console.log('granted:', granted);
    //   if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
    //     console.log(PermissionsAndroid.RESULTS.GRANTED);

    //     Alert.alert(
    //       '위치 정보 사용 권한 필요',
    //       '정확한 위치 정보가 필요합니다. 설정으로 이동하여 위치 권한을 허용해 주세요.',
    //       [
    //         { text: '취소', onPress: () => console.log('Permission denied') },
    //         { text: '설정으로 이동', onPress: openSettings },
    //       ],
    //       { cancelable: false }
    //     );
    //   }
    // };

    // const openSettings = () => {
    //   Linking.openSettings().catch(() => {
    //     Alert.alert('설정 화면을 열 수 없습니다.');
    //   });
    // };

    if (isAuthenticated) {
      connectWebSocket();
    }

    return () => {
      if (isAuthenticated) {
        disconnectWebSocket();
      }
    };
  }, [isAuthenticated]);

  useEffect(() => {
    console.log('isConnected 상태 변경:', isConnected);
  }, [isConnected]);

  return (isAuthenticated ? 
    <MainNavigator /> 
    : 
    <AuthNavigator />
  );
};

export default GuardianRootNavigator;
