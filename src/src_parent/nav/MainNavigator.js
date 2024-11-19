import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeTab from '../BottomTab/HomeTab';
import MypageTab from '../BottomTab/MypageTab';
import HomeIcon from '../../assets/tabBarIcon/HomeIcon.svg';
import GroupIcon from '../../assets/tabBarIcon/GroupIcon.svg';
import ShuttleIcon from '../../assets/tabBarIcon/ShuttleIcon.svg';
import MypageIcon from '../../assets/tabBarIcon/MypageIcon.svg';
import CustomTabBar from '../../components/CustomTabBar';
import {colors} from '../../styles/globalStyle';
import useParentGroupInfo from '../hooks/queries/useParentGroupInfo';
import useWaypoints from '../../src_guardian/hooks/queries/useWaypoints';

const Tab = createBottomTabNavigator();
const GroupTab = () => null;
const ShuttleTab = () => null;
const MainNavigator = () => {

  const { data: groupInfo, isPending: groupInfoIsPending, isSuccess: groupInfoIsSuccess } = useParentGroupInfo();
  const { data: waypoints, isPending: waypointsIsPending, isSuccess: waypointsIsSuccess } = useWaypoints();
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
            <HomeIcon color={focused ? colors.Main_Green : colors.Gray05} />
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
            <GroupIcon color={focused ? colors.Main_Green : colors.Gray05} />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate(`GroupMain${navigation.getState().index}`)
          },
        })}
      />
      <Tab.Screen
        name="ShuttleTab"
        component={ShuttleTab}
        options={{
          headerShown: false,
          title: '운행',
          tabBarIcon: ({focused}) => (
            <ShuttleIcon color={focused ? colors.Main_Green : colors.Gray05} />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate(`ShuttleMain${navigation.getState().index}`, {waypoints: waypoints, groupInfo: groupInfo})
          },
        })}
      />
      <Tab.Screen
        name="MypageTab"
        component={MypageTab}
        options={{
          headerShown: false,
          title: '마이',
          tabBarIcon: ({focused}) => (
            <MypageIcon color={focused ? colors.Main_Green : colors.Gray05} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
