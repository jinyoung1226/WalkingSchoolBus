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
import {getParentsInfo, getStudentInfo} from '../../../api/mypageApi';
import Student from '../../../assets/icons/Student.svg';

const MypageMain = ({navigation}) => {
  const {setLogout} = useAuthStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [userName, setUserName] = useState('');
  const [students, setStudents] = useState([]);

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

  const fetchParentsInfo = async () => {
    try {
      const parentsInfo = await getParentsInfo();
      setUserName(parentsInfo.name);
    } catch (error) {
      console.error('Parents 정보 가져오기 오류:', error);
    }
  };

  const fetchStudentInfo = async () => {
    try {
      const data = await getStudentInfo();
      const formattedData = data.map(student => ({
        name: student.name,
        imagePath: student.imagePath || null,
        schoolName: student.schoolName,
        grade: student.grade,
      }));
      setStudents(formattedData);
    } catch (error) {
      console.error('Student 정보 가져오기 오류:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchParentsInfo();
      fetchStudentInfo();
    }, []),
  );

  const handleLogoutPress = () => setModalVisible(true);

  const StudentCard = ({student}) => (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        marginLeft: 16,
      }}>
      <View
        style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f0f0f0',
          overflow: 'hidden',
        }}>
        {student.imagePath ? (
          <Image
            source={{uri: student.imagePath}}
            style={{
              width: 50,
              height: 50,
            }}
            resizeMode="cover" // 이미지를 부모 영역에 꽉 차게 조정
          />
        ) : (
          <Student width={50} height={50} />
        )}
      </View>
      <View style={{marginLeft: 32}}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: '600',
            color: '#000',
            marginBottom: 4,
          }}>
          {student.name}
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: '#8a8a8a',
          }}>
          {student.schoolName} {student.grade}학년
        </Text>
      </View>
    </View>
  );

  return (
    <View style={{flex: 1, backgroundColor: '#ffffff'}}>
      {/* 상단 섹션 */}
      <View
        style={{
          marginBottom: 32,
          marginTop: 24,
          paddingHorizontal: 32,
          height: 70,
          backgroundColor: '#ffffff',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Parents width={70} height={70} style={{marginRight: 32}} />
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: '#000',
            }}>
            {userName} 님
          </Text>
          <TouchableOpacity
            style={{
              position: 'absolute',
              right: 0,
              padding: 8,
            }}
            onPress={() => navigation.navigate('MypageDetail')}>
            <NextIcon />
          </TouchableOpacity>
        </View>
      </View>

      {/* 그룹 섹션 */}
      <View style={{marginBottom: 32, paddingHorizontal: 32}}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: 'bold',
            color: '#000',
            marginBottom: 16,
          }}>
          나의 자녀
        </Text>
        <View
          style={{
            backgroundColor: '#ffffff',
            padding: 24,
            borderRadius: 10,
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}>
          {students.map((student, index) => (
            <StudentCard key={index} student={student} />
          ))}
        </View>
      </View>

      {/* 로그아웃 */}
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
          marginTop: 16,
        }}
        onPress={handleLogoutPress}>
        <LogOut width={25} height={25} style={{marginRight: 8}} />
        <Text
          style={{
            fontSize: 16,
            fontWeight: 'bold',
            color: '#000',
          }}>
          로그아웃
        </Text>
      </TouchableOpacity>

      <ConfirmModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        title="로그아웃"
        subtitle={
          <Text
            style={{
              textAlign: 'center',
              fontSize: 14,
              color: '#000',
            }}>
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
