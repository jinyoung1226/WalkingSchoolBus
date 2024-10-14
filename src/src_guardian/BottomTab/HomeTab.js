import React, {useLayoutEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HomeMain from '../Screens/Home/HomeMain';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import useTabBarStore from '../../store/tabBarStore';
import HomeSchedule from '../Screens/Home/HomeSchedule';
import GroupNotice from '../Screens/Home/GroupNotice';
import BackIcon from '../../assets/icons/BackIcon.svg';
import CreateNotice from '../Screens/Home/CreateNotice';
import { colors, textStyles } from '../../styles/globalStyle';
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
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign:'center', 
        headerTitleStyle: [textStyles.B1, {color:colors.Black}],
        headerBackImage: () => (
          <BackIcon width={24} height={24} /> // 사용자 정의 아이콘
        ),
      }}>
      <Stack.Screen name="HomeMain" component={HomeMain} />
      <Stack.Screen name="HomeSchedule" component={HomeSchedule} options={{title: '스케줄'}}/>
      <Stack.Screen name="GroupNotice" component={GroupNotice} options={{headerShown: false}}/>
      <Stack.Screen name="CreateNotice" component={CreateNotice} options={{title: '공지글 쓰기'}}/>
    </Stack.Navigator>
  );
};

export default HomeTab;
