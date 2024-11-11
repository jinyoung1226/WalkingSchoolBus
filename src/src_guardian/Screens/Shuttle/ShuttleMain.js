import { useEffect } from 'react';
import {Button, Text, View} from 'react-native';
import CustomButton from '../../../components/CustomButton';
import { colors } from '../../../styles/globalStyle';

const ShuttleMain = ({navigation}) => {

  useEffect(() => {
    navigation.navigate('ShuttleDetail');
  }, []);

  return (
    <View style={{flex:1, backgroundColor:colors.White_Green, padding:16, justifyContent:'center'}}> 
      <CustomButton
        title="운행 화면으로 돌아가기"
        onPress={() => {
          navigation.navigate('ShuttleDetail');
        }}
      />
    </View>
  );
};

export default ShuttleMain;
