import { useEffect, useState } from 'react';
import Geolocation from 'react-native-geolocation-service';
import useShuttleStore from '../../guardianStore/useShuttleStore';
import useWebsocketStore from '../../../store/websocketStore';
import useGroupInfo from '../queries/useGroupInfo';
import useAuthStore from '../../../store/authStore';
import AsyncStorage from '@react-native-async-storage/async-storage';


const useLocationTracking = () => {
  const { isAuthenticated } = useAuthStore();
  const { isGuideActive: localIsGuideActive } = useShuttleStore();
  const { data: groupInfo } = useGroupInfo();
  const { publishLocation } = useWebsocketStore();
  const [isGuideActive, setIsGuideActive] = useState(false);

  useEffect(() => {
    if (localIsGuideActive !== null) {
      setIsGuideActive(localIsGuideActive);
    } else {
      const fetchIsGuideActive = async () => {
        try {
          const storedValue = await AsyncStorage.getItem('isGuideActive');
          setIsGuideActive(storedValue === 'true');
          console.log('Fetched isGuideActive from AsyncStorage:', storedValue);
        } catch (error) {
          console.error('Error fetching isGuideActive:', error);
        }
      };
  
      fetchIsGuideActive();
    }
    let intervalId = null;

    if (isGuideActive && isAuthenticated && groupInfo) {
      
      console.log('운행 시작: 위치 정보를 2초마다 전송합니다.');

      // 위치 정보를 2초마다 퍼블리싱
      intervalId = setInterval(() => {
        Geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const currentLocation = {
              destination: `/pub/group/${groupInfo.id}/location`,
              header: 'application/json',
              latitude: latitude,
              longitude: longitude,
            };
            console.log('Publishing location:', currentLocation);
            publishLocation(currentLocation); // 위치 퍼블리싱
          },
          (error) => {
            console.error('Error fetching location:', error);
          },
          {
            enableHighAccuracy: true,
          }
        );
      }, 2000); // 2초마다 실행
    } else {
      console.log('운행 종료: 위치 전송 중단');
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
    }

    return () => {
      // 컴포넌트 언마운트 시 정리
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
    };
  }, [isGuideActive, isAuthenticated, groupInfo, localIsGuideActive]);
};

export default useLocationTracking;
