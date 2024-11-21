import { useEffect, useRef, useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import WebView from 'react-native-webview';
import CustomHeader from '../../../components/CustomHeader';
import { colors, textStyles } from '../../../styles/globalStyle';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useWebsocketStore from '../../../store/websocketStore';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import GuardianWoman from '../../../assets/icons/GuardianWoman.svg';
import StudentBoy from '../../../assets/icons/StudentBoy.svg';
import MyLocationIcon from '../../../assets/icons/MyLocationIcon.svg';
const ShuttleMain = ({navigation, route}) => {

  const { groupInfo, waypoints, students } = route.params;

  const insets = useSafeAreaInsets();
  const webviewRef = useRef(null);
  const [sheetIndex, setSheetIndex] = useState(0);

  const { subscribeToLocationChannel, unsubscribeToLocationChannel } = useWebsocketStore();

  const extractedWaypoints = (waypoints || []).map(waypoint => ({
    waypointName: waypoint.waypointName,
    latitude: waypoint.latitude,
    longitude: waypoint.longitude,
  }));

  useEffect(() => {
    const channel = `/sub/group/${groupInfo.id}/location`;
    const callback = (message) => {
      const newMessage = JSON.parse(message.body);
      console.log(newMessage, '@@@@@@@@@@');
      const { latitude, longitude } = newMessage;
      const newLocation = { latitude, longitude };
        if (webviewRef.current) {
          webviewRef.current.postMessage(JSON.stringify(newLocation));
        }
    }
    subscribeToLocationChannel({ channel, callback });
    return () => {
      unsubscribeToLocationChannel();
    };
  }, []);

  // 버튼 클릭 시, 자기 위치(인솔자 현 위치)로 지도의 중심이 이동되도록 Webview로 메시지 전송
  const handleCenterOnGuide = () => {
    if (webviewRef.current) {
      webviewRef.current.postMessage(JSON.stringify({action : 'centerMapOnGuide'}));
    }
  }

  const url = `https://donghang-map.vercel.app?waypoints=${encodeURIComponent(
    JSON.stringify(extractedWaypoints),
  )}&initialLocation=${encodeURIComponent(JSON.stringify(extractedWaypoints[0]))}`;

  const bottomSheetRef = useRef(null);

  // callbacks
  const handleSheetChanges = useCallback((index) => {
    setSheetIndex(index);
  }, []);

  const snapPoints = useMemo(() => [69, 250, 400], []);
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.White_Green, paddingBottom: insets.bottom, paddingTop: insets.top }}>
      <CustomHeader title="운행" />
      <View style={{ flex: 1 }}>
        <WebView
          ref={webviewRef}
          originWhitelist={['*']}
          javaScriptEnabled={true}
          source={{ uri: url }}
          style={{ flex: 1 }}
        />
      </View>
      <BottomSheet
        ref={bottomSheetRef}
        onChange={handleSheetChanges}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        backgroundStyle={{borderRadius: 40}}
        handleComponent={() => 
        <View style={{height:69, alignItems:'center', justifyContent:'center'}}>
          <TouchableOpacity style={{position: 'absolute', bottom: 92, right:32}} 
          onPress={handleCenterOnGuide} 
          >
            <MyLocationIcon/>
          </TouchableOpacity>
          <View style={{height:5, width:50, backgroundColor:colors.Gray03, borderRadius:5}}/>
        </View>
        }
      >
        <BottomSheetView style={{flex:1, paddingHorizontal:32}}>
          <View style={{flexDirection:'row'}}>
            <View style={{backgroundColor:colors.BG_Green, paddingHorizontal:16, paddingVertical:6, borderRadius:7}}>
              <Text style={[textStyles.B2, {color:colors.Light_Green}]}>대기 중이에요!</Text>
            </View>
          </View>
          <View style={{height:16}}/>
          <View style={{gap:32}}>
            {students.length === 1 ? (
              <View style={{flexDirection:'row', gap:16}}>
                <View style={{width:70, height:70, borderRadius:35, backgroundColor:colors.Gray03, overflow:'hidden'}}>
                  {students[0].imagePath == null ?
                  <StudentBoy width={70} height={70}/>
                  :
                  <Image src={students[0].imagePath} style={{flex:1}}/>}
                </View>
                <View style={{gap:8, justifyContent:'center'}}>
                  <Text style={[textStyles.M4, {color:colors.Black}]}>{students[0].schoolName}</Text>
                  <Text style={[textStyles.B1, {color:colors.Black}]}>{students[0].name}</Text>
                </View>
              </View>
            ) : (
              <View style={{flexDirection:'row', gap:16}}>
                <View style={{flexDirection:'row', }}>
                {students.map((student, index) => (
                  <View 
                    key={index}
                    style={{width:60, height:60, borderRadius:35, backgroundColor:colors.Gray03, overflow:'hidden',  marginLeft: index === 0 ? 0 : -25,}}
                  >
                    <Image src={student.imagePath} style={{flex:1}}/>
                  </View>
                ))}
                </View>
                <View style={{gap:8, justifyContent:'center'}}>
                  <Text style={[textStyles.M4, {color:colors.Black}]}>{students[0].schoolName}</Text>
                  <View style={{flexWrap:'wrap', flexDirection:'row'}}>
                {students.map((student, index) => (
                  <Text key={index} style={[textStyles.B1, {color:colors.Black}]}>{student.name}{index < students.length - 1 && ', '}</Text>
                ))}
                </View>
                  
                </View>
              </View>
            )}
            <View style={{height:2, backgroundColor:colors.Gray02}}/>
            {sheetIndex === 2 &&
            <View style={{flexDirection:'row', gap:16}}>
              <GuardianWoman/>
              <View style={{gap:8, justifyContent:'center'}}>
                <Text style={[textStyles.SB3, {color:colors.Black}]}>{groupInfo.groupName}</Text>
                <View style={{flexWrap:'wrap', flexDirection:'row'}}>
                {waypoints.map((waypoint, index) => (
                  <Text key={index} style={[textStyles.R2, {color:colors.Black}]}>{waypoint.waypointName}{index < waypoints.length - 1 && ' - '}</Text>
                ))}
                </View>
              </View>
            </View>}
          </View>
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};
export default ShuttleMain;
