import {useEffect, useLayoutEffect, useState} from 'react';
import {Alert, Linking, Text, View} from 'react-native';
import TextLogo from '../../../assets/icons/TextLogo.svg';
import {colors, textStyles} from '../../../styles/globalStyle';
import {ScrollView} from 'react-native-gesture-handler';
import HomeButton from '../../../components/HomeButton';
import GuardianIcon from '../../../assets/icons/GuardianIcon.svg';
import HomeComponent from '../../../components/HomeComponent';
import HomeNoticeComponent from '../../../components/HomeNoticeComponent';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AlarmParentIcon from '../../../assets/icons/AlarmParentIcon.svg';
import { Image } from 'react-native-svg';
import { authApi } from '../../../api/api';

const Homemain = ({ navigation }) => {
  const [studentsList, setStudentsList] = useState([]);

  const insets = useSafeAreaInsets();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerBackground: () => (
        <View
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems:'flex-start',
            flex: 1,
            paddingHorizontal: 32,
            backgroundColor: colors.White_Green,
            paddingBottom: insets.bottom,
            paddingTop: insets.top,
          }}>
          <TextLogo />
          <AlarmParentIcon width={24} height={24} />
        </View>
      ),
    });
  }, [navigation]);

  // 자녀 정보 불러오는 api (학부모 홈 화면 상단)
  useEffect(() => {
    const getStudentList = async () => {
      try {
        const response = await authApi.get('students');
        if (response.status === 200) {
          console.log(response.data,"@@@@")
          setStudentsList(response.data);
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 400) {
            Alert.alert('자녀 정보를 불러올 수 없습니다.');
          }
        } else {
          console.log(error);
          Alert.alert('서버와의 통신 실패');
        }
      }
    };
    getStudentList();
  }, []);

  return (
    <ScrollView style={{backgroundColor: colors.White_Green}}>
      <View style={{paddingHorizontal:16}}>
        <View style={{height: 8}}/>
        <View style={{ padding: 32, backgroundColor: colors.White_Green, borderRadius: 10, elevation: 4, flexDirection: 'row', alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 10 }}>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <Image
              source={{ uri: 'ㅠㅍ  ' }}
              style={{ width: 80, height: 80 }}
              resizeMode="cover"
            />
            <View style={{flexDirection:'column'}}>
              {/* <Text> {studentsList[0].name} </Text>
              <Text> {`${studentsList[0].schoolName} ${studentsList[0].grade}학년`} </Text>
              <Text> {studentsList[0].groupName }</Text> */}
            </View>
          </View>
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
