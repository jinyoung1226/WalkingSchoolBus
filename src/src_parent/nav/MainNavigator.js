import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeTab from '../BottomTab/HomeTab';
import MypageTab from '../BottomTab/MypageTab';
import HomeIcon from '../../assets/tabBarIcon/HomeIcon.svg';
import GroupIcon from '../../assets/tabBarIcon/GroupIcon.svg';
import ShuttleIcon from '../../assets/tabBarIcon/ShuttleIcon.svg';
import MypageIcon from '../../assets/tabBarIcon/MypageIcon.svg';
import CustomTabBar from '../../components/CustomTabBar';
import {colors, textStyles} from '../../styles/globalStyle';
import useParentGroupInfo from '../hooks/queries/useParentGroupInfo';
import useWaypoints from '../../src_guardian/hooks/queries/useWaypoints';
import useStudents from '../hooks/queries/useStudents';
import useShuttleStatus from '../hooks/queries/useShuttleStatus';
import { getParentShuttleStatus } from '../../api/shuttleApi';
import { Alert, Text, View } from 'react-native';
import SingleActionModal from '../../components/SingleActionModal';
import { useState } from 'react';
import { useModalStore } from '../../store/modalStore';
import SleepFaceIcon from '../../assets/icons/SleepFaceIcon.svg';
import CustomButton from '../../components/CustomButton';
const Tab = createBottomTabNavigator();
const GroupTab = () => null;
const ShuttleTab = () => null;
const MainNavigator = () => {

  const { data: groupInfo, isPending: groupInfoIsPending, isSuccess: groupInfoIsSuccess } = useParentGroupInfo();
  const { data: waypoints, isPending: waypointsIsPending, isSuccess: waypointsIsSuccess } = useWaypoints();
  const { data: students, isPending: studentsIsPending, isSuccess: studentsIsSuccess } = useStudents();
  
  const { showModal, hideModal } = useModalStore();

  const handleShowModal = () => {
    showModal(
      <View>
        <View style={{alignItems: 'center'}}>
          <SleepFaceIcon/>
        </View>
        <View style={{height: 24}} />
        <Text
          style={[
            textStyles.SB1,
            {color: colors.Black, textAlign: 'center'},
          ]}>
          {'지금은 워킹스쿨버스 운행\n시간이 아니에요!'}
        </Text>
        <View style={{height: 24}} />
        <CustomButton
          title={'확인'}
          onPress={hideModal}
          type="confirm"
          textStyle={[textStyles.SB1]}
        />
      </View>
    );
  };
  
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
            navigation.navigate(`GroupMain${navigation.getState().index}`, {groupInfo: groupInfo, waypoints: waypoints, students: students})
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
            getParentShuttleStatus().then((res) => {
              if (res.isGuideActive === true) {
                navigation.navigate(`ShuttleMain${navigation.getState().index}`, {waypoints: waypoints, groupInfo: groupInfo, students: students})
              } else {
                handleShowModal();
              }
            })
            
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
