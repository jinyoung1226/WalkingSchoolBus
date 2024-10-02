import {Text, View} from 'react-native';
import useWebsocketStore from '../../../store/websocketStore';

const Homemain = () => {
  const {isConnected} = useWebsocketStore;
  return (
    <View>
      <Text>{isConnected}</Text>
    </View>
  );
};

export default Homemain;
