import React, {useLayoutEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import RecruitMain from '../Screens/Recruit/RecruitMain';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import useTabBarStore from '../../store/tabBarStore';

const Stack = createStackNavigator();

const RecruitTab = ({route}) => {
  // Zustand 스토어에서 showTabBar, hideTabBar 함수 가져오기
  const {showTabBar, hideTabBar} = useTabBarStore();

  // Stack이 쌓이기 전에 Main 이외의 화면은 Tab이 안 보이게 설정
  useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (routeName === 'RecruitMain' || routeName === undefined) {
      showTabBar();
    } else {
      hideTabBar();
    }
  }, [route]);

  return (
    <Stack.Navigator>
      <Stack.Screen name="Recruit" component={RecruitMain} />
    </Stack.Navigator>
  );
};

export default RecruitTab;
