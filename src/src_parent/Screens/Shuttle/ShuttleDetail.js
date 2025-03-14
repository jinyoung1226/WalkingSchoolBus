import { useEffect, useRef, useState } from 'react';
import { Pressable, TouchableOpacity, View } from 'react-native';
import WebView from 'react-native-webview';
import Geolocation from 'react-native-geolocation-service';
import MyLocationIcon from '../../../assets/icons/MyLocationIcon.svg';
import CustomHeader from '../../../components/CustomHeader';
import { colors } from '../../../styles/globalStyle';
import useWebsocketStore from '../../../store/websocketStore';

import useParentGroupInfo from '../../hooks/queries/useParentGroupInfo';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ShuttleDetail = ({ route }) => {
  const initialLocationRef = useRef(null);
  const {groupInfo, waypoints} = route.params;
  const insets = useSafeAreaInsets();
  const webviewRef = useRef(null);
  

  const { subscribeToLocationChannel, unsubscribeToLocationChannel } = useWebsocketStore();

  const extractedWaypoints = (waypoints || []).map(waypoint => ({
    waypointName: waypoint.waypointName,
    latitude: waypoint.latitude,
    longitude: waypoint.longitude,
  }));

  useEffect(() => {
    const channel = `/sub/group/${groupInfo.id}/location`;
    const callback = (message) => {
      const newMessage = JSON.parse(message.body);
      console.log(newMessage, '@@@@@@@@@@');
      const { latitude, longitude } = newMessage;
      const newLocation = { latitude, longitude };
        if (webviewRef.current) {
          webviewRef.current.postMessage(JSON.stringify(newLocation));
        }
    }
    subscribeToLocationChannel({ channel, callback });
    return () => {
      unsubscribeToLocationChannel();
    };
  }, []);

  // 버튼 클릭 시, 자기 위치(인솔자 현 위치)로 지도의 중심이 이동되도록 Webview로 메시지 전송
  const handleCenterOnGuide = () => {
    if (webviewRef.current) {
      webviewRef.current.postMessage(JSON.stringify({action : 'centerMapOnGuide'}));
    }
  }

  const url = `https://donghang-map.vercel.app?waypoints=${encodeURIComponent(
    JSON.stringify(extractedWaypoints),
  )}&initialLocation=${encodeURIComponent(JSON.stringify({latitude: 37.5576, longitude: 127.0403}))}`;

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