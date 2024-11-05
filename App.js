import React, { useEffect } from 'react';
import {NavigationContainer} from '@react-navigation/native';
import RootNavigator from './src/nav/RootNavigator';
import * as encoding from 'text-encoding';
import BootSplash from "react-native-bootsplash";
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useAuthStore from './src/store/authStore';

const App = () => {
  const {setUserType} = useAuthStore();

  const getFcmToken = async () => {
    try {
      const fcmToken = await messaging().getToken();
      await AsyncStorage.setItem('fcmToken', fcmToken);
      console.log(fcmToken, 'fcmToken');
    } catch (error) {
      console.error('Failed to get FCM token:', error);
    }
  };
  const getUserType = async () => {
    const userType = await AsyncStorage.getItem('userType');
    if (userType) {
      console.log('userType:', userType);
      setUserType(userType, false);
    } else {
      setUserType(null, false);
    }
  };
  useEffect(() => {
    const init = async () => {
      Platform.OS === 'ios' && await iosRequestPermission();
      // getFcmToken();
      getUserType();
      // …do multiple sync or async tasks
    };
    init().finally(async () => {
      await BootSplash.hide({ fade: true });
      console.log("BootSplash has been hidden successfully");
    });
  }, []);

  const iosRequestPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      const apnsToken = await messaging().getAPNSToken();
      if (apnsToken) {
        getFcmToken();
      }
      console.log('Authorization status:', authStatus);
    } else {
      console.log('Permission denied');
    }
  };

  return (
      <RootNavigator />
  );
};

export default App;
