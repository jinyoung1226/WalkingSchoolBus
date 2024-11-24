import React, {useState, useCallback} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import LogOut from '../../../assets/icons/logOut.svg';
import NextIcon from '../../../assets/icons/NextIcon.svg';
import Parents from '../../../assets/icons/Parents.svg';
import ConfirmModal from '../../../components/ConfirmModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';
import useAuthStore from '../../../store/authStore';
import useStudentStore from '../../../store/mypageStudentStore';
import {getParentsInfo, getStudentInfo} from '../../../api/mypageApi';
import Student from '../../../assets/icons/Student.svg';
import {colors, textStyles} from '../../../styles/globalStyle';
import { refreshApi } from '../../../api/api';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useStudents from '../../hooks/queries/useStudents';
import useParentsInfo from '../../hooks/queries/useParentsInfo';

const MypageMain = ({navigation}) => {
  const {setLogout} = useAuthStore();
  const [modalVisible, setModalVisible] = useState(false);

  const insets = useSafeAreaInsets();

  const { data: parentsInfo = {}, isPending: parentsInfoIsPending, isSuccess: parentsInfoIsSuccess } = useParentsInfo();
  const logout = async () => {
    try {
      const response = await refreshApi.post('/auth/signOut');
      if (response.status === 200) {
        console.log('로그아웃 성공');
      }
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
    } finally {
      await AsyncStorage.removeItem('accessToken');
      await EncryptedStorage.removeItem('refreshToken');
      setLogout(false, null, null, null);
    }
  };

  const handleLogoutPress = () => setModalVisible(true);

  const StudentCard = ({student}) => (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}
      onPress={() => {
        // setSelectedStudentId(student.studentId); // Zustand에 studentId 저장
        navigation.navigate('MypageStudentDetail', {student: student}); // 상세 페이지로 이동
      }}
      >
      <View style={{flex:1, flexDirection: 'row', alignItems: 'center'}}>
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            overflow: 'hidden',
          }}>
          {student.imagePath ? (
            <Image
              source={{uri: student.imagePath}}
              style={{
                flex: 1,
              }}
              resizeMode="cover"
            />
          ) : (
            <Student width={50} height={50} />
          )}
        </View>
        <View style={{width: 32}} />
        <View style={{flex:1}}>
          <Text
            style={[textStyles.SB3, {color: colors.Black, marginBottom: 4}]}>
            {student.name}
          </Text>
          <Text style={[textStyles.R2, {color: colors.Gray06}]}>
            {student.schoolName} {student.grade}학년
          </Text>
        </View>
      </View>
      <View>
        <NextIcon/>
      </View>
    </TouchableOpacity>
  );

  return (
    parentsInfoIsSuccess &&
      <View style={{flex: 1, backgroundColor: colors.White_Green, paddingBottom: insets.bottom, paddingTop: insets.top}}>
      {/* 상단 섹션 */}
      <TouchableOpacity
        style={{
          margin:32,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 32,
        }}
        onPress={() => navigation.navigate('MypageDetail', {parentsInfo: parentsInfo})}
      >
        <Parents width={70} height={70} />
        <View style={{flex:1, gap:4}}>
          <Text style={[textStyles.SB1, {color: colors.Black}]}>
            {parentsInfo.name} 님
          </Text>
          <View style={{flexDirection: 'row'}}>
          {parentsInfo.students.map((student, index) => (
            <Text key={index} style={[textStyles.R2, {color: colors.Gray06}]}>
              {student.name}{index === parentsInfo.students.length - 1 ? ' ' : ', '}
            </Text>
          ))}
          <Text style={[textStyles.R2, {color: colors.Gray06}]}>
            어머니
          </Text>
          </View>
        </View>
        <NextIcon />
      </TouchableOpacity>

      {/* 그룹 섹션 */}
      <View style={{marginBottom: 32, paddingHorizontal: 32}}>
        <Text style={[textStyles.SB1, {color: colors.Black}]}>나의 자녀</Text>
        <View style={{height: 16}} />
        <View
          style={{
            backgroundColor: '#ffffff',
            paddingVertical: 24,
            paddingHorizontal: 32,
            borderRadius: 10,
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
            gap: 24,
          }}>
          {parentsInfo.students.map((student, index) => (
            <StudentCard key={index} student={student} />
          ))}
        </View>
      </View>

      <View
        style={{
          width: '100%',
          height: 8,
          backgroundColor: '#f7f7f7',
        }}
      />
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 32,
          marginTop: 24,
        }}
        onPress={handleLogoutPress}>
        <LogOut width={25} height={25} style={{marginRight: 8}} />
        <Text style={[textStyles.M2, {color: colors.Black}]}>로그아웃</Text>
      </TouchableOpacity>

      <ConfirmModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        title="로그아웃"
        subtitle={
          <Text
            style={[
              textStyles.R1,
              {color: colors.Gray05, textAlign: 'center'},
            ]}>
            정말 로그아웃하시나요?
          </Text>
        }
        cancelTitle={'취소'}
        onCancel={() => setModalVisible(false)}
        confirmTitle="확인"
        icon={<LogOut width={40} height={40} />}
        isBackgroundclosable={false}
        onConfirm={async () => {
          await logout();
          setModalVisible(false);
        }}
      />
    </View>
  );
};

export default MypageMain;
