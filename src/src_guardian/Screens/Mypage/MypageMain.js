import React, {useState} from 'react';
import LogOut from '../../../assets/icons/logOut.svg';
import BlueBag from '../../../assets/icons/blueBag.svg';
import NextIcon from '../../../assets/icons/NextIcon.svg';
import {View, Text, TouchableOpacity, Alert} from 'react-native';
import {textStyles, colors} from '../../../styles/globalStyle';
import ConfirmModal from '../../../components/ConfirmModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useAuthStore from '../../../store/authStore';
import EncryptedStorage from 'react-native-encrypted-storage';
import {refreshApi} from '../../../api/api';

const MypageMain = ({navigation}) => {
  const {setLogout} = useAuthStore();
  const [modalVisible, setModalVisible] = useState(false);

  // 로그아웃 함수 정의
  const logout = async () => {
    try {
      const response = await refreshApi.post('/auth/signOut');
      if (response.status === 200) {
        console.log(response.status, '로그아웃 성공');
        await AsyncStorage.removeItem('accessToken');
        await EncryptedStorage.removeItem('refreshToken');
        setLogout(false, null, null, null); // 상태 초기화
      }
    } catch (error) {
      if (error.response) {
        console.log('Error response status:', error.response.status);
        await AsyncStorage.removeItem('accessToken');
        await EncryptedStorage.removeItem('refreshToken');
        setLogout(false, null, null, null); // 상태 초기화
      } else {
        Alert.alert('서버 접속 오류');
        await AsyncStorage.removeItem('accessToken');
        await EncryptedStorage.removeItem('refreshToken');
        setLogout(false, null, null, null); // 상태 초기화
      }
    }
  };

  const handleLogoutPress = () => {
    setModalVisible(true); // 모달 표시
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.Gray01,
        justifyContent: 'center',
        paddingHorizontal: 32,
      }}>
      {/* Profile Section */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 32,
          backgroundColor: colors.White,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 16,
            backgroundColor: 'red',
          }}>
          <View>
            <Text style={[textStyles.B1, {color: colors.Black}]}>
              박지킴 님
            </Text>
          </View>
        </View>
        <View style={{padding: 8}}>
          <NextIcon onPress={() => navigation.navigate('MypageDetail')} />
        </View>
      </View>

      {/* Group Section */}
      <View style={{marginBottom: 32}}>
        <Text style={[textStyles.SB2, {color: colors.Black, marginBottom: 16}]}>
          나의 그룹
        </Text>
        <View
          style={{
            backgroundColor: colors.White,
            padding: 24,
            borderRadius: 10,
            shadowColor: colors.Black,
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}>
          <Text
            style={[textStyles.M4, {color: colors.Gray06, marginBottom: 8}]}>
            2024년 2학기
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={[textStyles.SB3, {color: colors.Black}]}>
              아주초등학교 네모 그룹
            </Text>
            <View
              style={{
                width: 60,
                height: 60,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <BlueBag />
            </View>
          </View>
        </View>
      </View>

      <View style={{gap: 16, backgroundColor: 'blue'}}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center', // 세로 정렬
            padding: 16,
            borderRadius: 8,
            backgroundColor: colors.White,
          }}
          onPress={handleLogoutPress} // 로그아웃 버튼 클릭 시 모달 표시
        >
          <LogOut width={25} height={25} style={{marginRight: 8}} />
          <Text style={[textStyles.SB2, {color: colors.Black}]}>로그아웃</Text>
        </TouchableOpacity>
      </View>

      <ConfirmModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        title="로그아웃"
        subtitle={
          <Text style={{textAlign: 'center'}}>정말 로그아웃하시나요?</Text>
        }
        cancelTitle="취소"
        confirmTitle="확인"
        icon={<LogOut width={40} height={40} />}
        isBackgroundclosable={false}
        onConfirm={async () => {
          try {
            await logout();
            setModalVisible(false);
            console.log('로그아웃 완료');
          } catch (error) {
            console.error('로그아웃 중 오류 발생:', error);
          }
        }}
      />
    </View>
  );
};

export default MypageMain;
