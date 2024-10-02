import {Button, Text, View} from 'react-native';

const ShuttleMap = ({navigation}) => {
  return (
    <View>
      <Text>ShuttleMap</Text>
      <Button title="GoBack"
        onPress={() => {
          navigation.goBack();
        }}
      />
    </View>
  );
};

export default ShuttleMap;