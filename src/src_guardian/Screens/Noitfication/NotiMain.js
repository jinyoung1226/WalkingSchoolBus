import React from 'react';
import {View, Text, TouchableOpacity, Button} from 'react-native';

const NotiMain = ({navigation}) => {
  return (
    <View>
      <Button title="Go Back" onPress={() => navigation.goBack()} /> 
      <Text>NotiMain</Text>
    </View>
  );
};

export default NotiMain;