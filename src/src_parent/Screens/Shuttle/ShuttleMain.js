import { useEffect } from 'react';
import {Button, Text, View} from 'react-native';

const ShuttleMain = ({navigation}) => {

  useEffect(() => {
    navigation.navigate('ShuttleDetail');
  }, []);

  return (
    <View>
      <Text>Shuttle Main</Text>
      <Button title="운행 화면으로 돌아가기"
        onPress={() => {
          navigation.navigate('ShuttleDetail');
        }}
      />
    </View>
  );
};

export default ShuttleMain;
