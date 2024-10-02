import React, {useLayoutEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ShuttleMain from '../Screens/Shuttle/ShuttleMain';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import useTabBarStore from '../../store/tabBarStore';
import ShuttleDetail from '../Screens/Shuttle/ShuttleDetail';
import {colors, textStyles} from '../../styles/globalStyle';
import {Text, TouchableOpacity, View} from 'react-native';
import BackIcon from '../../assets/icons/BackIcon.svg';
import MapIcon from '../../assets/icons/MapIcon.svg';

const Stack = createStackNavigator();

const ShuttleTab = ({route, navigation}) => {
  // Zustand 스토어에서 showTabBar, hideTabBar 함수 가져오기
  const {showTabBar, hideTabBar} = useTabBarStore();

  // Stack이 쌓이기 전에 Main 이외의 화면은 Tab이 안 보이게 설정
  useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    console.log(routeName);
    if (routeName === 'ShuttleMain') {
      showTabBar();
    } else {
      hideTabBar();
    }
  }, [route]);

  return (
    <Stack.Navigator>
      <Stack.Screen name="ShuttleMain" component={ShuttleMain} />
      <Stack.Screen
        name="ShuttleDetail"
        component={ShuttleDetail}
        options={{
          header: () => (
            <View style={{ paddingHorizontal: 16, height: 116, backgroundColor: 'white'}}>
              <View style={{ flex:1, flexDirection: 'row', alignItems:'flex-start', justifyContent:'space-between', paddingTop:60 }}>
                <TouchableOpacity onPress={() => navigation.navigate('ShuttleMain')}>
                  <BackIcon />
                </TouchableOpacity>
                <View style={{ alignItems: 'center' , gap: 4 }}>
                  <Text style={[textStyles.B1, { color: colors.Black }]}> 아주초등학교 </Text>
                  <Text style={[textStyles.B2, { color: colors.Black }]}> 네모 그룹 </Text>
                </View>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <MapIcon />
                </TouchableOpacity>
              </View>
            </View>
          ),
        }}
      />
      
    </Stack.Navigator>
  );
};

export default ShuttleTab;
