import React, { useEffect } from 'react';
import {NavigationContainer} from '@react-navigation/native';
import RootNavigator from './src/nav/RootNavigator';
import * as encoding from 'text-encoding';
import BootSplash from "react-native-bootsplash";
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import notifee, { AndroidImportance, AndroidVisibility, EventType } from '@notifee/react-native';
import useAuthStore from './src/store/authStore';
import { Platform, PermissionsAndroid } from 'react-native';

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

  const onMessageReceived = async (message) => {
    console.log('message:', message);
    await notifee.requestPermission()

    const channelId = await notifee.createChannel({
      id: 'important',
      name: 'Important Notifications',
      importance: AndroidImportance.HIGH,
    });

    if (message.data.type === 'START_WORK_PARENT') {
      notifee.displayNotification({
        title: message.notification.title,
        body: message.notification.body,
        data: { type: message.data.type },
        android: {
          channelId: channelId,
          smallIcon: 'ic_launcher',
          importance: AndroidImportance.HIGH,
          visibility: AndroidVisibility.PUBLIC,
        },
      })
    }

    if (message.data.type === 'START_WORK_GUARDIAN') {
      notifee.displayNotification({
        title: message.notification.title,
        body: message.notification.body,
        data: { type: message.data.type },
        android: {
          channelId: channelId,
          smallIcon: 'ic_launcher',
          importance: AndroidImportance.HIGH,
          visibility: AndroidVisibility.PUBLIC,
        },
      })
    }

    if (message.data.type === 'END_WORK_PARENT') {
      notifee.displayNotification({
        title: message.notification.title,
        body: message.notification.body,
        data: { type: message.data.type },
        android: {
          channelId: channelId,
          smallIcon: 'ic_launcher',
          importance: AndroidImportance.HIGH,
          visibility: AndroidVisibility.PUBLIC,
        },
      })
    }

    if (message.data.type === 'END_WORK_GUARDIAN') {
      notifee.displayNotification({
        title: message.notification.title,
        body: message.notification.body,
        data: { type: message.data.type },
        android: {
          channelId: channelId,
          smallIcon: 'ic_launcher',
          importance: AndroidImportance.HIGH,
          visibility: AndroidVisibility.PUBLIC,
        },
      })
    }

    if (message.data.type === 'PICKUP') {
      notifee.displayNotification({
        title: message.notification.title,
        body: message.notification.body,
        data: { type: message.data.type },
        android: {
          channelId: channelId,
          smallIcon: 'ic_launcher',
          importance: AndroidImportance.HIGH,
          visibility: AndroidVisibility.PUBLIC,
        },
      })
    }
    // if (message.data.type === 'FEEDBACK') {
    //   notifee.displayNotification({
    //     title: message.notification.title,
    //     body: message.notification.body,
    //     data: { type: message.data.type, meetingId: message.data.meetingId, courseId: message.data.courseId, meetingTitle: message.data.meetingTitle },
    //     android: {
    //       channelId: channelId,
    //       smallIcon: 'ic_launcher',
    //       importance: AndroidImportance.HIGH,
    //       visibility: AndroidVisibility.PUBLIC,
    //     },
    //   })
    // }
  };

  

  useEffect(() => {
    const init = async () => {
      Platform.OS === 'ios' 
      ? await iosRequestPermission() 
      : await androidRequestPermission();
      // getFcmToken();
      getUserType();
      // …do multiple sync or async tasks
    };
    init().finally(async () => {
      await BootSplash.hide({ fade: true });
      console.log("BootSplash has been hidden successfully");
    });
    const foregroundEvent = notifee.onForegroundEvent(async ({ type, detail }) => {
      switch (type) {
        case EventType.PRESS:
          if (detail.notification.data.type === 'JOIN_REQUEST') {
            Linking.openURL('drivel://meet/applyDetail');
          }
          if (detail.notification.data.type === 'JOIN_ACCEPTED') {
            Linking.openURL('drivel://meet/meetDetail/' + detail.notification.data.meetingId + '/' + detail.notification.data.courseId + '/' + detail.notification.data.meetingTitle);
          }
          if (detail.notification.data.type === 'JOIN_REJECTED') {
            Linking.openURL('drivel://meet');
          }
          if (detail.notification.data.type === 'FEEDBACK') {
            Linking.openURL('drivel://meet/meetDetail/' + detail.notification.data.meetingId + '/' + detail.notification.data.courseId + '/' + detail.notification.data.meetingTitle);
          }
          break;
        case EventType.DISMISSED:
          console.log('User dismissed notification');
          break;
      }
    });
    const unsubscribe = messaging().onMessage(onMessageReceived);
    return () => {
      unsubscribe(); // FCM 메시지 핸들러 클린업
      foregroundEvent(); // Notifee 포그라운드 이벤트 클린업
    }

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

  const androidRequestPermission = async () => {
    const authorizationStatus = await messaging().requestPermission();
    console.log('authorizationStatus:', authorizationStatus);
    try {
      getFcmToken();
      if (Platform.OS === 'android') {
        if (Platform.Version >= 33) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Android 13이상 , 알림권한 허용.');
          }
        }
      }
    } catch (error) {
      console.log('Android error:', error);
    }
  };

  return (
      <RootNavigator />
  );
};

export default App;
