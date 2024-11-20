import { useCallback, useEffect } from 'react';
import {Text, View, Button} from 'react-native';
import useTabBarStore from '../../../store/tabBarStore';
import { useFocusEffect } from '@react-navigation/native';

const GroupDetail = ({navigation}) => {

  const {showTabBar, hideTabBar} = useTabBarStore();
  // useFocusEffect(
  //   useCallback(() => {
  //     hideTabBar();
  //     return () => {
  //       showTabBar();
  //     }
  //   }, [])
  // );

  return (
    <View>
      <Button title="back" onPress={() => {navigation.goBack()}} />
      <Text>GroupDetail</Text>
    </View>
  );
};

export default GroupDetail;
