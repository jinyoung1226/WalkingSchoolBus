import { Button, Text, View } from "react-native";

const Homemain = ({navigation}) => {
    return (
        <View>
            <Text>Home Main</Text>
            <Button title="GoDetail" onPress={() => { navigation.navigate('HomeDetail') }} />
        </View>
    );
}

export default Homemain;