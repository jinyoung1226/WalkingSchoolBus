import {Button, Text, View} from 'react-native';

const ShuttleDetail = ({navigation}) => {
  return (
    <View>
      <Text>ShuttleDetail</Text>
      <Button title="GoBack"
        onPress={() => {
          navigation.goBack();
        }}
      />
    </View>
  );
};

export default ShuttleDetail;
