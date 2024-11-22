import {useEffect, useLayoutEffect, useState} from 'react';
import {Alert, Image, Linking, Text, TouchableOpacity, View} from 'react-native';
import TextLogo from '../../../assets/icons/TextLogo.svg';
import {colors, textStyles} from '../../../styles/globalStyle';
import {ScrollView} from 'react-native-gesture-handler';
import HomeComponent from '../../../components/HomeComponent';
import HomeNoticeComponent from '../../../components/HomeNoticeComponent';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AlarmParentIcon from '../../../assets/icons/AlarmParentIcon.svg';
import { authApi } from '../../../api/api';
import StudentBoy from '../../../assets/icons/StudentBoy.svg';
import HeartGreen from '../../../assets/icons/HeartGreen.svg';
import SmileIcon from '../../../assets/icons/SmileIcon.svg';
import SchoolTimeComponent from '../../../components/SchoolTimeComponent';
import MailBox from '../../../assets/icons/MailBox.svg';
import ArrowIcon from '../../../assets/icons/ArrowIcon.svg';
import useWaypoints from '../../../src_guardian/hooks/queries/useWaypoints';
import useStudents from '../../hooks/queries/useStudents';
import useParentGroupInfo from '../../hooks/queries/useParentGroupInfo';


const Homemain = ({ navigation }) => {
  const [studentsList, setStudentsList] = useState([]);

  const { data: groupInfo, isPending: groupInfoIsPending, isSuccess: groupInfoIsSuccess } = useParentGroupInfo();
  const { data: waypoints, isPending: waypointsIsPending, isSuccess: waypointsIsSuccess } = useWaypoints();
  const { data: students, isPending: studentsIsPending, isSuccess: studentsIsSuccess } = useStudents();

  const insets = useSafeAreaInsets();

  // 자녀 정보 불러오는 api (학부모 홈 화면 상단)
  useEffect(() => {
    const getStudentList = async () => {
      try {
        const response = await authApi.get('students');
        if (response.status === 200) {
          console.log(response.data,"@@@")
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

  // 자녀 이미지
  const renderImage = (imagePath, size = 80) => {
    const borderRadius = size / 2; 
    return (
      <View style={{ width: size, height: size, borderRadius: borderRadius, overflow: 'hidden'}}>
        {imagePath ? (
          <Image source={{ uri: imagePath }} style={{flex:1}} resizeMode= "cover" />
        ) : (
          <StudentBoy width={size} height={size} />
        )}
      </View>
    );
  };

  return (
    <View style={{flex:1, backgroundColor: colors.White_Green, paddingBottom:insets.bottom, paddingTop:insets.top}}>
      <View style={{flexDirection:'row', alignItems:'center'}}>
        <View style={{padding:16}}>
          <TextLogo />
        </View>
        <View style={{flex:1}}/>
        <TouchableOpacity
          onPress={() => {navigation.navigate('AlarmDetail')}}
          style={{padding:16}}>
          <AlarmParentIcon width={24} height={24} />
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View style={{paddingHorizontal:16}}>
          <View style={{height: 8}}/>
          <View style={{ padding: 32, backgroundColor: colors.White_Green, borderRadius: 10, elevation: 4, flexDirection: 'column', shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 10 }}>
            {studentsList.length > 0 && (
              <View style={{ flex: 1, flexDirection: 'row', gap: 32, alignItems:'center' }}>
                {studentsList.length === 1 ? (
                  renderImage(studentsList[0].imagePath) 
                ) : (
                  studentsList.map((student, index) => ( 
                    <View key={index} style={{marginLeft: index === 0 ? 0 : -70}}>{renderImage(student.imagePath, 70)}</View>
                  ))
                )}
                <View style={{ flexDirection: 'column', paddingTop: 4, flex: 1 }}>
                  <Text style={[textStyles.SB1, {color:colors.Black}]}>
                    {studentsList.length > 1
                      ? `${studentsList[0]?.name}, ${studentsList[1]?.name}`
                      : studentsList[0]?.name}
                  </Text>
                  <View style={{ height: 8 }} />
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap : 8 }}>
                    <SmileIcon />
                    <Text style={[textStyles.R2, {color:colors.Black}]}>
                      {studentsList.length > 1
                        ? `${studentsList[0]?.schoolName} ${studentsList[0]?.grade}학년, ${studentsList[1]?.grade}학년`
                        : `${studentsList[0]?.schoolName} ${studentsList[0]?.grade}학년`}
                    </Text>
                  </View>
                  <View style={{ height: 4 }} />
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap : 8 }}>
                    <HeartGreen />
                    <Text style={[textStyles.R2, {color:colors.Black}]}>{studentsList[0]?.groupName}</Text>
                  </View>
                </View>
              </View>
            )}
            <View style={{height:32}} />
            <View style={{ paddingHorizontal:32, paddingVertical:8, flex: 1, borderRadius: 7, backgroundColor: colors.Gray01, flexDirection:'row', alignItems:'center', gap:16 }}>
              <SchoolTimeComponent type={'before'} isSelected={true} title={'등교'}/>
              <Text style={[textStyles.R2, {color:colors.Black}]}>
                {studentsList.length > 0 && (
                  studentsList[0].waypointName
                )}
              </Text>
            </View>
          </View>
          <View style={{height: 32}} />
          <TouchableOpacity 
            onPress={() => navigation.navigate('GroupMain0', {waypoints, groupInfo, students})}
            style={{flex:1, paddingHorizontal:40, paddingVertical:20, backgroundColor:'#F0F9FF', borderRadius:10, flexDirection:'row', alignItems:'center'}}
          >
            <View style={{paddingVertical:10, flex:1}}>
              <Text style={[textStyles.SB3, {color:colors.Black}]}>아이가 결석해야 한다면?</Text>
              <View style={{ height: 4 }} />
              <View style={{flexDirection:'row', gap:8, alignItems:'center'}}>
                <Text style={[textStyles.M4, { color: colors.Gray07 }]}>결석 신청 바로가기</Text>
                <ArrowIcon color={colors.Gray07}/>
              </View>
            </View>
            <MailBox/>
          </TouchableOpacity>
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
    </View>
  );
};

export default Homemain;
