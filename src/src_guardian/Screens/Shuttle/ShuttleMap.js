import { useEffect, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import WebView from 'react-native-webview';
import Geolocation from 'react-native-geolocation-service';
import MyLocationIcon from '../../../assets/icons/MyLocationIcon.svg';

const ShuttleMap = ({ route }) => {
  const [initialLocation, setInitialLocation] = useState(null);
  const { waypoints } = route.params;
  const webviewRef = useRef(null);

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
    <View style={{ flex: 1 }}>
      <WebView
        ref={webviewRef}
        originWhitelist={['*']}
        javaScriptEnabled={true}
        source={{ uri: url }}
        style={{ flex: 1 }}
      />
      <Pressable onPress={handleCenterOnGuide} >
        <MyLocationIcon/>
      </Pressable>
    </View>
  );
};

export default ShuttleMap;




