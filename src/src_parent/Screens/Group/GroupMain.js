import { useCallback, useEffect } from 'react';
import {Text, View, Button} from 'react-native';
import useTabBarStore from '../../../store/tabBarStore';
import { useFocusEffect } from '@react-navigation/native';

const GroupMain = ({navigation}) => {

  return (
    <View>
      <Button title="back" onPress={() => {navigation.goBack()}} />
      <Text>Group Main</Text>
    </View>
  );
};

export default GroupMain;
