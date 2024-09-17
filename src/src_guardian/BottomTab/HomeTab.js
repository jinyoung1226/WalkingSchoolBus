import React, {useLayoutEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HomeMain from '../Screens/Home/HomeMain';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import useTabBarStore from '../../store/tabBarStore';
import HomeDetail from '../Screens/Home/HomeDetail';
const Stack = createStackNavigator();

const HomeTab = ({route}) => {
  // Zustand 스토어에서 showTabBar, hideTabBar 함수 가져오기
  const {showTabBar, hideTabBar} = useTabBarStore();

  // Stack이 쌓이기 전에 Main 이외의 화면은 Tab이 안 보이게 설정
  useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (routeName === 'HomeMain' || routeName === undefined) {
      showTabBar();
    } else {
      hideTabBar();
    }
  }, [route]);

  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeMain" component={HomeMain} />
      <Stack.Screen name="HomeDetail" component={HomeDetail} />
    </Stack.Navigator>
  );
};

export default HomeTab;
