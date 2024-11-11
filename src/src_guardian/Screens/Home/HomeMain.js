import {useLayoutEffect} from 'react';
import {Linking, Text, View} from 'react-native';
import TextLogo from '../../../assets/icons/TextLogo.svg';
import {colors, textStyles} from '../../../styles/globalStyle';
import {ScrollView} from 'react-native-gesture-handler';
import HomeButton from '../../../components/HomeButton';
import GuardianIcon from '../../../assets/icons/GuardianIcon.svg';
import HomeComponent from '../../../components/HomeComponent';
import HomeNoticeComponent from '../../../components/HomeNoticeComponent';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Homemain = ({navigation}) => {

  const insets = useSafeAreaInsets();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerBackground: () => (
        <View
          style={{
            justifyContent: 'center',
            flex: 1,
            paddingHorizontal: 32,
            backgroundColor: colors.White_Green,
          }}>
          <TextLogo />
        </View>
      ),
    });
  }, [navigation]);

  return (
    <ScrollView style={{backgroundColor: colors.White_Green}}>
      <View style={{paddingHorizontal:16}}>
        <View style={{height: 8}}/>
        <View style={{padding:32, backgroundColor: colors.White_Green, borderRadius: 10, elevation:4, flexDirection:'row', alignItems:'center', shadowColor: "#000",shadowOffset: { width: 0, height: 1 },shadowOpacity: 0.05, shadowRadius: 10}}>
          <View>
            <Text style={[textStyles.SB2, {color: '#4B4A4A'}]}>
              {'오늘도 안전한 등교\n지켜주셔서 감사합니다'}
            </Text>
            <View style={{height: 16}} />
            <View style={{flexDirection: 'row'}}>
              <HomeButton
                title="출근하러 가기"
                onPress={() => {
                  Linking.openURL('donghang://shuttle/shuttleDetail');
                }}
              />
              <View style={{flex: 1}} />
            </View>
          </View>
          <View style={{flex: 1}} />
          <GuardianIcon />
        </View>
        <View style={{height: 32}} />
        <HomeComponent
          title={'🚥 오늘의 운행 스케줄'}
          onPress={() => {
            navigation.navigate('HomeSchedule');
          }}>
          <View style={{height: 100}} />
        </HomeComponent>
        <View style={{height: 32}} />
        <HomeComponent
          title={'📌 그룹 공지'}
          onPress={() => {
            navigation.navigate('GroupNotice');
          }}>
          <HomeNoticeComponent></HomeNoticeComponent>
        </HomeComponent>
        <View style={{height: 32}} />
      </View>
    </ScrollView>
  );
};

export default Homemain;
