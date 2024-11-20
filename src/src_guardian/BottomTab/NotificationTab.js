import React, {useLayoutEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import useTabBarStore from '../../store/tabBarStore';
import BackIcon from '../../assets/icons/BackIcon.svg';
import NotiMain from '../Screens/Noitfication/NotiMain';
import { colors, textStyles } from '../../styles/globalStyle';
import { TouchableOpacity } from 'react-native';

const Stack = createStackNavigator();

const NotificationTab = ({route}) => {
  // Zustand 스토어에서 showTabBar, hideTabBar 함수 가져오기
  const {showTabBar, hideTabBar} = useTabBarStore();

  // Stack이 쌓이기 전에 Main 이외의 화면은 Tab이 안 보이게 설정
  useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    console.log(routeName);
    if (routeName === 'NotiMain' || routeName === undefined) {
      showTabBar();
    } else {
      hideTabBar();
    } 
  }, [route]);

  return (
    <Stack.Navigator>
      <Stack.Screen name="NotiMain" component={NotiMain} options={{title: "알림 센터"}}/>
    </Stack.Navigator>
  );
};

export default NotificationTab;
