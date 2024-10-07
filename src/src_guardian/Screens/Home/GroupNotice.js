import { Button, Text, View } from "react-native";

const GroupNotice = ({navigation}) => {
  return (
    <View>
      <Button title="공지글 쓰기" onPress={() => navigation.navigate('CreateNotice')} />
      <Text>GroupNotice</Text>
    </View>
  );
}

export default GroupNotice;