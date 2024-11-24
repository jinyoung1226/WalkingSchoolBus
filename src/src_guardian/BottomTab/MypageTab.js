import React, {useLayoutEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import MypageMain from '../Screens/Mypage/MypageMain';
import useTabBarStore from '../../store/tabBarStore';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import BackIcon from '../../assets/icons/BackIcon.svg';

import ShuttleMain from '../Screens/Shuttle/ShuttleMain';
import ShuttleDetail from '../Screens/Shuttle/ShuttleDetail';
import ShuttleMap from '../Screens/Shuttle/ShuttleMap';
import ShuttleStudentsList from '../Screens/Shuttle/ShuttleStudentsList';
import StudentDetail from '../Screens/Shuttle/StudentDetail';
import MessageList from '../Screens/Shuttle/MessageList';
import NotiMain from '../Screens/Noitfication/NotiMain';
import MypageDetail from '../Screens/Mypage/MypageDetail';

const Stack = createStackNavigator();

const MypageTab = ({route}) => {
  // Zustand 스토어에서 showTabBar, hideTabBar 함수 가져오기
  const {showTabBar, hideTabBar} = useTabBarStore();

  // Stack이 쌓이기 전에 Main 이외의 화면은 Tab이 안 보이게 설정
  useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (routeName === 'MypageMain' || routeName === undefined) {
      showTabBar();
    } else {
      hideTabBar();
    }
  }, [route]);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerBackImage: () => (
          <BackIcon width={24} height={24} /> // 사용자 정의 아이콘
        ),
      }}>
      <Stack.Screen name="MypageMain" component={MypageMain} />
      <Stack.Screen
        name="MypageDetail"
        component={MypageDetail}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ShuttleDetail3"
        component={ShuttleDetail}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ShuttleMap"
        component={ShuttleMap}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ShuttleStudentsList"
        component={ShuttleStudentsList}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="StudentDetail"
        component={StudentDetail}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="MessageList"
        component={MessageList}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="NotiMain3"
        component={NotiMain}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default MypageTab;
