import { useEffect, useRef, useState } from 'react';
import { Pressable, TouchableOpacity, View } from 'react-native';
import WebView from 'react-native-webview';
import Geolocation from 'react-native-geolocation-service';
import MyLocationIcon from '../../../assets/icons/MyLocationIcon.svg';
import CustomHeader from '../../../components/CustomHeader';
import { colors } from '../../../styles/globalStyle';
import useWebsocketStore from '../../../store/websocketStore';
import useWaypoints from '../../../src_guardian/hooks/queries/useWaypoints';
import useParentGroupInfo from '../../hooks/queries/useParentGroupInfo';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ShuttleDetail = ({ route }) => {
  const [initialLocation, setInitialLocation] = useState(null);
  // const { waypoints } = route.params;
  const insets = useSafeAreaInsets();
  const webviewRef = useRef(null);
  const { data: groupInfo, isPending: groupInfoIsPending, isSuccess: groupInfoIsSuccess } = useParentGroupInfo();
  const { data: waypoints, isPending: waypointsIsPending, isSuccess: waypointsIsSuccess } = useWaypoints();

  const { subscribeToLocationChannel, unsubscribeToLocationChannel } = useWebsocketStore();

  const extractedWaypoints = (waypoints || []).map(waypoint => ({
    waypointName: waypoint.waypointName,
    latitude: waypoint.latitude,
    longitude: waypoint.longitude,
  }));

  useEffect(() => {
    if (groupInfo) {
      const channel = `/sub/group/${groupInfo.id}/location`;
      const callback = (message) => {
        const newMessage = JSON.parse(message.body);
        console.log(newMessage, '@@@@@@@@@@');
        const { latitude, longitude } = newMessage;
        setInitialLocation({ latitude, longitude });
        const newLocation = { latitude, longitude };
          if (webviewRef.current) {
            webviewRef.current.postMessage(JSON.stringify(newLocation));
          }
      }
      subscribeToLocationChannel({ channel, callback });
    }
    return () => {
      unsubscribeToLocationChannel();
    };
  }, [groupInfo]);

  // 버튼 클릭 시, 자기 위치(인솔자 현 위치)로 지도의 중심이 이동되도록 Webview로 메시지 전송
  const handleCenterOnGuide = () => {
    if (webviewRef.current) {
      webviewRef.current.postMessage(JSON.stringify({action : 'centerMapOnGuide'}));
    }
  }

  if (!initialLocation) {
    return null; // 초기 위치를 얻기 전까지는 WebView를 렌더링하지 않음
  }

  const url = `https://donghang-map.vercel.app?waypoints=${encodeURIComponent(
    JSON.stringify(extractedWaypoints),
  )}&initialLocation=${encodeURIComponent(JSON.stringify(initialLocation))}`;

  return (
    <View style={{backgroundColor: colors.White_Green, flex:1, paddingBottom: insets.bottom, paddingTop: insets.top}}>
      <CustomHeader title="운행" />
      <View style={{flex:1}}>
      <WebView
        ref={webviewRef}
        originWhitelist={['*']}
        javaScriptEnabled={true}
        source={{ uri: url }}
        style={{flex:1}}
      />
      </View>
      <TouchableOpacity style={{position: 'absolute', bottom: 32, right:32}} 
      onPress={handleCenterOnGuide} 
      >
        <MyLocationIcon/>
      </TouchableOpacity>
    </View>
  );
};

export default ShuttleDetail;