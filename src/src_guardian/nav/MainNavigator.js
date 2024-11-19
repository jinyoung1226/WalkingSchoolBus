import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeTab from '../BottomTab/HomeTab';
import ShuttleTab from '../BottomTab/ShuttleTab';
import NotificationTab from '../BottomTab/NotificationTab';
import MypageTab from '../BottomTab/MypageTab';
import HomeIcon from '../../assets/tabBarIcon/HomeIcon.svg';
import ShuttleIcon from '../../assets/tabBarIcon/ShuttleIcon.svg';
import MypageIcon from '../../assets/tabBarIcon/MypageIcon.svg';
import NotiIcon from '../../assets/tabBarIcon/NotiIcon.svg';
import CustomTabBar from '../../components/CustomTabBar';
import {colors} from '../../styles/globalStyle';
import useLocationTracking from '../hooks/location/useLocationTracking';

const Tab = createBottomTabNavigator();

const MainNavigator = () => {

  useLocationTracking((location) => {
    console.log('Publishing location:', location);
  });
  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      tabBar={props => <CustomTabBar {...props} />}>
      <Tab.Screen
        name="HomeTab"
        component={HomeTab}
        options={{
          headerShown: false,
          title: '홈',
          tabBarIcon: ({focused}) => (
            <HomeIcon color={focused ? colors.Main_Green : colors.Gray06} />
          ),
        }}
      />
      <Tab.Screen
        name="ShuttleTab"
        component={ShuttleTab}
        options={{
          headerShown: false,
          title: '운행',
          tabBarIcon: ({focused}) => (
            <ShuttleIcon color={focused ? colors.Main_Green : colors.Gray06} />
          ),
        }}
      />
      <Tab.Screen
        name="NotificationTab"
        component={NotificationTab}
        options={{
          headerShown: false,
          title: '알림',
          tabBarIcon: ({focused}) => (
            <NotiIcon color={focused ? colors.Main_Green : colors.Gray06} />
          ),
        }}
      />
      <Tab.Screen
        name="MypageTab"
        component={MypageTab}
        options={{
          headerShown: false,
          title: '마이',
          tabBarIcon: ({focused}) => (
            <MypageIcon color={focused ? colors.Main_Green : colors.Gray06} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
