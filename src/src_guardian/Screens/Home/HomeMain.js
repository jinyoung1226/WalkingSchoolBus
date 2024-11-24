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
import SunIcon from '../../../assets/icons/SunIcon.svg';

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
            paddingBottom: insets.bottom,
            paddingTop: insets.top,
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
                  navigation.navigate('ShuttleDetail0');
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
          <View style={{height:16}}/>
          <View style={{flexDirection:'row', borderRadius:15, borderWidth:1, borderColor:colors.Gray04, paddingVertical:16, paddingHorizontal:32, alignItems:'center'}}>
            <View style={{width:40, height:40, borderRadius:20, backgroundColor: '#FFFBF7', alignItems:'center', justifyContent:'center'}}>
              <SunIcon color={colors.Orange} width={24} height={24}/>
            </View>
            <View style={{width:16}}/>
            <Text style={[textStyles.SB3, {color:colors.Black}]}>
              등교
            </Text>
            <View style={{width:8}}/>
            <Text style={[textStyles.R2, {color:colors.Gray07}]}>
              오전 8시 20분
            </Text>
          </View>
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
