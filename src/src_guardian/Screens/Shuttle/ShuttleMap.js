import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import WebView from 'react-native-webview';
import Geolocation from 'react-native-geolocation-service';

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
    </View>
  );
};

export default ShuttleMap;




