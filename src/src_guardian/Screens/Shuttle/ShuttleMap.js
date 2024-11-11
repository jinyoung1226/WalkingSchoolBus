import { useEffect, useRef, useState } from 'react';
import { Pressable, TouchableOpacity, View } from 'react-native';
import WebView from 'react-native-webview';
import Geolocation from 'react-native-geolocation-service';
import MyLocationIcon from '../../../assets/icons/MyLocationIcon.svg';
import CustomHeader from '../../../components/CustomHeader';
import { colors } from '../../../styles/globalStyle';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ShuttleMap = ({ route }) => {
  const [initialLocation, setInitialLocation] = useState(null);
  const { waypoints } = route.params;
  const webviewRef = useRef(null);
  const insets = useSafeAreaInsets();
  
  const extractedWaypoints = waypoints.map(waypoint => ({
    waypointName: waypoint.waypointName,
    latitude: waypoint.latitude,
    longitude: waypoint.longitude,
  }));

  useEffect(() => {
    // 초기 위치 가져오기
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setInitialLocation({ latitude, longitude });
      },
      error => {
        console.log(error);
      },
      { enableHighAccuracy: true, maximumAge: 10000 },
    );
  }, []);

  useEffect(() => {
    if (initialLocation) {
      // 위치 변경 시 WebView로 전송
      const watchId = Geolocation.watchPosition(
        position => {
          const { latitude, longitude } = position.coords;
          const newLocation = { latitude, longitude };
          if (webviewRef.current) {
            webviewRef.current.postMessage(JSON.stringify(newLocation));
          }
        },
        error => {
          console.log(error);
        },
        { enableHighAccuracy: true, distanceFilter: 1 },
      );

      return () => {
        Geolocation.clearWatch(watchId);
      };
    }
  }, [initialLocation]);

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
      <TouchableOpacity style={{position: 'absolute', bottom: 32, right:32}} onPress={handleCenterOnGuide} >
        <MyLocationIcon/>
      </TouchableOpacity>
    </View>
  );
};

export default ShuttleMap;




