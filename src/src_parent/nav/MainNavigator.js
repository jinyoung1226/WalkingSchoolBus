import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import HomeTab from "../BottomTab/HomeTab"
import GroupTab from "../BottomTab/GroupTab"
import ShuttleTab from "../BottomTab/ShuttleTab"
import MypageTab from "../BottomTab/MypageTab"
import HomeIcon from "../../assets/tabBarIcon/HomeIcon.svg"
import GroupIcon from "../../assets/tabBarIcon/GroupIcon.svg";
import ShuttleIcon from "../../assets/tabBarIcon/ShuttleIcon.svg";
import MypageIcon from "../../assets/tabBarIcon/MypageIcon.svg";
import CustomTabBar from "../../components/CustomTabBar";

const Tab = createBottomTabNavigator();

const MainNavigator = () => {

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
            <HomeIcon color={focused ? '#23E79F' : '#8A8A8A'} />
          ),
        }}
      />
      <Tab.Screen
        name="GroupTab"
        component={GroupTab}
        options={{
          headerShown: false,
          title: '그룹',
          tabBarIcon: ({focused}) => (
            <GroupIcon color={focused ? '#23E79F' : '#8A8A8A'} />
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
            <ShuttleIcon color={focused ? '#23E79F' : '#8A8A8A'} />
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
            <MypageIcon color={focused ? '#23E79F' : '#8A8A8A'} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;