import React, {useLayoutEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import useTabBarStore from '../../store/tabBarStore';
import BackIcon from '../../assets/icons/BackIcon.svg';
import ShuttleMain from '../Screens/Shuttle/ShuttleMain';
import ShuttleDetail from '../Screens/Shuttle/ShuttleDetail';
const Stack = createStackNavigator();

const ShuttleTab = ({route}) => {
  // Zustand 스토어에서 showTabBar, hideTabBar 함수 가져오기
  const {showTabBar, hideTabBar} = useTabBarStore();

  // Stack이 쌓이기 전에 Main 이외의 화면은 Tab이 안 보이게 설정
  useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (routeName === 'ShuttleMain' || routeName === undefined) {
      showTabBar();
    } else {
      hideTabBar();
    }
  }, [route]);

  return (
    <Stack.Navigator
      screenOptions={{
        headerBackImage: () => (
          <BackIcon width={24} height={24} /> // 사용자 정의 아이콘
        ),
      }}>
      <Stack.Screen name="ShuttleMain" component={ShuttleMain} />
      <Stack.Screen name="ShuttleDetail" component={ShuttleDetail} options={{headerShown:false}}/>
    </Stack.Navigator>
  );
};

export default ShuttleTab;
