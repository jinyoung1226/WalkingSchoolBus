import {View} from 'react-native';
import WebView from 'react-native-webview';

const ShuttleMap = ({route, navigation}) => {
  const {waypoints} = route.params;
  console.log(waypoints);

  return (
    <View style={{flex: 1}}>
      <WebView
        originWhitelist={['*']}
        source={{uri: 'https://www.naver.com'}}
        style={{flex: 1}}
      />
    </View>
  );
};

export default ShuttleMap;
