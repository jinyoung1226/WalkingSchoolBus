import React, {useLayoutEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import GroupMain from '../Screens/Group/GroupMain';
import GroupDetail from '../Screens/Group/GroupDetail';
import useTabBarStore from '../../store/tabBarStore';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import BackIcon from '../../assets/icons/BackIcon.svg';
import useGroupTabStore from '../parentStore/groupTabStore';

const Stack = createStackNavigator();

const GroupTab = ({route}) => {
  // Zustand 스토어에서 showTabBar, hideTabBar 함수 가져오기
  const {showTabBar, hideTabBar} = useTabBarStore();
  const {showGroupTab, hideGroupTab, isGroupTabVisible} = useGroupTabStore();
  // Stack이 쌓이기 전에 Main 이외의 화면은 Tab이 안 보이게 설정
  // useLayoutEffect(() => {
  //   const routeName = getFocusedRouteNameFromRoute(route);
  //   if (routeName === 'GroupMain' || routeName === undefined) {
  //     showTabBar();
  //   } else {
  //     hideTabBar();
  //   }
  // }, [route]);

  return isGroupTabVisible ? (
    <Stack.Navigator
      screenOptions={{
        headerBackImage: () => (
          <BackIcon width={24} height={24} /> // 사용자 정의 아이콘
        ),
      }}>
      <Stack.Screen name="GroupMain1" component={GroupMain} />
      <Stack.Screen name="GroupDetail1" component={GroupDetail} />
    </Stack.Navigator>
  ) : null;
};

export default GroupTab;
