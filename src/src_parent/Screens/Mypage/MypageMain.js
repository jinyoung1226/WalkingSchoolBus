import React from 'react';
import {Text, View, Button, Alert} from 'react-native';
import {refreshApi} from '../../../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useAuthStore from '../../../store/authStore';
import EncryptedStorage from 'react-native-encrypted-storage';

const MypageMain = () => {
  // Zustand setLogout 액션 가져오기
  const {setLogout} = useAuthStore();

  // 로그아웃 API 호출
  const logout = async () => {
    try {
      const response = await refreshApi.post('/auth/signOut');
      if (response.status === 200) {
        console.log(response.status);
        await AsyncStorage.removeItem('accessToken');
        await EncryptedStorage.removeItem('refreshToken');
        setLogout(false, null, null, null);
      }
    } catch (error) {
      if (error.response) {
        console.log('Error response status:', error.response.status);
        await AsyncStorage.removeItem('accessToken');
        await EncryptedStorage.removeItem('refreshToken');
        setLogout(false, null, null, null);
      } else {
        Alert.alert('서버 접속 오류');
        await AsyncStorage.removeItem('accessToken');
        await EncryptedStorage.removeItem('refreshToken');
        setLogout(false, null, null, null);
      }
    }
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{fontSize: 18, marginBottom: 20}}>Mypage Main</Text>
      <Button title="로그아웃" onPress={logout} />
    </View>
  );
};

export default MypageMain;
